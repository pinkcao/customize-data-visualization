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
      <!-- <el-button type="danger" icon="el-icon-delete" circle></el-button> -->
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

export default {
  name: 'testComponentA',
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
        ['department', '2018', '2019', '2020', '2021', '2022'],
        ['finance', 43.3, 85.8, 93.7, 55.4, 66.7],
        ['humanResource', 83.1, 73.4, 55.1, 77.3, 26.4],
        ['sales', 86.4, 65.2, 82.5, 41.5, 57.6],
        ['product', 72.4, 53.9, 39.1, 14.8, 25.9],
        ['qualityAssurance', 55.1, 66.5, 46.8, 34.8, 66.4]
      ]
    }
  },
  props: {
    // active: {
    //   default: false
    // }
  },
  computed: {
    currentStyle: function() {
      return {
        width: this.width,
        height: this.height
      }
    },
    parentScaleX: function() {
      if (this.mode == 'design') {
        return this.$store.state.parentScale
      } else {
        return 1
      }
      // return this.$store.state.parentScaleX;
    },
    parentScaleY: function() {
      if (this.mode == 'design') {
        return this.$store.state.parentScale
      } else {
        return 1
      }
    },
    parentW: function() {
      return this.$store.state.parentW
    },
    parentH: function() {
      return this.$store.state.parentH
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
        // console.log(res)
      })
      // let propertyObj = {
      //   index: this.index,
      //   width: this.width,
      //   height: this.height,
      //   top: this.top,
      //   left: this.left
      // }
      // this.$store.commit('adjustComponent', propertyObj)
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
      // console.log(this.index, this.active)
      this.$refs.testref.focus()
    }
  }
}
</script>

<style></style>
