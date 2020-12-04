<template>
  <div class="flex-box is-vertical">
    <div class="toolbar">
      <!-- 图表种类按钮，控制当前显示的是哪种类型的图表 -->
      <!-- <el-popover title="图表种类" trigger="hover">
        <div>
          <el-radio-group v-model="ctype" @change="typeChange">
            <el-row>
              <el-col :span="12" v-for="(item, index) in supportedArr" :key="index">
                <el-radio :label="item.value"> {{ item.type }} </el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
        </div>
        <el-button slot="reference">图表种类</el-button>
      </el-popover> -->
      <!-- 统计分组列表，如果传入未经处理的数据，选择根据对应的列进行聚类生成图表 -->
      <!-- <el-popover v-if="rawdata != ''" title="统计分组" trigger="hover">
        <div>
          <el-radio-group v-model="groupId" @change="groupChange">
            <el-row>
              <el-col :span="12" v-for="(item, index) in columnDict" :key="index">
                <el-radio :label="index"> {{ item }} </el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
        </div>
        <el-button slot="reference">分组统计</el-button>
      </el-popover> -->
      <!-- 控制图表一些组件的显示与隐藏 -->
      <!-- <el-popover width="200" title="显示设置" trigger="hover">
        <div style="display: flex; flex-direction: column">
          <div :style="popoverDivStyle">
            <el-row>
              <el-col :span="12">
                <span>标题</span>
              </el-col>
              <el-col :span="12">
                <el-switch v-model="titlevisible" @change="onChangeTitle"></el-switch>
              </el-col>
            </el-row>
          </div>
          <div :style="popoverDivStyle">
            <el-row>
              <el-col :span="12">
                <span>图例组件</span>
              </el-col>
              <el-col :span="12">
                <el-switch v-model="legendvisible" @change="onChangeLegend"></el-switch>
              </el-col>
            </el-row>
          </div>
          <div :style="popoverDivStyle">
            <el-row>
              <el-col :span="12">
                <span>缩放组件</span>
              </el-col>
              <el-col :span="12">
                <el-switch v-model="zoomvisible" @change="onChangeZoom"></el-switch>
              </el-col>
            </el-row>
          </div>
        </div>
        <el-button slot="reference">显示</el-button>
      </el-popover> -->

      <el-popover width="200" title="设置" trigger="hover">
        <div style="display: flex; flex-direction: column">
          <!-- 这里只是方便临时改标题，实际上不传值到后端 -->
          <el-input v-model="currentChartTitle" placeholder="标题" @change="initChart"></el-input>
          <el-input v-model="currentChartSubTitle" placeholder="副标题" @change="initChart"></el-input>
          <div>
            <el-radio-group v-model="ctype" @change="typeChange">
              <el-row>
                <el-col :span="12" v-for="(item, index) in supportedArr" :key="index">
                  <el-radio :style="'margin-top: 10px'" :label="item.value"> {{ item.type }} </el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </div>
          <div :style="popoverDivStyle">
            <el-row>
              <el-col :span="12">
                <span>标题</span>
              </el-col>
              <el-col :span="12">
                <el-switch v-model="titlevisible" @change="onChangeTitle"></el-switch>
              </el-col>
            </el-row>
          </div>
          <div :style="popoverDivStyle">
            <el-row>
              <el-col :span="12">
                <span>图例组件</span>
              </el-col>
              <el-col :span="12">
                <el-switch v-model="legendvisible" @change="onChangeLegend"></el-switch>
              </el-col>
            </el-row>
          </div>
          <div :style="popoverDivStyle">
            <el-row>
              <el-col :span="12">
                <span>缩放组件</span>
              </el-col>
              <el-col :span="12">
                <el-switch v-model="zoomvisible" @change="onChangeZoom"></el-switch>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="rawdata != ''">
          <el-radio-group v-model="groupId" @change="groupChange">
            <el-row>
              <el-col :span="12" v-for="(item, index) in columnDict" :key="index">
                <el-radio :label="index"> {{ item }} </el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
        </div>
        <div v-if="ctype == 'pie' && dataColumns > 1">
          <h4>每行数量</h4>
          <el-slider v-model="col" :min="1" :max="dataColumns" @change="onAfterChange"></el-slider>
        </div>
        <el-button slot="reference" icon="el-icon-setting" size="mini" circle></el-button>
      </el-popover>
    </div>
    <div ref="chart" :style="chartStyle"></div>
    <!-- <div v-if="rawdata" style="width: 100%; height: 20px;">当前传入的是未经处理的数据</div>
    <div v-if="!rawdata" style="width: 100%; height: 20px;">当前传入的是经过处理的数据</div> -->
  </div>
