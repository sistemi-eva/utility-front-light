<template>
    <div>
      <h2><i class="el-icon-lock"></i> Impostazioni</h2>
       <el-button 
          v-if="status_cache != 'in_lavorazione'"
          @click="deleteCache" 
          type="primary" icon="el-icon-delete">Elimina Tutta la Cache</el-button>
          <el-button v-if="status_cache != 'cached_old'" :loading="status_cache == 'in_lavorazione' ? true : false" 
              :disabled="status_cache == 'cached' ? true : false"  @click="refreshCache" 
              type="primary" icon="el-icon-refresh">{{status_cache == 'in_lavorazione' ? 'Cache in aggiornamento' : 'Aggiorna Cache'}}</el-button>
      <el-divider></el-divider>
      <div class="admin-panel">
      <!-- PERMESSI ROTTE -->
      <el-card class="box-card" id="settings">
        <div slot="header" class="clearfix">
          <span>Permessi Rotte</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">Visualizza tutti</el-button> -->
        </div>
        <div v-for="rotta in rotte" :key="rotta.name" class="text item">
          <span>{{rotta.name}}</span>
          <el-button @click="openTab(rotta)">Modifica</el-button>
        </div>
      <!-- LOGS -->
      </el-card>
      <el-card class="box-card" id="settings">
        <div slot="header" class="clearfix">
          <span>Logs</span>
          <el-button style="float: right; padding: 3px 0" type="text">Visualizza tutti</el-button>
        </div>
        <div v-for="o in 4" :key="o" class="text item">
          
        </div>
      </el-card>
      </div>
      <el-dialog
        class="dialog-panel"
        :title="'Permessi rotta ' + choosedRotta.name"
        :visible.sync="dialogTab"
        >
        <div class="dialog-content">
          <div class="content-left">
           <el-card class="box-card dialog-card">
              <div slot="header" class="clearfix">
                <div class="tab-name">
                  <div>
                  <span>Utenti LDAP</span>
                  </div>
                  <div v-if="cloneLdapUser">
                    {{cloneLdapUser.length + ' Elementi'}}
                  </div>
                </div>
              </div>
              <draggable class="column" :list="cloneLdapUser" group="people" @end="onEnd">
                <transition-group>
                    <div v-for="element in cloneLdapUser" :key="element.username" class="text item">
                        <div class="element">
                          {{element.username}}
                        </div>
                    </div>
                </transition-group>
            </draggable>
              
            </el-card>
          </div>
          <div class="content-right">
            <el-card class="box-card dialog-card">
              <div slot="header" class="clearfix">
                <div class="tab-name">
                  <div>
                  <span>Permessi della rotta {{choosedRotta.name}}</span>
                  </div>
                  <div  v-if="choosedRotta.member_of">
                    {{choosedRotta.member_of.length + ' Elementi'}}
                  </div>
                </div>
              </div>
              <draggable class="column" :list="choosedRotta.member_of" group="people">
                <transition-group>
                    <div v-for="element in choosedRotta.member_of" :key="element.username" class="text item">
                        <div class="element">
                          {{element.username}}
                        </div>
                    </div>
                </transition-group>
            </draggable>
            </el-card>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogTab = false">Annulla</el-button>
          <el-button type="primary" @click="updateRoute()">Conferma</el-button>
        </span> 
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'admin-settings',
  async mounted(){
    await this.statusCache()
    await this.callResource()
    await this.$axios.$get('/api/admin/route-permissions', {
          headers: {
            'Secret-Key': this.$store.getters['authToken'] 
          }
        }).then(
          (data) => {
            this.rotte = data.data
          }
        ).catch((error)=>{
          this.$message({
            showClose: true,
            message: error.response.data.message
          })
        })
        
  },
  data: () => {
    return {
      status_cache: null,
      choosedRotta : [],
      dialogTab : false,
      ldapUser: [],
      cloneLdapUser: [],
      rotte:[],
      asideWidth: '280px'
    }
  },
  computed: {
  },
  watch:{
    async 'choosedRotta' (to, from){
      await this.callResource()
      this.cloneLdapUser = JSON.parse(JSON.stringify(this.ldapUser))
      for(let i in this.cloneLdapUser) {
          for(let k in this.choosedRotta.member_of) {
            if(this.cloneLdapUser[i].username === this.choosedRotta.member_of[k].username) this.cloneLdapUser.splice(i, 1);
          }
        }
    }
  },
  methods: {
    statusCache(){
      this.$axios.get('/api/admin/status-all-cache', {
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
      this.$axios.get('/api/admin/delete-all-cache', {
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
      this.$axios.get('/api/admin/refresh-all-cache', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
      }).then(
      async ({data}) => {
        this.$notify({
          title: 'Cache in aggiornamento',
          message: 'La richiesta di aggiornamento della cache è andata a buon fine',
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
    async callResource(){
      await this.$axios.$get('/api/admin/ldap-users', {
          headers: {
            'Secret-Key': this.$store.getters['authToken'] 
          }
        }).then(
          (data) => {
            this.ldapUser = data.data
          }
        )
    },
    openTab(rotta){
      this.choosedRotta = rotta
      this.dialogTab = true
    },
    onEnd(){
    },
    updateRoute(){
      this.$axios.post('/api/admin/update-route', { route: this.choosedRotta},
        { headers:{'Secret-Key' : this.$store.getters['authToken']},}
        ).then((res)=> {
          this.ldapUser = res.data
          this.$message.success("Modifica permessi effettuata correttamente");
          this.dialogTab = false
        }).catch((error)=> {
          this.$message({
            showClose: true,
            message: error.response.data.message
          })
        })
    }
  }
}
</script>

<style>
.tab-name{
  display:flex; 
  justify-content:space-between;
  align-items: center;
}

.element{
  margin-bottom: 15px;
  border-radius: 10px;
  font-size: 15pt;
  padding:20px;
  width:100%;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  cursor: pointer;
  transition: 0.4s;
}
.dialog-card{
  width: 500px !important;
  
}
#settings .el-card__body {
  padding:30px;
  min-height: 550px;
  max-height:600px; 
  overflow-y: scroll
}
.content-left{
  min-height: 500px;
}
.el-dialog{
  margin-top:10vh !important;
  width: 70%;
  min-height: 80% ! important;
}
.dialog-content{
  display: flex;
  justify-content: space-around;
}
.admin-panel{
  display: flex;
  justify-content: space-around;
}
.text {
    font-size: 14px;
  }

  .item {
    display: flex;
    margin-bottom: 18px;
    justify-content: space-between;
    align-items: center;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  #settings  {
    width: 600px;
    min-height: 350px;
  }
  .column {
    display: block; 
    height: 300px;
  }
 .column span {
    display: block; 
    height: 270px;
  }
</style>

