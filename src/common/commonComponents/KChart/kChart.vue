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
  name: 'v-k-chart',
  props: {
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      //控制图例组件显示
      legendvisible: this.legendvis,
      //控制标题组件显示
      titlevisible: this.titlevis,
      //控制缩放组件显示
      zoomvisible: this.zoomvis
    }
  },
  watch: {},
  computed: {
    xAxisData: function() {
      return this.dataSource[0]
      // return ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27']
    },
    seriesData: function() {
      let tempData = []
      for (let i = 1; i < this.dataSource.length; i++) {
        tempData.push(this.dataSource[i])
      }
      return tempData
    }
  },
  mounted() {},
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
      let option = {
        title: {
          text: this.chartTitle,
          subtext: this.chartSubTitle,
          left: this.titlepos,
          show: this.titlevis
        },
        xAxis: {
          data: this.xAxisData
        },
        yAxis: {},
        legend: {
          bottom: '0',
          show: this.legendvis
        },
        color: this.color,
        silent: this.silentStatus,
        //对于每一列数据给予生成的图表类型
        series: [
          {
            type: 'k',
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1,
              opacity: this.opacity
            },
            data: this.seriesData
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
