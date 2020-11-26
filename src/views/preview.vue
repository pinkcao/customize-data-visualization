<template>
  <div ref="preview">
    <el-button style="float: right" type="primary" @click="returnToBase"
      >返回</el-button
    >
  </div>
</template>

<script>
import testComponentA from "../components/testComponentA";
import { mount } from "vue-mount";

export default {
  components: {
    // testComponentA,
  },
  name: "mainCanvas",
  data() {
    return {};
  },
  computed: {
    componentList: function () {
      return this.$store.state.componentList;
    },
  },
  props: ["componentName"],
  created() {},
  mounted() {
    this.mountTest();
  },

  methods: {
    returnToBase() {
      this.$router.push({ path: "/basePage" });
    },
    mountTest() {
      let currentData = this.componentList;
      let that = this;
      console.log(this.$store.state.parentScaleX);
      for (let i = 0; i < currentData.length; i++) {
        if (currentData[i].name == "compA") {
          mount(testComponentA, {
            target: that.$refs.preview,
            mode: "append",
            props: {},
            data: {
              index: currentData[i].index,
              target: this.$refs.target,
              ifshow: currentData[i].ifshow,
              width: currentData[i].width,
              height: currentData[i].height,
              top: currentData[i].top,
              left: currentData[i].left,
              name: currentData[i].name,
              parentLimitation: false,
              //   draggable: false,
              //   resizable: false,
              draggable: true,
              resizable: false,
              mode: "preview",
              //   parentLimitation: currentData[i].parentLimitation,
              active: false,
              $store: this.$store,
              //重新挂载后无法访问到全局的this.$store,需要对$store重定向
            },
            on: {},
          });
        }
      }
    },
  },
};
</script>

<style>
</style>
