<template>
  <div>
    <div class="title-box-graph">
      <span style="color: #b3c0d1; font-size: 12px">图层</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'graphCol',
  data() {
    return {}
  },
  computed: {},

  created() {},
  mounted() {},

  methods: {}
}
</script>

<style scoped lang="less">
@titleboxpadding: 10px;
@width: 200px;

.title-box-graph {
  padding: @titleboxpadding;
  width: @width - @titleboxpadding - @titleboxpadding;
  height: 30px - @titleboxpadding - @titleboxpadding;
  background-color: #333b45;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
