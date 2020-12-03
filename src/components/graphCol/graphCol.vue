<template>
  <div style="width: 100%; height: 100%">
    <div class="title-box-graph">
      <span style="color: #b3c0d1; font-size: 12px">图层</span>
    </div>
    <div style="width: 100%">
      <vuedraggable style="width: 100%; display: flex; justify-content: center" v-model="list">
        <transition-group>
          <div v-for="item in list" :key="item" class="item">test{{ item }}</div>
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
    return {
      list: [1, 2, 3, 4, 5]
    }
  },
  computed: {},

  created() {},
  mounted() {},

  methods: {}
}
</script>

<style scoped lang="less">
@titleboxpadding: 10px;
// @width: 200px;

.title-box-graph {
  padding: @titleboxpadding;
  width: 100%;
  height: 30px - @titleboxpadding - @titleboxpadding;
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
}
</style>
