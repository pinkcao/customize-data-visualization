<template>
  <div style="width: 100%；height: 100%">
    <div class="title-box-component">组件设置</div>
    <div class="component-set-wrapper">
      <el-tabs type="border-card">
        <el-tab-pane label="基础属性">
          <div class="form-sub-item" v-if="flag">
            <div class="span-wrapper">
              <span :style="spanStyle">组件宽度:</span>
            </div>
            <el-input-number
              :style="inputNumberStyle"
              controls-position="right"
              size="mini"
              v-model="currentComponent.width"
              @change="componentBaseStatusOnChange"
            ></el-input-number>
          </div>

          <div class="form-sub-item" v-if="flag">
            <div class="span-wrapper">
              <span :style="spanStyle">组件高度:</span>
            </div>
            <el-input-number
              :style="inputNumberStyle"
              controls-position="right"
              size="mini"
              v-model="currentComponent.height"
              @change="componentBaseStatusOnChange"
            ></el-input-number>
          </div>

          <div class="form-sub-item" v-if="flag">
            <div class="span-wrapper">
              <span :style="spanStyle">左侧距离:</span>
            </div>
            <el-input-number
              :style="inputNumberStyle"
              controls-position="right"
              size="mini"
              v-model="currentComponent.left"
              @change="componentBaseStatusOnChange"
            ></el-input-number>
          </div>

          <div class="form-sub-item" v-if="flag">
            <div class="span-wrapper">
              <span :style="spanStyle">上方距离:</span>
            </div>
            <el-input-number
              :style="inputNumberStyle"
              controls-position="right"
              size="mini"
              v-model="currentComponent.top"
              @change="componentBaseStatusOnChange"
            ></el-input-number>
          </div>
        </el-tab-pane>

        <el-tab-pane label="数据配置">
          <div class="form-sub-item" v-if="flag && currentComponent">
            <div class="span-wrapper">
              <span :style="spanStyle">当前数据:</span>
            </div>
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="componentDataSourceData"
              @change="updateDataSource"
              rows="10"
            ></el-input>
          </div>
        </el-tab-pane>

        <el-tab-pane label="样式设置">
          <div class="form-sub-item" v-if="flag && currentComponent.style.opacity >= 0">
            <div class="span-wrapper">
              <span :style="spanStyle">透明度:</span>
            </div>
            <el-input-number
              :style="inputNumberStyle"
              controls-position="right"
              size="mini"
              v-model="currentComponent.style.opacity"
              :precision="2"
              :step="0.05"
              :max="1"
              :min="0"
              @change="updateStyle"
            ></el-input-number>
          </div>

          <div class="form-sub-item" v-if="flag && currentComponent.style.deg >= -360">
            <div class="span-wrapper">
              <span :style="spanStyle">旋转角度:</span>
            </div>
            <el-input-number
              :style="inputNumberStyle"
              controls-position="right"
              size="mini"
              v-model="currentComponent.style.deg"
              :step="1"
              :precision="2"
              :max="360"
              :min="-360"
              @change="updateStyle"
            ></el-input-number>
          </div>

          <div class="form-sub-item" v-if="flag && currentComponent.style.legendvis != null">
            <div class="span-wrapper">
              <span :style="spanStyle">图例显示:</span>
            </div>
            <el-switch
              :style="inputNumberStyle"
              size="mini"
              v-model="currentComponent.style.legendvis"
              @change="updateStyle"
            ></el-switch>
          </div>

          <div class="form-sub-item" v-if="flag && currentComponent.style.titlevis != null">
            <div class="span-wrapper">
              <span :style="spanStyle">标题显示:</span>
            </div>
            <el-switch
              :style="inputNumberStyle"
              size="mini"
              v-model="currentComponent.style.titlevis"
              @change="updateStyle"
            ></el-switch>
          </div>

          <div class="form-sub-item" v-if="flag && currentComponent.style.titlevis == true">
            <div class="span-wrapper">
              <span :style="spanStyle">标题:</span>
            </div>
            <el-input
              :style="inputStyle"
              style="width: 150px"
              size="mini"
              v-model="currentComponent.title"
              @change="updateTitle"
            ></el-input>
          </div>

          <div class="form-sub-item" v-if="flag && currentComponent.style.titlevis == true">
            <div class="span-wrapper">
              <span :style="spanStyle">副标题:</span>
            </div>
            <el-input
              :style="inputStyle"
              size="mini"
              v-model="currentComponent.subTitle"
              @change="updateSubTitle"
            ></el-input>
          </div>

          <div class="form-sub-item" v-if="flag && currentComponent.style.fontColor">
            <div class="span-wrapper">
              <span :style="spanStyle">字体颜色:</span>
            </div>
            <el-color-picker
              :style="inputNumberStyle"
              v-model="currentComponent.style.fontColor"
              @change="updateStyle"
            ></el-color-picker>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { setSpanStyle, setInputNumberStyle, setInputStyle } from '@/common/commonStyle/setColStyle/setColStyle.js'

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
      spanStyle: setSpanStyle,
      inputStyle: setInputStyle
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
      // console.log(newval)
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
    //更新所有的样式
    updateStyle() {
      this.$store.commit('updateStyle', this.currentComponent.style)
    },
    //更新标题
    updateTitle() {
      this.$store.commit('updateTitle', this.currentComponent.title)
    },
    //更新副标题
    updateSubTitle() {
      this.$store.commit('updateSubTitle', this.currentComponent.subTitle)
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
  display: flex;
  flex-direction: row;
}

.component-set-wrapper input {
  background-color: #222222;
  border-radius: 0px;
  border: 1px solid #333333;
}

.span-wrapper {
  width: 80px;
}
</style>
