<template>
  <div v-if="ifshow" ref="testref" @keydown.delete="destroyComponent" tabindex="0">
    <vue-drag-resize
      :isActive="active"
      :preventActiveBehavior="preventActiveBehavior"
      :w="width"
      :h="height"
      :x="left"
      :y="top"
      :z="zindex"
      @resizing="resize"
      @dragging="resize"
      @resizestop="updateComponentList"
      @dragstop="updateComponentList"
      :parentScaleX="parentScaleX"
      :parentScaleY="parentScaleY"
      :parentW="parentW"
      :parentH="parentH"
      :parentLimitation="parentLimitation"
      :isDraggable="draggable"
      :isResizable="resizable"
      @activated="activate"
      @deactivated="onDeactivated"
    >
      <div style="background-color: #ffffff; width: 100%; height: 100%">
        <v-map></v-map>
      </div>
    </vue-drag-resize>
  </div>
</template>

<script>
import echarts from 'echarts'
import url from '../../mock/mockAPI.js'
import vMap from './map.vue'

export default {
  name: 'graphComponent',
  components: {
    vMap
    // vChart
  },
  data() {
    return {
      //这些相当于是基础设置属性
      //如果挂载时未重新设定那么就取默认值
      preventActiveBehavior: false,
      name: 'compB',
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
  props: {},
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

  created() {},
  mounted() {
    this.flag = true
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
      console.log('delete down')
      this.ifshow = false
      this.$emit('destroyComponent', this.index)
    },
    resize(newRect) {
      this.width = newRect.width
      this.height = newRect.height
      this.top = newRect.top
      this.left = newRect.left
      let propertyObj = {
        index: this.index,
        width: this.width,
        height: this.height,
        top: this.top,
        left: this.left
      }
      this.$refs.child.chartResize()
    },
    onDeactivated() {
      this.$refs.testref.blur()
    },
    activate() {
      this.$emit('updateActiveStatus', this.index)
      this.$refs.testref.focus()
    }
  }
}
</script>

<style></style>
