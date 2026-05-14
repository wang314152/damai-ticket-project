<template>
  <div class="orders-page">
    <!-- 顶部导航 -->
    <div class="header">
      <div class="header-content">
        <button class="back-btn" @click="router.push('/')">← 返回</button>
        <h1 class="title">我的订单</h1>
        <div class="placeholder"></div>
      </div>
    </div>

    <!-- 订单统计 -->
    <div class="stats-bar">
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">全部订单</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <div class="stat-info">
          <div class="stat-value pending">{{ stats.pending }}</div>
          <div class="stat-label">待支付</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <div class="stat-value completed">{{ stats.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">❌</div>
        <div class="stat-info">
          <div class="stat-value cancelled">{{ stats.cancelled }}</div>
          <div class="stat-label">已取消</div>
        </div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="orders-list" v-if="orders.length > 0">
      <div class="order-card" v-for="order in orders" :key="order.id">
        <div class="order-header">
          <div class="order-id">订单号: #{{ order.id }}</div>
          <div class="order-status" :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </div>
        </div>

        <div class="order-content">
          <div class="show-info">
            <div class="show-title">{{ getShowTitle(order.showId) }}</div>
            <div class="seat-info">
              座位: {{ formatSeatNumber(order.seatId) }}
            </div>
            <div class="order-time">
              {{ formatDateTime(order.createTime) }}
            </div>
          </div>
          <div class="order-price">
            ¥{{ order.amount }}
          </div>
        </div>

        <!-- 评分按钮（仅已完成订单显示） -->
        <div class="order-actions" v-if="order.status === 1">
          <div class="rating-section" v-if="!order.hasRating">
            <div class="rating-prompt">演出怎么样？给个评分吧</div>
            <div class="star-rating">
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ active: star <= (hoverRating || order.rating || 0) }"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
                @click="submitRating(order, star)"
              >
                ⭐
              </span>
            </div>
          </div>
          <div class="rating-done" v-else>
            <span class="stars">⭐⭐⭐⭐⭐</span>
            <span class="rating-text">已评分</span>
          </div>
        </div>

        <div class="order-actions" v-if="order.status === 0">
          <button class="btn-cancel" @click="cancelOrder(order)">取消订单</button>
          <button class="btn-pay" @click="payOrder(order)">立即支付</button>
        </div>
      </div>
    </div>

    <div class="loading" v-else-if="loading">
      <div class="loading-spinner"></div>
      <p>正在加载订单...</p>
    </div>

    <div class="empty-state" v-else>
      <div class="empty-icon">📭</div>
      <div class="empty-text">暂无订单</div>
      <button class="btn-browse" @click="router.push('/')">去抢购</button>
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
import { useRouter } from 'vue-router'
import request from '../api/request.js'

const router = useRouter()

const orders = ref([])
const shows = ref({})
const loading = ref(true)
const showTicket = ref(false)
const selectedOrder = ref(null)
const hoverRating = ref(0)

const toast = ref({ show: false, message: '', type: 'info' })

const userId = computed(() => parseInt(localStorage.getItem('userId') || '0'))

const showToast = (message, type = 'info') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const stats = computed(() => {
  return {
    total: orders.value.length,
    pending: orders.value.filter(o => o.status === 0).length,
    completed: orders.value.filter(o => o.status === 1).length,
    cancelled: orders.value.filter(o => o.status === 2).length
  }
})

const getStatusText = (status) => {
  const map = { 0: '待支付', 1: '已完成', 2: '已取消' }
  return map[status] || '未知'
}

const getStatusClass = (status) => {
  const map = { 0: 'pending', 1: 'completed', 2: 'cancelled' }
  return map[status] || ''
}

const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatSeatNumber = (seatId) => {
  return `座位ID: ${seatId}`
}

const getShowTitle = (showId) => {
  return shows.value[showId]?.title || `演出 #${showId}`
}

const loadOrders = async () => {
  loading.value = true
  try {
    if (userId.value) {
      orders.value = await request.get(`/api/order/user/${userId.value}`)
      
      // 加载演出信息
      const showIds = [...new Set(orders.value.map(o => o.showId))]
      for (const showId of showIds) {
        try {
          const show = await request.get(`/api/show/${showId}`)
          shows.value[showId] = show
        } catch (e) {
          console.error('加载演出信息失败:', e)
        }
      }
      
      // 检查每个订单是否已评分
      for (const order of orders.value) {
        if (order.status === 1) {
          try {
            const ratingRes = await request.get(`/api/rating/byOrder/${order.id}?userId=${userId.value}`)
            if (ratingRes && ratingRes.data) {
              order.hasRating = true
              order.rating = ratingRes.data.score
            }
          } catch (e) {
            order.hasRating = false
          }
        }
      }
    }
  } catch (error) {
    console.error('加载订单失败:', error)
    showToast('加载订单失败', 'error')
  } finally {
    loading.value = false
  }
}

const payOrder = async (order) => {
  try {
    const res = await request.post('/api/order/pay', {
      orderId: order.id,
      userId: userId.value
    })
    
    if (res && res.includes('成功')) {
      showToast('支付成功！', 'success')
      await loadOrders()
    } else {
      showToast(res || '支付失败', 'error')
    }
  } catch (error) {
    console.error('支付失败:', error)
    showToast('支付失败，请重试', 'error')
  }
}

const cancelOrder = async (order) => {
  if (!confirm('确定要取消该订单吗？')) return
  
  try {
    const res = await request.post('/api/order/cancel', {
      orderId: order.id,
      userId: userId.value
    })
    
    if (res && res.includes('成功')) {
      showToast('订单已取消', 'success')
      await loadOrders()
    } else {
      showToast(res || '取消失败', 'error')
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    showToast('取消失败，请重试', 'error')
  }
}

const submitRating = async (order, score) => {
  try {
    const res = await request.post('/api/rating/submit', {
      userId: userId.value,
      orderId: order.id,
      score: score,
      content: ''
    })
    
    if (res && res.code !== 200 && !res.msg?.includes('成功')) {
      showToast(res.msg || '评分失败', 'error')
    } else {
      showToast('评分成功，感谢您的反馈！', 'success')
      order.hasRating = true
      order.rating = score
    }
  } catch (error) {
    console.error('评分失败:', error)
    showToast('评分失败，请重试', 'error')
  }
}

onMounted(() => {
  if (!userId.value) {
    showToast('请先登录', 'error')
    router.push('/login')
    return
  }
  loadOrders()
})
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
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

.stats-bar {
  max-width: 1200px;
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 32px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.stat-value.pending { color: #faad14; }
.stat-value.completed { color: #52c41a; }
.stat-value.cancelled { color: #ff4d4f; }

.stat-label {
  font-size: 13px;
  color: #999;
}

.orders-list {
  max-width: 1200px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: all 0.3s;
}

.order-card:hover {
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.order-id {
  font-size: 14px;
  color: #999;
}

.order-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.order-status.pending {
  background: #FFF7E6;
  color: #faad14;
}

.order-status.completed {
  background: #F6FFED;
  color: #52c41a;
}

.order-status.cancelled {
  background: #FFF1F0;
  color: #ff4d4f;
}

.order-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.show-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.seat-info, .order-time {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.order-price {
  font-size: 24px;
  font-weight: 700;
  color: #FF4D4D;
}

.order-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
}

.rating-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.rating-prompt {
  font-size: 14px;
  color: #666;
}

.star-rating {
  display: flex;
  gap: 4px;
}

.star {
  font-size: 28px;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0.3;
}

.star.active {
  opacity: 1;
  transform: scale(1.2);
}

.star:hover {
  transform: scale(1.2);
}

.rating-done {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #52c41a;
}

.stars {
  font-size: 16px;
  letter-spacing: 2px;
}

.btn-cancel, .btn-pay {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e8e8e8;
}

.btn-pay {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
}

.btn-pay:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 77, 77, 0.4);
}

.loading, .empty-state {
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  color: #999;
  margin-bottom: 20px;
}

.btn-browse {
  padding: 12px 32px;
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-browse:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 77, 77, 0.4);
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
  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .order-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .order-price {
    font-size: 20px;
  }
}
</style>
