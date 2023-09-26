<template>
  <div class="cards-list" style="display: block;">
    <div>
      <h2><i class="el-icon-tickets"></i> Ricerca punto </h2>
      <el-divider></el-divider>
    </div>
    <el-form ref="form" label-position="left" label-width="120px">
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
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="commodity == 'energia' ? 'POD' : 'PDR'" prop="pdp">
            <el-input v-model="pdp" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="Ricerca avanzata" name="ricerca-avanzata">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="Misuratore" prop="misuratore">
                    <el-input v-model="misuratore" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="commodity == 'energia'">
                <el-col :span="24">
                  <el-form-item label="Eneltel" prop="eneltel">
                    <el-input v-model="eneltel" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="Citta" prop="localita">
                    <el-input v-model="localita" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="Indirizzo" prop="indirizzo">
                    <el-input v-model="indirizzo" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="CAP" prop="cap">
                    <el-input v-model="cap" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="Provincia" prop="provincia">
                    <el-input v-model="provincia" />
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="Stato" prop="stato">
                    <el-input v-model="stato" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div style="display: flex; justify-content: end; margin-top: 20px;">
            <el-button
              @click="doSubmit"
              type="primary"
              style="margin-left: 20px"
              >
              Cerca
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-top: 30px">
      <el-divider></el-divider>
      <h2> Risultato recerca</h2>
      <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 20px;column-gap: 10px;">
        <el-card
          v-for="(result, i) in results"
          :key="i"
          class="box-card"
        >
          <div v-if="false" slot="header" class="clearfix" style="font-weight: bold;">
            <span>{{ commodity == 'gas' ? 'POD: ' : 'PDR: ' }}</span>
            <span>{{ commodity == 'gas' ? result.pdr : result.pod }}</span>
          </div>
          <div >
            <div v-for="(map, m) in mapping" :key="m" >
              <div v-if="!!result[map.colonna_db]" style="display: flex; border-bottom: 1px solid #e6e6e6; padding: 10px 0px">
                <div style="width: 280px; color: #817e7e;">{{ map.etichetta_campo_file }}:</div> <span>{{ result[map.colonna_db] }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <div v-if="requestSent && results.length == 0">
        <h1>Nessun risultato trovato</h1>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  //layout: 'centered',
  data: () => {
    return {
      pdp: '',
      misuratore: '',
      eneltel: '',
      indirizzo: '',
      localita: '',
      cap: '',
      provincia: '',
      stato: '',
      commodity: 'gas',
      distributore: '2iretegas',
      elencoDistributori: {
        'gas': ['2iretegas','italgas'],
        'energia': ['edistribuzione'],
      },
      results: [],
      mapping: [],
      activeNames: [],
      requestSent: false
    }
  },
  methods: {
    handleChange(e) {
      console.log(e)
    },
    doSubmit() {
      this.requestSent = false
      this.search({
        pdp: this.pdp.length ? this.pdp : null,
        eneltel: this.eneltel.length ? this.eneltel : null,
        misuratore: this.misuratore.length ? this.misuratore : null,
        localita: this.localita.length ? this.localita : null,
        indirizzo: this.indirizzo.length ? this.indirizzo : null,
        cap: this.cap.length ? this.cap : null,
        provincia: this.provincia.length ? this.provincia : null,
        commodity: this.commodity,
        distributore: this.distributore
      })
    },
    search({pdp, eneltel, misuratore, localita, indirizzo, cap, provincia, commodity, distributore}) {
      this.$axios.get('/api/contendibilita/search', {
        params: {
          pdp,
          eneltel,
          commodity,
          misuratore,
          distributore,
          indirizzo,
          localita,
          cap,
          provincia,
          username: this.$store.getters["authName"],
          source: 'utility'
        },
        headers:{
          'Secret-Key' : this.$store.getters['authToken']}
        }
      ).then(
        ({data}) => {
          console.log(data)
          this.results = data.data
          this.mapping = data.mapping
        },
        () => {
          this.results = []
          this.mapping = []
        }
      ).finally(() => { this.requestSent = true })
    },
  },
  mounted() {
    // this.search('IT001E83625568', 'energia', '')
  }
}
</script>