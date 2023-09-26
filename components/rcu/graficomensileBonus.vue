<template>
  <el-card style="min-height: 513px;" v-loading="loading" class="box-card">
    <div slot="header" class="clearfix">
      <span>Grafico bonus sociale</span>
    </div>
    <client-only> 
      <apexchart ref="chartMensile" height="415" :options="chartOptions" :series="series"></apexchart>
    </client-only>
  </el-card>
</template>

<script>
export default {
  props:{
    table:{ type: Array, required: true, default: () => [] }, 
    colors:  { type: Array, default: () => [] },
  }, 
  async mounted() {
  },
  watch: {
    async table(to,from) {
      this.loading = false
      await this.updateChart()
    },
  },
  methods:{
    updateChart(){
      this.series = this.table.map((el => Number(el.pod)))
      if(this.colors.length > 0) this.$refs.chartMensile.updateOptions({colors:this.colors})
      this.$refs.chartMensile.updateOptions({labels: this.table.map((el => el.bonus_tipo))})
      this.$refs.chartMensile.updateSeries(this.series)
    }
  },
  data() {
    return {
      loading:true,
      series: [],
      chartOptions: {
        export: {csv: {columnDelimiter: ';'}},
        chart: {
          width: 380,
          type: 'pie',
        },
        legend:{
          show:true,
          position: 'bottom',
        },
        colors: ['#40c9c6','#40cd88','#3fd147','#7cd43e','#c4d83e','#dca73d','#e05e3c','#e43b66','#e83ab7','#cc39eb','#7a38ef',,'#374bf3','#36a3f7'],
        labels: [],
        tooltip: {
          y: {
            formatter: function (val) {
              return val
            }
          }
        },

      },
    }
  }
}
</script>

<style>

</style>