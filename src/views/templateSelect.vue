<template>
  <div class="main-select-pane">
    <div class="main-select-pane title-box">
      <h1 style="text-align: center">这个是选择你的template的界面，根据id获取数据库的template并生成在下方可选</h1>
    </div>
    <div class="main-select-pane content-box">
      <el-row :gutter="10">
        <el-col v-for="item in templateList" v-show="!item.disabled" :key="item.templateID" :span="6">
          <div class="template-box" @mouseenter="item.templateActive = true" @mouseleave="item.templateActive = false">
            <div class="active-box" v-show="item.templateActive">
              <div @click="clickTemplate(item.templateID)" class="icon-wrapper">
                <i style="font-size: 150%" class="el-icon-video-play"></i>
              </div>
              <div @click="spliceTemplate(item.templateID)" class="icon-wrapper">
                <i style="font-size: 150%" class="el-icon-delete"></i>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div @click="appendTemplate" class="plus-box">
            <i style="font-size: 40px" class="el-icon-plus"></i>
          </div>
        </el-col>
      </el-row>
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
.main-select-pane {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #030e24;
  width: 100%;
  height: 100%;
}

.main-select-pane.title-box {
  width: 80%;
  height: 20%;
  background-color: blanchedalmond;
  margin: 50px;
  border: 5px solid rgb(49, 22, 110);
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-select-pane.content-box {
  border: 5px solid rgb(49, 22, 110);
  display: inline;
  // flex-direction: row;
  width: 80%;
  height: 55%;
  background-color: blanchedalmond;
  margin: 0px;
  overflow-y: auto;
  overflow-x: hidden;
}

.template-box {
  height: 200px;
  background-color: black;
  border-radius: 5px;
  margin: 5px;
}

.plus-box {
  height: 200px;
  background-color: transparent;
  margin: 5px;
  border: 1px dashed black;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plus-box:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.2);
}

.icon-wrapper:hover {
  background-color: rgba(255, 255, 255, 0.35);
  cursor: pointer;
}

.active-box {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.25);
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
