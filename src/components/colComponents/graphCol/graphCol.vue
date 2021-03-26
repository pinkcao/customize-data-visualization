<template>
  <div :style="graphColWrapperStyle">
    <div class="title-box-graph">
      <span :style="titleStyle">图层</span>
    </div>
    <div style="width: 100%: scroll-y: auto">
      <vuedraggable style="width: 100%; display: flex; justify-content: center" v-model="componentList">
        <transition-group>
          <div
            v-for="item in componentList"
            v-show="!item.disabled"
            :key="item.zindex"
            class="item"
            @click="activateComponent(item.index)"
          >
            组件序号:{{ item.index }}<br />
            组件名:{{ item.name }}
          </div>
        </transition-group>
      </vuedraggable>
    </div>
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable'
import { colSpanStyle } from '@common/commonStyle/compColStyle/compColStyle.js'

export default {
  name: 'graphCol',
  components: {
    vuedraggable
  },
  data() {
    return {
      titleStyle: colSpanStyle
    }
  },
  computed: {
    //当前的componentList
    componentList: {
      get() {
        // return this.$store.state.componentList
        let tempArr = this.$store.state.componentList
        console.log(tempArr)
        return tempArr.sort(this.compare('zindex'))
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

  methods: {
    activateComponent(componentIndex) {
      let args = {
        index: componentIndex
      }
      this.$store.commit('updateActiveComponent', args)
    },
    compare: function(prop) {
      return function(obj1, obj2) {
        var val1 = obj1[prop]
        var val2 = obj2[prop]
        if (val1 < val2) {
          return -1
        } else if (val1 > val2) {
          return 1
        } else {
          return 0
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
@titleboxpadding: 10px;
@itemColor: #00474f;

.title-box-graph {
  width: 100%;
  height: 30px;
  background-color: @titleBoxBackgroundColor;
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
  background-color: @itemColor;
  color: #ffffff;
  margin-top: 2px;
}

.item:hover {
  cursor: pointer;
  background-color: @itemColor + @highlight;
}
</style>
