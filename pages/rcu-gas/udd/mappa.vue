<template>
<div v-loading="loading">
  <el-row  :gutter="20">
    <el-col :span="8">
      <span style="font-size:30pt; font-weight:600">{{selectedLocations ? selConvertLocation :  "Parco Totale Gas"}}</span>
    </el-col>
    <el-col style="text-align:right" :span="16">
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
        <el-button v-if="selectedLocations" @click="selectedLocations = ''" type="danger">Annulla Selezione</el-button>
        <el-button v-if="!selectedLocations && !selectedRegioni" @click="selectedRegioni = !selectedRegioni" type="success">Visualizza Regioni</el-button>
        <el-button v-if="(!selectedLocations && selectedRegioni) || (selectedLocations && selectedRegioni)" @click="selectedRegioni = !selectedRegioni" type="danger">Ritorna Visualizzazione Totale</el-button>
        <el-button v-if="selectedLocations && !selectedRegioni" @click="selectedRegioni = !selectedRegioni" type="success">Visualizza Province</el-button>
        <el-button type="primary" @click.prevent="esporta">Esporta</el-button>
      </el-form>
    </el-col>
  </el-row>
   <el-row style="padding-top:40px" >
     <el-col :span="9"> 
       <radio-svg-map  style="width:80% !important" v-model="selectedLocations" :map="map" />
       <div style="display:flex; justify-content:space-around">
         <div style="text-align:center">
          <div style="background-color:#c3d5ee; width:80px;height:30px;" /><span style="font-size:8.5pt">Min. di 250</span>
         </div>
         <div style="text-align:center">
          <div style="background-color:#87aade; width:80px;height:30px;" /><span style="font-size:8.5pt">Tra 251 e 1000</span>
         </div>
         <div style="text-align:center">
          <div style="background-color:#5f8dd2; width:80px;height:30px;" /><span style="font-size:8pt">Tra 1001 e 5000</span>
         </div>
         <div style="text-align:center">
          <div style="background-color:#244980; width:80px;height:30px;" /><span style="font-size:8pt">Tra 5001 e 10000</span>
         </div>
         <div style="text-align:center">
          <div style="background-color:#003380; width:80px;height:30px;" /><span style="font-size:7.5pt">Tra 10001 e 25000</span>
         </div>
         <div style="text-align:center">
          <div style="background-color:#162c4f; width:80px;height:30px;" /><span style="font-size:8.5pt">Mag. di 25001</span>
         </div>

       </div>
     </el-col>
     <el-col  :span="15"> 
       <div v-if="!selectedRegioni">
        <el-row style="padding:15px " >
          <el-col :span="12" style="padding-right:15px"> 
            <table-italy :data="totaleData" :title="'Utenze Attive'" />
          </el-col>
          <el-col :span="12" style="padding-left:15px"> 
            <table-italy :data="fasceEta" :title="'Fasce Età'" />
          </el-col>
        </el-row>
        <el-row style="padding-top:20px;padding-left:20px;padding-right:20px" >
          <el-col :span="12"  style="padding-right:15px"> 
            <table-italy :data="pagamentoData" :title="'Mod. di Pagamento'" />
          </el-col>
          <el-col :span="12"  style="padding-left:15px"> 
            <table-italy :data="invioData" :title="'Mod. Invio Fatture'" />
          </el-col>
        </el-row>
       </div>
       <div v-else>
         <el-row style="padding:20px " >
         <el-col :span="24" style="padding-right:15px"> 
            <table-italy style="height:650px;overflow-y: auto; " @selectRegion="handleChangeRegion" :clickableRegion="true" :data="regioniData" :title="'Regioni Italiane'" />
          </el-col>
       </el-row>
       </div>
     </el-col>
  </el-row>
</div>
</template>

<script>
import { SvgMap,RadioSvgMap  } from "vue-svg-map";
import Italy from "@svg-maps/italy";
import TableItaly from '@/components/rcu/tableItaly.vue';
import { mappa_italia } from 'assets/app_config.json'
import { mappa_italia_reversed } from 'assets/app_config.json'

