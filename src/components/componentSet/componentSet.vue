<template>
  <div style="width: 100%；height: 100%">
    <div class="title-box-page">组件设置</div>
    <div class="page-set-container"></div>
  </div>
</template>

<script>
export default {
  name: 'componentSet',
  data() {
    return {
      colDef: []
    }
  },
  computed: {},

  created() {},
  mounted() {
    // this.initCol()
  },

  methods: {}
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

.page-set-container {
  float: left;
  margin: 10px;
  color: #aaaaaa;
}

.el-input-number__decrease {
  border-radius: 0px;
}

.page-set-container .el-input-number.is-controls-right .el-input-number__decrease {
  border-radius: 0px;
}

.page-set-container .el-input-number.is-controls-right .el-input-number__increase {
  border-radius: 0px;
}

.form-sub-item {
  margin: 5px;
}

.page-set-container input {
  background-color: #222222;
  border-radius: 0px;
  border: 1px solid #333333;
}
</style>
