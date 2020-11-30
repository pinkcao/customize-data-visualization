<template>
  <div ref="target" class="main-canvas-background" :style="canvasStyle" @drop="droptest"></div>
</template>

<script>
// import testComponentA from './graphs/testComponentA.vue'
import { getComponent } from './graphs/comMap.js'
import { mount } from 'vue-mount'
import testStyle from '../API/testStyle.js'

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
    this.mountTest()
    console.log(window.screen.height)
    console.log(window.screen.width)
  },

  methods: {
    /*
        有object drop时则将获取其componentName，并将其输入至vuex，再传到这，根据对应值挂载。
        */
    droptest() {
      if (this.$store.state.componentNameToCanvas == '组件列') {
        let that = this
        mount(getComponent('compA'), {
          target: this.$refs.target,
          mode: 'append',
          props: {
            testProps: 123
          },
          data: {
            comstyle: testStyle.data().comstyle,
            name: 'compA',
            uid: that.comcount,
            ifshow: true
          },
          on: {
            receiveDataFromSon(data) {
              // that.dataFromSon = data;
              that.getMessage(data)
            }
          }
        })

        this.mountTestData.push({
          comstyle: testStyle.data().comstyle,
          name: 'compA',
          uid: that.comcount,
          ifshow: true
        })
      }
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
