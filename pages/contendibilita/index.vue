<template>
  <div class="cards-list" style="display: block;">
    <div>
      <h2><i class="el-icon-tickets"></i> Nuovo Caricamento Tracciati </h2>
      <el-divider></el-divider>
    </div>
    <el-form
      ref="form"
      :model="form"
      label-position="left"
      label-width="120px"
    >
      <el-row>
        <el-col>
          <el-form-item label="Commodity" prop="commodity">
            <el-select
              v-model="commodity"
              placeholder="Seleziona commodity"
              @change="handleChangeDistributore"
            >
              <el-option
                v-for="c in ['gas', 'energia']"
                :key="c"
                :label="c"
                :value="c"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Distributore" prop="distributore">
            <el-select
              v-model="distributore"
              placeholder="Seleziona distributore"
            >
              <el-option
                v-for="item in elencoDistributori[commodity]"
                :key="item"
                :label="item"
                :value="item"
                >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            :label="commodity == 'energia' ? 'Provincia' : 'Comune'"
            prop="pivot"
            :error="pivot.length == 0 && distributore != 'italgas' ? 'Campo Obbligatorio' : ''"
          >
            <el-select
              v-if="commodity == 'energia'"
              v-model="pivot"
              placeholder="Seleziona provincia"
            >
              <el-option
                v-for="item in elencoPivot[commodity]"
                :key="item"
                :label="item.toUpperCase()"
                :value="item"
                >
              </el-option>
            </el-select>
            <el-input v-else v-model="pivot" placeholder="Digita Comune"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-if="lastImportId">
          <el-form-item label="Import">
            <span>Continua import del: <b>{{ selectedImport.data }}</b></span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="File">
            <div v-if="hasFile">
              <h2> {{ form.xlsxUploadedFileName }}</h2>
              <span v-if="lastImportId && selectedImport.commodity">

              </span>
            </div>
            <el-upload
              v-if="!hasFile"
              style="width: 100%"
              :show-file-list="false"
              :http-request="uploadFunction"
              :file-list="xlsxUploadFile"
              :before-upload="handleBeforeUpload"
              drag
              :limit="1"
              name="xlsx_file"
              accept=".xlsx,.xls"
              class="upload-demo"
              ref="upload"
              action=""
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text"><em>Clicca per fare l'upload</em></div>
            </el-upload>
            <div
              v-if="hasFile"
              style="padding-top:30px;"
            >
              <el-button
                @click="resetForm"
              >
                Elimina File
              </el-button>
              
              <el-button
                v-if="!lastImportId"
                @click="loadAndClose"
                type="primary"
              >
                Carica
              </el-button>

              <el-button
                v-if="!!lastImportId"
                @click="loadAndClose"
                type="danger"
              >
                Carica e termina
              </el-button>
              <el-button
                @click="loadMultiple"
                type="success"
              >
                {{ lastImportId ? 'Carica' : 'Caricamento Multiplo' }}
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-top: 30px">
      <el-divider></el-divider>
      <h2> Caricamenti recenti</h2>
      <el-table
        :data="importsList"
        :default-sort="{ prop: 'data', order: 'descending' }"
        :row-class-name="activeRowClass"
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="data"
          label="Data"
          align="left"
          sortable
          width="200"
        />
        <el-table-column
          prop="commodity"
          label="Commodity"
          align="left"
        />
        <el-table-column
          prop="distributore"
          label="Distributore"
          align="left"
        />
        <el-table-column
          prop="template_id"
          label="Template"
          align="left"
        >
          <template #default="scope">
            {{ scope.row.template && scope.row.template.nome }}
          </template>
        </el-table-column>
        <el-table-column
          prop="stato"
          label="Stato"
          align="left"
        >
          <template #default="scope">
            <span v-if="scope.row.stato.toLowerCase() == 'chiuso'">
              {{ scope.row.stato }}
            </span>
            <span v-else>
              <template v-if="lastImportId == scope.row.id">
                <em >in elaborazione</em>
                <el-button size="mini" type="danger" round @click="selectedImport = {}">annulla</el-button>
              </template>
              <el-button v-else size="mini" round @click="selectImportRow(scope.row)">riprendi</el-button>
            </span>
            <span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pivot"
          label="Provincia/Comune"
          align="left"
        />
        <el-table-column
          prop="filename"
          label="File caricato"
          align="left"
        />
        <el-table-column
          prop="righe_importate"
          label="Righe importate"
          align="left"
        />
      </el-table>
    </div>
  </div>