export default {
	components: {
		SvgMap,
    RadioSvgMap,
    TableItaly 
	},
  watch: {
    async selConvertLocation(to,from) {
      this.selectedRegioni = false
      await this.updateAll()
    },
  },
  async mounted() {
    if(this.$store.state.tenant_gas === 'ugm' || this.$cookies.get('tenant_gas') === 'ugm') {
      await this.getLastImport()
      if(this.annoSelezionato){
        for(let i = 0; i<5; i++){ this.ultimi5anni.push((new Date().getFullYear()-i).toString())}
        await this.test()
      }
    }else {
      this.$router.push('/rcu-ee/cc/dashboard')}
  },
  computed:{
    colorRegioni(){
      let obj = {}
      for(let i in this.regioniData) {
        switch(true) {
          case this.regioniData[i].totale < 250 : 
            obj[this.regioniData[i].descrizione] = '#c3d5ee'
            break
          case this.regioniData[i].totale > 250 &&  this.regioniData[i].totale < 1000 : 
            obj[this.regioniData[i].descrizione] = '#87aade'
            break
          case this.regioniData[i].totale > 1000 &&  this.regioniData[i].totale < 5000 : 
            obj[this.regioniData[i].descrizione] = '#5f8dd2'
            break
          case this.regioniData[i].totale > 5000 &&  this.regioniData[i].totale < 10000 : 
            obj[this.regioniData[i].descrizione] = '#244980'
            break
          case this.regioniData[i].totale > 10000 &&  this.regioniData[i].totale < 25000 : 
            obj[this.regioniData[i].descrizione] = '#003380'
            break
          case this.regioniData[i].totale > 25000 : 
            obj[this.regioniData[i].descrizione] = '#162c4f'
            break
        }
      }
      return obj
    },
    map() {
      return {
        ...Italy,
        locations: Italy.locations.map((location) => {
            return {
              ...location,
              style: `fill: ${this.colorRegioni[mappa_italia[location.id]]};cursor: pointer;`,
            };
          return location;
        }),
      }
    },
    selConvertLocation() { return mappa_italia[this.selectedLocations]},
  },
  methods: {
    esporta(){
      let self = this
      const loading = this.$loading({
        lock: true,
        text: 'Stiamo Caricando il tuo file',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$axios.post('/api/rcu-gas/udd/italy-map-export/', {
        regione: this.selConvertLocation,
        mese: this.mesi.indexOf(this.meseSelezionato)+1,
        anno: this.annoSelezionato},{
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
    handleChangeRegion(val){
      this.selectedLocations = val
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
        mese: this.mesi.indexOf(this.meseSelezionato)+1,
        anno: this.annoSelezionato
      }
      }).then(
      async ({data}) => {
        await this.test()
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
    async getLastImport() {
      await this.$axios.get('/api/rcu-gas/udd/last-import', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        }
      }).then(
      ({data}) => {
        if(data.data && data.data.length > 0) {
          this.annoSelezionato = data.data[0].ANNO.toString()
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
     async test() {
      await this.$axios.get('/api/rcu-gas/udd/italy-map', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          regione: this.selConvertLocation,
          mese: this.mesi.indexOf(this.meseSelezionato)+1,
          anno: this.annoSelezionato
        }
      }).then(
      ({data}) => {
        this.regioniData = []
        this.parcoTotale = data.data.totale
        this.parcoRegioni = data.data.regioni
        this.totaleData = [
          {descrizione : "Uomini",totale: this.parcoTotale.tot_uomo, percentuale: (this.parcoTotale.tot_uomo / this.parcoTotale.totale *100).toFixed(2)},
          {descrizione : "Donne",totale: this.parcoTotale.tot_donna, percentuale: (this.parcoTotale.tot_donna / this.parcoTotale.totale *100).toFixed(2)},
          {descrizione : "Partita Iva",totale: this.parcoTotale.tot_piva, percentuale: (this.parcoTotale.tot_piva / this.parcoTotale.totale *100).toFixed(2)},
        ]

        this.fasceEta = [
          // {descrizione : "Non Definito",totale: this.parcoTotale.tot_piva, percentuale: (this.parcoTotale.tot_piva / this.parcoTotale.totale *100).toFixed(2)},
          {descrizione : "Under 25",totale: this.parcoTotale.etaUnder24, percentuale: (this.parcoTotale.etaUnder24 / this.parcoTotale.totale *100).toFixed(2)},
          {descrizione : "25-34",totale: this.parcoTotale.eta25_34, percentuale: (this.parcoTotale.eta25_34 / this.parcoTotale.totale *100).toFixed(2)},
          {descrizione : "35-44",totale: this.parcoTotale.eta35_44, percentuale: (this.parcoTotale.eta35_44 / this.parcoTotale.totale *100).toFixed(2)},
          {descrizione : "45-54",totale: this.parcoTotale.eta45_54, percentuale: (this.parcoTotale.eta45_54 / this.parcoTotale.totale *100).toFixed(2)},
          {descrizione : "55-64",totale: this.parcoTotale.eta55_64, percentuale: (this.parcoTotale.eta55_64 / this.parcoTotale.totale *100).toFixed(2)},
          {descrizione : "Over 65",totale: this.parcoTotale.etaOver65, percentuale: (this.parcoTotale.etaOver65 / this.parcoTotale.totale *100).toFixed(2)},
        ]

        this.pagamentoData = [
          {descrizione : "SDD",totale: this.parcoTotale.tot_sdd, percentuale: (this.parcoTotale.tot_sdd / this.parcoTotale.totale *100).toFixed(2)},
          {descrizione : "Non SDD",totale: this.parcoTotale.tot_no_sdd, percentuale: (this.parcoTotale.tot_no_sdd / this.parcoTotale.totale *100).toFixed(2)},
        ]

        this.invioData = [
          {descrizione : "Cartaceo",totale: this.parcoTotale.tot_bollettino, percentuale: (this.parcoTotale.tot_bollettino / this.parcoTotale.totale *100).toFixed(2)},
          {descrizione : "Digitale",totale: this.parcoTotale.tot_digitale, percentuale: (this.parcoTotale.tot_digitale / this.parcoTotale.totale *100).toFixed(2)},
        ]
        for (const [key, value] of Object.entries(this.parcoRegioni)) {
          let object = {}
          object[key] = value
          this.regioniData.push({descrizione: key, totale:value,percentuale: (value / this.parcoTotale.totale *100).toFixed(2)})
        }
        this.loading = false
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    }
  },
	data() {
		return {
      ultimi5anni: [],
      annoSelezionato: '',
      meseSelezionato: '',
      mesi: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
      activeName: 'first',
      loading:true,
      fasceEta: [],
      invioData: [],
      totaleData: [],
      pagamentoData: [],
      regioniData: [],
      parcoTotale: null,
      parcoRegioni: null,
      selectedRegioni: false,
			Italy,
      selectedLocations: ""
		};
	}
};
</script>

<style src="vue-svg-map/dist/index.css">
</style>
<style>
.svg-map__location{
  fill: #c3d5ee;
}
.svg-map__location[aria-checked="true"]{
  fill: #f4bc44 !important;
}
</style>