<template>
  <Login/>
</template>

<script>
import Login from '@/components/layout/Login'
export default {
  layout: 'centered',
  name : 'index',
  components: { Login }
}
</script>

<style scoped>
.el-card__body{
  padding:30px;
  max-height:600px impor !important; 
  overflow-y: none !important
}
</style>