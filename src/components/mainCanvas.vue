<template>
  <div ref="target" class="main-canvas-background" :style="canvasStyle" @drop="droptest"></div>
</template>

<script>
import { getComponent } from './graphs/comMap.js'
import { mount } from 'vue-mount'
import testStyle from '../API/testStyle.js'
import url from '../mock/mockAPI.js'

export default {
  components: {},
  name: 'mainCanvas',
  data() {
    return {}
  },
  computed: {
    componentList: function() {
      return this.$store.state.componentList
    },
    canvasStyle: function() {
      let parentScale = this.$store.state.parentScale
      // let transform = `scale(${parentScale}) translate(0px, 0px)`;
      let result = {
        width: this.$store.state.parentW + 'px',
        height: this.$store.state.parentH + 'px',
        position: this.$store.state.position,
        transform: `scale(${parentScale}) translate(0px, 0px)`
      }
      console.log(result.transform)
      return result
    }
  },
  props: ['componentName'],
  created() {},
  mounted() {
    let tempname = this.$store.state.componentNameToCanvas
    let testObj = {
      ifshow: true,
      name: tempname,
      width: 300,
      height: 300,
      top: 10,
      left: 10,
      draggable: true,
      resizable: true,
      parentLimitation: true,
      active: false,
      title: 'xxx',
      subTitle: 'yyy',
      mode: 'design',
      dataSource: [
        ['department', '2018', '2019'],
        ['finance', 43.3, 85.8],
        ['humanResource', 83.1, 73.4],
        ['sales', 86.4, 65.2],
        ['product', 72.4, 53.9],
        ['qualityAssurance', 55.1, 66.5]
      ]
    }
    this.mountTest()
    this.$axios({
      url: url.getComponentList,
      method: 'post',
      data: {
        ifshow: true,
        name: this.$store.state.componentNameToCanvas,
        width: 300,
        height: 300,
        top: 10,
        left: 10,
        draggable: true,
        resizable: true,
        parentLimitation: true,
        active: false,
        title: 'xxx',
        subTitle: 'yyy',
        dataSource: [
          ['department', '2018', '2019'],
          ['finance', 43.3, 85.8],
          ['humanResource', 83.1, 73.4],
          ['sales', 86.4, 65.2],
          ['product', 72.4, 53.9],
          ['qualityAssurance', 55.1, 66.5]
        ]
      }
    }).then(res => {
      // this.tabpanedata = res.data.resultSet
      console.log(res.data.resultSet)
    })
    // console.log(window.screen.height)
    // console.log(window.screen.width)
  },

  methods: {
    /*
        有object drop时则将获取其componentName，并将其输入至vuex，再传到这，根据对应值挂载。
        */
    droptest() {
      // if (this.$store.state.componentNameToCanvas == 'compA') {
      console.log('有东西drop了')
      let that = this
      let testObj = {
        ifshow: true,
        name: this.$store.state.componentNameToCanvas,
        width: 300,
        height: 300,
        top: 10,
        left: 10,
        draggable: true,
        resizable: true,
        parentLimitation: true,
        active: false,
        title: 'xxx',
        subTitle: 'yyy',
        mode: 'design',
        $store: this.$store,
        dataSource: [
          ['department', '2018', '2019'],
          ['finance', 43.3, 85.8],
          ['humanResource', 83.1, 73.4],
          ['sales', 86.4, 65.2],
          ['product', 72.4, 53.9],
          ['qualityAssurance', 55.1, 66.5]
        ]
      }
      mount(getComponent(this.$store.state.componentNameToCanvas), {
        target: this.$refs.target,
        mode: 'append',
        props: {},
        data: testObj,
        on: {}
      })
      this.$store.commit('appendComponent', testObj)
      this.$store.commit('changeComponentNameToCanvas', '')
    },

    mountTest() {
      let currentData = this.componentList
      let that = this
      for (let i = 0; i < currentData.length; i++) {
        // if (currentData[i].name == 'compA') {
        mount(getComponent(currentData[i].name), {
          target: this.$refs.target,
          mode: 'append',
          props: {},
          data: {
            index: currentData[i].index,
            target: that.$refs.target,
            ifshow: currentData[i].ifshow,
            width: currentData[i].width,
            height: currentData[i].height,
            top: currentData[i].top,
            left: currentData[i].left,
            name: currentData[i].name,
            draggable: currentData[i].draggable,
            resizable: currentData[i].resizable,
            parentLimitation: currentData[i].parentLimitation,
            dataSource: currentData[i].dataSource,
            active: currentData[i].active,
            title: currentData[i].title,
            subTitle: currentData[i].subTitle,
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

<style scoped>
/*设置坐标原点为0 0,不然transform所使用坐标系是从div正中位置 即50 50出发*/
.main-canvas-background {
  background-color: #0e2a43;
  transform-origin: 0 0;
  top: 60px;
  left: 60px;
  /* position: absolute; */
}
</style>
