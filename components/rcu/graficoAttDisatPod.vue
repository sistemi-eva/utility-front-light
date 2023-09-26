<template>
  <el-card v-loading="loading" class="box-card">
    <div slot="header" class="clearfix">
      <div style="display:flex;align-items:center;justify-content: space-between;">
        <span>Andamento Pod</span>
        <div style="display:flex;justify-content:center;align-items:center">
          <el-tooltip class="item" effect="dark" content="" placement="left-start">
          <div slot="content">
            <h2>Immediato riscontro grafico</h2>
          </div>
          <i style="padding-left:20px;" class="el-icon-info"></i>
        </el-tooltip>
        </div>
      </div>
    </div>
    <apexchart ref="chartDisattivazioni" type="line" height="350" :options="chartOptions" :series="series"></apexchart>
  </el-card>
</template>
<script>
export default {
  props:{
    type : { type: String,  default: () => 'ee' }, 
    type_chart : { type: String,  default: () => 'assoluti' }, 
    chart:{ type: Object, required: true, default: () => [] }, 
  }, 
  async mounted() {
    await this.updateChart()
  },
  watch: {
    async chart(to,from) {
      this.loading = false
      await this.updateChart()
    },
    async type_chart(to,from) {
      this.loading = false
      await this.updateChart()
    }
  },
  methods: {
    updateChart(){
      let minValue = this.type_chart == 'percentuale' ? this.chart.minPercent : this.chart.min
      let maxValue = this.type_chart == 'percentuale' ? this.chart.maxPercent : this.chart.max
      if(Object.keys(this.chart).length > 0) {
        let typeFornitura = this.type == 'ee' ? 'Pod' : 'Pdr'
        let simbolo = this.type_chart == 'percentuale' ? '%' : ' '
        this.$refs.chartDisattivazioni.updateOptions(
          {tooltip: {y: {formatter: function (val) {return `${val} ${simbolo} ${typeFornitura}`}}}
          })
        this.$refs.chartDisattivazioni.updateOptions({xaxis: {categories:this.chart[this.type_chart].labels}})
        if(this.type_chart == 'percentuale') {
          this.$refs.chartDisattivazioni.updateOptions({'dataLabels' : {enabled: true, enabledOnSeries: [0,1]},yaxis: [
            {
              min: 0,
              max: maxValue,
              tickAmount: 10,
              seriesName: 'Attivazioni',
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#3fd147'
              },
              labels: {
                style: {
                  colors: '#3fd147',
                }
              },
              title: {
                text: "Andamento Attivazioni",
                style: {
                  color: '#3fd147',
                }
              },
              tooltip: {
                enabled: true
              }
            },
            {
              min: 0,
              max: maxValue,
              tickAmount: 10,
              seriesName: 'Disattivazioni',
              opposite: true,
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#C8302D'
              },
              labels: {
                style: {
                  colors: '#C8302D',
                }
              },
              title: {
                text: "Andamento Disattivazioni",
                style: {
                  color: '#C8302D',
                }
              },
            }
          ]})
        }
        else {
          this.$refs.chartDisattivazioni.updateOptions({
            'dataLabels' : {
              enabled: true, enabledOnSeries: [2]
            },
            yaxis: [
              {
                min: 0,
                max: maxValue,
                tickAmount: 10,
                seriesName: 'Attivazioni',
                axisTicks: {
                  show: true,
                },
                axisBorder: {
                  show: true,
                  color: '#3fd147'
                },
                labels: {
                  style: {
                    colors: '#3fd147',
                  }
                },
                title: {
                  text: "Andamento Attivazioni",
                  style: {
                    color: '#3fd147',
                  }
                },
                tooltip: {
                  enabled: true
                }
              },
              {
                min: 0,
                max: maxValue,
                tickAmount: 10,
                seriesName: 'Disattivazioni',
                opposite: true,
                axisTicks: {
                  show: true,
                },
                axisBorder: {
                  show: true,
                  color: '#C8302D'
                },
                labels: {
                  style: {
                    colors: '#C8302D',
                  }
                },
                title: {
                  text: "Andamento Disattivazioni",
                  style: {
                    color: '#C8302D',
                  }
                },
              },
              {
                tickAmount: 10,
                seriesName: 'Parco Totale',
                opposite: true,
                axisTicks: {
                  show: true,
                },
                axisBorder: {
                  show: true,
                  color: '#b9e2f5'
                },
                labels: {
                  style: {
                    colors: '#b9e2f5',
                  },
                },
                title: {
                  text: "Andamento Parco Totale",
                  style: {
                    color: '#b9e2f5',
                  }
                }
              },
            ]
          })
        }
        this.$refs.chartDisattivazioni.updateSeries(this.chart[this.type_chart].series)
      }
    }
  },
    data(){
      return{
        loading: true,
        series: [],
        chartOptions: {
          export: {csv: {columnDelimiter: ';'}},
        chart: {
            type: 'line',
            height: 450
        },
        plotOptions: {
            bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
            },
        },
        markers: {
          radius:30,
          shape: "circle",
        },
        colors: ['#3fd147','#C8302D','#2696df'],
        stroke: {
              curve: 'straight'
            },
        tooltip: {
            y: {
              formatter: function (val,opts) {
                return `${val} Pod`
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