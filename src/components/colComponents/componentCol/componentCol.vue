<template>
  <div :style="componentColWrapperStyle">
    <div class="title-box-comp">
      <span :style="titleStyle">组件库</span>
    </div>
    <!-- component-col-el-tab相当于wrapper,它可以解决无法覆盖ui组件样式的问题 -->
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
import { colSpanStyle } from '@common/commonStyle/compColStyle/compColStyle.js'

export default {
  name: 'componentCol',
  data() {
    return {
      name: '组件列',
      testData: 'forDragTest',
      testSonData: '',
      tabpanedata: [],
      iconstyle: 'color:aliceblue;',
      getComponentTabDataFlag: false,
      titleStyle: colSpanStyle
    }
  },
  computed: {
    componentColWrapperStyle: function() {
      let tempStyle = {}
      if (this.componentColVis == true) {
        tempStyle = {
          width: '250px',
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
    componentColVis: {
      type: Boolean,
      default: true
    }
  },
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
        url: this.$url.getComponentTabData,
        method: 'get'
      }).then(res => {
        if (res.status == 200) {
          for (let i = 0; i < res.data.length; i++) {
            // console.log(res.data[i].className)
            for (let j = 0; j < res.data[i].showData.length; j++) {
              // console.log(res.data[i].showData[j])
              for (let k = 0; k < res.data[i].showData[j].componentDetailList.length; k++) {
                res.data[i].showData[j].componentDetailList[k].picurl =
                  this.$url.basePicurl + res.data[i].showData[j].componentDetailList[k].picurl
              }
            }
          }
          console.log(res.data)
          this.$emit('changeLoadingStatus', 1)
          this.tabpanedata = res.data
          this.getComponentTabDataFlag = true
        }
      })
    },
    /*
        将拖拽元素name更新至vuex，全局保存。
      */
    dragstarttest(name) {
      this.$store.commit('changeComponentNameToCanvas', name)
      // console.log(this.$store.state.componentNameToCanvas)
    },
    dragendtest() {
      // console.log('dragends')
    }
  }
}
</script>

<style lang="less">
.title-box-comp {
  width: 100%;
  height: 30px;
  background-color: @titleBoxBackgroundColor;
  display: flex;
  align-items: center;
  justify-content: center;
}
.component-col-el-tab .el-tabs__content {
  overflow-y: scroll;
  height: 100%;
}
.component-col-el-tab .el-tabs__nav.is-left {
  background-color: #191c21;
  height: 100%;
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
