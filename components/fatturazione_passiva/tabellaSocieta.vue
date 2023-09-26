<template>
<div>
   <el-table
    sum-text="Totale"
    show-summary
    v-loading="loading"
    :data="table.filter(data => !search || data.key.toLowerCase().includes(search.toLowerCase()))"
    max-height="550"
    style="width: 100%;min-height:415px">
    <el-table-column
      prop="key"
      label="Società"
      width="310">
      <template slot="header" slot-scope="scope">
        <el-input
          clearable
          v-model="search"
          size="mini"
          placeholder="Cerca tra le voci"/>
      </template>
    </el-table-column>
      <el-table-column
        prop="value"
        label="Totale">
      </el-table-column>
    </el-table>
</div>
 
</template>

<script>
export default {
  props:{
    table:{ type: Array, required: true, default: false }, 
  },
  watch:{
    table(from,to){
      this.loading = false
    }
  },
data(){
    return{
      loading: true,
      search:''
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