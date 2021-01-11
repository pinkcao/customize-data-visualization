<template>
  <!-- <div> -->
  <!-- <el-button style="float: right" icon="el-icon-close" @click="returnToBase" circle></el-button>
    <div style="display: flex; flex-direction: row; flex-wrap: wrap">
      <div class="testbox" v-for="(item, index) in colorSet" :style="item[0]" :key="index" @click="test(item)">
        <span style="font-size: 16px" :style="item[1]">测试色彩测试色彩</span>
      </div>
      <div ref="chart"></div>
    </div> -->
  <!-- <el-image :src="imgurl" :fit="'fill'"></el-image> -->
  <!-- </div> -->
  <div v-if="ifshow">
    <vue-drag-resize-rotate
      :isActive="active"
      :preventActiveBehavior="preventActiveBehavior"
      :w="width"
      :h="height"
      :x="left"
      :y="top"
      :z="zindex"
      :deg="style.deg"
      @resizing="resize"
      @dragging="resize"
      :parentLimitation="parentLimitation"
      :isDraggable="draggable"
      :isResizable="resizable"
      :rotate="true"
      @rotate="testconsole"
    >
      <div style="background-color: #555555; width: 100%; height: 100%"></div>
    </vue-drag-resize-rotate>
  </div>
</template>

<script>
import echarts from 'echarts'
// import vueDragResizeRotate from './vueDragResizeRotate.vue'

export default {
  // components: { vueDragResizeRotate },
  name: 'colorTest',
  data() {
    return {
      // colorSet: [],
      // imgurl: require('@/assets/图表组件.png')
      preventActiveBehavior: false,
      name: 'compA',
      active: false,
      ifshow: true,
      width: 200,
      height: 200,
      top: 0,
      left: 0,
      parentLimitation: false,
      draggable: true,
      resizable: true,
      index: 0,
      zindex: 0,
      mode: 'design',
      flag: false,
      title: '综合图表',
      subTitle: 'fake data',
      dataSource: {
        data: [
          ['department', '2018', '2019'],
          ['finance', 43.3, 85.8],
          ['humanResource', 83.1, 73.4],
          ['sales', 86.4, 65.2],
          ['product', 72.4, 53.9],
          ['qualityAssurance', 55.1, 66.5]
        ]
      },
      style: {
        opacity: 1,
        legendvis: true,
        titlevis: true,
        deg: 0
      }
    }
  },
  computed: {},
  created() {
    // this.generateColorSet(28)
  },
  mounted() {
    // console.log((Math.acos((12.5 - 16) / 12.5) * 180) / Math.PI)
    // let a = 21
    // let b = 10.5
    // let c = 10.5
    // console.log(Math.acos((b * b + c * c - a * a) / (2 * b * c)) * (180 / Math.PI))
  },

  methods: {
    resize(newRect) {
      this.width = newRect.width
      this.height = newRect.height
      this.top = newRect.top
      this.left = newRect.left
    },
    testconsole(deg) {
      console.log(deg)
      this.style.deg = deg
    }
    // test(value) {
    //   console.log(value)
    // },
    // returnToBase() {
    //   this.$router.push({ path: '/basePage' })
    // },
    // generateColorSet(num) {
    //   let colorSet = []
    //   for (let i = 0; i < num; i++) {
    //     let h = Math.floor(Math.random() * 361)
    //     let s = Math.floor(Math.random() * 101) + '%'
    //     let l = Math.floor(Math.random() * 101) + '%'
    //     colorSet.push([
    //       { 'background-color': `hsl(${h},${s},${l})` },
    //       {
    //         // color: `hsl(${h < 180 ? h + 90 : h - 90},${'0%'},${'90%'})`
    //         color: `hsl(${h < 90 ? h + 90 : h - 90},${'50%'},${'50%'})`
    //       }
    //     ])
    //     // let r = Math.floor(Math.random() * 256)
    //     // let g = Math.floor(Math.random() * 256)
    //     // let b = Math.floor(Math.random() * 256)
    //     // let bright = Math.max(r, g, b)
    //     // colorSet.push([
    //     //   { 'background-color': `rgb(${r},${g},${b})` },
    //     //   {
    //     //     color: `rgb(${bright > 128 ? bright + 64 : bright - 64},${bright > 128 ? bright + 64 : bright - 64},${
    //     //       bright > 128 ? bright + 64 : bright - 64
    //     //     })`
    //     //   }
    //     // ])
    //   }
    //   // console.log(colorSet[0])
    //   this.colorSet = colorSet
    // }
  }
}
</script>

<style>
.testbox {
  width: 200px;
  height: 200px;
}
</style>
