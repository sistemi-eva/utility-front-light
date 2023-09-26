<template>
  <apexchart ref="chartAnnualePod" type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
export default {
  props:{
    seriesChart:{ type: Object, required: true, default: () => [] }, 
    mesi:  { type: Array, required: true, default: () => [] },
    color:  { type: String, required: true, default: () => '#008ffb' },
  }, 
  async mounted() {
    await this.updateChart()
  },
  watch: {
    async seriesChart(to,from) {
      await this.updateChart()
    }
  },
  methods: {
    updateChart(){
      this.$refs.chartAnnualePod.updateOptions({colors:[this.color]})
      this.$refs.chartAnnualePod.updateSeries(this.seriesChart.series)
    }
},
  data() {
    return {
      series: [],
      chartOptions: {
        export: {csv: {columnDelimiter: ';'}},
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: true
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
        labels: []
      },
    }
}
}
</script>

<style>

</style>