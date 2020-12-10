<template>
  <div style="width: 100%；height: 100%">
    <div class="title-box-page">组件设置</div>
    <div class="page-set-container">
      <span style="font-size: 13px; float:left; margin-bottom: 5px">静态JSON数据:</span>
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="componentTextArea"
        @change="textareaOnChange"
        rows="10"
      ></el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'componentSet',
  data() {
    return {
      // colDef: []
      componentTextArea: ''
    }
  },
  computed: {
    currentComponentIndex: function() {
      return this.$store.state.activeComponentIndex
    }
    // currentComponentDataSource: function() {
    //   return this.$store.state.currentComponentDataSource
    // }
  },
  watch: {
    '$store.state.currentComponent': function(newval) {
      this.componentTextArea = JSON.stringify(newval.dataSource)
      // console.log('testtext')
    }
  },
  created() {},
  mounted() {
    // this.textareaOnChange()
    // this.initCol()
  },

  methods: {
    textareaOnChange() {
      // console.log(JSON.parse('{"name":"jack"}'))
      // console.log(JSON.stringify(JSON.parse(this.componentTextArea)))
      this.$store.commit('updateDataSource', JSON.parse(this.componentTextArea))
      // return JSON.parse(this.componentTextArea)
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

.page-set-container {
  float: left;
  margin: 10px;
  color: #eeeeee;
  width: 90%;
  height: 50%;
}

.page-set-container .el-textarea__inner {
  border-radius: 0px;
  border: 0px;
  background-color: #122334;
  color: #eeeeee;
}

.page-set-container .el-textarea {
  height: 100%;
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
