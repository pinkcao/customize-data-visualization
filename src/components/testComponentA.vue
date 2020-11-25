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
  name: "testComponentA",
  data() {
    return {
      name: "compA",
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
    };
  },
  computed: {
    parentScaleX: function () {
      if(this.mode == 'design') {
        return this.$store.state.parentScaleX;
      } else {
        return 1;
      }
      // return this.$store.state.parentScaleX;
    },
    parentScaleY: function () {
      if(this.mode == 'design') {
        return this.$store.state.parentScaleY;
      } else {
        return 1;
      }
    },
    parentW: function () {
      return this.$store.state.parentW;
    },
    parentH: function () {
      return this.$store.state.parentH;
    },
  },

  created() {},
  mounted() {
    console.log(this.index);
  },
  methods: {
    resize(newRect) {
      this.width = newRect.width;
      this.height = newRect.height;
      this.top = newRect.top;
      this.left = newRect.left;
      console.log(this.width);
      console.log(this.width);
    },
    onDeactivated() {
      console.log("deactivated" + this.index);
    },
    activate() {},
    

    // // showData(event) {
    // //   console.log("我被点了");
    // //   // this.$emit('receiveDataFromSon',this.uid);
    // //   this.$store.commit('changeComponentUid', this.uid);
    // //   this.ifshow = false;
    // // },
    // dragstarttest(event) {
    //   // console.log("dragstarts");
    //   this.offsetX = event.clientX - event.currentTarget.getBoundingClientRect().left;
    //   this.offsetY = event.clientY - event.currentTarget.getBoundingClientRect().top;
    //   console.log(event.clientY - event.currentTarget.getBoundingClientRect().top);

    //   // console.log(this.notices);
    //   // console.log(this.testProps);
    // },

    // /*
    // 在dragend操作结束时，可以是直接调用api更新数据库中的组件数组，或者是通过子组件传值给父组件，父组件接收如组件名等，
    // 在组件列表中进行更新，并保存到数据库，当然可能保存过于频繁，所以每x分钟进行一次保存，或是在预览时进行一次保存
    // 组件名用于标识是哪个组件，但每个组件需要有一个uid标识在画布上到底是哪个元素避免冲突。
    // */
    // dragendtest(event) {
    //   console.log("dragends");
    //   // console.log(event.clientX-this.offsetX+'px');
    //   event.currentTarget.style.left = event.clientX - this.offsetX + 'px';
    //   event.currentTarget.style.top = event.clientY - this.offsetY + 'px';
    //   console.log(event.currentTarget.style.left);
    //   console.log(event.currentTarget.getBoundingClientRect());

    // },
  },
};
</script>

<style>
</style>
