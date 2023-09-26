<template>
  <div style="padding-left:70px;padding-right:70px;">
    <el-row style="padding-bottom:40px" :gutter="40">
      <el-col :span="13">
        <span style="font-size:20pt; font-weight:600">Dashboard</span>
      </el-col>
      <el-col style="text-align:right" :span="11">
        <el-form ref="form" label-width="120px">
          <el-select @change="updateAll" v-model="fornitoreSelezionato" placeholder="Fornitore">
            <el-option
              v-for="item in fornitori"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
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
    <el-row :gutter="24">
      <el-col :span="5">
        <el-card class="card-item first-row">
          <div class="card-detail">
            <i style="font-size: 2rem;padding-bottom:10px;color:#0d6ce1" class="el-icon-coin"></i>
            <span class="card-title-text">
              Totale Imponibile Fattura
            </span>
            <span class="card-total-text">
               <count-to v-if="totalFattura.imponibile_totale" :start-val="0" separator="." :decimals="0" :end-val="Number(totalFattura.imponibile_totale)" :duration="3600" />
            </span>
          </div>
        </el-card>
        <el-card class="card-item second-row">
          <div class="card-detail-mini">
            <div class="left-detail">
              <span class="card-total-text">
               <count-to v-if="totalCompetenza.imponibile_totale" :start-val="0" separator="." :decimals="0" :end-val="Number(totalCompetenza.imponibile_totale)" :duration="3600" />
              </span>
              <span class="card-mini-title-text">
                Totale Competenza 
              </span>
            </div>
            <i style="font-size: 2rem;padding-bottom:10px;color: #0d6ce1" class="el-icon-money"></i>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card class="card-item first-row">
          <div class="card-detail">
            <i style="font-size: 2rem;padding-bottom:10px;color: yellow" class="el-icon-s-opportunity "></i>
            <span class="card-title-text">
              Totale Kwh Fattura
            </span>
            <span class="card-total-text">
               <count-to v-if="totalFattura.imponibile_totale" :start-val="0" separator="." :decimals="0" :end-val="Number(totalFattura.kwh_lorda)" :duration="3600" />
            </span>
          </div>
        </el-card>
         <el-card class="card-item second-row">
          <div class="card-detail-mini">
            <div class="left-detail">
              <span class="card-total-text">
               <count-to v-if="totalCompetenza.imponibile_totale" :start-val="0" separator="." :decimals="0" :end-val="Number(totalCompetenza.kwh_lorda)" :duration="3600" />
              </span>
              <span class="card-mini-title-text">
                Totale Competenza 
              </span>
            </div>
            <i style="font-size: 2rem;padding-bottom:10px;color: yellow" class="el-icon-s-opportunity"></i>
          </div>
        </el-card>
        
      </el-col>
      <el-col :span="5">
        <el-card class="card-item first-row">
          <div class="card-detail">
            <i style="font-size: 2rem;padding-bottom:10px;color: purple" class="el-icon-data-analysis"></i>
            <span class="card-title-text">
              Differenza
            </span>
            <span class="card-total-text">
              <count-to v-if="totalFattura.differenza" :start-val="0" separator="." decimal="," :decimals="6" :end-val="Number(totalFattura.differenza)" :duration="3600" />
            </span>
          </div>
        </el-card>
        <el-card class="card-item second-row">
          <div class="card-detail-mini">
            <div class="left-detail">
              <span class="card-total-text">
               <count-to v-if="totalCompetenza.differenza" :start-val="0" separator="." decimal="," :decimals="6" :end-val="Number(totalCompetenza.differenza)" :duration="3600" />
              </span>
              <span class="card-mini-title-text">
                Differenza Competenza 
              </span>
            </div>
            <i style="font-size: 2rem;padding-bottom:10px;color: purple" class="el-icon-data-analysis"></i>
          </div>
        </el-card>
      </el-col>
      <el-col :span="9">
      <el-card class="card-item chart">

      </el-card>
    </el-col>
    </el-row>
    <div style="padding-top:35px">
      Dettaglio Competenza
      <el-row style="padding-top:10px;padding-bottom:35px" :gutter="24">
        <el-col v-for="item in tableCompetenza" :key="item.key" :span="4">
          <el-card class="card-item second-row">
            <div class="card-detail-mini">
              <div class="left-detail">
                <span class="card-total-text">
                  <count-to v-if="item.value" :start-val="0" separator="." decimal="," :decimals="3" :end-val="Number(item.value)" :duration="3600" />
                </span>
                <span class="card-disp-title-text">
                  {{item.key}}
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      Dispacciamento 
      <el-row style="padding-top:10px" :gutter="24">
        <el-col v-for="item in tableDispCompetenza" :key="item.key" :span="4">
          <el-card class="card-item second-row">
            <div class="card-detail-mini">
              <div class="left-detail">
                <span class="card-total-text">
                  <count-to v-if="item.value" :start-val="0" separator="." decimal="," :decimals="10" :end-val="Number(item.value)" :duration="3600" />
                </span>
                <span class="card-disp-title-text">
                  {{item.key}}
                </span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      dialogTableVisible: false,
      ultimi5anni: [],
      annoSelezionato: '',
      meseSelezionato: '',
      fornitoreSelezionato: '',
      fornitori:[],
      tableCompetenza: [],
      tableDispCompetenza: [],
      totalCompetenza: {},
      totalFattura: {},
      mesi: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
        disp: [
          {key:'EUR_KWH_DISP_ART_44_3',value: '0,00912800'},
          {key:'EUR_KWH_DISP_ACC_ART_45_2',value: '0,00261200'},
          {key:'EUR_KWH_DISP_ART_46',value: '0,00039700'},
          {key:'EUR_KWH_DISP_ART_48',value: '0,00074000'},
          {key:'EUR_KWH_DISP_ART_73',value: '0,00116800'},
          {key:'EUR_KWH_DISP_ACC_ART_44BIS',value: '0,00003000'},
        ],
        imp: [
          {key:'IMP_ENERGIA_TOTALE',value: '142594.960'},
          {key:'IMP_TRASP_TOTALE',value: '63279.350'},
          {key:'IMP_DISP_TOTALE',value: '21469.990'},
          {key:'IMP_ONERI_TOTALE',value: '-772.920'},
          {key:'IMP_A_UC_TOTALE',value: '101671.360'},
          {key:'IMP_ONERI_CTS',value: '0.000'},
          {key:'IMP_CMOR',value: '2913.690'},
          {key:'BONUS_DIS_ECONOMICO',value: '-3588.900'},
          {key:'BONUS_DIS_FISICO',value: '-588.900**'},
        ]
      }
  },
    async mounted() {
    for(let i = 0; i<5; i++){ this.ultimi5anni.push((new Date().getFullYear()-i).toString())}
    this.annoSelezionato = new Date().getFullYear().toString()
    this.meseSelezionato = this.mesi[new Date().getMonth()].toString()
    // this.meseSelezionato = this.mesi[new Date().getMonth()-1].toString()
    await this.getFornitore()
    await this.tableInformation()
    await this.tableDispacciamentoInformation()
    await this.competenzaTotaleInformation()
    await this.fatturaTotaleInformation()
  },
  

  methods: {
    async esporta(){

    },
    async getFornitore() {
      await this.$axios.get('/api/fatturazione-passiva/fornitori', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
      }).then(
      ({data}) => {
        this.fornitori = data.data
        this.fornitoreSelezionato = data.data[0].name
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async tableInformation() {
      this.$axios.get('/api/fatturazione-passiva/table-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          mese: this.mesi.indexOf(this.meseSelezionato)+1,
          anno: this.annoSelezionato,
          fornitore: this.fornitoreSelezionato
        }
      }).then(
      ({data}) => {
        this.tableCompetenza = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async tableDispacciamentoInformation() {
      this.$axios.get('/api/fatturazione-passiva/table-dispacciamento-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          mese: this.mesi.indexOf(this.meseSelezionato)+1,
          anno: this.annoSelezionato,
          fornitore: this.fornitoreSelezionato
        }
      }).then(
      ({data}) => {
        this.tableDispCompetenza = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async competenzaTotaleInformation() {
      this.$axios.get('/api/fatturazione-passiva/competenza-totale-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          mese: this.mesi.indexOf(this.meseSelezionato)+1,
          anno: this.annoSelezionato,
          fornitore: this.fornitoreSelezionato
        }
      }).then(
      ({data}) => {
        this.totalCompetenza = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
    async fatturaTotaleInformation() {
      this.$axios.get('/api/fatturazione-passiva/fattura-totale-information', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
        params: {
          mese: this.mesi.indexOf(this.meseSelezionato)+1,
          anno: this.annoSelezionato,
          fornitore: this.fornitoreSelezionato
        }
      }).then(
      ({data}) => {
        this.totalFattura = data.data
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
      this.$axios.get('/api/fatturazione-passiva/check-sintesi', {
      headers:{
        'Secret-Key' : this.$store.getters['authToken']
      },
      params: {
        mese: this.mesi.indexOf(this.meseSelezionato)+1,
        anno: this.annoSelezionato,
        fornitore: this.fornitoreSelezionato
      }
      }).then(
      async ({data}) => {
        await this.tableInformation()
        await this.tableDispacciamentoInformation()
        await this.competenzaTotaleInformation()
        await this.fatturaTotaleInformation()
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
  }
}
</script>

<style scoped>
.card-title-text{
  font-weight: 300;
  color: #60626a!important;
  font-size: 1.3em!important;
  white-space: nowrap!important;
}

.card-mini-title-text{
  font-weight: 300;
  color: #60626a!important;
  font-size: 1.1em!important;
  white-space: nowrap!important;
}

.card-disp-title-text{
  font-weight: 300;
  color: #60626a!important;
  font-size: 1.0em!important;
  white-space: nowrap!important;
}
.left-detail{
  display: flex;
  flex-direction: column;
}

.card-total-text{
  font-weight: 600;
  color: #4c5b70!important;
  font-size: 1.7em!important;
  white-space: nowrap!important;
}

.card-detail{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.card-detail-mini{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.card-item{
  box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 8%);
  border-radius: .5rem;
  border: 1px solid #e0e5e8;
  background-color: #fff;
  position: relative;
}

.first-row{
  min-height: 170px;
  max-height: 170px;
}

.second-row{
  margin-top:25px;
  min-height: 120px;
  max-height: 120px;
}

.chart{
  min-height: 315px;
  max-height: 315px;
}
</style>
