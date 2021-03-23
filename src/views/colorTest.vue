<template>
  <!-- <div> -->
  <!-- <el-button style="float: right" icon="el-icon-close" @click="returnToBase" circle></el-button>
    <div style="display: flex; flex-direction: row; flex-wrap: wrap">
      <div class="testbox" v-for="(item, index) in colorSet" :style="item[0]" :key="index" @click="test(item)">
        <span style="font-size: 16px" :style="item[1]">测试色彩测试色彩</span>
      </div>
      <div ref="chart"></div>
    </div> -->
  <!-- <el-image :src="imgurl" :fit="'fill'"></el-image> -->
  <!-- </div> -->
  <!-- <div :style="backgroundStyle" v-if="disabled">
    <vue-drag-resize-rotate
      :isActive="active"
      :preventActiveBehavior="preventActiveBehavior"
      :w="width"
      :h="height"
      :x="left"
      :y="top"
      :z="zindex"
      :deg="style.deg"
      @resizing="resize"
      @dragging="resize"
      :parentLimitation="parentLimitation"
      :isDraggable="draggable"
      :isResizable="resizable"
      :isRotatable="true"
      @rotating="testconsole"
    >
      <div style="background-color: #555555; width: 100%; height: 100%"></div>
    </vue-drag-resize-rotate>
  </div> -->
  <div id="container">
    <div class="back-button">
      <el-button icon="el-icon-close" @click="returnToBase" circle></el-button>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
// import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
// import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import Stats from 'three/examples/jsm/libs/stats.module.js'
import dat from 'three/examples/js/libs/dat.gui.min.js'
export default {
  name: 'colorTest',
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
      gui: null,
      animationFrame: null,
      originX: 0,
      originY: 0
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.init()
    this.animate()
    window.addEventListener('click', this.onMouseClick, false) //这里是选中box的监听
    window.addEventListener('resize', this.onWindowResize, false) //这里是resize整个窗口的监听
  },
  beforeDestroy() {
    this.resetParams()
    window.removeEventListener('click', this.onMouseClick, false) //这里是选中box的监听
    window.removeEventListener('resize', this.onWindowResize, false) //这里是resize整个窗口的监听
    window.cancelAnimationFrame(this.animationFrame)
  },

  methods: {
    init() {
      this.initcamera()
      this.initScene()
      this.initLight()
      this.initRenderer()
      this.initControls()
      // this.initGeometry()
      this.initloader(0, 0, 0)
      this.initComposer()
      this.initStats()
      // this.initGui()
      // this.initEcharts();
      // this.effectFXAA = new ShaderPass(THREE.FXAAShader );
      // this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
      // this.effectFXAA.renderToScreen = true;
      // this.composer.addPass( this.effectFXAA );
    },

    resetParams() {
      // this.camera = null
      // this.scene = null
      // this.renderer = null
      // this.mesh = null
      // this.light = null
      // this.controls = null
      // this.options = null
      // this.group = null
      // this.objects = []
      // this.effectFXAA = null
      // this.outlinePass = null
      // this.loader = null
      // this.selectedObjects = []
      // this.composer = null
      // this.stats = null
      // this.originX = 0
      // this.originY = 0
      this.renderer.dispose()
      this.renderer.forceContextLoss()
      // this.renderer.context = null
      this.renderer.domElement = null
      this.renderer = null
      this.gui = null
      console.log('all stuffs reset')
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
      // document.body.appendChild(this.renderer.domElement)
      this.renderer.domElement.style = 'width:100%; height:100%'
      document.getElementById('container').appendChild(this.renderer.domElement)
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
    initloader(x, y, z) {
      // this.loader = new FBXLoader()
      this.loader = new GLTFLoader()
      this.loader.load(
        '/viking_room/scene.gltf',
        object => {
          console.log(object)
          // object.scale.multiplyScalar(1) // 缩放模型大小
          // object.position.set(x, y, z)
          // this.scene.add(object)
          this.scene.add(object.scene)
        },
        onprogress,
        function(err) {
          console.log(err)
        }
      )
    },
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
      // document.body.appendChild(this.stats.domElement)
      document.getElementById('container').appendChild(this.stats.domElement)
    },

    initGui() {
      this.options = new (function() {
        this.name = ''
        this.ID = ''
      })()
      this.gui = new dat.GUI()
      this.gui.domElement.style = 'position:absolute;top:0px;right:0px;height:600px'
      this.gui
        .add(this.options, 'name')
        .name('名称：')
        .listen()
      this.gui
        .add(this.options, 'ID')
        .name('ID：')
        .listen()
      // gui.add(options, 'test3').name("test3：").listen();
      // gui.add(options, 'test4').name("test4：").listen();//全部listen，可能性能开销有点大?
    },
    update() {
      this.controls.update()
      this.stats.update()
    },

    animate() {
      this.animationFrame = requestAnimationFrame(this.animate)
      this.render()
      this.composer.render()
      this.update()
      // console.log(this.camera);
    },

    render() {
      this.renderer.render(this.scene, this.camera)
    },

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(window.innerWidth, window.innerHeight)

      this.render()
    },

    onMouseClick(event) {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      this.raycaster.setFromCamera(this.mouse, this.camera)

      var intersects = this.raycaster.intersectObjects(this.scene.children, true)

      if (intersects.length > 0) {
        console.log(intersects)
        /*
            这段是找box的算法
            */
        for (var i = 0; i < intersects.length; i++) {
          // if (intersects[i].object.parent.parent != null) {
          if (intersects[i].object.name.substr(0, 4) == 'mesh') {
            // this.options.name = intersects[i].object.parent.parent.name
            // this.options.ID = intersects[i].object.parent.parent.ID
            this.selectedObjects.pop()
            this.selectedObjects.push(intersects[i].object.parent.parent)
            console.log(this.outlinePass)
            this.outlinePass.selectedObjects = this.selectedObjects //给选中的线条和物体加发光特效
            break
          }
          // }
        }
      }
    },
    returnToBase() {
      this.$router.push({ path: '/basePage' })
    }
  }
}
</script>

<style>
.testbox {
  width: 200px;
  height: 200px;
}

.back-button {
  z-index: 20000;
  position: absolute;
}
</style>
