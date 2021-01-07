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
        <v-map></v-map>
      </div>
    </vue-drag-resize>
  </div>
</template>

<script>
import vMap from './map.vue'
import componentsDef from '@components/componentsDef/componentsDef.js'

export default {
  extends: componentsDef,
  name: 'mapComponent',
  components: {
    vMap
  },
  data() {
    return {
      //这些相当于是基础设置属性
      //如果挂载时未重新设定那么就取默认值
      preventActiveBehavior: false,
      name: 'mapComponent',
      active: false,
      ifshow: false,
      width: 300,
      height: 300,
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
      dataSource: []
    }
  },
  props: {},
  computed: {},

  created() {},
  mounted() {
    this.flag = true
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

<style></style>
