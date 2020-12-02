<template>
  <div class="main" id="testLayout">
    <div class="main-route">
      <router-view></router-view>
    </div>
    <!--
    <div class="footer" title="footer">
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'testLayout'
  // created: function() {
  //   let that = this
  //   document.onkeydown = function(e) {
  //     let key = window.event.keyCode
  //     if (key == 8) {
  //       that.KeyUpSpace()
  //     }
  //   }
  // },
  // methods: {
  //   KeyUpSpace() {
  //     console.log('backspace')
  //   }
  // }
}
</script>

<style scoped>
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
</style>
