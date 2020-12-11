import url from '@/mock/mockAPI.js'

export default {
  data() {
    return {
      preventActiveBehavior: false,
      name: '',
      active: false,
      ifshow: false,
      width: 500,
      height: 500,
      top: 100,
      left: 100,
      parentLimitation: true,
      draggable: true,
      resizable: true,
      index: 0,
      zindex: 0,
      mode: 'design',
      flag: false,
      title: '',
      subTitle: '',
      dataSource: []
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
      return this.$store.state.colDef[0].value
    },
    //父元素高
    parentH: function() {
      return this.$store.state.colDef[1].value
    }
  },
  methods: {
    updateComponentList() {
      this.$axios({
        url: url.adjustComponent,
        method: 'post',
        data: {
          index: this.index,
          width: this.width,
          height: this.height,
          top: this.top,
          left: this.left
        }
      }).then(res => {
        this.$store.commit('initComponentList', res.data.resultSet)
      })
    },
    destroyComponent() {
      this.ifshow = false
      this.$emit('destroyComponent', this.index)
    },
    resize(newRect) {
      this.width = newRect.width
      this.height = newRect.height
      this.top = newRect.top
      this.left = newRect.left
    }
  }
}
