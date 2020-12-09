<template>
  <div>
    <el-button style="float: right" icon="el-icon-close" @click="returnToBase" circle></el-button>
    <div style="display: flex; flex-direction: row; flex-wrap: wrap">
      <!-- <div class="testbox" v-for="(item, index) in colorSet" :style="item[0]" :key="index" @click="test(item)">
        <span style="font-size: 16px" :style="item[1]">测试色彩测试色彩</span>
      </div> -->
      <div ref="chart"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  components: {},
  name: 'colorTest',
  data() {
    return {
      colorSet: []
    }
  },
  computed: {},
  created() {
    this.generateColorSet(28)
  },
  mounted() {},

  methods: {
    test(value) {
      console.log(value)
    },
    returnToBase() {
      this.$router.push({ path: '/basePage' })
    },
    generateColorSet(num) {
      let colorSet = []
      for (let i = 0; i < num; i++) {
        let r = Math.floor(Math.random() * 256)
        let g = Math.floor(Math.random() * 256)
        let b = Math.floor(Math.random() * 256)
        let bright = Math.max(r, g, b)
        colorSet.push([
          { 'background-color': `rgb(${r},${g},${b})` },
          {
            color: `rgb(${bright > 128 ? bright + 64 : bright - 64},${bright > 128 ? bright + 64 : bright - 64},${
              bright > 128 ? bright + 64 : bright - 64
            })`
          }
        ])
      }
      // console.log(colorSet[0])
      this.colorSet = colorSet
    },
    initChart() {
      this.currentChart = echarts.init(this.$refs.chart)
      let option = {
        legend: {
          bottom: '0',
          show: true
        },
        xAxis: {
          type: 'category',
          //强制显示所有label
          axisLabel: 0,
          show: true
        },
        yAxis: {
          show: true
        },
        //提供一份二维数组或是对象数组数据
        // dataset: this.initDataSource(this.schema.dataSource),
        dataset: {
          source: [
            ['department', '2018', '2019', '2020', '2021', '2022'],
            ['finance', 43.3, 85.8, 93.7, 55.4, 66.7],
            ['humanResource', 83.1, 73.4, 55.1, 77.3, 26.4],
            ['sales', 86.4, 65.2, 82.5, 41.5, 57.6],
            ['product', 72.4, 53.9, 39.1, 14.8, 25.9],
            ['qualityAssurance', 55.1, 66.5, 46.8, 34.8, 66.4]
          ]
        },
        series: {
          type: 'bar'
        }
      }
      this.currentChart.setOption(option)
    }
  }
}
</script>

<style>
.testbox {
  width: 200px;
  height: 200px;
}
</style>
