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
        <div class="compose-button">
          <el-button @click.stop.prevent="composeMesh">绑定</el-button>
        </div>
        <div class="discompose-button">
          <el-button @click.stop.prevent="discomposeGroup">解绑</el-button>
        </div>
        <div class="load-button">
          <el-button @click.stop.prevent="exportGLTF">导出</el-button>
        </div>
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
      width: 200,
      height: 200,
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
        data: [
          ['department', '2018', '2019'],
          ['finance', 43.3, 85.8],
          ['humanResource', 83.1, 73.4],
          ['sales', 86.4, 65.2],
          ['product', 72.4, 53.9],
          ['qualityAssurance', 55.1, 66.5]
        ],
        dataSourceOptions: [
          {
            value: 'APISource',
            label: 'API数据源'
          },
          {
            value: 'otherSource',
            label: 'unknown'
          }
        ],
        dataSourceType: '',
        APISwitch: false,
        APIURL: '',
        APIMethod: '',
        APIInterval: 10000,
        APIHeader: '',
        IntervalID: 0 //用于存储setInterval的ID，便于clearInterval
      },
      style: {
        opacity: 1,
        legendvis: true,
        titlevis: true
      },
      options: null,
      group: null,
      objects: [],
      effectFXAA: null,
      outlinePass: null,
      pixelRatio: null,
      fxaaPass: null,
      loader: new GLTFLoader(),
      exporter: new GLTFExporter(),
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

      // workflowArr: [
      //   [0, 2, 0],
      //   [1, 0, 0],
      //   [0, 0, 3]
      // ]
      workflowArr: [2, 1, 3],
      workflowEnd: 0,
      workflowCount: 0,

      groupMap: new Map()
    }
  },
  props: {},
  computed: {},

  created() {},
  mounted() {
    this.flag = true
    this.camera = null
    this.scene = null
    this.renderer = null
    this.mesh = null
    this.light = []
    this.controls = null
    this.init()
    this.animate()
    // console.log(uuidv4())
    // this.$refs.container.addEventListener('click', this.onMouseClick, true) //这里是选中box的监听
    // this.$refs.container.addEventListener('resize', this.onWindowResize, false) //这里是resize整个窗口的监听
    // this.$refs.container.addEventListener('dblclick', this.activateWorkflow, false)
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this.animationFrame)
    this.resetParams()
    // window.removeEventListener('click', this.onMouseClick, false) //这里是选中box的监听
    // window.removeEventListener('resize', this.onWindowResize, false) //这里是resize整个窗口的监听
    // window.removeEventListener('dblclick', this.activateWorkflow, false)
    // this.$refs.container.removeEventListener('click', this.onMouseClick, true) //这里是选中box的监听
    // this.$refs.container.removeEventListener('resize', this.onWindowResize, false) //这里是resize整个窗口的监听
    // this.$refs.container.removeEventListener('dblclick', this.activateWorkflow, false)
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

    resetParams() {
      this.renderer.dispose()
      this.renderer.forceContextLoss()
      // this.renderer.context = null
      this.renderer.domElement = null
      this.renderer = null
      console.log('all stuffs reset')
    },

    initCamera() {
      this.camera = new THREE.PerspectiveCamera(65, this.width / this.height, 0.1, 10000)
      this.camera.position.set(5, 5, 10)
    },

    initScene() {
      this.scene = new THREE.Scene()
    },
    initLight() {
      let directionalLight = new THREE.DirectionalLight(0xffffff, 0.3) //平行光源
      directionalLight.color.setHSL(0.1, 1, 0.95)
      directionalLight.position.set(0, 200, 0).normalize()
      this.light.push(directionalLight)

      let ambient = new THREE.AmbientLight(0xffffff, 1) //环境光源，提供基础亮度
      ambient.position.set(100, 100, 100)
      this.light.push(ambient)
      this.addLight()
    },
    removeLight() {
      for (let i = 0; i < this.light.length; i++) {
        this.scene.remove(this.light[i])
      }
    },
    addLight() {
      for (let i = 0; i < this.light.length; i++) {
        this.scene.add(this.light[i])
      }
    },
    initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      })
      // this.resetParams()
      this.renderer.shadowMap.enabled = true
      console.log(this.renderer.getSize(new THREE.Vector2()))
      // console.log(this.$refs.container.getBoundingClientRect().width)
      // console.log(this.$refs.container.getBoundingClientRect().height)
      this.renderer.setSize(this.width, this.height)
      console.log(this.renderer.getSize(new THREE.Vector2()))
      this.renderer.setClearColor(0xffaaaa, 1.0)
      // below two lines makes the FPS goes really low
      // this.renderer.gammaOutput = true
      // this.renderer.gammaFactor = 2.2
      // document.body.appendChild(this.renderer.domElement)
      // this.renderer.domElement.style = 'width:100%; height:100%'
      this.$refs.container.appendChild(this.renderer.domElement)
    },
    initControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
      this.controls.dampingFactor = 0.2 //惯性旋转，默认0.25

      this.controls.screenSpacePanning = false

      this.controls.minDistance = 1
      this.controls.maxDistance = 1500

      this.controls.maxPolarAngle = Math.PI / 2
      //控制垂直旋转的角度
    },
    initGeometry() {
      let geometry = new THREE.BoxGeometry(5, 5, 5)
      let material = new THREE.MeshNormalMaterial()
      this.mesh = new THREE.Mesh(geometry, material)
      this.scene.add(this.mesh)
      window.cancelAnimationFrame(this.animationFrame)
      this.animationFrame = window.requestAnimationFrame(this.animate)
    },
    initLoader() {
      //在design时全部mesh，在preview时带group
      if (this.mode == 'design') {
        this.loader.load(
          // '/zelda/scene.gltf',
          // '/lantern/Lantern.gltf',
          '/flight_helmet/FlightHelmet.gltf',
          // '/exportTest.gltf',
          object => {
            console.log(object)
            console.log(object.scene)
            console.log(object.scene.children[0].children.length)
            this.DFS(object.scene, this.atomicArr)
            for (let i = 0; i < this.atomicArr.length; i++) {
              this.atomicArr[i].userData.workflowArr = this.workflowArr
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
          },
          onprogress,
          function(err) {
            console.log(err)
          }
        )
      }
      if (this.mode == 'preview') {
        this.loader.load(
          // '/zelda/scene.gltf',
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
          },
          onprogress,
          function(err) {
            console.log(err)
          }
        )
      }
    },
    save(blob, filename) {
      var link = document.createElement('a')
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.download = filename || 'data.json'
      link.click()
    },
    saveString(text, filename) {
      this.save(new Blob([text], { type: 'text/plain' }), filename)
    },
    // OnExportGLTF() {
    //   var exporter = new THREE.GLTFExporter()
    //   exporter.parse(scene3D, result => {
    //     saveString(JSON.stringify(result), `exportTest.gltf`)
    //   })
    // },
    exportGLTF() {
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
      this.exporter.parse(
        this.scene,
        result => {
          console.log(result)
          this.saveString(JSON.stringify(result), `exportTest.gltf`)
          this.addLight()
        },
        exportOptions
      )
      // this.exporter.parse(this.scene, function(result) {
      //   //这里需要一个下载gltf，或者是上传gltf至服务器的方法
      //   console.log(result)
      //   // downloadJSON(gltf)
      //   let link = document.createElement('a')
      //   link.style.display = 'none'
      //   document.body.appendChild(link)
      //   link.href = URL.createObjectURL(new Blob([JSON.stringify(result)], { type: 'text/plain' }))
      //   link.click()
      //   document.body.removeChild(link)
      //   this.addLight()
      // })
    },
    initComposer() {
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
    },

    initStats() {
      this.stats = new Stats()
      this.stats.domElement.style.position = 'absolute'
      this.stats.domElement.style.left = '0px'
      this.stats.domElement.style.top = '0px'
      console.log(this.stats)
      // document.body.appendChild(this.stats.domElement)
      this.$refs.container.appendChild(this.stats.domElement)
    },
    update() {
      this.controls.update()
      this.stats.update()
    },

    animate() {
      this.render()
      this.animationFrame = window.requestAnimationFrame(this.animate)
      // console.log(this.renderer.info)
      // console.log(this.renderer.getSize(new THREE.Vector2()))
      // console.log(this.scene)
      // console.log('wtf?')
      this.update()
      this.composer.render()
      // console.log(this.camera);
    },

    render() {
      // console.log(this.scene)
      // console.log(this.camera)
      this.renderer.render(this.scene, this.camera)
    },

    onWindowResize() {
      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.width, this.height)
      this.render()
    },

    onMouseClick(event) {
      console.log(this.scene)
      console.log(event.offsetX)
      console.log(this.$refs.container.getBoundingClientRect())
      this.mouse.x = (event.offsetX / (this.width * (1 / 1))) * 2 - 1
      this.mouse.y = -(event.offsetY / (this.height * (1 / 1))) * 2 + 1

      this.raycaster.setFromCamera(this.mouse, this.camera)

      var intersects = this.raycaster.intersectObjects(this.scene.children, true)

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
            let tempGroupArr = this.groupMap.get(tempuuid)
            this.selectedObjects.splice(this.selectedObjects.indexOf(tempStore), 1)
            for (let i = 0; i < tempGroupArr.length; i++) {
              this.selectedObjects.push(tempGroupArr[i])
            }
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
    functionA() {
      console.log('now is functionA working')
      this.workflowCount += 1
    },
    functionB() {
      console.log('now is functionB working')
      this.workflowCount += 1
    },
    functionC() {
      console.log('now is functionC working')
      this.workflowCount += 1
    },
    //双击激活工作流
    activateWorkflow(event) {
      this.dbmouse.x = (event.offsetX / (this.width * (1 / 1))) * 2 - 1
      this.dbmouse.y = -(event.offsetY / (this.height * (1 / 1))) * 2 + 1

      this.raycaster.setFromCamera(this.dbmouse, this.camera)

      var intersects = this.raycaster.intersectObjects(this.scene.children, true)

      //当双击了确切的物体时
      this.dbclickSelectedObjects.pop()
      if (intersects.length > 0) {
        let tempStore = intersects[0].object
        //推回至最上层的父结点，选中最上层的这个父结点
        while (tempStore.parent.type != 'Scene') {
          tempStore = tempStore.parent
        }
        if (this.dbclickSelectedObjects.indexOf(tempStore) < 0) {
          this.dbclickSelectedObjects.push(tempStore)
        }
        console.log('double clicked')
        console.log(this.dbclickSelectedObjects)
      }
      if (this.dbclickSelectedObjects.length > 0) {
        this.workflowEnd = this.dbclickSelectedObjects[0].userData.workflowArr.length
        this.workflowCount += 1
      }
    },
    /**
     * 把需要组合的mesh的userData.uuid赋为同一值，通过该值将所有的mesh联系起来
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
    //深度遍历树，把所有叶子结点添加入数组中
    DFS(node, nodeList) {
      // console.log(node)
      if (node) {
        if (node.children.length == 0) {
          nodeList.push(node)
          // console.log(nodeList)
        }
        if (node.children.length > 0) {
          let children = node.children
          for (var i = 0; i < children.length; i++) {
            this.DFS(children[i], nodeList)
          }
        }
      }
      return nodeList
    },
    testAnimate() {
      this.animationFrame = requestAnimationFrame(this.testAnimate)
      this.renderer.render(this.scene, this.camera)
      // console.log('test')
    },
    updateComponentList() {
      if (this.mode == 'design') {
        // console.log(this.index)
        // console.log(this.$store.state.currentTemplateID)
        this.$axios({
          url: this.$url.adjustComponent,
          method: 'post',
          data: {
            templateID: this.$store.state.currentTemplateID,
            deg: this.deg,
            index: this.index,
            width: this.width,
            height: this.height,
            top: this.top,
            left: this.left
          }
        }).then(res => {
          if (res) {
            if (res.status == 200) {
              for (let i = 0; i < res.data.resultSet.length; i++) {
                res.data.resultSet[i].dataSource.data = JSON.parse(res.data.resultSet[i].dataSource.data)
                res.data.resultSet[i].dataSource.dataSourceOptions = JSON.parse(
                  res.data.resultSet[i].dataSource.dataSourceOptions
                )
              }
              console.log(res.data.resultSet)
              this.onWindowResize()
              this.$store.commit('initComponentList', res.data.resultSet)
              this.$store.commit('resizeUpdateActiveComponent')
            }
          }
        })
      }
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
</style>
