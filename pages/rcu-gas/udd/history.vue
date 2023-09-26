<template>
    <div>
       <importa v-if="importa" v-model="importa" @updateStatus="handleUpdateClick"/>
       <esporta v-if="esporta" v-model="esporta" />
       <check v-if="check" v-model="check" />
      <el-row class="title-container">
        <el-col :span="4">
          <h2><i class="el-icon-s-order"></i> RCU UDD</h2>
        </el-col>
        <el-col :span="10">
          <div style="padding-right:15px;padding-left:15px">
            <el-input placeholder="Ricerca" v-model="search"></el-input>
          </div>
        </el-col>
        <el-col :span="14" style="text-align:right">
          <span v-if="!!status_cache">
            <el-button v-if="status_cache != 'cached_old'" :loading="status_cache == 'in_lavorazione' ? true : false" 
              :disabled="status_cache == 'cached' ? true : false"  @click="refreshCache" 
              type="primary" icon="el-icon-refresh">{{status_cache == 'in_lavorazione' ? 'Cache in aggiornamento' : 'Aggiorna Cache'}}</el-button>
            <el-button v-else :loading="status_cache == 'in_lavorazione' ? true : false" 
              :disabled="status_cache == 'cached' ? true : false"  @click="refreshCache" 
              type="danger" icon="el-icon-refresh">Aggiorna cache con ultima versione</el-button>
            <el-button 
                v-if="status_cache != 'in_lavorazione'"
                @click="deleteCache" 
                type="primary" icon="el-icon-delete">Elimina Cache</el-button>
          </span>
          <el-button @click="showCheck" type="primary" icon="el-icon-document">Controlli</el-button>
          <el-button @click="showEsporta" type="primary" icon="el-icon-document">Esporta</el-button>
          <el-button  @click="showImporta" type="primary"  icon="el-icon-plus">Importa</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-alert
        v-if="showWarning == 'in lavorazione'"
        type="warning"
        description="Al momento sono in corso già piu importazioni, attendi la fine per inizarne una nuova"
        show-icon
        :closable="false">
        <span slot="title">
          <span class="el-alert__title is-bold">Importazione in corso</span>
          <span style="position: absolute; right: 0px; padding-right:10px" >
            <span @click.prevent="handleUpdateClick" style="color:#409EFF" class="is-bold is-link">Aggiorna</span>
          </span>
        </span>
      </el-alert>
      <el-alert
        v-else
        title="Puoi avviare una nuova importazione "
        type="success"
        description="Recati nella schermata apposita per iniziare una nuova importazione"
        show-icon
        :closable="false">
        <span slot="title">
          <span class="el-alert__title is-bold">Ci sono meno di 4 importazioni attiva al momento</span>
          <span style="position: absolute; right: 0px; padding-right:10px" @click="fetchStatusContent">
            <span @click.prevent="handleUpdateClick" style="color:#409EFF" class="is-bold is-link">Aggiorna</span>
          </span>
        </span>
      </el-alert>
      <el-divider></el-divider>
      <el-table
        :data="pagedTableData"
        :row-class-name="tableRowClassName"
        style="width: 100%"
        >
        <el-table-column
          prop="id"
          label="ID Importazione"
          width="130"
          >
        </el-table-column>
        
        <el-table-column
          prop="note"
          label="Note Aggiuntive"
          align="center"
        >
        </el-table-column> 
        <!-- <el-table-column
          prop="note"
          label="Note"
          align="center"
          >
        </el-table-column> -->
        <el-table-column
          prop="mese"
          label="Mese"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="anno"
          label="Anno"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="importati"
          label="Elementi Importati"
          align="center"
        >
        </el-table-column> 
        <el-table-column
          prop="status"
          label="Stato Importazione"
          align="center"
        >
        <template slot-scope="scope">
          <i v-if="scope.row.logs_in_error" style="color:red" class="el-icon-warning"></i>
          <i v-if="scope.row.status == 'completato' && !scope.row.logs_in_error" class="el-icon-circle-check"></i>
          <i v-if="scope.row.status == 'in lavorazione'" class="el-icon-warning"></i>
          <i v-if="scope.row.status == 'in errore'" class="el-icon-error"></i>
        </template>
        </el-table-column>      
        <el-table-column
          prop="start_date"
          label="Data Inizio"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="end_date"
          label="Data Fine"
          align="center"
          >
        </el-table-column>
      <el-table-column
          align="center"
          label="Creatore"
          width="340px">
      <template slot-scope="scope">
        <div class="tooltip"> 
          <el-tag>{{scope.row.owner}}</el-tag>
          <span v-if="permissions.includes('admin') && scope.row.owner_ip" class="tooltiptext">{{scope.row.owner_ip}}</span>
        </div>
        </template>
      </el-table-column>
      <el-table-column
        label="Azioni"
        align="center"
      >
      <template slot-scope="scope">
            <el-button type="success" icon="el-icon-document" circle size="mini" @click.prevent="downloadCSV(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click.prevent="deleteFatt(scope.row.id)"></el-button>
      </template>
      </el-table-column>  
      </el-table>
      <el-pagination  layout="prev, pager, next" :current-page.sync="page"  :page-size="pageSize" :total="total" @current-change="setPage">
      </el-pagination>
    </div>
