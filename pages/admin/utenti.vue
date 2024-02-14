<template>
    <div>
      <h2><i class="el-icon-lock"></i> Utenti</h2>
      <el-button @click="aggiungiUtente()" >Aggiungi Utente</el-button>
      <el-table v-if="utenti.length > 0"
              :data="utenti"
              :default-sort="{ prop: 'username', order: 'ascending' }"
              stripe
              style="width: 100%"
              max-height="425"
              
          >
              <el-table-column
              prop="username"
              label="Username"
              align="left"
              sortable
              width="200"
              />
              <el-table-column
              prop="ruolo"
              label="Ruolo"
              align="left"
              />
              <el-table-column
              prop="tenant"
              label="Tenant"
              align="left"
              />

              <el-table-column
              prop="nominativo"
              label="Nominativo"
              align="left"
              />
              <el-table-column>
                <template slot-scope="scope">
                    <el-button @click="modificaUtente(scope.row)" >Modifica</el-button>
                </template>
              </el-table-column>

              <el-table-column>
                <template slot-scope="scope">
                    <el-button @click="eliminaUtente(scope.row.username)" >Elimina</el-button>
                </template>
              </el-table-column>

          </el-table>

          <ClientOnly>
          <el-dialog
            :visible.sync="aggiungiUtenteModal"
            :title="titoloModal"
            width="30%"
            append-to-body
          >

          <el-input type="hidden" placeholder="Username" v-model="form._username" />
          
          <el-form ref="form" :model="form" label-position="left" label-width="120px">
            <el-form-item label="Username">
              <el-input placeholder="Username" v-model="form.username" />
            </el-form-item>

            <p v-if="action=='modifica utente'">Lascia il campo password bianco per non modificare</p>
            <el-form-item label="Password">
              <el-input type="password" placeholder="Password" v-model="form.password" />
              
            </el-form-item>
            

            <el-form-item label="Tenant">
              <el-select  style="width: 100%" v-model="form.tenant" placeholder="Seleziona"  @change="setTenant($event)">
              <el-option
              v-for="item in tenants"
                :key="item.tenant"
                :label="item.tenant"
                :value="item.tenant"
              >

              </el-option>  
              </el-select>

            </el-form-item>

            <el-form-item label="Ruolo">
              <el-select  style="width: 100%" v-model="form.ruolo" placeholder="Seleziona"  @change="setRuolo($event)">
              <el-option
              v-for="item in ruoli"
                :key="item"
                :label="item"
                :value="item"
              >

              </el-option>  
              </el-select>

            </el-form-item>


            <el-form-item label="Nominativo">
              <el-input placeholder="Nominativo" v-model="form.nominativo" />
            </el-form-item>

            <el-button @click="salvaUtente">Salva</el-button>


           

          </el-form>
          </el-dialog>


        </ClientOnly>
    </div>

    
</template>



<script>


