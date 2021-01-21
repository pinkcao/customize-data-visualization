<template>
  <div style="height: calc(100vh); overflow: hidden">
    <el-container style="height: auto">
      <el-header height="50px">
        <!-- button set -->
        <div class="head-box-left">
          <div title="图层" @click="graphclicktest" :class="graphisshown">
            <i :style="iconstyle" class="el-icon-picture"></i>
          </div>
          <div title="组件库" @click="compclicktest" :class="compisshown">
            <i :style="iconstyle" class="el-icon-box"></i>
          </div>
          <div title="页面设置" @click="pageclicktest" :class="pageisshown">
            <i :style="iconstyle" class="el-icon-setting"></i>
          </div>
        </div>

        <!-- right button set -->
        <div class="head-box-right">
          <div title="帮助" class="icon-box-right" @click="routeToColorTest">
            <i :style="iconstyle" class="el-icon-s-order"></i>
          </div>
          <div title="发布" class="icon-box-right">
            <i :style="iconstyle" class="el-icon-s-promotion"></i>
          </div>
          <div title="预览" class="icon-box-right" @click="routeToPreview">
            <i :style="iconstyle" class="el-icon-s-platform"></i>
          </div>
          <div title="快照" class="icon-box-right">
            <i :style="iconstyle" class="el-icon-camera"></i>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="auto">
          <div ref="graphCol" class="transition-box-graph">
            <graphCol> </graphCol>
          </div>
        </el-aside>
        <el-aside width="auto">
          <div ref="compCol" class="transition-box-comp">
            <componentCol @changeLoadingStatus="changeLoadingStatus" :divData="divData"></componentCol>
          </div>
        </el-aside>
        <el-main>
          <div @dragover="allowdrag" class="main-panel-wp">
            <div class="canvas-main">
              <main-canvas @changeLoadingStatus="changeLoadingStatus"> </main-canvas>
            </div>
          </div>
        </el-main>
        <el-aside width="auto">
          <div ref="pageCol" class="transition-box-page">
            <pageSet v-show="pageAndComponentFlag"> </pageSet>
            <component-set v-show="!pageAndComponentFlag"></component-set>
          </div>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import echarts from 'echarts'
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
import componentCol from '../components/colComponents/componentCol/componentCol.vue'
import graphCol from '../components/colComponents/graphCol/graphCol.vue'
import pageSet from '../components/colComponents/pageSet/pageSet.vue'
import componentSet from '../components/colComponents/componentSet/componentSet.vue'
import mainCanvas from '../components/colComponents/mainCanvas/mainCanvas.vue'
// import mockData from '../mock/mockData.js'
// import url from '@mock/mockAPI.js'

