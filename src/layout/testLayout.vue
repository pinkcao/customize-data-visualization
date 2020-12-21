<template>
  <div class="main" id="testLayout">
    <div class="main-route" :style="overflowControl">
      <router-view></router-view>
    </div>
    <!--
    <div class="footer" title="footer">
    </div> -->
  </div>
</template>

<script>
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
    // stretchMethod: function () {}
  }
}
</script>

<style>
.main {
  height: 100%;
}

.main-route {
  /* background-color: #1C1F25; */
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
