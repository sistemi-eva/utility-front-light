<template>
  <el-dialog
      :before-close="vModel"
      :title="modificable ?'Modifica Preventivo' : 'Preventivo'"
      :visible.sync="value"
      width="85%"
      center>
      <span>Preventivo</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="vModel">Annulla</el-button>
        <el-button type="primary" @click="vModel">Conferma Modifica</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  props:{
    value:{ type: Boolean, required: true, default: false }, 
    modificable:{ type: Boolean, required: true, default: false }, 
  },
  methods:{
    vModel(){ this.$emit('input', false) },
  }
}
</script>

<style>

</style>