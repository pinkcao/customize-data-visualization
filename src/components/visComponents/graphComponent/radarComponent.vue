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
      @rotating="rotate"
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
        <v-radar-chart
          v-if="flag"
          :chartTitle="title"
          :chartSubTitle="subTitle"
          :dataSource="dataSource.data"
          :opacity="style.opacity"
          :titlevis="style.titlevis"
          :legendvis="style.legendvis"
          :titlepos="style.titlepos"
          :mode="mode"
          ref="child"
        ></v-radar-chart>
      </div>
    </vue-drag-resize-rotate>
  </div>
</template>

<script>
import componentsDef from '@components/componentsDef/componentsDef.js'
import VRadarChart from '@/common/commonComponents/radarChart/radarChart.vue'

export default {
  extends: componentsDef,
  name: 'radarComponent',
  components: {
    VRadarChart
  },
  data() {
    return {
      //这些相当于是基础设置属性
      //如果挂载时未重新设定那么就取默认值
      preventActiveBehavior: false,
      name: 'radarComponent',
      active: false,
      ifshow: false,
      width: 300,
      height: 300,
      top: 0,
      left: 0,
      parentLimitation: true,
      draggable: true,
      resizable: true,
      rotatable: true,
      index: 0,
      zindex: 0,
      mode: 'design',
      flag: false,
      title: '雷达图',
      subTitle: 'fake data',
      dataSource: {
        data: [
          // eslint-disable-next-line prettier/prettier
          ['销售（sales）', '管理（Administration）', '信息技术（Information Techology）', '客服（Customer Support）','研发（Development）', '市场（Marketing）'],
          [6500, 16000, 30000, 38000, 52000, 25000],
          [4300, 10000, 28000, 35000, 50000, 19000, '预算分配（Allocated Budget）'],
          [5000, 14000, 28000, 31000, 42000, 21000, '实际开销（Actual Spending）']
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
  watch: {},
  created() {},
  mounted() {
    this.flag = true
  },
  methods: {}
}
</script>

<style></style>