export default {
  components: {
    componentCol,
    graphCol,
    pageSet,
    mainCanvas,
    componentSet
  },
  name: 'basePage',
  data() {
    return {
      /*
          这一块都是three.js的变量，用于渲染场景，获取点击拾取后的数据
          */
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
      originY: 0,

      graphColActive: true,
      compColActive: true,
      pageColActive: true,

      divData: {},
      dataFromSon: '',
      /*
        div参数
      */
      // pageAndComponentFlag: true,
      componentsfullwidth: '250px',
      componentsemptywidth: '0px',
      pagefullwidth: '350px',
      pageemptywidth: '0px',
      graphfullwidth: '200px',
      graphemptywidth: '0px',
      iconstyle: 'color:aliceblue;',

      loadingStatus: [false, false],
      loadingInstance: null
    }
  },
  computed: {
    pageAndComponentFlag: function() {
      return this.$store.state.pageAndComponentFlag
    },
    // loadingStatus() {
    //   return this.$store.state.loadingStatus
    // },
    graphisshown: function() {
      return {
        'icon-box-left': this.graphColActive,
        'icon-box-left-hide': !this.graphColActive
      }
    },

    compisshown: function() {
      return {
        'icon-box-left': this.compColActive,
        'icon-box-left-hide': !this.compColActive
      }
    },

    pageisshown: function() {
      return {
        'icon-box-left': this.pageColActive,
        'icon-box-left-hide': !this.pageColActive
      }
    }
  },

  beforeCreate() {},
  created() {},
  mounted() {
    /*
      初始化width保证立即响应
    */
    this.initLoadingStatus()
    this.loadingInstance = this.$loading({
      fullscreen: true,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.8)',
      text: '正在加载中'
    })
    this.$refs.graphCol.style.width = this.graphfullwidth
    this.$refs.compCol.style.width = this.componentsfullwidth
    this.$refs.pageCol.style.width = this.pagefullwidth
  },
  watch: {
    '$store.state.screenDefFlag': function(newval) {
      if (newval == true) {
        this.updateColData()
      }
    }
  },
  methods: {
    findFalse(bool) {
      return bool == false
    },
    //初始化当前loadingStatus
    initLoadingStatus() {
      for (let i = 0; i < this.loadingStatus.length; i++) {
        this.loadingStatus[i] = false
      }
    },
    //更改当前loadingStatus
    changeLoadingStatus(data) {
      this.loadingStatus[data] = true
      if (this.loadingStatus.find(this.findFalse) == undefined) {
        //我悟了大师，这里以后就用来慢慢做优化时间
        setTimeout(() => {
          this.loadingInstance.close()
        }, 200)
      }
    },
    updateColData() {
      let ColData = []
      //el-main的padding-left+padding-right
      ColData.push(40)
      if (this.graphColActive == true) {
        ColData.push(parseInt(this.graphfullwidth.substring(0, this.graphfullwidth.length - 2)))
      }
      if (this.compColActive == true) {
        ColData.push(parseInt(this.componentsfullwidth.substring(0, this.componentsfullwidth.length - 2)))
      }
      if (this.pageColActive == true) {
        ColData.push(parseInt(this.pagefullwidth.substring(0, this.pagefullwidth.length - 2)))
      }
      this.$store.commit('updateCurrentColWidth', ColData)
      this.$store.commit('updateParentScale')
    },
    /*
      用于transition三个区块
    */
    graphclicktest() {
      if (this.$refs.graphCol.style.width !== this.graphfullwidth) {
        this.$refs.graphCol.style.width = this.graphfullwidth
        this.graphColActive = true
      } else {
        this.$refs.graphCol.style.width = this.graphemptywidth
        this.graphColActive = false
      }
      this.updateColData()
      // console.log(this.getColData())
    },

    compclicktest() {
      if (this.$refs.compCol.style.width !== this.componentsfullwidth) {
        this.$refs.compCol.style.width = this.componentsfullwidth
        this.compColActive = true
      } else {
        this.$refs.compCol.style.width = this.componentsemptywidth
        this.compColActive = false
      }
      this.updateColData()
    },

    pageclicktest() {
      if (this.$refs.pageCol.style.width !== this.pagefullwidth) {
        this.$refs.pageCol.style.width = this.pagefullwidth
        this.pageColActive = true
      } else {
        this.$refs.pageCol.style.width = this.pageemptywidth
        this.pageColActive = false
      }
      this.updateColData()
    },

    allowdrag(event) {
      event.preventDefault()
    },
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
      this.initloader(0, 0, 0)
      this.initComposer()
      this.initStats()
      this.initGui()
      // this.initEcharts();
      // this.effectFXAA = new ShaderPass(THREE.FXAAShader );
      // this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
      // this.effectFXAA.renderToScreen = true;
      // this.composer.addPass( this.effectFXAA );
      window.addEventListener('click', this.onMouseClick, false) //这里是选中box的监听
      window.addEventListener('resize', this.onWindowResize, false) //这里是resize整个窗口的监听
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
    initloader(x, y, z) {
      this.loader = new FBXLoader()
      this.loader.load(
        '/static/testbox3.FBX',
        object => {
          object.scale.multiplyScalar(1) // 缩放模型大小
          object.position.set(x, y, z)
          this.scene.add(object)
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
      document.body.appendChild(this.stats.domElement)
    },

    initGui() {
      this.options = new (function() {
        this.name = ''
        this.ID = ''
      })()
      var gui = new dat.GUI()
      gui.domElement.style = 'position:absolute;top:10px;right:0px;height:600px'
      gui
        .add(this.options, 'name')
        .name('名称：')
        .listen()
      gui
        .add(this.options, 'ID')
        .name('ID：')
        .listen()
      // gui.add(options, 'test3').name("test3：").listen();
      // gui.add(options, 'test4').name("test4：").listen();//全部listen，可能性能开销有点大?
    },

    initEcharts() {
      let lineChart = echarts.init(document.getElementById('main'))
      let lineoption = {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            areaStyle: {},
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      }

      lineChart.setOption(lineoption)

      let tempscene = this.scene
      lineChart.on('finished', function() {
        var infoEchart = new THREE.TextureLoader().load(lineChart.getDataURL())

        var infoEchartMaterial = new THREE.MeshBasicMaterial({
          transparent: true,
          map: infoEchart,
          side: THREE.DoubleSide
        })

        var linechartPlane = new THREE.Mesh(new THREE.PlaneGeometry(600, 400), infoEchartMaterial)
        linechartPlane.position.set(-600, 400, 0)
        console.log(tempscene)
        tempscene.add(linechartPlane)
      })
      console.log(this.scene)
    },

    update() {
      this.controls.update()
      this.stats.update()
    },

    animate() {
      requestAnimationFrame(this.animate)
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

      this.renderer.setSize(window.innerWidth - 15, window.innerHeight - 20)

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
          if (intersects[i].object.parent.parent != null) {
            if (intersects[i].object.parent.parent.name.substr(0, 4) == 'cbox') {
              this.options.name = intersects[i].object.parent.parent.name
              this.options.ID = intersects[i].object.parent.parent.ID
              this.selectedObjects.pop()
              this.selectedObjects.push(intersects[i].object.parent.parent)
              console.log(this.outlinePass)
              this.outlinePass.selectedObjects = this.selectedObjects //给选中的线条和物体加发光特效
              break
            }
          }
        }
      }
    },
    routeToPreview() {
      this.$router.push({ path: '/preview' })
    },
    routeToColorTest() {
      this.$router.push({ path: '/colorTest' })
    }
  }
}
</script>

