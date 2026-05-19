<template>
  <div id="app">
    <h1>🎭 大麦网 - 加载成功!</h1>
    <p>前端运行正常</p>
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f5f5; }
#app { min-height: 100vh; }
h1 { color: #FF4D4D; padding: 40px; text-align: center; }
p { text-align: center; color: #666; }
</style>
