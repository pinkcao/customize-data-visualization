<template>
  <div style="height: calc(100vh); overflow: hidden">
    <el-container style="height: auto">
      <el-header height="50px">
        <!-- button set -->
        <div class="head-box-back">
          <div title="后退" class="back-icon-wrapper" @click="routeToTemplateSelect">
            <i class="el-icon-back"></i>
          </div>
        </div>
        <div class="head-box-left">
          <div title="图层" @click="graphclicktest" :class="graphisshown">
            <i :style="iconstyle" class="el-icon-picture"></i>
          </div>
          <div title="组件库" @click="compclicktest" :class="compisshown">
            <i :style="iconstyle" class="el-icon-box"></i>
          </div>
          <div title="页面设置" @click="pageclicktest" :class="pageisshown">
            <i :style="iconstyle" class="el-icon-setting"></i>
          </div>
        </div>

        <!-- right button set -->
        <div class="head-box-right">
          <div title="帮助" class="icon-box-right" @click="routeToColorTest">
            <i :style="iconstyle" class="el-icon-s-order"></i>
          </div>
          <div title="发布" class="icon-box-right">
            <i :style="iconstyle" class="el-icon-s-promotion"></i>
          </div>
          <div title="预览" class="icon-box-right" @click="routeToPreview">
            <i :style="iconstyle" class="el-icon-s-platform"></i>
          </div>
          <div title="快照" class="icon-box-right" @click="routeToMountThreeTest">
            <i :style="iconstyle" class="el-icon-camera"></i>
          </div>
        </div>
      </el-header>
      <el-container>
        <!-- el-aside width必须覆写，不然就是300px -->
        <el-aside width="auto">
          <div ref="graphCol" class="transition-box-graph">
            <graphCol :graphColVis="graphColActive"> </graphCol>
          </div>
        </el-aside>
        <el-aside width="auto">
          <div ref="compCol" class="transition-box-comp">
            <componentCol
              :componentColVis="compColActive"
              @changeLoadingStatus="changeLoadingStatus"
              :divData="divData"
            ></componentCol>
          </div>
        </el-aside>
        <el-main>
          <div @dragover="allowdrag" class="main-panel-wp">
            <div ref="wrapper" class="canvas-main">
              <main-canvas @changeLoadingStatus="changeLoadingStatus"> </main-canvas>
            </div>
          </div>
        </el-main>
        <el-aside width="auto">
          <div ref="pageCol" class="transition-box-page">
            <pageSet :pageSetVis="pageColActive" v-show="pageAndComponentFlag"> </pageSet>
            <component-set :componentSetVis="pageColActive" v-show="!pageAndComponentFlag"></component-set>
          </div>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import echarts from 'echarts'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
// import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
// import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import Stats from 'three/examples/jsm/libs/stats.module.js'
import dat from 'three/examples/js/libs/dat.gui.min.js'
import componentCol from '../components/colComponents/componentCol/componentCol.vue'
import graphCol from '../components/colComponents/graphCol/graphCol.vue'
import pageSet from '../components/colComponents/pageSet/pageSet.vue'
import componentSet from '../components/colComponents/componentSet/componentSet.vue'
import mainCanvas from '../components/colComponents/mainCanvas/mainCanvas.vue'

