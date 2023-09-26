<template>
    <div>
      <h2><i class="el-icon-document-copy"></i> Generazione di file XML con file .dic di grosse dimensioni</h2>
      <el-divider></el-divider>
       <el-alert
        title="Questo applicativo divide XML in due file separati"
        type="warning"
        description="Puoi utilizzare questo applicativo 'SE E SOLO SE' la Sede del Servizio ha come provincia una lettera che va dalla A alla M."
        show-icon>
      </el-alert>
      <el-divider></el-divider>
      <h2>Genera XML: (Non Provinciali e Provinciali(A-M) e Con Sede Servizio che rientra nella lettera M)</h2>
      <el-divider></el-divider>
      <el-upload
        style="width: 100%"
        :show-file-list="false"
        :http-request="uploadFunctionFirst"
        :file-list="fileListFirst"
        :before-upload="handleBeforeUploadFirst"
        drag
        :limit="1"
        name="dic_file"
        accept=".dic"
        class="upload-demo"
        ref="upload"
        action=""
      >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">Primo File <em>Clicca per fare l'upload</em></div>
      </el-upload>
      <el-divider></el-divider>
      <h2>Genera XML: (Provinciali che vanno dalla N alla Z)</h2>
      <el-divider></el-divider>
      <el-upload
        style="width: 100%"
        :show-file-list="false"
        :http-request="uploadFunctionSecond"
        :file-list="fileListSecond"
        :before-upload="handleBeforeUploadSecond"
        drag
        :limit="1"
        name="dic_file"
        accept=".dic"
        class="upload-demo"
        ref="upload"
        action=""
      >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">Secondo File <em>Clicca per fare l'upload</em></div>
      </el-upload>
    </div>
</template>

<script>

export default {
  name: 'agenziadogane-crea-multiplo',
  data: () => {
    return {
        fileListFirst : [],
        fileListSecond : [],
        uploadPercentage: 0
    }
  },
   methods: {
     handleBeforeUploadFirst(file) {
       this.fileListFirst.push(file)
    },
    handleBeforeUploadSecond(file) {
       this.fileListSecond.push(file)
    },
     uploadFunctionFirst(){
       const self = this
        const loading = this.$loading({
          lock: true,
          text: 'Stiamo Generando il tuo file',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
       //Create new formData object
      const fd = new FormData();
      //append the file you want to upload
      fd.append("dic_file", this.fileListFirst[0]);
     //send call the api to upload files using axios or any other means
       this.$axios.post('/api/agenzia-dogane/start-multiple-first', fd,{
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
          link.setAttribute('download', 'file.xml'); //or any other extension
          document.body.appendChild(link);
          link.click();
          loading.close();
          location.reload()
        })
      .catch(function(e){
        loading.close();
      });
     },
     uploadFunctionSecond(){
       const self = this
        const loading = this.$loading({
          lock: true,
          text: 'Stiamo Generando il tuo file',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
       //Create new formData object
      const fd = new FormData();
      //append the file you want to upload
      fd.append("dic_file", this.fileListSecond[0]);
     //send call the api to upload files using axios or any other means
       this.$axios.post('/api/agenzia-dogane/start-multiple-second', fd,{
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
          link.setAttribute('download', 'file.xml'); //or any other extension
          document.body.appendChild(link);
          link.click();
          loading.close();
          location.reload()
        })
      .catch(function(e){
        loading.close();
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