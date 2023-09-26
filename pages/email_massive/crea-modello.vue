<template>
    <div>
      <h2 class=""><i class="el-icon-s-promotion"></i> Crea Modello</h2>
      <el-divider></el-divider>
      <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="120px">
        <el-row>
            <el-col :span="14">
                                    
                                        <el-row type="flex" justify="start">
                                        <el-col :span="22">
                                            <el-form-item label="Nome" prop="nome">
                                                <el-input placeholder="Nome" v-model="form.nome">
                                                
                                            </el-input>
                                            </el-form-item>
                                        </el-col>
                                        </el-row>
                                        <el-row type="flex" justify="start">
                                        <el-col :span="22">
                                            
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
                                    
            </el-col>

            <el-col :span="10">


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
      </el-form>
        <el-divider></el-divider>
                        <el-row>
                          <el-col :span="4">
                            <div style="display: flex; justify-content:flex-end">
                            
                            <el-button v-if="form.template_id != ''" type="success" icon="el-icon-s-promotion" @click.prevent="eliminaModello">Elimina Modello</el-button>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div style="display: flex; justify-content:flex-end">
                            
                            <el-button v-if="form.nome != '' && form.messaggio != ''" type="success" icon="el-icon-s-promotion" @click.prevent="saveModello">Salva Modello</el-button>
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
          nome: '',
          template_id: '',
          templates: [],
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
        this.form.nome = ""
        this.form.template_id = ''
      }
      else{
        this.form.messaggio = this.templates[value].template_html
        this.form.nome = this.templates[value].template_name
        this.form.template_id = this.templates[value].template_id
      }
      
    },


    handleBeforeUpload2(file){
        this.form.allegatiFileName.push(file.name)
      this.form.allegatiFiles.push(file)
      console.log('::',file, this.form.allegatiFiles)
      
    },
      saveModello() {
        this.$refs.form.validate(valid => {
          if(valid) {
            const h = this.$createElement;
            this.$msgbox({
            title: 'Invio Messaggio',
            message: h('p', null, [
              h('p',  { style: 'font-size:24pt; margin-bottom:10px'}, 'Nome: ' + this.form.nome),
              h('i', { style: 'font-size:12pt' }, 'Sei sicuro di voler salvare il modello?')
            ]),confirmButtonText: 'Si, invia',
              cancelButtonText: 'Annulla',
              type: 'warning'
            }).then(() => {

              const loading = this.$loading({
                lock: true,
                text: 'Salvataggio in corso...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              })

              const fd = new FormData();
              
              var attach = []
              fd.append("nome", this.form.nome);
              fd.append("messaggio", this.form.messaggio);
              if( this.form.template_id != "" ){
                fd.append("id", this.form.template_id);
              }


              this.$axios.post('/api/invio-massivo-email/salva-modello', fd,
              { headers:{'Secret-Key' : this.$store.getters['authToken']},}
              ).then((res)=> {
                loading.close()
                this.$message.success("Salvataggio effettuato con successo");
                this.loadTemplates()

              }).catch((e)=>{
                console.log("e",e)
                this.$message.error("Errore durante il salvataggio");
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


      eliminaModello() {
        this.$refs.form.validate(valid => {
          if(valid) {
            const h = this.$createElement;
            this.$msgbox({
            title: 'Invio Messaggio',
            message: h('p', null, [
              h('p',  { style: 'font-size:24pt; margin-bottom:10px'}, 'Nome: ' + this.form.nome),
              h('i', { style: 'font-size:12pt' }, 'Sei sicuro di voler eliminare il modello?')
            ]),confirmButtonText: 'Si, invia',
              cancelButtonText: 'Annulla',
              type: 'warning'
            }).then(() => {

              const loading = this.$loading({
                lock: true,
                text: 'Salvataggio in corso...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              })

              const fd = new FormData();
              
             
              fd.append("id", this.form.template_id);
              


              this.$axios.post('/api/invio-massivo-email/elimina-modello', fd,
              { headers:{'Secret-Key' : this.$store.getters['authToken']},}
              ).then((res)=> {
                loading.close()
                this.$message.success("Modello eliminato con successo");
                this.loadTemplates()

              }).catch((e)=>{
                console.log("e",e)
                this.$message.error("Errore durante la cancellazione");
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
        this.loadTemplates()
    },
  }
  </script>
  
  <style>
  
  </style>