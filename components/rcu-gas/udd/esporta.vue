<template>
  <el-dialog
    :before-close="vModel"
    title="Esporta Fatturazione RCU"
    :visible.sync="value"
    width="75%"
    center>
    <el-tabs type="border-card" >
      <el-tab-pane label="Annuale">
        <el-form @submit.native.prevent="handleStart" :model="formMensile">
          <el-form-item label="Anno Competenza*">
              <el-input type="number" min=2000 max=2099 v-model="formAnnuale.anno" placeholder="(2000-2099)" ></el-input>
          </el-form-item>
        <el-form-item style="padding-top:30px;text-align: center;">
          <el-button @click="vModel">Annulla</el-button>
          <el-button type="primary" @click.prevent="handleStart">Esporta</el-button>
        </el-form-item>
    </el-form>
    </el-tab-pane>
    <el-tab-pane label="Mensile">
      <el-form @submit.native.prevent="handleStartMensile" :model="formAnnuale">
        <el-form-item label="Mese Competenza*">
          <el-input type="number" min=0 max=12 v-model="formMensile.mese" placeholder="(0-12)" ></el-input>
        </el-form-item>
        <el-form-item label="Anno Competenza*">
          <el-input type="number" min=2000 max=2099 v-model="formMensile.anno" placeholder="(2000-2099)" ></el-input>
        </el-form-item>
        <el-form-item style="padding-top:30px;text-align: center;">
          <el-button @click="vModel">Annulla</el-button>
          <el-button type="primary" @click.prevent="handleStartMensile">Esporta</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
export default {
  props:{
    value:{ type: Boolean, required: true, default: false }, 
  },
  methods: {
      vModel(){ 
      this.formMensile.mese = ''
      this.formMensile.anno = ''
      this.formAnnuale.anno = ''
      this.$emit('input', false) 
    },
    handleStartMensile(){
      if(!this.formMensile.anno || !this.formMensile.anno){
        this.$notify.error({
          title: "Campo Obbligatorio",
          message: "Per continuare devi inserire il mese e l'anno di competenza",
        });
      }else{
        const loading = this.$loading({
          lock: true,
          text: 'Stiamo Caricando il tuo file',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$axios.post('/api/rcu-gas/udd/download-file/', {anno:this.formMensile.anno,mese:this.formMensile.mese},{
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
        .catch(function(e){
        loading.close();
      });
      }
    },
    handleStart(){
      if(!this.formAnnuale.anno){
        this.$notify.error({
          title: "Campo Obbligatorio",
          message: "Per continuare devi inserire l'anno di competenza",
        });
      }else {
        const loading = this.$loading({
          lock: true,
          text: 'Stiamo Caricando il tuo file',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$axios.post('/api/rcu-gas/udd/esportazione/', {anno:this.formAnnuale.anno},{
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
        .catch(function(e){
        loading.close();
      });
      }
    }
  },
  data: () => {
    return {
      formMensile: {
        anno: '',
        mese: '',
      },
      formAnnuale: {
        anno: '',
      },
    }
  }
}
</script>

<style>

</style>