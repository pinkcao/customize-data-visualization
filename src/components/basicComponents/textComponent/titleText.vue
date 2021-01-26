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
      @activated="activate"
      @deactivated="onDeactivated"
      :rotate="rotatable"
      @rotate="rotate"
      :deg="style.deg"
    >
      <div style="background-color: #ffffff; width: 100%; height: 100%">
        <span :style="titleStyle">{{ dataSource.data }}</span>
      </div>
    </vue-drag-resize-rotate>
  </div>
</template>

<script>
// import componentsDef from '@components/componentsDef/componentsDef.js'
import commonComponentsDef from '@components/componentsDef/commonComponentsDef.js'

export default {
  extends: commonComponentsDef,
  name: 'titleText',
  data() {
    return {
      name: 'titleComponent',
      preventActiveBehavior: false,
      active: false,
      ifshow: false,
      width: 100,
      height: 50,
      top: 100,
      left: 100,
      parentLimitation: true,
      draggable: true,
      resizable: true,
      rotatable: true,
      index: 0,
      zindex: 0,
      mode: 'design',
      flag: false,
      title: '',
      subTitle: '',
      dataSource: {
        data: '测试'
        // fontColor: '#409EFF'
      },
      style: {
        fontColor: '#409EFF',
        deg: 0
      }
    }
  },
  computed: {
    titleStyle: function() {
      return {
        'font-size': 0.8 * this.height + 'px',
        color: this.style.fontColor
      }
    }
  },

  created() {},
  mounted() {},

  methods: {}
}
</script>

<style lang="less"></style>
