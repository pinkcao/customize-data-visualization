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
  name: 'v-polar-bar-chart',
  props: {
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
    tooltip: {
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
      zoomvisible: this.zoomvis
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
    },
    dataRow: function() {
      // console.log([...this.dataSource[0]])
      let tempArr = [...this.dataSource[0]]
      tempArr.pop()
      return tempArr
    },
    series: function() {
      let tempSeries = []
      for (let i = 1; i < this.dataSource.length; i++) {
        let tempType = 'bar'
        let tempData = [...this.dataSource[i]]
        let name = tempData.pop()
        tempSeries.push({
          type: tempType,
          data: tempData,
          coordinateSystem: 'polar',
          name: name
        })
      }
      return tempSeries
    }
  },
  mounted() {},
  methods: {
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
      let option = {
        title: {
          text: this.chartTitle,
          subtext: this.chartSubTitle,
          left: 'center',
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
        angleAxis: {},
        radiusAxis: {
          type: 'category',
          data: this.dataRow,
          z: 10
        },
        silent: this.silentStatus,
        itemStyle: {
          opacity: this.opacity
        },
        polar: {},
        series: this.series
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
