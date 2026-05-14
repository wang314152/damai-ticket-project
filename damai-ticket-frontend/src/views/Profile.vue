<template>
  <div class="profile-page">
    <!-- 顶部导航 -->
    <div class="header">
      <div class="header-content">
        <button class="back-btn" @click="router.push('/')">← 返回</button>
        <h1 class="title">个人中心</h1>
        <div class="placeholder"></div>
      </div>
    </div>

    <!-- 用户信息卡片 -->
    <div class="profile-card">
      <div class="avatar-section">
        <div class="avatar">
          {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
        </div>
        <div class="user-info">
          <div class="username">{{ user?.username || '未登录' }}</div>
          <div class="user-role" v-if="user?.role === 'ADMIN'">
            <span class="admin-badge">管理员</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-access">
      <div class="access-item" @click="router.push('/orders')">
        <div class="access-icon">📋</div>
        <div class="access-text">我的订单</div>
      </div>
      <div class="access-item" @click="router.push('/ai')">
        <div class="access-icon">🤖</div>
        <div class="access-text">AI助手</div>
      </div>
      <div class="access-item" @click="showAbout = true">
        <div class="access-icon">ℹ️</div>
        <div class="access-text">关于我们</div>
      </div>
    </div>

    <!-- 个人信息表单 -->
    <div class="form-section" v-if="isLoggedIn">
      <div class="section-title">个人信息</div>
      <div class="form-card">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="form.username" type="text" disabled />
        </div>
        <div class="form-group">
          <label>手机号</label>
          <input v-model="form.phone" type="tel" placeholder="请输入手机号" />
        </div>
        <div class="form-group">
          <label>邮箱</label>
          <input v-model="form.email" type="email" placeholder="请输入邮箱" />
        </div>
        <div class="form-group">
          <label>昵称</label>
          <input v-model="form.nickname" type="text" placeholder="请输入昵称" />
        </div>
        <button class="btn-save" @click="saveProfile" :disabled="saving">
          <span v-if="saving" class="loading-spinner small"></span>
          <span v-else>保存修改</span>
        </button>
      </div>
    </div>

    <!-- 设置区域 -->
    <div class="settings-section" v-if="isLoggedIn">
      <div class="section-title">设置</div>
      <div class="settings-card">
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-icon">🔔</span>
            <span class="setting-text">消息通知</span>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.notifications" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-icon">📧</span>
            <span class="setting-text">邮件通知</span>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.emailNotify" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-icon">🌙</span>
            <span class="setting-text">深色模式</span>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.darkMode" />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- 登录提示 -->
    <div class="login-prompt" v-if="!isLoggedIn">
      <div class="prompt-icon">👤</div>
      <div class="prompt-text">登录后可查看个人信息和订单</div>
      <button class="btn-login" @click="router.push('/login')">去登录</button>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section" v-if="isLoggedIn">
      <button class="btn-logout" @click="handleLogout">
        退出登录
      </button>
    </div>

    <!-- 关于我们弹窗 -->
    <transition name="modal">
      <div v-if="showAbout" class="about-modal" @click="showAbout = false">
        <div class="about-content" @click.stop>
          <div class="about-header">
            <h3>关于我们</h3>
            <button class="close-btn" @click="showAbout = false">×</button>
          </div>
          <div class="about-body">
            <div class="about-logo">🎭</div>
            <h2>大麦网</h2>
            <p class="version">版本 1.0.0</p>
            <p class="description">
              大麦网是一个专业的在线票务平台，为您提供演唱会、体育赛事、戏剧舞蹈等各类演出门票的在线购买服务。
            </p>
            <div class="features">
              <div class="feature-item">
                <span class="feature-icon">🎫</span>
                <span>海量演出</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">⚡</span>
                <span>快速购票</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🔒</span>
                <span>安全支付</span>
              </div>
            </div>
            <p class="copyright">
              © 2026 大麦网 All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </transition>

    <!-- 提示消息 -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '../api/request.js'

const router = useRouter()

const user = ref(null)
const isLoggedIn = computed(() => !!localStorage.getItem('userId'))
const userId = computed(() => parseInt(localStorage.getItem('userId') || '0'))

const saving = ref(false)
const showAbout = ref(false)

const form = reactive({
  username: '',
  phone: '',
  email: '',
  nickname: ''
})

const settings = reactive({
  notifications: true,
  emailNotify: false,
  darkMode: false
})

const toast = ref({ show: false, message: '', type: 'info' })

const showToast = (message, type = 'info') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const loadProfile = async () => {
  if (!userId.value) return
  
  try {
    user.value = await request.get(`/api/user/${userId.value}`)
    
    // 填充表单
    form.username = user.value.username || ''
    form.phone = user.value.phone || ''
    form.email = user.value.email || ''
    form.nickname = user.value.nickname || ''
  } catch (error) {
    console.error('加载用户信息失败:', error)
    showToast('加载用户信息失败', 'error')
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    const res = await request.put('/api/user/update', {
      id: userId.value,
      phone: form.phone,
      email: form.email,
      nickname: form.nickname
    })
    
    if (res && res.includes('成功')) {
      showToast('保存成功！', 'success')
      await loadProfile()
    } else {
      showToast(res || '保存失败', 'error')
    }
  } catch (error) {
    console.error('保存失败:', error)
    showToast('保存失败，请重试', 'error')
  } finally {
    saving.value = false
  }
}

const handleLogout = () => {
  if (!confirm('确定要退出登录吗？')) return
  
  localStorage.clear()
  showToast('已退出登录', 'info')
  setTimeout(() => {
    router.push('/login')
  }, 500)
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  padding-bottom: 40px;
}

.header {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  padding: 20px;
  color: white;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.placeholder {
  width: 80px;
}

.profile-card {
  max-width: 1200px;
  margin: -30px auto 20px;
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  position: relative;
  z-index: 10;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
  font-size: 36px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(255, 77, 77, 0.3);
}

.username {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.admin-badge {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.quick-access {
  max-width: 1200px;
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.access-item {
  background: white;
  padding: 30px 20px;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.access-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.access-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.access-text {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.form-section, .settings-section {
  max-width: 1200px;
  margin: 20px auto;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid #FF4D4D;
}

.form-card, .settings-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s;
  outline: none;
}

.form-group input:focus {
  border-color: #FF4D4D;
}

.form-group input:disabled {
  background: #f5f5f5;
  color: #999;
}

.btn-save {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(255, 77, 77, 0.3);
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 77, 77, 0.4);
}

.btn-save:disabled {
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

.loading-spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
  margin: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-icon {
  font-size: 24px;
}

.setting-text {
  font-size: 15px;
  color: #333;
}

.switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #ccc;
  border-radius: 28px;
  transition: all 0.3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s;
}

input:checked + .slider {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.login-prompt {
  max-width: 1200px;
  margin: 60px auto;
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 16px;
}

.prompt-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.prompt-text {
  font-size: 18px;
  color: #999;
  margin-bottom: 24px;
}

.btn-login {
  padding: 14px 40px;
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(255, 77, 77, 0.3);
}

.btn-login:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 77, 77, 0.4);
}

.logout-section {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.btn-logout {
  width: 100%;
  padding: 16px;
  background: white;
  color: #ff4d4f;
  border: 2px solid #ff4d4f;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #fff1f0;
}

.about-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.about-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.about-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.about-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #999;
  cursor: pointer;
  line-height: 1;
}

.about-body {
  padding: 30px;
  text-align: center;
}

.about-logo {
  font-size: 80px;
  margin-bottom: 16px;
}

.about-body h2 {
  margin: 0 0 8px;
  font-size: 24px;
  color: #333;
}

.version {
  font-size: 13px;
  color: #999;
  margin: 0 0 20px;
}

.description {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin: 0 0 24px;
}

.features {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.feature-icon {
  font-size: 28px;
}

.feature-item span:last-child {
  font-size: 13px;
  color: #666;
}

.copyright {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.toast {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: #333;
  color: white;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.toast.error {
  background: #ff4d4f;
}

.toast.success {
  background: #52c41a;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

@media (max-width: 768px) {
  .quick-access {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .access-item {
    padding: 20px 12px;
  }
  
  .access-icon {
    font-size: 32px;
  }
}
</style>
