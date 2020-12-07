<template>
  <div>
    <el-button style="float: right" icon="el-icon-close" @click="returnToBase" circle></el-button>
    <div style="display: flex; flex-direction: row; flex-wrap: wrap">
      <div class="testbox" v-for="(item, index) in colorSet" :style="item[0]" :key="index" @click="test(item)">
        <span style="font-size: 16px" :style="item[1]">测试色彩测试色彩</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  name: 'mainCanvas',
  data() {
    return {
      colorSet: []
    }
  },
  computed: {},
  created() {
    this.generateColorSet(28)
  },
  mounted() {
    // console.log(this.$refs.colorTest.style.backgroundColor)
    // this.$refs.colorTest.style.backgroundColor = 'rgb(0 ,0 ,0)'
  },

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
