<template>
<div v-if="!showError">
  <el-row :gutter="20">
    <el-col :span="14">
      <span style="font-size:20pt; font-weight:600">Tasso di abbandono Avanzato</span>
    </el-col>
    <el-col style="text-align:right" :span="10">
      <el-form ref="form" label-width="120px">
        <el-button type="primary" @click="emitExport = true">Esporta Excel</el-button>
        <el-button  type="primary" @click="hideOperations">{{hideQuarter ?  'Nascondi Riassunto Veloce' : 'Mostra Riassunto Veloce'}}</el-button>
        <el-select @change="updateAll" style="padding-left:10px;padding-right:10px;width:218px" v-model="elementiSelezionati" placeholder="Numero Elementi">
          <el-option
            v-for="item in arrayElementsTemp"
            :key="item.value"
            :label="'Mostra '+item.name+' mensilità'"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select @change="updateAll(true)" style="padding-left:10px;padding-right:10px;width:218px" v-model="annoSelezionato" placeholder="Anno">
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
  <el-row style="padding-top:30px" :gutter="20">
    <el-col :span="24">
      <table-ta v-model="emitExport" :hideQuarter="hideQuarter" :table="table" />
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
import ChurnRate from '@/components/rcu/churnRate.vue'
import Graficoperditapod from '@/components/rcu/graficoperditapod.vue'
import TableTa from '@/components/rcu/tableTa.vue'
export default {
  components: {
      Graficoperditapod,
      ChurnRate,
      TableTa
    },

    data() {
    return {
      hideQuarter:true,
      emitExport:false,
      showError: false,
      selectedMonth: '',
      selectedYear: '',
      ultimi5anni: [],
      elementiSelezionati: 12,
      arrayElementsTemp: [],
      arrayElements: [{name:'Tutte le',value: 0},{name:'12',value: 12},{name:'24',value: 24},{name:'36',value: 36},{name:'48',value: 48}],
      annoSelezionato: '',
      meseSelezionato: '',
      lastAnnoImport:'',
      mesi: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
      chart: {},
      chartDetail: {},
      societa: [],
      table: {}
    }
  },
  async mounted() {
    await this.getLastImport()
    if(this.annoSelezionato){
      for(let i = 0; i<5; i++){ this.ultimi5anni.push((new Date().getFullYear()-i).toString())}
      await this.updateAll()
    }
  },
  methods: {
    async updateElements(){
      this.arrayElementsTemp = []
      if(this.annoSelezionato) {
        let index = new Date().getFullYear() - this.annoSelezionato +1
        for(let i = 0; i<= index; i++) {
          this.arrayElementsTemp.push(this.arrayElements[i])
        }
      }
    },
    async hideOperations(){
      this.hideQuarter = !this.hideQuarter
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
    async clickDetail(val){
      this.selectedMonth = val.mese
      this.selectedYear = val.anno
      await this.chartDetailPod()
    },
    async updateAll(year){
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
        console.log("yaer",year)
        // if(year) this.elementiSelezionati = 12
        await this.updateElements()
        await this.tablePerditaPod()
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
    async tablePerditaPod() {
      await this.$axios.get('/api/rcu-gas/udd/table-tasso-abbandono', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          limitElements: this.elementiSelezionati,
          annopartenza: this.annoSelezionato,
          mese: this.meseSelezionato,
          anno: this.lastAnnoImport
        }
      }).then(
      ({data}) => {
        this.table = data.data
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