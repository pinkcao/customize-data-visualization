<template>
  <div style="height: calc(100vh); overflow: hidden">
    <el-container style="height: auto">
      <el-header height="50px">
        <!-- button set -->
        <div class="head-box-back">
          <div title="后退" class="back-icon-wrapper" @click="pageRoute('/templateSelect')">
            <i class="el-icon-back"></i>
          </div>
        </div>
        <div class="head-box-left">
          <div
            v-for="(item, i) in leftButtonSet"
            :key="i"
            :title="item.title"
            :class="leftButtonClass(item.clickParam)"
            @click="colClick(item.clickParam)"
          >
            <i :style="item.iconStyle" :class="item.iconClass"> </i>
          </div>
        </div>

        <!-- right button set -->
        <div class="head-box-right">
          <div
            v-for="(item, i) in rightButtonSet"
            :key="i"
            :title="item.title"
            :class="item.divClass"
            @click="pageRoute(item.routeDest)"
          >
            <i :style="item.iconStyle" :class="item.iconClass"></i>
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
      loadingTimer: 0,

      leftButtonSet: [
        {
          title: '图层',
          clickParam: 'graphCol',
          iconStyle: 'color: aliceblue;',
          iconClass: 'el-icon-picture'
        },
        {
          title: '组件库',
          clickParam: 'compCol',
          iconStyle: 'color: aliceblue;',
          iconClass: 'el-icon-box'
        },
        {
          title: '页面设置',
          clickParam: 'pageCol',
          iconStyle: 'color: aliceblue;',
          iconClass: 'el-icon-setting'
        }
      ],

      rightButtonSet: [
        {
          title: '帮助',
          divClass: 'icon-box-right',
          routeDest: '/colorTest',
          iconStyle: 'color: aliceblue;',
          iconClass: 'el-icon-s-order'
        },
        {
          title: '发布',
          divClass: 'icon-box-right',
          routeDest: '/preview',
          iconStyle: 'color: aliceblue;',
          iconClass: 'el-icon-s-promotion'
        },
        {
          title: '预览',
          divClass: 'icon-box-right',
          routeDest: '/preview',
          iconStyle: 'color: aliceblue;',
          iconClass: 'el-icon-s-platform'
        },
        {
          title: '快照',
          divClass: 'icon-box-right',
          routeDest: '/mountThreeTest',
          iconStyle: 'color: aliceblue;',
          iconClass: 'el-icon-camera'
        }
      ]
    }
  },
  computed: {
    pageAndComponentFlag: function() {
      return this.$store.state.component.pageAndComponentFlag
    },
    graphisshown: function() {
      return this.graphColActive === true ? 'icon-box-left' : 'icon-box-left-hide'
    },

    compisshown: function() {
      return this.compColActive === true ? 'icon-box-left' : 'icon-box-left-hide'
    },

    pageisshown: function() {
      return this.pageColActive === true ? 'icon-box-left' : 'icon-box-left-hide'
    }
  },

  beforeCreate() {},
  created() {},
  beforeDestroy() {
    this.loadingInstance.close()
  },
  destroyed() {},
  mounted() {
    this.$store.dispatch('template/initScreenFlags')
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
  },
  watch: {
    '$store.state.template.screenDefFlag': function(newval) {
      // console.log('?')
      // console.log(this.$store.state.template.screenDefFlag)
      if (newval == true) {
        this.updateColData()
      }
    }
  },
  methods: {
    /**
     * 控制左侧Buttons的样式
     * @param: String
     * @returns: CSS
     */
    leftButtonClass(clickParam) {
      if (clickParam === 'graphCol') {
        return this.graphisshown
      } else if (clickParam === 'compCol') {
        return this.compisshown
      } else if (clickParam === 'pageCol') {
        return this.pageisshown
      } else {
        return null
      }
    },
    /**
     * 从接口读取存储的背景样式，初始化背景样式
     * @param:
     * @returns:
     */
    initBackgroundStyle() {
      this.$axios({
        url: this.$url.getBackgroundStyle,
        method: 'get',
        params: {
          templateID: window.localStorage.getItem('templateID'),
          userID: window.localStorage.getItem('userID')
        }
      }).then(res => {
        if (res) {
          if (res.status == 200) {
            this.$store.dispatch('template/initBackgroundStyle', res.data)
          }
        }
      })
    },
    /**
     * 从接口读取分辨率，初始化分辨率设置
     * @param:
     * @returns:
     */
    initScreenDef() {
      this.$axios({
        url: this.$url.getScreenDef,
        method: 'get',
        params: {
          templateID: window.localStorage.getItem('templateID'),
          userID: window.localStorage.getItem('userID')
        }
      }).then(res => {
        if (res) {
          if (res.status == 200) {
            // console.log(res.data)
            this.$store.dispatch('template/initScreenDef', res.data)
          }
        }
      })
    },
    /**
     * 从接口读取缩放方式，初始化缩放方式
     * @param:
     * @returns:
     */
    initScreenStretch() {
      this.$axios({
        url: this.$url.getScreenStretch,
        method: 'get',
        params: {
          templateID: window.localStorage.getItem('templateID'),
          userID: window.localStorage.getItem('userID')
        }
      }).then(res => {
        if (res) {
          if (res.status == 200) {
            this.$store.dispatch('template/initScreenStretch', res.data)
          }
        }
      })
    },
    /**
     * 判断boolean值
     * @param: boolean
     * @returns:
     */
    findFalse(bool) {
      return bool == false
    },
    /**
     * 初始化当前加载状态
     * @param:
     * @returns:
     */
    initLoadingStatus() {
      for (let i = 0; i < this.loadingStatus.length; i++) {
        this.loadingStatus[i] = false
      }
    },
    /**
     * 更改当前loadingStatus
     * @param:
     * @returns:
     */
    changeLoadingStatus(data) {
      this.loadingStatus[data] = true
      console.log(data)
      if (this.loadingStatus.find(this.findFalse) == undefined) {
        // clearInterval(this.loadingIntervalID)
        // if (this.loadingTimer / 2 > 100) {
        //   alert('当前延时为: ' + this.loadingTimer / 2 + 'ms，使用体验将受到影响')
        // }
        let timeoutID = setTimeout(() => {
          this.loadingInstance.close()
          clearTimeout(timeoutID)
        }, 500)
      }
    },
    /**
     * 更新当前的列数据，用于计算目前的parentScale
     * @param:
     * @returns:
     */
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
      this.$store.dispatch('template/updateCurrentColWidth', ColData)
      this.$store.dispatch('template/updateParentScale')
    },
    /**
     * 修改graphCol、compCol、pageCol的活跃状态
     * @param: String
     * @returns:
     */
    colClick(clickParam) {
      switch (clickParam) {
        case 'graphCol':
          this.graphColActive = !this.graphColActive
          this.updateColData()
          break
        case 'compCol':
          this.compColActive = !this.compColActive
          this.updateColData()
          break
        case 'pageCol':
          this.pageColActive = !this.pageColActive
          this.updateColData()
          break
        default:
          break
      }
    },
    /**
     * 允许拖拽
     * @param: event
     * @returns:
     */
    allowdrag(event) {
      event.preventDefault()
    },
    /**
     * 新建标签页，并路由至预览页面
     * @param:
     * @returns:
     */
    pageRoute(routeUrl) {
      if (routeUrl === '/preview') {
        const { href } = this.$router.resolve({
          path: '/preview'
        })
        window.open(href, '_blank')
      } else {
        this.$router.push({ path: routeUrl })
      }
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
