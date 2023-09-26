<template>
  <apexchart ref="chartAnnuale" type="line" height="350" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
export default {
  props:{
    seriesGraficoAnnuale:{ type: Object, required: true, default: () => [] },
    mesi:  { type: Array, required: true, default: () => [] },
  }, 
  async mounted() {
  },
  watch: {
    async seriesGraficoAnnuale(to,from) {
      await this.updateChart()
    }
  },
data() {
    return {
      series: [],
      chartOptions: {
        export: {csv: {columnDelimiter: ';'}},
        chart: {
          export: {csv: {columnDelimiter: ';'}},
          height: 350,
          type: 'line',
        },
        stroke: {
          width: [0, 4]
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        labels: [],
        xaxis: {
        },
        yaxis: [{
          title: {
            text: 'Totale Pod',
          },
        
        }, {
          opposite: true,
          title: {
            text: 'Totale Gwh'
          }
        }]
      }
    }
          
},
methods: {
 updateChart(){
    let finalLabel = []
    for(let i in this.seriesGraficoAnnuale.mesi) {
      finalLabel.push(this.mesi[this.seriesGraficoAnnuale.mesi[i]-1])
    }
    this.$refs.chartAnnuale.updateOptions({labels: finalLabel})
    this.$refs.chartAnnuale.updateSeries(this.seriesGraficoAnnuale.series)
  }
}
}
</script>

<style>

</style>