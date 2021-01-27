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
      ifshow: false,
      //当前组件宽度
      width: 500,
      //当前组件高度
      height: 500,
      //当前组件上方距离
      top: 100,
      //当前组件左侧距离
      left: 100,
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
        data: []
      },
      //当前组件样式
      style: {
        deg: 0,
        opacity: 1,
        titlepos: ''
        // legendvis: true,
        // titlevis: true
      }
    }
  },
  watch: {},
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
    // console.log(this)
  },
  methods: {
    // 更新当前组件基础属性
    updateComponentList() {
      if (this.mode == 'design') {
        this.$axios({
          url: url.adjustComponent,
          method: 'post',
          data: {
            templateID: this.$store.state.currentTemplateID,
            index: this.index,
            width: this.width,
            height: this.height,
            top: this.top,
            left: this.left
          }
        }).then(res => {
          if (res.status == 200) {
            this.$store.commit('initComponentList', res.data.resultSet)
          }
        })
      }
    },
    //销毁当前组件，实际不销毁，只是不渲染，组件仍在内存，在mainCanvas组件中的objList中存储，可以调用mount()方法再次挂载
    destroyComponent() {
      this.ifshow = false
      this.$emit('destroyComponent', this.index)
    },
    //调整当前组件基础属性
    resize(newRect) {
      this.width = newRect.width
      this.height = newRect.height
      this.top = newRect.top
      this.left = newRect.left
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
      this.style.deg = deg
    }
  }
}