<template>
  <div style="width: 100%；height: 100%">
    <div class="title-box-page">页面设置</div>
    <div class="page-set-container">
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
    </div>
  </div>
</template>

<script>
import { setSpanStyle, setInputNumberStyle } from '../../commonStyle/setColStyle/setColStyle.js'

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
    initCol() {
      this.colDef = this.$store.state.colDef
    },
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
  color: #dddddd;
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
  float: left;
}

.page-set-container input {
  background-color: #222222;
  border-radius: 0px;
  border: 1px solid #333333;
}
</style>
