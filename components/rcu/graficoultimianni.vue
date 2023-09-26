<template>
  <apexchart ref="chartLast3Years" type="area" height="350" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
export default {
  props:{
    seriesGrafico3Years:{ type: Object, required: true, default: () => [] },
  }, 
  async mounted() {
    // await this.updateChart()
  },
  watch: {
    async seriesGrafico3Years(to,from) {
      await this.updateChart()
    }
  },
  methods: {
 updateChart(){
    this.$refs.chartLast3Years.updateSeries(this.seriesGrafico3Years.series)
  }
},
    data() {
        return {
        series: [],
            chartOptions: {
              export: {csv: {columnDelimiter: ';'}},
                chart: {
                height: 350,
                type: 'area'
                },
                dataLabels: {
                enabled: true
                },
                stroke: {
                curve: 'smooth'
                },
                xaxis: {
                  categories: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre','Ottobre', 'Novembre', 'Dicembre'
                  ]
                },
                tooltip: {
                y: {
                formatter: function (val,opts) {
                    return `${val} 
                    - [M-1]: (${opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].percMensile}%) 
                    - [Totale]: (${opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].percAnnuale}%)`
                }
                }
            },
            },
            
        }
            
    },

}
</script>

<style>

</style>