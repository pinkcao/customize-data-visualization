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
  name: 'v-radar-chart',
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
  watch: {
    dataSource: function(newVal) {
      this.initChart()
    }
  },
  computed: {
    currentIndicator: function() {
      let indicator = []
      for (let i = 0; i < this.dataSource[0].length; i++) {
        // console.log(this.dataSource[0][i])
        indicator.push({ name: this.dataSource[0][i], max: this.dataSource[1][i] })
      }
      // console.log(indicator)
      return indicator
    },
    currentLegend: function() {
      let legend = []
      for (let i = 2; i < this.dataSource.length; i++) {
        legend.push(this.dataSource[i][this.dataSource[i].length - 1])
      }
      // console.log(legend)
      return legend
    },
    currentSeriesData: function() {
      console.log(this.dataSource)
      let seriesData = []
      for (let i = 2; i < this.dataSource.length; i++) {
        let tempData = []
        for (let j = 0; j < this.dataSource[0].length; j++) {
          tempData.push(this.dataSource[i][j])
        }
        let lineData = {}
        lineData.value = tempData
        lineData.name = this.dataSource[i][this.dataSource[0].length]
        seriesData.push(lineData)
      }
      console.log(seriesData)
      return seriesData
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
        legend: {
          bottom: '0',
          show: this.legendvis,
          data: this.currentLegend
        },
        radar: {
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: this.currentIndicator
          // indicator: [
          //   { name: '销售（sales）', max: 6500 },
          //   { name: '管理（Administration）', max: 16000 },
          //   { name: '信息技术（Information Techology）', max: 30000 },
          //   { name: '客服（Customer Support）', max: 38000 },
          //   { name: '研发（Development）', max: 52000 },
          //   { name: '市场（Marketing）', max: 25000 }
          // ]
        },
        color: this.color,
        silent: this.silentStatus,
        series: [
          {
            type: 'radar',
            data: this.currentSeriesData,
            // data: [
            //此处的透明度无法调整问题出在echarts本身无法调整该图表的透明度
            //但此处的opacity的调整是根据官网设置的，所以不排除以后此处可直接使用，因此不删。
            itemStyle: {
              opacity: this.opacity
            }
            //   {
            //     value: [4300, 10000, 28000, 35000, 50000, 19000],
            //     name: '预算分配（Allocated Budget）'
            //   },
            //   {
            //     value: [5000, 14000, 28000, 31000, 42000, 21000],
            //     name: '实际开销（Actual Spending）'
            //   }
            // ]
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
