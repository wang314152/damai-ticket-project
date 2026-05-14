<template>
  <div class="seat-page">
    <!-- 顶部导航 -->
    <div class="header">
      <div class="header-content">
        <button class="back-btn" @click="router.push('/')">← 返回</button>
        <h1 class="title">{{ show?.title || '选择座位' }}</h1>
        <div class="user-info" @click="router.push('/profile')">
          <span class="username">{{ username }}</span>
        </div>
      </div>
    </div>

    <!-- 演出信息卡片 -->
    <div class="show-card" v-if="show">
      <div class="show-image">
        <img :src="show.imageUrl || '/placeholder.jpg'" :alt="show.title" />
        <div class="show-badge">{{ show.category || '演出' }}</div>
      </div>
      <div class="show-info">
        <h2 class="show-title">{{ show.title }}</h2>
        <p class="show-venue">📍 {{ show.venue || '待定' }}</p>
        <p class="show-time">🕐 {{ formatDate(show.showDate) }} {{ show.showTime || '' }}</p>
        <div class="show-rating" v-if="ratingInfo">
          <span class="stars">⭐ {{ ratingInfo.avgScore }}/5</span>
          <span class="count">{{ ratingInfo.count }}人评分</span>
        </div>
      </div>
    </div>

    <!-- 座位统计 -->
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-value">{{ totalSeats }}</div>
        <div class="stat-label">总座位</div>
      </div>
      <div class="stat-item">
        <div class="stat-value available">{{ availableSeats }}</div>
        <div class="stat-label">可售</div>
      </div>
      <div class="stat-item">
        <div class="stat-value sold">{{ soldSeats }}</div>
        <div class="stat-label">已售</div>
      </div>
      <div class="stat-item">
        <div class="stat-value selected">{{ selectedSeats.length }}</div>
        <div class="stat-label">已选</div>
      </div>
    </div>

    <!-- 座位区域说明 -->
    <div class="zone-legend">
      <div class="zone-item" @click="selectedZone = 'ALL'" :class="{ active: selectedZone === 'ALL' }">
        <span class="zone-dot all"></span>
        <span>全部区域</span>
      </div>
      <div class="zone-item" @click="selectedZone = 'A'" :class="{ active: selectedZone === 'A' }">
        <span class="zone-dot zone-a"></span>
        <span>VIP区 (+200)</span>
      </div>
      <div class="zone-item" @click="selectedZone = 'B'" :class="{ active: selectedZone === 'B' }">
        <span class="zone-dot zone-b"></span>
        <span>看台A区 (+100)</span>
      </div>
      <div class="zone-item" @click="selectedZone = 'C'" :class="{ active: selectedZone === 'C' }">
        <span class="zone-dot zone-c"></span>
        <span>看台B区</span>
      </div>
    </div>

    <!-- 舞台 -->
    <div class="stage">
      <div class="stage-light left"></div>
      <div class="stage-board">🎭 STAGE 舞 台</div>
      <div class="stage-light right"></div>
    </div>

    <!-- 座位网格 -->
    <div class="seats-container" v-if="seats.length > 0">
      <div class="seat-grid">
        <div
          v-for="seat in filteredSeats"
          :key="seat.id"
          class="seat"
          :class="getSeatClass(seat)"
          @click="toggleSeat(seat)"
        >
          <span class="seat-number">{{ formatSeatNumber(seat.seatNumber) }}</span>
          <span class="seat-price">¥{{ seat.price }}</span>
        </div>
      </div>
      <div class="seats-legend">
        <div class="legend-item">
          <span class="legend-dot available"></span>
          <span>可选</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot selected"></span>
          <span>已选</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot sold"></span>
          <span>已售</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot locked"></span>
          <span>锁定</span>
        </div>
      </div>
    </div>

    <div class="loading-seats" v-else-if="loading">
      <div class="loading-spinner"></div>
      <p>正在加载座位信息...</p>
    </div>

    <div class="no-seats" v-else>
      <p>暂无座位信息</p>
      <button class="btn-init" @click="initSeats">初始化座位</button>
    </div>

    <!-- 底部下单栏 -->
    <div class="bottom-bar" v-if="selectedSeats.length > 0">
      <div class="selected-info">
        <span class="selected-count">已选 {{ selectedSeats.length }} 张</span>
        <span class="selected-total">合计: ¥{{ totalPrice }}</span>
      </div>
      <button class="btn-submit" @click="submitOrder" :disabled="submitting">
        <span v-if="submitting" class="loading-spinner small"></span>
        <span v-else>提交订单</span>
      </button>
    </div>

    <!-- 提示消息 -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import request from '../api/request.js'

