<template>
  <el-dialog
      :before-close="vModel"
      title="Esporta Fatturazione Passiva"
      :visible.sync="value"
      width="75%"
      center>
      <el-form>
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
        <el-form-item label="Range Data">
          <br> 
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            start-placeholder="Data Inizio"
            end-placeholder="Data Fine"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      <el-form-item label="Inserisci CSV contenente LISTA POD*">
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
      </el-form-item>
      </el-form>

       <div style="padding-top:30px;text-align: center;">
        <el-button @click="vModel">Annulla</el-button>
        <el-button type="primary" @click.prevent="handleStart">Esporta</el-button>
      </div>
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
  methods: {
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
    vModel(){ 
      this.$emit('input', false) 
    },
    handleStart(){
      if(!this.csvUploadedFileName){
        this.$notify.error({
          title: "Campo Obbligatorio",
          message: "Per continuare devi inserire almeno il file contenete la lista dei pod",
        });
      }else {
        
        const loading = this.$loading({
          lock: true,
          text: 'Stiamo Caricando il tuo file',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$axios.post('/api/fatturazione-passiva/esportazione/', {fornitore:this.fornitore,datarange:this.dateRange,fatturazione_file:this.csvUploadedFileName},{
          headers:{'Secret-Key' : this.$store.getters['authToken']},
          responseType: 'arraybuffer',
        })
        .then(function(response){
          const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'esport.csv'); //or any other extension
            document.body.appendChild(link);
            link.click();
            loading.close();
            location.reload()
          })
        .catch(function(error){
          this.$message({
            showClose: true,
            message: error.response.data.message
          })
        loading.close();
      }); 
      }
      
    }
  },
  data: () => {
    return {
      fornitoreList: [],
      fornitore: '',
      dateRange:'',
      csvUploadFile: [],
      csvUploadedFileName: '',
    }
  }
}
</script>

<style>

</style>