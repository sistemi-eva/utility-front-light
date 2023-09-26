<template>
  <div>
    <preventivo v-model="preventivoDialog" :modificable="modificable" />
    <importa-preventivo v-model="importaPreventivoDialog" />
    <div>
      <el-row class="title-container">
        <el-col :span="3">
          <h2><i class="el-icon-coin"></i> Lista Preventivi</h2>
        </el-col>
        <el-col :span="18">
          <div class="center">
            <el-input style="width:89%" @keyup.native.enter="goToSearchPage" placeholder="Ricerca nei preventivi" v-model="searchGlobalPreventivi"></el-input>
            <el-button :disabled="!searchGlobalPreventivi" @click="goToSearchPage" style="width:10%" type="primary"><i class="el-icon-search"/></el-button>
          </div>
        </el-col>
        <el-col :span="3" style="text-align:right">
          <el-button @click="showImportaPreventivoDialog" type="primary">Importa preventivi</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row style="height:800px;" :gutter="20">
          <el-col :span="17" style="height:100%;padding-right:20px">
            <el-table
              @cell-click="showItemsList"
              class="hidden-scollbar"
              max-height="800px"
              :data="tableData"
              style="width: 100%;cursor:pointer">
              <el-table-column
                label="Elementi"
                width="200">
                <template slot-scope="scope">
                  <div class="tag-items">{{ scope.row.items }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="Stato"
                >
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="7" class="container-item" style="">
            <div style="padding-left:30px; padding-right:20px; overflow:hidden;">
              <el-row style="display:flex; align-items:center">
                <el-col :span="12">
                  <h3>Lista Preventivi</h3>
                </el-col>
                <el-col v-if="showItems.length>0" :span="12">
                  <el-input placeholder="Ricerca nei preventivi" v-model="searchPreventivi"></el-input>
                </el-col>
              </el-row>
              <div class="container-list hidden-scollbar">
                <div v-for="list in filteredItemsPreventivi" :key="list" >
                  <div class="container-list-item">
                  <span> <i class="el-icon-tickets" style="padding-right:20px"/>{{list}}</span>
                  <div>
                    <el-button @click="showPreventivoDialog(true)">Modifica</el-button>
                    <el-button type="primary" @click="showPreventivoDialog(false)">Visualizza</el-button>
                  </div>
                  </div>
                  <el-divider />
                </div>
            </div>
            <!-- <el-row v-if="showItems.length>0 && showItems.length>7" style=" align-items:center">
                <h3 style="padding-top:10px; text-align:right; cursor:pointer">Visualizza tutti</h3>
            </el-row> -->
            </div>
          </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import preventivo from '@/components/preventivo'
import ImportaPreventivo from '@/components/importaPreventivo'
export default {
  components:{
    preventivo,
    ImportaPreventivo
  },
  name: 'preventivi',
  data: () => {
    return {
      modificable:false,
      importaPreventivoDialog: false,
      preventivoDialog: false,
      searchGlobalPreventivi: '',
      searchPreventivi: '',
      showItems: [],
      tableData: [
        { 'items' :50, "status": "Da Lavorare",
          lists : [
            '184452457545','18245245754512','181452457543','1844524575451','18245245754514','1814524575431',
            '184452457545389','18245245754516','1814524575432',
          ]
        },
        { 'items' :25, "status": "Inviato al distributore",
          lists : [
            '124452457545','1144524575451','134452457543',
          ]
        },
        { 'items' :30, "status": "Preventivo in attesa",
          lists : [
            '104452457545','1444524575451','154452457543',
          ]
         },
        { 'items' :5, "status": "Preventivo Comunicato",
          lists : [
            '174452457545','184452457545156','194452457543',
          ]
         },
        { 'items' :80, "status": "Preventivo Accettato",
          lists : [
            '214452457545','2244524575451','234452457543',
          ]
         },
        { 'items' :67, "status": "Preventivo Rifiutato",
          lists : [
            '244452457545','2544524575451','264452457543',
          ]
         },
      ],
    }
  },
  computed: {
     filteredItemsPreventivi() {
       const temps = this.showItems.filter(data => !this.searchPreventivi 
       || data.toLowerCase().includes(this.searchPreventivi.toLowerCase()) 
       )
       return temps
     }
   },
   methods: {
     goToSearchPage(){
       if(this.searchGlobalPreventivi){
         this.$router.push({path:'/preventivi/search',query: { text:  this.searchGlobalPreventivi} })
       }else{
         this.$notify.error({
            title: "Il campo non può essere vuoto",
            // message: "Prova ad effettuare nuovamente la generazione del nuovo file.",
          });
       }
     },
     showImportaPreventivoDialog(){
       this.importaPreventivoDialog = true
     },
     showPreventivoDialog(bool){
       this.preventivoDialog = true
       this.modificable = bool
     },

     showItemsList(row, column, cell, event){
       this.searchPreventivi = ''
       this.showItems = row.lists
     }
    }
}
</script>
<style scoped>
  .tag-items{
    display:flex;
    justify-content:center;
    text-align:justify;
    background-color:#ecf5ff;border-color: #d9ecff;
    align-items:center;
    width:55px; 
    height:55px; 
    border-radius:15px;
    border-width: 1px;
    border-style: solid;
    box-sizing: border-box;
    color: #409EFF;
    white-space: nowrap;
  }
  .hidden-scollbar::-webkit-scrollbar {
    display: none;
  }
  .container-list{
    padding-top:30px; max-height: 710px; overflow-y: scroll;
  }

  .container-list-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .container-item{
    box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px; 
    height:100%;
    padding:40px;
    /* background-color:red;  */
    border-top-left-radius:20px;
    border-bottom-left-radius:20px

  }
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