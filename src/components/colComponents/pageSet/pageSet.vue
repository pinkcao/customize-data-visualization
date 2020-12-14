<template>
  <div style="width: 100%; height: 100%">
    <div class="title-box-page">页面设置</div>
    <div class="page-set-wrapper">
      <el-tabs type="border-card">
        <el-tab-pane label="基础设置">
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
      inputNumberStyle: setInputNumberStyle
    }
  },
  computed: {},

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
        }
      }
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

.title-box-page {
  width: 100%;
  height: 30px;
  background-color: #333b45;
  color: #bcc9d4;
  text-align: center;
  font-size: 12px;
  line-height: 30px;
}

.page-set-wrapper {
  float: left;
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
</style>
