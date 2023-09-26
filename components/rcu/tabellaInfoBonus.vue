<template>
<el-dialog :close-on-click-modal="false" :before-close="handleClose" title="Ricerca pod con bonus" :visible.sync="value">
  <el-form @submit.native.prevent="startSearch"  :inline="true" style="width:100%"  :model="form">
    <el-row>
      <el-col :span="22">
        <el-input  v-model="form.search" placeholder="Cerca pod" autocomplete="off"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button @keyup.enter.native="startSearch" @click="startSearch" >Cerca</el-button>
      </el-col>
    </el-row>
  </el-form>
  <el-table
    sum-text="Totale"
    v-loading="loading"
    :data="table"
    max-height="415"
    style="width: 100%;padding-top:10px;min-height:315px">
    <el-table-column
      prop="COD_POD"
      label="POD"
      width="150">
    </el-table-column>
    <el-table-column
      prop="REGIME_COMPENSAZIONE"
      label="Tipo Bonus"
>
    </el-table-column>
    <el-table-column
      prop="BE_DATA_INIZIO"
      label="(BE) Inizio"
     >
    </el-table-column>
    <el-table-column
      prop="BE_DATA_FINE"
      label="(BE) Fine"
      >
    </el-table-column>
    <el-table-column
      prop="BE_DATA_RINNOVO"
      label="(BE) Rinnovo"
      >
    </el-table-column>
    <el-table-column
      prop="BF_DATA_INIZIO"
      label="(BF) Inizio">
    </el-table-column>
    <el-table-column
      prop="BF_DATA_FINE"
      label="(BF) Fine">
    </el-table-column>
    <el-table-column
      prop="BF_DATA_RINNOVO"
      label="(BF) Rinnovo ">
    </el-table-column>
  </el-table>
  </el-dialog>
</template>

<script>
export default {
  props:{
    type : { type: String, required: true,  default: () => '' }, 
    value:{ type: Boolean, required: true, default: false }, 
    mese:{ type: Number, required: true, default: '' }, 
    anno:{ type: String, required: true, default: '' }, 
  },
data(){
    return{
      loading: false,
      table: [],
      form:{
        search: ''
      }
    }
  },
methods:{
  handleClose() {
      this.$emit('input', false)
      this.form.search= ''
      this.table=[] 
  },
  // vModel(){ },
  async startSearch() {
    this.loading= true
    this.$axios.get(`/api/${this.type}/table-info-bonus-information`, {
      headers:{
        'Secret-Key' : this.$store.getters['authToken']
      },
      params: {
        mese: this.mese,
        anno: this.anno,
        search: this.form.search
      }
    }).then(
    ({data}) => {
      this.table = data.data
      setTimeout(async () => {
        this.loading = false
      },1000)
    },
    error => {
      console.log(error)
      this.$message({
        showClose: true,
        message: error.response.data.message
      })
    })
  }
}
}
</script>

<style>
.el-table__footer-wrapper, .el-table__header-wrapper{
  font-weight: 800 !important;
  font-style: italic;
}
</style>