<template>
  <el-main class="main-container" v-if="flow">
    <el-dialog
      width="80%"
      title="Report Flusso"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      @close="
        invio = [];
        (pagamento = []), (tenant = null);
        commodity = [];
      "
    >
      <el-card>
        <el-row slot="header" :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="2" :xl="2" style="display:flex;align-items:center;height:30px">
            <p>Filtra per:</p>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="4" :xl="4" style="padding-right:0px">
            <el-input clearable v-model="search" placeholder="Cerca" />
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
            <el-select clearable v-model="selectedTenant" collapse-tags placeholder="Società">
              <el-option v-for="item in tenants" :key="item" :label="item" :value="item" style="text-transform: uppercase;"> </el-option>
            </el-select>
            <el-select v-model="commodity" multiple collapse-tags style="margin-left: 5px;" placeholder="Tipologia">
              <el-option v-for="item in tipo_documento" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-select v-model="pagamento" multiple collapse-tags style="margin-left: 5px;" placeholder="Modalità Pagamento">
              <el-option v-for="item in modalita_pagamento" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-select v-model="invio" multiple collapse-tags style="margin-left: 5px;" placeholder="Invio Fatture">
              <el-option v-for="item in invio_fatture" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-select :disabled="!invio.includes(1)" v-model="stato_email" multiple collapse-tags style="margin-left: 5px;" placeholder="Stato Email">
              <el-option v-for="item in stati_email" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-table height="580" :row-class-name="tableRowClassName" :data="pagedDetailData">
          <el-table-column label="Società" align="center">
            <template slot-scope="scope">
              <img :src="`/loghi/${scope.row.tenant_code}/logo.png`" style="width:100px" />
            </template>
          </el-table-column>
          <el-table-column prop="commodity" label="Tipologia" align="center" width="100">
            <template slot-scope="scope">
              <img v-if="scope.row.commodity === 'EE'" :src="`/icone/lampadina.png`" style="width:35px" />
              <img v-if="scope.row.commodity === 'GAS'" :src="`/icone/fiamma.png`" style="width:35px" />
              <img v-if="scope.row.commodity === 'SERV'" :src="`/icone/servizio.png`" style="width:35px" />
            </template>
          </el-table-column>
          <el-table-column prop="codice_cliente" label="Codice Cliente" align="center"> </el-table-column>
          <el-table-column prop="ragione_sociale" label="Ragione Sociale" width="230">
            <template slot-scope="scope"> {{ scope.row.ragione_sociale }} ({{ scope.row.codice_cliente }}) </template>
          </el-table-column>
          <el-table-column prop="email" label="E-mail" align="center"> </el-table-column>
          <el-table-column prop="indirizzo" label=" Indirizzo" width="260">
            <template slot-scope="scope"> {{ scope.row.indirizzo }} {{ scope.row.citta }} ({{ scope.row.provincia }}) </template>
          </el-table-column>
          <el-table-column prop="modalita_pagamento" label="Pagamento" align="center"> </el-table-column>
          <el-table-column prop="modalita_invio_id" label="Mod. Invio" align="center">
            <template slot-scope="scope" style="height:50px">
              <span v-if="scope.row.modalita_invio_id == 1" style="display:flex;justify-content:center;align-items:center;height:50px">
                <el-tooltip class="item" effect="dark" content="Cartacea" placement="top-start">
                  <i class="el-icon-document" style="font-size:22pt"></i>
                </el-tooltip>
              </span>
              <span v-if="scope.row.modalita_invio_id == 2" style="display:flex;justify-content:center">
                <el-tooltip v-if="!!scope.row.errore_email" class="item" effect="dark" :content="scope.row.errore_email" placement="top-start">
                  <img :src="`/icone/email-cartacea-errore.png`" style="width:30px" />
                </el-tooltip>
                <el-tooltip v-else-if="scope.row.invio_email === true" class="item" effect="dark" content="Email Inviata con successo" placement="top-start">
                  <img :src="`/icone/email-cartacea-inviata.png`" style="width:30px" />
                </el-tooltip>
                <el-tooltip v-else class="item" effect="dark" content="Email da Inviare" placement="top-start">
                  <img :src="`/icone/email-cartacea-dainviare.png`" style="width:30px" />
                </el-tooltip>
              </span>
              <span v-if="scope.row.modalita_invio_id == 3" style="display:flex;justify-content:center">
                <el-tooltip v-if="!!scope.row.errore_email" class="item" effect="dark" :content="scope.row.errore_email" placement="top-start">
                  <img :src="`/icone/email-errore.png`" style="width:30px" />
                </el-tooltip>
                <el-tooltip v-else-if="scope.row.invio_email === true" class="item" effect="dark" content="Email Inviata con successo" placement="top-start">
                  <img :src="`/icone/email-inviata.png`" style="width:30px" />
                </el-tooltip>
                <el-tooltip v-else class="item" effect="dark" content="Email da Inviare" placement="top-start">
                  <img :src="`/icone/email-dainviare.png`" style="width:30px" />
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="multifornitura" label="Tipo Fornitura" align="center">
            <template slot-scope="scope">
              {{ scope.row.multifornitura === true ? "Multifornitura" : "Fornitura Singola" }}
            </template>
          </el-table-column>
          <el-table-column label="Azioni" align="center">
            <template slot-scope="scope">
              <el-button v-if="flow.flow_type === 'definitivo' && scope.row.invio_email === false && scope.row.modalita_invio_id != 1" type="success" size="small" style="margin-left: 5px;margin-top:5px" :disabled="(loadingID != scope.row.tenant + flow.code) && loadingID" :loading="loadingID === scope.row.id ? true:false" @click="sendEmails(scope.row.tenant_code, scope.row.flow_code, scope.row.id, scope.row.email)">Invia E-Mail</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :current-page.sync="detail_page" :page-size="detail_page_size" :total="detail_total" @current-change="setDetailPage"></el-pagination>
      </el-card>
    </el-dialog>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h2><i class="el-icon-tickets"></i> Dettaglio Flusso {{ $route.params.code }}</h2>
    </div>
    <el-divider></el-divider>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="17" :xl="17">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-card>
              <div slot="header" class="clearfix">
                <span>Dettaglio Flusso</span>
                <p style="float: right; font-size:14pt;" class="text-muted">
                  AVVIATO DA:
                  <el-tooltip class="item" effect="dark" :content="flow.owner_ip" placement="top-start"
                    ><b>{{ flow.owner.toUpperCase() }}</b></el-tooltip
                  >
                </p>
                <p style="float: right; font-size:14pt;" class="text-muted">
                  TIPO STAMPA: <b>{{ flow.flow_limit == 0 ? "TUTTE LE FATTURE" : `SOLO ${flow.flow_limit > 1 ? `${flow.flow_limit} FATTURE` : `${flow.flow_limit} FATTURA`}` }}</b> - &nbsp
                </p>
                <p style="float: right; font-size:14pt;" class="text-muted">
                  FLUSSO: <b>{{ flow.flow_type.toUpperCase() }}</b> - &nbsp
                </p>
              </div>
              <div v-if="tenants.length > 0">
                <el-row v-for="(tenant, index) in tenants" :key="tenant">
                  <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3" style="display:flex;align-items:center;justify-content:center;height:90px">
                    <img :src="`/loghi/${tenant}/logo.png`" style="width:135px;" />
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3" style="text-align:center">
                    <p style="font-size: 15pt; font-weight:600">Documenti</p>
                    <p style="font-size: 13pt">{{ flow.details.filter((el) => el.tenant_code == tenant).length }}</p>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3" style="display:flex;justify-content:center;align-items:center;flex-direction:column">
                    <p style="font-size: 15pt; font-weight:600">Tipologia</p>
                    <div v-for="(tipo, index) in tipo_documento" :key="'tipo' + index">
                      <img v-if="tipo.value === 'EE'" :src="`/icone/lampadina.png`" style="width:20px" />
                      <img v-if="tipo.value === 'GAS'" :src="`/icone/fiamma.png`" style="width:20px" />
                      <img v-if="tipo.value === 'SERV'" :src="`/icone/servizio.png`" style="width:20px" />
                      <span style="font-size:13pt">{{ flow.details.filter((el) => el.tenant_code == tenant && el.commodity === tipo.value).length }}</span>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3" style="display:flex;justify-content:center;flex-direction:column">
                    <p style="font-size: 15pt; font-weight:600">Pagamento</p>
                    <div v-for="(tipo, index) in modalita_pagamento" :key="'paga' + index">
                      <span class="text-muted" style="font-size: 13pt">{{ tipo.label }}:</span>
                      <span style="font-size:13pt">{{ flow.details.filter((el) => el.tenant_code == tenant && el.modalita_pagamento_id === tipo.value).length }}</span>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3" style="display:flex;justify-content:center;align-items:center;flex-direction:column">
                    <p style="font-size: 15pt; font-weight:600">Mod. Invio</p>
                    <div v-for="(tipo, index) in invio_fatture" :key="'invio' + index">
                      <img v-if="tipo.value ===1" :src="`/icone/email.png`" style="width:20px" />
                      <i v-if="tipo.value === 3" class="el-icon-document"></i>
                      <!-- <span class="text-muted" style="font-size: 13pt">{{ tipo.label }}:</span> -->
                      <span style="font-size:13pt">{{ flow.details.filter((el) => el.tenant_code == tenant && el.modalita_invio_id != tipo.value).length }}</span>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3">
                    <p style="font-size: 15pt; font-weight:600">Fornitura</p>
                    <div>
                      <span class="text-muted" style="font-size: 13pt">Singola:</span>
                      <span style="font-size:13pt"> {{ flow.details.filter((el) => el.tenant_code == tenant && el.multifornitura === false).length }}</span>
                    </div>
                    <div>
                      <span class="text-muted" style="font-size: 13pt">Multifornitura:</span>
                      <span style="font-size:13pt"> {{ flow.details.filter((el) => el.tenant_code == tenant && el.multifornitura === true).length }}</span>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3">
                    <p style="font-size: 15pt; font-weight:600">Fogli Stampati</p>
                    <div v-for="(tipo, index) in fogli" :key="'fogli' + index">
                      <span v-if="flow.details.filter((el) => el.tenant_code == tenant && el.numero_fogli === tipo && el.modalita_invio_id != 3).length > 0">
                        <span class="text-muted" style="font-size: 13pt">({{ tipo === 1 ? tipo + " Foglio" : tipo + " Fogli" }}):</span>
                        <span style="font-size:13pt">{{ flow.details.filter((el) => el.tenant_code == tenant && el.numero_fogli === tipo && el.modalita_invio_id != 3).length }}</span>
                      </span>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3" style="display:flex;align-items:center;justify-content:center;height:90px">
                    <el-button
                      type="primary"
                      size="small"
                      @click="
                        dialogTableVisible = true;
                        selectedTenant = tenant;
                      "
                      style="margin-left: 5px;"
                      >Visualizza Report</el-button
                    >
                  </el-col>
                  <el-col v-if="index != tenants.length - 1" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-divider />
                  </el-col>
                </el-row>
              </div>
              <div v-else style="display:flex;justify-content:center;align-items:center;flex-direction:column">
                <img src="/icone/empty.png" style="width:350px" />
                <h3 class="text-muted">Nessun dettaglio trovato</h3>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mt-5">
            <el-card>
              <div slot="header" class="clearfix">
                <span>Dettaglio Email</span>
              </div>
              <el-row v-if="tenants.length > 0">
                <div v-for="(tenant, index) in tenants" :key="tenant">
                  <el-col :xs="24" :sm="24" :md="24" :lg="4" :xl="4" style="display:flex;align-items:center;justify-content:center;height:70px">
                    <img :src="`/loghi/${tenant}/logo.png`" style="width:135px" />
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="4" :xl="4" style="text-align:center">
                    <p style="font-size: 15pt; font-weight:600">Totale</p>
                    <p style="font-size: 13pt">{{ flow.details.filter((el) => el.tenant_code == tenant && el.modalita_invio_id != 1).length }}</p>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="4" :xl="4" style="text-align:center">
                    <p style="font-size: 15pt; font-weight:600">Da Inviare</p>
                    <p style="font-size: 13pt">{{ flow.details.filter((el) => el.tenant_code == tenant && el.invio_email === false && el.modalita_invio_id != 1 && !el.errore_email).length }}</p>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="4" :xl="4" style="text-align:center">
                    <p style="font-size: 15pt; font-weight:600">Inviate</p>
                    <p style="font-size: 13pt">{{ flow.details.filter((el) => el.tenant_code == tenant && el.invio_email === true && !el.errore_email).length }}</p>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="4" :xl="4" style="text-align:center">
                    <p style="font-size: 15pt; font-weight:600">In Errore</p>
                    <p style="font-size: 13pt">{{ flow.details.filter((el) => el.tenant_code == tenant && !!el.errore_email).length }}</p>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="4" :xl="4" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:70px">
                    <el-button
                      v-if="flow.details.filter((el) => el.tenant_code == tenant && el.modalita_invio_id != 1).length > 0"
                      type="primary"
                      size="small"
                      @click="
                        dialogTableVisible = true;
                        invio = [1];
                        selectedTenant = tenant;
                      "
                      style="margin-left: 5px;"
                      >Visualizza Report</el-button
                    > 
                    <el-button :disabled="(loadingID != tenant + flow.code) && loadingID" v-if="flow.flow_type == 'definitivo' && flow.details.filter((el) => el.tenant_code == tenant && el.invio_email === false && el.modalita_invio_id != 1 && !el.errore_email).length > 0" type="success" size="small" style="margin-left: 5px;margin-top:5px" :loading="loadingID === tenant + flow.code ? true : false" @click="sendEmails(tenant, flow.code)">Invia E-Mail</el-button>
                  </el-col>
                  <el-col v-if="index != tenants.length - 1" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-divider />
                  </el-col>
                </div>
              </el-row>
              <div v-else style="display:flex;justify-content:center;align-items:center;flex-direction:column">
                <img src="/icone/empty.png" style="width:350px" />
                <h3 class="text-muted">Nessun dettaglio trovato</h3>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mt-5">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>Lista file</span>
              </div>
              <div style="min-height:480px;overflow-y: scroll;padding-left:15px">
                <el-table height="480" :row-class-name="tableRowClassName" :data="pagedFileData">
                  <el-table-column prop="file_name" label="Nome File"> </el-table-column>
                  <el-table-column prop="total" label="Totale" align="center"> </el-table-column>
                  <el-table-column prop="processed" label="Processati" align="center"> </el-table-column>
                  <el-table-column prop="stampatore_sent" label=" Stampatore" align="center">
                    <template slot-scope="scope">
                      <i v-if="scope.row.stampatore_sent == true" class="el-icon-circle-check"></i>
                      <i v-else class="el-icon-warning"></i>
                      <i v-if="scope.row.status == 'in errore'" class="el-icon-error"></i>
                    </template>
                  </el-table-column>
                  <el-table-column prop="stampatore_total" label="Totale Stampatore" align="center"> </el-table-column>
                  <el-table-column prop="start_date" label="Data Inizio" align="center"> </el-table-column>
                  <el-table-column prop="end_date" label="Data Fine" align="center"> </el-table-column>
                </el-table>
                <el-pagination layout="prev, pager, next" :current-page.sync="file_page" :page-size="file_page_size" :total="file_total" @current-change="setFilePage"></el-pagination>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="12" :md="24" :lg="7" :xl="7">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Log</span>
            <p style="float: right; font-size:14pt;" class="text-muted" type="text">
              {{ flow.logs.filter((el) => el.type === "error").length > 0 ? "Sono presenti " + flow.logs.filter((el) => el.type == "error").length + " errori" : "Non ci sono errori" }}
            </p>
          </div>
          <div :style="`height:${tenants.length > 1 ? 928 + 262 * (tenants.length - 1) : tenants.length === 1 ? 928 : 1320}px;overflow-y: scroll;padding-left:15px`">
            <li style="list-style: none;" v-for="item in flow.logs" :key="item.code">
              <span v-if="item">
                <el-tag :style="item.type != 'error' ? null : 'background-color:red'"
                  ><p :style="item.type != 'error' ? null : 'color:white'">{{ getTag(item) }}</p></el-tag
                >
                <p style="font-size:12pt">{{ item.text }}</p>
                <p class="text-muted" style="font-size:13pt">{{ item.created_at }}</p>
                <el-divider />
              </span>
            </li>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
