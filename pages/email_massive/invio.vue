<template>
    <div>
      <h2 class=""><i class="el-icon-s-promotion"></i> Invio Massivo Email</h2>
      <el-divider></el-divider>
      <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="120px">
        <el-row>
            <el-col :span="14">
                                    
                                        <el-row type="flex" justify="start">
                                        <el-col :span="22">
                                            <el-form-item label="Oggetto" prop="oggetto">
                                                <el-input placeholder="Oggetto" v-model="form.oggetto">
                                                
                                            </el-input>
                                            </el-form-item>
                                        </el-col>
                                        </el-row>
                                        <el-row type="flex" justify="start">
                                        <el-col :span="22">
                                            <el-form-item label="Modello" prop="template">
                                            <el-select  style="width: 100%" v-model="form.template" placeholder="Seleziona"  @change="setTemplate($event)">
                                              <el-option
                                                :value="Seleziona"
                                                label=""
                                              >

                                              </el-option>  
                                              
                                              <el-option 
                                                v-for="(item, index) in templates"
                                                :key="item.id"
                                                :value="index"
                                                :label="item.template_name"
                                                validate-event	
                                                
                                                >
                                                </el-option>
                                            </el-select>
                                            </el-form-item>
                                        </el-col>
                                        </el-row>
                                        <el-row :gutter="20">
                                        <el-col :span="22">
                                            <el-form-item label="Messaggio" prop="messaggio">

                                              <Editor
                                                api-key="wzpb3zn34ayweghxnfp491r52wrrf0wojf5421iu7clk18rk"
                                                :init="{
                                                  plugins: 'lists link image table code help wordcount'
                                                }"
                                                v-model="form.messaggio"
                                              
                                              />
                                            </el-form-item>
                                        </el-col>
   
                                        </el-row>

                                        <el-row>
                                          <el-col :span="22">
                                        <el-form-item label="Allegati">
                                            <div v-for="f in form.allegatiFileName">
                                              <p> {{ f }} <span style="cursor: pointer" @click="removeAttach(f)"> [x] </span></p>
                                    
                                            </div>

                                            <el-upload
                                           
                                            style="width: 100%"
                                            :multiple="true"
                                            :show-file-list="false"
                                            :http-request="loadFile2"
                                            
                                            :auto-upload="true"
                                            :before-upload="handleBeforeUpload2"
                                        
                                            drag
                                      
                                            name="allegati"
                                            accept="*"
                                            class="upload-demo"
                                            ref="upload"
                                            action=""
                                            >
                                            <i class="el-icon-upload"></i>
                                            <div class="el-upload__text"><em>Clicca per fare l'upload</em></div>
                                            </el-upload>
                     


                                        </el-form-item>
                                        
                              </el-col>

                                        </el-row>
                                    
            </el-col>

            <el-col :span="10">

                        <el-row>
                          <el-col>
                                        <el-form-item label="File Destinatari">
                                            <div v-if="hasFile">
                                            <h2> {{ form.xlsxUploadedFileName }}</h2>
                                    
                                            </div>


                                            <el-upload
                                            v-if="!hasFile"
                                            style="width: 100%"
                                            :show-file-list="false"
                                            :http-request="loadFile"
                                            :file-list="form.xlsxUploadFile"
                                            :auto-upload="true"
                                            :before-upload="handleBeforeUpload"
                                            drag
                                            :limit="1"
                                            name="xlsx_file"
                                            accept=".xlsx,.xls"
                                            class="upload-demo"
                                            ref="upload"
                                            action=""
                                            >
                                            <i class="el-icon-upload"></i>
                                            <div class="el-upload__text"><em>Clicca per fare l'upload</em></div>
                                            </el-upload>
                                            <div
                                            v-if="hasFile"
                                            style="padding-top:30px;"
                                            >
                                            <el-button
                                                @click="resetForm"
                                            >
                                                Elimina File
                                            </el-button>
                                            
                                            </div>


                                        </el-form-item>
                                        
                              </el-col>
                          
                        </el-row>




                        <el-row type="flex" justify="start" :gutter="20">
                        <el-col>
                            <div v-if="form.destinatari.length">
                                <p>Puoi utilizzare le seguenti variabili:</p>
                                <span v-for="(item, index) in form.variabili">
                                    <span> {{ item  }} </span>
                                </span>
                            </div>
                            <el-table v-if="form.destinatari.length > 0"
                                :data="form.destinatari"
                                :default-sort="{ prop: 'nome', order: 'ascending' }"
                                stripe
                                style="width: 100%"
                                max-height="425"
                            >
                                <el-table-column
                                prop="nome"
                                label="Nome"
                                align="left"
                                sortable
                                width="200"
                                />
                                <el-table-column
                                prop="cognome"
                                label="Cognome"
                                align="left"
                                />
                                <el-table-column
                                prop="email"
                                label="Email"
                                align="left"
                                />

                                <el-table-column
                                prop="status"
                                label="Stato"
                                align="left"
                                />

                            </el-table>
                        </el-col>
                        </el-row>   
                </el-col>
        </el-row>
      </el-form>
        <el-divider></el-divider>
                        <el-row>
                        <el-col :span="12">
                            <div style="display: flex; justify-content:flex-end">
                            
                            <el-button v-if="form.destinatari.length > 0" type="success" icon="el-icon-s-promotion" @click.prevent="doSubmit">Invia Email</el-button>
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
        form: {
          oggetto: '',
          variabili: [],
          template: [],
          template_id: '',
          messaggio: '',
          destinatari: [],
          allegatiFileName: [],
          allegatiFiles: [],
          xlsxUploadedFileName: '',
          xlsxUploadFile: []
        },
      }
      
    },

    computed: {
    hasFile() {
      return this.form.xlsxUploadFile.length > 0
    }
  },
    methods: {

    uploadFunction(e){

      console.log(e)
      this.form.xlsxUploadedFileName = e.file.name
    },
    handleBeforeUpload(file){
        this.form.xlsxUploadedFileName = file.name
      this.form.xlsxUploadFile.push(file)
      console.log('::',file, this.form.xlsxUploadFile)
      
    },

    removeAttach(attach){
        for(var i in this.form.allegatiFileName){
          if(attach == this.form.allegatiFileName[i]){
            console.log(attach)
            this.form.allegatiFileName.splice(i, 1);
            this.form.allegatiFiles.splice(i, 1);
            
          }
        }
        console.log(this.form.allegatiFileName)
      
    },

    loadTemplates(){
      this.$axios.get('/api/invio-massivo-email/get-templates',
              { headers:{'Secret-Key' : this.$store.getters['authToken']},}
              ).then((res)=> {
                console.log(res.data.data)
                this.templates = res.data.data
              }).catch((e)=>{
                console.log("e",e)
                
              })
    },

    setTemplate(value){
    
      if(value === undefined ){
        this.form.messaggio = ""
        this.form.template_id = ''
      }
      else{
        this.form.messaggio = this.templates[value].template_html
        this.form.template_id = this.templates[value].template_id
      }
      
    },


    handleBeforeUpload2(file){
        this.form.allegatiFileName.push(file.name)
      this.form.allegatiFiles.push(file)
      console.log('::',file, this.form.allegatiFiles)
      
    },
      doSubmit() {
        this.$refs.form.validate(valid => {
          if(valid) {
            const h = this.$createElement;
            this.$msgbox({
            title: 'Invio Messaggio',
            message: h('p', null, [
              h('p',  { style: 'font-size:24pt; margin-bottom:10px'}, 'Oggetto: ' + this.form.oggetto),
              h('i', { style: 'font-size:12pt' }, 'Sei sicuro di voler inviare il messaggio?')
            ]),confirmButtonText: 'Si, invia',
              cancelButtonText: 'Annulla',
              type: 'warning'
            }).then(() => {

              const loading = this.$loading({
                lock: true,
                text: 'Invio email in corso...attendere prego.',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              })

              const fd = new FormData();
              
              var attach = []
              for(var i in this.form.allegatiFiles){
                fd.append(this.form.allegatiFileName[i], this.form.allegatiFiles[i]);
                attach.push(this.form.allegatiFileName[i]);
              }

              if(this.form.template_id != ""){
                fd.append("template_id", this.form.template_id);
              }
              fd.append("oggetto", this.form.oggetto);
              fd.append("messaggio", this.form.messaggio);
              fd.append("destinatari", JSON.stringify(this.form.destinatari));
              fd.append("filename_dest", this.form.xlsxUploadedFileName)
              fd.append("attach", JSON.stringify(attach))
              fd.append("variabili", JSON.stringify(this.form.variabili))
              

              this.$axios.post('/api/invio-massivo-email/invia', fd,
              { headers:{'Secret-Key' : this.$store.getters['authToken']},}
              ).then((res)=> {
                loading.close()
                this.$message.success("Invio Effettuato con successo");
                console.log(res.data.data)
                var t = this.form.destinatari
                for(var i in res.data.data){
                  t[i].status = res.data.data[i]
                }
                this.form.destinatari = []
                this.form.destinatari = t
                this.resetForm2()
              }).catch((e)=>{
                console.log("e",e)
                this.$message.error("Errore durante l'invio");
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: 'Invio Annullato'
              });          
            });
          } else {
            return false
          }
        })
      },

      resetForm(){
        console.log("reset form")
      this.form.xlsxUploadedFileName = ''
      this.form.xlsxUploadFile = []
      this.form.destinatari = []
    },

    resetForm2(){
        console.log("reset form")
      this.form.xlsxUploadedFileName = ''
      this.form.xlsxUploadFile = []
      this.form.messaggio = ""
      this.form.oggetto = ""
    },


      loadFile() {
      const loading = this.$loading({
        lock: true,
        text: 'Stiamo Caricando il tuo file',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const fd = new FormData();
      fd.append("xlsx_file", this.form.xlsxUploadFile[0]);
      //send call the api to upload files using axios or any other means
      console.log("fileeee ")
    console.log(this.form.xlsxUploadFile[0])
 
      this.$axios.post('/api/invio-massivo-email/caricamento', fd,{
        timeout: 3600000,
        headers:{
          'Secret-Key' : this.$store.getters['authToken']},
          onUploadProgress: function( progressEvent ) {
            this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
          }.bind(this)
      })
      .then((response) => {
        console.log(response.data)
        var t = response.data.data
        this.form.variabili = []
        for(var i in t[0]){
          this.form.variabili.push("{{" + i + "}}")
          }
        
        for(var i in t){
          
         t[i].status = null
        }
        this.form.destinatari = t
        console.log(this.form.destinatari)
        loading.close()

        this.$message({
            showClose: true,
            message: response?.data?.message
          })
      })
      .catch((e) => {
        this.resetForm()
        if(e.response?.data?.message) {
          this.$message({
            showClose: true,
            message: e.response?.data?.message
          })
        } else {
          this.$message({
            showClose: true,
            message: "Errore Durante l'upload del file"
          })
        }
        loading.close();
      });
    },



      uploadFunction(e){
        console.log('---', e)
        this.form.xlsxUploadedFileName = e.file.name
    },


      handleChangeModello(id) {
        if(id > 0) {
          let modello = this.templates.find(el => el.id == id)
          this.form.messaggio = modello.messaggio
        } else {
          this.form.messaggio = ''
        }
      },

    },
    mounted() {
        this.$nextTick(function () {
          setTimeout(function(){
            $(".tox-notifications-container .tox-notification__dismis").trigger("click")
          }, 1000)
          
     
      
        });
        this.loadTemplates()
    },
  }
  </script>
  
  <style>
  
  </style>