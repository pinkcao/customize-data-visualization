<template>
  <div :style="pageSetWrapperStyle">
    <div class="title-box-page">
      <span :style="titleStyle">页面设置</span>
    </div>
    <div class="page-set-wrapper">
      <el-tabs type="border-card">
        <el-tab-pane label="基础设置">
          <div class="flex-box">
            <div class="form-sub-item" v-for="item in screenDef" :key="item.index">
              <span :style="spanStyle">{{ item.title }}</span>
              <el-input-number
                v-if="item.type == 'inputNumber'"
                :style="inputNumberStyle"
                controls-position="right"
                :label="item.title"
                size="mini"
                :min="0"
                :step="10"
                v-model="item.value"
                @change="onChange(item.index)"
              ></el-input-number>
            </div>
            <div class="page-stretch">
              <span style="margin: 5px; align-self: flex-start; font-size: 13px; user-select: none">缩放方式:</span>
              <div class="page-stretch-button-set">
                <div :class="allStretch" @click="updateStretch('allStretch')" title="全屏缩放">
                  <i :style="iconstyle" class="el-icon-full-screen"></i>
                </div>
                <div :class="xStretch" @click="updateStretch('xStretch')" title="x轴缩放">
                  <i :style="iconstyle" class="el-icon-caret-left"></i>
                  <i :style="iconstyle" class="el-icon-caret-right"></i>
                </div>
                <div :class="yStretch" @click="updateStretch('yStretch')" title="y轴缩放">
                  <i :style="iconstyle" class="el-icon-d-caret"></i>
                </div>
                <div :class="noStretch" @click="updateStretch('noStretch')" title="不缩放">
                  <i :style="iconstyle" class="el-icon-monitor"></i>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="背景设置">
          <div class="form-sub-item" v-if="backgroundStyleFlag">
            <div class="span-wrapper">
              <span :style="spanStyle">背景颜色:</span>
            </div>
            <div>
              <el-color-picker
                :style="inputNumberStyle"
                v-model="backgroundColor"
                @change="updateBackgroundStyle"
              ></el-color-picker>
            </div>
            <div class="default-color">
              <el-button size="mini" @click="updateBackgroundStyleToDefault">恢复默认颜色</el-button>
            </div>
          </div>

          <div class="form-sub-item" v-if="backgroundStyleFlag">
            <div class="span-wrapper">
              <span :style="spanStyle">背景地址:</span>
            </div>
            <el-input
              :style="inputStyle"
              style="width: 200px"
              size="mini"
              v-model="backgroundImage"
              @change="updateBackgroundStyle"
            ></el-input>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
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
  name: 'pageSet',
  data() {
    return {
      screenDef: [],
      spanStyle: setSpanStyle,
      inputNumberStyle: setInputNumberStyle,
      iconstyle: 'color:aliceblue',
      titleStyle: colSpanStyle,
      inputStyle: setInputStyle,
      backgroundStyle: {
        backgroundColor: '#000000',
        backgroundImage: ''
      },
      backgroundColor: '',
      backgroundImage: '',
      backgroundStyleFlag: false,
      defaultBackgroundColor: '#0e2a43'
    }
  },
  computed: {
    //全屏缩放
    allStretch: function() {
      return {
        'stretch-button-show': this.$store.state.template.allStretch,
        'stretch-button-hide': !this.$store.state.template.allStretch
      }
    },
    //x轴缩放
    xStretch: function() {
      return {
        'stretch-button-show': this.$store.state.template.xStretch,
        'stretch-button-hide': !this.$store.state.template.xStretch
      }
    },
    //y轴缩放
    yStretch: function() {
      return {
        'stretch-button-show': this.$store.state.template.yStretch,
        'stretch-button-hide': !this.$store.state.template.yStretch
      }
    },
    //不缩放
    noStretch: function() {
      return {
        'stretch-button-show': this.$store.state.template.noStretch,
        'stretch-button-hide': !this.$store.state.template.noStretch
      }
    },
    currentComponentIndex: function() {
      return this.$store.state.activeComponentIndex
    },
    pageSetWrapperStyle: function() {
      let tempStyle = {}
      if (this.pageSetVis == true) {
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
  props: {
    pageSetVis: {
      type: Boolean,
      default: true
    }
  },
  created() {},
  mounted() {
    this.initPageDef()
    this.initBackgroundStyle()
  },
  watch: {
    '$store.state.template.screenDefFlag': function(newval) {
      // console.log(newval)
      if (newval == true) {
        this.initCol()
      }
    },
    '$store.state.template.backgroundStyleFlag': function(newval) {
      if (newval) {
        this.initBackgroundStyle()
      }
    }
  },
  methods: {
    updateBackgroundStyle() {
      if (this.$store.state.template.backgroundStyleFlag == true) {
        let tempBackgroundStyle = {
          backgroundColor: this.backgroundColor,
          backgroundImage: this.backgroundImage
        }
        this.$store.dispatch('template/updateBackgroundStyle', tempBackgroundStyle)
        this.$axios({
          url: this.$url.updateBackgroundStyle,
          method: 'post',
          data: {
            backgroundColor: this.backgroundColor,
            backgroundImage: this.backgroundImage,
            templateID: window.localStorage.getItem('templateID')
          }
        }).then(res => {
          if (res) {
            if (res.status == 200) {
              console.log(res.data)
            }
          }
        })
      }
    },
    updateBackgroundStyleToDefault() {
      if (this.$store.state.template.backgroundStyleFlag == true) {
        this.backgroundColor = this.defaultBackgroundColor
        let tempBackgroundStyle = {
          backgroundColor: this.defaultBackgroundColor,
          backgroundImage: this.backgroundImage
        }
        this.$store.dispatch('template/updateBackgroundStyle', tempBackgroundStyle)
        this.$axios({
          url: this.$url.updateBackgroundStyle,
          method: 'post',
          data: {
            backgroundColor: this.defaultBackgroundColor,
            backgroundImage: this.backgroundImage,
            templateID: window.localStorage.getItem('templateID')
          }
        }).then(res => {
          if (res) {
            if (res.status == 200) {
              // console.log(res.data)
            }
          }
        })
      }
    },
    initBackgroundStyle() {
      this.backgroundColor = this.$store.state.template.backgroundStyle.backgroundColor
      this.backgroundImage = this.$store.state.template.backgroundStyle.backgroundImage
      this.backgroundStyleFlag = true
    },
    //初始化页面设置
    initPageDef() {
      if (this.$store.state.template.screenDefFlag == true) {
        this.initCol()
      }
    },
    initCol() {
      this.screenDef = this.$store.state.template.screenDef
    },
    //更新当前页面设置
    onChange(index) {
      // console.log(index)
      for (let i = 0; i < this.screenDef.length; i++) {
        if (this.screenDef[i].index == index) {
          let data = {
            index: index,
            value: this.screenDef[i].value
          }
          this.$store.dispatch('template/updatePageValue', data)
          this.$store.dispatch('template/updateParentScale')
        }
      }
      console.log(this.$store.state.template.screenDef)
      this.$axios({
        url: this.$url.updateScreenDef,
        method: 'post',
        data: {
          screenDef: this.$store.state.template.screenDef
        }
      }).then(res => {
        if (res) {
          if (res.status == 200) {
            // console.log(res.data)
          }
        }
      })
    },
    //更新当前缩放模式
    updateStretch(stretch) {
      this.$store.dispatch('template/updateStretch', stretch)
      let screenStretch = {
        allStretch: this.$store.state.template.allStretch,
        yStretch: this.$store.state.template.yStretch,
        xStretch: this.$store.state.template.xStretch,
        noStretch: this.$store.state.template.noStretch
      }

      this.$axios({
        url: this.$url.updateScreenStretch,
        method: 'post',
        data: {
          // screenStretch: screenStretch,
          screenStretch: stretch,
          templateID: window.localStorage.getItem('templateID'),
          userID: window.localStorage.getItem('userID')
        }
      }).then(res => {
        if (res) {
          if (res.status == 200) {
            // console.log(res.data)
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.page-set-wrapper {
  width: 95%;
}

.page-set-wrapper .el-tabs--border-card {
  border: 0px;
  background-color: transparent;
  border: @blackSolidBorder;
}

.page-set-wrapper .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  border: 0px;
}

.page-set-wrapper .el-tabs--border-card > .el-tabs__header {
  background-color: rgb(20, 20, 20);
  border: @darkSolidBorder;
  user-select: none;
}

.page-set-wrapper .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #222222;
}

.page-stretch {
  margin-top: 20px;
  width: 100%;
  height: 80px;
  // background-color: rgb(139, 25, 25);
  display: flex;
  flex-direction: column;
}

.page-stretch-button-set {
  width: 100%;
  border: @blackSolidBorder;
  display: flex;
  justify-content: space-around;
}

.title-box-page {
  width: 100%;
  height: 30px;
  background-color: @titleBoxBackgroundColor;
  color: #bcc9d4;
  text-align: center;
  font-size: 12px;
  line-height: 30px;
}

.flex-box {
  display: flex;
  flex-direction: column;
}

.page-set-wrapper {
  margin: 10px;
  color: #dddddd;
}

.el-input-number__decrease {
  border-radius: 0px;
}

.page-set-wrapper .el-input-number.is-controls-right .el-input-number__decrease {
  border-radius: 0px;
}

.page-set-wrapper .el-input-number.is-controls-right .el-input-number__increase {
  border-radius: 0px;
}

.form-sub-item {
  margin: 5px;
  // float: left;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.page-set-wrapper input {
  background-color: #222222;
  border-radius: 0px;
  border: @darkSolidBorder;
}

.stretch-button-show {
  width: 40px;
  height: 30px;
  background-color: @iconSelectedcolor;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stretch-button-show:hover {
  cursor: pointer;
  background-color: @iconSelectedcolor + @highlight;
}

.stretch-button-hide {
  width: 40px;
  height: 30px;
  background-color: @iconNotSelectedcolor;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stretch-button-hide:hover {
  cursor: pointer;
  background-color: @iconNotSelectedcolor + @highlight;
}

.span-wrapper {
  width: 80px;
}

.default-color {
  margin-left: 10px;
}

.default-color .el-button {
  // align-self: center;
  background-color: #111111;
  border: 2px solid black;
  color: #bcc9d4;
}

.default-color .el-button:hover {
  // background-color: transparent;
  background-color: #0e2a43;
  border: 2px solid black;
  color: #bcc9d4;
}
</style>
