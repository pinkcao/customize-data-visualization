<template>
  <div style="width: 100%; height: 100%">
    <div class="title-box-page">页面设置</div>
    <div class="page-set-wrapper">
      <el-tabs type="border-card">
        <el-tab-pane label="基础设置">
          <div class="flex-box">
            <div class="form-sub-item" v-for="item in colDef" :key="item.index">
              <span :style="spanStyle">{{ item.title }}</span>
              <el-input-number
                v-if="item.type == 'inputNumber'"
                :style="inputNumberStyle"
                controls-position="right"
                :label="item.title"
                size="mini"
                v-model="item.value"
                @change="onChange(item.index)"
              ></el-input-number>
            </div>
            <div class="page-stretch">
              <span style="margin: 5px; align-self: flex-start; font-size: 13px">缩放方式:</span>
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

export default {
  name: 'pageSet',
  data() {
    return {
      colDef: [],
      spanStyle: setSpanStyle,
      inputNumberStyle: setInputNumberStyle,
      iconstyle: 'color:aliceblue'
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
    }
  },

  created() {},
  mounted() {
    this.initCol()
  },

  methods: {
    //初始化页面设置
    initCol() {
      this.colDef = this.$store.state.colDef
    },
    //更新当前页面设置
    onChange(index) {
      // console.log(index)
      for (let i = 0; i < this.colDef.length; i++) {
        if (this.colDef[i].index == index) {
          let data = {
            index: index,
            value: this.colDef[i].value
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
@selectedcolor: #2681ff;
@notselectedcolor: #303640;
@highlight: #101010;

.page-set-wrapper {
  width: 95%;
}

.page-set-wrapper .el-tabs--border-card {
  border: 0px;
  background-color: transparent;
  border: 1px solid black;
}

.page-set-wrapper .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  border: 0px;
}

.page-set-wrapper .el-tabs--border-card > .el-tabs__header {
  background-color: rgb(20, 20, 20);
  border: 1px solid #222222;
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
  border: 1px solid black;
  display: flex;
  justify-content: space-around;
}

.title-box-page {
  width: 100%;
  height: 30px;
  background-color: #333b45;
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
  border: 1px solid #333333;
}

.stretch-button-show {
  width: 40px;
  height: 30px;
  background-color: @selectedcolor;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stretch-button-show:hover {
  cursor: pointer;
  background-color: @selectedcolor + @highlight;
}

.stretch-button-hide {
  width: 40px;
  height: 30px;
  background-color: @notselectedcolor;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stretch-button-hide:hover {
  cursor: pointer;
  background-color: @notselectedcolor + @highlight;
}
</style>
