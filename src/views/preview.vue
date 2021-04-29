<template>
  <div class="preview-wrapper" :style="currentStyle" ref="preview"></div>
</template>

<script>
//通过该方法传字符串获取组件，使组件名与组件对应
import { getComponent } from '@components/visComponents/comMap.js'
import Mount from 'vue-mount'
import url from '@mock/mockAPI.js'

export default {
  components: {},
  name: 'preview',
  data() {
    return {
      componentList: [],
      currentStyle: {},
      screenStretch: {},
      screenDef: [],
      screenDefFlag: false,
      screenStretchFlag: false,
      backgroundStyleFlag: false,
      buttonBoxStyle: {},
      loadingInstance: null,
      loadingStatus: false,
      loadingDetail: {
        components: false,
        style: false,
        stretch: false,
        background: false
      },
      stretchMethod: '',
      backgroundStyle: {},
      objList: []
    }
  },
  computed: {},
  watch: {
    screenStretchFlag: function(newVal) {
      if (this.screenStretch.allStretch == true) {
        this.stretchMethod = 'allStretch'
      } else if (this.screenStretch.xStretch == true) {
        this.stretchMethod = 'xStretch'
      } else if (this.screenStretch.yStretch == true) {
        this.stretchMethod = 'yStretch'
      } else {
        this.stretchMethod = 'noStretch'
      }
      if (this.screenStretchFlag == true && this.screenDefFlag == true && this.backgroundStyleFlag == true) {
        this.resize()
      }
    },
    screenDefFlag: function(newVal) {
      this.buttonBoxStyle = {
        position: 'absolute',
        left: this.screenDef[0].value - 40 + 'px',
        'z-index': 10000
      }
      if (this.screenStretchFlag == true && this.screenDefFlag == true && this.backgroundStyleFlag == true) {
        this.resize()
      }
    },
    backgroundStyleFlag: function(newVal) {
      if (this.screenStretchFlag == true && this.screenDefFlag == true && this.backgroundStyleFlag == true) {
        this.resize()
      }
    },
    loadingStatus: function(newVal) {
      if (newVal == true) {
        this.$nextTick(() => {
          this.loadingInstance.close()
        })
      }
    },
    loadingDetail: {
      handler(newVal) {
        if (newVal.components == true && newVal.style == true && newVal.stretch == true && newVal.background == true) {
          this.loadingStatus = true
        }
      },
      deep: true
    }
  },
  props: ['componentName'],
  created() {},
  beforeDestroy() {
    this.loadingInstance.close()
  },
  destroyed() {},
  mounted() {
    this.loadingInstance = this.$loading({
      fullscreen: true,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.8)',
      text: '正在加载中'
    })
    this.getScreenDef()
    this.getScreenStretch()
    this.getBackgroundStyle()
    this.getComponentList()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
    for (let i = 0; i < this.objList.length; i++) {
      this.objList[i].destroy()
    }
  },

  methods: {
    /**
     * 初始化背景样式
     * @param:
     * @returns:
     */
    getBackgroundStyle() {
      this.$axios({
        url: url.getBackgroundStyle,
        method: 'get',
        params: {
          templateID: window.localStorage.getItem('templateID'),
          userID: window.localStorage.getItem('userID')
        }
      }).then(res => {
        if (res) {
          if (res.status == 200) {
            this.backgroundStyle = res.data
            this.backgroundStyleFlag = true
            this.loadingDetail.background = true
          }
        }
      })
    },

    /**
     * 初始化缩放设置
     * @param:
     * @returns:
     */
    getScreenStretch() {
      this.$axios({
        url: url.getScreenStretch,
        method: 'get',
        params: {
          templateID: window.localStorage.getItem('templateID'),
          userID: window.localStorage.getItem('userID')
        }
      }).then(res => {
        if (res) {
          if (res.status == 200) {
            this.screenStretch = res.data
            this.screenStretchFlag = true
            this.loadingDetail.stretch = true
          }
        }
      })
    },

    /**
     * 初始化分辨率设置
     * @param:
     * @returns:
     */
    getScreenDef() {
      this.$axios({
        url: url.getScreenDef,
        method: 'get',
        params: {
          templateID: window.localStorage.getItem('templateID'),
          userID: window.localStorage.getItem('userID')
        }
      }).then(res => {
        if (res) {
          if (res.status == 200) {
            this.screenDef = res.data
            this.screenDefFlag = true
            this.loadingDetail.style = true
          }
        }
      })
    },

    /**
     * 自适应屏幕宽高
     * @param:
     * @returns:
     */
    resize() {
      let designWindowWidth = this.screenDef[0].value
      let designWindowHeight = this.screenDef[1].value

      switch (this.stretchMethod) {
        case 'allStretch':
          this.currentStyle = {
            width: designWindowWidth + 'px',
            height: designWindowHeight + 'px',
            transform: `scale(${document.documentElement.clientWidth / designWindowWidth}, 
        ${document.documentElement.clientHeight / designWindowHeight}) translate(0px, 0px)`,
            overflow: 'hidden',
            backgroundColor: this.backgroundStyle.backgroundColor,
            backgroundImage: `url('${this.backgroundStyle.backgroundImage}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%'
          }
          break
        case 'xStretch':
          this.currentStyle = {
            width: designWindowWidth + 'px',
            height: designWindowHeight + 'px',
            transform: `scale(${document.documentElement.clientWidth / designWindowWidth}, 
        ${1}) translate(0px, 0px)`,
            'overflow-x': 'hidden',
            backgroundColor: this.backgroundStyle.backgroundColor,
            backgroundImage: `url('${this.backgroundStyle.backgroundImage}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%'
          }
          break
        case 'yStretch':
          this.currentStyle = {
            width: designWindowWidth + 'px',
            height: designWindowHeight + 'px',
            transform: `scale(${1}, 
        ${document.documentElement.clientHeight / designWindowHeight}) translate(0px, 0px)`,
            'overflow-y': 'hidden',
            backgroundColor: this.backgroundStyle.backgroundColor,
            backgroundImage: `url('${this.backgroundStyle.backgroundImage}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%'
          }
          break
        case 'noStretch':
          this.currentStyle = {
            width: designWindowWidth + 'px',
            height: designWindowHeight + 'px',
            transform: `scale(${1}, 
        ${1}) translate(0px, 0px)`,
            backgroundColor: this.backgroundStyle.backgroundColor,
            backgroundImage: `url('${this.backgroundStyle.backgroundImage}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%'
          }
          break
      }
    },
    /**
     * 获取所有组件
     * @param:
     * @returns: Array
     */
    getComponentList() {
      this.$axios({
        url: url.getComponentList,
        method: 'get',
        params: {
          templateID: window.localStorage.getItem('templateID')
        }
      }).then(res => {
        for (let i = 0; i < res.data.resultSet.length; i++) {
          res.data.resultSet[i].dataSource.data = JSON.parse(res.data.resultSet[i].dataSource.data)
          res.data.resultSet[i].dataSource.dataSourceOptions = JSON.parse(
            res.data.resultSet[i].dataSource.dataSourceOptions
          )
        }
        this.componentList = res.data.resultSet
        this.mountComponent()
        this.loadingDetail.components = true
      })
    },
    /**
     * 挂载所有读取到的组件
     * @param:
     * @returns:
     */
    mountComponent() {
      let currentData = this.componentList
      let that = this
      for (let i = 0; i < currentData.length; i++) {
        this.objList.push(
          new Mount(getComponent(currentData[i].name), {
            // mount(getComponent(currentData[i].name), {
            target: that.$refs.preview,
            mode: 'append',
            props: {},
            data: {
              index: currentData[i].index,
              zindex: currentData[i].zindex,
              target: this.$refs.target,
              disabled: currentData[i].disabled,
              width: currentData[i].width,
              height: currentData[i].height,
              top: currentData[i].top,
              left: currentData[i].left,
              deg: currentData[i].deg,
              name: currentData[i].name,
              parentLimitation: false,
              preventActiveBehavior: true,
              dataSource: currentData[i].dataSource,
              title: currentData[i].title,
              subTitle: currentData[i].subTitle,
              style: currentData[i].style,
              draggable: false,
              resizable: false,
              mode: 'preview',
              active: false
              // $store: this.$store
              //重新挂载后无法访问到全局的this.$store,需要对$store重定向
            },
            on: {}
          })
        )
        this.objList[i].mount()
      }
    }
  }
}
</script>

<style>
.preview-wrapper {
  transform-origin: 0 0;
}
</style>
