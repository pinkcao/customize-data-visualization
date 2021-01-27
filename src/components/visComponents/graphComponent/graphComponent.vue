<template>
  <div v-if="ifshow" ref="testref" @keydown.delete="destroyComponent" tabindex="0">
    <vue-drag-resize-rotate
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
      :rotate="rotatable"
      @rotate="rotate"
      :deg="style.deg"
      @activated="activate"
      @deactivated="onDeactivated"
    >
      <div style="background-color: #ffffff; width: 100%; height: 100%">
        <v-chart
          v-if="flag"
          :chartTitle="title"
          :chartSubTitle="subTitle"
          :dataSource="dataSource.data"
          :opacity="style.opacity"
          :legendvis="style.legendvis"
          :titlevis="style.titlevis"
          :titlepos="style.titlepos"
          ref="child"
        ></v-chart>
      </div>
    </vue-drag-resize-rotate>
  </div>
</template>

<script>
import vChart from '@/common/commonComponents/graphcharts/chart.vue'
import componentsDef from '@components/componentsDef/componentsDef.js'

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
      width: 200,
      height: 200,
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
      title: '综合图表',
      subTitle: 'fake data',
      dataSource: {
        data: [
          ['department', '2018', '2019'],
          ['finance', 43.3, 85.8],
          ['humanResource', 83.1, 73.4],
          ['sales', 86.4, 65.2],
          ['product', 72.4, 53.9],
          ['qualityAssurance', 55.1, 66.5]
        ],
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
