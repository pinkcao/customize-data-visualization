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
          <div title="帮助" class="icon-box-right">
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
            <componentCol :divData="divData" @receiveDataFromSon="getMessage"></componentCol>
          </div>
        </el-aside>
        <el-main>
          <div @dragenter="dragovertest2" @dragover="allowdrag" @click="clicktest" class="main-panel-wp">
            <div class="canvas-main">
              <main-canvas> </main-canvas>
            </div>
          </div>
        </el-main>
        <el-aside width="auto">
          <div ref="pageCol" :componentName="componentName" class="transition-box-page">
            <pageSet> </pageSet>
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
import componentCol from '../components/componentCol.vue'
import testComponentA from '../components/testComponentA.vue'
import { mount } from 'vue-mount'
// import mocktest from "../API/mockTest.js";
import graphCol from '../components/graphCol.vue'
// import testStyle from "../API/testStyle.js";
import pageSet from '../components/pageSet.vue'
import mainCanvas from '../components/mainCanvas.vue'

export default {
  components: {
    componentCol,
    // testComponentA,
    graphCol,
    pageSet,
    mainCanvas
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
      // ShaderPass:new THREE.ShaderPass( THREE.FXAAShader ),
      /*
          div参数
          */

      componentsfullwidth: '250px',
      componentsemptywidth: '0px',
      pagefullwidth: '350px',
      pageemptywidth: '0px',
      graphfullwidth: '200px',
      graphemptywidth: '0px',

      // iconstyle:{
      //   color:'aliceblue',
      //   display:'flex',
      //   'align-items':center,
      //   'justify-content':center,
      //   'margin-top':'7px',
      // },
      iconstyle: 'color:aliceblue;display:flex;align-items: center;justify-content: center;margin-top: 7px',
      componentName: '',
      mountTestData: [
        {
          comstyle: {
            width: '80px',
            height: '80px',
            position: 'absolute'
            // left:'500px',
            // top:'50px',
          },
          name: 'compA',
          uid: 'compA_1',
          ifshow: true
        },
        {
          comstyle: {
            width: '90px',
            height: '90px',
            position: 'absolute'
          },
          name: 'compA',
          uid: 'compA_2',
          ifshow: true
        }
      ]
      // ,{
      //   comstyle:{
      //     width:'100px',
      //     height:'100px',
      //     position:'absolute',
      //   },
      //   name:'compA',
      //   uid:'compA_003',
      //   ifshow:true,
      // }],
    }
  },
  computed: {
    comcount: function() {
      return 'comp_' + (this.mountTestData.length + 1)
    },
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
    // console.log(this.$store.state.isLogin);
    /*
        初始化width保证立即响应
        */
    this.$refs.graphCol.style.width = this.graphfullwidth
    this.$refs.compCol.style.width = this.componentsfullwidth
    this.$refs.pageCol.style.width = this.pagefullwidth
    // this.mountTest();
  },

  methods: {
    /*
        用于transition三个区块
        */
    graphclicktest() {
      // console.log(this.$refs.graphCol.style.width);
      if (this.$refs.graphCol.style.width !== this.graphfullwidth) {
        this.$refs.graphCol.style.width = this.graphfullwidth
        this.graphColActive = true
      } else {
        this.$refs.graphCol.style.width = this.graphemptywidth
        this.graphColActive = false
      }
    },

    compclicktest() {
      if (this.$refs.compCol.style.width !== this.componentsfullwidth) {
        this.$refs.compCol.style.width = this.componentsfullwidth
        this.compColActive = true
      } else {
        this.$refs.compCol.style.width = this.componentsemptywidth
        this.compColActive = false
      }
    },

    pageclicktest() {
      if (this.$refs.pageCol.style.width !== this.pagefullwidth) {
        this.$refs.pageCol.style.width = this.pagefullwidth
        this.pageColActive = true
      } else {
        this.$refs.pageCol.style.width = this.pageemptywidth
        this.pageColActive = false
      }
    },

    allowdrag(event) {
      event.preventDefault()
    },

    dragstarttest(event) {
      console.log('dragstarts')
      this.originX = event.clientX
      this.originY = event.clientY
      // console.log(this.originX);
      // console.log(this.originY);
    },
    dragendtest(event) {
      console.log('dragends')
      var desX = event.clientX - this.originX
      var desY = event.clientY - this.originY
      console.log(desX)
      console.log(desY)
      /*
          拖拽元素计算坐标
          */
      event.currentTarget.style.left = event.currentTarget.getBoundingClientRect().left + desX + 'px'
      event.currentTarget.style.top = event.currentTarget.getBoundingClientRect().top + desY + 'px'
    },

    showDivData(event) {
      console.log(event.currentTarget.getBoundingClientRect())
      this.divData.right = event.currentTarget.getBoundingClientRect().right
      this.divData.left = event.currentTarget.getBoundingClientRect().left
      this.divData.top = event.currentTarget.getBoundingClientRect().top
      this.divData.bottom = event.currentTarget.getBoundingClientRect().bottom
      // console.log(this.divData);
    },

    /*
        这个方法需要分离一下
        */
    getMessage(data) {
      this.dataFromSon = data
      for (let i = 0; i < this.mountTestData.length; i++) {
        if (this.mountTestData[i].uid == this.dataFromSon) {
          this.mountTestData.splice(i, 1)
        }
      }
    },

    /*
        初始化在中心画布挂载进行测试
        测试成功表明在引入相应的组件后可以直接进行挂载
        流程：
        1.从数据库读取组件列表，import对应的组件
        2.根据组件列表在新界面进行挂载
        */
    mountTest() {
      let currentData = this.mountTestData
      let that = this
      for (let i = 0; i < currentData.length; i++) {
        if (currentData[i].name == 'compA') {
          mount(testComponentA, {
            target: this.$refs.target,
            mode: 'append',
            props: {},
            data: {
              comstyle: currentData[i].comstyle,
              uid: currentData[i].uid,
              target: this.$refs.target,
              ifshow: currentData[i].ifshow
            },
            on: {
              receiveDataFromSon(data) {
                // that.dataFromSon = data;
                that.getMessage(data)
              }
            }
          })
          // const testComponentA2 = mount(testComponentA, {
          //   target: this.$refs.target,
          //   mode: "append",
          //   props: {},
          //   data: {
          //     comstyle: currentData[i].comstyle,
          //     uid: currentData[i].uid,
          //     target: this.$refs.target,
          //     ifshow: currentData[i].ifshow,
          //   },
          //   on: {
          //     receiveDataFromSon(data, vm, mnt) {
          //       // that.dataFromSon = data;
          //       that.getMessage(data);
          //     },
          //   },
          // });
        }
      }
    },

    /*
          在这里维护组件数组，应当有一套初始化数据。并且设置好组件的唯一名称，根据该名称进行组件的删除与修改
          */

    /*
          假设这个结构是这样的，加载时应该是挂载到一个全新的结点（新建了标签页），循环挂载数组中的组件
          可先通过判断组件数组中的组件名或是其他方式确定需要的组件是什么，再import，添加components？
          [{
            comstyle:{
              width:'',
              height:'',
              position:'absolute',
                            不得不这样传，dataV应该也是这么做的，因为无法修改class内部样式，并且大概只要传缩放以及宽高坐标即可。
                            组件的宽高的缩放也按比例来。
            },

            name:'',用于标识是哪个组件，方便挂载，当然也可能是一个component中根据属性的不同而产生不同的形状变化啥的，比如
                    柱状图→饼图这种，这种情况下name就不那么需要了，comstyle需要对应的数据结构对应起来，hashmap应该就行
            uid:'',相当于自增主键，数组中组件的唯一标识符，子组件通过传该值给父组件修改组件数组，修改完成后调用destroy方法？大概
                    z-index大概也是在此处完成传入传出。
          },{

          },{

          }]
          */

    //判断成功则挂载到中心区域
    /*
            这个可能是需要hashmap这种数据结构将其一一对应起来，在选择组件列表时所选择的大概率是个图像然后进行拖拽
            图像有其图像名，可能是图像的uuid，可以是通过数据库也可以是通过后端的数据结构或是前端写个二维数组直接把
            图像和组件对应起来，对应完成后将其更新在组件数组中并更新至中央画布。
            */

    // droptest(event){

    // }
    // droptest(event){
    //   // console.log("drops");
    //   // console.log(this.dataFromSon);
    //   if(this.dataFromSon == "组件列"){
    //   let that = this;
    //     const testComponentA2 = mount(testComponentA, {
    //       target: this.$refs.target,
    //       mode:"append",
    //       props: {
    //       	testProps: 123,
    //         /*
    //         传给子组件的值、字符串、方法、对象
    //         */
    //       },
    //       data: {
    //           // comstyle:{
    //           //   width:'80px',
    //           //   height:'80px',
    //           //   position:'absolute',
    //           //   left:'500px',
    //           //   top:'50px',
    //           // },
    //           comstyle:testStyle.data().comstyle,
    //           name:'compA',
    //           uid:that.comcount,
    //           ifshow:true,
    //           },
    //       on:{
    //           'receiveDataFromSon'(data,vm,mnt){
    //             // that.dataFromSon = data;
    //             that.getMessage(data);
    //           }
    //         }
    //     });

    //     this.mountTestData.push(
    //     {
    //       // comstyle:{
    //       //   width:'80px',
    //       //   height:'80px',
    //       //   position:'absolute',
    //       //   left:'500px',
    //       //   top:'50px',
    //       // },
    //       comstyle:testStyle.data().comstyle,
    //       name:'compA',
    //       uid:that.comcount,
    //       ifshow:true,
    //     }
    //     );
    //   }
    //   this.dataFromSon = '';
    // },

    dragovertest2() {},

    dragtest(event) {
      event.currentTarget.style.left = event.clientX + 'px'
      event.currentTarget.style.top = event.clientY + 'px'
      console.log('dragging')
    },

    clicktest() {},

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
      console.log('testbut')
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
}

.icon-box-left {
  width: 40px;
  height: 100%;
  background-color: @selectedcolor;
  // margin: 10px;
  margin-left: 10px;
  float: left;
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
}

.head-box-right {
  margin-top: 10px;
  margin-right: 100px;
  float: right;
  height: 30px;
  width: 300px;
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