export default {
  components: {
    componentCol,
    graphCol,
    pageSet,
    mainCanvas,
    componentSet
  },
  name: 'basePage',
  data() {
    return {
      /*
          这一块都是three.js的变量，用于渲染场景，获取点击拾取后的数据
          */
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      light: null,
      controls: null,
      options: null,
      group: null,
      objects: [],
      effectFXAA: null,
      outlinePass: null,
      loader: null,
      mouse: new THREE.Vector2(),
      raycaster: new THREE.Raycaster(),
      selectedObjects: [],
      composer: null,
      stats: null,
      originX: 0,
      originY: 0,

      graphColActive: true,
      compColActive: true,
      pageColActive: true,

      divData: {},
      /*
        div参数
      */
      // pageAndComponentFlag: true,
      componentsfullwidth: '250px',
      componentsemptywidth: '0px',
      pagefullwidth: '350px',
      pageemptywidth: '0px',
      graphfullwidth: '200px',
      graphemptywidth: '0px',
      iconstyle: 'color:aliceblue;',

      loadingStatus: [false, false],
      loadingInstance: null,
      loadingIntervalID: 0,
      loadingTimer: 0
    }
  },
  computed: {
    pageAndComponentFlag: function() {
      return this.$store.state.pageAndComponentFlag
    },
    graphisshown: function() {
      return {
        'icon-box-left': this.graphColActive,
        'icon-box-left-hide': !this.graphColActive
      }
    },

    compisshown: function() {
      return {
        'icon-box-left': this.compColActive,
        'icon-box-left-hide': !this.compColActive
      }
    },

    pageisshown: function() {
      return {
        'icon-box-left': this.pageColActive,
        'icon-box-left-hide': !this.pageColActive
      }
    }
  },

  beforeCreate() {},
  created() {},
  beforeDestroy() {
    this.loadingInstance.close()
  },
  destroyed() {},
  mounted() {
    this.$store.commit('initScreenFlags')
    this.initScreenDef()
    this.initScreenStretch()
    this.initBackgroundStyle()
    //初始化加载状态
    this.initLoadingStatus()
    this.loadingInstance = this.$loading({
      fullscreen: true,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.8)',
      text: '加载中'
    })
    // this.$axios({
    //   url: 'http://localhost:8080/api/template/deleteAllDisabledTemplate',
    //   method: 'post',
    //   data: {}
    // }).then(res => {
    //   console.log(res.data)
    // })

    // let testObj = [
    //   {
    //     zindex: 2,
    //     height: 500,
    //     width: 500,
    //     style: {
    //       deg: 20,
    //       legendvis: true
    //     },
    //     dataSource: {
    //       data: [
    //         [0, 0, 0],
    //         [0, 0, 0]
    //       ],
    //       url: 'what the hell?'
    //     }
    //   },
    //   {
    //     zindex: 2,
    //     height: 500,
    //     width: 500,
    //     style: {
    //       deg: 20,
    //       legendvis: true
    //     },
    //     dataSource: {
    //       data: [
    //         [0, 0, 0],
    //         [0, 0, 0]
    //       ],
    //       url: 'what the hell?'
    //     }
    //   }
    // ]
    // this.$axios({
    //   url: 'http://localhost:8080//testGetListMapJson',
    //   method: 'post',
    //   data: testObj
    // }).then(res => {
    //   console.log(res)
    // })
  },
  watch: {
    '$store.state.screenDefFlag': function(newval) {
      if (newval == true) {
        this.updateColData()
      }
    }
  },
  methods: {
    initBackgroundStyle() {
      this.$axios({
        url: this.$url.getBackgroundStyle,
        method: 'get',
        params: {
          templateID: this.$store.state.currentTemplateID,
          userID: this.$store.state.currentUserID
        }
      }).then(res => {
        if (res) {
          if (res.status == 200) {
            this.$store.commit('initBackgroundStyle', res.data)
          }
        }
      })
    },
    initScreenDef() {
      this.$axios({
        url: this.$url.getScreenDef,
        method: 'get',
        params: {
          templateID: this.$store.state.currentTemplateID,
          userID: this.$store.state.currentUserID
        }
      }).then(res => {
        if (res) {
          if (res.status == 200) {
            this.$store.commit('initScreenDef', res.data)
          }
        }
      })
    },
    initScreenStretch() {
      this.$axios({
        url: this.$url.getScreenStretch,
        method: 'get',
        params: {
          templateID: this.$store.state.currentTemplateID,
          userID: this.$store.state.currentUserID
        }
      }).then(res => {
        if (res) {
          if (res.status == 200) {
            this.$store.commit('initScreenStretch', res.data)
          }
        }
      })
    },
    // timerAccumulation() {
    //   this.loadingTimer += 10
    //   // console.log(this.loadingTimer)
    // },
    findFalse(bool) {
      return bool == false
    },
    //初始化当前loadingStatus
    initLoadingStatus() {
      for (let i = 0; i < this.loadingStatus.length; i++) {
        this.loadingStatus[i] = false
      }
    },
    //更改当前loadingStatus
    changeLoadingStatus(data) {
      this.loadingStatus[data] = true
      if (this.loadingStatus.find(this.findFalse) == undefined) {
        // clearInterval(this.loadingIntervalID)
        // if (this.loadingTimer / 2 > 100) {
        //   alert('当前延时为: ' + this.loadingTimer / 2 + 'ms，使用体验将受到影响')
        // }
        setTimeout(() => {
          this.loadingInstance.close()
        }, 500)
      }
    },
    updateColData() {
      let ColData = []
      //el-main的padding-left+padding-right
      ColData.push(40)
      if (this.graphColActive == true) {
        ColData.push(parseInt(this.graphfullwidth.substring(0, this.graphfullwidth.length - 2)))
      }
      if (this.compColActive == true) {
        ColData.push(parseInt(this.componentsfullwidth.substring(0, this.componentsfullwidth.length - 2)))
      }
      if (this.pageColActive == true) {
        ColData.push(parseInt(this.pagefullwidth.substring(0, this.pagefullwidth.length - 2)))
      }
      this.$store.commit('updateCurrentColWidth', ColData)
      this.$store.commit('updateParentScale')
    },
    graphclicktest() {
      this.graphColActive = !this.graphColActive
      this.updateColData()
    },

    compclicktest() {
      this.compColActive = !this.compColActive
      this.updateColData()
    },

    pageclicktest() {
      this.pageColActive = !this.pageColActive
      this.updateColData()
    },

    allowdrag(event) {
      event.preventDefault()
    },
    routeToPreview() {
      this.$router.push({ path: '/preview' })
    },
    routeToColorTest() {
      this.$router.push({ path: '/colorTest' })
    },
    routeToTemplateSelect() {
      this.$router.push({ path: '/templateSelect' })
    },
    routeToMountThreeTest() {
      this.$router.push({ path: '/mountThreeTest' })
    }
  }
}
</script>

