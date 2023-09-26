<template>
    <div>
      <h2><i class="el-icon-odometer"></i> Converti in Base64</h2>
      <el-divider></el-divider>
       <el-alert
        title="Il Gestore File accetta solo file .XML"
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
        name="xml_file"
        accept=".XML"
        class="upload-demo"
        ref="upload"
        action=""
      >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text"><em>Clicca per fare l'upload</em></div>
      </el-upload>
    </div>
</template>

<script>

export default {
  name: 'agenziadogane-convertitore',
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
      fd.append("xml_file", this.fileList[0]);
     //send call the api to upload files using axios or any other means
       this.$axios.post('/api/agenzia-dogane/convertitore/', fd,{
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
          link.setAttribute('download', 'file.txt'); //or any other extension
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