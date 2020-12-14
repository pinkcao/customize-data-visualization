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
import componentsDef from '@components/componentsDef/componentsDef.js'

export default {
  extends: componentsDef,
  name: 'titleText',
  data() {
    return {
      name: 'compD'
    }
  },
  computed: {},

  created() {},
  mounted() {},

  methods: {}
}
</script>

<style lang="less"></style>
