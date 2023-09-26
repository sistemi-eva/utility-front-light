<template>
  <el-dialog
      :before-close="vModel"
       title="Testata Guida per importazione"
      :visible.sync="value"
      width="35%"
      center>
 <img style="display:flex; margin:auto" src="/testata-fatturazione-passiva.png"/>
    </el-dialog>
</template>

<script>
export default {
  props:{
    value:{ type: Boolean, required: true, default: false }, 
  },
  methods:{
    vModel(){ 
      this.$emit('input', false) 
    },
  },
  data: () => {
    return {
    }
  },
}
</script>

<style>
  .center {
    margin: auto;
    width: 50%;
    padding: 10px;
  }
</style>