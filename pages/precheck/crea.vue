<template>
    <div>
      <h2><i class="el-icon-document-add"></i> Crea Nuovo</h2>
      <el-divider></el-divider>
       <el-alert
        title="Il Gestore File accetta solo file CSV"
        type="warning"
        description="Se il tuo file è diverso occorre modificare il formato del file in modo che sia possibile gestirlo."
        show-icon>
      </el-alert>
      <el-divider></el-divider>
      <el-upload
        style="width: 100%"
        :show-file-list="false"
        :http-request="uploadFunction"
        :file-list="fileList"
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
      <div class="el-upload__text"><em>clicca per fare l'upload</em></div>
      </el-upload>
    </div>
</template>

<script>

export default {
  name: 'precheck-crea',
  data: () => {
    return {
        fileList : [],
        uploadPercentage: 0
    }
  },
   methods: {
     handleBeforeUpload(file) {
       this.fileList.push(file)
    },
     uploadFunction(){
        const loading = this.$loading({
          lock: true,
          text: 'Stiamo Generando il tuo file',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
       //Create new formData object
      const fd = new FormData();
      //append the file you want to upload
      fd.append("csv_file", this.fileList[0]);
     //send call the api to upload files using axios or any other means
       this.$axios.post('/api/precheck/start-precheck', fd,{
         headers:{'Secret-Key' : this.$store.getters['authToken']},
         responseType: 'arraybuffer',
         onUploadProgress: function( progressEvent ) {
          this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
        }.bind(this)
       })
       .then(function(response){
         const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'file.csv'); //or any other extension
          document.body.appendChild(link);
          link.click();
          fileList = []
          loading.close();
          this.$notify({
            title: 'Generazione Effettuata Con Successo',
            message: "E' stato scaricato un file automaticamente",
            type: 'success'
          });
        })
      .catch(function(){
        loading.close();
        this.$notify.error({
            title: "C'è stato un errore nella generazione del file",
            message: "Prova ad effettuare nuovamente la generazione del nuovo file.",
          });
      });
     },
     submitUpload() {
        this.$refs.upload.submit();
      },
    }
}
</script>
<style>
.upload-demo{
  margin: 0 auto;
  height: 100%;
}
.main-container {
  max-width: 100%;
  margin: 0 0;
}

.buttons-container {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0px;
}
</style>