export default {
  name: 'admin-settings',
  async mounted(){

        
  },
  data: () => {
    return {
      action : '',
      titoloModal : "Aggingi utente",
      utenti: [],
      aggiungiUtenteModal: false,
      ruoli: ["admin", "operatore"],
      tenants: [],
      form:{
        _username: '',
        username: '',
        password: '',
        ruolo: '',
        nominativo: ''
      }
    }
  },
  computed: {
  },
  watch:{

  },
  async mounted() {
    this.getUsers();
    this.getTenants();
  },
  methods: {

    setTenant(event){
      this.form.tenant = event

    },

    resetCreaFormUtente(){
      this.form.username = '',
      this.form.password = '',
      this.form.ruolo = '',
      this.form.nominativo = ''
    },

    setRuolo(event){
      this.form.ruolo = event
    },

    getUsers(){
      this.$axios.get('/api/auth/get-admin-users', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        }
      }).then(
      ({data}) => {
        this.utenti = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })

    },

    getTenants(){
      this.$axios.get('/api/auth/get-admin-tenants', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        }
      }).then(
      ({data}) => {
        this.tenants = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })

    },

    eliminaUtente(username){
  
            const h = this.$createElement;
            this.$msgbox({
            title: 'Invio Messaggio',
            message: h('p', null, [
              h('i', { style: 'font-size:12pt' }, 'Sei sicuro di voler eliminare l\'utente?')
            ]),confirmButtonText: 'Si, elimina',
              cancelButtonText: 'Annulla',
              type: 'warning'
            }).then(() => {

              const loading = this.$loading({
                lock: true,
                text: 'Eliminazione corso...attendere prego.',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              })

              const fd = new FormData();
              

              fd.append("username", username)
              

              this.$axios.post('/api/auth/admin-elimina-utente', fd,
              { headers:{'Secret-Key' : this.$store.getters['authToken']},}
              ).then((res)=> {
                loading.close()
                this.$message.success("Utente eliminato");
                this.getUsers();
              }).catch((e)=>{
                console.log("e",e)
                this.$message.error("Errore durante l'eliminazione");
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: 'Eliminazione annullata'
              });          
            });
         
        
    },

    aggiungiUtente(){
      this.titoloModal = "Aggiungi utente"

      this.aggiungiUtenteModal = true
      this.resetCreaFormUtente();
      this.action = "aggiungi utente"
    },

    modificaUtente(row){
      this.form._username = row.username
      this.form.username = row.username
      this.form.ruolo = row.ruolo
      this.form.tenant = row.tenant
      this.form.nominativo = row.nominativo

      this.titoloModal = "Modifica utente"

      this.aggiungiUtenteModal = true
      this.action = "modifica utente"
    },

    doModificaUtente(){
      const h = this.$createElement;
            this.$msgbox({
            title: 'Invio Messaggio',
            message: h('p', null, [
              h('i', { style: 'font-size:12pt' }, 'Sei sicuro di voler modificare l\'utente?')
            ]),confirmButtonText: 'Si, modifica',
              cancelButtonText: 'Annulla',
              type: 'warning'
            }).then(() => {

              const loading = this.$loading({
                lock: true,
                text: 'Modifica corso...attendere prego.',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              })

              const fd = new FormData();
              

              fd.append("_username", this.form._username);
              fd.append("username", this.form.username);
              fd.append("password", this.form.password);
              fd.append("ruolo", this.form.ruolo);
              fd.append("tenant", this.form.tenant);

              fd.append("nominativo", this.form.nominativo);
              

              this.$axios.post('/api/auth/admin-modifica-utente', fd,
              { headers:{'Secret-Key' : this.$store.getters['authToken']},}
              ).then((res)=> {
                loading.close()
                if( res.data.status == "success"){
                  this.$message.success(res.data.message);
                  this.resetCreaFormUtente();
                  this.aggiungiUtenteModal = false
                  this.getUsers()
                }
                else{
                  this.$message.error(res.data.message);
                }
              }).catch((e)=>{
                console.log("e",e)
                this.$message.error("Errore durante la modifica");
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: 'Modifica annullata'
              });          
            });
    },

    salvaUtente(){
      

      if(this.action == "aggiungi utente"){
        this.doSalvaUtente()

      }
      else{
        this.doModificaUtente()
      }
    },


    doSalvaUtente(){

      const fd = new FormData();
              
        fd.append("username", this.form.username);
        fd.append("password", this.form.password);
        fd.append("ruolo", this.form.ruolo);
        fd.append("tenant", this.form.tenant);

        fd.append("nominativo", this.form.nominativo);

        this.$axios.post('/api/auth/admin-crea-utente', fd,
              { headers:{'Secret-Key' : this.$store.getters['authToken'], 'Content-Type': 'application/json'},}
              ).then((res)=> {
                console.log(res.data.status)
                if( res.data.status == "success"){
                  this.$message.success(res.data.message);
                  this.resetCreaFormUtente();
                  this.aggiungiUtenteModal = false
                }
                else{
                  this.$message.error(res.data.message);
                }
                

                this.getUsers();

              }).catch((e)=>{
                console.log("e",e)
                this.$message.error("Errore durante il salvataggio");
              })

       
       }

    },
 
    onEnd(){
    },

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

