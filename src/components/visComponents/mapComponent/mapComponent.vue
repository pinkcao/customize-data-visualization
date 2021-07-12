<template>
  <div v-if="!disabled" ref="testref" @keydown.delete="destroyComponent" tabindex="0">
    <vue-drag-resize-rotate
      :isActive="active"
      :preventActiveBehavior="preventActiveBehavior"
      :w="width"
      :h="height"
      :x="left"
      :y="top"
      :deg="deg"
      :z="zindex"
      :isDraggable="draggable"
      :isResizable="resizable"
      :isRotatable="rotatable"
      @resizing="resize"
      @dragging="resize"
      @rotating="rotate"
      @resizestop="updateComponentList"
      @dragstop="updateComponentList"
      @rotatestop="updateComponentList"
      :parentScaleX="parentScaleX"
      :parentScaleY="parentScaleY"
      :parentW="parentW"
      :parentH="parentH"
      :parentLimitation="parentLimitation"
      @activated="activate"
      @deactivated="onDeactivated"
    >
      <div class="container" id="container" ref="container" @click="onMouseClick" @dblclick="activateWorkflow">
        <div v-if="mode == 'design'" class="compose-button">
          <el-button @click.stop.prevent="composeMesh">绑定</el-button>
        </div>
        <div v-if="mode == 'design'" class="discompose-button">
          <el-button @click.stop.prevent="discomposeGroup">解绑</el-button>
        </div>
        <div v-if="mode == 'design'" class="load-button">
          <el-button @click.stop.prevent="exportGLTF">导出</el-button>
        </div>
        <div v-if="mode == 'design'" class="workflow-button">
          <el-button @click.stop.prevent="bindWorkflow">绑定工作流</el-button>
        </div>
        <div class="dispose-button">
          <el-button @click.stop.prevent="disposeAllMesh">dispose</el-button>
        </div>
        <div v-if="loadModelFlag" :style="progressStyle">
          <!-- <div :style="progressStyle"> -->
          <el-progress
            :width="progressWidth"
            :text-inside="true"
            :show-text="true"
            :stroke-linecap="'square'"
            :stroke-width="8"
            :percentage="loadedDataPercentage"
            type="circle"
            ref="progressBar"
          ></el-progress>
        </div>
        <!-- <div class="cancelAnimation-button">
          <el-button @click.stop.prevent="cancelAnimation">停止渲染</el-button>
        </div> -->
      </div>
    </vue-drag-resize-rotate>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import commonComponentsDef from '@components/componentsDef/commonComponentsDef.js'
import { v4 as uuidv4 } from 'uuid'

// let resMgr = new ResourceTracker()
// const track = resMgr.track.bind(resMgr)

