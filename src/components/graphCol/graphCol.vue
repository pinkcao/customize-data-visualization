<template>
  <div style="width: 100%; height: 100%">
    <div class="title-box-graph">
      <span style="color: #b3c0d1; font-size: 12px">图层</span>
    </div>
    <div style="width: 100%: scroll-y: auto">
      <vuedraggable style="width: 100%; display: flex; justify-content: center" v-model="componentList">
        <transition-group>
          <div v-for="item in componentList" v-show="item.ifshow" :key="item.zindex" class="item">
            componentIndex:{{ item.index }}
          </div>
        </transition-group>
      </vuedraggable>
    </div>
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable'
import url from '../../mock/mockAPI.js'

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
        console.log(value)
        this.$store.commit('updateAllZindexAsc', value)
        // this.$store.commit('updateAllZindexDsc', value)
      }
    }
  },

  created() {},
  mounted() {
    console.log(this.componentList)
  },

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
  background-color: #775500;
  color: #ffffff;
  margin-top: 2px;
}
</style>
