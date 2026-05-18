<template>
  <div class="login-page">
    <!-- 装饰元素 -->
    <div class="decorations">
      <div class="float-circle circle-1"></div>
      <div class="float-circle circle-2"></div>
      <div class="float-circle circle-3"></div>
    </div>

    <!-- Logo -->
    <div class="logo">
      <div class="logo-icon">🎭</div>
      <div class="logo-text">大麦网</div>
      <div class="logo-slogan">让生活充满热爱</div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- Tab切换 -->
      <div class="tabs">
        <div class="tab" :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'">
          登录
        </div>
        <div class="tab" :class="{ active: activeTab === 'register' }" @click="activeTab = 'register'">
          注册
        </div>
        <div class="tab-indicator" :style="{ left: activeTab === 'login' ? '10%' : '60%' }"></div>
      </div>

      <!-- 登录表单 -->
      <div v-show="activeTab === 'login'" class="form">
        <div class="input-group">
          <div class="input-icon">👤</div>
          <input v-model="loginForm.username" type="text" placeholder="请输入用户名" />
        </div>
        <div class="input-group">
          <div class="input-icon">🔒</div>
          <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" placeholder="请输入密码" />
          <span class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </span>
        </div>
        <button class="btn-login" @click="handleLogin" :disabled="loading">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>登 录</span>
        </button>
        <button class="btn-demo" @click="handleDemoLogin">
          快速体验（演示账号）
        </button>
      </div>

      <!-- 注册表单 -->
      <div v-show="activeTab === 'register'" class="form">
        <div class="input-group">
          <div class="input-icon">👤</div>
          <input v-model="registerForm.username" type="text" placeholder="设置用户名" />
        </div>
        <div class="input-group">
          <div class="input-icon">🔒</div>
          <input v-model="registerForm.password" :type="showPassword ? 'text' : 'password'" placeholder="设置密码" />
          <span class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </span>
        </div>
        <div class="input-group">
          <div class="input-icon">📱</div>
          <input v-model="registerForm.phone" type="tel" placeholder="手机号（选填）" />
        </div>
        <button class="btn-login" @click="handleRegister" :disabled="loading">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>注 册</span>
        </button>
      </div>

      <!-- 提示信息 -->
      <div v-if="message" class="message" :class="{ error: messageType === 'error' }">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import request from '../api/request.js'

const router = useRouter()
const activeTab = ref('login')
const showPassword = ref(false)
const loading = ref(false)
const message = ref('')
const messageType = ref('info')

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  password: '',
  phone: ''
})

const showMessage = (msg, type = 'info') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    showMessage('请输入用户名和密码', 'error')
    return
  }

  loading.value = true
  try {
    const user = await request.post('/api/auth/login', {
      username: loginForm.username,
      password: loginForm.password
    })

    if (user && user.id) {
      localStorage.setItem('userId', user.id)
      localStorage.setItem('username', user.username)
      localStorage.setItem('role', user.role || 'USER')
      localStorage.setItem('isAdmin', user.role === 'ADMIN' ? '1' : '0')
      localStorage.setItem('token', 'mock-token-' + Date.now())

      showMessage('登录成功！', 'info')
      setTimeout(() => {
        router.push(user.role === 'ADMIN' ? '/admin' : '/')
      }, 500)
    } else {
      showMessage('用户名或密码错误', 'error')
    }
  } catch (e) {
    // 后端不可用，使用本地演示登录
    if (loginForm.username === 'test' && loginForm.password === '123456') {
      localStorage.setItem('userId', '999')
      localStorage.setItem('username', 'test')
      localStorage.setItem('role', 'USER')
      localStorage.setItem('isAdmin', '0')
      localStorage.setItem('token', 'mock-token-' + Date.now())
      showMessage('登录成功（演示模式）！', 'info')
      setTimeout(() => router.push('/'), 500)
    } else {
      showMessage('后端未启动，请使用演示账号登录', 'error')
    }
  } finally {
    loading.value = false
  }
}

const handleDemoLogin = () => {
  // 直接使用演示账号登录，不调用后端
  localStorage.setItem('userId', '999')
  localStorage.setItem('username', 'test')
  localStorage.setItem('role', 'USER')
  localStorage.setItem('isAdmin', '0')
  localStorage.setItem('token', 'mock-token-' + Date.now())
  showMessage('登录成功（演示模式）！', 'info')
  setTimeout(() => router.push('/'), 500)
}

const handleRegister = async () => {
  if (!registerForm.username || !registerForm.password) {
    showMessage('请填写用户名和密码', 'error')
    return
  }

  loading.value = true
  try {
    await request.post('/api/auth/register', {
      username: registerForm.username,
      password: registerForm.password,
      phone: registerForm.phone
    })
    showMessage('注册成功！请登录', 'info')
    activeTab.value = 'login'
    loginForm.username = registerForm.username
    loginForm.password = registerForm.password
  } catch (e) {
    // 后端不可用，使用本地演示注册
    const users = JSON.parse(localStorage.getItem('demoUsers') || '[]')
    const exists = users.find(u => u.username === registerForm.username)
    if (exists) {
      showMessage('用户名已存在', 'error')
    } else {
      users.push({
        username: registerForm.username,
        password: registerForm.password,
        phone: registerForm.phone,
        id: Date.now(),
        role: 'USER'
      })
      localStorage.setItem('demoUsers', JSON.stringify(users))
      showMessage('注册成功（演示模式）！请登录', 'info')
      activeTab.value = 'login'
      loginForm.username = registerForm.username
      loginForm.password = registerForm.password
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.float-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  left: -50px;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: -30px;
  right: -30px;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  right: 10%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.logo {
  text-align: center;
  color: white;
  margin-bottom: 40px;
  z-index: 1;
}

.logo-icon {
  font-size: 64px;
  margin-bottom: 10px;
}

.logo-text {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.logo-slogan {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 5px;
}

.login-card {
  background: white;
  border-radius: 24px;
  padding: 40px 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.tabs {
  display: flex;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 4px;
  position: relative;
  margin-bottom: 30px;
}

.tab {
  flex: 1;
  padding: 12px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
  z-index: 2;
}

.tab.active {
  color: #6366F1;
}

.tab-indicator {
  position: absolute;
  width: 40%;
  height: calc(100% - 8px);
  background: white;
  border-radius: 8px;
  top: 4px;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  align-items: center;
  background: #f8f8f8;
  border-radius: 12px;
  padding: 14px 16px;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.input-group:focus-within {
  border-color: #6366F1;
  background: white;
}

.input-icon {
  font-size: 18px;
  margin-right: 12px;
}

.input-group input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  outline: none;
}

.toggle-password {
  cursor: pointer;
  font-size: 18px;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.toggle-password:hover {
  opacity: 1;
}

.btn-login {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-demo {
  background: transparent;
  color: #6366F1;
  border: 2px solid #6366F1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-demo:hover {
  background: #EEF2FF;
}

.message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  background: #E8F5E9;
  color: #2E7D32;
  text-align: center;
  font-size: 14px;
  animation: slideIn 0.3s ease;
}

.message.error {
  background: #EEF2FF;
  color: #4F46E5;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