const router = useRouter()
const route = useRoute()

const show = ref(null)
const seats = ref([])
const selectedSeats = ref([])
const loading = ref(true)
const submitting = ref(false)
const selectedZone = ref('ALL')
const ratingInfo = ref(null)

const username = localStorage.getItem('username') || '未登录'
const userId = computed(() => parseInt(localStorage.getItem('userId') || '0'))

const toast = ref({ show: false, message: '', type: 'info' })

const showToast = (message, type = 'info') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const formatDate = (date) => {
  if (!date) return '待定'
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatSeatNumber = (seatNumber) => {
  if (!seatNumber) return ''
  const [row, col] = seatNumber.split('-')
  return `${row}排${col}座`
}

const getZone = (seatNumber) => {
  if (!seatNumber) return 'C'
  const row = parseInt(seatNumber.split('-')[0])
  if (row <= 3) return 'A'
  if (row <= 6) return 'B'
  return 'C'
}

const filteredSeats = computed(() => {
  if (selectedZone.value === 'ALL') return seats.value
  return seats.value.filter(seat => getZone(seat.seatNumber) === selectedZone.value)
})

const totalSeats = computed(() => seats.value.length)
const availableSeats = computed(() => seats.value.filter(s => s.status === 0).length)
const soldSeats = computed(() => seats.value.filter(s => s.status === 1).length)
const totalPrice = computed(() => selectedSeats.value.reduce((sum, s) => sum + parseFloat(s.price), 0))

const getSeatClass = (seat) => {
  const zone = getZone(seat.seatNumber)
  return {
    'available': seat.status === 0,
    'sold': seat.status === 1,
    'locked': seat.status === 2 && !selectedSeats.value.find(s => s.id === seat.id),
    'selected': selectedSeats.value.find(s => s.id === seat.id),
    'zone-a': zone === 'A',
    'zone-b': zone === 'B',
    'zone-c': zone === 'C'
  }
}

const toggleSeat = (seat) => {
  if (seat.status !== 0) {
    showToast(seat.status === 1 ? '该座位已售出' : '该座位已被锁定', 'error')
    return
  }

  const index = selectedSeats.value.findIndex(s => s.id === seat.id)
  if (index > -1) {
    selectedSeats.value.splice(index, 1)
  } else {
    if (selectedSeats.value.length >= 10) {
      showToast('最多只能购买10张票', 'error')
      return
    }
    selectedSeats.value.push(seat)
  }
}

const loadShow = async () => {
  try {
    const showId = route.params.id || route.query.id
    if (showId) {
      show.value = await request.get(`/api/show/${showId}`)
      // 获取评分信息
      try {
        const ratingRes = await request.get(`/api/rating/show/${showId}/summary`)
        if (ratingRes && ratingRes.data) {
          ratingInfo.value = ratingRes.data
        }
      } catch (e) {
        console.log('暂无评分信息')
      }
    }
  } catch (error) {
    console.error('加载演出信息失败:', error)
  }
}

const loadSeats = async () => {
  loading.value = true
  try {
    const showId = route.params.id || route.query.id
    if (showId) {
      seats.value = await request.get(`/api/seat/list/${showId}`)
      if (seats.value.length === 0) {
        showToast('暂无座位，请稍后刷新或联系管理员初始化', 'warning')
      }
    }
  } catch (error) {
    console.error('加载座位失败:', error)
    showToast('加载座位信息失败', 'error')
  } finally {
    loading.value = false
  }
}

const initSeats = async () => {
  try {
    const showId = route.params.id || route.query.id
    if (showId) {
      await request.post(`/api/seat/init/${showId}`)
      showToast('座位初始化成功', 'success')
      await loadSeats()
    }
  } catch (error) {
    console.error('初始化座位失败:', error)
    showToast('初始化座位失败', 'error')
  }
}

const submitOrder = async () => {
  if (selectedSeats.value.length === 0) {
    showToast('请先选择座位', 'error')
    return
  }

  if (!userId.value) {
    showToast('请先登录', 'error')
    router.push('/login')
    return
  }

  submitting.value = true
  try {
    const showId = route.params.id || route.query.id
    const seatIds = selectedSeats.value.map(s => s.id)

    const res = await request.post('/api/order/createBatch', {
      userId: userId.value,
      showId: parseInt(showId),
      seatIds: seatIds
    })

    if (res && res.success !== false) {
      showToast('订单创建成功！正在跳转支付...', 'success')
      setTimeout(() => {
        router.push('/orders')
      }, 1500)
    } else {
      showToast(res?.msg || '订单创建失败', 'error')
    }
  } catch (error) {
    console.error('提交订单失败:', error)
    showToast('订单提交失败，请重试', 'error')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await loadShow()
  await loadSeats()
})
</script>

<style scoped>
.seat-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  padding-bottom: 100px;
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

.back-btn:hover {
  background: rgba(255,255,255,0.3);
}

.title {
  font-size: 20px;
  font-weight: 600;
}

.user-info {
  cursor: pointer;
}

.username {
  background: rgba(255,255,255,0.2);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 13px;
}

.show-card {
  max-width: 1200px;
  margin: 20px auto;
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.show-image {
  width: 180px;
  height: 240px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.show-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.show-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #FF4D4D;
  color: white;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 12px;
}

.show-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.show-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.show-venue, .show-time {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.show-rating {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars {
  color: #FFB800;
  font-weight: 600;
}

.count {
  color: #999;
  font-size: 13px;
}

.stats-bar {
  max-width: 1200px;
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.stat-value.available { color: #52c41a; }
.stat-value.sold { color: #ff4d4f; }
.stat-value.selected { color: #FF6B35; }

.stat-label {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.zone-legend {
  max-width: 1200px;
  margin: 20px auto;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.zone-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.zone-item.active {
  border-color: #FF4D4D;
  background: #FFF5F5;
}

.zone-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.zone-dot.all { background: #52c41a; }
.zone-dot.zone-a { background: #FFD700; }
.zone-dot.zone-b { background: #87CEEB; }
.zone-dot.zone-c { background: #90EE90; }

.stage {
  max-width: 1200px;
  margin: 30px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.stage-light {
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(255,215,0,0.8) 0%, transparent 70%);
  animation: pulse 2s ease-in-out infinite;
}

.stage-light.left { animation-delay: 0s; }
.stage-light.right { animation-delay: 1s; }

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.stage-board {
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: white;
  padding: 20px 60px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 4px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.seats-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

.seat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.seat {
  background: #f0f0f0;
  border-radius: 8px;
  padding: 12px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.seat.available:hover {
  background: #e8f5e9;
  border-color: #52c41a;
  transform: scale(1.05);
}

.seat.selected {
  background: #FFF3E0;
  border-color: #FF6B35;
  transform: scale(1.05);
}

.seat.sold {
  background: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.seat.locked {
  background: #FFF5F5;
  cursor: not-allowed;
  opacity: 0.6;
}

.seat-number {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.seat-price {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.seats-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 16px;
  background: white;
  border-radius: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-dot.available { background: #52c41a; }
.legend-dot.selected { background: #FF6B35; }
.legend-dot.sold { background: #d9d9d9; }
.legend-dot.locked { background: #FFF5F5; border: 1px solid #FF4D4F; }

.loading-seats, .no-seats {
  max-width: 1200px;
  margin: 60px auto;
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 16px;
}

.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 77, 77, 0.2);
  border-top-color: #FF4D4D;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

.loading-spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
  margin: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-init {
  margin-top: 16px;
  padding: 12px 32px;
  background: #FF4D4D;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-init:hover {
  background: #FF6B35;
  transform: scale(1.05);
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
  z-index: 100;
}

.selected-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.selected-count {
  font-size: 14px;
  color: #666;
}

.selected-total {
  font-size: 20px;
  font-weight: 700;
  color: #FF4D4D;
}

.btn-submit {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
  border: none;
  padding: 16px 40px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(255, 77, 77, 0.4);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 77, 77, 0.5);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.toast.warning {
  background: #faad14;
  color: #333;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

@media (max-width: 768px) {
  .show-card {
    flex-direction: column;
  }
  
  .show-image {
    width: 100%;
    height: 200px;
  }
  
  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .seat-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }
}
</style>
