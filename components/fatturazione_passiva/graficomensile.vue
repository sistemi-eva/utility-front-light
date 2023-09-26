<template>
  <el-card style="min-height: 615px;" v-loading="loading" class="box-card">
    <div slot="header" class="clearfix">
      <span>Grafico Competenza</span>
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
      let test = this.table
      this.series = test.map((el => Number(el.value)))
      if(this.colors.length > 0) this.$refs.chartMensile.updateOptions({colors:this.colors})
      this.$refs.chartMensile.updateOptions({labels: test.map((el => el.key))})
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

        labels: [],
        tooltip: {
          y: {
            formatter: function (val) {
              return val.toFixed(2)
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