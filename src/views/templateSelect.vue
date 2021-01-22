<template>
  <div class="main-select-pane">
    <div class="main-select-pane title-box">
      <h1 style="text-align: center">这个是选择你的template的界面，根据id获取数据库的template并生成在下方可选</h1>
    </div>
    <div class="main-select-pane content-box">
      <el-row :gutter="10">
        <el-col v-for="item in testList" :key="item" :span="6">
          <div style="height: 200px; background-color: black; margin:5px" @click="clickTemplate(item)"></div>
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
      testList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    }
  },
  computed: {},
  created() {},
  mounted() {},

  methods: {
    //从数据库获取该人的模板信息，包括模板的个数、ID，根据个数、ID生成相应的可点击的模板、点击后进入设计界面
    //当前正在修改的模板ID进入session、在修改时把session中的模板ID、用户ID作为参数与数据库交互
    clickTemplate(item) {
      console.log(item)
      this.$router.push('/basePage')
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

.main-select-pane.content-box:hover {
  cursor: pointer;
}
</style>
