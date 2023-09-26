<template>
    <div>
      <el-row class="title-container">
        <el-col :span="5">
          <h2><i class="el-icon-search"></i> Ricerca Globale Preventivi</h2>
        </el-col>
        <el-col :span="18">
            <el-input style="width:89%" @keyup.native.enter="searchContent" placeholder="Ricerca nei preventivi" v-model="searchGlobalPreventivi"></el-input>
            <el-button :disabled="!searchGlobalPreventivi" @click="searchContent" style="width:10%" type="primary"><i class="el-icon-search"/></el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
    </div>
</template>

<script>
export default {
    name: 'preventivi-search',
    mounted(){
        if(this.$route.query){
            this.searchGlobalPreventivi = this.$route.query.text ? this.$route.query.text : ''
        }
    },
    methods:{
        searchContent(){
        }
    },
    data: () => {
    return {
        page:1,
        perPage:1,
        searchGlobalPreventivi: '',
    }}
}
</script>

<style>
  .title-container{
    display: flex;
    align-items: center;
  }
  .center {
    margin: auto;
    width: 50%;
    padding: 10px;
  }
  .main-container {
    max-width: 100%;
    margin: 0 0;
  }
</style>