<style lang="less">
body {
  margin: 0px auto;
  padding: 0px;
}

@selectedcolor: #2681ff;
@notselectedcolor: #303640;
@highlight: #101010;
@headerheight: 50px;
@asideheight: calc(100vh - @headerheight);
@graphwidth: 200px;
@compwidth: 250px;
@pagewidth: 350px;

.el-header,
.el-footer {
  background-color: #1d1e1f;
  color: #333;
  text-align: center;
  height: @headerheight;
  line-height: 60px;
}

.el-aside {
  background-color: #1d2127;
  color: #333;
  text-align: center;
  border: 0;
  margin: 0;
  padding: 0;
  border-left: #000000 1px solid;
}

.el-main {
  background-color: #2a2e33;
  color: #333;
  text-align: center;
  margin: 0;
  padding: 0;
  border-left: 1px #000000 solid;
  z-index: 0;
}

.transition-box-graph {
  width: @graphwidth;
  transition: width 0.3s;
  background-color: #1d2127;
  height: @asideheight;
}

.transition-box-comp {
  width: @compwidth;
  transition: width 0.3s;
  background-color: #1d2127;
  height: @asideheight;
}

.transition-box-page {
  width: @pagewidth;
  transition: width 0.3s;
  background-color: #1d2127;
  height: @asideheight;
}

.icon-box-left-hide {
  width: 40px;
  height: 100%;
  background-color: @notselectedcolor;
  // margin: 10px;
  margin-left: 10px;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-box-left {
  width: 40px;
  height: 100%;
  background-color: @selectedcolor;
  // margin: 10px;
  margin-left: 10px;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-box-left-hide:hover {
  cursor: pointer;
  background-color: @notselectedcolor + @highlight;
}

.icon-box-left:hover {
  cursor: pointer;
  background-color: @selectedcolor + @highlight;
}

.icon-box-right {
  width: 40px;
  height: 100%;
  background-color: @notselectedcolor;
  margin-left: 10px;
  // margin: 10px;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-box-right:hover {
  cursor: pointer;
  background-color: @notselectedcolor + @highlight;
}

.head-box-left {
  margin-left: 100px;
  margin-top: 10px;
  float: left;
  height: 30px;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.head-box-right {
  margin-top: 10px;
  margin-right: 100px;
  float: right;
  height: 30px;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.main-panel-wp {
  height: calc(100vh - @headerheight);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.canvas-main {
  position: relative;
  height: 100%;
  width: 100%;
  user-select: none;
}
</style>
