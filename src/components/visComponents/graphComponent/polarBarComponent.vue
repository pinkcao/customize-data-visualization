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
      :deg="style.deg"
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
      :rotate="rotatable"
      @rotate="rotate"
    >
      <div style="background-color: #ffffff; width: 100%; height: 100%">
        <v-polar-bar-chart
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
        ></v-polar-bar-chart>
      </div>
    </vue-drag-resize-rotate>
  </div>
</template>

<script>
import echarts from 'echarts'
import componentsDef from '@components/componentsDef/componentsDef.js'
import vPolarBarChart from '@/common/commonComponents/polarBarChart/polarBarChart.vue'

export default {
  extends: componentsDef,
  name: 'polarBarComponent',
  components: {
    vPolarBarChart
  },
  data() {
    return {
      //这些相当于是基础设置属性
      //如果挂载时未重新设定那么就取默认值
      preventActiveBehavior: false,
      name: 'polarBarComponent',
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
      title: '极坐标柱状图',
      subTitle: 'fake data',
      dataSource: {
        data: [
          ['周一', '周二', '周三', '周四', 'legend'],
          [2, 3, 4, 5, 'legendA'],
          [4, 5, 6, 7, 'legendB'],
          [5, 6, 7, 8, 'legendC']
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
  watch: {
    title: function(newVal) {
      console.log(newVal)
    }
  },
  created() {},
  mounted() {
    this.flag = true
  },
  methods: {
    updateComponentList() {
      if (this.mode == 'design') {
        this.$axios({
          url: this.$url.adjustComponent,
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
          this.$store.commit('resizeUpdateActiveComponent')
        })
      }
    },
    chartResize() {
      this.$refs.child.chartResize()
    },
    resize(newRect) {
      this.width = newRect.width
      this.height = newRect.height
      this.top = newRect.top
      this.left = newRect.left
      this.$refs.child.chartResize()
    },
    rotate(deg) {
      // console.log(deg)
      this.style.deg = deg
    }
  }
}
</script>

<style></style>
