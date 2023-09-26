<template>
  <el-dialog
      :before-close="vModel"
      title="Controllo Fatturazione Rcu"
      :visible.sync="value"
      width="75%"
      center>
      <el-form>
      <div v-if="csvUploadedFileName">
        <h2 v-if="csvUploadedFileName"> File Caricato correttamente</h2>
        {{csvUploadedFileName}}
        <el-button @click.prevent="csvUploadedFileName = ''">Elimina</el-button>
      </div>
      <el-upload
        v-if="!csvUploadedFileName"
        style="width: 100%"
        :show-file-list="false"
        :http-request="uploadFunction"
        :file-list="csvUploadFile"
        :before-upload="handleBeforeUpload"
        drag
        :limit="1"
        name="csv_file"
        accept=".csv"
        class="upload-demo"
        ref="upload"
        action=""
      >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text"><em>Clicca per fare l'upload</em></div>
      </el-upload>
      <div style="padding-top:30px;text-align: center;">
        <el-button @click="vModel">Annulla</el-button>
        <el-button type="primary" @click.prevent="handleStart">Esegui</el-button>
      </div>
      </el-form>
  </el-dialog>
</template>

<script>
export default {
  props:{
    value:{ type: Boolean, required: true, default: false }, 
  },
  async mounted(){

  },
  methods:{
    handleBeforeUpload(file){
      this.csvUploadFile.push(file)
    },
    uploadFunction(){
      const self = this
      const loading = this.$loading({
        lock: true,
        text: 'Stiamo Caricando il tuo file',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
       //Create new formData object
      const fd = new FormData();
      //append the file you want to upload
      fd.append("csv_file", this.csvUploadFile[0]);
     //send call the api to upload files using axios or any other means
       this.$axios.post('/api/rcu-gas/udd/fatturazione-file', fd,{
         headers:{'Secret-Key' : this.$store.getters['authToken']},
         onUploadProgress: function( progressEvent ) {
          this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
        }.bind(this)
       })
       .then(function(response){
         setTimeout(async () => {
           self.csvUploadFile = []
            self.csvUploadedFileName = response.data
            loading.close()
          },1000)
        })
      .catch(function(e){
        loading.close();
      });
    },
    handleStart(){
      if(!this.csvUploadedFileName) {
        this.$notify.error({
          title: "Tutti i campi sono obbligatori",
          message: "Devi inserire almeno un file",
        });
      }else{
        const loading = this.$loading({
          lock: true,
          text: 'Stiamo Caricando il tuo file',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$axios.post('/api/rcu-gas/udd/controllo', 
        {fatturazione_file: this.csvUploadedFileName},
        {
          headers:{'Secret-Key' : this.$store.getters['authToken']
        },
      }).then(
      ({data}) => {
        loading.close()
        this.$notify({
          title: 'Operazione avviata con successo',
          message: 'Operazione avviata con successo',
          type: 'success'
        });
        this.vModel()
      },
      error => {
        loading.close()
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
      }
    },
    vModel(){ 
      this.csvUploadFileName = ''
      this.csvUploadedFileName = ''
      this.$emit('input', false) 
    },
  },
  data: () => {
    return {
      csvUploadFile: [],
      csvUploadedFileName: '',
    }
  },
}
</script>

<style>
  .center {
    margin: auto;
    width: 50%;
    padding: 10px;
  }
</style>