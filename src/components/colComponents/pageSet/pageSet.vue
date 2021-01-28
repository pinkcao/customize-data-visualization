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
        <el-tab-pane label="背景设置"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { setSpanStyle, setInputNumberStyle } from '@/common/commonStyle/setColStyle/setColStyle.js'
import { colSpanStyle } from '@common/commonStyle/compColStyle/compColStyle.js'

export default {
  name: 'pageSet',
  data() {
    return {
      screenDef: [],
      spanStyle: setSpanStyle,
      inputNumberStyle: setInputNumberStyle,
      iconstyle: 'color:aliceblue',
      titleStyle: colSpanStyle
    }
  },
  computed: {
    //全屏缩放
    allStretch: function() {
      return {
        'stretch-button-show': this.$store.state.allStretch,
        'stretch-button-hide': !this.$store.state.allStretch
      }
    },
    //x轴缩放
    xStretch: function() {
      return {
        'stretch-button-show': this.$store.state.xStretch,
        'stretch-button-hide': !this.$store.state.xStretch
      }
    },
    //y轴缩放
    yStretch: function() {
      return {
        'stretch-button-show': this.$store.state.yStretch,
        'stretch-button-hide': !this.$store.state.yStretch
      }
    },
    //不缩放
    noStretch: function() {
      return {
        'stretch-button-show': this.$store.state.noStretch,
        'stretch-button-hide': !this.$store.state.noStretch
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
  },
  watch: {
    '$store.state.screenDefFlag': function(newval) {
      // console.log(newval)
      if (newval == true) {
        this.initCol()
      }
    }
  },
  methods: {
    //初始化页面设置
    initPageDef() {
      if (this.$store.state.screenDefFlag == true) {
        this.initCol()
      }
    },
    initCol() {
      this.screenDef = this.$store.state.screenDef
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
          this.$store.commit('updatePageValue', data)
          this.$store.commit('updateParentScale')
        }
      }
    },
    //更新当前缩放模式至vuex
    updateStretch(stretch) {
      console.log(stretch)
      this.$store.commit('updateStretch', stretch)
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
</style>
