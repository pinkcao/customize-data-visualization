<template>
  <!--   <div
  v-if="ifshow"
  :style="comstyle"
  draggable="true"
  @click="showData"
  @dragstart="dragstarttest"
  @dragend="dragendtest">
    <div  style="width: 100%;height: 100%;background-color: #333333;">

    </div>
  </div> -->
  <div>
    <vue-drag-resize
      :isActive="active"
      :w="width"
      :h="height"
      :x="left"
      :y="top"
      v-on:resizing="resize"
      v-on:dragging="resize"
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
      <div style="background-color: #772553; width: 100%; height: 100%"></div>
    </vue-drag-resize>
  </div>
</template>

<script>
export default {
  name: 'testComponentA',
  data() {
    return {
      name: 'compA',
      active: false,
      ifshow: false,
      width: 100,
      height: 100,
      top: 100,
      left: 100,
      parentLimitation: true,
      draggable: true,
      resizable: true,
      index: 0,
      mode: 'design'
    }
  },
  computed: {
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
    // console.log(this.index);
  },
  methods: {
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
      this.$store.commit('adjustComponent', propertyObj)
      console.log('width:', this.width)
      console.log('height:', this.height)
      console.log('top:', this.top)
      console.log('left', this.left)
    },
    onDeactivated() {
      console.log('deactivated' + this.index)
    },
    activate() {}
  }
}
</script>

<style></style>
