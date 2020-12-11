<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
// import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
// import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import Stats from 'three/examples/jsm/libs/stats.module.js'
import dat from 'three/examples/js/libs/dat.gui.min.js'

export default {
  name: 'vMap',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      light: null,
      controls: null,
      options: null,
      group: null,
      objects: [],
      effectFXAA: null,
      outlinePass: null,
      loader: null,
      mouse: new THREE.Vector2(),
      raycaster: new THREE.Raycaster(),
      selectedObjects: [],
      composer: null,
      stats: null,
      originX: 0,
      originY: 0
    }
  },
  computed: {},

  created() {},
  mounted() {},
  beforeDestroy() {},

  methods: {
    init() {
      this.initcamera()
      this.initScene()
      this.initLight()
      this.initRenderer()
      this.initControls()
      // this.initGeometry();
      /*
        这个loader可以再封装，不过是从外部接数据可能需要再想想
      */
      // this.initloader(0, 0, 0)
      // this.initComposer()
      // this.initStats()
      // this.initGui()
    },
    initcamera() {
      this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 10000)
      this.camera.position.set(0, 500, 1000)
    },

    initScene() {
      this.scene = new THREE.Scene()
    },
    initLight() {
      var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3) //模拟远处类似太阳的光源
      directionalLight.color.setHSL(0.1, 1, 0.95)
      directionalLight.position.set(0, 200, 0).normalize()
      this.scene.add(directionalLight)

      var ambient = new THREE.AmbientLight(0xffffff, 1) //AmbientLight,影响整个场景的光源
      ambient.position.set(0, 0, 0)
      this.scene.add(ambient)
    },
    initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      })
      this.renderer.shadowMap.enabled = true
      this.renderer.setSize(window.innerWidth - 15, window.innerHeight - 20)
      this.renderer.setClearColor(0xffaaaa, 1.0)
      document.body.appendChild(this.renderer.domElement)
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
    },
    // initloader(x, y, z) {
    //   this.loader = new FBXLoader()
    //   this.loader.load(
    //     '/static/testbox3.FBX',
    //     object => {
    //       object.scale.multiplyScalar(1) // 缩放模型大小
    //       object.position.set(x, y, z)
    //       this.scene.add(object)
    //     },
    //     onprogress,
    //     function(err) {
    //       console.log(err)
    //     }
    //   )
    // },
    initComposer() {
      this.composer = new EffectComposer(this.renderer)
      var renderPass = new RenderPass(this.scene, this.camera)
      this.composer.addPass(renderPass)
      this.outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        this.scene,
        this.camera
      )
      this.outlinePass.edgeStrength = 5 //包围线浓度
      this.outlinePass.edgeGlow = 2 //边缘线范围
      this.outlinePass.edgeThickness = 2 //边缘线浓度
      this.outlinePass.pulsePeriod = 2 //包围线闪烁频率
      this.outlinePass.visibleEdgeColor.set('#00ffff') //包围线颜色
      this.outlinePass.hiddenEdgeColor.set('#190a05') //被遮挡的边界线颜色
      this.outlinePass.renderToScreen = true
      this.composer.addPass(this.outlinePass)
      /*
          可以加抗锯齿，但由于一些未知的原因没加成
          */
    },

    initStats() {
      this.stats = new Stats()
      this.stats.domElement.style.position = 'absolute'
      this.stats.domElement.style.left = '0px'
      this.stats.domElement.style.top = '0px'
      console.log(this.stats)
      document.body.appendChild(this.stats.domElement)
    }

    // initGui() {
    //   this.options = new (function() {
    //     this.name = ''
    //     this.ID = ''
    //   })()
    //   var gui = new dat.GUI()
    //   gui.domElement.style = 'position:absolute;top:10px;right:0px;height:600px'
    //   gui
    //     .add(this.options, 'name')
    //     .name('名称：')
    //     .listen()
    //   gui
    //     .add(this.options, 'ID')
    //     .name('ID：')
    //     .listen()
    // }
  }
}
</script>

<style lang="less"></style>
