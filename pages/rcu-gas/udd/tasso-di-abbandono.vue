<template>
  <div v-if="!showError">
    <tree-view v-model="showTree" @confirm="getTreeData" />
    <el-row :gutter="20">
      <el-col :span="6">
        <span style="font-size:20pt; font-weight:600">Tasso di abbandono</span>
      </el-col>
      <el-col style="text-align:right" :span="18">
        <el-form ref="form" label-width="120px">
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
        </el-form>
      </el-col>
    </el-row>
    <el-col :span="24">
      <span style="font-size:11pt; font-weight:400"
        >È consigliabile utilizzare i filtri speciali solo per l'anno 2021</span
      >
    </el-col>
    <el-row style="padding-top:30px" :gutter="20">
      <el-col :span="24">
        <Graficoperditapod @clickDetail="clickDetail" :chart="chart" />
      </el-col>
      <el-col
        v-if="selectedMonth && selectedYear"
        style="padding-top:30px"
        :span="24"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div
              style="display:flex;align-items:center;justify-content: space-between;"
            >
              <span
                >{{ this.mesi[selectedMonth - 1] }} - {{ selectedYear }}</span
              >
              <div
                style="display:flex;justify-content:center;align-items:center"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content=""
                  placement="left-start"
                >
                  <div slot="content">
                    <h2>
                      Riscontro grafico tra punto iniziale e punto attuale con
                      approfondimento mensile in percentuale
                    </h2>
                  </div>
                  <i style="padding-left:20px;" class="el-icon-info"></i>
                </el-tooltip>
              </div>
            </div>
          </div>
          <ChurnRate :chart="chartDetail" />
        </el-card>
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
import TreeView from '@/components/tree-view.vue'

export default {
  components: {
    Graficoperditapod,
    ChurnRate,
    TreeView
  },
  computed: {
      tenant(){
        return this.$store.state.tenant_gas
      }
    },
  data() {
    return {
      agente_id:null,
      showTree:false,
      showError: false,
      selectedMonth: "",
      selectedYear: "",
      ultimi5anni: [],
      lastAnnoImport:"",
      annoSelezionato: "",
      meseSelezionato: "",
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
    };
  },
  async mounted() {
    await this.getLastImport();
    if (this.annoSelezionato) {
      for (let i = 0; i < 5; i++) {
        this.ultimi5anni.push((new Date().getFullYear() - i).toString());
      }
      await this.chartPerditaPod();
      await this.ragioneSocialeCC();
    }
  },
  methods: {
    async getTreeData(el){
      this.showTree=false
      this.agente_id = el
      this.updateAll()
    },
    async getLastImport() {
      await this.$axios
        .get("/api/rcu-gas/udd/last-import", {
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
        .get("/api/rcu-gas/udd/check-sintesi", {
          headers: {
            "Secret-Key": this.$store.getters["authToken"],
          },
          params: {
            anno: this.annoSelezionato,
          },
        })
        .then(
          async ({ data }) => {
            (this.selectedMonth = ""),
              (this.selectedYear = ""),
              (this.chartDetail = {});
            await this.chartPerditaPod();
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
    async ragioneSocialeCC() {
      await this.$axios
        .get("/api/rcu-gas/udd/societa", {
          headers: {
            "Secret-Key": this.$store.getters["authToken"],
          },
          params: {},
        })
        .then(
          ({ data }) => {
            this.societa = data.data;
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
    async chartPerditaPod() {
      await this.$axios
        .get("/api/rcu-gas/udd/chart-perdita-pod-information", {
          headers: {
            "Secret-Key": this.$store.getters["authToken"],
          },
          params: {
            agente_id: this.agente_id === '' ? null : this.agente_id,
            invio_fatture: this.selectedInvioFattura,
            modalita_pagamento: this.selectedFilterPagamento,
            annopartenza: this.annoSelezionato,
            mese: this.meseSelezionato,
            anno: this.lastAnnoImport
          },
        })
        .then(
          ({ data }) => {
            this.chart = data.data;
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
    async chartDetailPod() {
      await this.$axios
        .get("/api/rcu-gas/udd/chart-perdita-dettaglio-pod-information", {
          headers: {
            "Secret-Key": this.$store.getters["authToken"],
          },
          params: {
            agente_id: this.agente_id === '' ? null : this.agente_id,
            invio_fatture: this.selectedInvioFattura,
            modalita_pagamento: this.selectedFilterPagamento,
            mese: this.selectedMonth,
            anno: this.selectedYear,
          },
        })
        .then(
          ({ data }) => {
            this.chartDetail = data.data;
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
};
</script>

<style></style>