</template>

<script>
import esporta from '@/components/rcu-gas/udd/esporta.vue'
import importa from '@/components/rcu-gas/udd/importa.vue'
import check from '@/components/rcu-gas/udd/check.vue'

export default {
  components: { importa, esporta,check},
  computed: {
    permissions() {
      return this.$store.getters['authPermissions']
    },
    pagedTableData() {
      const temps = this.history.filter(data => !this.search 
       || data.id.toString().toLowerCase().includes(this.search.toLowerCase()) 
       || data.importati.toString().toLowerCase().includes(this.search.toLowerCase()) 
       || data.owner.toLowerCase().includes(this.search.toLowerCase()) 
       || data.note.toLowerCase().includes(this.search.toLowerCase())
       || data.anno.toString().toLowerCase().includes(this.search.toLowerCase())
       || data.mese.toString().toLowerCase().includes(this.search.toLowerCase())
       )
       this.total = temps.length
       return temps.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page)
     }
    },
    data: () => {
    return {
        status_cache: null,
        page: 1,
        pageSize: 9,
        history:[],
        showWarning:false,
        esporta: false,
        importa: false,
        check:false,
        testata:false,
        fornitori:false,
        normalizzazione:false,
        search:'',
        fileList : [],
        uploadPercentage: 0
    }
  },
  async mounted() {
    await this.statusCache()
    this.fetchStatusContent()
    this.fetchFolderContent()
  },
  methods: {
    statusCache(){
      this.$axios.get('/api/rcu-gas/udd/status-cache', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
      }).then(
      ({data}) => {
        this.status_cache = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
     },
     deleteCache(){
      this.$axios.get('/api/rcu-gas/udd/delete-cache', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
      }).then(
      async ({data}) => {
        this.$notify({
          title: 'Cache Eliminata Con successo',
          message: 'La richiesta di eliminazione della cache è andata a buon fine',
          type: 'success'
        });
        await this.statusCache()
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
     },
     refreshCache(){
      this.$axios.get('/api/rcu-gas/udd/refresh-cache', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
      }).then(
      async ({data}) => {
        this.$notify({
          title: 'Refresh cache avviato',
          message: 'La richiesta di refresh della cache è stata presa in carico, tra qualche minuto le query di default verranno popolate',
          type: 'success'
        });
        setTimeout(async ()=>{
          await this.statusCache()
        },2000)
        
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
     },
    downloadCSV(id){
      const loading = this.$loading({
        lock: true,
        text: 'Stiamo effettuando la tua richiesta',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$axios.post('/api/rcu-gas/udd/download-file', {id},{
         headers:{'Secret-Key' : this.$store.getters['authToken']},
         responseType: 'arraybuffer',
       })
       .then(function(response){
         const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'esport_'+id+'.csv'); //or any other extension
          document.body.appendChild(link);
          link.click();
          loading.close();
          location.reload()
        })
      .catch(function(e){
        loading.close();
      });
    },
     deleteFatt(id){
       this.$confirm('Ricorda che verrano eliminati tutti i record relativi questa importazione.', 'Sei sicuro di voler cancellare questo elemento?', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Annulla',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'Stiamo effettuando la tua richiesta',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$axios.post('/api/rcu-gas/udd/delete-fatturazione', 
            {id},
            {
              headers:{'Secret-Key' : this.$store.getters['authToken']
            },
            }).then(
            ({data}) => {
              this.history = data.data
              loading.close()
              this.$notify({
                title: 'Operazione avviata con successo',
                message: 'Operazione avviata con successo',
                type: 'success'
              });
            },
            error => {
              loading.close()
              this.$message({
                showClose: true,
                message: error.response.data.message
              })
            })
          }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Eliminazione annullata'
          });          
        });
     },
     setPage (val) {
        this.page = val
      },
     fetchFolderContent() {
      this.$axios.get('/api/rcu-gas/udd/history', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
      }).then(
      ({data}) => {
        this.history = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
     tableRowClassName({row, rowIndex}) {
        if (row.status == 'completato') {
          return 'success-row';
        } else if (row.status == 'in lavorazione') {
          return 'warning-row';
        } else if (row.status == 'in errore') {
          return 'error-row';
        }
        return '';
      },
     handleUpdateClick(val){
      const loading = this.$loading({
        lock: true,
        text: 'Stiamo Aggiornando le risorse',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(async () => {
        await this.fetchStatusContent()
        await this.fetchFolderContent()
        loading.close()
      },1000)
    },
     fetchStatusContent() {
      this.$axios.get('/api/rcu-gas/udd/status', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        }
      }).then(
      ({data}) => {
        this.showWarning = data.data.status
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
     showImporta(){
       this.importa = true
     },
     showEsporta(){
        this.esporta = true
     },
     showCheck(){
       this.check = true
     }
    },

}
</script>

<style>
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  margin-left: 10px;
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
}
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .error-row {
    background: rgb(253, 230, 230);
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .title-container{
    display: flex;
    align-items: center;
  }
</style>