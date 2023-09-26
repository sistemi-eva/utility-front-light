<template>
  <apexchart ref="chartIncAnnuoVolume" type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
</template>
<script>
export default {
  props:{
    seriesGraficoIncrementoVolumeAnnuale:{ type: Array, required: true, default: () => [] }, 
    type : { type: String,  default: () => 'ee' }, 
    colors:  { type: Array, default: () => [] },
  }, 
  async mounted() {
    await this.updateChart()
  },
  watch: {
    async seriesGraficoIncrementoVolumeAnnuale(to,from) {
      await this.updateChart()
    }
  },
  methods: {
    updateChart(){
      if(this.colors.length > 0) this.$refs.chartIncAnnuoVolume.updateOptions({colors:this.colors})
      this.$refs.chartIncAnnuoVolume.updateOptions({xaxis: {categories: [this.type == 'ee' ? 'Gwh' : 'm³']},yaxis: {title: {text: this.type == 'ee' ? 'Gwh' : 'm³'}}})
      this.$refs.chartIncAnnuoVolume.updateSeries(this.seriesGraficoIncrementoVolumeAnnuale)
    }
  },
    data(){
      return{
        series: [],
        chartOptions: {
        export: {csv: {columnDelimiter: ';'}},
        colors: ['#40c9c6','#3bb6de','#36a3f7'],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
            horizontal: false,
            columnWidth: '55%',
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
            categories: [' '],
        },
        yaxis: {
            title: {
            text: 'POD'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
            formatter: function (val,opts) {
                return `${val.toFixed(2)} 
                - [A-1]: (${opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].percPrecedente}%) 
                - [Totale]: (${opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].percIniziale}%)`
            }
          }
        }
        },
      }
    }

}
</script>

<style>

</style>