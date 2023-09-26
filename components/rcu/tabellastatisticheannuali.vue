<template>
  <el-table
    v-loading="loading"
    sum-text="Totale"
    show-summary
    :data="tableAnnuale.filter(data => !search || data.societa.toLowerCase().includes(search.toLowerCase()))"
    max-height="500px"
    style="width: 100%">
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
      prop="1"
      label="Gennaio"
      min-width="70">
      <template slot-scope="scope">
        <i v-if="andamento && Math.sign(scope.row[scope.column.property]) == -1" style="color:red">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento && Math.sign(scope.row[scope.column.property]) == 1" style="color:green">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="!andamento">{{scope.row[scope.column.property]}}</i>
      </template>
    </el-table-column>
    <el-table-column
      prop="2"
      label="Febbraio"
      min-width="80">
       <template slot-scope="scope">
        <i v-if="andamento && Math.sign(scope.row[scope.column.property]) == -1" style="color:red">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento && Math.sign(scope.row[scope.column.property]) == 1" style="color:green">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="!andamento">{{scope.row[scope.column.property]}}</i>
      </template>
    </el-table-column>
    <el-table-column
      prop="3"
      label="Marzo"
      min-width="80">
       <template slot-scope="scope">
        <i v-if="andamento && Math.sign(scope.row[scope.column.property]) == -1" style="color:red">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento && Math.sign(scope.row[scope.column.property]) == 1" style="color:green">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="!andamento">{{scope.row[scope.column.property]}}</i>
      </template>
    </el-table-column>
    <el-table-column
      prop="4"
      label="Aprile"
      min-width="80">
       <template slot-scope="scope">
        <i v-if="andamento && Math.sign(scope.row[scope.column.property]) == -1" style="color:red">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento && Math.sign(scope.row[scope.column.property]) == 1" style="color:green">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="!andamento">{{scope.row[scope.column.property]}}</i>
      </template>
    </el-table-column>
    <el-table-column
      prop="5"
      label="Maggio"
      min-width="80">
       <template slot-scope="scope">
        <i v-if="andamento && Math.sign(scope.row[scope.column.property]) == -1" style="color:red">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento && Math.sign(scope.row[scope.column.property]) == 1" style="color:green">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="!andamento">{{scope.row[scope.column.property]}}</i>
      </template>
    </el-table-column>
    <el-table-column
      prop="6"
      label="Giugno"
      min-width="80">
       <template slot-scope="scope">
        <i v-if="andamento && Math.sign(scope.row[scope.column.property]) == -1" style="color:red">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento && Math.sign(scope.row[scope.column.property]) == 1" style="color:green">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="!andamento">{{scope.row[scope.column.property]}}</i>
      </template>
    </el-table-column>
    <el-table-column
      prop="7"
      label="Luglio"
      min-width="80">
       <template slot-scope="scope">
        <i v-if="andamento && Math.sign(scope.row[scope.column.property]) == -1" style="color:red">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento && Math.sign(scope.row[scope.column.property]) == 1" style="color:green">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="!andamento">{{scope.row[scope.column.property]}}</i>
      </template>
    </el-table-column>
    <el-table-column
      prop="8"
      label="Agosto"
      min-width="80">
       <template slot-scope="scope">
        <i v-if="andamento && Math.sign(scope.row[scope.column.property]) == -1" style="color:red">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento && Math.sign(scope.row[scope.column.property]) == 1" style="color:green">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="!andamento">{{scope.row[scope.column.property]}}</i>
      </template>
    </el-table-column>
    <el-table-column
      prop="9"
      label="Settembre"
      min-width="80">
       <template slot-scope="scope">
        <i v-if="andamento && Math.sign(scope.row[scope.column.property]) == -1" style="color:red">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento && Math.sign(scope.row[scope.column.property]) == 1" style="color:green">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="!andamento">{{scope.row[scope.column.property]}}</i>
      </template>
    </el-table-column>
    <el-table-column
      prop="10"
      label="Ottobre"
      min-width="80">
       <template slot-scope="scope">
        <i v-if="andamento && Math.sign(scope.row[scope.column.property]) == -1" style="color:red">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento && Math.sign(scope.row[scope.column.property]) == 1" style="color:green">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="!andamento">{{scope.row[scope.column.property]}}</i>
      </template>
    </el-table-column>
    <el-table-column
      prop="11"
      label="Novembre"
      min-width="80">
       <template slot-scope="scope">
        <i v-if="andamento && Math.sign(scope.row[scope.column.property]) == -1" style="color:red">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento && Math.sign(scope.row[scope.column.property]) == 1" style="color:green">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="!andamento">{{scope.row[scope.column.property]}}</i>
      </template>
    </el-table-column>
    <el-table-column
      prop="12"
      label="Dicembre"
      min-width="80">
       <template slot-scope="scope">
        <i v-if="andamento && Math.sign(scope.row[scope.column.property]) == -1" style="color:red">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento && Math.sign(scope.row[scope.column.property]) == 1" style="color:green">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="andamento">{{scope.row[scope.column.property]}}</i>
        <i v-else-if="!andamento">{{scope.row[scope.column.property]}}</i>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    watch: {
      async tableAnnuale(to,from) {
        this.loading = false
      },
    },
    props:{
      andamento: { type: Boolean, required: true, default: () => false }, 
      tableAnnuale:{ type: Array, required: true, default: () => [] }, 
    }, 
    data() {
      return {
        loading:true,
        search: ''
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