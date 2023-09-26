<template>
  <div>
    <h2 class=""><i class="el-icon-s-promotion"></i> Invia Messaggio</h2>
    <el-divider></el-divider>
    <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="120px">
      <el-row type="flex" justify="end">
        <el-col>
          <el-form-item label="Azienda" prop="azienda">
            <el-select v-model="form.azienda" placeholder="Seleziona" @change="handleChangeAzienda">
              <el-option
                v-for="item in aziendeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-col>
          <el-form-item label="Modello" prop="template">
            <el-select v-model="form.template" placeholder="Seleziona"  @change="handleChangeModello">
              <el-option
                v-for="item in templates"
                :key="item.id"
                :label="item.nome"
                :value="item.id"
                validate-event	
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Messaggio" prop="messaggio">
            <el-input
              type="textarea"
              :rows="6"
              placeholder="testo del messaggio.."
              v-model="form.messaggio">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row>
      <el-row type="flex" justify="start" :gutter="20">
        <el-col :span="6">
          <el-form-item label="Destinatario" prop="destinatarioSingolo">
            <el-input placeholder="cellulare" v-model="form.destinatarioSingolo">
              <template slot="prepend">+39</template>
            </el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="333695847"
            v-model="form.destinatariMultipli"
            @change="handleChangeDestinatariMultipli"
          >
          </el-input>
        </el-col> -->
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="12">
          <div style="display: flex; justify-content:flex-end">
            <el-button v-if="false" type="warning" icon="el-icon-plus">salva come modello</el-button>
            <el-button type="success" icon="el-icon-s-promotion" @click.prevent="doSubmit">Invia Messaggio</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { aziende } from 'assets/app_config.json'
export default {
  name: 'messaggi',
  data() {
    return {
      templates: [{id: 0, nome:'TESTO PERSONALIZZATO'}],
      aziendeList: aziende,
      form: {
        azienda: '',
        template: 0,
        messaggio: '',
        destinatarioSingolo: '',
        destinatariMultipli: ''
      },
      rules: {
        azienda: [
          {
            required: true,
            message: "Selezionare un'azienda",
            trigger: "change"
          }
        ],
        destinatarioSingolo: [
          {
            required: true,
            pattern: /^(\+39)?[ ]?([0-9]{2,3}(\/|-| )?[0-9]{6,8})$/,
            message: "Inserisci un numero di telefono valido",
            trigger: "blur"
          }
        ],
        messaggio: [
          { 
            required: true, 
            message: "Inserire il del messaggio testo", 
            trigger: "blur" 
          },
        ]
      }
    }
  },
  methods: {
    doSubmit() {
      this.$refs.form.validate(valid => {
        if(valid) {
          const h = this.$createElement;
          this.$msgbox({
          title: 'Invio Messaggio',
          message: h('p', null, [
            h('p',  { style: 'font-size:24pt; margin-bottom:10px'}, 'Azienda: ' + this.form.azienda.toUpperCase()),
            h('i', { style: 'font-size:12pt' }, 'Sei sicuro di voler inviare il messaggio?')
          ]),confirmButtonText: 'Si, invia',
            cancelButtonText: 'Annulla',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/sms', { tenant: this.form.azienda, message: this.form.messaggio, recipients:[this.form.destinatarioSingolo]},
            { headers:{'Secret-Key' : this.$store.getters['authToken']},}
            ).then((res)=> {
              this.$message.success("Invio Effettuato con successo");
              this.resetForm()
            }).catch((e)=>{
              console.log("e",e)
              this.$message.error("Errore durante l'invio");
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'Invio Annullato'
            });          
          });
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields();
      this.form.azienda = this.$route.query.azienda      
    },
    async fetchTemplates(azienda) {
      const templatesResponse = await this.$axios
        .$get('/api/sms/templates', { params: { tenant: azienda },headers:{'Secret-Key' : this.$store.getters['authToken']}})
        .catch((error) => {
          console.log(error)
          console.log('Errore nel caricare i template')
        })
        this.templates = [{id: 0, nome:'TESTO PERSONALIZZATO'}].concat(templatesResponse.data)
    },
    handleChangeAzienda(azienda) {
      this.$router.replace({ path: this.$route.path, query: Object.assign({}, this.$route.query, { azienda })})
      this.fetchTemplates(azienda)
      this.form.template = 0
      this.form.messaggio = ''
    },
    handleChangeModello(id) {
      if(id > 0) {
        let modello = this.templates.find(el => el.id == id)
        this.form.messaggio = modello.messaggio
      } else {
        this.form.messaggio = ''
      }
    },
    handleChangeDestinatariMultipli(value) {
      let lines = value.split(/\n/)
      let hasError = false
      let regEx = new RegExp(/^3\d{2}\d{6,7}$/)
      lines.forEach(line => {
        let test = regEx.test(line)
        console.log(line, test)
        if(!test) 
          hasError = true
      })
      if(hasError) {
        alert('errore')
      }
    }
  },
  mounted() {
    if(this.$route.query.azienda) {
      this.form.azienda = this.$route.query.azienda
      this.fetchTemplates(this.$route.query.azienda)
    }
  }
}
</script>

<style>

</style>