<template>
  <div class="cards-list" style="display: block;">
    <div>
      <h2><i class="el-icon-tickets"></i> Logs </h2>
      <el-divider></el-divider>
    </div>
    <el-row>
      <el-col :span="12">      
        <el-form ref="form" label-position="left" :gutter="4">
          <el-form-item label="Periodo">
            <el-col :span="6">
              <el-date-picker
                v-model="date_start"
                type="date"
                format= "dd/MM/yyyy"
                value-format="dd/MM/yyyy"
                placeholder="Data dal"
              >
              </el-date-picker>
            </el-col>
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
          <el-form-item label="Ricerca">
            <el-col :span="12">
              <el-input
                v-model="search_text"
                placeholder="Utente, POD o PDR"
              />
            </el-col>
          </el-form-item>
        </el-form>
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
          @click="doSubmit"
          type="primary"
        >
          filtra risultati
        </el-button>
      </el-col>
    </el-row>
    <div style="margin-top: 30px">
      <el-divider></el-divider>
      <el-table
        :data="results"
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
          label="Utente"
          align="left"
        >
          <template #default="scope">
            <span>
              {{ getParametro(scope.row.parametri, 'username') }} ({{ scope.row.username }})
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operazione"
          label="Operazione"
          align="left"
        />
        <el-table-column
          label="POD/PRD"
          align="left"
        >
          <template #default="scope">
            <span>
              {{ getParametro(scope.row.parametri, 'pdp') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="Commodity"
          align="left"
        >
          <template #default="scope">
            <span>
              {{ getParametro(scope.row.parametri, 'commodity') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="Distributore"
          align="left"
        >
          <template #default="scope">
            <span>
              {{ getParametro(scope.row.parametri, 'distributore') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="Sorgente"
          align="left"
        >
          <template #default="scope">
            <span>
              {{ getParametro(scope.row.parametri, 'source') || 'dashboard agente' }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>      
  </div>
</template>
<script>

export default {
  //layout: 'centered',
  data: () => {
    return {
      date_start: '',
      date_end: '',
      search_text: '',
      results: [],
      pagination: {},
      requestSent: false
    }
  },
  methods: {
    doSubmit() {
      this.requestSent = false
      this.search({
        date_start: this.date_start.length ? this.date_start : null,
        date_end: this.date_end.length ? this.date_end : null,
        search_text: this.search_text
      })
    },
    search(fields) {
      this.$axios.get('/api/contendibilita/logs', {
        params: { ...fields },
        headers:{
          'Secret-Key' : this.$store.getters['authToken']}
        }
      ).then(
        ({ data: result }) => {
          const { data, ...pagination } = result
          this.results = data
          this.pagination = pagination
        },
        () => {
          this.results = []
        }
      ).finally(() => { this.requestSent = true })
    },
    getParametro(paramsString, paramName) {
      const params = JSON.parse(paramsString)
      return params[paramName] || ''
    },
    resetForm() {
      this.date_end = ''
      this.date_start = ''
      this.date_search = ''
      this.search({})
    }
  },
  mounted() {
    this.search({})
  }
}
</script>