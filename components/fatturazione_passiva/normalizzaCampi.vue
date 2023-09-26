<template>
  <el-dialog
  :before-close="vModel"
  title="Normalizzazione Campi"
  :visible.sync="value"
  width="75%"
  center>
    <el-card class="box-card" style="width:50%;margin:auto">
      <div v-if="addToggle">
        <el-row>
          <el-col :span="11"> Valore da modificare </el-col>
          <el-col :span="11"> Corrispondente </el-col>
          <el-col :span="2" />
        </el-row>
        <el-row style="padding-top:10px;padding-bottom:10px">
          <el-col :span="11">
            <el-input v-model="valueToConvert"  placeholder="Inserisci Valore da convertire" prefix-icon="fas fa-user"></el-input>
          </el-col>
          <el-col :span="11">
            <el-input v-model="corrispondente"  placeholder="Inserisci Corrispondente" prefix-icon="fas fa-user"></el-input>
          </el-col>
          <el-col :span="2" style="padding-left:20px">
            <el-button type="primary" @click.prevent="addNormalizzato" icon="el-icon-plus"></el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="header" class="clearfix">
        <span>Campi Normalizzati</span>
        <el-button style="float: right; padding: 3px 0" @click="addToggleFunc" type="text">{{!addToggle ? 'Aggiungi nuovo' : 'Annulla'}}</el-button>
      </div>
      <el-row>
        <el-col :span="11">Valore da modificare </el-col>
        <el-col :span="11">Corrispondente </el-col>
        <el-col :span="2" />
      </el-row>
      <el-row style="padding-top:10px;padding-bottom:10px" v-for="campo in campi" :key="campo.id">
          <el-col :span="11">
            <el-input disabled v-model="campo.value"  placeholder="Modifica Valore" prefix-icon="fas fa-user"></el-input>
          </el-col>
          <el-col :span="11">
            <el-input disabled v-model="campo.corrispondente"  placeholder="Modifica Corrispondente" prefix-icon="fas fa-user"></el-input>
          </el-col>
          <el-col :span="2" style="padding-left:20px">
            <el-button type="primary" @click="deleteNormalizzato(campo.id)" icon="el-icon-delete"></el-button>
          </el-col>
      </el-row>
    </el-card>
  </el-dialog>
</template>

<script>
export default {
  props:{
    value:{ type: Boolean, required: true, default: false }, 
  },
  data: () => {
    return {
      addToggle:false,
      valueToConvert: '',
      corrispondente: '',
      campi: [],
      test:''
    }
  },
  async mounted(){
    await this.fetchFolderContent()
  },
  methods: {
    addToggleFunc(){
      this.addToggle = !this.addToggle
    },
    vModel(){ 
      this.addToggle = false
      this.corrispondente = ''
      this.valueToConvert = ''
      this.$emit('input', false) 
    },

    deleteNormalizzato(id){
      this.$axios.post('/api/fatturazione-passiva/delete-normalizzato', { id},
        { headers:{'Secret-Key' : this.$store.getters['authToken']},})
        .then((res)=> {
            this.campi = res.data.data
            this.$message.success("Campo eliminato correttamente");
          }).catch((e)=>{
            console.log("e",e)
            this.$message.error("Errore durante la creazione");
          })
    },
    addNormalizzato(){
      for(let i in this.campi) {
        if(
          this.campi[i].value.toLowerCase() === this.valueToConvert.toLowerCase() && 
          this.campi[i].corrispondente.toLowerCase() === this.corrispondente.toLowerCase()
        ) {
          return this.$notify.error({
            title: "Non puoi inserire un valore già esistente",
            message: "Devi inserire un valore è un corrispondente che non è presente in lista",
          });
        }
      }
      if(this.valueToConvert.length > 0 && this.corrispondente.length > 0) {
        this.$axios.post('/api/fatturazione-passiva/normalizzazione', { value:this.valueToConvert, corrispondente:this.corrispondente},
          { headers:{'Secret-Key' : this.$store.getters['authToken']},})
          .then((res)=> {
              this.campi = res.data.data
              this.corrispondente = ''
              this.valueToConvert = ''
              this.addToggle = false
              this.$message.success("Campo aggiunto correttamente");
            }).catch((e)=>{
              console.log("e",e)
              this.$message.error("Errore durante la creazione");
            })
          }else{
            this.$notify.error({
              title: "Tutti i campi sono obbligatori",
              message: "Devi inserire tutti i valori per poter continuare",
            });
          }
    },
    fetchFolderContent() {
      this.$axios.get('/api/fatturazione-passiva/normalizzazione', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
      }).then(
      ({data}) => {
        this.campi = data.data
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
  }
}
</script>

<style>
  .center {
    margin: auto;
    width: 50%;
    padding: 10px;
  }
</style>