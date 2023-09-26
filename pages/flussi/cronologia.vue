<template>
    <div>
      <h2><i class="el-icon-tickets"></i> Cronologia Flussi</h2>
      <el-divider></el-divider>
      <el-alert v-if="showWarning == 'in lavorazione'" type="warning" description="Al momento è gia in elaborazione un flusso, attendi la fine per inizarne uno nuovo" show-icon :closable="false">
        <span slot="title">
          <span class="el-alert__title is-bold">Flusso in elaborazione</span>
          <span style="position: absolute; right: 0px; padding-right:10px">
            <span @click="handleUpdateClick" style="color:#409EFF" class="is-bold is-link">Aggiorna</span>
          </span>
        </span>
      </el-alert>
      <el-alert v-else title="Nessun flusso in lavorazione al momento" type="success" description="Recati nella schermata apposita per creare un nuovo flusso" show-icon :closable="false">
        <span slot="title">
          <span class="el-alert__title is-bold">Nessun flusso in lavorazione al momento</span>
          <span style="position: absolute; right: 0px; padding-right:10px" @click="fetchStatusContent">
            <span @click="handleUpdateClick" style="color:#409EFF" class="is-bold is-link">Aggiorna</span>
          </span>
        </span>
      </el-alert>
      <el-divider></el-divider>
      <el-table :data="files" :row-class-name="tableRowClassName" style="width: 100%">
        <el-table-column prop="flow_type" label="Flusso" align="center">
          <template slot-scope="scope">
            <p style="font-weight:bold">{{ scope.row.code.toUpperCase() }} </p>
            <p style="font-style:italic; text-transform:capitalize">Flusso {{ scope.row.flow_type }} </p>
            <p style="font-style:italic">{{ scope.row.flow_limit == 0 ? "Tutte le fatture" : `Solo ${scope.row.flow_limit} fatture/a` }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="tenants" label="Aziende" align="center">
          <template slot-scope="scope" v-if="scope.row.details.length > 0">
            <p style="margin:0px;font-size:12px" v-for="(azienda, i) in scope.row.details" :key="i">
              <img :src="`/loghi/${azienda.tenant_code}/logo.png`" style="max-height:40px" />
            </p>
          </template>
        </el-table-column>
        <el-table-column width="280" prop="files" label="File caricati" align="center">
          <template slot-scope="scope" v-if="scope.row.files.length > 0">
            <p style="margin:0px;font-size:12px" v-for="file in scope.row.files" :key="file.id">
              {{ file.file_name }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Stato Flusso" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.logs_in_error" style="color:red" class="el-icon-warning"></i>
            <i v-if="scope.row.status == 'completato' && !scope.row.logs_in_error" class="el-icon-circle-check"></i>
            <i v-if="scope.row.status == 'in lavorazione'" class="el-icon-warning"></i>
            <i v-if="scope.row.status == 'in errore'" class="el-icon-error"></i>
          </template>
        </el-table-column>
        <el-table-column prop="start_date" label="Durata" align="center">
          <template slot-scope="scope">
            <p style="margin:0px;font-size:12px">
              <b>Inizio:</b> {{ scope.row.start_date }}
            </p>
            <p style="margin:0px;font-size:12px">
              <b>Fine:</b> {{ scope.row.end_date }}
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Creatore">
          <template slot-scope="scope">
            <div class="tooltip">
              <el-tag>{{ scope.row.owner }}</el-tag>
              <span v-if="permissions.includes('admin') && scope.row.owner_ip" class="tooltiptext">{{ scope.row.owner_ip }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="scope">
            <el-input
              clearable
              v-model="filters.search"
              size="mini"
              placeholder="codice / societa / nome file"
              @input="doSearch"/>
          </template>
          <template slot-scope="scope">
            <el-button size="mini" @click="$router.push('/flussi/' + scope.row.code)">Dettagli Avanzati</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" :current-page.sync="filters.page" :page-size="filters.perPage" :total="filters.total" @current-change="setPage"> </el-pagination>
    </div>
</template>

<script>
export default {
  name: "flussi-cronologia",
  computed: {
    permissions() {
      return this.$store.getters["authPermissions"];
    },
  },
  data: () => {
    return {
      searchTimeout: null,

      filters: {
        page: 1,
        perPage: 8,
        sortBy: "created_at",
        order: "desc",
        search: "",
        total: 1,
      },
      files: [],
      logs: [],
      dialogLogVisible: false,
      dialogTableVisible: false,
      tempTable: [],
      showWarning: "completato",
    };
  },
  methods: {
    async doSearch(searchText) {
      if (searchText.length > 0 && searchText.length <= 2) return
      if (searchText.length == 0) {
        this.searchTimeout = null
        this.filters.page = 1
        await this.fetchFolderContent(1)
      } else {
        if (!this.searchTimeout) {
          this.searchTimeout = setTimeout(async () => {
            this.filters.page = 1
            await this.fetchFolderContent(1)
            this.searchTimeout = null
          }, 250)
        }
      }
    },
    handleUpdateClick() {
      const loading = this.$loading({
        lock: true,
        text: "Stiamo Aggiornando le risorse",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      setTimeout(async () => {
        this.path = this.$route.query.path || "/";
        await this.fetchFolderContent(this.path);
        await this.fetchStatusContent();
        loading.close();
      }, 1000);
    },
    setPage(val) {
      this.filters.page = val;
      this.fetchFolderContent();
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status == "completato") {
        return "success-row";
      } else if (row.status == "in lavorazione") {
        return "warning-row";
      } else if (row.status == "in errore") {
        return "error-row";
      }
      return "";
    },
    handleShowDetail(scope, row) {
      this.tempTable = row;
      this.dialogTableVisible = true;
    },
    handleShowLogs(scope, row) {
      this.logs = row.logs;
      this.dialogLogVisible = true;
    },
    getTag(item) {
      if (item.type === "info") {
        if (item.text.includes("Inizio Master")) return "INIZIA GENERAZIONE";
        else if (item.text.includes("Fine Procedurale")) return "FINE GENERAZIONE";
        else if (item.text.includes("estrazione File")) return "ESTRAZIONE ZIP";
        else if (item.text.includes("lettura XML")) return "LETTURA XML";
        else if (item.text.includes("Elementi Da Processare")) return "TOTALE ELEMENTI";
        else if (item.text.includes("Salvataggio ZIP Stampatore")) return "SALVATAGGIO ZIP PER STAMPATORE";
        else if (item.text.includes("Processo file") || item.text.includes("CHILD PROCESS ID")) return "PROCESSI FIGLI STAMPA";
        else if (item.text.includes("Inizio il File") || item.text.includes("Fine il file")) return "FILE XML";
        else if (item.text.includes("Salvataggio Terranova")) return "SALVATAGGIO ZIP PER TERRANOVA";
      } else if (item.type === "error") return "ERRORE";
      return "background-color:black";
    },
    getColor(item) {
      if (item.type === "info") {
        if (item.text.includes("Inizio Master") || item.text.includes("Fine Procedurale")) return "background-color:blue";
        else if (item.text.includes("estrazione File")) return "background-color:olive";
        else if (item.text.includes("lettura XML")) return "background-color:green";
        else if (item.text.includes("Elementi Da Processare")) return "background-color:violet";
        else if (item.text.includes("Salvataggio ZIP Stampatore")) return "background-color:orange";
        else if (item.text.includes("Processo file") || item.text.includes("CHILD PROCESS ID")) return "background-color:LightGray";
        else if (item.text.includes("Inizio il File") || item.text.includes("Fine il file")) return "background-color:black";
        else if (item.text.includes("Salvataggio Terranova")) return "background-color:brown";
      } else if (item.type === "error") return "background-color:red";
      return "background-color:black";
    },
    fetchStatusContent() {
      this.$axios
        .get("/api/pdf/status", {
          headers: {
            "Secret-Key": this.$store.getters["authToken"],
          },
        })
        .then(
          ({ data }) => {
            this.showWarning = data.data.status;
          },
          (error) => {
            console.log(error);
            this.$message({
              showClose: true,
              message: error.response.data.message,
            });
          }
        );
    },
    fetchFolderContent() {
      this.$axios
        .$get("/api/pdf/flows", {
          params: { ...this.filters },
          headers: {
            "Secret-Key": this.$store.getters["authToken"],
          },
        })
        .then(
          ({ data }) => {
            this.files = data.data;
            this.filters.total = Number(data.total);
          },
          (error) => {
            console.log(error);
            this.$message({
              showClose: true,
              message: error.response.data.message,
            });
          }
        );
    },
  },
  mounted() {
    this.fetchFolderContent();
    this.fetchStatusContent();
  },
};
</script>
<style>
.main-container {
  max-width: 100%;
  margin: 0 0;
}

.buttons-container {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0px;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .error-row {
  background: rgb(253, 230, 230);
}

.el-table .success-row {
  background: #f0f9eb;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  margin-left: 10px;
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
