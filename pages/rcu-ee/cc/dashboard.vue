<template>
<div v-if="!showError">
  <tabella-info-bonus :type="'rcu-ee/cc'" :mese="mesi.indexOf(meseSelezionato)+1" :anno="annoSelezionato" v-model="dialogTableVisible" />
  <el-row :gutter="20">
    <el-col :span="14">
      <span style="font-size:20pt; font-weight:600">Dashboard</span>
    </el-col>
    <el-col style="text-align:right" :span="10">
      <el-form ref="form" label-width="120px">
        <el-select @change="updateAll" v-model="meseSelezionato" placeholder="Mese">
          <el-option
            v-for="item in mesi"
            :key="item"
            :label="item"
            :value="item">
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
         <el-button @click="esporta" type="success">Esporta</el-button>
        <!-- <el-button @click="updateAll" type="success">Aggiorna</el-button> -->
      </el-form>
    </el-col>
  </el-row>
  <sintesi :annoSelezionato="annoSelezionato" :meseSelezionato="meseSelezionato" :sintesi="sintesi" />
  <el-row style="padding-top:30px" :gutter="20">
    <el-col :span="12">
        <div class="grid-content bg-purple">
        <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Dati pod e volumi per Udd</span>
      </div>
        <tabella-societa :type="'ee'" :table="table" />
        </el-card>
        </div>
    </el-col>
    <el-col :span="12">
      <graficomensile :colors="['#40c9c6','#40cd88','#3fd147','#7cd43e','#c4d83e','#dca73d','#e05e3c','#e43b66','#e83ab7','#cc39eb','#7a38ef',,'#374bf3','#36a3f7']" :table="table"/>
    </el-col>
  </el-row>
    <el-row v-if="tableBonus.length > 0" style="padding-top:30px" :gutter="20">
    <el-col :span="12">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Andamento Pod Annuale</span>
        </div>
        <graficoincrementoannuopod :seriesGraficoIncrementoPodAnnuale="seriesGraficoIncrementoPodAnnuale" />
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Andamento Volume (Gwh) Annuale</span>
        </div>
        <graficoincrementoannuovolume  :seriesGraficoIncrementoVolumeAnnuale="seriesGraficoIncrementoVolumeAnnuale"  />
      </el-card>
    </el-col>
  </el-row>
  <el-row style="padding-top:30px" :gutter="20">
    <el-col :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Dati bonus sociale</span>
          <el-button @click="showDialogTable()" style="float: right; padding: 3px 0" type="text">Ricerca POD</el-button>
        </div>
        <tabella-bonus :type="'ee'" :table="tableBonus" />
      </el-card>
    </el-col>
    <el-col :span="6">
      <graficomensile-bonus :table="tableBonus"/>
    </el-col>
     <el-col :span="12">
      <el-card style="min-height: 513px;" class="box-card">
        <div slot="header" class="clearfix">
          <span>Andamento Bonus Annuale</span>
        </div>
        <graficoincrementoannuopod  :seriesGraficoIncrementoPodAnnuale="seriesGraficoIncrementoBonusAnnuale" />
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
import Graficomensile from '@/components/rcu/graficomensile.vue'
import graficoincrementoannuopod from '@/components/rcu/graficoincrementoannuopod.vue'
import graficoincrementoannuovolume from '@/components/rcu/graficoincrementoannuovolume.vue'
import sintesi from '@/components/rcu/sintesi.vue'
import TabellaSocieta from '@/components/rcu/tabellaSocieta.vue'
import TabellaBonus from '@/components/rcu/tabellaBonus.vue'
import GraficomensileBonus from '@/components/rcu/graficomensileBonus.vue'
import TabellaInfoBonus from '@/components/rcu/tabellaInfoBonus.vue'
export default {
 components: {
    sintesi,
    TabellaSocieta,
    Graficomensile,
    graficoincrementoannuopod,
    graficoincrementoannuovolume,
    TabellaBonus,
    GraficomensileBonus,
    TabellaInfoBonus
  },
  computed:{
  },
  data() {
    return {
      showError: false,
      dialogTableVisible: false,
      ultimi5anni: [],
      tableInfoBonus: [],
      seriesGraficoIncrementoBonusAnnuale: [],
      seriesGraficoIncrementoPodAnnuale: [],
      seriesGraficoIncrementoVolumeAnnuale: [],
      annoSelezionato: '',
      meseSelezionato: '',
      mesi: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
      table: [],
      tableBonus: [],
      sintesi: {},
    }
  },
  async mounted() {
    await this.getLastImport()
    if(this.annoSelezionato){
      for(let i = 0; i<5; i++){ this.ultimi5anni.push((new Date().getFullYear()-i).toString())}
      await this.tableInformation()
      await this.sintesiInformation()
      await this.chartIncrementoAnnPodInformation()
      await this.chartIncrementoAnnVolumeInformation()
      await this.tableBonusInformation()
      await this.chartIncrementoAnnBonusInformation()
    }
  },
  methods: {
    async getLastImport() {
      
      await this.$axios.get('/api/rcu-ee/cc/last-import', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        }
      }).then(
      ({data}) => {
        if(data.data && data.data.length > 0) {
          this.annoGraficoPodSelezionato = data.data[0].ANNO.toString()
          this.annoSelezionato = data.data[0].ANNO.toString()
          this.annoGraficoSelezionato = data.data[0].ANNO.toString()
          this.meseSelezionato = this.mesi[data.data[0].MESE-1].toString()
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
    showDialogTable(){
       this.dialogTableVisible = true
     },
    esporta(){
      let self = this
      const loading = this.$loading({
        lock: true,
        text: 'Stiamo Caricando il tuo file',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$axios.post('/api/rcu-ee/cc/download-file/', {mese: this.mesi.indexOf(this.meseSelezionato)+1,anno:this.annoSelezionato},{
        headers:{'Secret-Key' : this.$store.getters['authToken']},
        responseType: 'arraybuffer',
      })
      .then(function(response){
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `esportazione_${self.meseSelezionato}_${self.annoSelezionato}.csv`); //or any other extension
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
      this.$axios.get('/api/rcu-ee/cc/check-sintesi', {
      headers:{
        'Secret-Key' : this.$store.getters['authToken']
      },
      params: {
        mese: this.mesi.indexOf(this.meseSelezionato)+1,
        anno: this.annoSelezionato
      }
      }).then(
      async ({data}) => {
        await this.tableInformation()
        await this.tableBonusInformation()
        await this.sintesiInformation()
        await this.chartIncrementoAnnBonusInformation()
        await this.chartIncrementoAnnPodInformation()
        await this.chartIncrementoAnnVolumeInformation()
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
    async tableInformation() {
      this.$axios.get('/api/rcu-ee/cc/table-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          mese: this.mesi.indexOf(this.meseSelezionato)+1,
          anno: this.annoSelezionato
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
    async tableBonusInformation() {
      this.$axios.get('/api/rcu-ee/cc/table-bonus-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          mese: this.mesi.indexOf(this.meseSelezionato)+1,
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        this.tableBonus = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async sintesiInformation() {
      this.$axios.get('/api/rcu-ee/cc/sintesi-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          mese: this.mesi.indexOf(this.meseSelezionato)+1,
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        if(data.data.length > 0) {
          this.sintesi = data.data[0]
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
    async chartIncrementoAnnBonusInformation(){
      this.$axios.get('/api/rcu-ee/cc/chart-incremento-bonus-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          mese: this.mesi.indexOf(this.meseSelezionato)+1,
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        this.seriesGraficoIncrementoBonusAnnuale = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async chartIncrementoAnnPodInformation(){
      this.$axios.get('/api/rcu-ee/cc/chart-incremento-pod-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          mese: this.mesi.indexOf(this.meseSelezionato)+1,
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        this.seriesGraficoIncrementoPodAnnuale = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async chartIncrementoAnnVolumeInformation(){
      this.$axios.get('/api/rcu-ee/cc/chart-incremento-volume-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          mese: this.mesi.indexOf(this.meseSelezionato)+1,
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        this.seriesGraficoIncrementoVolumeAnnuale = data.data
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