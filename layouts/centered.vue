<template>
  <div class="layout-centered-wrapper">
    <div class="header"></div>

    <nuxt/>

    <div class="footer"></div>
  </div>
</template>

<script>

export default {
  name: "centered",
}
</script>

<style>
.layout-centered-wrapper {
  text-align: center;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>