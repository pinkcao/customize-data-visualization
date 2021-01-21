<template>
  <div :style="graphColWrapperStyle">
    <div class="title-box-graph">
      <span style="color: #b3c0d1; font-size: 12px">图层</span>
    </div>
    <div style="width: 100%: scroll-y: auto">
      <vuedraggable style="width: 100%; display: flex; justify-content: center" v-model="componentList">
        <transition-group>
          <div v-for="item in componentList" v-show="item.ifshow" :key="item.zindex" class="item">
            componentIndex:{{ item.index }}<br />
            compName:{{ item.name }}
          </div>
        </transition-group>
      </vuedraggable>
    </div>
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable'

export default {
  name: 'graphCol',
  components: {
    vuedraggable
  },
  data() {
    return {}
  },
  computed: {
    //当前的componentList
    componentList: {
      get() {
        return this.$store.state.componentList
      },
      set(value) {
        //图层列的显示顺序
        this.$store.commit('updateAllZindexAsc', value)
        // this.$store.commit('updateAllZindexDsc', value)
      }
    },
    graphColWrapperStyle: function() {
      let tempStyle = {}
      if (this.graphColVis == true) {
        tempStyle = {
          width: '200px',
          height: '100%',
          transition: 'width 0.3s'
        }
      } else {
        tempStyle = {
          width: '0px',
          height: '100%',
          transition: 'width 0.3s'
        }
      }
      return tempStyle
    }
  },
  props: {
    graphColVis: {
      type: Boolean,
      default: true
    }
  },
  created() {},
  mounted() {},

  methods: {}
}
</script>

<style scoped lang="less">
@titleboxpadding: 10px;

.title-box-graph {
  width: 100%;
  height: 30px;
  background-color: #333b45;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

span {
  width: 100%;
}

.item {
  width: 100%;
  height: 80px;
  background-color: #2c075c;
  color: #ffffff;
  margin-top: 2px;
}
</style>
