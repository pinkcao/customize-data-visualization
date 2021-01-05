<template>
  <div style="width: 100%；height: 100%">
    <div class="title-box-component">组件设置</div>
    <div class="component-set-wrapper">
      <el-tabs type="border-card">
        <el-tab-pane label="基础属性">
          <div class="form-sub-item" v-if="flag">
            <span :style="spanStyle">组件宽度: </span>
            <el-input-number
              :style="inputNumberStyle"
              controls-position="right"
              size="mini"
              v-model="currentComponent.width"
              @change="componentBaseStatusOnChange"
            ></el-input-number>
          </div>
          <div class="form-sub-item" v-if="flag">
            <span :style="spanStyle">组件高度: </span>
            <el-input-number
              :style="inputNumberStyle"
              controls-position="right"
              size="mini"
              v-model="currentComponent.height"
              @change="componentBaseStatusOnChange"
            ></el-input-number>
          </div>
          <div class="form-sub-item" v-if="flag">
            <span :style="spanStyle">左侧距离: </span>
            <el-input-number
              :style="inputNumberStyle"
              controls-position="right"
              size="mini"
              v-model="currentComponent.left"
              @change="componentBaseStatusOnChange"
            ></el-input-number>
          </div>
          <div class="form-sub-item" v-if="flag">
            <span :style="spanStyle">上方距离: </span>
            <el-input-number
              :style="inputNumberStyle"
              controls-position="right"
              size="mini"
              v-model="currentComponent.top"
              @change="componentBaseStatusOnChange"
            ></el-input-number>
          </div>
          <div class="form-sub-item" v-if="flag && currentComponent.dataSource.fontColor">
            <span :style="spanStyle">字体颜色:</span>
            <el-color-picker
              :style="inputNumberStyle"
              v-model="currentComponent.dataSource.fontColor"
              @change="updateDataSource"
            ></el-color-picker>
            <!-- <el-input
              placeholder="请输入内容"
              v-model="currentComponent.dataSource.fontColor"
              @change="updateDataSource"
            ></el-input> -->
          </div>
        </el-tab-pane>
        <el-tab-pane label="数据配置">
          <div class="form-sub-item" v-if="flag && currentComponent">
            <span :style="spanStyle">静态JSON数据:</span>
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="componentDataSourceData"
              @change="updateDataSource"
              rows="10"
            ></el-input>
          </div>
        </el-tab-pane>
      </el-tabs>
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
      componentDataSourceData: '',
      // componentWidth: -1,
      // componentHeight: -1,
      // componentLeft: -1,
      // componentTop: -1,
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
    //默认不渲染，只有当vuex中的currentComponent被赋值后渲染
    '$store.state.currentComponent': function(newval) {
      console.log(newval)
      this.currentComponent = newval
      //由于往往是个json对象，所以将其转为JSON字符串，显示为静态JSON数据让用户直接可以修改
      this.componentDataSourceData = JSON.stringify(this.currentComponent.dataSource.data)
      this.flag = true
      // console.log('testtext')
    }
  },
  created() {},
  mounted() {
    // this.updateDataSource()
    // this.initCol()
  },

  methods: {
    //当值变化，将值转为json对象后传至vuex更新组件
    updateDataSource() {
      this.currentComponent.dataSource.data = JSON.parse(this.componentDataSourceData)
      // this.$store.commit('updateDataSource', JSON.parse(this.componentDataSource))
      // console.log(this.currentComponent.dataSource)

      this.$store.commit('updateDataSource', this.currentComponent.dataSource)
    },
    //基础属性变更时触发
    componentBaseStatusOnChange() {
      let currentComponentBaseStatus = {
        width: this.currentComponent.width,
        height: this.currentComponent.height,
        left: this.currentComponent.left,
        top: this.currentComponent.top
      }
      this.$store.commit('updateComponentStatus', currentComponentBaseStatus)
    }
  }
}
</script>

<style lang="less">
.component-set-wrapper .el-tabs--border-card {
  border: 0px;
  background-color: transparent;
  border: 1px solid black;
}

.component-set-wrapper .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  border: 0px;
}

.component-set-wrapper .el-tabs--border-card > .el-tabs__header {
  background-color: rgb(20, 20, 20);
  border: 1px solid #222222;
}

.component-set-wrapper .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #222222;
}

.title-box-component {
  width: 100%;
  height: 30px;
  background-color: #333b45;
  color: #bcc9d4;
  text-align: center;
  font-size: 12px;
  line-height: 30px;
}

.component-set-wrapper {
  float: left;
  margin: 10px;
  color: #eeeeee;
  width: 95%;
  display: flex;
  flex-direction: column;
}

.component-set-wrapper .el-textarea__inner {
  border-radius: 0px;
  border: 0px;
  background-color: #122334;
  color: #eeeeee;
  display: flex;
  flex-direction: column;
}

.component-set-wrapper .el-textarea {
  height: 100%;
}

.el-input-number__decrease {
  border-radius: 0px;
}

.component-set-wrapper .el-input-number.is-controls-right .el-input-number__decrease {
  border-radius: 0px;
}

.component-set-wrapper .el-input-number.is-controls-right .el-input-number__increase {
  border-radius: 0px;
}

.form-sub-item {
  margin: 10px;
}

.component-set-wrapper input {
  background-color: #222222;
  border-radius: 0px;
  border: 1px solid #333333;
}
</style>
