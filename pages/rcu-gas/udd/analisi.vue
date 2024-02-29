<template>
<div>
  <el-row :gutter="20">
    <el-col :span="14">
      <span style="font-size:20pt; font-weight:600">Analisi Annuale</span>
    </el-col>
    <el-col style="text-align:right" :span="10">
        <el-select @change="updateAll" style="padding-left:10px;padding-right:10px;width:218px" v-model="annoSelezionato" placeholder="Anno">
          <el-option
            v-for="item in ultimi5anni"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-button @click="esporta" type="success">Esporta</el-button>
    </el-col>
  </el-row>
  <el-tabs style="margin-top:30px" type="border-card">
    <el-tab-pane label="Pdr"><tabellastatisticheannuali :andamento="false" :tableAnnuale="tablePodAnnuale" /></el-tab-pane>
    <el-tab-pane label="Volume"><tabellastatisticheannuali :andamento="false" :tableAnnuale="tableVolumiAnnuale" /></el-tab-pane>
    <el-tab-pane label="Andamento Relativo Pdr"><tabellastatisticheannuali :andamento="true" :tableAnnuale="tableIncPodAnnuale" /></el-tab-pane>
    <el-tab-pane label="Andamento Relativo Volume"><tabellastatisticheannuali :andamento="true" :tableAnnuale="tableIncVolumiAnnuale" /></el-tab-pane>
  </el-tabs>
  <el-row style="padding-top:50px" :gutter="20">
    <el-col :span="24">
      <el-tabs v-model="tabs" @tab-click="changeTab" type="border-card">
        <el-tab-pane name="pod-vol" label="Andamento Annuale" ><graficoannuale :mesi="mesi" :seriesGraficoAnnuale="seriesGraficoAnnuale"  /></el-tab-pane>
        <el-tab-pane name="pod-3" label="Andamento PDR Ultimi 3 anni" ><graficoultimianni :seriesGrafico3Years="seriesGraficoPod3Years"  /></el-tab-pane>
        <el-tab-pane name="vol-3" label="Andamento Volume Ultimi 3 anni" ><graficoultimianni :seriesGrafico3Years="seriesGraficoVolumi3Years"  /></el-tab-pane>
      </el-tabs>
    </el-col>
    <el-col style="padding-top:50px" :span="12">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div style="display:flex;align-items:center;justify-content: space-between;">
          <span>Pdr persi (Data Importazione RCU) in base mensile</span>
          <div style="display:flex;justify-content:center;align-items:center">
            <el-select @change="chartPodInformation" style="padding-left:5px" v-model="meseGraficoPodSelezionato" placeholder="Mese">
              <el-option
                v-for="item in mesi"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-tooltip class="item" effect="dark" content="" placement="left-start">
            <div slot="content">
              <h3>Pdr Persi mensilmente rispetto al totale dei pdr del mese impostato,<br> 
              con la possibilità di analizzare dettagliatamente la perdita percentuale</h3>
              </div>
              <i style="padding-left:20px;" class="el-icon-info"></i>
            </el-tooltip>
            <!-- <el-button @click="chartPodInformation" style="margin-left:5px" type="success">Aggiorna</el-button> -->
          </div>
          </div>
        </div>
        <graficoannualepod :mesi="mesi" :color="'#f49236'" :seriesChart="seriesGraficoPodAnnuale" />
      </el-card>
    </el-col>
    <el-col style="padding-top:50px" :span="12">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div style="display:flex;align-items:center;justify-content: space-between;">
          <span>Pdr persi (Data Attivazione Fornitura) in base mensile</span>
          <div style="display:flex;justify-content:center;align-items:center">
            <el-select @change="chartPodDispacciamentoInformation" style="padding-left:5px" v-model="meseGraficoDispPodSelezionato" placeholder="Mese">
              <el-option
                v-for="item in mesi"
                :key="item"
                :label="item"
                type="month"
                :value="item">
              </el-option>
            </el-select>
            <el-tooltip class="item" effect="dark" content="" placement="left-start">
            <div slot="content">
              <h3>Pdr Persi mensilmente rispetto alla data attivazione della fornitura del mese impostato,<br> 
              con la possibilità di analizzare dettagliatamente la perdita percentuale</h3>
              </div>
              <i style="padding-left:20px;" class="el-icon-info"></i>
            </el-tooltip>
            <!-- <el-button @click="chartPodInformation" style="margin-left:5px" type="success">Aggiorna</el-button> -->
          </div>
          </div>
        </div>
        <graficoannualepod :mesi="mesi" :color="'#F44336'" :seriesChart="seriesDispacciamentoPodAnnuale" />
      </el-card>
    </el-col>
  </el-row>
</div>
</template>

