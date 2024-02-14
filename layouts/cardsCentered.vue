<template>
<div>
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-menu-item >{{ this.$cookies.get('azienda') }}</el-menu-item>
    <el-menu-item style="float:right" @click="logout()" >Logout</el-menu-item>
  </el-menu>
  <div class="cards-centered-wrapper">
    <nuxt/>
  </div>
</div>
</template>

<script>
export default {
  name: "cardsCentered",
methods: {
  logout(){
      this.$cookies.remove('token')
      this.$cookies.remove('permissions')
      this.$cookies.remove('tenant_ee')
      this.$cookies.remove('tenant_gas')
      this.$cookies.remove('name')
      this.$notify({
        title: 'Logout Effettuato',
        message: 'Sei uscito dalla parte protetta',
        type: 'success'
      });
      //window.location.reload()
      this.$router.push('/login')
    },
}
}
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}

.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.3s;
}
.layout-enter,
.layout-leave-to {
  opacity: 0;
}

.text-title-header  {
  color: #e6007e;
  cursor: pointer;
  padding-right: 30px;
  text-align: center;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 25px;
}
.top-menu {
  justify-content: space-between;
  display: flex;
  align-items: center;
  height: 120px;
}
.cards-centered-wrapper {
  zoom: 0.9;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
}
</style>