<style lang="less">
body {
  margin: 0px auto;
  padding: 0px;
}

@headerheight: 50px;
@asideheight: calc(100vh - @headerheight);

.el-header,
.el-footer {
  background-color: #1d1e1f;
  color: #333;
  text-align: center;
  height: @headerheight;
  line-height: 60px;
}

.el-aside {
  background-color: @colComponentBackgroundColor;
  color: #333;
  text-align: center;
  border: 0;
  margin: 0;
  padding: 0;
  border-left: @blackSolidBorder;
}

.el-main {
  background-color: @mainBackgroundColor;
  color: #333;
  text-align: center;
  margin: 0;
  padding: 0;
  border-left: @blackSolidBorder;
  z-index: 0;
}

.transition-box-graph {
  background-color: @colComponentBackgroundColor;
  height: @asideheight;
}

.transition-box-comp {
  background-color: @colComponentBackgroundColor;
  height: @asideheight;
}

.transition-box-page {
  background-color: @colComponentBackgroundColor;
  height: @asideheight;
}

.icon-box-left-hide {
  width: 40px;
  height: 100%;
  background-color: @iconNotSelectedcolor;
  // margin: 10px;
  margin-left: 10px;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-box-left {
  width: 40px;
  height: 100%;
  background-color: @iconSelectedcolor;
  // margin: 10px;
  margin-left: 10px;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-box-left-hide:hover {
  cursor: pointer;
  background-color: @iconNotSelectedcolor + @highlight;
}

.icon-box-left:hover {
  cursor: pointer;
  background-color: @iconSelectedcolor + @highlight;
}

.icon-box-right {
  width: 40px;
  height: 100%;
  background-color: @iconNotSelectedcolor;
  margin-left: 10px;
  // margin: 10px;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-box-right:hover {
  cursor: pointer;
  background-color: @iconNotSelectedcolor + @highlight;
}

.head-box-back {
  margin-left: 20px;
  margin-top: 10px;
  float: left;
  height: 30px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.head-box-left {
  margin-left: 100px;
  margin-top: 10px;
  float: left;
  height: 30px;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.head-box-right {
  margin-top: 10px;
  margin-right: 100px;
  float: right;
  height: 30px;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.main-panel-wp {
  height: calc(100vh - @headerheight);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.canvas-main {
  position: relative;
  height: 100%;
  width: 100%;
  user-select: none;
}

.back-icon-wrapper {
  width: 30px;
  height: 100%;
  background-color: @iconNotSelectedcolor;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.back-icon-wrapper:hover {
  cursor: pointer;
  background-color: @iconNotSelectedcolor + @highlight;
}
</style>
