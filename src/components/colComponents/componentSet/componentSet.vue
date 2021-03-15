<template>
  <div :style="componentSetWrapperStyle">
    <div class="title-box-component">
      <span :style="titleStyle">组件设置</span>
    </div>
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

          <div class="form-sub-item" v-if="flag && currentComponent.deg >= -360">
            <div class="span-wrapper">
              <span :style="spanStyle">旋转角度:</span>
            </div>
            <el-input-number
              :style="inputNumberStyle"
              controls-position="right"
              size="mini"
              v-model="currentComponent.deg"
              :step="1"
              :max="360"
              :min="-360"
              @change="componentBaseStatusOnChange"
            ></el-input-number>
          </div>
        </el-tab-pane>

        <el-tab-pane label="数据配置">
          <div class="form-sub-item" v-if="flag && currentComponent.dataSource.APISwitch != null">
            <div class="span-wrapper">
              <span style="font-size: 14px; float: left; color: #eeeeee; user-select: none">数据源配置</span>
            </div>
          </div>
          <div
            v-if="flag && currentComponent.dataSource.APISwitch != null"
            style="display: flex; flex-direction: row; justify-content: flex-end"
          >
            <el-button size="mini" @click="dialogFormVisible = true">配置数据源</el-button>
          </div>

          <hr v-if="flag && currentComponent.dataSource.APISwitch != null" style="border: 1px solid #777777" />

          <div class="form-sub-item" v-if="flag && currentComponent">
            <div class="span-wrapper">
              <span :style="spanStyle">当前数据:</span>
            </div>
            <el-input
              type="textarea"
              placeholder="当前JSON数据"
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

          <div class="form-sub-item" v-if="flag && currentComponent.style.titlevis == true">
            <div class="span-wrapper">
              <span :style="spanStyle">标题位置:</span>
            </div>
            <el-select
              :style="inputStyle"
              style="float: left"
              size="mini"
              v-model="currentComponent.style.titlepos"
              placeholder="请选择"
              @change="updateStyle"
            >
              <el-option
                v-for="item in titleposOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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

    <el-dialog title="数据源配置" :visible.sync="dialogFormVisible">
      <el-form
        style="border: 1px solid black; background-color: #172228"
        :model="currentComponentDataSourceDetail"
        v-if="flag"
        :rules="dialogRules"
        ref="ruleForm"
        label-width="150px"
      >
        <el-form-item style="margin-top: 20px" v-if="flag" label="数据源">
          <el-select
            style="float: left"
            size="mini"
            v-model="currentComponentDataSourceDetail.currentComponentdataSourceType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in currentComponent.dataSource.dataSourceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="flag && currentComponentDataSourceDetail.currentComponentdataSourceType == 'APISource'"
          label="APIURL"
          prop="currentComponentAPIURL"
        >
          <el-input
            style="width: 300px; float: left"
            size="mini"
            v-model="currentComponentDataSourceDetail.currentComponentAPIURL"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="flag && currentComponentDataSourceDetail.currentComponentdataSourceType == 'APISource'"
          label="API请求方式"
          prop="currentComponentAPIMethod"
        >
          <el-select
            style="float: left"
            size="mini"
            v-model="currentComponentDataSourceDetail.currentComponentAPIMethod"
            placeholder="请选择请求方式"
          >
            <el-option label="get" value="get"></el-option>
            <el-option label="post" value="post"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="flag && currentComponentDataSourceDetail.currentComponentdataSourceType == 'APISource'"
          label="API请求间隔(ms)"
          prop="currentComponentAPIInterval"
        >
          <el-input-number
            style="float: left"
            controls-position="right"
            size="mini"
            v-model="currentComponentDataSourceDetail.currentComponentAPIInterval"
            :step="1000"
            :min="1000"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          v-if="flag && currentComponentDataSourceDetail.currentComponentdataSourceType == 'APISource'"
          label="API请求头(可选)"
        >
          <el-input
            type="textarea"
            placeholder=""
            v-model="currentComponentDataSourceDetail.currentComponentAPIHeader"
            style="float:left; width: 300px"
            rows="6"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <!-- <el-button size="mini" type="primary" @click="testbutton">测试按钮</el-button> -->
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="updateDialogDataSource">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  setSpanStyle,
  setInputNumberStyle,
  setInputStyle,
  setDialogInputStyle
} from '@/common/commonStyle/setColStyle/setColStyle.js'
import { colSpanStyle } from '@common/commonStyle/compColStyle/compColStyle.js'

