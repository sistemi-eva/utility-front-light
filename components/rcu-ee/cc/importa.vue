<template>
  <el-dialog
      :before-close="vModel"
      title="Importa Fatturazione Rcu"
      :visible.sync="value"
      width="75%"
      center>
      <el-form>
      <el-form-item>
         
          <el-form-item label="Mese Competenza">
            <el-input type="number" min=0 max=12 v-model="mese" placeholder="(0-12)" ></el-input>
          </el-form-item>
          <el-form-item label="Anno Competenza">
            <el-input type="number" min=2000 max=2099 v-model="anno" placeholder="(2000-2099)" ></el-input>
          </el-form-item>
      </el-form-item>
      <div v-if="zipUploadedFileName">
        <h2 v-if="zipUploadedFileName"> File Caricato correttamente</h2>
        {{zipUploadedFileName}}
        <el-button @click.prevent="zipUploadedFileName = ''">Elimina</el-button>
      </div>
      <el-upload
        v-if="!zipUploadedFileName"
        style="width: 100%"
        :show-file-list="false"
        :http-request="uploadFunction"
        :file-list="zipUploadFile"
        :before-upload="handleBeforeUpload"
        drag
        :limit="1"
        name="zip_file"
        accept=".zip"
        class="upload-demo"
        ref="upload"
        action=""
      >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text"><em>Clicca per fare l'upload</em></div>
      </el-upload>
      <div style="padding-top:30px;text-align: center;">
        <el-button @click="vModel">Annulla</el-button>
        <el-button type="primary" @click.prevent="handleStart">Importa</el-button>
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
      this.zipUploadFile.push(file)
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
      fd.append("zip_file", this.zipUploadFile[0]);
     //send call the api to upload files using axios or any other means
       this.$axios.post('/api/rcu-ee/cc/fatturazione-file', fd,{
         headers:{'Secret-Key' : this.$store.getters['authToken']},
         onUploadProgress: function( progressEvent ) {
          this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
        }.bind(this)
       })
       .then(function(response){
         setTimeout(async () => {
           self.zipUploadFile = []
            self.zipUploadedFileName = response.data
            loading.close()
          },1000)
        })
      .catch(function(e){
        loading.close();
      });
    },
    handleStart(){
      if(!this.mese >13 && !this.mese >=0) {
        this.$notify.error({
          title: "Il campo mese deve contenere valori da 0 a 12",
          message: "Devi inserire un valore corretto per continuare",
        });
      } 
      if(!this.anno <2099 && !this.mese >=1999) {
        this.$notify.error({
          title: "Il campo Anno deve contenere valori da 2000 a 2099",
          message: "Devi inserire un valore corretto per continuare",
        });
      } 
      if(!this.zipUploadedFileName  || !this.mese || !this.anno) {
        this.$notify.error({
          title: "Tutti i campi sono obbligatori",
          message: "Devi inserire MESE ED ANNO ed un file da caricare",
        });
      }else{
        const loading = this.$loading({
          lock: true,
          text: 'Stiamo Caricando il tuo file',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$axios.post('/api/rcu-ee/cc/insert', 
        {mese:this.mese,anno:this.anno,fatturazione_file: this.zipUploadedFileName},
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
        this.$emit('updateStatus',true)
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
      this.zipUploadFileName = ''
      this.zipUploadedFileName = ''
      this.$emit('input', false) 
    },
  },
  data: () => {
    return {
      mese: '',
      anno: '',
      zipUploadFile: [],
      zipUploadedFileName: '',
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