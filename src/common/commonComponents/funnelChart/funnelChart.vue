<template>
  <div class="flex-box is-vertical">
    <div ref="chart" :style="chartStyle"></div>
  </div>
</template>
<script>
import echarts from 'echarts'

export default {
  name: 'v-funnel-chart',
  props: {
    width: {
      default: '100%'
    },
    height: {
      default: '100%'
    },
    //经过处理的数据源，可选数据格式，详见echarts dataset
    dataSource: {
      type: Array,
      default: () => []
    },
    color: {
      type: Array,
      //echarts基础调色盘
      default: () => [
        '#c23531',
        '#2f4554',
        '#61a0a8',
        '#d48265',
        '#91c7ae',
        '#749f83',
        '#ca8622',
        '#bda29a',
        '#6e7074',
        '#546570',
        '#c4ccd3'
      ]
    },
    type: {
      type: String,
      default: 'bar'
    },
    chartTitle: {
      type: String,
      default: ''
    },
    chartSubTitle: {
      type: String,
      default: ''
    },
    tooltip: {
      type: Boolean,
      default: true
    },
    legendvis: {
      type: Boolean,
      default: true
    },
    titlevis: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      //当前echart的位置，需初始化
      currentChart: null,
      //用于设置一些基础参数，比如坐标轴是否显示
      schema: null,
      //控制图例组件显示
      legendvisible: this.legendvis,
      //控制标题组件显示
      titlevisible: this.titlevis,
      //控制缩放组件显示
      zoomvisible: this.zoomvis,
      //当前图表的标题
      currentChartTitle: '',
      //当前图表的副标题
      currentChartSubTitle: ''
    }
  },
  watch: {
    dataSource: function(newVal) {
      this.initChart()
    }
  },
  computed: {
    //设置图表的整个宽,高
    chartStyle: function() {
      return {
        width: this.width,
        height: this.height
      }
    }
  },
  mounted() {
    this.currentChart = echarts.init(this.$refs.chart)
    this.initCurrentTitle()
    this.initChart()
    window.addEventListener('resize', () => {
      this.currentChart.resize()
    })
  },
  methods: {
    //控制图例组件是否显示
    onChangeLegend(val) {
      this.legendvisible = val
      this.initChart()
    },
    //控制标题组件是否显示
    onChangeTitle(val) {
      this.titlevisible = val
      this.initChart()
    },
    //控制缩放组件是否显示
    onChangeZoom(val) {
      this.zoomvisible = val
      this.initChart()
    },
    //初始化获取图表的基础参数
    //初始化标题组件的内容
    initTitle(param) {
      return {
        text: this.currentChartTitle,
        subtext: this.currentChartSubTitle,
        left: 'center',
        show: param
      }
    },
    //初始化当前标题
    initCurrentTitle() {
      this.currentChartTitle = this.chartTitle
      this.currentChartSubTitle = this.chartSubTitle
    },
    //初始化tooltip
    initTooltip(param) {
      if (param == true) {
        return this.tooltip
      }
    },
    //初始化坐标系
    initAxis(param) {
      return param
    },
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
      this.currentChart = echarts.init(this.$refs.chart)
      let option = {
        title: this.initTitle(this.titlevisible),
        tooltip: this.initTooltip(true),
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          bottom: '0',
          show: this.legendvisible
        },
        xAxis: {
          type: 'category',
          //强制显示所有label
          axisLabel: this.interval,
          show: this.initAxis(false)
        },
        yAxis: {
          show: this.initAxis(false)
        },
        dataZoom: this.initDataZoom(false),
        color: this.color,
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
              borderWidth: 1
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
