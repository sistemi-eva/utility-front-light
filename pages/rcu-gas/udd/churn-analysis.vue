<template>
<div v-if="!showError">
    <tree-view v-model="showTree" @confirm="getTreeData" />
  <el-row :gutter="20">
    <el-col :span="4">
      <span style="font-size:20pt; font-weight:600">Churn Rate</span>
    </el-col>
    <el-col style="text-align:right" :span="20">
      <el-form ref="form" label-width="120px">
        <el-button type="primary" v-if="tenant == 'ugm'" @click="showTree = true">Filtra per Business Unit</el-button>
        <el-select @change="updateAll" clearable  style="padding-left:10px;padding-right:10px;width:218px" v-model="selectedInvioFattura" placeholder="Mod. invio fatture">
          <el-option
            v-for="item in filterInvioFattura"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select @change="updateAll" clearable style="padding-left:10px;padding-right:10px;width:218px" v-model="selectedFilterPagamento" placeholder="Mod. pagamento">
          <el-option
            v-for="item in filterPagamento"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select style="padding-left:10px;padding-right:10px;width:218px" v-model="selectedView" placeholder="Modalità visualizzazione">
          <el-option
            v-for="item in typeView"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select @change="updateAll" style="padding-left:10px;padding-right:10px;width:218px" v-model="annoSelezionato" placeholder="Anno">
          <el-option
            v-for="item in ultimi5anni"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form>
    </el-col>
  </el-row>
 <el-col :span="24">
    <span style="font-size:11pt; font-weight:400">È consigliabile utilizzare i filtri speciali solo per l'anno 2021</span>
  </el-col>
  <el-row style="padding-top:30px" :gutter="20">
    <el-col :span="24">
        <grafico-att-disat-pod  :type="'gas'" :type_chart="selectedView" :chart="chartPod" />
    </el-col>
  </el-row>

  <el-row style="padding-top:30px" :gutter="20">
    <el-col :span="24">
        <grafico-att-disat-volumi :type="'gas'" :type_chart="selectedView" :chart="chart" />
    </el-col>
  </el-row>
  
</div>
<div v-else style="display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100%;">
  <h2> Non hai ancora importato alcun file. </h2>
  <h3> Recati ora nella sezione importazioni, per effettuare il tuo primo import. </h3>
</div>
</template>

<script>
import Graficoperditapod from '@/components/rcu/graficoperditapod.vue'
import graficoAttDisatVolumi from '@/components/rcu/graficoAttDisatVolumi.vue'
import GraficoAttDisatPod from '@/components/rcu/graficoAttDisatPod.vue'
import TreeView from '@/components/tree-view.vue';

export default {
    components: {
        Graficoperditapod,
        graficoAttDisatVolumi,
        GraficoAttDisatPod,
        TreeView,
    },
    computed: {
    tenant() {
      return this.$store.state.tenant_gas;
    },
  },
  data() {
    return {
      agente_id:null,
      showTree:false,
      showError: false,
      selectedMonth: '',
      selectedYear: '',
      ultimi5anni: [],
      lastAnnoImport:'',
      selectedFilterPagamento: null,
      selectedInvioFattura: null,
      filterPagamento: [{label:'SDD',value:1},{label:'NON SDD',value:0}],
      filterInvioFattura: [{label:'Digitale',value:1},{label:'Cartacea',value:0}],
      selectedView: 'assoluti',
      typeView: [{label:'Valori Assoluti',value:'assoluti'},{label:'Valori Percentuale',value:'percentuale'}],
      annoSelezionato: '',
      meseSelezionato: '',
      mesi: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
      chart: {},
      chartPod: {}
    }
  },
  async mounted() {
    await this.getLastImport()
    if(this.annoSelezionato) {
      for(let i = 0; i<5; i++){ this.ultimi5anni.push((new Date().getFullYear()-i).toString())}
      this.chartAndamentoVolumi()
      this.chartAndamentoPod()
    }
  },
  methods: {
    async getTreeData(el){
      this.showTree=false
      this.agente_id = el
      this.updateAll()
    },
    async getLastImport() {
      await this.$axios.get('/api/rcu-gas/udd/last-import', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        }
      }).then(
      ({data}) => {
        if(data.data && data.data.length > 0) {
          this.lastAnnoImport = JSON.parse(JSON.stringify(data.data[0].ANNO.toString()))
          this.annoGraficoPodSelezionato = data.data[0].ANNO.toString()
          this.annoSelezionato = data.data[0].ANNO.toString()
          this.meseSelezionato = data.data[0].MESE.toString()
          }else this.showError = true
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async updateAll(){
      if(this.selectedInvioFattura === '') this.selectedInvioFattura = null
      if(this.selectedFilterPagamento === '') this.selectedFilterPagamento = null
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
        await this.chartAndamentoVolumi()
        await this.chartAndamentoPod()
        setTimeout(async () => {
          loading.close()
        },500)
      },
      error => {
        loading.close()
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
      // }
    },
    async chartAndamentoVolumi() {
      await this.$axios.get('/api/rcu-gas/udd/att-dis-volumi', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          agente_id: this.agente_id === '' ? null : this.agente_id,
          invio_fatture: this.selectedInvioFattura,
          modalita_pagamento: this.selectedFilterPagamento,
          annopartenza: this.annoSelezionato,
          mese: this.meseSelezionato,
          anno: this.lastAnnoImport
        }
      }).then(
      ({data}) => {
        this.chart = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async chartAndamentoPod() {
      await this.$axios.get('/api/rcu-gas/udd/att-dis-pod', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          agente_id: this.agente_id === '' ? null : this.agente_id,
          invio_fatture: this.selectedInvioFattura,
          modalita_pagamento: this.selectedFilterPagamento,
          annopartenza: this.annoSelezionato,
          mese: this.meseSelezionato,
          anno: this.lastAnnoImport
        }
      }).then(
      ({data}) => {
        this.chartPod = data.data
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