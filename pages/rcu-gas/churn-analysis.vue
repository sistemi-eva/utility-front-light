<template>
<div v-if="!showError">
  <el-row :gutter="20">
    <el-col :span="14">
      <span style="font-size:20pt; font-weight:600">Churn Rate</span>
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
        <grafico-att-disat-pod :type="'gas'" :chart="chartPod" />
    </el-col>
  </el-row>

  <el-row style="padding-top:30px" :gutter="20">
    <el-col :span="24">
        <grafico-att-disat-volumi :type="'gas'" :chart="chart" />
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
export default {
    components: {
        Graficoperditapod,
        graficoAttDisatVolumi,
        GraficoAttDisatPod,
    },
  data() {
    return {
      showError: false,
      selectedMonth: '',
      selectedYear: '',
      ultimi5anni: [],
      lastAnnoImport:"",
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
    async getLastImport() {
      await this.$axios.get('/api/rcu-gas/udd/last-import', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        }
      }).then(
      ({data}) => {
        if(data.data && data.data.length > 0) {
          this.annoGraficoPodSelezionato = data.data[0].ANNO.toString()
          this.lastAnnoImport = JSON.parse(JSON.stringify(data.data[0].ANNO.toString()))
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