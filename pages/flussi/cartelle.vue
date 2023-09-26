<template>
  <div>
    <!-- DIALOG FOR STAMPA TEST -->
    <el-dialog title="Stampa Test" @close="closeDialog" :visible.sync="dialogTestVisible">
      <el-form :model="form" label-position="left" width="30%">
        <el-form-item label="Aggiornamenti Tariffari" :label-width="formLabelWidth">
          <el-input placeholder="Inserisci testo" type="textarea" v-model="aggiornamenti_tariffari" clearable> </el-input>
        </el-form-item>
        <el-form-item label="Comunicazione Arera" :label-width="formLabelWidth">
          <el-input placeholder="Inserisci testo" type="textarea" v-model="comunicazione_arera" clearable> </el-input>
        </el-form-item>
        <el-form-item label="File per stampatore" :label-width="formLabelWidth">
          <el-switch v-model="stampatoreBool" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
        </el-form-item>
        <el-form-item label="Stampa Tutte" :label-width="formLabelWidth">
          <el-switch v-model="printAll" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
        </el-form-item>
        <el-form-item label="Fatture da stampare" :label-width="formLabelWidth">
          <el-slider :disabled="printAll" v-model="form.num" :min="1" :max="500" show-input> </el-slider>
        </el-form-item>
        <el-form-item label="File per rinnovi" :label-width="formLabelWidth">
          <el-switch v-model="csvPrinter" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
        </el-form-item>

        <div v-if="csvUploadedFileName">
          <h2 v-if="csvUploadedFileName">File Caricato correttamente</h2>
          {{ csvUploadedFileName }}
          <el-button @click.prevent="csvUploadedFileName = ''">Elimina</el-button>
        </div>
        <el-upload v-if="csvPrinter && !csvUploadedFileName" style="width: 100%" :on-success="handleSuccess('upload')" :show-file-list="false" :http-request="uploadFunction" :file-list="csvUploadFile" :before-upload="handleBeforeUpload" drag :limit="1" name="csv_file" accept=".csv" class="upload-demo" ref="upload" action="">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">Inserisci CSV rinnovo <em>Clicca per fare l'upload</em></div>
        </el-upload>
        <el-form-item label="Fogli Aggiuntivi Unici" :label-width="formLabelWidth">
          <div :style="pageUnique ? 'display:flex;align-items:center':null">
            <el-switch v-model="pageUnique" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
            <el-input v-if="pageUnique" placeholder="Inserisci il nome del file aggiuntivo (es. foglio_aggiuntivo1.pdf)" type="text" style="padding-left:30px" v-model="fogliUnique" clearable> </el-input>
          </div>
        </el-form-item>
        <el-form-item label="Fogli Aggiuntivi per PDP" :label-width="formLabelWidth">
          <el-switch v-model="switchPDP" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
        </el-form-item>
        <div v-if="csvFilePDP">
          <h2 v-if="csvFilePDP">File Caricato correttamente</h2>
          {{ csvFilePDP }}
          <el-button @click.prevent="csvFilePDP = ''">Elimina</el-button>
        </div>
        <el-upload v-if="switchPDP && !csvFilePDP" style="width: 100%" :on-success="handleSuccess('fogli')" 
        :show-file-list="false" :http-request="uploadCSVFogliAggiuntivi" :file-list="csvUploadPDP" 
        :before-upload="handleBeforeUploadFogli" drag :limit="1" 
        name="csv_file" accept=".csv" class="upload-demo" ref="fogli" action="">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">INSERISCI CSV FOGLI AGGIUNTIVI <em>Clicca per fare l'upload</em></div>
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTestVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleStart({ items: selectedForWork, flusso_test: true })">Avvia Stampa Testing</el-button>
      </span>
    </el-dialog>
    <!-- DIALOG FOR DEFINITIVA -->
    <el-dialog title="Stampa Definitiva" @close="closeDialog" :visible.sync="dialogDefinitivaVisible">
      <el-form :model="form" label-position="left" width="30%">
        <el-form-item label="Aggiornamenti Tariffari" :label-width="formLabelWidth">
          <el-input placeholder="Inserisci testo" type="textarea" v-model="aggiornamenti_tariffari" clearable> </el-input>
        </el-form-item>
        <el-form-item label="Comunicazione Arera" :label-width="formLabelWidth">
          <el-input placeholder="Inserisci testo" type="textarea" v-model="comunicazione_arera" clearable> </el-input>
        </el-form-item>
        <el-form-item label="Invio stampatore" :label-width="formLabelWidth">
          <el-switch v-model="stampatoreBool" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
        </el-form-item>
        <el-form-item v-if="stampatoreBool" label="Scegli Tipologia Invio" :label-width="formLabelWidth">
          <el-select v-model="stampatoreType" placeholder="Seleziona">
            <el-option v-for="item in stampatoreChoose" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="File per rinnovi" :label-width="formLabelWidth">
          <el-switch v-model="csvPrinter" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
        </el-form-item>
        <div v-if="csvUploadedFileName">
          <h2 v-if="csvUploadedFileName">File Caricato correttamente</h2>
          {{ csvUploadedFileName }}
          <el-button @click.prevent="csvUploadedFileName = ''">Elimina</el-button>
        </div>
        <el-upload v-if="csvPrinter && !csvUploadedFileName" style="width: 100%" :on-success="handleSuccess('upload')" :show-file-list="false" :http-request="uploadFunction" :file-list="csvUploadFile" :before-upload="handleBeforeUpload" drag :limit="1" name="csv_file" accept=".csv" class="upload-demo" ref="upload" action="">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">Inserisci CSV rinnovo <em>Clicca per fare l'upload</em></div>
        </el-upload>
        <el-form-item label="Fogli Aggiuntivi Unici" :label-width="formLabelWidth">
          <div :style="pageUnique ? 'display:flex;align-items:center':null">
            <el-switch v-model="pageUnique" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
            <el-input v-if="pageUnique" placeholder="Inserisci il nome del file aggiuntivo (es. foglio_aggiuntivo1.pdf)" type="text" style="padding-left:30px" v-model="fogliUnique" clearable> </el-input>
          </div>
        </el-form-item>
        <el-form-item label="Fogli Aggiuntivi per PDP" :label-width="formLabelWidth">
          <el-switch v-model="switchPDP" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
        </el-form-item>
        <div v-if="csvFilePDP">
          <h2 v-if="csvFilePDP">File Caricato correttamente</h2>
          {{ csvFilePDP }}
          <el-button @click.prevent="csvFilePDP = ''">Elimina</el-button>
        </div>
        <el-upload v-if="switchPDP && !csvFilePDP" style="width: 100%" :on-success="handleSuccess('fogli')" 
        :show-file-list="false" :http-request="uploadCSVFogliAggiuntivi" :file-list="csvUploadPDP" 
        :before-upload="handleBeforeUploadFogli" drag :limit="1" 
        name="csv_file" accept=".csv" class="upload-demo" ref="fogli" action="">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">INSERISCI CSV FOGLI AGGIUNTIVI <em>Clicca per fare l'upload</em></div>
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDefinitivaVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleStart({ items: selectedForWork, flusso_test: false })">Avvia Stampa Definitiva</el-button>
      </span>
    </el-dialog>
    <h2><i class="el-icon-folder-opened"></i> Cartelle</h2>
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
    <div style="display:flex; align-items:center; justify-content:space-between">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, ip) in breadcrumb" :to="{ path: $route.path, query: { path: item.path } }" :key="'breadcrumb_item_' + ip">
          {{ ip == 0 ? "Radice" : item.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div>
        <el-button :disabled="selectedForWork.length == 0 || showWarning != 'completato'" type="success" @click.prevent="dialogDefinitivaVisible = true" icon="el-icon-position">Lancia Flussi</el-button>
        <el-button :disabled="selectedForWork.length == 0 || showWarning != 'completato'" type="info" @click.prevent="dialogTestVisible = true" icon="el-icon-magic-stick">Testa Flussi</el-button>
      </div>
    </div>
    <el-divider></el-divider>

    <el-row :gutter="20">
      <el-col :span="18">
        <el-table :data="pagedTableData" :row-class-name="calculateRowClass">
          <el-table-column width="55">
            <template slot="header">
              <!-- <el-checkbox></el-checkbox> -->
            </template>
            <template slot-scope="scope">
              <el-checkbox :value="$store.getters['inForWorkList'](scope.row)" :disabled="scope.row.isDirectory || !scope.row.name.endsWith('.zip')" @change="handleCheckItem($event, scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="File / Cartella">
            <template slot-scope="scope">
              <i class="el-icon-folder" v-show="scope.row.isDirectory"></i>
              <i class="el-icon-box" v-show="!scope.row.isDirectory"></i>
              <span style="margin-left: 10px" @click.prevent="handleFolderClick(scope.row)" :class="{ 'is-link': scope.row.isDirectory }">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="Dimensione" width="180"> </el-table-column>
          <el-table-column prop="date" label="Data Creazione" width="180"> </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :current-page.sync="page" :page-size="pageSize" :total="this.files.length" @current-change="setPage"> </el-pagination>
      </el-col>
      <el-col :span="6" class="selected-for-work-container">
        <h4 class="section-title">Selezionati</h4>
        <div v-for="file in selectedForWork" :key="file.hash">
          <div class="selected-for-work-item">
            <div class="">
              {{ file.name }}
            </div>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click.prevent="$store.commit('removeItemForWork', file)"></el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "flussi-cartelle",
  data: () => {
    return {
      fogliUnique:"",
      csvUploadPDP: [],
      csvFilePDP: null,
      switchPDP: false,
      pageUnique: false,
      page: 1,
      pageSize: 9,
      path: "",
      stampatoreChoose: [
        {
          value: "NEXTCLOUD",
          label: "NextCloud (GESENU)",
        },
        {
          value: "FTP",
          label: "FTP (IMBALPLAST)",
        },
	{
	 value: "FTP2G",
	 label: "FTP 2G"
	},
	{
	 value: "FTPUGMBASILICATA",
	 label: "FTP UGM (BASILICATA)"
	}
      ],
      files: [],
      csvUploadFile: [],
      csvUploadedFileName: "",
      dialogTestVisible: false,
      dialogDefinitivaVisible: false,
      form: {
        num: 100,
      },
      aggiornamenti_tariffari: "",
      comunicazione_arera: "",
      stampatoreType: "FTP",
      stampatoreBool: false,
      printAll: false,
      csvPrinter: false,
      formLabelWidth: "180px",
      showWarning: "completato",
    };
  },
  computed: {
    pagedTableData() {
      return this.files.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page);
    },
    selectedForWork() {
      return this.$store.getters["selectedForWork"];
    },
    breadcrumb() {
      if (!this.path) this.path = "";
      this.path = this.path.replace("//", "/");
      const breadcrumb = ["/"];
      let bcParts = this.path
        .split("/")
        .filter((el, i) => i > 0)
        .filter((el) => el.trim().length);
      bcParts.forEach((path) => {
        let pos = this.path.indexOf(path);
        let subPath = this.path.substring(0, pos + path.length);
        breadcrumb.push({
          path: subPath,
          label: subPath
            .split("/")
            .filter((el, i) => i > 0)
            .filter((el) => el.trim().length)
            .pop(),
        });
      });

      return breadcrumb;
    },
  },
  watch: {
    pageUnique(to, from) {
      if (to === false) {
        this.fogliUnique = "";
      }
    },
    csvPrinter(to, from) {
      if (to === false) {
        this.csvUploadedFileName = "";
      }
    },
    switchPDP(to, from) {
      if (to === false) {
        this.csvFilePDP = "";
      }
    },
    $route(to, from) {
      this.path = to.query.path;
      this.fetchFolderContent(this.path);
    },
  },
  handleSuccess(ref) {
    this.$refs[ref].clearFiles();
  },
  methods: {
    closeDialog() {
      this.csvUploadFile = [];
      this.csvUploadedFileName = "";
      this.csvPrinter = false;
    },
    handleBeforeUpload(file) {
      this.csvUploadFile.push(file);
    },
    handleBeforeUploadFogli(file) {
      this.csvUploadPDP.push(file);
    },
    uploadCSVFogliAggiuntivi() {
      const self = this;
      const loading = this.$loading({
        lock: true,
        text: "Stiamo Caricando il tuo file",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      //Create new formData object
      const fd = new FormData();
      //append the file you want to upload
      fd.append("csv_file", this.csvUploadPDP[0]);
      //send call the api to upload files using axios or any other means
      this.$axios
        .post(process.env.pdfCreator + "/api/pdf/fogli-file", fd, {
          headers: { "Secret-Key": this.$store.getters["authToken"] },
          onUploadProgress: function(progressEvent) {
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }.bind(this),
        })
        .then(function(response) {
          setTimeout(async () => {
            self.csvUploadPDP = [];
            self.csvFilePDP = response.data;
            loading.close();
          }, 1000);
        })
        .catch(function(e) {
          loading.close();
        });
    },
    uploadFunction() {
      const self = this;
      const loading = this.$loading({
        lock: true,
        text: "Stiamo Caricando il tuo file",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      //Create new formData object
      const fd = new FormData();
      //append the file you want to upload
      fd.append("csv_file", this.csvUploadFile[0]);
      //send call the api to upload files using axios or any other means
      this.$axios
        .post(process.env.pdfCreator + "/api/pdf/rinnovi-file", fd, {
          headers: { "Secret-Key": this.$store.getters["authToken"] },
          onUploadProgress: function(progressEvent) {
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }.bind(this),
        })
        .then(function(response) {
          setTimeout(async () => {
            self.csvUploadFile = [];
            self.csvUploadedFileName = response.data;
            loading.close();
          }, 1000);
        })
        .catch(function(e) {
          loading.close();
        });
    },
    setPage(val) {
      this.page = val;
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
    handleSuccess(res, file) {
      this.csv_file_name = res.data;
    },
    handleStart(obj) {
      let flusso_test = obj.flusso_test;
      let items = obj.items;
      let flusso_limit = 0;
      if (flusso_test) flusso_limit = this.form.num;
      let rinnovi_name = "undefined";
      let fogli_unique = "undefined";
      let fogli_pdp_name = "undefined"
      if (this.csvPrinter && this.csvUploadedFileName) rinnovi_name = this.csvUploadedFileName;
      if (this.pageUnique && this.fogliUnique) fogli_unique = this.fogliUnique;
      if (this.switchPDP && this.csvFilePDP) fogli_pdp_name = this.csvFilePDP;
      let flusso_stampatore = this.stampatoreBool;
      let flusso_stampatore_type = this.stampatoreType;
      if (this.printAll) flusso_limit = 0;
      this.$axios
        .get(process.env.pdfCreator + "/api/pdf/start-printer", {
          headers: { "Secret-Key": this.$store.getters["authToken"] },
          params: { items, flusso_test, flusso_limit, flusso_stampatore,fogli_unique,fogli_pdp_name, rinnovi_name, flusso_stampatore_type, aggiornamenti_tariffari: this.aggiornamenti_tariffari, comunicazione_arera: this.comunicazione_arera },
        })
        .then(
          ({ data }) => {
            const loading = this.$loading({
              lock: true,
              text: "Stiamo Avviando il flusso",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)",
            });
            this.dialogTestVisible = false;
            this.$store.commit("resetItemsForWork");
            setTimeout(() => {
              loading.close();
              this.$notify({
                title: "Flusso Avviato",
                message: "Il Flusso e stato avviato correttamente, potrai trovare informazioni relative ad esso nella schermata flussi",
                type: "success",
              });
              // this.$router.push('flussi-cronologia')
              this.$router.push({ path: "/flussi/cronologia" });
            }, 3000);
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
    fetchFolderContent(path) {
      this.$axios
        .get("/api/pdf/folders", {
          headers: {
            "Secret-Key": this.$store.getters["authToken"],
          },
          params: {
            path,
          },
        })
        .then(
          ({ data }) => {
            this.files = data.data;
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
    calculateRowClass({ row }) {
      return row.isDirectory ? "is-directory" : "is-file";
    },
    handleCheckItem(checked, item) {
      if (checked) {
        this.$store.commit("addItemForWork", item);
      } else {
        this.$store.commit("removeItemForWork", item);
      }
    },
    handleFolderClick(item) {
      if (!item.isDirectory) return;
      this.$router.push({ path: this.$route.path, query: { path: `${item.path}/${item.name}` } });
    },
  },
  mounted() {
    this.path = this.$route.query.path || "/";
    this.fetchFolderContent(this.path);
    this.fetchStatusContent();
  },
};
</script>
<style>
.main-container {
  margin: 0 0;
}

.buttons-container {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0px;
}

.folder-item-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.folder-item-icon {
  margin-right: 5px;
}

.el-table tr.is-file {
  background-color: #f0f9eb !important;
}

.selected-for-work-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 5px;
  padding: 7px 5px;
  font-size: 14px;
  color: #606266;
}

.is-link {
  cursor: pointer;
}

.section-title {
  font-size: 14px;
  color: #909399;
  font-weight: 800;
  padding: 12px 5px;
  margin-top: 4px;
  margin-bottom: 8px;
}
</style>
