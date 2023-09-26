<template>
  <el-dialog
  :before-close="vModel"
  title="Fornitori"
  :visible.sync="value"
  width="75%"
  center>
    <el-card class="box-card" style="width:50%;margin:auto">
      <el-row  v-if="addToggle" >
        <el-col :span="22">
          <el-input v-model="fornitore" @keyup.enter.native="addFornitore" placeholder="Aggiungi Fornitore" prefix-icon="fas fa-user"></el-input>
        </el-col>
        <el-col :span="2" style="padding-left:20px">
          <el-button :disabled="fornitore.length === 0" @click="addFornitore" type="primary"><i class="el-icon-plus"/></el-button>
        </el-col>
      </el-row>
      <div slot="header" class="clearfix">
        <span>Fornitori</span>
        <el-button style="float: right; padding: 3px 0" @click="addToggleFunc" type="text">{{!addToggle ? 'Aggiungi nuovo' : 'Annulla'}}</el-button>
      </div>
      <div class="text item">
        <el-row v-for="fornitore in fornitori" :key="fornitore.name" style="padding-top:15px;">
          <el-col  :span="22">
            <el-input disabled v-model="fornitore.name"  placeholder="Modifica Fornitore" prefix-icon="fas fa-user"></el-input>
          </el-col>
          <el-col :span="2" style="padding-left:20px">
            <el-button type="primary" @click="deleteFornitore(fornitore.name)" icon="el-icon-delete"></el-button>
          </el-col>
        </el-row>
      </div>
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
      fornitore: '',
      fornitori: [],
      test:''
    }
  },
  async mounted(){
    await this.fetchFolderContent()
  },
  methods: {
    deleteFornitore(name){
      this.$axios.post('/api/fatturazione-passiva/delete-fornitori', {name},
        { headers:{'Secret-Key' : this.$store.getters['authToken']},})
        .then((res)=> {
            this.fornitori = res.data.data
            this.$message.success("Fornitore eliminato correttamente");
          }).catch((e)=>{
            console.log("e",e)
            this.$message.error("Errore durante la creazione");
          })
    },
    addFornitore(){
      for(let i in this.fornitori) {
        if(this.fornitori[i].name.toLowerCase() === this.fornitore.toLowerCase()) {
          return this.$notify.error({
            title: "Non puoi inserire un fornitore già esistente",
            message: "Devi inserire un fornitore che non sia già presente in lista",
          });
        }
      }
      if(this.fornitore.length > 0) {
        this.$axios.post('/api/fatturazione-passiva/fornitori', { fornitore: this.fornitore},
          { headers:{'Secret-Key' : this.$store.getters['authToken']},})
          .then((res)=> {
              this.fornitori = res.data.data
              this.fornitore = ''
              this.addToggle = false
              this.$message.success("Fornitore aggiunto correttamente");
            }).catch((e)=>{
              console.log("e",e)
              this.$message.error("Errore durante la creazione");
            })
          }else{
            this.$notify.error({
              title: "Tutti i campi sono obbligatori",
              message: "Devi inserire un fornitore per poter continuare",
            });
          }
    },
    addToggleFunc(){
      this.addToggle = !this.addToggle
    },
    vModel(){ 
      this.addToggle = false
      this.fornitore = ''
      this.$emit('input', false) 
    },
    fetchFolderContent() {
      this.$axios.get('/api/fatturazione-passiva/fornitori', {
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
      }).then(
      ({data}) => {
        this.fornitori = data.data
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