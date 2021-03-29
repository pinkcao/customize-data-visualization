<template>
  <div id="container" class="container" ref="container">
    <div class="back-button">
      <el-button icon="el-icon-close" @click.stop.prevent="returnToBase" circle></el-button>
    </div>
  </div>
</template>

<script>
import Mount from 'vue-mount'
import { getComponent } from '@components/visComponents/comMap.js'
import map from '@components/visComponents/mapComponent/map.vue'
import Vue from 'vue'
export default {
  name: 'mountThreeTest',
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {
    let target = this.$refs.container
    let component = Vue.extend(map)
    let instance = new component().$mount('#container')
    // console.log('?')
    // this.objList.push(
    //   new Mount(getComponent('map'), {
    //     target: this.$refs.target,
    //     mode: 'append',
    //     props: {}
    //   })
    // )
    // this.objList[this.objList.length - 1].mount()
  },
  beforeDestroy() {},
  watch: {},

  methods: {
    returnToBase() {
      this.$router.push('/basePage')
    }
  }
}
</script>

<style>
.back-button {
  z-index: 20000;
  position: absolute;
}

.container {
  width: 100%;
  height: 100%;
}
</style>