</template>
<script>

export default {
  //layout: 'centered',
  data: () => {
    return {
      commodity: 'gas',
      distributore: '2iretegas',
      elencoDistributori: {
        'gas': ['2iretegas','italgas'],
        'energia': ['edistribuzione'],
      },
      pivot: '',
      elencoPivot: {
        'gas': '',
        'energia': [
          'na',
          'ce',
          'sa'
        ],
      },
      xlsxUploadFile: [],
      loadingData: [],
      form: {
        date: '',
        xlsxUploadedFileName: '',
      },
      selectedImport: {},
      closeImport: true,
      importsList: [],
      importsPagination: {}
    }
  },
  computed: {
    hasFile() {
      return this.xlsxUploadFile.length > 0
    },
    lastImportId: {
      get() {
        return this.selectedImport.id
        console.log(this.selectedImport.id)
      },
      set(val) {
        this.selectedImport = { id: val } 
      }
    }
  },
  methods: {
    uploadFunction(e){
      console.log('---', e)
      this.form.xlsxUploadedFileName = e.file.name
    },
    handleBeforeUpload(file){
      this.xlsxUploadFile.push(file)
      console.log('::',file, this.xlsxUploadFile)
    },
    handleChangeDistributore() {
      this.distributore = ''
      this.pivot = ''
    },
    resetForm(){
      this.form.xlsxUploadedFileName = ''
      this.xlsxUploadFile = []
      this.pivot = ''
      //this.loadingData = {}
    },
    loadAndClose() {
      this.closeImport = true
      this.loadFile()
    },
    loadMultiple() {
      this.closeImport = false
      this.loadFile()
    },
    loadFile() {
      if(this.pivot.length == 0 && this.distributore != 'italgas') return
      const loading = this.$loading({
        lock: true,
        text: 'Stiamo Caricando il tuo file',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const fd = new FormData();
      fd.append("commodity", this.commodity);
      fd.append("distributore", this.distributore);
      fd.append("pivot", this.pivot);
      if(this.lastImportId) {
        fd.append("lastImportId", this.lastImportId);
      }
      fd.append("closeImport", this.closeImport);
      fd.append("xlsx_file", this.xlsxUploadFile[0]);
      //send call the api to upload files using axios or any other means
      this.$axios.post('/api/contendibilita/caricamento', fd,{
        timeout: 3600000,
        headers:{
          'Secret-Key' : this.$store.getters['authToken']},
          onUploadProgress: function( progressEvent ) {
            this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
          }.bind(this)
      })
      .then((response) => {
        console.log(response)
        const { data, message } = response.data
        this.loadingData.push(data)
        this.selectedImport = this.closeImport ? {} : data
        this.$message({
          showClose: true,
          message
        })
        this.fetchImports(1,5)
        this.resetForm()
        loading.close()
      })
      .catch((e) => {
        this.resetForm()
        if(e.response?.data?.message) {
          this.$message({
            showClose: true,
            message: e.response?.data?.message
          })
        } else {
          this.$message({
            showClose: true,
            message: "Errore Durante l'upload del file"
          })
        }
        loading.close();
      });
    },
    fetchImports(page, perPage) {
      this.$axios.get('/api/contendibilita/imports', {
        params: {
          page,
          perPage
        },
        headers:{
          'Secret-Key' : this.$store.getters['authToken']}
        }
      ).then(
        ({data: responseData}) => {
          const { data, ...pagination } = responseData
          this.importsList = data
          this.importsPagination = pagination
        }
      )
    },
    search(pdp, commodity, distributore) {
      this.$axios.get('/api/contendibilita/search', {
        params: {
          pdp,
          commodity,
          distributore
        },
        headers:{
          'Secret-Key' : this.$store.getters['authToken']}
        }
      ).then(
        ({data}) => {
          console.log(data)
        }
      )
    },
    selectImportRow(row) {
      console.log(this.commodity, this.distributore, row)
      if(this.commodity == row.commodity && this.distributore == row.distributore) {
        this.selectedImport = row
      } else {
        alert('Import incompatibile')
      }
    },
    activeRowClass({ row }) {
      if (row.id == this.lastImportId) {
        return 'active-row';
      }
      return '';
    }
  },
  mounted() {
    this.fetchImports(1, 10)
    //this.search('IT001E83625568', 'energia', '')
  }
}
</script>
<style>
  .el-table .active-row {
    background: #f0f9eb;
  }
</style>