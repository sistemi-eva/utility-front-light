<template>
  <div v-if="!showError">
    <tree-view v-model="showTree" @confirm="getTreeData"/>
    <tree-view2 v-model="showTree2" @confirm="getTreeData"/>
    <el-col :span="24">
      <span style="font-size:20pt; font-weight:600"
        >Tasso di abbadono avanzato</span
      ><br />
      <span style="font-size:11pt; font-weight:400"
        >È consigliabile utilizzare i filtri speciali solo per l'anno 2021</span
      >
    </el-col>
    <el-row :gutter="20">
      <el-col style="padding-top:20px; text-align:right" :span="24">
        <el-form ref="form" label-width="120px">
          <el-button type="primary" v-if="tenant == 'ugm'" @click="showTree2 = true">Filtra per Tipologia Cliente</el-button>
          <el-button type="primary" v-if="tenant == 'ugm'" @click="showTree = true">Filtra per Business Unit</el-button>
          <el-select
            @change="updateAll"
            clearable
            style="padding-left:10px;padding-right:10px;width:218px"
            v-model="selectedInvioFattura"
            placeholder="Mod. invio fatture"
          >
            <el-option
              v-for="item in filterInvioFattura"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            @change="updateAll"
            clearable
            style="padding-left:10px;padding-right:10px;width:218px"
            v-model="selectedFilterPagamento"
            placeholder="Mod. pagamento"
          >
            <el-option
              v-for="item in filterPagamento"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            @change="updateAll"
            style="padding-left:10px;padding-right:10px;width:218px"
            v-model="elementiSelezionati"
            placeholder="Numero Elementi"
          >
            <el-option
              v-for="item in arrayElementsTemp"
              :key="item.value"
              :label="'Mostra ' + item.name + ' mensilità'"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            @change="updateAll"
            style="padding-left:10px;padding-right:10px;width:218px"
            v-model="annoSelezionato"
            placeholder="Anno"
          >
            <el-option
              v-for="item in ultimi5anni"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-button type="primary" @click="emitExport = true; emitExport2 = true"
            >Esporta</el-button
          >
          <el-button type="primary" @click="hideOperations">{{
            hideQuarter ? "Nascondi Mensilità" : "Mostra Mensilità"
          }}</el-button>
        </el-form>
      </el-col>
    </el-row>
    <el-row style="padding-top:30px" :gutter="20">
      <el-col :span="24">
        <table-ta
          v-model="emitExport"
          :hideQuarter="hideQuarter"
          :table="table"
        />
      </el-col>
    </el-row>

    <el-row style="padding-top:30px" :gutter="20">
      <el-col :span="24">
        <table-ta-volumi
          v-model="emitExport2"
          :hideQuarter="hideQuarter"
          :table="table_volumi"
        />
      </el-col>
    </el-row>
  </div>
  <div
    v-else
    style="display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100%;"
  >
    <h2>Non hai ancora importato alcun file.</h2>
    <h3>
      Recati ora nella sezione importazioni, per effettuare il tuo primo import.
    </h3>
  </div>
</template>

<script>
import ChurnRate from "@/components/rcu/churnRate.vue";
import Graficoperditapod from "@/components/rcu/graficoperditapod.vue";
import TableTa from "@/components/rcu/tableTa.vue";
import TableTaVolumi from "@/components/rcu/tableTaVolumi.vue";
import TreeView from '@/components/tree-view.vue'
import TreeView2 from '@/components/tree-view2.vue'

