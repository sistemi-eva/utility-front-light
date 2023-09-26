<template>
<el-card v-loading="loading" class="box-card">
  <div slot="header" class="clearfix">
    <div style="display:flex;align-items:center;justify-content: space-between;">
      <span>Tasso di abbandono</span>
      <div style="display:flex;justify-content:center;align-items:center">
        <el-tooltip class="item" effect="dark" content="" placement="left-start">
        <div slot="content">
          <h2>Immediato riscontro grafico tra punto iniziale e punto attuale</h2>
        </div>
        <i style="padding-left:20px;" class="el-icon-info"></i>
      </el-tooltip>
      </div>
    </div>
  </div>
  <apexchart type="bar" @dataPointSelection="dataPointSelectionHandler" height="300" ref="charChurn" :options="chartOptions" :series="series"></apexchart>
</el-card>
</template>
<script>
export default {
  props:{
    chart:{ type: Object, required: true, default: () => [] }, 
  }, 
  async mounted() {
  },
  watch: {
    async chart(to,from) {
      this.loading = false
      await this.updateChart()
    }
  },
  methods: {
    dataPointSelectionHandler(e, chartContext, config) {
      let anno = this.chart.labels[config.dataPointIndex].slice(this.chart.labels[config.dataPointIndex].lastIndexOf('-') + 1).trim()
      let mese = this.chart.labels[config.dataPointIndex].substr(0, this.chart.labels[config.dataPointIndex].indexOf('-')).trim()
      switch(mese){
        case 'GEN' : mese = '1'; break;
        case 'FEB' : mese = '2'; break;
        case 'MAR' : mese = '3'; break;
        case 'APR' : mese = '4'; break;
        case 'MAG' : mese = '5'; break;
        case 'GIU' : mese = '6'; break;
        case 'LUG' : mese = '7'; break;
        case 'AGO' : mese = '8'; break;
        case 'SET' : mese = '9'; break;
        case 'OTT' : mese = '10'; break;
        case 'NOV' : mese = '11'; break;
        case 'DIC' : mese = '12'; break;
      }
      this.$emit('clickDetail',{anno,mese})
  },
    updateChart(){
      this.$refs.charChurn.updateOptions({xaxis: {categories:this.chart.labels}})
      this.$refs.charChurn.updateSeries(this.chart.series)
    },
  },
    data(){
      return{
        loading: true,
        series: [],
        chartOptions: {
          chart: {
            type: 'bar',
            height: '400' ,
          },
          tooltip: {
            intersect: true,
            shared: false,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded'
              },
          },
          colors: ['#f7a366','#c55963'],
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: [],
          },
          yaxis: {
            labels: {
              show: true,
              formatter: (value) => {return value },
          },
            title: {
              text: undefined
            },
          },
          fill: {
            opacity: 1
          },
          dataLabels: {
            enabled: false
        },
          legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
          }
        },
      }
    }

}
</script>

<style>

</style>