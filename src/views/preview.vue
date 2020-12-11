<template>
  <div ref="preview">
    <el-button style="float: right" icon="el-icon-close" @click="returnToBase" circle></el-button>
  </div>
</template>

<script>
// import testComponentA from '../components/graphs/testComponentA'
//通过该方法传字符串获取组件，使组件名与组件对应
import { getComponent } from '../components/visComponents/comMap.js'
//由于在预览界面不会对子组件再进行操作，因此仅只引入mount方法，不保存整个Mount对象
import { mount } from 'vue-mount'
import url from '../mock/mockAPI.js'
// import test from '../components/test.vue'

export default {
  components: {},
  name: 'mainCanvas',
  data() {
    return {
      componentList: []
    }
  },
  computed: {},
  props: ['componentName'],
  created() {},
  mounted() {
    this.getComponentList()
  },

  methods: {
    returnToBase() {
      this.$router.push({ path: '/basePage' })
    },
    getComponentList() {
      this.$axios({
        url: url.getComponentList,
        method: 'post',
        data: {}
      }).then(res => {
        this.componentList = res.data.resultSet
        this.mountTest()
      })
    },
    mountTest() {
      let currentData = this.componentList
      let that = this
      for (let i = 0; i < currentData.length; i++) {
        mount(getComponent(currentData[i].name), {
          target: that.$refs.preview,
          mode: 'append',
          props: {},
          data: {
            index: currentData[i].index,
            zindex: currentData[i].zindex,
            target: this.$refs.target,
            ifshow: currentData[i].ifshow,
            width: currentData[i].width,
            height: currentData[i].height,
            top: currentData[i].top,
            left: currentData[i].left,
            name: currentData[i].name,
            parentLimitation: false,
            preventActiveBehavior: true,
            dataSource: currentData[i].dataSource,
            title: currentData[i].title,
            subTitle: currentData[i].subTitle,
            draggable: false,
            resizable: false,
            mode: 'preview',
            active: false,
            $store: this.$store
            //重新挂载后无法访问到全局的this.$store,需要对$store重定向
          },
          on: {}
        })
      }
    }
  }
}
</script>

<style></style>
