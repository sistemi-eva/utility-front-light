<template>
    <div>
      <h2><i class="el-icon-lock"></i> Tenant</h2>
      <el-button @click="aggiungiTenant()" >Aggiungi Tenant</el-button>
      <el-table v-if="tenant.length > 0"
              :data="tenant"
              :default-sort="{ prop: 'tenant', order: 'ascending' }"
              stripe
              style="width: 100%"
              max-height="425"
          >
              <el-table-column
              prop="tenant"
              label="Tenant"
              align="left"
              sortable
              width="200"
              />
              <el-table-column
              prop="descrizione"
              label="Descrizione"
              align="left"
              />
              <el-table-column
              prop="udd"
              label="UDD"
              align="left"
              />

              <el-table-column
              prop="cc"
              label="CC"
              align="left"
              />
              <el-table-column>
                <template slot-scope="scope">
                    <el-button @click="modificaTenant(scope.row)" >Modifica</el-button>
                </template>
              </el-table-column>

              <el-table-column>
                <template slot-scope="scope">
                    <el-button @click="eliminaTenant(scope.row)" >Elimina</el-button>
                </template>
              </el-table-column>

          </el-table>





          <ClientOnly>
          <el-dialog
            :visible.sync="aggiungiTenantModal"
            :title="titoloModal"
            width="30%"
            append-to-body
          >

          <el-input type="hidden" placeholder="tenant" v-model="form._tenant" />
          
          <el-form ref="form" :model="form" label-position="left" label-width="120px">
            <el-form-item label="Tenant">
              <el-input placeholder="Tenant" v-model="form.tenant" />
            </el-form-item>

            <el-form-item label="Descrizione">
              <el-input placeholder="Descrizione" v-model="form.descrizione" />
              
            </el-form-item>
            

            <el-form-item label="udd">
              <el-select  style="width: 100%" v-model="form.udd" placeholder="Seleziona"  @change="setUdd($event)">
              <el-option
                :key="0"
                :label="0"
                :value="0"
              >

              </el-option>
              <el-option
                :key="1"
                :label="1"
                :value="1"
              >

              </el-option>    
              </el-select>
            </el-form-item>


            <el-form-item label="cc">
              <el-select  style="width: 100%" v-model="form.cc" placeholder="Seleziona"  @change="setCC($event)">
              <el-option
                :key="0"
                :label="0"
                :value="0"
              >

              </el-option>
              <el-option
                :key="1"
                :label="1"
                :value="1"
              >

              </el-option>    
              </el-select>
            </el-form-item>


            <el-button @click="salvaTenant">Salva</el-button>


           

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
      tenant: [],
      action : '',
      titoloModal : "Aggingi Tenant",
      aggiungiTenantModal: false,
      form:{
        _tenant: '',
        tenant: '',
        descrizione: '',
        udd: '',
        cc: ''
      }
    }
  },
  computed: {
  },
  watch:{

  },
  async mounted() {
    this.getTenants();
  },
  methods: {

    aggiungiTenant(){
      this.titoloModal = "Aggiungi Tenant"

      this.aggiungiTenantModal = true
      this.resetCreaFormTenant();
      this.action = "aggiungi tenant"
    },
    setUdd(event){
      this.form.udd = event

    },

    setCC(event){
      this.form.cc = event

    },

    resetCreaFormTenant(){
      this.form.tenant = '',
      this.form.descrizione = '',
      this.form.udd = '',
      this.form.cc = ''
    },

    getTenants(){
      this.$axios.get('/api/auth/get-admin-tenants', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        }
      }).then(
      ({data}) => {
        this.tenant = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })

    },

    salvaTenant(){
      

      if(this.action == "aggiungi tenant"){
        this.doSalvaTenant()

      }
      else{
        this.doModificaTenant()
      }
    },

    modificaTenant(row){
      this.form._tenant = row.tenant
      this.form.tenant = row.tenant
      this.form.descrizione = row.descrizione
      this.form.udd = row.udd
      this.form.cc = row.cc

      this.titoloModal = "Modifica Tenant"

      this.aggiungiTenantModal = true
      this.action = "modifica tenant"

    },

    eliminaTenant(row){


      const h = this.$createElement;
            this.$msgbox({
            title: 'Invio Messaggio',
            message: h('p', null, [
              h('i', { style: 'font-size:12pt' }, 'Sei sicuro di voler eliminare il tenant?')
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
              

              fd.append("tenant", row.tenant)
              

              this.$axios.post('/api/auth/admin-elimina-tenant', fd,
              { headers:{'Secret-Key' : this.$store.getters['authToken']},}
              ).then((res)=> {
                loading.close()
                this.$message.success("Tenant eliminato");
                this.getTenants();
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


    doSalvaTenant(){

      const fd = new FormData();
              
        fd.append("tenant", this.form.tenant);
        fd.append("descrizione", this.form.descrizione);
        fd.append("udd", this.form.udd);
        fd.append("cc", this.form.cc);


        this.$axios.post('/api/auth/admin-crea-tenant', fd,
              { headers:{'Secret-Key' : this.$store.getters['authToken'], 'Content-Type': 'application/json'},}
              ).then((res)=> {
                console.log(res.data.status)
                if( res.data.status == "success"){
                  this.$message.success("Salvataggio effettuato con successo");
                  this.resetCreaFormTenant();
                  this.aggiungiTenantModal = false
                  this.getTenants();
                }
                else{
                  this.$message.error(res.data.message);
                }
                

                

              }).catch((e)=>{
                console.log("e",e)
                this.$message.error("Errore durante il salvataggio");
              })

      
      },

      doModificaTenant(){
      const h = this.$createElement;
            this.$msgbox({
            title: 'Invio Messaggio',
            message: h('p', null, [
              h('i', { style: 'font-size:12pt' }, 'Sei sicuro di voler modificare il tenant?')
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
              

              fd.append("_tenant", this.form._tenant);
              fd.append("tenant", this.form.tenant);
              fd.append("descrizione", this.form.descrizione);
              fd.append("udd", this.form.udd);
              fd.append("cc", this.form.cc);
              

              this.$axios.post('/api/auth/admin-modifica-tenant', fd,
              { headers:{'Secret-Key' : this.$store.getters['authToken']},}
              ).then((res)=> {
                loading.close()
                if( res.data.status == "success"){
                  this.$message.success("Salvataggio effettuato con successo");
                  this.resetCreaFormTenant();
                  this.aggiungiTenantModal = false
                  this.getTenants()
                }
                else{
                  this.$message.error("Errore durante il salvataggio");
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
 
    onEnd(){
    },

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

