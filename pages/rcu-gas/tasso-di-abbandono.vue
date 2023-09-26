<template>
<div v-if="!showError">
  <el-row :gutter="20">
    <el-col :span="14">
      <span style="font-size:20pt; font-weight:600">Tasso di abbandono</span>
    </el-col>
    <el-col style="text-align:right" :span="10">
      <el-form ref="form" label-width="120px">
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
  <el-row style="padding-top:30px" :gutter="20">
    <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Tasso di abbandono</span>
          </div>
          <Graficoperditapod @clickDetail="clickDetail" :chart="chart" />
        </el-card>
    </el-col>
    <el-col v-if="selectedMonth && selectedYear" style="padding-top:30px" :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{this.mesi[selectedMonth-1]}} - {{selectedYear}}</span>
          </div>
          <ChurnRate :chart="chartDetail" />
        </el-card>
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
export default {
  components: {
      Graficoperditapod,
      ChurnRate
    },
  data() {
    return {
      showError: false,
      selectedMonth: '',
      selectedYear: '',
      ultimi5anni: [],
      annoSelezionato: '',
      meseSelezionato: '',
      mesi: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
      chart: {},
      chartDetail: {},
      societa: []
    }
  },
  async mounted() {
    await this.getLastImport()
    if(this.annoSelezionato) {
      for(let i = 0; i<5; i++){ this.ultimi5anni.push((new Date().getFullYear()-i).toString())}
      await this.chartPerditaPod()
      await this.ragioneSocialeCC()
    }
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
          this.annoGraficoPodSelezionato = data.data[0].ANNO.toString()
          this.annoSelezionato = data.data[0].ANNO.toString()
          this.meseSelezionato = data.data[0].MESE.toString()
        }else this.showError= true
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
        await this.chartPerditaPod()
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
    async ragioneSocialeCC() {
      await this.$axios.get('/api/rcu-gas/udd/societa', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
        }
      }).then(
      ({data}) => {
        this.societa = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async chartPerditaPod() {
      await this.$axios.get('/api/rcu-gas/udd/chart-perdita-pod-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          annopartenza: this.annoSelezionato,
          mese: this.meseSelezionato,
          anno: new Date().getFullYear().toString()
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
    async chartDetailPod() {
      await this.$axios.get('/api/rcu-gas/udd/chart-perdita-dettaglio-pod-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          mese: this.selectedMonth,
          anno: this.selectedYear
        }
      }).then(
      ({data}) => {
        this.chartDetail = data.data
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