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
  <div class="container" id="container" ref="container">
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
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
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
      pixelRatio: null,
      fxaaPass: null,
      loader: null,
      mouse: new THREE.Vector2(),
      raycaster: new THREE.Raycaster(),
      selectedObjects: [],
      composer: null,
      stats: null,
      gui: null,
      animationFrame: null,
      originX: 0,
      originY: 0,

      atomicArr: []
    }
  },
  computed: {
    container: function() {
      return this.$refs.container
    }
  },
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

  //I have to announce the reason of using this.$refs.container.getBoundingClientRect().width/height is that the fucking
  //computing property is not capable of the circumstance
  methods: {
    init() {
      this.initcamera()
      this.initRenderer()
      this.initScene()
      this.initLight()
      this.initControls()
      this.initloader(0, 0, 0)
      this.initComposer()
      this.initStats()

      // this.initGui()
      // this.initEcharts();
      // this.effectFXAA = new ShaderPass(THREE.FXAAShader );
      // this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / this.$refs.container.getBoundingClientRect().width, 1 / this.$refs.container.getBoundingClientRect().height );
      // this.effectFXAA.renderToScreen = true;
      // this.composer.addPass( this.effectFXAA );
    },

    resetParams() {
      this.renderer.dispose()
      this.renderer.forceContextLoss()
      // this.renderer.context = null
      this.renderer.domElement = null
      this.renderer = null
      this.gui = null
      console.log('all stuffs reset')
    },

    initcamera() {
      this.camera = new THREE.PerspectiveCamera(
        65,
        this.$refs.container.getBoundingClientRect().width /
          this.$refs.container.getBoundingClientRect().height,
        0.1,
        10000
      )
      this.camera.position.set(0, 50, 100)
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
      ambient.position.set(0, 0, 0)
      this.scene.add(ambient)
    },
    initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      })
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
    },
    initloader(x, y, z) {
      // this.loader = new FBXLoader()
      this.loader = new GLTFLoader()
      this.loader.load(
        // '/zelda/scene.gltf',
        'lantern/Lantern.gltf',
        object => {
          console.log(object)
          console.log(object.scene)
          console.log(object.scene.children[0].children.length)
          // console.log(object.scene.children[0].children[0])
          // console.log(object.scene.children[0].children[1])
          // console.log(object.scene.children[0].children[2])
          // object.scale.multiplyScalar(1) // 缩放模型大小
          // object.position.set(x, y, z)
          // this.scene.add(object)
          // this.scene.add(object.scene)
          // this.scene.add(object.scene.children[0])
          //大概能成，当然只是大概
          this.DFS(object.scene, this.atomicArr)
          // for (let i = 0; i < object.scene.children[0].children.length; i++) {
          //   // console.log(object.scene.children[0].children[i])
          //   this.atomicArr.push(object.scene.children[0].children[i])
          // }

          // this.scene.add(this)
          for (let i = 0; i < this.atomicArr.length; i++) {
            this.scene.add(this.atomicArr[i])
          }
          // this.scene.remove()
          // for (let i = 0; i < this.atomicArr.length; i++) {
          //   this.scene.remove(this.atomicArr[i])
          // }
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
      this.camera.aspect =
        this.$refs.container.getBoundingClientRect().width /
        this.$refs.container.getBoundingClientRect().height
      this.camera.updateProjectionMatrix()
      console.log(
        this.$refs.container.getBoundingClientRect().width,
        this.$refs.container.getBoundingClientRect().height
      )
      console.log(
        this.$refs.container.getBoundingClientRect().width,
        this.$refs.container.getBoundingClientRect().height
      )
      this.renderer.setSize(
        this.$refs.container.getBoundingClientRect().width,
        this.$refs.container.getBoundingClientRect().height
      )

      this.render()
    },

    onMouseClick(event) {
      //why -1 +1? 我当时为什么这么写的?
      this.mouse.x = (event.clientX / this.$refs.container.getBoundingClientRect().width) * 2 - 1
      this.mouse.y = -(event.clientY / this.$refs.container.getBoundingClientRect().height) * 2 + 1

      this.raycaster.setFromCamera(this.mouse, this.camera)

      var intersects = this.raycaster.intersectObjects(this.scene.children, true)

      //当选中了确切的物体时
      if (intersects.length > 0) {
        console.log(intersects)
        /*
            这段是找box的算法
            */
        // for (var i = 0; i < intersects.length; i++) {
        //   // if (intersects[i].object.parent.parent != null) {
        //   // if (intersects[i].object.name.substr(0, 4) == 'mesh') {
        //   // this.options.name = intersects[i].object.parent.parent.name
        //   // this.options.ID = intersects[i].object.parent.parent.ID
        //   this.selectedObjects.pop()
        //   this.selectedObjects.push(intersects[i].object)
        //   console.log(this.outlinePass)
        //   this.outlinePass.selectedObjects = this.selectedObjects //给选中的线条和物体加发光特效
        //   // break
        //   // }
        //   // }
        // }
        // this.selectedObjects.pop()
        if (this.selectedObjects.indexOf(intersects[0].object) < 0) {
          this.selectedObjects.push(intersects[0].object)
        }
        console.log(this.selectedObjects)
        this.outlinePass.selectedObjects = this.selectedObjects
      }

      if (intersects.length == 0) {
        console.log('nothing selected')
        this.selectedObjects = []
        this.outlinePass.selectedObjects = this.selectedObjects
      }
    },
    returnToBase() {
      this.$router.push({ path: '/basePage' })
    },
    DFS(node, nodeList) {
      if (node) {
        if (node.children.length == 0) {
          nodeList.push(node)
        }
        let children = node.children
        for (var i = 0; i < children.length; i++) {
          this.DFS(children[i], nodeList)
        }
      }
      return nodeList
    }
    // meshNotInArray(mesh, meshArr) {
    //   for (let i = 0; i < meshArr.length; i++) {
    //     // console.log(mesh.uuid)
    //     // console.log(meshArr[i].uuid)
    //     if (mesh.uuid == meshArr[i].uuid) {
    //       return false
    //     }
    //   }
    //   return true
    // }
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
</style>