<script>
const today = new Date();
import Graficoannuale from '@/components/rcu/graficoannuale.vue'
import Graficoannualepod from '@/components/rcu/graficoannualepod.vue'
import Graficoultimianni from '@/components/rcu/graficoultimianni.vue'
import tabellastatisticheannuali from '@/components/rcu/tabellastatisticheannuali.vue'
export default {
 components: {
    Graficoannuale,
    Graficoannualepod,
    tabellastatisticheannuali,
    Graficoultimianni
  },
  data() {
    return {
      tabs: 'pod-vol',
      date:'',
      meseGraficoPodSelezionato: 'Gennaio',
      meseGraficoDispPodSelezionato: 'Gennaio',
      annoGraficoSelezionato: '',
      annoSelezionato: '',
      ultimi5anni: [],
      mesi: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
      seriesGraficoAnnuale : {},
      seriesGraficoPod3Years : {},
      seriesGraficoVolumi3Years : {},
      seriesGraficoPodAnnuale : {},
      seriesDispacciamentoPodAnnuale: {},
      tablePodAnnuale: [],
      tableVolumiAnnuale: [],
      tableIncVolumiAnnuale: [],
      tableIncPodAnnuale: [],
    }
  },
  async mounted() {
    if(this.$route.query && this.$route.query.anno) {
      this.annoSelezionato = this.$route.query.anno
    }else {
      await this.getLastImport()
    }
    for(let i = 0; i<5; i++){ this.ultimi5anni.push(new Date().getFullYear()-i)}

    for(var i in this.ultimi5anni){
      if(this.ultimi5anni[i] == today.getFullYear()){

        this.annoSelezionato = this.ultimi5anni[i]
      }
    }
    await this.updateFunction()
  },
  methods: {
    async getLastImport() {
      await this.$axios.get('/api/rcu-gas/udd/last-import', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        }
      }).then(
      ({data}) => {
        if(data.data && data.data.length > 0) {
          this.annoSelezionato = data.data[0].ANNO.toString()
        }
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async changeTab(){
      switch(this.tabs) {
        case 'pod-vol' : await this.chartInformation();break
        case 'pod-3' : await this.chartPod3YearsInformation();break
        case 'vol-3' : await this.chartVolumi3YearsInformation();break
      }
    },
    async clearAllForUpdate(){
      this.seriesGraficoAnnuale = {},
      this.seriesGraficoPod3Years = {},
      this.seriesGraficoVolumi3Years = {},
      this.seriesGraficoPodAnnuale = {},
      this.seriesDispacciamentoPodAnnuale= {},
      this.tablePodAnnuale= [],
      this.tableVolumiAnnuale= [],
      this.tableIncVolumiAnnuale= [],
      this.tableIncPodAnnuale = []
    },
    async updateFunction(){
      
	await this.clearAllForUpdate()
	await this.changeTab()
	await this.chartPodInformation()
	await this.tablePodInformation()
	await this.tableVolumiInformation()
	await this.tableIncVolumiInformation()
	await this.tableIncPodInformation()
	await this.chartPodDispacciamentoInformation()
      
    },
    esporta(){
      let self = this
      const loading = this.$loading({
        lock: true,
        text: 'Stiamo Caricando il tuo file',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$axios.post('/api/rcu-gas/udd/esportazione/', {anno:this.annoSelezionato},{
        headers:{'Secret-Key' : this.$store.getters['authToken']},
        responseType: 'arraybuffer',
      })
      .then(function(response){
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `esportazione_${self.annoSelezionato}.csv`); //or any other extension
          document.body.appendChild(link);
          link.click();
          loading.close();
        })
      .catch(function(e){
        console.log("e",e)
        loading.close();
      });
    },
    async updateAll(){
      const loading = this.$loading({
        lock: true,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$axios.get('/api/rcu-gas/udd/check-sintesi', {
      headers:{
        'Secret-Key' : this.$store.getters['authToken']
      },
      params: {
        anno: this.annoSelezionato
      }
      }).then(
      async ({data}) => {
        await this.updateFunction()
        setTimeout(async () => {
          loading.close()
        },1000)
      },
      error => {
        loading.close()
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
      
    },
    async chartPod3YearsInformation(){
      this.$axios.get('/api/rcu-gas/udd/chart-pod-3years-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        this.seriesGraficoPod3Years = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async chartVolumi3YearsInformation(){
      this.$axios.get('/api/rcu-gas/udd/chart-volumi-3years-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        this.seriesGraficoVolumi3Years = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async chartInformation(){
      this.$axios.get('/api/rcu-gas/udd/chart-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        this.seriesGraficoAnnuale = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async chartPodInformation(){
      this.$axios.get('/api/rcu-gas/udd/chart-pod-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          mese: this.mesi.indexOf(this.meseGraficoPodSelezionato)+1,
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        this.seriesGraficoPodAnnuale = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async chartPodDispacciamentoInformation(){
      this.$axios.get('/api/rcu-gas/udd/chart-pod-dispacciamento-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          mese: this.mesi.indexOf(this.meseGraficoDispPodSelezionato)+1,
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        this.seriesDispacciamentoPodAnnuale = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async tablePodInformation(){
      this.$axios.get('/api/rcu-gas/udd/table-pod-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        this.tablePodAnnuale = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async tableIncPodInformation(){
      this.$axios.get('/api/rcu-gas/udd/table-inc-pod-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        this.tableIncPodAnnuale = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async tableVolumiInformation(){
      this.$axios.get('/api/rcu-gas/udd/table-volumi-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        this.tableVolumiAnnuale = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async tableIncVolumiInformation(){
      this.$axios.get('/api/rcu-gas/udd/table-inc-volumi-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        this.tableIncVolumiAnnuale = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
  }
}
</script>

<style>

</style>