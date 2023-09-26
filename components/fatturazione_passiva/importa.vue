<template>
  <el-dialog
      :before-close="vModel"
      title="Importa Fatturazione Passiva"
      :visible.sync="value"
      width="75%"
      center>
      <el-form>
      <el-form-item>
         <el-form-item label="Fornitore">
           <br>
            <el-select v-model="fornitore" placeholder="Seleziona">
              <el-option
                v-for="item in fornitoreList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Mese Competenza">
            <el-input type="number" min=0 max=12 v-model="mese" placeholder="(0-12)" ></el-input>
          </el-form-item>
          <el-form-item label="Anno Competenza">
            <el-input type="number" min=2000 max=2099 v-model="anno" placeholder="(2000-2099)" ></el-input>
          </el-form-item>
         <el-form-item label="Note">
            <el-input  v-model="note" placeholder="Note aggiuntive" prefix-icon="fas fa-user"></el-input>
          </el-form-item>

      </el-form-item>
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
    await this.fetchFolderContent()
  },
  methods:{
    fetchFolderContent() {
      this.$axios.get('/api/fatturazione-passiva/fornitori', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
      }).then(
      ({data}) => {
        this.fornitoreList = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
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
       this.$axios.post('/api/fatturazione-passiva/fatturazione-file', fd,{
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
      if(!this.csvUploadedFileName || !this.fornitore || !this.mese || !this.anno) {
        this.$notify.error({
          title: "Tutti i campi sono obbligatori",
          message: "Devi inserire un fornitore ed un file da caricare",
        });
      }else{
        const loading = this.$loading({
          lock: true,
          text: 'Stiamo Caricando il tuo file',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$axios.post('/api/fatturazione-passiva/insert', 
        {fornitore:this.fornitore,note: this.note,mese:this.mese,anno:this.anno,fatturazione_file: this.csvUploadedFileName},
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
      this.fornitore = '',
      this.csvUploadFileName = ''
      this.csvUploadedFileName = ''
      this.$emit('input', false) 
    },
  },
  data: () => {
    return {
      mese: '',
      anno: '',
      note: '',
      fornitoreList: [],
      csvUploadFile: [],
      csvUploadedFileName: '',
      fornitore: ''
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