<template>
  <div>
    <el-row   :gutter="40">
      <el-col :span="14">
        <span style="font-size:20pt; font-weight:600">Dashboard</span>
      </el-col>
      <el-col style="text-align:right" :span="10">
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
    <el-row style="padding-top:30px" :gutter="20">
      <el-col :span="8">
          <div class="grid-content bg-purple">
          <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Riassunto Competenza</span>
        </div>
          <tabella-societa :table="table" />
          </el-card>
          </div>
      </el-col>
      <el-col :span="9">
        <graficomensile :colors="['#40c9c6','#40cd88','#3fd147','#7cd43e','#c4d83e','#dca73d','#e05e3c','#e43b66','#e83ab7','#cc39eb','#7a38ef',,'#374bf3','#36a3f7']" :table="table"/>
      </el-col>
      <el-col :span="7" class="card-panel-col">
        <el-card >
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <i class="el-icon-user-solid card-panel-icon"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                And. {{annoSelezionato}} N Pod
              </div>
                <span>adasdasdaasdasdasd</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TabellaSocieta from '@/components/fatturazione_passiva/tabellaSocieta.vue'
import Graficomensile from '@/components/fatturazione_passiva/graficomensile.vue'

export default {
 components: {
    TabellaSocieta,
    Graficomensile
  },
  data() {
    return {
      dialogTableVisible: false,
      ultimi5anni: [],
      annoSelezionato: '',
      meseSelezionato: '',
      fornitoreSelezionato: '',
      fornitori:[],
      table: [],
      mesi: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
    }
  },

  async mounted() {
    for(let i = 0; i<5; i++){ this.ultimi5anni.push((new Date().getFullYear()-i).toString())}
    this.annoSelezionato = new Date().getFullYear().toString()
    this.meseSelezionato = this.mesi[new Date().getMonth()].toString()
    await this.getFornitore()
    await this.tableInformation()
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

<style >
.competenza-group {
	 margin-top: 18px;
}
 .competenza-group .card-panel-col {
	 margin-bottom: 32px;
}
 .competenza-group .card-panel {
	 height: 108px;
	 /* cursor: pointer; */
	 font-size: 12px;
	 position: relative;
	 overflow: hidden;
	 color: #666;
	 box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
	 border-color: rgba(37, 3, 3, 0.05);
}
 .competenza-group .card-panel:hover .card-panel-icon-wrapper {
	 color: #fff;
}
 .competenza-group .card-panel:hover .icon-people {
	 background: #40c9c6;
}
 .competenza-group .card-panel:hover .icon-message {
	 background: #36a3f7;
}
 .competenza-group .card-panel:hover .icon-money {
	 background: #f4516c;
}
 .competenza-group .card-panel:hover .icon-shopping {
	 background: #34bfa3;
}
 .competenza-group .card-panel .icon-people {
	 color: #40c9c6;
}
 .competenza-group .card-panel .icon-message {
	 color: #36a3f7;
}
 .competenza-group .card-panel .icon-money {
	 color: #f4516c;
}
 .competenza-group .card-panel .icon-shopping {
	 color: #34bfa3;
}
 .competenza-group .card-panel .card-panel-icon-wrapper {
	 float: left;
	 margin: 14px 0 0 14px;
	 padding: 16px;
	 transition: all 0.38s ease-out;
	 border-radius: 6px;
}
 .competenza-group .card-panel .card-panel-icon {
	 float: left;
	 font-size: 38px;
}
 .competenza-group .card-panel .card-panel-description {
	 float: right;
	 font-weight: bold;
	 margin: 26px;
	 margin-left: 0px;
}
 .competenza-group .card-panel .card-panel-description .card-panel-text {
	 line-height: 18px;
	 color: rgba(0, 0, 0, 0.45);
	 font-size: 14px;
	 margin-bottom: 12px;
}
 .competenza-group .card-panel .card-panel-description .card-panel-num {
	 font-size: 20px;
}
 /* @media (max-width: 550px) {
	 .card-panel-description {
		 display: none;
	}
	 .card-panel-icon-wrapper {
		 float: none !important;
		 width: 100%;
		 height: 100%;
		 margin: 0 !important;
	}
	 .card-panel-icon-wrapper .svg-icon {
		 display: block;
		 margin: 14px auto !important;
		 float: none !important;
	}
} */
 
</style>
