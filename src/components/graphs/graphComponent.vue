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

export default {
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
        ['department', '2018'],
        ['finance', 43.3],
        ['humanResource', 83.1],
        ['sales', 86.4],
        ['product', 72.4],
        ['qualityAssurance', 55.1]
      ]
    }
  },
  //watch需要写在vue-mount里
  watch: {
    // '$store.state.componentList': function(newval) {
    //   console.log(newval)
    // }
    // '$store.state.componentList': function(newval) {
    //   console.log(newval)
    //   if (this.$store.state.activeComponentIndex == this.index) {
    //     for (let i = 0; i < newVal.length; i++) {
    //       if (newVal[i].index == this.index) {
    //         this.dataSource = newVal[i].dataSource
    //         break
    //       }
    //     }
    //   }
    // }
    //数据源变化时图表重新初始化
    // dataSource(val) {
    //   console.log(val)
    //   console.log(this.$refs.child)
    //   // console.log(this.$refs.child.dataSource)
    //   //如果child已经挂载好有实例了
    //   if (this.$refs.child) {
    //     console.log(this.dataSource)
    //     // this.$refs.child.dataSource = this.dataSource
    //     console.log(this.$refs.child.dataSource)
    //     console.log(this.$refs.child.series)
    //     this.$refs.child.updateChart()
    //   }
    //   deep: true
    //   // this.$refs.child.initChart()
    //   // console.log('dataSource变了')
    // }
    // '$refs.child.series': function(newVal) {
    //   console.log('大家好，我不知道我为什么被调用了')
    // }
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
