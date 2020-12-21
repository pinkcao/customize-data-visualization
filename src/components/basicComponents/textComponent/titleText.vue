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
        <span :style="titleStyle">{{ dataSource }}</span>
      </div>
    </vue-drag-resize>
  </div>
</template>

<script>
import componentsDef from '@components/componentsDef/componentsDef.js'

export default {
  extends: componentsDef,
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
      index: 0,
      zindex: 0,
      mode: 'design',
      flag: false,
      title: '',
      subTitle: '',
      dataSource: '测试'
    }
  },
  computed: {
    titleStyle: function() {
      return {
        'font-size': 0.8 * this.height + 'px'
      }
    }
  },

  created() {},
  mounted() {
    console.log(this.width)
    console.log(this.height)
  },

  methods: {
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

<style lang="less"></style>
