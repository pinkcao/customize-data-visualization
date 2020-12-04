<template>
  <div ref="preview">
    <el-button style="float: right" icon="el-icon-close" @click="returnToBase" circle></el-button>
    <!-- <div v-if="testflag" style="width: 100px; height: 100px; background-color: #ff0000"></div> -->
    <!-- <el-button type="primary" @click="testif">测试按钮</el-button>
    <test ref="test"></test> -->
  </div>
</template>

<script>
// import testComponentA from '../components/graphs/testComponentA'
//通过该方法传字符串获取组件，使组件名与组件对应
import { getComponent } from '../components/graphs/comMap.js'
import { mount } from 'vue-mount'
import url from '../mock/mockAPI.js'
// import test from '../components/test.vue'

export default {
  components: {
    // testComponentA,
    // test
  },
  name: 'mainCanvas',
  data() {
    return {
      // testflag: true
      componentList: []
    }
  },
  computed: {
    // componentList: function() {
    //   return this.$store.state.componentList
    // }
  },
  props: ['componentName'],
  created() {},
  mounted() {
    this.getComponentList()
  },

  methods: {
    // testif() {
    //   // this.testflag = !this.testflag
    //   this.$refs.test.changeFlag()
    // },
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
        // if (currentData[i].name == 'compA') {
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
            //   draggable: false,
            //   resizable: false,
            draggable: false,
            resizable: false,
            mode: 'preview',
            active: false,
            $store: this.$store
            //重新挂载后无法访问到全局的this.$store,需要对$store重定向
          },
          on: {}
        })
        // }
      }
    }
  }
}
</script>

<style></style>