export default {
  data() {
    return {
      stato_invio_email: null,
      dialogTableVisible: false,
      loadingID: null,
      search: "",
      flow: null,
      stato_email: [],
      commodity: [],
      pagamento: [],
      invio: [],
      selectedTenant: null,
      tenants: [],
      fogli: [],
      file_total: 0,
      file_page: 1,
      file_page_size: 6,
      detail_total: 0,
      detail_page: 1,
      detail_page_size: 6,
      interval : null,
      invio_fatture: [
        { label: "Email", value: 1 },
        { label: "Cartacea", value: 3 },
      ],
      stati_email: [
        { label: "Da Inviare", value: false },
        { label: "Inviate", value: true },
        { label: "Errore", value: "errore" },
      ],
      modalita_pagamento: [
        { label: "RID / SDD", value: 1 },
        { label: "Bonifico", value: 2 },
        { label: "Bollettino", value: 6 },
      ],
      tipo_documento: [
        { label: "Energia ", value: "EE" },
        { label: "Gas", value: "GAS" },
        { label: "Servizio", value: "SERV" },
      ],
    };
  },
 async mounted() {
    await this.getData();
    this.statusEmail();
    this.interval = setInterval(() => {
      this.statusEmail();
    }, 5000);
  },
  beforeDestroy() {
    console.log("clear")
    clearInterval(this.interval)
    this.interval = null
  },
  computed: {
    pagedFileData() {
      const temps = this.flow.files;
      this.file_total = temps.length;
      return temps.slice(this.file_page_size * this.file_page - this.file_page_size, this.file_page_size * this.file_page);
    },
    pagedDetailData() {
      var temps = this.flow.details.filter(
        (data) =>
          !this.search ||
          data.citta.toLowerCase().includes(this.search.toLowerCase()) ||
          data.provincia.toLowerCase().includes(this.search.toLowerCase()) ||
          data.indirizzo.toLowerCase().includes(this.search.toLowerCase()) ||
          data.cap
            .toString()
            .toLowerCase()
            .includes(this.search.toLowerCase()) ||
          data.ragione_sociale.toLowerCase().includes(this.search.toLowerCase()) ||
          data.codice_cliente
            .toString()
            .toLowerCase()
            .includes(this.search.toLowerCase())
      );
      if (this.commodity && this.commodity.length > 0) {
        temps = temps.filter((el) => this.commodity.includes(el.commodity));
      }
      if (this.pagamento && this.pagamento.length > 0) {
        temps = temps.filter((el) => this.pagamento.includes(el.modalita_pagamento_id));
      }
      if (this.invio && this.invio.length > 0) {
        let temp = []
        if(this.invio.includes(1)) temp = [2,3]
        if(this.invio.includes(3)) temp = [...temp,1,2]
        temps = temps.filter((el) => temp.includes(el.modalita_invio_id));
      }
      if (this.stato_email && this.stato_email.length > 0) {
        if (this.stato_email.includes("errore")) {
          temps = temps.filter((el) => !!el.errore_email || this.stato_email.includes(el.invio_email));
        } else temps = temps.filter((el) => this.stato_email.includes(el.invio_email));
      }
      if (this.selectedTenant) {
        temps = temps.filter((el) => el.tenant_code === this.selectedTenant);
      }
      temps = temps.sort((a, b) => a.codice_cliente - b.codice_cliente);
      this.detail_total = temps.length;
      return temps.slice(this.detail_page_size * this.detail_page - this.detail_page_size, this.detail_page_size * this.detail_page);
    },
  },
  methods: {
    async sendEmails(tenant, flow_code, id, email) {
      if ((id, email)) {
            this.loadingID = id;
            await this.$prompt("Conferma l'email prima di procedere", "Conferma", {
              inputValue: email,
              confirmButtonText: "OK",
              cancelButtonText: "Annulla",
              inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
              inputErrorMessage: "Email Non valida",
            })
              .then(async ({ value }) => {
                email = value;
                await this.$axios
                  .post("/api/pdf/email", { tenant, flow_code, id, email }, { headers: { "Secret-Key": this.$store.getters["authToken"] } })
                  .then(async (res) => {
                    let message = "Email inviata con successo a " + email;
                    this.$message({
                      message: message,
                      type: "success",
                    });
                    this.getData();
                    this.loadingID = null;
                  })
                  .catch((e) => {
                    this.$message.error("Errore durante la creazione");
                    this.loadingID = null;
                  });
              })
              .catch(() => {
                this.loadingID = null;
                this.$message({
                  type: "info",
                  message: "Invio annullato",
                });
              });
      } else {
        this.$confirm('Procedendo saranno inviate le fatture via email', 'Confermi?', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Annulla',
          type: 'warning'
        })
        .then(() => {
            this.loadingID = tenant + flow_code;
            this.$axios.post("/api/pdf/email", { tenant, flow_code }, { headers: { "Secret-Key": this.$store.getters["authToken"] } }).catch((e) => {
              this.$message.error("Errore durante la creazione");
              this.loadingID = null;
            });
            setTimeout(() => {
              this.statusEmail();
              let message = "Invio email massivo avviato con successo";
              this.$message({
                message: message,
                type: "success",
              });
              this.loadingID = null;
            }, 500);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Eliminazione annullata'
          });          
        });
      }

      
      
    },
    setFilePage(val) {
      this.file_page = val;
    },
    setDetailPage(val) {
      this.detail_page = val;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status == "completato") {
        return "success-row";
      } else if (row.status == "in lavorazione") {
        return "warning-row";
      } else if (row.status == "in errore") {
        return "error-row";
      }
      return "";
    },
    getTag(item) {
      if (item.type === "info") {
        if (item.text.includes("Inizio Master")) return "INIZIA GENERAZIONE";
        else if (item.text.includes("Fine Procedurale")) return "FINE GENERAZIONE";
        else if (item.text.includes("estrazione File")) return "ESTRAZIONE ZIP";
        else if (item.text.includes("lettura XML")) return "LETTURA XML";
        else if (item.text.includes("Elementi Da Processare")) return "TOTALE ELEMENTI";
        else if (item.text.includes("Salvataggio ZIP Stampatore")) return "SALVATAGGIO ZIP PER STAMPATORE";
        else if (item.text.includes("Processo file") || item.text.includes("CHILD PROCESS ID")) return "PROCESSI FIGLI STAMPA";
        else if (item.text.includes("Inizio il File") || item.text.includes("Fine il file")) return "FILE XML";
        else if (item.text.includes("Salvataggio Terranova")) return "SALVATAGGIO ZIP PER TERRANOVA";
      } else if (item.type === "error") return "ERRORE";
      return "background-color:black";
    },
    getColor(item) {
      if (item.type === "info") {
        if (item.text.includes("Inizio Master") || item.text.includes("Fine Procedurale")) return "background-color:blue";
        else if (item.text.includes("estrazione File")) return "background-color:olive";
        else if (item.text.includes("lettura XML")) return "background-color:green";
        else if (item.text.includes("Elementi Da Processare")) return "background-color:violet";
        else if (item.text.includes("Salvataggio ZIP Stampatore")) return "background-color:orange";
        else if (item.text.includes("Processo file") || item.text.includes("CHILD PROCESS ID")) return "background-color:LightGray";
        else if (item.text.includes("Inizio il File") || item.text.includes("Fine il file")) return "background-color:black";
        else if (item.text.includes("Salvataggio Terranova")) return "background-color:brown";
      } else if (item.type === "error") return "background-color:red";
      return "background-color:black";
    },
    statusEmail() {
      this.$axios
        .get("/api/pdf/status/email", {
          headers: {
            "Secret-Key": this.$store.getters["authToken"],
          },
        })
        .then(({ data }) => {
          if (!!this.stato_invio_email && Object.keys(data).length === 0) this.getData();
          this.stato_invio_email = data;
          if (data.tenant && data.flow_code) this.loadingID = data.tenant + data.flow_code;
          else this.loadingID = null;
        });
    },
    getData() {
      this.$axios
        .get("/api/pdf/flows/" + this.$route.params.code, {
          headers: {
            "Secret-Key": this.$store.getters["authToken"],
          },
        })
        .then(
          ({ data }) => {
            this.flow = data.data;
            let filtered = this.flow.details.map((el) => el.tenant_code);
            let filteredFogli = this.flow.details.map((el) => el.numero_fogli);
            this.tenants = filtered.filter(function(item, pos) {
              return filtered.indexOf(item) == pos;
            });
            this.fogli = filteredFogli
              .filter(function(item, pos) {
                return filteredFogli.indexOf(item) == pos;
              })
              .sort();
          },
          (error) => {
            console.log(error);
            this.$message({
              showClose: true,
              message: error.response.data.message,
            });
          }
        );
    },
  },
};
</script>

<style>
.badge-st {
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  margin-left: 5px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;
  background-color: #409eff;
}
.text-muted {
  opacity: 1;
  color: #74788d !important;
}
.mt-5 {
  margin-top: 25px;
}

.mb-5 {
  margin-bottom: 25px;
}

.mt-2 {
  margin-top: 10px;
}

.mb-2 {
  margin-bottom: 10px;
}
.el-badge__content.is-fixed {
  height: 20px;
}
</style>
