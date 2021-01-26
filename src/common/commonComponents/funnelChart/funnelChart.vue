<template>
  <div class="flex-box is-vertical">
    <div ref="chart" :style="chartStyle"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
import chartDef from '../chartDef.js'

export default {
  extends: chartDef,
  name: 'v-funnel-chart',
  props: {
    //经过处理的数据源，可选数据格式，详见echarts dataset
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      //当前echart的位置，需初始化
      currentChart: null,
      //控制图例组件显示
      legendvisible: this.legendvis,
      //控制标题组件显示
      titlevisible: this.titlevis,
      //控制缩放组件显示
      zoomvisible: this.zoomvis
    }
  },
  watch: {
    dataSource: function(newVal) {
      this.initChart()
    }
  },
  computed: {},
  mounted() {
    this.currentChart = echarts.init(this.$refs.chart)
    this.initChart()
    window.addEventListener('resize', () => {
      this.currentChart.resize()
    })
    // console.log(this.mode)
    // console.log(this.silentStatus)
  },
  methods: {
    //初始化缩放组件
    initDataZoom(param) {
      let disabled = 100
      let abled = 50
      let dataZoom = [
        {
          type: 'slider',
          xAxisIndex: 0,
          start: 0,
          end: 50,
          show: param
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          start: 0,
          end: 50,
          show: param
        }
      ]
      if (param == true) {
        dataZoom.forEach(element => {
          element.show = param
          element.end = abled
        })
        return dataZoom
      } else {
        dataZoom.forEach(element => {
          element.show = param
          element.end = disabled
        })
        return dataZoom
      }
    },

    //设置图表
    initChart() {
      // this.currentChart = echarts.init(this.$refs.chart)
      let option = {
        title: {
          text: this.chartTitle,
          subtext: this.chartSubTitle,
          left: this.titlepos,
          show: this.titlevis
        },
        // toolbox: {
        //   feature: {
        //     dataView: { readOnly: false },
        //     restore: {},
        //     saveAsImage: {}
        //   }
        // },
        legend: {
          bottom: '0',
          show: this.legendvis
        },
        color: this.color,
        silent: this.silentStatus,
        //对于每一列数据给予生成的图表类型
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: '10%',
            top: 60,
            //x2: 80,
            bottom: 60,
            width: '80%',
            // height: {totalHeight} - y - y2,
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside'
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1,
              opacity: this.opacity
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: this.dataSource
          }
        ]
      }
      this.currentChart.setOption(option)
    },
    //resize方法
    chartResize() {
      this.currentChart.resize()
    }
  }
}
</script>

<style scoped>
.flex-box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -ms-flex-preferred-size: auto;
  flex-basis: auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  height: 100%;
}
.flex-box.is-vertical {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}
</style>
