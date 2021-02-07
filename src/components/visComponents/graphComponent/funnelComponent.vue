<template>
  <div v-if="ifshow" ref="testref" @keydown.delete="destroyComponent" tabindex="0">
    <vue-drag-resize-rotate
      :isActive="active"
      :preventActiveBehavior="preventActiveBehavior"
      :w="width"
      :h="height"
      :x="left"
      :y="top"
      :deg="style.deg"
      :z="zindex"
      :isDraggable="draggable"
      :isResizable="resizable"
      :isRotatable="rotatable"
      @resizing="resize"
      @dragging="resize"
      @rotatating="rotate"
      @resizestop="updateComponentList"
      @dragstop="updateComponentList"
      :parentScaleX="parentScaleX"
      :parentScaleY="parentScaleY"
      :parentW="parentW"
      :parentH="parentH"
      :parentLimitation="parentLimitation"
      @activated="activate"
      @deactivated="onDeactivated"
    >
      <div style="background-color: #ffffff; width: 100%; height: 100%">
        <v-funnel-chart
          v-if="flag"
          :chartTitle="title"
          :chartSubTitle="subTitle"
          :dataSource="dataSource.data"
          :opacity="style.opacity"
          :legendvis="style.legendvis"
          :titlevis="style.titlevis"
          :titlepos="style.titlepos"
          :mode="mode"
          ref="child"
        ></v-funnel-chart>
      </div>
    </vue-drag-resize-rotate>
  </div>
</template>

<script>
import componentsDef from '@components/componentsDef/componentsDef.js'
import vFunnelChart from '@/common/commonComponents/funnelChart/funnelChart.vue'

export default {
  extends: componentsDef,
  name: 'funnelComponent',
  components: {
    vFunnelChart
  },
  data() {
    return {
      //这些相当于是基础设置属性
      //如果挂载时未重新设定那么就取默认值
      preventActiveBehavior: false,
      name: 'funnelComponent',
      active: false,
      ifshow: false,
      width: 200,
      height: 200,
      top: 0,
      left: 0,
      parentLimitation: true,
      draggable: true,
      resizable: true,
      index: 0,
      zindex: 0,
      mode: 'design',
      flag: false,
      title: '漏斗图',
      subTitle: 'fake data',
      dataSource: {
        data: [
          { value: 60, name: '访问' },
          { value: 40, name: '咨询' },
          { value: 20, name: '订单' },
          { value: 80, name: '点击' },
          { value: 100, name: '展现' }
        ]
      },
      style: {
        opacity: 1,
        legendvis: true,
        titlevis: true
      }
    }
  },
  //watch需要写在父元素的vue-mount里
  props: {},

  created() {},
  mounted() {
    this.flag = true
  },
  methods: {}
}
</script>

<style></style>
