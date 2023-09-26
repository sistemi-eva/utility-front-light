<template>
  <div>
    <tabella-info-bonus :type="'rcu-ee/cc'" :mese="mesi.indexOf(meseSelezionato)+1" :anno="annoSelezionato" v-model="dialogTableVisible" />
    <el-row :gutter="20">
        <el-col :span="14">
            <span style="font-size:20pt; font-weight:600">Clienti In</span>
        </el-col>
    </el-row>

    <br/>
    <el-row :gutter="24">
        

      <el-col style="text-align:left" :span="12">
        <el-form ref="form" label-width="120px">
          <el-select @change="updateAll" v-model="aziendaSelezionata" placeholder="Azienda">
              <el-option
              v-for="item in aziende"
              :key="item"
              :label="item"
              :value="item">
              </el-option>
          </el-select>
          <el-select @change="updateAll" v-model="meseSelezionato" placeholder="Mese">
              <el-option
              v-for="item in mesi"
              :key="item"
              :label="item"
              :value="item">
              </el-option>
          </el-select>
          <el-select @change="updateAll" style="padding-left:10px;padding-right:10px;width:218px" v-model="annoSelezionato" placeholder="Anno">
              <el-option
              v-for="item in ultimi5anni"
              :key="item"
              :label="item"
              :value="item">
              </el-option>
          </el-select>
              
        </el-form>

      </el-col>
    </el-row>

    <br/>

    <div class="main" v-if="query1.length > 0">

      <div class="el-row" style="padding-top: 30px">
        <div class="el-col el-col-24">
          <div class="el-card box-card is-always-shadow">
            <div class="el-card__body">        
              <div class="el-table el-table--fit el-table--striped el-table--enable-row-hover">
                <table class="el-table__body" style="width: 100%">
                  <thead>
                    <tr class="el-table__row">
                      <th><div class="cell"><b>Descrizione</b></div></th>
                      <th><div class="cell"><b>EE</b></div></th>
                      <th><div class="cell"><b>GAS</b></div></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="el-table__row" v-for="(item, index) in tableData">
                      <td>
                        <div class="cell">{{index}}</div>
                      </td>
                      <td>
                        <div class="cell">{{ item.EE }}</div>
                      </td>
                      <td>
                        <div class="cell">{{ item.GAS }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
     

 
      <div v-show="!isLoading" id="chart">
        <div class="el-row" style="padding-top: 30px">
          <div class="el-col el-col-24">
            <div class="el-card box-card is-always-shadow">
              <div class="el-card__header"><div class="clearfix"><span>Grafico EE</span></div></div>
              <div class="el-card__body">
                <el-row>
                  <el-col :span="24">
                    <apexchart ref="mychart" type="bar" height="350" :options="graph1.chartOptions" :series="graph1.series"></apexchart>
                  </el-col>
                  
                </el-row>
              </div>
            </div>
          </div>
        </div>

        <div class="el-row" style="padding-top: 30px">
          <div class="el-col el-col-24">
            <div class="el-card box-card is-always-shadow">
              <div class="el-card__header"><div class="clearfix"><span>Grafico GAS</span></div></div>
              <div class="el-card__body">
                <el-row>
                  <h4>GAS</h4>
                  <el-col :span="24">
                    <apexchart ref="mychart2" type="bar" height="350" :options="graph2.chartOptions" :series="graph2.series"></apexchart>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>
  
  <script>
  import CountTo from 'vue-count-to'
  import { ref } from 'vue'

  const today = new Date();
  export default {
    components: {
      CountTo
    },

    data() {
      return {
          
        graph1:{
          series: [{
            name: 'Net Profit',
            data: this.graph1Serie1
          }],
          chartOptions: {
            chart: {
              type: 'bar',
              height: 350
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '50%',
                endingShape: 'rounded'
              },
            },
            dataLabels: {
              enabled: true
            },
            stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
            },
            xaxis: {
              categories: this.graph1Label,
              type: 'category'
            },
            yaxis: {
              title: {
                text: ''
              }
            },
            fill: {
              opacity: 1
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  //return "$ " + val + " thousands"
                }
              }
            }
          },

        },


        graph2:{
          series: [{
            name: 'Net Profit',
            data: this.graph1Serie1
          }],
          chartOptions: {
            chart: {
              type: 'bar',
              height: 350
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '50%',
                endingShape: 'rounded'
              },
            },
            dataLabels: {
              enabled: true
            },
            stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
            },
            xaxis: {
              categories: this.graph1Label,
              type: 'category'
            },
            yaxis: {
              title: {
                text: ''
              }
            },
            fill: {
              opacity: 1
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  //return "$ " + val + " thousands"
                }
              }
            }
          },

        },

        dialogTableVisible: false,
        query1: [],
        tableData: [],
        tableData2: [],
        graph1Label: [],
        graph1Serie1:[],
        graph1Serie2: [],
        graph2Label: [],
        graph2Serie1:[],
        graph2Serie2: [],

        isLoading: false,

        ultimi5anni: [],
        aziendaSelezionata: '',
        annoSelezionato: '',
        annoSelezionatoPrec: '',
        meseSelezionato: '',
        meseIngleseSelezionato: '',
        meseIngleseSelezionatoPrec: '',
        meseIngleseSelezionatoPrec2: '',
        meseSelezionatoPrec: '',
        meseSelezionatoPrec2: '',
        meseNumerico : {"Gennaio" : "01", "Febbraio" : "02", "Marzo": "03", "Aprile" : "04", "Maggio": "05", "Giugno":"06", "Luglio":"07", "Agosto":"08", "Settembre":"09", "Ottobre":"10", "Novembre": "11", "Dicembre": "12"},
        aziende: ['Union Gas Metano S.p.A.', 'Semplice Gas & Luce S.r.l.', 'Piu\' Energie S.r.l.', '2G Energia S.r.l.'],
        mesi: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
        mesiInglese: ['January','February','March','April','May','June','July','August','September','October','November','December']
        
      
      }
    },
    async mounted() {
      this.meseSelezionato = this.mesi[today.getMonth()];
      this.meseIngleseSelezionato = this.mesiInglese[today.getMonth()];
      for(let i = 0; i<5; i++){ this.ultimi5anni.push((new Date().getFullYear()-i).toString())}
      this.annoSelezionato = this.ultimi5anni[0];
      this.aziendaSelezionata = this.aziende[0];

      this.updateAll();
    },
    
  
    methods: {



      formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },


      async updateAll(){

        var self = this;
        const loading = this.$loading({
          lock: true,
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });

        self.isLoading = true;

        this.$axios.post('/api/reportistica/get-switchin', { mese: this.meseNumerico[this.meseSelezionato], anno: this.annoSelezionato, azienda: this.aziendaSelezionata },{
            
          headers:{'Secret-Key' : this.$store.getters['authToken']},
          responseType: 'json',
            
        })
        .then(function(response){
          self.isLoading = false;
          loading.close();
          
          self.query1 = response.data[0];

          console.log(self.query1);

          self.graph1Label = [];
          self.graph1Serie1 = [];
          self.graph1Serie2 = [];
          self.graph2Serie1 = [];
          self.graph2Serie2 = [];
          self.tableData = [];
          self.tableData2 = [];
      
          

          for (var i in self.mesi){

            if (self.mesi[i] == self.meseSelezionato){
              self.meseIngleseSelezionato = self.mesiInglese[i];
              if(i > 0 ){
                self.meseIngleseSelezionatoPrec = self.mesiInglese[i - 1];
                self.meseSelezionatoPrec = self.mesi[i - 1];
              }

              if( i > 1){

                self.meseSelezionatoPrec2 = self.mesi[i - 2];
                self.meseIngleseSelezionatoPrec2 = self.mesiInglese[i - 2];
              
              }

              if(i > 2){
                self.meseIngleseSelezionatoPrec3 = self.mesiInglese[i - 3];
                self.annoSelezionatoPrec = self.annoSelezionato;
              }

              if(i == 0){
                self.meseIngleseSelezionatoPrec = self.mesiInglese[11];
                self.meseIngleseSelezionatoPrec2 = self.mesiInglese[10];
                self.meseIngleseSelezionatoPrec3 = self.mesiInglese[9];

                self.meseSelezionatoPrec = self.mesi[11];
                self.meseSelezionatoPrec2 = self.mesi[10];

                self.annoSelezionatoPrec = parseInt(self.annoSelezionato) - 1;
              }
            }
          }

          var mprec = self.meseIngleseSelezionatoPrec + " " + self.annoSelezionatoPrec; 
          var mprec2 = self.meseIngleseSelezionatoPrec2 + " " + self.annoSelezionatoPrec; 

        

          for (var i in self.query1){
            if( self.query1[i]["Mese Emissione"] == mprec ){
              self.tableData[ self.query1[i]["Macro Stato Riga"]] = {"GAS": 0, "EE": 0};   
            }
            if( self.query1[i]["Mese Emissione"] == mprec2 ){
              self.tableData2[ self.query1[i]["Macro Stato Riga"] ] = {"GAS": 0, "EE": 0};   
            }
          }

          for (var i in self.query1){

            if( self.query1[i]["Mese Emissione"] == mprec ){
              if( self.query1[i]["CODUTILITY"]  == "GAS"  ){
                self.tableData[ self.query1[i]["Macro Stato Riga"] ].GAS++;
              }

              if( self.query1[i].CODUTILITY == "EE"){
                self.tableData[ self.query1[i]["Macro Stato Riga"] ].EE++;
              }
        
            }

            if( self.query1[i]["Mese Emissione"] == mprec2 ){
              if( self.query1[i]["CODUTILITY"]  == "GAS"  ){
                self.tableData2[ self.query1[i]["Macro Stato Riga"]].GAS++;
              }

              if( self.query1[i].CODUTILITY == "EE"){
                self.tableData2[ self.query1[i]["Macro Stato Riga"] ].EE++;
              }
        
            }

              
          }

          

          self.tableData = Object.assign({}, self.tableData);
          self.tableData2 = Object.assign({}, self.tableData2);


          self.tableData = Object.keys(self.tableData)
          .sort()
          .reduce((accumulator, key) => {
            accumulator[key] = self.tableData[key];

            return accumulator;
          }, {});


          self.tableData2 = Object.keys(self.tableData2)
          .sort()
          .reduce((accumulator, key) => {
            accumulator[key] = self.tableData2[key];

            return accumulator;
          }, {});


          for(var i in self.tableData){
            self.graph1Label.push(i);
            
            self.graph1Serie1.push(parseInt(self.tableData[i].EE));
            self.graph2Serie1.push(parseInt(self.tableData[i].GAS));
          }

      

          for(var i in self.tableData2){
            
            self.graph1Serie2.push(parseInt(self.tableData2[i].EE));
            self.graph2Serie2.push(parseInt(self.tableData2[i].GAS));
          }


          self.graph1.series = [
            {
              name: self.meseSelezionatoPrec + " " + self.annoSelezionato,
              data: self.graph1Serie1
            },
            {
              name: self.meseSelezionatoPrec2 + " " + self.annoSelezionato,
              data: self.graph1Serie2,
            }
          ];

      
      
          self.graph1.chartOptions.xaxis = {
            categories: self.graph1Label,
          };
      


          self.graph2.series = [
            {
              name: self.meseSelezionatoPrec + " " + self.annoSelezionato,
              data: self.graph2Serie1
            },
            {
              name: self.meseSelezionatoPrec2 + " " + self.annoSelezionato,
              data: self.graph2Serie2,
            }
          ];

      
      
          self.graph2.chartOptions.xaxis = {
            categories: self.graph1Label,
          };

      

          self.$refs.mychart.refresh();

          self.$refs.mychart2.refresh();
        
 

        })
        .catch(function(e){
          loading.close();
          console.log("errore" + e.message);
          /*
          this.$notify.error({
              title: "C'è stato un errore nella visualizzazione del fatturato",
              message: "Prova ad effettuare nuovamente la generazione del fatturato.",
          });

          */
        });
                
  
      },
   

    }
  }
  </script>
  

<style>
  .el-table::before {
    height: 0;
  }
  .main > .mrow.blue > .el-row .el-col{
    background: #e2eefe;
  }
  .el-col i{
    cursor: pointer;
    font-size: 21.5px;
    margin-right: 10px;
    float: left;
  }
    

</style>