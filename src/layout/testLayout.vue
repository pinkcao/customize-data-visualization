<template>
  <div class="main" id="testLayout">
    <div class="main-route" :style="overflowControl">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import mockBus from '@mock/mockBus.js'

export default {
  name: 'testLayout',
  data() {
    return {}
  },
  computed: {
    overflowControl: function() {
      if (this.$store.state.allStretch == true) {
        return {
          overflow: 'hidden'
        }
      } else if (this.$store.state.xStretch == true) {
        return {
          'overflow-x': 'hidden'
        }
      } else if (this.$store.state.yStretch == true) {
        return {
          'overflow-y': 'hidden'
        }
      } else {
        return {}
      }
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style>
html,
body {
  margin: 0px;
  padding: 0px;
  border: 0px;
}

.main {
  height: 100%;
}

.main-route {
  /* background-color: #1C1F25; */
  width: 100%;
  height: calc(100vh);
}

.footer {
  background-color: #333333;
  height: 100px;
}

span {
  border: 0px;
  margin: 0px;
  padding: 0px;
}
</style>
