<template>
  <div style="width: 100%; height: 100%">
    <!-- 这里继承的是200px,100vh - 50px -->
    <div class="title-box-comp">
      <span style="color: #b3c0d1; font-size: 12px">组件库</span>
    </div>
    <!-- component-col-el-tab相当于wrapper,它可以解决无法覆盖ui组件的问题 -->
    <div class="component-col-el-tab" style="height: calc(100vh - 80px)">
      <el-tabs tab-position="left" style="width: 100%; height: calc(100vh - 80px)">
        <el-tab-pane v-for="(data, index) in tabpanedata" :key="index">
          <span slot="label"><i :style="iconstyle" :class="data.className"></i></span>
          <div v-for="(data2, index2) in data.showData" :key="index2" class="collapse-panel">
            <div class="collapse-panel-header" @click="data2.vshow = !data2.vshow">
              <span style="font-size: 12px; margin-left: 20px">
                {{ data2.text }}
              </span>
            </div>
            <!-- 用于过渡效果的组件 -->
            <el-collapse-transition>
              <div v-show="data2.vshow">
                <div class="collapse-panel-main">
                  <div class="collapse-panel-main-content">
                    <div
                      style="
                        width: 100%;
                        height: 90px;
                        background-color: #557788;
                        margin: 2px;
                        display: flex;
                        flex-direction: column;
                      "
                      v-for="(data3, index3) in data2.componentDetailList"
                      :key="index3"
                      draggable="true"
                      @dragstart="dragstarttest(data3.componentName)"
                    >
                      <div style="width: 100%; height: 20px; background-color: #212326">
                        <span style="color: #dddddd">{{ data3.title }}</span>
                      </div>
                      <div style="flex: 1">
                        <el-image style="width: 100%; height: 70px" :src="data3.picurl" :fit="'fill'"></el-image>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import url from '@mock/mockAPI.js'
// import { getTabPaneData } from './compColAPI.js'

export default {
  name: 'componentCol',
  data() {
    return {
      name: '组件列',
      testData: 'forDragTest',
      testSonData: '',
      tabpanedata: [],
      iconstyle: 'color:aliceblue;',
      getComponentTabDataFlag: false
    }
  },
  computed: {},

  created() {},
  mounted() {
    this.getTabPaneData()
    //下面这段是测试传入sql语句，后端执行的代码
    // this.$axios({
    //   url: 'http://localhost:8080/testsql',
    //   method: 'post',
    //   params: {
    //     sql: 'select * from componentdetail'
    //   }
    // }).then(res => {
    //   console.log(res)
    // })
  },

  methods: {
    //获取TabPaneData
    getTabPaneData() {
      this.$axios({
        url: url.getComTabData,
        // url: 'http://localhost:8080/componentTabData/getAll',
        // method: 'get',
        method: 'post',
        params: {}
      }).then(res => {
        console.log(res)
        this.tabpanedata = res.data.resultSet
        //无用block
        for (let i = 0; i < this.tabpanedata.length; i++) {
          console.log(this.tabpanedata[i].showData)
          for (let j = 0; j < this.tabpanedata[i].showData.length; j++) {
            console.log(this.tabpanedata[i].showData[j])
            for (let k = 0; k < this.tabpanedata[i].showData[j].componentDetailList.length; k++) {
              console.log(this.tabpanedata[i].showData[j].componentDetailList[k].picurl)
            }
          }
        }

        // if (res.status == 200) {
        //   for (let i = 0; i < res.data.length; i++) {
        //     console.log(res.data[i].className)
        //     for (let j = 0; j < res.data[i].showData.length; j++) {
        //       // console.log(res.data[i].showData[j])
        //       for (let k = 0; k < res.data[i].showData[j].componentDetailList.length; k++) {
        //         // console.log(url.basePicurl + res.data[i].showData[j].componentDetailList[k].picurl)
        //         res.data[i].showData[j].componentDetailList[k].picurl =
        //           url.basePicurl + res.data[i].showData[j].componentDetailList[k].picurl
        //       }
        //     }
        //   }
        //   this.tabpanedata = res.data
        //   this.getComponentTabDataFlag = true
        // }
      })
    },
    dragstarttest(name) {
      this.$store.commit('changeComponentNameToCanvas', name)
      console.log(this.$store.state.componentNameToCanvas)
      /*
        将拖拽元素name更新至vuex，全局保存。
      */
    },
    dragendtest() {
      console.log('dragends')
    }
  }
}
</script>

<style lang="less">
@titleboxpadding: 10px;
@width: 250px;

.title-box-comp {
  padding: @titleboxpadding;
  width: @width - @titleboxpadding - @titleboxpadding;
  height: 30px - @titleboxpadding - @titleboxpadding;
  background-color: #333b45;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.component-col-el-tab .el-tabs__content {
  overflow-y: scroll;
  height: 100%;
}
.component-col-el-tab .el-tabs__nav.is-left {
  background-color: #191c21;
  height: 100%;
}
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  box-shadow: 10px 10px 5px #888888;
  background: #737373;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  box-shadow: 10px 10px 5px #888888;
  border-radius: 10px;
  // background: #EDEDED;
}
.component-col-el-tab .el-tabs--left .el-tabs__header.is-left {
  margin-right: 0px;
}

.collapse-panel-header {
  height: 40px;
  background-color: #42b983;
  color: #d3dce6;
  align-items: center;
  font-size: 14px;
  display: flex;
}
.collapse-panel-header:hover {
  cursor: pointer;
}
.collapse-panel {
  margin: 0;
  padding: 0;
  border: 0;
}

.collapse-panel-main-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
