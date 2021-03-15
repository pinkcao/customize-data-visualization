<template>
  <div @click="cancelFocus" ref="target" :style="canvasStyle" @drop="appendComponentList"></div>
</template>

<script>
import { getComponent } from '@components/visComponents/comMap.js'
import Mount from 'vue-mount'

export default {
  components: {},
  name: 'mainCanvas',
  data() {
    return {
      componentList: [],
      objList: [],
      canvasStyle: {},
      loadingInstance: null,
      mainCanvasBackgroundStyle: {
        backgroundColor: '#0e2a43',
        transformOrigin: '0 0',
        marginTop: '10px',
        marginLeft: '10px'
      }
    }
  },
  beforeDestroy() {
    // console.log('test')
    //在切换路由或是销毁该组件时把所有子组件手动销毁
    for (let i = 0; i < this.objList.length; i++) {
      this.objList[i].destroy()
    }
  },
  watch: {
    //监听vuex中的componentList属性，如果有更改则覆盖当前objList的z-index值
    '$store.state.componentList': {
      handler(newval) {
        let compList = newval
        console.log(newval)
        for (let i = 0; i < this.objList.length; i++) {
          for (let j = 0; j < compList.length; j++) {
            //必须是this.objList[i].component_instance获取当前VueComponent实体
            if (this.objList[i].component_instance.index == compList[j].index) {
              this.objList[i].set({
                data: {
                  zindex: compList[j].zindex,
                  width: compList[j].width,
                  height: compList[j].height,
                  top: compList[j].top,
                  left: compList[j].left,
                  deg: compList[j].deg,
                  disabled: compList[j].disabled
                }
              })
            }
          }
        }
      },
      deep: true
    },
    '$store.state.screenDef': {
      handler(newval) {
        if (this.mountComponentssFlag) {
          // let picurl = this.$store.state.backgroundStyle.backgroundImage
          this.canvasStyle = {
            width: this.$store.state.screenDef[0].value + 'px',
            height: this.$store.state.screenDef[1].value + 'px',
            position: this.$store.state.position,
            transform: `scale(${this.$store.state.parentScale}) translate(0px, 0px)`,
            backgroundColor: this.$store.state.backgroundStyle.backgroundColor,
            backgroundImage: `url(${this.backgroundImageUrl})`,
            transformOrigin: this.mainCanvasBackgroundStyle.transformOrigin,
            marginTop: this.mainCanvasBackgroundStyle.marginTop,
            marginLeft: this.mainCanvasBackgroundStyle.marginLeft,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%'
          }
        }
      },
      deep: true
    },
    '$store.state.parentScale': {
      handler(newval) {
        if (this.mountComponentssFlag) {
          // let picurl = this.$store.state.backgroundStyle.backgroundImage
          this.canvasStyle = {
            width: this.$store.state.screenDef[0].value + 'px',
            height: this.$store.state.screenDef[1].value + 'px',
            position: this.$store.state.position,
            transform: `scale(${this.$store.state.parentScale}) translate(0px, 0px)`,
            backgroundColor: this.$store.state.backgroundStyle.backgroundColor,
            backgroundImage: `url(${this.backgroundImageUrl})`,
            transformOrigin: this.mainCanvasBackgroundStyle.transformOrigin,
            marginTop: this.mainCanvasBackgroundStyle.marginTop,
            marginLeft: this.mainCanvasBackgroundStyle.marginLeft,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%'
          }
        }
      }
    },
    '$store.state.backgroundStyle': {
      handler(newval) {
        if (this.mountComponentssFlag) {
          this.canvasStyle = {
            width: this.$store.state.screenDef[0].value + 'px',
            height: this.$store.state.screenDef[1].value + 'px',
            position: this.$store.state.position,
            transform: `scale(${this.$store.state.parentScale}) translate(0px, 0px)`,
            backgroundColor: this.$store.state.backgroundStyle.backgroundColor,
            backgroundImage: `url(${this.backgroundImageUrl})`,
            transformOrigin: this.mainCanvasBackgroundStyle.transformOrigin,
            marginTop: this.mainCanvasBackgroundStyle.marginTop,
            marginLeft: this.mainCanvasBackgroundStyle.marginLeft,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%'
          }
        }
        // console.log(this.canvasStyle)
      },
      deep: true
    },
    mountComponentssFlag: {
      handler(newVal) {
        if (newVal == true) {
          this.getComponentList()
        }
      }
    }
  },
  computed: {
    mountComponentssFlag: function() {
      if (this.$store.state.screenDefFlag == true && this.$store.state.backgroundStyleFlag == true) {
        return true
      }
      return false
    },
    backgroundImageUrl: function() {
      if (this.mountComponentssFlag) {
        return this.$store.state.backgroundStyle.backgroundImage
      }
      return ''
    },
    dataForTrans: function() {
      let tempComponentList = JSON.parse(JSON.stringify(this.componentList)) // 深拷贝当前tempList
      for (let i = 0; i < tempComponentList.length; i++) {
        tempComponentList[i].templateID = this.$store.state.currentTemplateID
        tempComponentList[i].dataSource.data = JSON.stringify(tempComponentList[i].dataSource.data)
        tempComponentList[i].dataSource.dataSourceOptions = JSON.stringify(
          tempComponentList[i].dataSource.dataSourceOptions
        )
      }
      return tempComponentList
    }
  },
  created() {},
  mounted() {
    console.log(this.canvasStyle)
    this.initCanvasStyle()
    // this.getComponentList()
  },
  methods: {
    //取消所有焦点
    initCanvasStyle() {
      if (this.$store.state.screenDefFlag == true) {
        this.canvasStyle = {
          width: this.$store.state.screenDef[0].value + 'px',
          height: this.$store.state.screenDef[1].value + 'px',
          position: this.$store.state.position,
          transform: `scale(${this.$store.state.parentScale}) translate(0px, 0px)`
        }
      }
    },
    cancelFocus(event) {
      // console.log(event)
      if (event.target == this.$refs.target) {
        this.$store.commit('setActiveComponentFalse')
        for (let i = 0; i < this.objList.length; i++) {
          this.objList[i].set({
            data: { active: false }
          })
        }
      }
    },
    //获取组件列表，维护
    getComponentList() {
      this.$axios({
        url: this.$url.getComponentList,
        method: 'get',
        params: {
          templateID: this.$store.state.currentTemplateID
        }
      }).then(res => {
        if (res.status == 200) {
          for (let i = 0; i < res.data.resultSet.length; i++) {
            res.data.resultSet[i].dataSource.data = JSON.parse(res.data.resultSet[i].dataSource.data)
            res.data.resultSet[i].dataSource.dataSourceOptions = JSON.parse(
              res.data.resultSet[i].dataSource.dataSourceOptions
            )
          }
          this.componentList = res.data.resultSet
          console.log(this.componentList)
          this.$store.commit('initComponentList', res.data.resultSet)
          this.mountComponent()
          this.$emit('changeLoadingStatus', 0)
          // this.$axios({
          //   url: this.$url.componentTrans,
          //   method: 'post',
          //   data: {
          //     componentList: this.dataForTrans
          //   }
          // }).then(res => {
          //   console.log(res.data)
          // })
        }
      })
    },
    //增加组件至组件列表
    appendComponentList(event) {
      // console.log(event)
      //判断当前拖拽组件是否为空
      if (this.$store.state.componentNameToCanvas != '') {
        //保存当前this至that
        let that = this
        //基础数据
        let tempindex = 0
        let tempzindex = 0
        let finalindex = 0
        console.log(this.componentList.length)
        if (this.componentList.length > 0) {
          for (let i = 0; i < this.componentList.length; i++) {
            if (tempindex < this.componentList[i].index) {
              tempindex = this.componentList[i].index
            }
            if (tempzindex < this.componentList[i].zindex) {
              tempzindex = this.componentList[i].zindex
            }
          }
          finalindex = tempindex > tempzindex ? tempindex + 1 : tempzindex + 1
        } else {
          finalindex = 0
        }
        let testObj = {
          index: finalindex,
          zindex: finalindex,
          disabled: false,
          name: this.$store.state.componentNameToCanvas,
          //用于指向当前鼠标指针在canvas中的位置
          left: event.offsetX,
          top: event.offsetY,
          deg: 0,
          draggable: true,
          resizable: true,
          parentLimitation: true,
          active: false,
          mode: 'design',
          $store: this.$store
        }
        //push入objList，保存每个Mount对象，便于维护，并且通过objList中的对象直接影响每个组件
        this.objList.push(
          new Mount(getComponent(this.$store.state.componentNameToCanvas), {
            target: this.$refs.target,
            mode: 'append',
            props: {},
            data: testObj,
            on: {
              //更新active状态
              //active状态不需要更新至数据库，因为最终active状态一定是false，仅在vuex中实时更新active状态并更改objList中对象的active状态
              updateActiveStatus(...args) {
                let params = {
                  index: args[0]
                  // componentList: that.componentList
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
              //删除当前组件
              destroyComponent(...args) {
                let index = args[0]
                that
                  .$axios({
                    url: that.$url.spliceComponentList,
                    method: 'post',
                    data: {
                      index: index,
                      templateID: that.$store.state.currentTemplateID
                    }
                  })
                  .then(res => {
                    if (res.status == 200) {
                      for (let i = 0; i < res.data.resultSet.length; i++) {
                        res.data.resultSet[i].dataSource.data = JSON.parse(res.data.resultSet[i].dataSource.data)
                        res.data.resultSet[i].dataSource.dataSourceOptions = JSON.parse(
                          res.data.resultSet[i].dataSource.dataSourceOptions
                        )
                      }
                      that.$store.commit('initComponentList', res.data.resultSet)
                      that.componentList = res.data.resultSet
                      console.log(that.componentList)
                    }
                  })
              }
            },
            watch: {
              //对于每个组件，均共同监视componentList，如果更新的componentIndex为自己的Index，那么更新数据源、基础属性并传至后端
              '$store.state.componentList': {
                deep: true,
                handler(newVal, oldval, vm, mnt) {
                  if (that.$store.state.activeComponentIndex == mnt.component_instance.index) {
                    for (let i = 0; i < newVal.length; i++) {
                      if (newVal[i].index == mnt.component_instance.index) {
                        mnt.component_instance.dataSource = newVal[i].dataSource
                        // mnt.component_instance.width = newVal[i].width
                        // mnt.component_instance.height = newVal[i].height
                        // mnt.component_instance.left = newVal[i].left
                        // mnt.component_instance.top = newVal[i].top
                        mnt.component_instance.title = newVal[i].title
                        mnt.component_instance.subTitle = newVal[i].subTitle
                        mnt.component_instance.style = newVal[i].style
                        let tempDataSource = JSON.parse(JSON.stringify(newVal[i].dataSource))
                        tempDataSource.data = JSON.stringify(tempDataSource.data)
                        tempDataSource.dataSourceOptions = JSON.stringify(tempDataSource.dataSourceOptions)
                        that
                          .$axios({
                            url: that.$url.updateComponentBasicStatus,
                            method: 'post',
                            data: {
                              templateID: that.$store.state.currentTemplateID,
                              index: mnt.component_instance.index,
                              dataSource: tempDataSource,
                              // width: newVal[i].width,
                              // height: newVal[i].height,
                              // left: newVal[i].left,
                              // top: newVal[i].top,
                              title: newVal[i].title,
                              subTitle: newVal[i].subTitle,
                              style: newVal[i].style
                            }
                          })
                          .then(res => {
                            if (res.data.status == 200) {
                              //do something
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
        this.loadingInstance = this.$loading({
          fullscreen: true,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.8)',
          text: '挂载中'
        })
        //设置完Mount对象，将其挂载至target
        this.objList[this.objList.length - 1].mount()
        console.log(this.objList[this.objList.length - 1])
        //挂载完毕后将其传至后端保存

        //deep copy
        // eslint-disable-next-line prettier/prettier
        let tempdataSource = JSON.parse(
          JSON.stringify(this.objList[this.objList.length - 1].component_instance.dataSource)
        )
        tempdataSource.data = JSON.stringify(tempdataSource.data)
        tempdataSource.dataSourceOptions = JSON.stringify(tempdataSource.dataSourceOptions)
        console.log(this.objList[this.objList.length - 1].component_instance.style)
        this.$axios({
          url: that.$url.appendComponentList,
          method: 'post',
          //不用testobj是因为在testObj中重定向了store，会造成"Converting circular structure to JSON"的问题
          data: {
            templateID: this.$store.state.currentTemplateID,
            index: this.componentList.length,
            zindex: this.componentList.length,
            disabled: false,
            name: this.$store.state.componentNameToCanvas,
            width: that.objList[this.objList.length - 1].component_instance.width,
            height: that.objList[this.objList.length - 1].component_instance.height,
            top: event.offsetY,
            left: event.offsetX,
            deg: 0,
            draggable: true,
            resizable: true,
            parentLimitation: true,
            active: false,
            title: that.objList[this.objList.length - 1].component_instance.title,
            subTitle: that.objList[this.objList.length - 1].component_instance.subTitle,
            dataSource: tempdataSource,
            style: this.objList[this.objList.length - 1].component_instance.style
          }
        }).then(res => {
          console.log(res.data)
          for (let i = 0; i < res.data.resultSet.length; i++) {
            res.data.resultSet[i].dataSource.data = JSON.parse(res.data.resultSet[i].dataSource.data)
            res.data.resultSet[i].dataSource.dataSourceOptions = JSON.parse(
              res.data.resultSet[i].dataSource.dataSourceOptions
            )
          }
          this.componentList = res.data.resultSet
          this.$store.commit('initComponentList', this.componentList)
          this.$store.commit('initActiveComponent', this.componentList)
          this.loadingInstance.close()
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
            //挂载的方式，因为是n个组件，所以append
            mode: 'append',
            data: {
              index: currentData[i].index,
              zindex: currentData[i].index,
              target: that.$refs.target,
              disabled: currentData[i].disabled,
              width: currentData[i].width,
              height: currentData[i].height,
              top: currentData[i].top,
              left: currentData[i].left,
              deg: currentData[i].deg,
              name: currentData[i].name,
              draggable: currentData[i].draggable,
              resizable: currentData[i].resizable,
              parentLimitation: currentData[i].parentLimitation,
              dataSource: currentData[i].dataSource,
              mode: 'design',
              // active: currentData[i].active,
              title: currentData[i].title,
              subTitle: currentData[i].subTitle,
              style: currentData[i].style,
              $store: this.$store
              //重新挂载后无法访问到全局的this.$store,需要对$store重定向
            },
            on: {
              //绑的事件侦听器，用于侦听当前的active情况
              updateActiveStatus(...args) {
                let params = {
                  index: args[0]
                  // componentList: that.componentList
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
              //事实上把disabled值改了就行
              destroyComponent(...args) {
                let index = args[0]
                that
                  .$axios({
                    url: that.$url.spliceComponentList,
                    method: 'post',
                    data: {
                      index: index,
                      templateID: that.$store.state.currentTemplateID
                    }
                  })
                  .then(res => {
                    if (res.status == 200) {
                      for (let i = 0; i < res.data.resultSet.length; i++) {
                        res.data.resultSet[i].dataSource.data = JSON.parse(res.data.resultSet[i].dataSource.data)
                        res.data.resultSet[i].dataSource.dataSourceOptions = JSON.parse(
                          res.data.resultSet[i].dataSource.dataSourceOptions
                        )
                      }
                      that.componentList = res.data.resultSet
                      that.$store.commit('initComponentList', res.data.resultSet)
                      console.log(that.componentList)
                    }
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
                        // mnt.component_instance.width = newVal[i].width
                        // mnt.component_instance.height = newVal[i].height
                        // mnt.component_instance.left = newVal[i].left
                        // mnt.component_instance.top = newVal[i].top
                        mnt.component_instance.style = newVal[i].style
                        mnt.component_instance.title = newVal[i].title
                        mnt.component_instance.subTitle = newVal[i].subTitle
                        let tempDataSource = JSON.parse(JSON.stringify(newVal[i].dataSource))
                        tempDataSource.data = JSON.stringify(tempDataSource.data)
                        tempDataSource.dataSourceOptions = JSON.stringify(tempDataSource.dataSourceOptions)
                        that
                          .$axios({
                            url: that.$url.updateComponentBasicStatus,
                            method: 'post',
                            data: {
                              templateID: that.$store.state.currentTemplateID,
                              index: mnt.component_instance.index,
                              dataSource: tempDataSource,
                              // width: newVal[i].width,
                              // height: newVal[i].height,
                              // left: newVal[i].left,
                              // top: newVal[i].top,
                              title: newVal[i].title,
                              subTitle: newVal[i].subTitle,
                              style: newVal[i].style
                            }
                          })
                          .then(res => {
                            if (res.data.status == 200) {
                              //can do something but won't matter
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
    }
  }
}
</script>

<style lang="less" scoped>
/*设置坐标原点为0 0,不然transform所使用坐标系是从div正中位置 即50 50出发*/
.main-canvas-background {
  background-color: #0e2a43;
  transform-origin: 0 0;
  margin-top: 10px;
  margin-left: 10px;
}
</style>
