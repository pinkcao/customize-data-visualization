<template>
  <div
    @click="cancelFocus"
    ref="target"
    class="main-canvas-background"
    :style="canvasStyle"
    @drop="appendComponentList"
  ></div>
</template>

<script>
import { getComponent } from '@/components/visComponents/comMap.js'
import Mount from 'vue-mount'
import { destroy } from 'vue-mount'
import url from '@/mock/mockAPI.js'

export default {
  components: {},
  name: 'mainCanvas',
  data() {
    return {
      componentList: [],
      objList: []
    }
  },
  watch: {
    //监听vuex中的componentList属性，如果有更改则覆盖当前objList的z-index值
    '$store.state.componentList': function(newval) {
      console.log(newval)
      let compList = newval
      for (let i = 0; i < this.objList.length; i++) {
        for (let j = 0; j < compList.length; j++) {
          //必须是this.objList[i].component_instance获取当前VueComponent实体
          if (this.objList[i].component_instance.index == compList[j].index) {
            this.objList[i].set({
              data: { zindex: compList[j].zindex }
            })
          }
        }
      }
    }
  },
  computed: {
    canvasStyle: function() {
      let parentScale = this.$store.state.parentScale
      let result = {
        width: this.$store.state.colDef[0].value + 'px',
        height: this.$store.state.colDef[1].value + 'px',
        position: this.$store.state.position,
        transform: `scale(${parentScale}) translate(0px, 0px)`
      }
      console.log(result.transform)
      return result
    }
  },
  props: ['componentName'],
  created() {},
  mounted() {
    this.getComponentList()
  },
  methods: {
    cancelFocus(event) {
      if (event.target == this.$refs.target) {
        this.$store.commit('setActiveComponentFalse')
        for (let i = 0; i < this.objList.length; i++) {
          this.objList[i].set({
            data: { active: false }
          })
        }
      }
    },
    getComponentList() {
      this.$axios({
        url: url.getComponentList,
        method: 'post',
        data: {}
      }).then(res => {
        this.componentList = res.data.resultSet
        this.mountComponent()
      })
    },
    appendComponentList() {
      if (this.$store.state.componentNameToCanvas != '') {
        let that = this
        let testObj = {
          index: this.componentList.length,
          zindex: this.componentList.length,
          ifshow: true,
          name: this.$store.state.componentNameToCanvas,
          width: 300,
          height: 300,
          top: 10,
          left: 10,
          draggable: true,
          resizable: true,
          parentLimitation: true,
          active: false,
          title: 'xxx',
          subTitle: 'yyy',
          mode: 'design',
          $store: this.$store
        }
        this.objList.push(
          new Mount(getComponent(this.$store.state.componentNameToCanvas), {
            target: this.$refs.target,
            mode: 'append',
            props: {},
            data: testObj,
            on: {
              //active状态不需要更新至数据库，因为最终active状态一定是false，仅在vuex中实时更新active状态并更改objList中对象的active状态
              updateActiveStatus(...args) {
                let params = {
                  index: args[0],
                  componentList: that.componentList
                }
                that.$store.commit('updateActiveComponent', params)
                let tempActiveComponent = that.$store.state.componentActive
                for (let i = 0; i < tempActiveComponent.length; i++) {
                  for (let j = 0; j < that.objList.length; j++) {
                    if (that.componentList[j].index == i) {
                      that.objList[j].set({
                        data: { active: tempActiveComponent[i].active }
                      })
                    }
                  }
                }
              },
              destroyComponent(...args) {
                let index = args[0]
                that
                  .$axios({
                    url: url.spliceComponentList,
                    method: 'post',
                    data: {
                      index: index
                    }
                  })
                  .then(res => {
                    that.$store.commit('initComponentList', res.data.resultSet)
                    that.componentList = res.data.resultSet
                    console.log(that.componentList)
                  })
              }
            },
            watch: {
              '$store.state.componentList': {
                deep: true,
                handler(newVal, oldval, vm, mnt) {
                  if (that.$store.state.activeComponentIndex == mnt.component_instance.index) {
                    for (let i = 0; i < newVal.length; i++) {
                      if (newVal[i].index == mnt.component_instance.index) {
                        mnt.component_instance.dataSource = newVal[i].dataSource
                        mnt.component_instance.width = newVal[i].width
                        mnt.component_instance.height = newVal[i].height
                        mnt.component_instance.left = newVal[i].left
                        mnt.component_instance.top = newVal[i].top
                        that
                          .$axios({
                            url: url.updateComponentBasicStatus,
                            method: 'post',
                            data: {
                              index: mnt.component_instance.index,
                              dataSource: newVal[i].dataSource,
                              width: newVal[i].width,
                              height: newVal[i].height,
                              left: newVal[i].left,
                              top: newVal[i].top
                            }
                          })
                          .then(res => {
                            if (res.data.status == 200) {
                              mnt.component_instance.chartResize()
                            }
                          })
                        break
                      }
                    }
                  }
                }
              }
            }
          })
        )
        this.objList[this.objList.length - 1].mount()
        this.$axios({
          url: url.appendComponentList,
          method: 'post',
          //不用testobj是因为在testObj中重定向了store，会造成"Converting circular structure to JSON"的问题
          data: {
            index: this.componentList.length,
            zindex: this.componentList.length,
            ifshow: true,
            name: this.$store.state.componentNameToCanvas,
            width: 300,
            height: 300,
            top: 10,
            left: 10,
            draggable: true,
            resizable: true,
            parentLimitation: true,
            active: false,
            title: 'xxx',
            subTitle: 'yyy',
            dataSource: this.objList[this.objList.length - 1].component_instance.dataSource
          }
        }).then(res => {
          this.componentList = res.data.resultSet
          this.$store.commit('initComponentList', this.componentList)
          this.$store.commit('initActiveComponent', this.componentList)
        })
        this.$store.commit('changeComponentNameToCanvas', '')
      }
    },
    //把初始所有在组件列表的组件挂载在当前div上
    mountComponent() {
      let currentData = this.componentList
      let that = this
      for (let i = 0; i < currentData.length; i++) {
        this.objList.push(
          new Mount(getComponent(currentData[i].name), {
            //挂载的目标
            target: this.$refs.target,
            //挂载的方式，因为是n个组件，所以是用加的方式
            mode: 'append',
            data: {
              index: currentData[i].index,
              zindex: currentData[i].index,
              target: that.$refs.target,
              ifshow: currentData[i].ifshow,
              width: currentData[i].width,
              height: currentData[i].height,
              top: currentData[i].top,
              left: currentData[i].left,
              name: currentData[i].name,
              draggable: currentData[i].draggable,
              resizable: currentData[i].resizable,
              parentLimitation: currentData[i].parentLimitation,
              dataSource: currentData[i].dataSource,
              // active: currentData[i].active,
              title: currentData[i].title,
              subTitle: currentData[i].subTitle,
              $store: this.$store
              //重新挂载后无法访问到全局的this.$store,需要对$store重定向
            },
            on: {
              //绑的事件侦听器，用于侦听当前的active情况
              updateActiveStatus(...args) {
                let params = {
                  index: args[0],
                  componentList: that.componentList
                }
                that.$store.commit('updateActiveComponent', params)
                // console.log(that.$store.state.componentActive)
                let tempActiveComponent = that.$store.state.componentActive
                for (let i = 0; i < tempActiveComponent.length; i++) {
                  for (let j = 0; j < that.objList.length; j++) {
                    if (that.componentList[j].index == i) {
                      // console.log(tempActiveComponent[i].active)
                      that.objList[j].set({
                        data: { active: tempActiveComponent[i].active }
                      })
                    }
                  }
                }
              },
              //调用销毁方法，只是逻辑删除，并且如果需要可以再次mount，对象存在了objList中
              destroyComponent(...args) {
                let index = args[0]
                that
                  .$axios({
                    url: url.spliceComponentList,
                    method: 'post',
                    data: {
                      index: index
                    }
                  })
                  .then(res => {
                    that.componentList = res.data.resultSet
                    that.$store.commit('initComponentList', res.data.resultSet)
                    console.log(that.componentList)
                  })
              }
            },
            watch: {
              //当vuex的componentList更新后，更新该组件的dataSource值，并提交至后端
              '$store.state.componentList': {
                deep: true,
                handler(newVal, oldval, vm, mnt) {
                  if (that.$store.state.activeComponentIndex == mnt.component_instance.index) {
                    for (let i = 0; i < newVal.length; i++) {
                      if (newVal[i].index == mnt.component_instance.index) {
                        mnt.component_instance.dataSource = newVal[i].dataSource
                        mnt.component_instance.width = newVal[i].width
                        mnt.component_instance.height = newVal[i].height
                        mnt.component_instance.left = newVal[i].left
                        mnt.component_instance.top = newVal[i].top
                        that
                          .$axios({
                            url: url.updateComponentBasicStatus,
                            method: 'post',
                            data: {
                              index: mnt.component_instance.index,
                              dataSource: newVal[i].dataSource,
                              width: newVal[i].width,
                              height: newVal[i].height,
                              left: newVal[i].left,
                              top: newVal[i].top
                            }
                          })
                          .then(res => {
                            if (res.data.status == 200) {
                              mnt.component_instance.chartResize()
                            }
                          })
                        break
                      }
                    }
                  }
                }
              }
            }
          })
        )
        this.objList[i].mount()
      }
      //初始化activeComponent列表，用此列表维护每个组件的active值
      this.$store.commit('initActiveComponent', this.componentList)
    },
    testconsole() {
      console.log('what the hell?')
    }
  }
}
</script>

<style scoped>
/*设置坐标原点为0 0,不然transform所使用坐标系是从div正中位置 即50 50出发*/
.main-canvas-background {
  background-color: #0e2a43;
  transform-origin: 0 0;
}
</style>
