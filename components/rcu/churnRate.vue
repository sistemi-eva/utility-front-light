<template>
  <apexchart ref="chartIncAnnuoPod" type="area" height="300" :options="chartOptions" :series="series"></apexchart>
</template>
<script>
export default {
  props:{
    chart:{ type: Object, required: true, default: () => [] }, 
  }, 
  async mounted() {
    await this.updateChart()
  },
  watch: {
    async chart(to,from) {
      await this.updateChart()
    }
  },
  methods: {
    updateChart(){
      // this.$refs.chartIncAnnuoPod.updateOptions({xaxis: {categories:this.chart.labels}})
      this.$refs.chartIncAnnuoPod.updateSeries(this.chart.series)
    }
  },
    data(){
      return{
        series: [],
        chartOptions: {
          export: {csv: {columnDelimiter: ';'}},
        chart: {
            type: 'area',
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
        colors: ['#C8302D'],
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
          // categories: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago','Set','Ott','Nov','Dic'],
        },
        yaxis: {
            title: {
            text: 'POD'
            }
        },
     
        tooltip: {
            y: {
            formatter: function (val,opts) {
                return `${val} 
                ${opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].percTA}
                - [M-1]: (${opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].percMensile}%) 
                - [Totale]: (${opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].percAnnuale}%)`
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