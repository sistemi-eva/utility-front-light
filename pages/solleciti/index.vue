<template>
  <div>
    <h2 class=""><i class="el-icon-files"></i> Convertitore Solleciti per Terranova</h2>
    <el-divider></el-divider>
    <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="120px">
      <el-row>
        <div style="padding-bottom:15px">
          <el-form-item label="Data Spedizione" />
           <el-date-picker
                v-model="form.date"
                type="date"
                prop="send_date"
                format= "dd/MM/yyyy"
                value-format="dd/MM/yyyy"
                placeholder="Inserisci Data">
            </el-date-picker>
        </div>
          <el-form-item label="Upload File xlsx" />
          <div v-if="form.xlsxUploadedFileName">
            <h2 v-if="form.xlsxUploadedFileName"> File Caricato correttamente</h2>
            {{form.xlsxUploadedFileName}}
            <el-button @click.prevent="form.xlsxUploadedFileName = ''">Elimina</el-button>
          </div>
            <el-upload
              v-if="!form.xlsxUploadedFileName"
              style="width: 100%"
              :show-file-list="false"
              :http-request="uploadFunction"
              :file-list="xlsxUploadFile"
              :before-upload="handleBeforeUpload"
              drag
              :limit="1"
              name="xlsx_file"
              accept=".xlsx"
              class="upload-demo"
              ref="upload"
              action=""
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text"><em>Clicca per fare l'upload</em></div>
            </el-upload>
          <div style="padding-top:30px;">
            <el-button @click="vModel">Elimina Dati</el-button>
            <el-button type="primary" @click.prevent="handleStart">Importa</el-button>
          </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  methods : {
    async handleStart(){
      if(!this.form.xlsxUploadedFileName || !this.form.date) {
        this.$notify.error({
          title: "Tutti i campi sono obbligatori",
          message: "Tutti i campi sono obbligatori",
        });
      }else{
        const loading = this.$loading({
          lock: true,
          text: 'Stiamo Convertendo il tuo file',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        await this.$axios.post('/api/solleciti/start', 
        {date:this.form.date,xlsx_file:this.form.xlsxUploadedFileName},
        {
          headers:{'Secret-Key' : this.$store.getters['authToken']
        },responseType: 'arraybuffer'
      }).then(
      (response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'solleciti.xml'); //or any other extension
          document.body.appendChild(link);
          link.click();
        this.$notify({
          title: 'Operazione Completata con successo',
          message: 'Operazione Completata con successo',
          type: 'success'
        });
        loading.close();
        this.vModel()
      },
      error => {
        loading.close();
        this.vModel()
        this.$message({
          showClose: true,
          message: 'Errore Durante la conversione'
        })
      })
      }
    },
    vModel(){ 
      this.form.date = ''
      this.form.xlsxUploadedFileName = ''
    },
    handleBeforeUpload(file){
      this.xlsxUploadFile.push(file)
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
      fd.append("xlsx_file", this.xlsxUploadFile[0]);
     //send call the api to upload files using axios or any other means
       this.$axios.post('/api/solleciti/xlsx-file', fd,{
         headers:{'Secret-Key' : this.$store.getters['authToken']},
         onUploadProgress: function( progressEvent ) {
          this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
        }.bind(this)
       })
       .then(function(response){
         setTimeout(async () => {
           self.xlsxUploadFile = []
            self.form.xlsxUploadedFileName = response.data
            loading.close()
          },1000)
        })
      .catch(function(e){
        this.vModel()
        this.$message({
          showClose: true,
          message: "Errore Durante l'upload del file"
        })
        loading.close();
      });
    },
  },
    data() {
        return {
            xlsxUploadFile: [],
            form:{
                date: '',
                xlsxUploadedFileName: ''
            },
            rules: {
                send_date: [{
                        required: true,
                        message: "Selezionare una data",
                    }
                ]
            }
        }
    }
}
</script>

<style>

</style>