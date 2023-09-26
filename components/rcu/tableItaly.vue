<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>{{title}}</span>
    </div>
    <el-table
    :data="data"
    :default-sort = "{prop: 'totale', order: 'descending'}"
    sum-text="Totale"
    :show-summary="title === 'Utenze Attive' ? true : false"
    style="width: 100%">
    <el-table-column
      label="Descrizione">
        <template slot-scope="scope">
          <p v-if="clickableRegion" style="cursor:pointer" @click="handleCurrentChange(scope.row.descrizione)">
            <u>{{ scope.row.descrizione }}</u>
          </p>
          <p v-else>{{ scope.row.descrizione }}</p>
        </template>

    </el-table-column>
    <el-table-column
        sortable
        prop="totale"
        label="Totale"
        >
    </el-table-column>
    <el-table-column
        label="Percentuale">
        <template slot-scope="scope">{{ scope.row.percentuale }} %</template>
    </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { mappa_italia_reversed } from 'assets/app_config.json'

export default {
  props:{
    data:{ type: Array, required: true, default: () => [] }, 
    title: {type: String, required: true, default: () => 'table'},
    height: {type: String, default: () => null},
    clickableRegion : {type: Boolean, default: () => false},
    colorRegioni: {type: Object, default: () => null},
  }, 
  methods: {
    handleCurrentChange(val) {
      if(mappa_italia_reversed[val])
        this.$emit('selectRegion',mappa_italia_reversed[val])
      }
}
}
</script>

<style>

</style>