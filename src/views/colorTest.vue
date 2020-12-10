<template>
  <div>
    <el-button style="float: right" icon="el-icon-close" @click="returnToBase" circle></el-button>
    <div style="display: flex; flex-direction: row; flex-wrap: wrap">
      <div class="testbox" v-for="(item, index) in colorSet" :style="item[0]" :key="index" @click="test(item)">
        <span style="font-size: 16px" :style="item[1]">测试色彩测试色彩</span>
      </div>
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
        let h = Math.floor(Math.random() * 361)
        let s = Math.floor(Math.random() * 101) + '%'
        let l = Math.floor(Math.random() * 101) + '%'
        colorSet.push([
          { 'background-color': `hsl(${h},${s},${l})` },
          {
            // color: `hsl(${h < 180 ? h + 90 : h - 90},${'0%'},${'90%'})`
            color: `hsl(${h < 90 ? h + 90 : h - 90},${'50%'},${'50%'})`
          }
        ])
        // let r = Math.floor(Math.random() * 256)
        // let g = Math.floor(Math.random() * 256)
        // let b = Math.floor(Math.random() * 256)
        // let bright = Math.max(r, g, b)
        // colorSet.push([
        //   { 'background-color': `rgb(${r},${g},${b})` },
        //   {
        //     color: `rgb(${bright > 128 ? bright + 64 : bright - 64},${bright > 128 ? bright + 64 : bright - 64},${
        //       bright > 128 ? bright + 64 : bright - 64
        //     })`
        //   }
        // ])
      }
      // console.log(colorSet[0])
      this.colorSet = colorSet
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
