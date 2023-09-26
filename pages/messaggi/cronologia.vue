<template>
    <div>
      <el-dialog
        title="Dettaglio Messaggio"
        :visible.sync="dialogMessageVisible"
        width="60%"
        center>
        <div style="padding:00px 00px 20px 00px">
          <img :src="`/loghi/${tempMessage.tenant}/logo.png`" style="width:100px" />
        </div>
        <div style="padding:00px 00px 20px 00px">
          <p style="font-size:16pt">Destinatario:  </p>
          <p style="font-size:10pt">{{tempMessage.recipients}}</p>
        </div>
        <div style="padding:00px 00px 20px 00px">
          <p style="font-size:16pt">Messaggio: </p>
          <p style="font-size:10pt">{{tempMessage.message}}</p>
        </div>
      </el-dialog>
      <h2><i class="el-icon-tickets"></i> Cronologia Messaggi </h2>
      <el-divider></el-divider>
      <el-table
        :data="files"
        style="width: 100%"
        >
        <el-table-column
          prop="tenant"
          label="Società"
          >
          <template slot-scope="scope">
          <img :src="`/loghi/${scope.row.tenant}/logo.png`" style="width:100px" />
          </template>
        </el-table-column>
        <el-table-column
          :min-width="100"
          label="Messaggio"
          >
        <template slot-scope="scope">
         {{scope.row.message.length > 40 ?  scope.row.message.substring(0, 40) + '...' : scope.row.message}}
          </template>
        </el-table-column>   
        <el-table-column
          label="Destinatario"
          align="center"
        >
        <template slot-scope="scope">
         {{scope.row.recipients.replace(/\d(?=\d{3})/g, "*")}}
        </template>
        </el-table-column> 
        <el-table-column
          prop="send_date"
          label="Data Invio"
          align="center"
          >
        </el-table-column>
    <el-table-column
        align="center"
        label="Creatore">
    <template slot-scope="scope">
      <div class="tooltip"> 
        <el-tag>{{scope.row.owner}}</el-tag>
        <span v-if="permissions.includes('admin')" class="tooltiptext">{{scope.row.owner_ip}}</span>
      </div>
      </template>
    </el-table-column>
    <el-table-column
        align="right">
      <!-- <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          size="mini"
          placeholder="Cerca"/>
      </template> -->
      <template slot-scope="scope">
        <el-button
          :disabled="permissions.includes('admin') ? false : true"
          size="mini"
          @click="permissions.includes('admin') ? handleShowDetail(scope.$index, scope.row): ''">Visualizza Dettagli</el-button>
      </template>
    </el-table-column>
      </el-table>
      <el-pagination  layout="prev, pager, next" 
        :current-page.sync="filters.page"  
        :page-size="filters.perPage"
        :total="filters.total" 
        @current-change="setPage">
      </el-pagination>
    </div>
</template>

<script>

export default {
  
  name: 'messaggi-cronologia',
  computed: {
    permissions() {
      return this.$store.getters['authPermissions']
    },
   },
  data: () => {
    return {
        filters: {
        page: 1,
        perPage: 10,
        sortBy: "created_at",
        order: "desc",
        search: "",
        total: 1,
      },
      files: [],
      logs: [],
      dialogMessageVisible: false,
      tempMessage: {},
      showWarning : 'completato'
    }
  },
  methods: {
    setPage (val) {
      this.filters.page = val
      this.fetchFolderContent()
    },
    handleShowDetail(scope,row){
      this.tempMessage =  row
      this.dialogMessageVisible = true
    },
    fetchFolderContent() {
      this.$axios.$get('/api/sms', {
        params:{...this.filters},
        headers:{
          'Secret-Key' : this.$store.getters['authToken']
        },
      }).then(
      ({data}) => {
        this.files = data.data
        this.filters.total = Number(data.total)
      },
      error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.response.data.message
        })
      })
    },
  }, 
  mounted() {
    this.fetchFolderContent()
  }
}
</script>
<style>

.main-container {
  max-width: 100%;
  margin: 0 0;
}

.buttons-container {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0px;
}
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .error-row {
    background: rgb(253, 230, 230);
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .tooltip {

  }

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  margin-left: 10px;
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>