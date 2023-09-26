<template>
  <div class="cards-list" style="display: block;">
    <div>
      <h2><i class="el-icon-tickets"></i> Elenco Caricamento Tracciati </h2>
      <el-divider></el-divider>
    </div>
    <el-form ref="form" label-position="left" label-width="120px" :gutter="4">
      <el-row>
        <el-col :span="12">      
          <el-form-item label="Periodo">
            <el-col :span="7">
              <el-date-picker
                v-model="date_start"
                type="date"
                format= "dd/MM/yyyy"
                value-format="dd/MM/yyyy"
                placeholder="Data dal">
                </el-date-picker>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="6">
              <el-date-picker
                v-model="date_end"
                type="date"
                format= "dd/MM/yyyy"
                value-format="dd/MM/yyyy"
                placeholder="Data al">
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="Commodity" prop="commodity">
            <el-select
              v-model="commodity"
              placeholder="Seleziona commodity"
              @change="distributore = ''"
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
        <el-col :span="24">
          <el-form-item label="Stato" prop="stato">
            <el-select
              v-model="stato"
            >
              <el-option
                v-for="item in elencoStati"
                :key="item"
                :label="item"
                :value="item"
                >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-button
            @click="resetForm"
            type="tertiary"
          >
            resetta filtri
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button
            @click="fetchImports(1, 9999)"
            type="primary"
          >
            filtra risultati
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-top: 30px">
      <el-divider></el-divider>
      <el-table
        :data="importsList"
        :default-sort="{ prop: 'data', order: 'descending' }"
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
            <span>
              {{ scope.row.stato }}
            </span>
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
      commodity: '',
      distributore: '',
      elencoDistributori: {
        'gas': ['2iretegas','italgas'],
        'energia': ['edistribuzione'],
      },
      elencoStati: ['aperto','chiuso'],
      closeImport: true,
      importsList: [],
      importsPagination: {},
      date_start: '',
      date_end: '',
      stato: '',
      requestSent: false
    }
  },
  methods: {
    fetchImports(page, perPage) {
      this.$axios.get('/api/contendibilita/imports', {
        params: {
          page,
          perPage,
          date_end: this.date_end,
          date_start: this.date_start,
          commodity: this.commodity,
          distributore: this.distributore,
          stato: this.stato
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
    resetForm() {
      this.commodity = '',
      this.distributore = ''
      this.stato = ''
      this.date_end = ''
      this.date_start = ''
      this.fetchImports(1, 9999)
    }
  },
  mounted() {
    this.fetchImports(1, 9999)
  }
}
</script>
<style>
  .el-table .active-row {
    background: #f0f9eb;
  }
</style>