<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo">🎭</div>
      <h1>大麦网</h1>
      <p class="subtitle">Damai Ticket</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <input v-model="username" placeholder="用户名" class="input-field" />
        <input v-model="password" type="password" placeholder="密码" class="input-field" />
        <button type="submit" class="btn-login">登 录</button>
      </form>
      
      <div class="tips">
        <p>测试账号：admin / admin123</p>
        <p>普通用户：test / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const username = ref('test')
const password = ref('123456')

async function handleLogin() {
  try {
    const res = await axios.post('/api/user/login', { username: username.value, password: password.value })
    const data = res.data
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.id)
    localStorage.setItem('username', data.username)
    localStorage.setItem('role', data.role || '')
    router.push('/')
  } catch (e) {
    alert('登录失败: ' + (e.response?.data?.msg || e.message))
  }
}
</script>

<style scoped>
.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%); }
.login-card { background: white; padding: 40px; border-radius: 20px; text-align: center; width: 360px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
.logo { font-size: 64px; margin-bottom: 10px; }
h1 { font-size: 28px; color: #333; margin-bottom: 5px; }
.subtitle { color: #999; font-size: 14px; margin-bottom: 30px; }
.login-form { display: flex; flex-direction: column; gap: 15px; }
.input-field { padding: 14px 18px; border: 2px solid #eee; border-radius: 12px; font-size: 15px; outline: none; transition: border-color 0.3s; }
.input-field:focus { border-color: #FF4D4D; }
.btn-login { padding: 14px; background: linear-gradient(135deg, #FF4D4D, #FF6B35); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
.btn-login:hover { transform: scale(1.02); }
.tips { margin-top: 20px; font-size: 12px; color: #999; line-height: 1.8; }
</style>
