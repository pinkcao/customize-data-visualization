<template>
  <div class="main-select-pane">
    <div class="main-select-pane title-box">
      <h1 style="text-align: center; color: white">数据可视化</h1>
    </div>
    <div class="main-select-pane content-box">
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 我的可视化</span>
          <el-tabs :tab-position="'left'">
            <el-tab-pane label="组1">
              <div class="template-container">
                <!-- <el-row :gutter="10">
                  <el-col :span="6"> -->
                <div @click="appendTemplate" class="plus-box">
                  <i style="font-size: 40px" class="el-icon-plus"></i>
                </div>
                <!-- </el-col>
                  <el-col v-for="item in templateList" v-show="!item.disabled" :key="item.templateID" :span="6"> -->
                <div
                  v-for="item in templateList"
                  v-show="!item.disabled"
                  :key="item.templateID"
                  class="template-box"
                  @mouseenter="item.templateActive = true"
                  @mouseleave="item.templateActive = false"
                >
                  <div class="active-box" v-show="item.templateActive">
                    <div @click="clickTemplate(item.templateID)" class="icon-wrapper">
                      <i style="font-size: 100%" class="el-icon-video-play"></i>
                    </div>
                    <div @click="spliceTemplate(item.templateID)" class="icon-wrapper">
                      <i style="font-size: 100%" class="el-icon-delete"></i>
                    </div>
                  </div>
                  <div class="inactive-box" v-show="!item.templateActive"></div>
                  <div class="template-box-status-bar">
                    <span style="margin-left: 10px; font-size:10px">模板ID:{{ item.templateID }} </span>
                  </div>
                </div>
                <!-- </el-col>
                </el-row> -->
              </div>
            </el-tab-pane>
            <el-tab-pane label="组2"></el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="暂留"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      templateList: [],
      loadingInstance: null
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.getTemplateList(this.$store.state.currentUserID)
  },

  methods: {
    //从数据库获取该人的模板信息，包括模板的个数、ID，根据个数、ID生成相应的可点击的模板、点击后进入设计界面
    //当前正在修改的模板ID进入session、在修改时把session中的模板ID、用户ID作为参数与数据库交互
    clickTemplate(item) {
      // console.log(item)
      this.$store.commit('changeCurrentTemplateID', item)
      this.$router.push('/basePage')
    },
    getTemplateList() {
      this.loadingInstance = this.$loading({
        fullscreen: true,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)',
        text: '正在加载中'
      })
      this.$axios({
        url: this.$url.getTemplateList,
        method: 'get',
        params: {
          userID: this.$store.state.currentUserID
        }
      }).then(res => {
        // console.log(res.data)
        if (res.status == 200) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].templateActive = false
          }
          this.templateList = res.data
          console.log(this.templateList)
          this.loadingInstance.close()
        }
      })
    },
    appendTemplate() {
      this.loadingInstance = this.$loading({
        fullscreen: true,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)',
        text: '添加中'
      })
      this.$axios({
        url: this.$url.appendTemplate,
        method: 'post',
        data: {
          userID: this.$store.state.currentUserID
        }
      }).then(res => {
        if (res.status == 200) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].templateActive = false
          }
          this.templateList = res.data
          this.loadingInstance.close()
        }
      })
    },
    spliceTemplate(templateID) {
      let message = '确定删除吗'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          this.loadingInstance = this.$loading({
            fullscreen: true,
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)',
            text: '删除中'
          })
          this.$axios({
            url: this.$url.spliceTemplate,
            method: 'post',
            data: {
              userID: this.$store.state.currentUserID,
              templateID: templateID
            }
          }).then(res => {
            if (res.status == 200) {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].templateActive = false
              }
              this.templateList = res.data
              this.loadingInstance.close()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less">
@boxheight: 150px;
@boxwidth: 200px;
@boxtop: 120px;
@boxrest: @boxheight - @boxtop;

.main-select-pane {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #030e24;
  width: 100%;
  height: 100%;
}

.main-select-pane.title-box {
  // width: 80%;
  // height: 20%;
  flex-grow: 1;
  background-color: #0d0f12;
  // margin: 10px;
  // border: 5px solid @cyan-10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: 15vh;
}

.main-select-pane.content-box {
  // border: 5px solid @cyan-10;
  display: inline;
  // flex-direction: row;
  // width: 100%;
  // height: 80%;
  flex-grow: 4;
  background-color: #010101;
  margin: 0px;
  overflow-y: scroll;
  overflow-x: hidden;
  flex-basis: 85vh;
}

.template-box {
  height: @boxheight;
  width: @boxwidth;
  background-color: @cyan-10;
  // border-radius: 5px;
  border: 2px solid black;
  margin: 5px;
}

.plus-box {
  height: @boxheight;
  width: @boxwidth;
  background-color: #aaaaaa;
  margin: 5px;
  border: 1px dashed black;
  // border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plus-box:hover {
  cursor: pointer;
  background-color: #aaaaaa + @highlight;
  box-shadow: 1px 1px 1px #333333;
}

.icon-wrapper:hover {
  background-color: rgba(255, 255, 255, 0.35);
  cursor: pointer;
}

.active-box {
  height: @boxtop;
  width: @boxwidth;
  background-color: @cyan-10 + @highlight + @highlight;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 1px 1px 1px #333333;
  // border-radius: 5px;
}

.inactive-box {
  height: @boxtop;
  width: @boxwidth;
  background-color: transparent;
}

.template-box-status-bar {
  height: @boxrest;
  width: @boxwidth;
  background-color: @cyan-10 + @highlight;
  color: #ddd;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.25);
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-tabs--border-card {
  border: 0px;
  height: 100%;
  overflow: hidden;
}
.el-tabs__content {
  height: 100%;
  background-color: #191b22;
  // overflow-y: scroll;
}

.el-tabs--left,
.el-tabs--right {
  height: 100%;
  overflow: hidden;
}

.el-tab-pane {
  height: 100%;
}

.template-container {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.el-tabs--border-card > .el-tabs__header {
  background-color: #0d0f12;
}

.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #191b22;
  border: 1px solid transparent;
  color: #bbbbbb;
}

.el-tabs__item.is-active {
  color: #cccccc;
}

.el-tabs__item {
  color: #888888;
}

.el-tabs__nav.is-left {
  background-color: #191c21;
  height: 100%;
}

.el-tabs--border-card > .el-tabs__header {
  border: 0px;
}

// .el-tabs__item is-left is-active {
//   background-color: #999999;
// }
</style>