export default {
  name: 'componentSet',
  data() {
    return {
      // colDef: []
      flag: false,
      currentComponent: null,
      componentDataSourceData: '',
      inputNumberStyle: setInputNumberStyle,
      spanStyle: setSpanStyle,
      inputStyle: setInputStyle,
      dialogInputStyle: setDialogInputStyle,
      dialogFormVisible: false,
      currentComponentDataSourceDetail: {
        currentComponentdataSourceType: '',
        currentComponentAPIURL: '',
        currentComponentAPIMethod: '',
        currentComponentAPIInterval: '',
        currentComponentAPIHeader: ''
      },
      titleStyle: colSpanStyle,
      titleposOption: [
        {
          value: 'left',
          label: '左侧'
        },
        {
          value: 'center',
          label: '中间'
        },
        {
          value: 'right',
          label: '右侧'
        }
      ],
      dialogRules: {
        currentComponentAPIURL: [
          { required: true, message: '请输入APIURL', trigger: 'blur' },
          { min: 3, message: '至少3个字符', trigger: 'blur' }
        ],
        currentComponentAPIMethod: [{ required: true, message: '请选择API请求方式', trigger: 'blur' }],
        currentComponentAPIInterval: [{ required: true, message: '请设定请求时间', trigger: 'blur' }]
      }
    }
  },
  computed: {
    currentComponentIndex: function() {
      return this.$store.state.activeComponentIndex
    },
    componentSetWrapperStyle: function() {
      let tempStyle = {}
      if (this.componentSetVis == true) {
        tempStyle = {
          width: '350px',
          height: '100%',
          transition: 'width 0.3s'
        }
      } else {
        tempStyle = {
          width: '0px',
          height: '100%',
          transition: 'width 0.3s'
        }
      }
      return tempStyle
    }
  },
  watch: {
    //默认不渲染，只有当vuex中的currentComponent被赋值后渲染
    '$store.state.currentComponent': {
      handler(newval) {
        this.currentComponent = newval
        //由于往往是个json对象，所以将其转为JSON字符串，显示为静态JSON数据让用户直接可以修改
        this.componentDataSourceData = JSON.stringify(this.currentComponent.dataSource.data)
        this.currentComponentDataSourceDetail.currentComponentdataSourceType = this.currentComponent.dataSource.dataSourceType
        this.currentComponentDataSourceDetail.currentComponentAPIURL = this.currentComponent.dataSource.APIURL
        this.currentComponentDataSourceDetail.currentComponentAPIMethod = this.currentComponent.dataSource.APIMethod
        this.currentComponentDataSourceDetail.currentComponentAPIInterval = this.currentComponent.dataSource.APIInterval
        this.currentComponentDataSourceDetail.currentComponentAPIHeader = this.currentComponent.dataSource.APIHeader
        this.flag = true
        // console.log(this.currentComponentDataSourceDetail)
        console.log(this.currentComponent)
      },
      deep: true
      // console.log(newval)
    }
  },
  created() {},
  mounted() {},
  props: {
    componentSetVis: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    //当值变化，将值转为json对象后传至vuex更新组件
    updateDataSource() {
      this.currentComponent.dataSource.data = JSON.parse(this.componentDataSourceData)
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
        top: this.currentComponent.top,
        deg: this.currentComponent.deg
      }
      console.log(this.currentComponent)
      this.$axios({
        url: this.$url.adjustComponent,
        method: 'post',
        data: {
          templateID: this.$store.state.currentTemplateID,
          deg: this.currentComponent.deg,
          index: this.currentComponent.index,
          width: this.currentComponent.width,
          height: this.currentComponent.height,
          top: this.currentComponent.top,
          left: this.currentComponent.left
        }
      }).then(res => {
        if (res.status == 200) {
        }
      })

      this.$store.commit('updateComponentStatus', currentComponentBaseStatus)
    },
    //更改数据源
    dataSourceChange() {
      this.$store.commit('updateDataSource', this.currentComponent.dataSource)
    },
    updateDialogDataSource() {
      this.currentComponent.dataSource.data = JSON.parse(this.componentDataSourceData)
      this.currentComponent.dataSource.dataSourceType = this.currentComponentDataSourceDetail.currentComponentdataSourceType
      this.currentComponent.dataSource.APIURL = this.currentComponentDataSourceDetail.currentComponentAPIURL
      this.currentComponent.dataSource.APIMethod = this.currentComponentDataSourceDetail.currentComponentAPIMethod
      this.currentComponent.dataSource.APIInterval = this.currentComponentDataSourceDetail.currentComponentAPIInterval
      this.currentComponent.dataSource.APIHeader = this.currentComponentDataSourceDetail.currentComponentAPIHeader
      this.$store.commit('updateDataSource', this.currentComponent.dataSource)
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="less">
.component-set-wrapper .el-tabs--border-card {
  border: 0px;
  background-color: transparent;
  border: @blackSolidBorder;
}

.component-set-wrapper .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  border: 0px;
}

.component-set-wrapper .el-tabs--border-card > .el-tabs__header {
  background-color: rgb(20, 20, 20);
  border: @darkSolidBorder;
  user-select: none;
}

.component-set-wrapper .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #222222;
}

.el-select el-select--mini {
  background-color: #333333;
}

.el-dialog {
  background-color: #222222;
}

.el-dialog .el-dialog__header .el-dialog__title {
  color: #bcc9d4;
}

.title-box-component {
  width: 100%;
  height: 30px;
  background-color: @titleBoxBackgroundColor;
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

.component-set-wrapper .el-button {
  // align-self: center;
  background-color: #111111;
  border: 2px solid black;
  color: #bcc9d4;
}

.component-set-wrapper .el-button:hover {
  // background-color: transparent;
  background-color: #222244;
  border: 2px solid black;
  color: #bcc9d4;
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
  border: @darkSolidBorder;
}

.span-wrapper {
  width: 80px;
}

.form-sub-item .el-textarea__inner {
  font-family: 'Microsoft';
  font-size: 8px;
  color: #bcc9d4;
}

.el-dialog__body .el-textarea__inner {
  font-family: 'Microsoft';
  font-size: 8px;
  color: black;
}
</style>
