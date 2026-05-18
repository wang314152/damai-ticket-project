<template>
  <div class="app-shell">
    <router-view :key="$route.fullPath" />
    <FloatingAI />
  </div>
</template>

<script setup>
import FloatingAI from './views/FloatingAI.vue'
</script>

<style>
/* 全局基础样式 */
:root {
  --damai-primary: #6366F1;
  --damai-secondary: #8B5CF6;
  --damai-dark: #1e293b;
  --damai-gray: #64748b;
  --damai-light-gray: #94a3b8;
  --damai-bg: #f1f5f9;
  --damai-border: #e2e8f0;
  --damai-card-shadow: 0 2px 12px rgba(99, 102, 241, 0.06);
  --damai-card-hover-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);
  --damai-radius: 12px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  color: var(--damai-dark);
}

.app-shell {
  min-height: 100vh;
  background: var(--damai-bg);
}

/* Element Plus 主题定制 */
.el-button--primary {
  --el-button-bg-color: var(--damai-primary);
  --el-button-border-color: var(--damai-primary);
  --el-button-hover-bg-color: #818CF8;
  --el-button-hover-border-color: #818CF8;
}

.el-button--primary:focus,
.el-button--primary:hover {
  background: #818CF8 !important;
  border-color: #818CF8 !important;
}

.el-rate__icon {
  font-size: 20px !important;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* 卡片悬停效果 */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--damai-card-hover-shadow) !important;
}

/* 渐变背景 */
.gradient-bg {
  background: linear-gradient(135deg, var(--damai-primary) 0%, var(--damai-secondary) 100%);
}

/* 文字截断 */
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

