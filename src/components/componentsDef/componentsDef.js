import url from '@mock/mockAPI.js'

export default {
  data() {
    return {
      //防止外部点击事件
      preventActiveBehavior: false,
      //当前组件name，用于索引至该组件，暂时命名规则为compX
      name: '',
      //当前组件是否活跃
      active: false,
      //当前组件是否渲染
      disabled: false,
      //当前组件宽度
      width: 500,
      //当前组件高度
      height: 500,
      //当前组件上方距离
      top: 100,
      //当前组件左侧距离
      left: 100,
      //当前组件顺时针旋转角度
      deg: 0,
      //当前组件是否会受限于父元素
      parentLimitation: true,
      //当前组件是否可拖拽
      draggable: true,
      //当前组件是否可缩放
      resizable: true,
      //当前组件是否可旋转
      rotatable: true,
      //当前组件序号（唯一）
      index: 0,
      //当前组件z-index值
      zindex: 0,
      //当前组件处于的模式
      mode: 'design',
      //控制当前组件渲染的标志
      flag: false,
      //当前组件标题
      title: '',
      //当前组件副标题
      subTitle: '',
      //当前组件数据/数据源
      dataSource: {
        data: [],
        dataSourceOptions: [
          {
            value: 'APISource',
            label: 'API数据源'
          },
          {
            value: 'otherSource',
            label: 'unknown'
          }
        ],
        dataSourceType: '',
        APISwitch: false,
        APIURL: '',
        APIMethod: '',
        APIInterval: 10000,
        APIHeader: '',
        IntervalID: 0 //用于存储setInterval的ID，便于clearInterval
      },
      //当前组件样式
      style: {
        opacity: 1,
        titlepos: 'center'
        // legendvis: true,
        // titlevis: true
      }
    }
  },
  watch: {
    'dataSource.dataSourceType': function(newVal) {
      // console.log(newVal)
      if (newVal == 'APISource') {
        this.dataSource.APISwitch = true
      } else {
        this.dataSource.APISwitch = false
      }
    },
    'dataSource.APIURL': {
      immediate: true,
      handler(newVal) {
        // console.log(newVal)
        this.removeInterval()
        this.dataSource.IntervalID = ''
        // console.log('APIURL updated，Interval cleared')
        if (this.dataSource.APISwitch == true) {
          // let patt = /http:/
          this.dataSource.IntervalID = setInterval(this.fetchDataFromAPI, this.dataSource.APIInterval)
          // console.log('Interval set')
        }
      }
    },
    'dataSource.APIMethod': {
      // immediate: true,
      handler(newVal) {
        this.removeInterval()
        this.dataSource.IntervalID = ''
        // console.log('APIMethod updated，Interval cleared')
        // console.log(this.dataSource.APISwitch == true && this.dataSource.IntervalID == '')
        if (this.dataSource.APISwitch == true && this.dataSource.IntervalID == '') {
          this.dataSource.IntervalID = setInterval(this.fetchDataFromAPI, this.dataSource.APIInterval)
          // console.log(this.dataSource.APISwitch == true && this.dataSource.IntervalID == '')
          // console.log('Interval set')
        }
      }
    },
    'dataSource.APIInterval': {
      // immediate: true,
      handler(newVal) {
        this.removeInterval()
        this.dataSource.IntervalID = ''
        // console.log('APIInterval updated，Interval cleared')
        // console.log(this.dataSource.APISwitch == true && this.dataSource.IntervalID == '')
        if (this.dataSource.APISwitch == true && this.dataSource.IntervalID == '') {
          this.dataSource.IntervalID = setInterval(this.fetchDataFromAPI, this.dataSource.APIInterval)
          // console.log(this.dataSource.APISwitch == true && this.dataSource.IntervalID == '')
          // console.log('Interval set')
        }
      }
    },
    'dataSource.APISwitch': function(newVal) {
      // console.log(newVal)
      if (newVal == false) {
        // console.log('APISwitch off，Interval cleared')
        this.removeInterval()
        this.dataSource.IntervalID = ''
      }
    }
  },
  computed: {
    //X缩放比
    parentScaleX: function() {
      if (this.mode == 'design') {
        return this.$store.state.parentScaleX
      } else {
        return 1
      }
    },
    //Y缩放比
    parentScaleY: function() {
      if (this.mode == 'design') {
        return this.$store.state.parentScaleY
      } else {
        return 1
      }
    },
    //父元素宽
    parentW: function() {
      if (this.mode == 'design') {
        return this.$store.state.screenDef[0].value
      } else {
      }
    },
    //父元素高
    parentH: function() {
      if (this.mode == 'design') {
        return this.$store.state.screenDef[1].value
      } else {
      }
    }
  },
  mounted() {
    // console.log(this.dataSource)
  },
  beforeDestroy() {
    this.removeInterval()
  },
  destroyed() {
    // console.log('test')
  },
  methods: {
    //更新当前组件基础属性
    updateComponentList() {
      if (this.mode == 'design') {
        console.log(this.index)
        // console.log(this.$store.state.currentTemplateID)
        this.$axios({
          url: url.adjustComponent,
          method: 'post',
          data: {
            templateID: this.$store.state.currentTemplateID,
            deg: this.deg,
            index: this.index,
            width: this.width,
            height: this.height,
            top: this.top,
            left: this.left
          }
        }).then(res => {
          // console.log(res.data.resultSet)
          if (res.status == 200) {
            for (let i = 0; i < res.data.resultSet.length; i++) {
              res.data.resultSet[i].dataSource.data = JSON.parse(res.data.resultSet[i].dataSource.data)
              res.data.resultSet[i].dataSource.dataSourceOptions = JSON.parse(
                res.data.resultSet[i].dataSource.dataSourceOptions
              )
            }
            console.log(res.data.resultSet)
            this.$store.commit('initComponentList', res.data.resultSet)
            this.$store.commit('resizeUpdateActiveComponent')
          }
        })
      }
    },
    //销毁当前组件，实际不销毁，只是不渲染，组件仍在内存，在mainCanvas组件中的objList中存储，可以调用mount()方法再次挂载
    destroyComponent() {
      this.disabled = false
      this.$emit('destroyComponent', this.index)
    },
    chartResize() {
      this.$refs.child.chartResize()
    },
    //调整当前组件基础属性
    resize(newRect) {
      this.width = newRect.width
      this.height = newRect.height
      this.top = newRect.top
      this.left = newRect.left
      this.$refs.child.chartResize()
    },
    //由active转为inactive,失去焦点
    onDeactivated() {
      this.$refs.testref.blur()
    },
    //由inactive转至active,获得焦点
    activate() {
      this.$emit('updateActiveStatus', this.index)
      this.$refs.testref.focus()
    },
    rotate(deg) {
      // console.log(deg)
      this.deg = deg
    },
    testFetchData() {
      // console.log(this.dataSource.APIURL)
      // console.log(this.dataSource.APIMethod)
      if (this.dataSource.APISwitch) {
        this.$axios({
          url: this.dataSource.APIURL,
          method: this.dataSource.APIMethod,
          data: {}
        }).then(res => {
          // console.log(res.data)
          this.dataSource.data = res.data
        })
      }
    },
    fetchDataFromAPI() {
      if (this.dataSource.APISwitch) {
        let currentHeader = {}
        try {
          if (this.dataSource.APIHeader != '') {
            currentHeader = JSON.parse(this.dataSource.APIHeader)
          }
        } catch (error) {
          // console.log(error)
        }
        this.$axios({
          url: this.dataSource.APIURL,
          method: this.dataSource.APIMethod,
          headers: currentHeader,
          data: {}
        }).then(res => {
          if (res.status == 200) {
            this.dataSource.data = res.data
            // console.log(res.data)
          }
        })
      }
      // console.log(this.dataSource.APIInterval)
      // console.log(this.dataSource.IntervalID)
      // console.log(this.index)
      // console.log(this.$store.state.currentComponent)
    },
    removeInterval() {
      clearInterval(this.dataSource.IntervalID)
    }
  }
}
