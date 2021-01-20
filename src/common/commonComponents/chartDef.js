import echarts from 'echarts'

export default {
  data() {
    return {
      currentChart: null
    }
  },
  props: {
    width: {
      default: '100%'
    },
    height: {
      default: '100%'
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
    chartTitle: {
      type: String,
      default: ''
    },
    chartSubTitle: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'design'
    },
    opacity: {
      default: 1
    },
    legendvis: {
      type: Boolean,
      default: true
    },
    titlevis: {
      type: Boolean,
      default: true
    },
    zoomvis: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'design'
    }
  },
  watch: {
    dataSource: function(newVal) {
      this.initChart()
    },
    opacity: function(newVal) {
      this.initChart()
    },
    legendvis: function(newVal) {
      this.initChart()
    },
    titlevis: function(newVal) {
      this.initChart()
    },
    chartTitle: function(newVal) {
      this.initChart()
    },
    chartSubTitle: function(newVal) {
      this.initChart()
    }
  },
  computed: {
    chartStyle: function() {
      return {
        width: this.width,
        height: this.height
      }
    },
    silentStatus: function() {
      return this.mode === 'design' ? true : false
    }
  },
  mounted() {
    this.currentChart = echarts.init(this.$refs.chart)
    this.initChart()
    window.addEventListener('resize', () => {
      this.currentChart.resize()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', () => {
      this.currentChart.resize()
    })
  },
  methods: {
    initChart() {},
    chartResize() {
      this.currentChart.resize()
    }
  }
}
