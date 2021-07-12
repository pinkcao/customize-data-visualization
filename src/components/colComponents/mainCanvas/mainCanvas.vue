<template>
  <div @mousedown="cancelFocus" ref="target" :style="canvasStyle" @drop="appendComponentList"></div>
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
    //这里是类似一个总线，组件所有需要更新的地方全部在这里一并更新
    //当更新的是组件的zindex时，那么将会把所有的组件全部更新一遍，发送n个请求，如果是仅更新单一组件，则发送1个请求，对象为当前激活组件
    '$store.state.component.componentList': {
      handler(newval) {
        let compList = newval
        //如果是更新的zindex，那么对所有组件全部更新，发送n个请求
        if (this.$store.state.component.updateZindexFlag === true) {
          for (let i = 0; i < this.objList.length; i++) {
            for (let j = 0; j < compList.length; j++) {
              //必须是this.objList[i].component_instance获取当前VueComponent实体
              if (this.objList[i].component_instance.index === compList[j].index) {
                //深拷贝，并且将可变的data、dataSourceOptions转为String
                let dataObj = JSON.parse(JSON.stringify(compList[j]))
                dataObj.dataSource.data = JSON.stringify(dataObj.dataSource.data)
                dataObj.dataSource.dataSourceOptions = JSON.stringify(dataObj.dataSource.dataSourceOptions)
                for (let key in compList[j]) {
                  this.objList[i].set({
                    data: {
                      [key]: compList[j][key]
                    }
                  })
                }
                this.$axios({
                  url: this.$url.updateComponentBasicStatus,
                  method: 'post',
                  data: dataObj
                }).then(res => {
                  if (res.data.status == 200) {
                    //can do something but won't matter
                  }
                })
              }
            }
          }
          this.$store.dispatch('component/setUpdateZindexFlag', false)
        } else if (this.$store.state.component.componentActiveFlag === true) {
          //如果更新的是active状态，那就只更新所有组件的active状态，无请求
          for (let i = 0; i < this.objList.length; i++) {
            for (let j = 0; j < compList.length; j++) {
              if (this.objList[i].component_instance.index === compList[j].index) {
                for (let key in compList[j]) {
                  this.objList[i].set({
                    data: {
                      [key]: compList[j][key]
                    }
                  })
                }
              }
            }
          }
          this.$store.dispatch('component/resetComponentActiveFlag', false)
        } else {
          //如果是缩放之类的，仅对单组件更新的，那就是更新该组件的属性，发送1个请求
          for (let i = 0; i < this.objList.length; i++) {
            if (this.$store.state.component.activeComponentIndex === this.objList[i].component_instance.index) {
              for (let j = 0; j < compList.length; j++) {
                if (this.objList[i].component_instance.index === compList[j].index) {
                  let dataObj = JSON.parse(JSON.stringify(compList[j]))
                  dataObj.dataSource.data = JSON.stringify(dataObj.dataSource.data)
                  dataObj.dataSource.dataSourceOptions = JSON.stringify(dataObj.dataSource.dataSourceOptions)
                  for (let key in compList[j]) {
                    this.objList[i].set({
                      data: {
                        [key]: compList[j][key]
                      }
                    })
                  }
                  this.$axios({
                    url: this.$url.updateComponentBasicStatus,
                    method: 'post',
                    data: dataObj
                  }).then(res => {
                    if (res.data.status == 200) {
                      //can do something but won't matter
                    }
                  })
                  break
                }
              }
              break
            }
          }
        }
      },
      deep: true
    },
    '$store.state.template.screenDef': {
      handler(newval) {
        if (this.mountComponentssFlag) {
          // let picurl = this.$store.state.backgroundStyle.backgroundImage
          this.canvasStyle = {
            width: this.$store.state.template.screenDef[0].value + 'px',
            height: this.$store.state.template.screenDef[1].value + 'px',
            position: this.$store.state.template.position,
            transform: `scale(${this.$store.state.template.parentScale}) translate(0px, 0px)`,
            backgroundColor: this.$store.state.template.backgroundStyle.backgroundColor,
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
    '$store.state.template.parentScale': {
      handler(newval) {
        if (this.mountComponentssFlag) {
          // let picurl = this.$store.state.backgroundStyle.backgroundImage
          this.canvasStyle = {
            width: this.$store.state.template.screenDef[0].value + 'px',
            height: this.$store.state.template.screenDef[1].value + 'px',
            position: this.$store.state.template.position,
            transform: `scale(${this.$store.state.template.parentScale}) translate(0px, 0px)`,
            backgroundColor: this.$store.state.template.backgroundStyle.backgroundColor,
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
    '$store.state.template.backgroundStyle': {
      handler(newval) {
        if (this.mountComponentssFlag) {
          this.canvasStyle = {
            width: this.$store.state.template.screenDef[0].value + 'px',
            height: this.$store.state.template.screenDef[1].value + 'px',
            position: this.$store.state.template.position,
            transform: `scale(${this.$store.state.template.parentScale}) translate(0px, 0px)`,
            backgroundColor: this.$store.state.template.backgroundStyle.backgroundColor,
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
      if (this.$store.state.template.screenDefFlag == true && this.$store.state.template.backgroundStyleFlag == true) {
        return true
      }
      return false
    },
    backgroundImageUrl: function() {
      if (this.mountComponentssFlag) {
        return this.$store.state.template.backgroundStyle.backgroundImage
      }
      return ''
    },
    dataForTrans: function() {
      let tempComponentList = JSON.parse(JSON.stringify(this.componentList)) // 深拷贝当前tempList
      for (let i = 0; i < tempComponentList.length; i++) {
        tempComponentList[i].templateID = window.localStorage.getItem('templateID')
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
    initCanvasStyle() {
      if (this.$store.state.template.screenDefFlag == true) {
        this.canvasStyle = {
          width: this.$store.state.template.screenDef[0].value + 'px',
          height: this.$store.state.template.screenDef[1].value + 'px',
          position: this.$store.state.template.position,
          transform: `scale(${this.$store.state.template.parentScale}) translate(0px, 0px)`
        }
      }
    },
    //取消所有焦点
    cancelFocus(event) {
      // console.log(event)
      if (event.target == this.$refs.target) {
        this.$store.dispatch('component/setActiveComponentFalse')
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
          templateID: window.localStorage.getItem('templateID')
        }
      }).then(res => {
        if (res.status == 200) {
          for (let i = 0; i < res.data.resultSet.length; i++) {
            // console.log(res.data.resultSet[i].dataSource)
            if (
              res.data.resultSet[i].dataSource != null &&
              res.data.resultSet[i].dataSource.data != null &&
              res.data.resultSet[i].dataSource.dataSourceOptions != null
            ) {
              res.data.resultSet[i].dataSource.data = JSON.parse(res.data.resultSet[i].dataSource.data)
              res.data.resultSet[i].dataSource.dataSourceOptions = JSON.parse(
                res.data.resultSet[i].dataSource.dataSourceOptions
              )
            }
            res.data.resultSet[i].active = false
          }
          this.componentList = res.data.resultSet
          // console.log(this.componentList)
          this.$store.dispatch('component/initComponentList', res.data.resultSet)
          this.mountComponent()
          this.$emit('changeLoadingStatus', 0)
        }
      })
    },
    //增加组件至组件列表
    appendComponentList(event) {
      // console.log(event)
      //判断当前拖拽组件是否为空
      if (this.$store.state.component.componentNameToCanvas != '') {
        //保存当前this至that
        let that = this
        //基础数据
        let tempindex = 0
        let tempzindex = 0
        let finalindex = 0
        console.log(this.componentList.length)
        //前端同时计算一次index与zindex最大值
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
        //创建数据对象
        let dataObj = {
          index: finalindex,
          zindex: finalindex,
          disabled: false,
          name: this.$store.state.component.componentNameToCanvas,
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
          new Mount(getComponent(this.$store.state.component.componentNameToCanvas), {
            target: this.$refs.target,
            mode: 'append',
            props: {},
            data: dataObj,
            on: {
              //更新active状态
              updateActiveStatus(...args) {
                let params = {
                  index: args[0]
                  // componentList: that.componentList
                }
                that.$store.dispatch('component/updateActiveComponent', params)
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
                      templateID: window.localStorage.getItem('templateID')
                    }
                  })
                  .then(res => {
                    if (res.status == 200) {
                      if (res.data.resultSet) {
                        for (let i = 0; i < res.data.resultSet.length; i++) {
                          res.data.resultSet[i].dataSource.data = JSON.parse(res.data.resultSet[i].dataSource.data)
                          res.data.resultSet[i].dataSource.dataSourceOptions = JSON.parse(
                            res.data.resultSet[i].dataSource.dataSourceOptions
                          )
                        }
                        that.componentList = res.data.resultSet
                        that.$store.dispatch('component/initComponentList', res.data.resultSet)
                        console.log(that.componentList)
                      } else {
                        that.componentList = []
                        that.$store.dispatch('component/initComponentList', [])
                      }
                      for (let i = 0; i < that.objList.length; i++) {
                        if (that.objList[i].component_instance.index === index) {
                          that.objList[i].destroy()
                          that.objList.splice(i, 1)
                        }
                      }
                    }
                  })
              }
            },
            watch: {}
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
          data: {
            templateID: window.localStorage.getItem('templateID'),
            index: this.componentList.length,
            zindex: this.componentList.length,
            disabled: false,
            name: this.$store.state.component.componentNameToCanvas,
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
          this.$store.dispatch('component/initComponentList', this.componentList)
          // this.$store.dispatch('component/initActiveComponent', this.componentList)
          console.log(this.componentList)
          this.loadingInstance.close()
        })
        this.$store.dispatch('component/changeComponentNameToCanvas', '')
      }
    },
    //把初始所有在组件列表的组件挂载在当前div上
    mountComponent() {
      let currentData = this.componentList
      // console.log(this.componentList)
      let that = this
      for (let i = 0; i < currentData.length; i++) {
        let dataObj = {}
        for (let key in currentData[i]) {
          dataObj[key] = currentData[i][key]
        }
        dataObj.target = that.$refs.target
        dataObj.mode = 'design'
        dataObj.$store = that.$store
        this.objList.push(
          new Mount(getComponent(currentData[i].name), {
            //挂载的目标
            target: this.$refs.target,
            //挂载的方式，因为是新增而非重新添加根节点
            mode: 'append',
            data: dataObj,
            on: {
              //绑的事件侦听器，用于侦听当前的active情况
              updateActiveStatus(...args) {
                let params = {
                  index: args[0],
                  active: true
                }
                that.$store.dispatch('component/updateActiveComponent', params)
              },
              //调用销毁方法
              destroyComponent(...args) {
                let index = args[0]
                that
                  .$axios({
                    url: that.$url.spliceComponentList,
                    method: 'post',
                    data: {
                      index: index,
                      templateID: window.localStorage.getItem('templateID')
                    }
                  })
                  .then(res => {
                    if (res.status == 200) {
                      if (res.data.resultSet) {
                        for (let i = 0; i < res.data.resultSet.length; i++) {
                          res.data.resultSet[i].dataSource.data = JSON.parse(res.data.resultSet[i].dataSource.data)
                          res.data.resultSet[i].dataSource.dataSourceOptions = JSON.parse(
                            res.data.resultSet[i].dataSource.dataSourceOptions
                          )
                        }
                        that.componentList = res.data.resultSet
                        that.$store.dispatch('component/initComponentList', res.data.resultSet)
                        console.log(that.componentList)
                      } else {
                        that.componentList = []
                        that.$store.dispatch('component/initComponentList', [])
                      }
                      for (let i = 0; i < that.objList.length; i++) {
                        if (that.objList[i].component_instance.index === index) {
                          that.objList[i].destroy()
                          that.objList.splice(i, 1)
                        }
                      }
                    }
                  })
              }
            },
            watch: {}
          })
        )
        this.objList[i].mount()
      }
      //初始化activeComponent列表，用此列表维护每个组件的active值
      // this.$store.dispatch('component/initActiveComponent', this.componentList)
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
