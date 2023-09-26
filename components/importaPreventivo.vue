<template>
  <el-dialog
      :before-close="vModel"
      title="Importa Preventivi"
      :visible.sync="value"
      width="75%"
      center>
      <el-alert
      style="padding-bottom:20px"
        title="Puoi importare solo file .XML"
        type="warning"
        description="Se il tuo file è diverso occorre modificare il formato del file in modo che sia possibile gestirlo."
        show-icon>
      </el-alert>
      <el-divider></el-divider>
        <el-upload
          style="width: 100%"
          drag
          :limit="1"
          class="upload-demo"
          ref="upload"
          action=""
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>Clicca per fare l'upload</em></div>
        </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="vModel">Annulla</el-button>
        <el-button type="primary" @click="vModel">Importa</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  props:{
    value:{ type: Boolean, required: true, default: false }, 
  },
  methods:{
    vModel(){ this.$emit('input', false) },
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