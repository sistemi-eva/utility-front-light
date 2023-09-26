<template>


  <div>
      <h2 class=""><i class="el-icon-s-promotion"></i> Logs</h2>
      <el-divider></el-divider>
        <el-row>
            <el-col :span="18" style="padding-right: 30px">
              <div class="el-card box-card is-always-shadow">
                <div class="el-card__header"><div class="clearfix"><span>Log</span></div></div>
                <div class="el-card__body">
              <el-table v-if="form.logs.length > 0"
                  :data="displayData"
                  :default-sort="{ prop: 'id', order: 'descending' }"
                  stripe
                  style="width: 100%"
                  @row-click="handleRowClick"
                  row-key="id_invio"
                  
              >
                  <el-table-column
                  prop="id"
                  label="Id"
                  align="left"
                  sortable
                  />
     
                  <el-table-column
                  prop="template_name"
                  label="Nome Template"
                  align="left"
                  />

                  <el-table-column
                  prop="filename"
                  label="Filename"
                  align="left"
                  />

                  <el-table-column
                  prop="username"
                  label="Username"
                  align="left"
                  />

                  <el-table-column
                  prop="totale_mail"
                  label="Totale mail"
                  align="left"
                  />

                  <el-table-column
                  prop="mail_lette"
                  label="Mail Lette"
                  align="left"
                  />

                  <el-table-column
                  prop="oggetto"
                  label="Oggetto"
                  align="left"
                  />

                  <el-table-column
                  prop="data"
                  label="Data"
                  align="left"
                  />


              </el-table>

              <el-pagination
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :page-size="pageSize"
                :total="total">
            </el-pagination>
            </div>
              </div>
                                    
            </el-col>
            <el-col :span="6">
              <div class="el-card box-card is-always-shadow">
                <div class="el-card__header"><div class="clearfix"><span>Dettaglio Log</span></div></div>
                <div class="el-card__body">
                  <el-table
                      :data="form.logDetails"
                      :default-sort="{ prop: 'id', order: 'ascending' }"
                      stripe
                      style="width: 100%"  
                      max-height="425"
                  >
                      <el-table-column
                      prop="mail"
                      label="Email"
                      align="left"
                      sortable
                      />
                      <el-table-column
                      prop="letto"
                      label="Letto"
                      align="left"
              
                      />
                </el-table>
              </div>
              </div>
            </el-col>


        </el-row>
  </div>

  </template>






  
  <script>

  import Editor from '@tinymce/tinymce-vue'
  import $ from "jquery";

  
  export default {
    name: 'messaggi',
    components: {Editor},
    data() {
      return {
        templates: [{id: 0, nome:'TESTO PERSONALIZZATO'}],
        page: 1,
        pageSize: 5,
        search: '',
        form: {
            dialogVisible: false,
            logs: [],
            logDetails: [],
            id_invio: ''
        },
      }
      
    },

    computed: {
      displayData() {
        if(this.search == null) return this.form.logs;
      
        this.filtered = this.form.logs.filter(data => !this.search || data.name.toLowerCase().includes(this.search.toLowerCase()));
        
        this.total = this.filtered.length;

        return this.filtered.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page);
    }
  },
    methods: {

      handleRowClick(row) {
      this.form.id_invio = row.id_invio
      this.loadLogDetails()
    },

    handleCurrentChange(val) {
        this.page = val;
    },


    loadLogs(){
      this.$axios.get('/api/invio-massivo-email/get-logs',
            { headers:{'Secret-Key' : this.$store.getters['authToken']},}
            ).then((res)=> {
   
            this.form.logs = res.data.data
            }).catch((e)=>{
            console.log("e",e)
            
            })
    },

    loadLogDetails(){
      this.form.dialogVisible = true

      console.log(this.form.dialogVisible)
      const fd = new FormData();
      fd.append("id_invio", this.form.id_invio);
      this.$axios.post('/api/invio-massivo-email/get-log-details', fd,
            { headers:{'Secret-Key' : this.$store.getters['authToken']},}
            ).then((res)=> {
           
            this.form.logDetails = res.data.data
            
            }).catch((e)=>{
            console.log("e",e)
            
            })
    },





 








    },
    mounted() {
      this.loadLogs()
    },
  }
  </script>
  
  <style>
   tr {
    cursor: pointer;
  }
  </style>