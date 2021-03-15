<template>
  <div v-if="!disabled" ref="testref" @keydown.delete="destroyComponent" tabindex="0">
    <vue-drag-resize-rotate
      :isActive="active"
      :preventActiveBehavior="preventActiveBehavior"
      :w="width"
      :h="height"
      :x="left"
      :y="top"
      :deg="deg"
      :z="zindex"
      :isRotatable="rotatable"
      :isDraggable="draggable"
      :isResizable="resizable"
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
        <div :style="titleStyle">{{ dataSource.data }}</div>
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
      disabled: false,
      width: 100,
      height: 50,
      top: 100,
      left: 100,
      deg: 0,
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
        fontColor: '#409EFF'
      }
    }
  },
  computed: {
    titleStyle: function() {
      return {
        'font-size': 0.8 * this.height + 'px',
        color: this.style.fontColor,
        'text-align': 'center'
      }
    }
  },

  created() {},
  mounted() {},

  methods: {}
}
</script>

<style lang="less"></style>
