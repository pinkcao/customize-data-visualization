<template>
  <div style="width: 100%；height: 100%">
    <div class="title-box-page">组件设置</div>
    <div class="page-set-container">
      <div class="form-sub-item" v-if="flag">
        <span :style="spanStyle">组件宽度: </span>
        <el-input-number
          :style="inputNumberStyle"
          controls-position="right"
          size="mini"
          v-model="componentWidth"
          @change="componentBaseStatusOnChange"
        ></el-input-number>
      </div>
      <div class="form-sub-item" v-if="flag">
        <span :style="spanStyle">组件高度: </span>
        <el-input-number
          :style="inputNumberStyle"
          controls-position="right"
          size="mini"
          v-model="componentHeight"
          @change="componentBaseStatusOnChange"
        ></el-input-number>
      </div>
      <div class="form-sub-item" v-if="flag">
        <span :style="spanStyle">左侧距离: </span>
        <el-input-number
          :style="inputNumberStyle"
          controls-position="right"
          size="mini"
          v-model="componentLeft"
          @change="componentBaseStatusOnChange"
        ></el-input-number>
      </div>
      <div class="form-sub-item" v-if="flag">
        <span :style="spanStyle">上方距离: </span>
        <el-input-number
          :style="inputNumberStyle"
          controls-position="right"
          size="mini"
          v-model="componentTop"
          @change="componentBaseStatusOnChange"
        ></el-input-number>
      </div>
      <div class="form-sub-item" v-if="flag && currentComponent">
        <span :style="spanStyle">静态JSON数据:</span>
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="componentDataSource"
          @change="textareaOnChange"
          rows="10"
        ></el-input>
      </div>
    </div>
  </div>
</template>

<script>
import { setSpanStyle, setInputNumberStyle } from '@/common/commonStyle/setColStyle/setColStyle.js'

export default {
  name: 'componentSet',
  data() {
    return {
      // colDef: []
      flag: false,
      currentComponent: null,
      componentDataSource: '',
      // componentBaseStatus: [
      //   { componentWidth: -1 },
      //   { componentHeight: -1 },
      //   { componentLeft: -1 },
      //   { componentTop: -1 }
      // ],
      componentWidth: -1,
      componentHeight: -1,
      componentLeft: -1,
      componentTop: -1,
      inputNumberStyle: setInputNumberStyle,
      spanStyle: setSpanStyle
    }
  },
  computed: {
    currentComponentIndex: function() {
      return this.$store.state.activeComponentIndex
    }
  },
  watch: {
    '$store.state.currentComponent': function(newval) {
      console.log(newval)
      // console.log(newval.dataSource)
      this.currentComponent = newval
      this.componentDataSource = JSON.stringify(this.currentComponent.dataSource)
      // this.componentBaseStatus.componentWidth = this.currentComponent.width
      // this.componentBaseStatus.componentHeight = this.currentComponent.height
      // this.componentBaseStatus.componentLeft = this.currentComponent.left
      // this.componentBaseStatus.componentTop = this.currentComponent.top
      this.componentWidth = this.currentComponent.width
      this.componentHeight = this.currentComponent.height
      this.componentLeft = this.currentComponent.left
      this.componentTop = this.currentComponent.top
      this.flag = true
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
      this.$store.commit('updateDataSource', JSON.parse(this.componentDataSource))
    },
    componentBaseStatusOnChange() {
      let currentComponentBaseStatus = {
        width: this.componentWidth,
        height: this.componentHeight,
        left: this.componentLeft,
        top: this.componentTop
      }
      console.log(currentComponentBaseStatus)
      this.$store.commit('updateComponentStatus', currentComponentBaseStatus)
      // console.log('111')
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
  display: flex;
  flex-direction: column;
}

.page-set-container .el-textarea__inner {
  border-radius: 0px;
  border: 0px;
  background-color: #122334;
  color: #eeeeee;
  display: flex;
  flex-direction: column;
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
