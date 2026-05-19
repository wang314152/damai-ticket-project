<template>
  <div class="floating-btn" @click="toggle">
    🤖
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isExpanded = ref(false)
function toggle() { isExpanded.value = !isExpanded.value }
</script>

<style scoped>
.floating-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  z-index: 9999;
}
</style>