export default {
  components: {
    Graficoperditapod,
    ChurnRate,
    TableTa,
    TableTaVolumi,
    TreeView,
    TreeView2

  },
  computed: {
      tenant(){
        return this.$store.state.tenant_gas
      }
    },
  data() {
    return {
      showTree:false,
      showTree2: false,
      agente_id:null,
      hideQuarter:true,
      hideQuarter: true,
      emitExport: false,
      emitExport2: false,
      showError: false,
      lastAnnoImport:"",
      selectedMonth: "",
      selectedYear: "",
      ultimi5anni: [],
      elementiSelezionati: 12,
      arrayElementsTemp: [],
      selectedFilterPagamento: null,
      selectedInvioFattura: null,
      filterPagamento: [
        { label: "SDD", value: 1 },
        { label: "NON SDD", value: 0 },
      ],
      filterInvioFattura: [
        { label: "Digitale", value: 1 },
        { label: "Cartacea", value: 0 },
      ],
      arrayElements: [
        { name: "Tutte le", value: 0 },
        { name: "12", value: 12 },
        { name: "24", value: 24 },
        { name: "36", value: 36 },
        { name: "48", value: 48 },
      ],
      annoSelezionato: "",
      meseSelezionato: "",
      mesi: [
        "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre",
      ],
      chart: {},
      chartDetail: {},
      societa: [],
      table: {},
      table_volumi: {}
    };
  },
  async mounted() {
    await this.getLastImport();
    if (this.annoSelezionato) {
      for (let i = 0; i < 5; i++) {
        this.ultimi5anni.push((new Date().getFullYear() - i).toString());
      }
      await this.updateAll();
    }
  },
  methods: {
    async getTreeData(el){
      this.showTree=false
      this.agente_id = el
      this.updateAll()
    },
    async updateElements() {
      this.arrayElementsTemp = [];
      if (this.annoSelezionato) {
        let index = new Date().getFullYear() - this.annoSelezionato + 1;
        for (let i = 0; i <= index; i++) {
          this.arrayElementsTemp.push(this.arrayElements[i]);
        }
      }
    },
    async hideOperations() {
      this.hideQuarter = !this.hideQuarter;
    },
    async getLastImport() {
      await this.$axios
        .get("/api/rcu-gas/cc/last-import", {
          headers: {
            "Secret-Key": this.$store.getters["authToken"],
          },
        })
        .then(
          ({ data }) => {
            if (data.data && data.data.length > 0) {
              this.lastAnnoImport = JSON.parse(JSON.stringify(data.data[0].ANNO.toString()))
              this.annoGraficoPodSelezionato = data.data[0].ANNO.toString();
              this.annoSelezionato = data.data[0].ANNO.toString();
              this.meseSelezionato = data.data[0].MESE.toString();
            } else this.showError = true;
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
    async clickDetail(val) {
      this.selectedMonth = val.mese;
      this.selectedYear = val.anno;
      await this.chartDetailPod();
    },
    async updateAll() {
      if (this.selectedInvioFattura === "") this.selectedInvioFattura = null;
      if (this.selectedFilterPagamento === "")
        this.selectedFilterPagamento = null;
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.$axios
        .get("/api/rcu-gas/cc/check-sintesi", {
          headers: {
            "Secret-Key": this.$store.getters["authToken"],
          },
          params: {
            anno: this.annoSelezionato,
          },
        })
        .then(
          async ({ data }) => {
            await this.updateElements();
            await this.tablePerditaPod();
            await this.tablePerditaVolumi();
            setTimeout(async () => {
              loading.close();
            }, 500);
          },
          (error) => {
            loading.close();
            this.$message({
              showClose: true,
              message: error.response.data.message,
            });
          }
        );
      // }
    },
    async tablePerditaPod() {
      await this.$axios
        .get("/api/rcu-gas/cc/table-tasso-abbandono", {
          headers: {
            "Secret-Key": this.$store.getters["authToken"],
          },
          params: {
            agente_id: this.agente_id === '' ? null : this.agente_id,
            invio_fatture: this.selectedInvioFattura,
            modalita_pagamento: this.selectedFilterPagamento,
            limitElements: this.elementiSelezionati,
            annopartenza: this.annoSelezionato,
            mese: this.meseSelezionato,
            anno: this.lastAnnoImport
          },
        })
        .then(
          ({ data }) => {
            this.table = data.data;
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

    async tablePerditaVolumi() {
      await this.$axios
        .get("/api/rcu-gas/cc/table-tasso-abbandono-volumi", {
          headers: {
            "Secret-Key": this.$store.getters["authToken"],
          },
          params: {
            agente_id: this.agente_id === '' ? null : this.agente_id,
            invio_fatture: this.selectedInvioFattura,
            modalita_pagamento: this.selectedFilterPagamento,
            limitElements: this.elementiSelezionati,
            annopartenza: this.annoSelezionato,
            mese: this.meseSelezionato,
            anno: this.lastAnnoImport
          },
        })
        .then(
          ({ data }) => {
            this.table_volumi = data.data;
          },
          (error) => {
            console.log(error);
            this.$message({
              showClose: true,
              message: error.response.data.message,
            });
          }
        );
    }
  },
};
</script>

<style></style>
