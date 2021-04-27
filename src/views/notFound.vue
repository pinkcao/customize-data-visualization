<template>
  <div>
    <span>404嘞</span>
    <el-button @click="routeToBase">返回登录页</el-button>
  </div>
</template>

<script>
export default {
  components: {},
  name: 'notFound',
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},

  methods: {
    routeToBase() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style>
.testbox {
  width: 200px;
  height: 200px;
}
</style>
