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
        <v-chart
          v-if="flag"
          :chartTitle="title"
          :chartSubTitle="subTitle"
          :titlevis="true"
          :dataSource="dataSource"
          ref="child"
        ></v-chart>
      </div>
    </vue-drag-resize>
  </div>
</template>

<script>
import echarts from 'echarts'
import vChart from '../charts/chart.vue'
import url from '../../mock/mockAPI.js'
import componentsDef from './componentsDef.js'

export default {
  extends: componentsDef,
  name: 'graphComponent',
  components: {
    vChart
  },
  data() {
    return {
      //这些相当于是基础设置属性
      //如果挂载时未重新设定那么就取默认值
      preventActiveBehavior: false,
      name: 'compA',
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
      dataSource: [
        ['department', '2018', '2019'],
        ['finance', 43.3, 85.8],
        ['humanResource', 83.1, 73.4],
        ['sales', 86.4, 65.2],
        ['product', 72.4, 53.9],
        ['qualityAssurance', 55.1, 66.5]
      ]
    }
  },
  //watch需要写在父元素的vue-mount里
  props: {},

  created() {},
  mounted() {
    this.flag = true
  },
  methods: {
    destroyComponent() {
      // console.log('delete down')
      this.ifshow = false
      this.$emit('destroyComponent', this.index)
    },
    resize(newRect) {
      this.width = newRect.width
      this.height = newRect.height
      this.top = newRect.top
      this.left = newRect.left
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
