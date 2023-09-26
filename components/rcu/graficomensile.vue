<template>
  <el-card style="min-height: 524px;" v-loading="loading" class="box-card">
    <div slot="header" class="clearfix">
      <span>Ripartizione volume del portafoglio</span>
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
    type:{ type: String, default: 'ee' }, 

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
      if(this.type == 'gas') {
        test = []
        let temp = {societa:'Altri', gwh: 0}
        for(let i in this.table){
          if(this.table[i].gwh > 500000) {
            test.push(this.table[i])
          }else{
            temp.gwh += Number(this.table[i].gwh)
          } 
        }
        test.push(temp)
      }
      this.series = test.map((el => Number(el.gwh)))
      if(this.colors.length > 0) this.$refs.chartMensile.updateOptions({colors:this.colors})
      this.$refs.chartMensile.updateOptions({labels: test.map((el => el.societa))})
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