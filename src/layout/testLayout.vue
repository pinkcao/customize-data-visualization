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
  name: "testLayout",
};
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
