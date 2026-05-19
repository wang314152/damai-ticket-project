<template>
  <div class="profile-page">
    <header class="header">
      <button @click="router.back()">←</button>
      <h1>个人中心</h1>
    </header>
    <div class="card">
      <div class="avatar">👤</div>
      <h2>{{ username }}</h2>
      <p>用户ID: {{ userId }}</p>
    </div>
    <button class="logout-btn" @click="logout">退出登录</button>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const username = localStorage.getItem('username') || ''
const userId = localStorage.getItem('userId') || ''
function logout() { localStorage.clear(); router.push('/login') }
</script>
<style scoped>
.profile-page { min-height:100vh; background:#f5f5f5; padding:20px; }
.header { background:linear-gradient(135deg,#667eea,#764ba2); color:white; padding:15px 20px; border-radius:12px; display:flex; align-items:center; gap:16px; }
.card { background:white; margin:30px auto; max-width:400px; padding:40px; border-radius:20px; text-align:center; box-shadow:0 3px 15px rgba(0,0,0,0.08); }
.avatar { font-size:64px; margin-bottom:15px; }
h2 { font-size:22px; color:#333; margin-bottom:8px; }
p { color:#999; font-size:14px; }
.logout-btn { display:block; width:200px; margin:20px auto; padding:14px; background:#ff4d4f; color:white; border:none; border-radius:18px; cursor:pointer; font-size:15px; }
</style>