</template>
<script>
import echarts from 'echarts'
import { loadSchema, loadSupportedType } from './chart'
// import { Change, System } from '@icon-park/vue'

export default {
  name: 'v-chart',
  props: {
    width: {
      default: '100%'
    },
    height: {
      default: '100%'
    },
    //经过处理的数据源，可选数据格式，详见echarts dataset
    dataSource: {
      type: Array,
      default: () => []
    },
    color: {
      type: Array,
      //echarts基础调色盘
      default: () => [
        '#c23531',
        '#2f4554',
        '#61a0a8',
        '#d48265',
        '#91c7ae',
        '#749f83',
        '#ca8622',
        '#bda29a',
        '#6e7074',
        '#546570',
        '#c4ccd3'
      ]
    },
    type: {
      type: String,
      default: 'bar'
    },
    chartTitle: {
      type: String,
      default: ''
    },
    chartSubTitle: {
      type: String,
      default: ''
    },
    showAlllabel: {
      type: Boolean,
      default: false
    },
    zoomvis: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => ({
        options: 'noOption'
      })
    },
    tooltip: {
      type: Object,
      default: () => ({
        options: 'noOption'
      })
    },
    legendvis: {
      type: Boolean,
      default: true
    },
    titlevis: {
      type: Boolean,
      default: true
    },
    rawdata: {
      default: ''
    }
  },
  data() {
    return {
      //默认饼图显示的列数
      col: 2,
      //当前echart的位置，需初始化
      currentChart: null,
      //初始显示图类型
      ctype: 'bar',
      //用于设置一些基础参数，比如坐标轴是否显示
      schema: null,
      //控制图例组件显示
      legendvisible: this.legendvis,
      //控制标题组件显示
      titlevisible: this.titlevis,
      //控制缩放组件显示
      zoomvisible: this.zoomvis,
      //获取当前被支持的图表
      supportedArr: null,
      //经过处理的数据
      processedArr: null,
      //统计分组的类别
      columnDict: [],
      //当前图表的标题
      currentChartTitle: '',
      //当前图表的副标题
      currentChartSubTitle: '',
      radio: 1,
      groupId: 0,
      popoverDivStyle: {
        'margin-top': '10px'
      }
    }
  },
  computed: {
    //获取当前数据的列数(用于设置series)
    dataColumns: function() {
      if (this.dataSource.length == 0) {
        return 1
      } else {
        return this.dataSource[0].length - 1
      }
    },
    //设置图表的整个宽,高
    chartStyle: function() {
      return {
        width: this.width,
        height: this.height
      }
    },
    //饼图经过特殊适配,用于调整多个饼图在图中显示的位置,其他则直接返回当前选中的图表类型
    series: function() {
      if (this.rawdata == '') {
        let col = this.col //显示列数
        let row = Math.ceil(this.dataColumns / col) //根据列数计算的显示行数
        let gapRateX = 100 / col //x轴间隔百分比
        let gapRateY = 100 / row //y轴间隔百分比
        let r = Math.min((100 / col) * 0.7, (100 / row) * 0.7) + '%' //半径，为了更好的放下饼图取行或列的百分比最小值，防止图表冲突，*0.7系数
        // let chartType = this.type //获取当前图表类型
        let chartType = this.ctype
        let offsetX = 100 / col / 2 //基础x轴偏移量
        let offsetY = 100 / row / 2 //基础y轴偏移量
        let count = this.dataColumns //获取当前数据的列数
        let result = [] //series结果集
        if (chartType == 'pie') {
          for (let i = 0; i < count; i++) {
            result[i] = {
              type: chartType,
              radius: r,
              // center: [200 + (i % col) * 4 * r, 250 + Math.floor(i / 2) * 3 * r],
              center: [offsetX + (i % col) * gapRateX + '%', offsetY + Math.floor(i / col) * gapRateY + '%'],
              encode: { itemName: this.dataSource[0][0], value: this.dataSource[0][i + 1] }
            }
          }
        } else {
          for (let i = 0; i < count; i++) {
            result[i] = { type: chartType }
          }
        }
        return result
      } else {
        return this.rawseries
      }
    },
    //如果传入的是未经处理过的数据,那么使用这个作为series,同样对饼图作了特别设定
    rawseries: function() {
      let chartType = this.ctype
      let result = {} //rawseries结果
      if (chartType == 'pie') {
        result = {
          type: chartType,
          radius: '60%',
          center: ['50%', '50%']
        }
      } else {
        result = { type: chartType }
      }
      return result
    },
    //设置是否强制显示所有标签
    interval: function() {
      if (this.showAlllabel) {
        return { interval: 0 }
      } else {
        return {}
      }
    }
  },
  mounted() {
    this.initCurrentTitle()
    this.initColumnDict()
    this.countArr(4)
    this.getSupportedArr()
    this.initChart()
    window.addEventListener('resize', () => {
      this.currentChart.resize()
    })
  },
  methods: {
    confirmChange(value) {
      console.log(value)
    },
    //获取被支持的图表列表
    getSupportedArr() {
      this.supportedArr = loadSupportedType()
      // console.log(this.supportedArr)
    },
    //当在slidebar中mouseup时更新当前饼图中显示的列数
    onAfterChange(val) {
      this.col = val
      this.initChart()
    },
    //控制图例组件是否显示
    onChangeLegend(val) {
      this.legendvisible = val
      this.initChart()
    },
    //控制标题组件是否显示
    onChangeTitle(val) {
      this.titlevisible = val
      this.initChart()
    },
    //控制缩放组件是否显示
    onChangeZoom(val) {
      this.zoomvisible = val
      this.initChart()
    },
    //当图表种类改变后重新设置图表
    typeChange(e) {
      this.initChart()
    },
    //当统计分组的分组被更改后重新设置图表
    groupChange(value) {
      // console.log(value)
      this.countArr(value)
      this.initChart()
    },
    //初始化获取图表的基础参数
    initSchema() {
      return loadSchema(this.ctype)
    },
    //初始化标题组件的内容
    initTitle(param) {
      return {
        text: this.currentChartTitle,
        subtext: this.currentChartSubTitle,
        left: 'center',
        show: param
      }
    },
    //初始化当前标题
    initCurrentTitle() {
      this.currentChartTitle = this.chartTitle
      this.currentChartSubTitle = this.chartSubTitle
    },
    //初始化tooltip
    initTooltip(param) {
      if (param == true) {
        return this.tooltip
      }
    },
    //初始化坐标系
    initAxis(param) {
      return param
    },
    //初始化缩放组件
    initDataZoom(param) {
      let disabled = 100
      let abled = 50
      let dataZoom = [
        {
          type: 'slider',
          xAxisIndex: 0,
          start: 0,
          end: 50,
          show: param
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          start: 0,
          end: 50,
          show: param
        }
      ]
      if (param == true) {
        dataZoom.forEach(element => {
          element.show = param
          element.end = abled
        })
        return dataZoom
      } else {
        dataZoom.forEach(element => {
          element.show = param
          element.end = disabled
        })
        return dataZoom
      }
    },
    //初始化处理过的数据源
    initDataSource(param) {
      if (param == true) {
        return { source: this.dataSource }
      }
    },
    //设置图表
    initChart() {
      //计算dataSource[0].length-1
      this.currentChart = echarts.init(this.$refs.chart)
      this.schema = this.initSchema()
      //判断是否传入未经处理的数据，如果传入经过处理的数据，执行下面
      if (this.options.options == 'noOption' && this.rawdata == '') {
        let option = {
          title: this.initTitle(this.titlevisible),
          tooltip: this.initTooltip(this.schema.tooltip),
          legend: {
            bottom: '0',
            show: this.legendvisible
          },
          xAxis: {
            type: 'category',
            //强制显示所有label
            axisLabel: this.interval,
            show: this.initAxis(this.schema.showAxis)
          },
          yAxis: {
            show: this.initAxis(this.schema.showAxis)
          },
          dataZoom: this.initDataZoom(this.zoomvisible),
          //提供一份二维数组或是对象数组数据
          dataset: this.initDataSource(this.schema.dataSource),
          // dataset: this.countArr(2),
          //color不设置值则默认为['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
          //如果追求复杂度可以在/src/layout/observable/layout中扩展themeColor,通过key指定color的array，color array可以基于themeColor计算得出。
          color: this.color,
          //对于每一列数据给予生成的图表类型
          series: this.series
        }
        this.currentChart.setOption(option)
        //判断是否传入未经处理的数据，如果传入的是未经处理的数据，执行下面
      } else if (this.options.options == 'noOption' && this.rawdata != '') {
        let option = {
          title: this.initTitle(this.titlevisible),
          tooltip: this.initTooltip(this.schema.tooltip),
          legend: {
            bottom: '0',
            // type: 'scroll',
            show: this.legendvisible
          },
          xAxis: {
            type: 'category',
            axisLabel: this.interval,
            show: this.initAxis(this.schema.showAxis)
          },
          yAxis: {
            show: this.initAxis(this.schema.showAxis)
          },
          dataZoom: this.initDataZoom(this.zoomvisible),
          dataset: {
            source: this.processedArr
          },
          color: this.color,
          series: this.rawseries
        }
        this.currentChart.setOption(option)
        //如果传了options，识别为当前的数据类型不被dataset所支持，因此根据传入的特定options设置当前图表
      } else {
        let option = this.options
        this.currentChart.setOption(option)
      }
    },
    //resize方法
    chartResize() {
      this.currentChart.resize()
    },
    //对传入的未经处理的数据进行加工
    countArr(index) {
      let dataList = []
      //获取第index列数据,对第index列数据进行加工
      for (let i = 0; i < this.rawdata.length; i++) {
        dataList[i] = this.rawdata[i][index]
      }
      //初始化一个set,获取所有不重复的作为key的值
      let set = new Set()
      for (let i = 1; i < dataList.length; i++) {
        set.add(dataList[i])
      }
      //初始化一个map,将set中的所有值作为key加入,并设每个key的value为0
      let map = new Map()
      for (let x of set) {
        map.set(x, 0)
      }
      //把dataList的第0行去除,方便遍历所有的数据
      let detail = []
      for (let i = 1; i < dataList.length; i++) {
        detail[i - 1] = dataList[i]
      }
      //遍历detail,key为当前值,value为key的value + 1
      for (let x of detail) {
        map.set(x, map.get(x) + 1)
      }
      //转map为array,并给它加上第0行作为数据的标注
      const maparr = [[dataList[0], '数量'], ...map]
      //将转化好的array赋值给processeArr
      this.processedArr = maparr
    },
    //初始化统计分组列表,用下标作为搜索时的key
    initColumnDict() {
      this.columnDict = this.rawdata[0]
    }
  }
}
</script>

<style scoped>
.flex-box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -ms-flex-preferred-size: auto;
  flex-basis: auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  min-width: 0;
  width: 100%;
  height: 100%;
}
.flex-box.is-vertical {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}
.toolbar {
  width: 100%;
  height: 35px;
  /* background-color: antiquewhite; */
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}
.toolbar .el-popover {
  margin-left: auto;
  margin-right: 50px;
}
</style>
