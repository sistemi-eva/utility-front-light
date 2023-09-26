<template>
<div>
    <el-table
    sum-text="Totale"
    show-summary
    v-loading="loading"
    :data="table"
    max-height="425"
    style="width: 100%;min-height:415px">
      <el-table-column
        prop="bonus_tipo"
        label="Tipo Bonus"
        width="300">
      </el-table-column>
      <el-table-column
        prop="pod"
        label="Pod">
      </el-table-column>
    </el-table>
</div>
 
</template>

<script>
export default {
  props:{
    table:{ type: Array, required: true, default: false }, 
    type : { type: String,  default: () => 'ee' }, 
  },
  watch:{
    table(from,to){
      this.loading = false
    }
  },
data(){
    return{
      loading: true
    }
  },
}
</script>

<style>
.el-table__footer-wrapper, .el-table__header-wrapper{
  font-weight: 800 !important;
  font-style: italic;
}
</style>