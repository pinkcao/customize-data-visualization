<template>
  <div v-if="testflag">
    <div style="width: 100px; height: 100px; background-color: #ff0000">页面设置</div>
  </div>
</template>

<script>
export default {
  name: 'test',
  data() {
    return {
      testflag: false
    }
  },
  computed: {},

  created() {
    console.log('创建出来了')
  },
  mounted() {},
  beforeDestroy() {
    console.log('马上被销毁了')
  },

  methods: {
    changeFlag() {
      console.log(this.testflag)
      this.testflag = !this.testflag
    }
  }
}
</script>

<style lang="less">
.title-box-page {
  width: 100%;
  height: 30px;
  background-color: #333b45;
  color: #bcc9d4;
  text-align: center;
  font-size: 12px;
  line-height: 30px;
}
</style>
