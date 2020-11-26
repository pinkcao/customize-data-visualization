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
          <span slot="label"><i :style="iconstyle" :class="data.classname"></i></span>
          <div v-for="(data2, index2) in data.showData" :key="index2" class="collapse-panel">
            <div class="collapse-panel-header" @click="data2.vshow = !data2.vshow">
              <span style="font-size: 12px; margin-left: 20px">
                {{ data2.text }}
              </span>
            </div>
            <el-collapse-transition
              ><!-- 用于过渡效果的组件 -->
              <div v-show="data2.vshow">
                <div class="collapse-panel-main">
                  <div class="collapse-panel-main-content">
                    <div style="height: 500px; margin: 5px; background-color: aliceblue"></div>
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
export default {
  name: 'componentCol',
  data() {
    return {
      name: '组件列',
      testData: 'forDragTest',
      testSonData: '',
      /*
          classname:icon图标名称，通过修改classname修改图标，查看el-icon可知具体classname，如果需要添加可以到阿里的icon库
          重新添加打包发布icon库
          vshow:控制子组件位置是否显示，点击将使值取反，即控制打开关闭
          text:设置该header的名称
          components:组件库，应该有对应的图片名称、组件名、样式class，图片应被裁剪
          */
      tabpanedata: [
        {
          classname: 'el-icon-date',
          showData: [
            {
              vshow: true,
              text: 'ofctesttext1',
              componentdetail: []
            },
            {
              vshow: false,
              text: 'ofctesttext2',
              componentdetail: []
            }
          ]
        },
        {
          classname: 'el-icon-camera',
          showData: [
            {
              vshow: false,
              text: 'ofctesttext3',
              componentdetail: []
            },
            {
              vshow: false,
              text: 'ofctesttext4',
              componentdetail: []
            }
          ]
        }
      ],
      iconstyle: 'color:aliceblue;'
    }
  },
  computed: {},

  created() {},
  mounted() {},

  methods: {
    dragstarttest() {
      console.log('dragstarts')
      // this.$emit('receiveDataFromSon',this.name);
      this.$store.commit('changeComponentNameToCanvas', this.name)
      /*
          将数据更新至vuex，全局保存，不然要写的组件传值实在是太多太多了。
          */
      // console.log(this.$store.state.componentNameToCanvas);
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
}
</style>
