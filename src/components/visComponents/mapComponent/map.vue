<template>
  <div class="container" id="container" ref="container">
    <div class="compose-button">
      <el-button @click.stop.prevent="composeMesh">绑定</el-button>
    </div>
    <div class="discompose-button">
      <el-button @click.stop.prevent="discomposeGroup">解绑</el-button>
    </div>
    <div class="load-button">
      <el-button @click.stop.prevent="initGeometry">加mesh</el-button>
    </div>
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
import Stats from 'three/examples/jsm/libs/stats.module.js'
export default {
  name: 'vMap',
  data() {
    return {
      //vue中，如果将scene、camera等放在data中会造成不必要的性能开销
      // camera: null,
      // scene: null,
      // renderer: null,
      // mesh: null,
      // light: null,
      // controls: null,
      options: null,
      group: null,
      objects: [],
      effectFXAA: null,
      outlinePass: null,
      pixelRatio: null,
      fxaaPass: null,
      loader: null,
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

      atomicArr: [],
      groupArr: [],

      // workflowArr: [
      //   [0, 2, 0],
      //   [1, 0, 0],
      //   [0, 0, 3]
      // ]
      workflowArr: [2, 1, 3],
      workflowEnd: 0,
      workflowCount: 0
    }
  },
  // computed: {
  //   container: function() {
  //     return this.$refs.container
  //   }
  // },
  created() {},
  mounted() {
    this.camera = null
    this.scene = null
    this.renderer = null
    this.mesh = null
    this.light = null
    this.controls = null
    // this.scene = new HREE.Scene()
    // this.camera = new THREE.PerspectiveCamera(
    //   65,
    //   this.$refs.container.getBoundingClientRect().width / this.$refs.container.getBoundingClientRect().height,
    //   0.1,
    //   10000
    // )
    // this.camera.position.set(5, 50, 100)
    // this.renderer = new THREE.WebGLRenderer()
    // this.renderer.setSize(
    //   this.$refs.container.getBoundingClientRect().width,
    //   this.$refs.container.getBoundingClientRect().height
    // )
    // this.$refs.container.appendChild(this.renderer.domElement)
    // let geometry = new THREE.BoxGeometry(50, 50, 50)
    // let material = new THREE.MeshNormalMaterial()
    // this.mesh = new THREE.Mesh(geometry, material)
    // this.scene.add(this.mesh)
    // console.log(this.animate)
    // this.testAnimate()
    this.init()
    this.animate()
    // window.cancelAnimationFrame(this.animationFrame)
    // this.animate()
    // window.addEventListener('click', this.onMouseClick, false) //这里是选中box的监听
    // window.addEventListener('resize', this.onWindowResize, false) //这里是resize整个窗口的监听
    // window.addEventListener('dblclick', this.activateWorkflow, false)
    this.$refs.container.addEventListener('click', this.onMouseClick, true) //这里是选中box的监听
    this.$refs.container.addEventListener('resize', this.onWindowResize, false) //这里是resize整个窗口的监听
    this.$refs.container.addEventListener('dblclick', this.activateWorkflow, false)
  },
  beforeDestroy() {
    this.resetParams()
    // window.removeEventListener('click', this.onMouseClick, false) //这里是选中box的监听
    // window.removeEventListener('resize', this.onWindowResize, false) //这里是resize整个窗口的监听
    window.removeEventListener('dblclick', this.activateWorkflow, false)
    this.$refs.container.removeEventListener('click', this.onMouseClick, true) //这里是选中box的监听
    this.$refs.container.removeEventListener('resize', this.onWindowResize, false) //这里是resize整个窗口的监听
    this.$refs.container.removeEventListener('dblclick', this.activateWorkflow, false)
    window.cancelAnimationFrame(this.animationFrame)
  },
  watch: {
    workflowCount: function(newVal, oldVal) {
      switch (this.dbclickSelectedObjects[0].workflowArr[newVal - 1]) {
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
      if (newVal > this.dbclickSelectedObjects[0].workflowArr.length) {
        this.workflowCount = 0
        this.workflowEnd = 0
      }
    }
  },

  //I have to announce the reason of using this.$refs.container.getBoundingClientRect().width/height is that the fucking
  //computing property is not capable of the circumstance
  methods: {
    init() {
      this.initScene()
      this.initcamera()
      this.initRenderer()
      // this.initGeometry()
      this.initLight()
      // this.initloader()
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

    initcamera() {
      this.camera = new THREE.PerspectiveCamera(
        65,
        this.$refs.container.getBoundingClientRect().width / this.$refs.container.getBoundingClientRect().height,
        0.1,
        10000
      )
      this.camera.position.set(5, 50, 100)
    },

    initScene() {
      this.scene = new THREE.Scene()
    },
    initLight() {
      var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3) //平行光源
      directionalLight.color.setHSL(0.1, 1, 0.95)
      directionalLight.position.set(0, 200, 0).normalize()
      this.scene.add(directionalLight)

      var ambient = new THREE.AmbientLight(0xffffff, 1) //环境光源，提供基础亮度
      ambient.position.set(100, 100, 100)
      this.scene.add(ambient)
    },
    initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      })
      // this.resetParams()
      this.renderer.shadowMap.enabled = true
      this.renderer.setSize(
        this.$refs.container.getBoundingClientRect().width,
        this.$refs.container.getBoundingClientRect().height
      )
      this.renderer.setClearColor(0xffaaaa, 1.0)
      // document.body.appendChild(this.renderer.domElement)
      this.renderer.domElement.style = 'width:100%; height:100%'
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
      let geometry = new THREE.BoxGeometry(50, 50, 50)
      let material = new THREE.MeshNormalMaterial()
      this.mesh = new THREE.Mesh(geometry, material)
      this.scene.add(this.mesh)
      window.cancelAnimationFrame(this.animationFrame)
      this.animationFrame = window.requestAnimationFrame(this.animate)
    },
    initloader() {
      this.loader = new GLTFLoader()
      this.loader.load(
        // '/zelda/scene.gltf',
        '/lantern/Lantern.gltf',
        object => {
          console.log(object)
          console.log(object.scene)
          console.log(object.scene.children[0].children.length)
          //大概能成，当然只是大概
          this.DFS(object.scene, this.atomicArr)
          for (let i = 0; i < this.atomicArr.length; i++) {
            this.atomicArr[i].workflowArr = this.workflowArr
            this.scene.add(this.atomicArr[i])
          }
        },
        onprogress,
        function(err) {
          console.log(err)
        }
      )
    },
    initComposer() {
      this.composer = new EffectComposer(this.renderer)
      let renderPass = new RenderPass(this.scene, this.camera)
      this.fxaaPass = new ShaderPass(FXAAShader)
      const pixelRatio = this.renderer.getPixelRatio()
      this.fxaaPass.material.uniforms['resolution'].value.x =
        1 / (this.$refs.container.getBoundingClientRect().width * pixelRatio)
      this.fxaaPass.material.uniforms['resolution'].value.y =
        1 / (this.$refs.container.getBoundingClientRect().height * pixelRatio)
      this.composer.addPass(renderPass)
      this.composer.addPass(this.fxaaPass)
      this.outlinePass = new OutlinePass(
        new THREE.Vector2(
          this.$refs.container.getBoundingClientRect().width,
          this.$refs.container.getBoundingClientRect().height
        ),
        this.scene,
        this.camera
      )
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
      // console.log(this.scene)
      // console.log('wtf?')
      this.update()
      this.composer.render()
      // console.log(this.camera);
    },

    render() {
      this.renderer.render(this.scene, this.camera)
    },

    onWindowResize() {
      this.camera.aspect =
        this.$refs.container.getBoundingClientRect().width / this.$refs.container.getBoundingClientRect().height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(
        this.$refs.container.getBoundingClientRect().width,
        this.$refs.container.getBoundingClientRect().height
      )

      this.render()
    },

    onMouseClick(event) {
      console.log(this.scene)
      console.log(event.offsetX)
      console.log(this.$refs.container.getBoundingClientRect())
      this.mouse.x = (event.offsetX / (this.$refs.container.getBoundingClientRect().width * (1 / 1))) * 2 - 1
      this.mouse.y = -(event.offsetY / (this.$refs.container.getBoundingClientRect().height * (1 / 1))) * 2 + 1

      this.raycaster.setFromCamera(this.mouse, this.camera)

      var intersects = this.raycaster.intersectObjects(this.scene.children, true)

      //当选中了确切的物体时
      if (intersects.length > 0) {
        console.log(intersects)
        let tempStore = intersects[0].object
        //推回至最上层的父结点，选中最上层的这个父结点
        while (tempStore.parent.type != 'Scene') {
          tempStore = tempStore.parent
        }
        if (this.selectedObjects.indexOf(tempStore) < 0) {
          this.selectedObjects.push(tempStore)
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
      this.dbmouse.x = (event.offsetX / (this.$refs.container.getBoundingClientRect().width * (1 / 1))) * 2 - 1
      this.dbmouse.y = -(event.offsetY / (this.$refs.container.getBoundingClientRect().height * (1 / 1))) * 2 + 1

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
        this.workflowEnd = this.dbclickSelectedObjects[0].workflowArr.length
        this.workflowCount += 1
      }
    },
    /**
     * 把mesh组合成group
     */
    composeMesh() {
      console.log(this.selectedObjects)
      //如果被选中物体有2个及以上
      if (this.selectedObjects.length > 1) {
        //新建一个group
        let tempGroup = new THREE.Group()
        //从场景中删除所有被选中的物体，将被删除的物体添加入组中
        for (let i = 0; i < this.selectedObjects.length; i++) {
          this.scene.remove(this.selectedObjects[i])
          tempGroup.add(this.selectedObjects[i])
        }
        //把tempGroup添加入groupArr中，加入场景中
        this.groupArr.push(tempGroup)
        this.scene.add(this.groupArr[this.groupArr.length - 1])
        //把选中数组清空，边框特效清空
        this.selectedObjects = []
        this.outlinePass.selectedObjects = []
        console.log(this.scene.children)
      }
    },
    /**
     * 把group中的所有元素全部解绑为mesh
     */
    discomposeGroup() {
      console.log(this.selectedObjects)
      console.log(this.groupArr.indexOf(this.selectedObjects[0]))
      //如果当前仅选中了一个物体，并且该物体有子元素
      if (this.selectedObjects.length == 1 && this.selectedObjects[0].children.length > 0) {
        //那么这个可以被认为是group，将它从groupArr中剔除，从场景中删除
        this.groupArr.splice(this.groupArr.indexOf(this.selectedObjects[0]), 1)
        this.scene.remove(this.selectedObjects[0])
        //新建变量tempAtomicArr,DFS这个物体结点，把它所有叶子结点遍历添加入tempAtomicArr
        let tempAtomicArr = []
        this.DFS(this.selectedObjects[0], tempAtomicArr)
        console.log(tempAtomicArr)
        //把它所有的叶子结点添加入场景中
        for (let i = 0; i < tempAtomicArr.length; i++) {
          this.scene.add(tempAtomicArr[i])
        }
        //清空当前选中的物体，清空边框特效
        this.selectedObjects = []
        this.outlinePass.selectedObjects = this.selectedObjects
      }
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
