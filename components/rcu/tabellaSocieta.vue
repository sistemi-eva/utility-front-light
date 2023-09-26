<template>
<div>
   <el-table
    v-if="type=='gas'"
    sum-text="Totale"
    show-summary
    v-loading="loading"
    :data="table.filter(data => !search || data.societa.toLowerCase().includes(search.toLowerCase()))"
    max-height="425"
    style="width: 100%;min-height:415px">
    <el-table-column
      prop="societa"
      label="Società"
      width="310">
      <template slot="header" slot-scope="scope">
        <el-input
          clearable
          v-model="search"
          size="mini"
          placeholder="Cerca societa"/>
      </template>
    </el-table-column>
      <el-table-column
        prop="pod"
        label="Pdr">
      </el-table-column>
      <el-table-column
        prop="gwh"
        label="m³">
      </el-table-column>
    </el-table>
    <el-table
    v-else
    sum-text="Totale"
    show-summary
    v-loading="loading"
    :data="table.filter(data => !search || data.societa.toLowerCase().includes(search.toLowerCase()))"
    max-height="435"
    style="width: 100%;min-height:415px">
    <el-table-column
      prop="societa"
      label="Società"
      width="310">
      <template slot="header" slot-scope="scope">
        <el-input
          clearable
          v-model="search"
          size="mini"
          placeholder="Cerca Societa"/>
      </template>
    </el-table-column>
      <el-table-column
        prop="pod"
        label="Pod">
      </el-table-column>
      <el-table-column
        prop="gwh"
        label="Gwh">
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