export default {
  extends: commonComponentsDef,
  name: 'mapComponent',
  components: {},
  data() {
    return {
      //这些相当于是基础设置属性
      //如果挂载时未重新设定那么就取默认值
      preventActiveBehavior: false,
      name: 'mapComponent',
      active: false,
      disabled: false,
      width: 500,
      height: 500,
      top: 0,
      left: 0,
      parentLimitation: true,
      draggable: true,
      resizable: true,
      rotatable: false,
      index: 0,
      zindex: 0,
      mode: 'design',
      flag: false,
      title: '模型',
      subTitle: 'fake data',
      dataSource: {
        APISwitch: false
      },
      style: {},
      options: null,
      group: null,
      objects: [],
      effectFXAA: null,
      outlinePass: null,
      pixelRatio: null,
      fxaaPass: null,
      mouse: new THREE.Vector2(),
      dbmouse: new THREE.Vector2(),
      raycaster: new THREE.Raycaster(),
      selectedObjects: [],
      dbclickSelectedObjects: [],
      composer: null,
      stats: null,
      gui: null,
      animationFrame: null,
      originX: 0,
      originY: 0,
      directionalLight: null,
      ambientLight: null,
      atomicArr: [],
      groupArr: [],

      // exporter: new GLTFExporter(),
      // loader: new GLTFLoader(),
      // camera: null,
      // scene: null,
      // renderer: null,
      // mesh: null,
      // light: [],
      // controls: null,
      workflowArr: [2, 1, 3],
      workflowEnd: 0,
      workflowCount: 0,

      groupMap: new Map(),

      loadedDataPercentage: 0,
      loadModelFlag: true,
      progressWidth: 200
    }
  },
  props: {},
  computed: {
    progressStyle: function() {
      return {
        position: 'absolute',
        left: this.width / 2 - this.progressWidth / 2 + 'px',
        top: this.height / 2 - this.progressWidth / 2 + 'px',
        // width: this.width / 4 + 'px',
        // height: 200 + 'px',
        'z-index': 20001,
        'transform-origin': '50% 50%'
      }
    }
  },

  created() {},
  mounted() {
    this.flag = true
    console.log(this.index)
    this.camera = null
    this.scene = null
    this.renderer = null
    this.light = []
    this.controls = null
    this.loader = new GLTFLoader()
    // this.exporter = null
    this.init()
    if (this.renderer != null && this.$refs.container != null) {
      this.animate()
    }
    // console.log()
    // this.$refs.container.addEventListener('click', this.onMouseClick, true) //这里是选中box的监听
    // this.$refs.container.addEventListener('resize', this.onWindowResize, false) //这里是resize整个窗口的监听
    // this.$refs.container.addEventListener('dblclick', this.activateWorkflow, false)
  },
  beforeDestroy() {
    this.resetParams()
    console.log(this.renderer)
    console.log(this.scene)
    console.log(this)
    // this.$refs.container.removeEventListener('click', this.onMouseClick, true) //这里是选中box的监听
    // this.$refs.container.removeEventListener('resize', this.onWindowResize, false) //这里是resize整个窗口的监听
    // this.$refs.container.removeEventListener('dblclick', this.activateWorkflow, false)
  },
  destroyed() {
    // console.log('destroyed')
    // console.log(this.atomicArr)
    // console.log(this.loader)
  },
  watch: {
    workflowCount: function(newVal, oldVal) {
      switch (this.dbclickSelectedObjects[0].userData.workflowArr[newVal - 1]) {
        case 1:
          this.functionA()
          break
        case 2:
          this.functionB()
          break
        case 3:
          this.functionC()
          break
      }
      if (newVal > this.dbclickSelectedObjects[0].userData.workflowArr.length) {
        this.workflowCount = 0
        this.workflowEnd = 0
      }
    }
  },
  methods: {
    /**
     * 当组件被挂载时统一调用初始化方法
     * @param:
     * @returns:
     */
    init() {
      this.initScene()
      this.initCamera()
      this.initRenderer()
      // this.initGeometry()
      this.initLight()
      this.initLoader()
      this.initControls()
      this.initComposer()
      this.initStats()
    },

    /**
     * 在beforeDestroy时调用，销毁各类Mesh
     * @param:
     * @returns:
     */
    resetParams() {
      // console.log(this.animationFrame)
      window.cancelAnimationFrame(this.animationFrame)
      //dispose all current meshes
      this.disposeAllMesh()
      //dispose renderer
      this.renderer.dispose()
      this.renderer.forceContextLoss()
      this.renderer.content = null
      this.renderer = null
      //dispose composer
      this.composer.removePass(this.outlinePass)
      this.outlinePass.dispose()
      this.composer.removePass(this.fxaaPass)
      //dispose controls
      this.controls.dispose()
      this.controls = null
      //取消引用
      this.groupMap = null
      this.removeLight()
      this.light = null
      this.loader = null
      console.log('all stuffs reset')
    },
    /**
     * 初始化透视摄像机，此外还有正交摄像机
     * @param:
     * @returns:
     */
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(65, this.width / this.height, 0.1, 100)
      this.camera.position.set(-1, 1, 1)
    },

    /**
     * 初始化Scene
     * @param:
     * @returns:
     */
    initScene() {
      this.scene = new THREE.Scene()
    },
    /**
     * 初始化光源，包括平行光源与环境光源
     * @param:
     * @returns:
     */
    initLight() {
      // let directionalLight = track(new THREE.DirectionalLight(0xffffff, 2)) //平行光源
      let directionalLight = new THREE.DirectionalLight(0xffffff, 2)
      directionalLight.color.setHSL(0.1, 1, 0.95)
      directionalLight.position.set(0, 200, 200).normalize()
      this.light.push(directionalLight)

      // let ambient = track(new THREE.AmbientLight(0xffffff, 1.5)) //环境光源，提供基础亮度
      let ambient = new THREE.AmbientLight(0xffffff, 1.5)
      ambient.position.set(100, 100, 100)
      this.light.push(ambient)
      this.addLight()
    },
    /**
     * 移除所有光源
     * @param:
     * @returns:
     */
    removeLight() {
      for (let i = 0; i < this.light.length; i++) {
        this.scene.remove(this.light[i])
      }
    },
    /**
     * 将所有光源添加至Scene
     * @param:
     * @returns:
     */
    addLight() {
      for (let i = 0; i < this.light.length; i++) {
        this.scene.add(this.light[i])
      }
    },
    /**
     * 初始化渲染器
     * 切换路由时因未知原因导致renderer无法释放内存
     * @param:
     * @returns:
     */
    initRenderer() {
      // if (this.$refs.container != undefined) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      })
      // this.resetParams()
      this.renderer.shadowMap.enabled = true
      // console.log(this.renderer.getSize(new THREE.Vector2()))
      // console.log(this.$refs.container.getBoundingClientRect().width)
      // console.log(this.$refs.container.getBoundingClientRect().height)
      this.renderer.setSize(this.width, this.height)
      // console.log(this.renderer.getSize(new THREE.Vector2()))
      this.renderer.setClearColor(0xffaaaa, 1.0)
      // console.log(this.$refs.container)
      this.$refs.container.appendChild(this.renderer.domElement)
      // }
    },
    /**
     * 初始化控制器，主要用于控制camera
     * @param:
     * @returns:
     */
    initControls() {
      // if (this.renderer != null) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
      this.controls.dampingFactor = 0.2 //惯性旋转，默认0.25
      this.controls.screenSpacePanning = false
      this.controls.minDistance = 1
      this.controls.maxDistance = 1500
      this.controls.maxPolarAngle = Math.PI / 2
      //控制垂直旋转的角度
      // }
    },
    /**
     * 测试方法，创建一个box
     * 如果需要提升性能做测试，最好是采用共用材质的方式。
     * @param:
     * @returns:
     */
    initGeometry() {
      let geometry = new THREE.BoxGeometry(5, 5, 5)
      let material = new THREE.MeshNormalMaterial()
      let mesh = new THREE.Mesh(geometry, material)
      this.atomicArr.push(mesh)
      this.scene.add(mesh)
      // window.cancelAnimationFrame(this.animationFrame)
      // this.animationFrame = window.requestAnimationFrame(this.animate)
    },
    /**
     * 初始化一个GLTFLoader并加载.gltf模型
     * 我们必须了解，当前读取的是public文件夹下的模型，如果要读服务器上的模型，把地址改了即可，会有一个XHR，直接读取
     * @param:
     * @returns:
     */
    initLoader() {
      let that = this
      if (this.mode == 'design') {
        this.loader.load(
          // '/lantern/Lantern.gltf',
          '/flight_helmet/FlightHelmet.gltf',
          // '/exportTest.gltf',
          object => {
            // console.log(object)
            // console.log(object.scene)
            // console.log(object.scene.children[0].children.length)
            this.DFS(object.scene, this.atomicArr)
            for (let i = 0; i < this.atomicArr.length; i++) {
              this.atomicArr[i].userData.workflowArr = [3, 1, 2]
              if (this.atomicArr[i].userData.uuid == undefined) {
                this.atomicArr[i].userData.uuid = -1
              }
              this.scene.add(this.atomicArr[i])
            }
            let tempuuidSet = new Set()
            //初始化groupmap
            //把所有uuid丢进set里
            for (let i = 0; i < this.atomicArr.length; i++) {
              tempuuidSet.add(this.atomicArr[i].userData.uuid)
            }
            //经过去重的uuid创建为map
            tempuuidSet.delete(-1)
            for (let i of tempuuidSet) {
              this.groupMap.set(i, [])
            }
            for (let i = 0; i < this.atomicArr.length; i++) {
              if (this.atomicArr[i].userData.uuid != -1) {
                this.groupMap.get(this.atomicArr[i].userData.uuid).push(this.atomicArr[i])
              }
            }
            object.parser.cache.removeAll()
            object.parser = null
            object = null
            that.loadModelFlag = false
          },
          xhr => {
            // console.log(xhr)
            this.loadedDataPercentage = Math.ceil((xhr.loaded / xhr.total) * 100)
          },
          function(err) {
            console.log(err)
          }
        )
      }
      if (this.mode == 'preview') {
        this.loader.load(
          // '/lantern/Lantern.gltf',
          // '/flight_helmet/FlightHelmet.gltf',
          '/exportTest.gltf',
          object => {
            console.log(object)
            console.log(object.scene)
            console.log(object.scene.children.length)
            this.DFS(object.scene, this.atomicArr)
            for (let i = 0; i < this.atomicArr.length; i++) {
              this.scene.add(this.atomicArr[i])
            }
            let tempuuidSet = new Set()
            //初始化groupmap
            //把所有uuid丢进set里
            for (let i = 0; i < this.atomicArr.length; i++) {
              tempuuidSet.add(this.atomicArr[i].userData.uuid)
            }
            //经过去重的uuid创建为map
            tempuuidSet.delete(-1)
            for (let i of tempuuidSet) {
              this.groupMap.set(i, [])
            }
            for (let i = 0; i < this.atomicArr.length; i++) {
              if (this.atomicArr[i].userData.uuid != -1) {
                this.groupMap.get(this.atomicArr[i].userData.uuid).push(this.atomicArr[i])
              }
            }
            object.parser.cache.removeAll()
            object.parser = null
            object = null
            that.loadModelFlag = false
          },
          xhr => {
            this.loadedDataPercentage = Math.ceil((xhr.loaded / xhr.total) * 100)
          },
          function(err) {
            console.log(err)
          }
        )
      }
    },

    /**
     * 将修正完的模型导出
     * @param:
     * @returns:
     */
    save(blob, filename) {
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.download = filename || 'data.json'
      link.click()
    },
    saveString(text, filename) {
      this.save(new Blob([text], { type: 'text/plain' }), filename)
    },
    exportGLTF() {
      let exporter = new GLTFExporter()
      let exportArr = []
      for (let i = 0; i < this.atomicArr.length; i++) {
        exportArr.push(this.atomicArr[i])
      }
      for (let i = 0; i < this.groupArr.length; i++) {
        exportArr.push(this.groupArr[i])
      }
      let exportOptions = {
        includeCustomExtensions: true
      }
      this.removeLight()
      exporter.parse(
        this.scene,
        result => {
          console.log(result)
          this.saveString(JSON.stringify(result), `exportTest.gltf`)
          this.addLight()
        },
        exportOptions
      )
      exporter = null
    },
    /**
     * 初始化后期处理效果，包括了外边框与反锯齿
     * @param:
     * @returns:
     */
    initComposer() {
      // if (this.renderer != null) {
      this.composer = new EffectComposer(this.renderer)
      let renderPass = new RenderPass(this.scene, this.camera)
      this.fxaaPass = new ShaderPass(FXAAShader)
      const pixelRatio = this.renderer.getPixelRatio()
      this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (this.width * pixelRatio)
      this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (this.height * pixelRatio)
      this.composer.addPass(renderPass)
      this.composer.addPass(this.fxaaPass)
      this.outlinePass = new OutlinePass(new THREE.Vector2(this.width, this.height), this.scene, this.camera)
      this.outlinePass.edgeStrength = 3 //包围线浓度
      this.outlinePass.edgeGlow = 1 //边缘线范围
      this.outlinePass.edgeThickness = 1 //边缘线浓度
      this.outlinePass.pulsePeriod = 2 //包围线闪烁频率
      this.outlinePass.visibleEdgeColor.set('#00ffff') //包围线颜色
      this.outlinePass.hiddenEdgeColor.set('#190a05') //被遮挡的边界线颜色
      this.outlinePass.renderToScreen = true
      this.composer.addPass(this.outlinePass)
      // }
    },
    /**
     * 初始化性能面板，用于查看当前渲染帧率，渲染每一帧耗时，占用的内存大小
     * @param:
     * @returns:
     */
    initStats() {
      // if (this.$refs.container != undefined) {
      this.stats = new Stats()
      this.stats.domElement.style.position = 'absolute'
      this.stats.domElement.style.left = '0px'
      this.stats.domElement.style.top = '0px'
      // document.body.appendChild(this.stats.domElement)
      this.$refs.container.appendChild(this.stats.domElement)
      // }
    },

    /**
     * 更新controls与stats
     * @param:
     * @returns:
     */
    update() {
      this.controls.update()
      // if (this.mode == 'design') {
      this.stats.update()
      // }
    },
    /**
     * 以每秒60帧的速率进行渲染，将渲染的ID记录于this.animationFrame中，该项用于取消渲染
     * @param:
     * @returns:
     */
    animate() {
      this.animationFrame = window.requestAnimationFrame(this.animate)
      // console.log(this.animationFrame)
      this.render()
      this.update()
      // console.log(this.mode)
    },
    /**
     * 让渲染器与后期效果处理器渲染一帧
     * @param:
     * @returns:
     */
    render() {
      this.renderer.render(this.scene, this.camera)
      this.composer.render()
    },
    /**
     * 被调用时调整camera的尺寸与renderer渲染的尺寸范围
     * @param:
     * @returns:
     */
    onWindowResize() {
      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.width, this.height)
      this.render()
    },
    /**
     * 当鼠标在画布上点击时调用
     * @param: event
     * @returns:
     */
    onMouseClick(event) {
      console.log(this.scene)
      console.log(event.offsetX)
      console.log(this.$refs.container.getBoundingClientRect())
      this.mouse.x = (event.offsetX / (this.width * (1 / 1))) * 2 - 1
      this.mouse.y = -(event.offsetY / (this.height * (1 / 1))) * 2 + 1

      this.raycaster.setFromCamera(this.mouse, this.camera)

      let intersects = this.raycaster.intersectObjects(this.scene.children, true)

      //当选中了确切的物体时
      if (intersects.length > 0) {
        console.log(intersects)
        let tempStore = intersects[0].object
        //推回至最上层的父结点，选中最上层的这个父结点
        // while (tempStore.parent.type != 'Scene') {
        //   tempStore = tempStore.parent
        // }
        let tempuuid = tempStore.userData.uuid
        //选中的物体uuid == -1时
        if (tempuuid == -1) {
          //如果当前未选中该物体
          if (this.selectedObjects.indexOf(tempStore) < 0) {
            // let tempGroupArr = this.groupMap.get(tempuuid)
            this.selectedObjects.push(tempStore)
          }
        }
        if (tempuuid != -1) {
          //如果当前未选中该物体
          if (this.selectedObjects.indexOf(tempStore) < 0) {
            let tempGroupArr = this.groupMap.get(tempuuid)
            for (let i = 0; i < tempGroupArr.length; i++) {
              this.selectedObjects.push(tempGroupArr[i])
            }
          }
          //如果当前已选中该物体
          else if (this.selectedObjects.indexOf(tempStore) >= 0) {
          }
        }
        console.log(this.selectedObjects)
        this.outlinePass.selectedObjects = this.selectedObjects
      }

      if (intersects.length == 0) {
        console.log('nothing selected')
        this.selectedObjects = []
        this.outlinePass.selectedObjects = []
      }
    },
    /**
     * 工作流中的A
     * @param:
     * @returns:
     */
    functionA() {
      console.log('now is functionA working')
      this.workflowCount += 1
    },
    /**
     * 工作流中的B
     * @param:
     * @returns:
     */
    functionB() {
      console.log('now is functionB working')
      this.workflowCount += 1
    },
    /**
     * 工作流中的C
     * @param:
     * @returns:
     */
    functionC() {
      console.log('now is functionC working')
      this.workflowCount += 1
    },
    /**
     * 鼠标双击触发被选中的mesh已被绑定的工作流
     * @param:event
     * @returns:
     */
    activateWorkflow(event) {
      this.dbmouse.x = (event.offsetX / (this.width * (1 / 1))) * 2 - 1
      this.dbmouse.y = -(event.offsetY / (this.height * (1 / 1))) * 2 + 1

      this.raycaster.setFromCamera(this.dbmouse, this.camera)

      let intersects = this.raycaster.intersectObjects(this.scene.children, true)

      //当双击了确切的物体时
      this.dbclickSelectedObjects.pop()
      if (intersects.length > 0) {
        let tempStore = intersects[0].object
        //推回至最上层的父结点，选中最上层的这个父结点
        // while (tempStore.parent.type != 'Scene') {
        //   tempStore = tempStore.parent
        // }
        if (this.dbclickSelectedObjects.indexOf(tempStore) < 0) {
          this.dbclickSelectedObjects.push(tempStore)
        }
        console.log('double clicked')
        console.log(this.dbclickSelectedObjects)
      }
      if (this.dbclickSelectedObjects.length > 0) {
        if (this.dbclickSelectedObjects[0].userData.workflowArr != undefined) {
          if (this.dbclickSelectedObjects[0].userData.workflowArr.length > 0) {
            this.workflowEnd = this.dbclickSelectedObjects[0].userData.workflowArr.length
            this.workflowCount += 1
          }
        }
      }
    },
    /**
     * 把需要组合的mesh的userData.uuid赋为同一值，通过该值将所有的mesh联系起来，此处的uuid是 组的唯一标识符
     * @param:
     * @returns:
     */
    composeMesh() {
      console.log(this.selectedObjects)
      //如果被选中物体有2个及以上
      if (this.selectedObjects.length > 1) {
        //新建一个group
        let tempGroup = new THREE.Group()
        //从场景中删除所有被选中的物体，将被删除的物体添加入组中
        //2021.4.6，不再删除场景中被选中的物体，转而将被选中的物体设置uuid，作为compose的结果
        let tempuuid = uuidv4()
        let tempGroupArr = []
        //浅拷贝一份当前选中的东西的引用,并且把uuid赋给每个selectedObject，解绑时把uuid赋为-1
        for (let i = 0; i < this.selectedObjects.length; i++) {
          tempGroupArr.push(this.selectedObjects[i])
          this.selectedObjects[i].userData.uuid = tempuuid
        }
        //在map中添加当前tempGroupArr，方便查找
        this.groupMap.set(tempuuid, tempGroupArr)
        // for (let i = 0; i < this.selectedObjects.length; i++) {
        //   this.atomicArr.splice(this.atomicArr.indexOf(this.selectedObjects[i]), 1)
        //   this.scene.remove(this.selectedObjects[i])
        //   tempGroup.add(this.selectedObjects[i])
        // }
        //把tempGroup添加入groupArr中，加入场景中
        // this.groupArr.push(tempGroup)
        // this.scene.add(this.groupArr[this.groupArr.length - 1])
        //把选中数组清空，边框特效清空
        this.selectedObjects = []
        this.outlinePass.selectedObjects = []
        // console.log(this.scene.children)
        // console.log(this.atomicArr)
        // console.log([this.atomicArr, ...this.groupArr])
      }
    },
    /**
     * mesh.userData.uuid 值赋为-1，解绑
     * @param:
     * @returns:
     */
    discomposeGroup() {
      //当选中的mesh是>=2个时才有删除必要
      if (this.selectedObjects.length > 1) {
        let tempSet = new Set()
        for (let i = 0; i < this.selectedObjects.length; i++) {
          tempSet.add(this.selectedObjects[i].userData.uuid)
          this.selectedObjects[i].userData.uuid = -1
        }
        for (let arruuid of tempSet) {
          this.groupMap.delete(arruuid)
        }
      }
      // console.log(this.selectedObjects)
      // console.log(this.groupArr.indexOf(this.selectedObjects[0]))
      //如果当前仅选中了一个物体，并且该物体有子元素
      // if (this.selectedObjects.length == 1 && this.selectedObjects[0].children.length > 0) {
      //   //那么这个可以被认为是group，将它从groupArr中剔除，从场景中删除
      //   this.groupArr.splice(this.groupArr.indexOf(this.selectedObjects[0]), 1)
      //   this.scene.remove(this.selectedObjects[0])
      //   //新建变量tempAtomicArr,DFS这个物体结点，把它所有叶子结点遍历添加入tempAtomicArr
      //   let tempAtomicArr = []
      //   this.DFS(this.selectedObjects[0], tempAtomicArr)
      //   this.DFS(this.selectedObjects[0], this.atomicArr)
      //   console.log(tempAtomicArr)
      //   console.log(this.atomicArr)
      //   //把它所有的叶子结点添加入场景中
      //   for (let i = 0; i < tempAtomicArr.length; i++) {
      //     this.scene.add(tempAtomicArr[i])
      //   }
      //   //清空当前选中的物体，清空边框特效
      // }
      this.selectedObjects = []
      this.outlinePass.selectedObjects = []
    },
    /**
     * 深度遍历树，把所有叶子结点添加入数组中
     * 要注意的是，常规情况下three.js已经提供了traverse方法来遍历一个Object3D中的所有children，可以通过该方法将所有children的引用添加入一个Array中
     * 但此处自己写了深度遍历方法是为了以后支持一些特殊的扩展，方便改写。
     * @param: Object,Array
     * @returns: Array
     */
    DFS(node, nodeList) {
      // console.log(node)
      if (node) {
        if (node.children.length == 0) {
          nodeList.push(node)
          // console.log(nodeList)
        }
        if (node.children.length > 0) {
          let children = node.children
          for (let i = 0; i < children.length; i++) {
            this.DFS(children[i], nodeList)
          }
        }
      }
      return nodeList
    },
    /**
     * 测试用渲染方法
     * @param:
     * @returns:
     */
    testAnimate() {
      this.animationFrame = requestAnimationFrame(this.testAnimate)
      this.renderer.render(this.scene, this.camera)
    },
    /**
     * 模拟绑定工作流
     * @param:
     * @returns:
     */
    bindWorkflow() {
      console.log(this.selectedObjects)
      //如果当前有选中东西，那么将把工作流绑给当前选中的所有东西，覆盖原有工作流
      if (this.selectedObjects.length > 0) {
        for (let i = 0; i < this.selectedObjects.length; i++) {
          this.selectedObjects[i].userData.workflowArr = this.workflowArr
        }
      }
    },
    /**
     * 测试取消渲染
     * @param:
     * @returns:
     */
    cancelAnimation() {
      window.cancelAnimationFrame(this.animationFrame)
      console.log('canceled?')
      console.log(this.renderer)
      this.renderer.dispose()
      this.renderer.forceContextLoss()
      console.log(this.renderer)
      console.log(this.renderer.getContext())
      console.log(this.renderer.info.programs.length)
      for (let i = 0; i < this.renderer.info.programs.length; i++) {
        this.renderer.info.programs[i].destroy()
      }
      // this.renderer = null
    },
    /**
     * 用于销毁mesh
     * @param:
     * @returns:
     */
    disposeMesh(parent, child) {
      if (child.children.length) {
        const arr = child.children.filter(x => x)
        arr.forEach(a => {
          this.disposeMesh(child, a)
        })
      }
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        if (child.material.map) child.material.map.dispose()
        child.material.dispose()
        child.geometry.dispose()
      } else if (child.material) {
        child.material.dispose()
      }
      child.remove()
      parent.remove(child)
    },
    /**
     * 用于销毁场景中所有mesh
     * @param:
     * @returns:
     */
    disposeAllMesh() {
      console.log(this.renderer.info)
      for (let i = 0; i < this.atomicArr.length; i++) {
        this.disposeMesh(this.scene, this.atomicArr[i])
      }
      this.atomicArr = null
      this.atomicArr = []
      console.log(this.renderer.info)
    }
  }
}
</script>

<style>
.container {
  width: 100%;
  height: 100%;
}

.back-button {
  z-index: 20000;
  position: absolute;
}

.compose-button {
  z-index: 20000;
  position: absolute;
  left: 100px;
}

.discompose-button {
  z-index: 20000;
  position: absolute;
  left: 200px;
}

.load-button {
  z-index: 20000;
  position: absolute;
  left: 300px;
}

.workflow-button {
  z-index: 20000;
  position: absolute;
  left: 400px;
}

.cancelAnimation-button {
  z-index: 20000;
  position: absolute;
  left: 500px;
}

.dispose-button {
  z-index: 20000;
  position: absolute;
  left: 600px;
}
</style>
