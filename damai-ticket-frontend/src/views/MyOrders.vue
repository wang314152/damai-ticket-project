<template>
  <div class="orders-page">
    <!-- 顶部导航 -->
    <div class="header">
      <div class="header-content">
        <button class="back-btn" @click="router.push('/')">
          <span>←</span> 返回
        </button>
        <h1>我的订单</h1>
        <div class="header-right">
          <button class="filter-btn" @click="showFilter = !showFilter">
            🔍 筛选
          </button>
        </div>
      </div>
    </div>

    <!-- 订单统计卡片 -->
    <div class="stats-container">
      <div class="stats-card" @click="filterStatus = 'ALL'" :class="{ active: filterStatus === 'ALL' }">
        <div class="stats-bg all"></div>
        <div class="stats-content">
          <div class="stats-num">{{ stats.total }}</div>
          <div class="stats-label">全部订单</div>
        </div>
      </div>
      <div class="stats-card" @click="filterStatus = 0" :class="{ active: filterStatus === 0 }">
        <div class="stats-bg pending"></div>
        <div class="stats-content">
          <div class="stats-num">{{ stats.pending }}</div>
          <div class="stats-label">待支付</div>
          <div class="stats-hint" v-if="stats.pending > 0">点击处理</div>
        </div>
      </div>
      <div class="stats-card" @click="filterStatus = 1" :class="{ active: filterStatus === 1 }">
        <div class="stats-bg completed"></div>
        <div class="stats-content">
          <div class="stats-num">{{ stats.completed }}</div>
          <div class="stats-label">已完成</div>
        </div>
      </div>
      <div class="stats-card" @click="filterStatus = 2" :class="{ active: filterStatus === 2 }">
        <div class="stats-bg cancelled"></div>
        <div class="stats-content">
          <div class="stats-num">{{ stats.cancelled }}</div>
          <div class="stats-label">已取消</div>
        </div>
      </div>
    </div>

    <!-- 筛选面板 -->
    <div class="filter-panel" v-if="showFilter">
      <div class="filter-header">
        <span>筛选条件</span>
        <button @click="resetFilter">重置</button>
      </div>
      <div class="filter-content">
        <div class="filter-item">
          <label>时间范围</label>
          <div class="filter-tags">
            <span :class="{ active: timeRange === 'all' }" @click="timeRange = 'all'">全部</span>
            <span :class="{ active: timeRange === 'week' }" @click="timeRange = 'week'">近一周</span>
            <span :class="{ active: timeRange === 'month' }" @click="timeRange = 'month'">近一月</span>
            <span :class="{ active: timeRange === '3month' }" @click="timeRange = '3month'">近三月</span>
          </div>
        </div>
        <div class="filter-item">
          <label>演出类型</label>
          <div class="filter-tags">
            <span :class="{ active: categoryFilter === '' }" @click="categoryFilter = ''">全部</span>
            <span :class="{ active: categoryFilter === '演唱会' }" @click="categoryFilter = '演唱会'">演唱会</span>
            <span :class="{ active: categoryFilter === '话剧' }" @click="categoryFilter = '话剧'">话剧</span>
            <span :class="{ active: categoryFilter === '体育' }" @click="categoryFilter = '体育赛事'">体育</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="orders-container">
      <div class="orders-header">
        <span class="orders-count">共 {{ filteredOrders.length }} 个订单</span>
        <span class="orders-total" v-if="filteredOrders.length > 0">
          消费总计: <strong>¥{{ totalAmount }}</strong>
        </span>
      </div>

      <!-- 待支付订单优先显示 -->
      <div class="order-cards" v-if="!loading">
        <div class="order-card" v-for="order in filteredOrders" :key="order.id">
          <!-- 订单状态横幅 -->
          <div class="order-banner" :class="getStatusClass(order.status)">
            <span class="banner-icon">{{ getStatusIcon(order.status) }}</span>
            <span class="banner-text">{{ getStatusText(order.status) }}</span>
            <span class="banner-time" v-if="order.status === 0 && order.expireTime">
              剩余 {{ getCountdown(order.expireTime) }}
            </span>
          </div>

          <!-- 演出信息 -->
          <div class="order-show" @click="goToSeat(order.showId)">
            <img :src="getShowImage(order.showId)" class="show-img" />
            <div class="show-detail">
              <h3 class="show-title">{{ getShowTitle(order.showId) }}</h3>
              <div class="show-meta">
                <span>📍 {{ getShowLocation(order.showId) }}</span>
                <span>🕐 {{ getShowTime(order.showId) }}</span>
              </div>
            </div>
            <div class="show-arrow">›</div>
          </div>

          <!-- 座位信息 -->
          <div class="order-seats">
            <div class="seats-header">
              <span>🎫 电子票</span>
              <span class="ticket-count">{{ getSeatCount(order) }}张</span>
            </div>
            <div class="seats-list">
              <div class="seat-item" v-for="seat in getSeatList(order)" :key="seat.id">
                <span class="seat-num">{{ seat.seatNumber || '座位' + seat.seatId }}</span>
                <span class="seat-zone">{{ getSeatZone(seat.seatNumber) }}</span>
                <span class="seat-price">¥{{ seat.price || order.amount }}</span>
              </div>
            </div>
          </div>

          <!-- 订单信息 -->
          <div class="order-info">
            <div class="info-row">
              <span class="info-label">订单编号</span>
              <span class="info-value">{{ order.id }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">下单时间</span>
              <span class="info-value">{{ formatDateTime(order.createTime) }}</span>
            </div>
          </div>

          <!-- 底部操作栏 -->
          <div class="order-footer">
            <div class="order-amount">
              <span class="amount-label">实付金额</span>
              <span class="amount-value">¥{{ order.amount }}</span>
            </div>
            <div class="order-actions">
              <!-- 待支付 -->
              <template v-if="order.status === 0">
                <button class="btn-cancel" @click="cancelOrder(order)">取消</button>
                <button class="btn-pay" @click="payOrder(order)">
                  立即支付
                  <span class="pay-countdown" v-if="order.expireTime">{{ getCountdown(order.expireTime) }}</span>
                </button>
              </template>
              <!-- 已完成 -->
              <template v-else-if="order.status === 1">
                <button class="btn-ticket" @click="showTicketModal(order)">查看电子票</button>
                <button class="btn-rate" @click="toggleRating(order)" v-if="!order.hasRating">
                  ⭐ 评分
                </button>
                <button class="btn-rated" v-else disabled>
                  {{ order.rating || 5 }}⭐ 已评分
                </button>
              </template>
              <!-- 已取消 -->
              <template v-else>
                <button class="btn-delete" @click="deleteOrder(order)">删除订单</button>
                <button class="btn-rebuy" @click="rebuy(order)">再次购买</button>
              </template>
            </div>
          </div>

          <!-- 评分面板 -->
          <div class="rating-panel" v-if="order.showRating && order.status === 1">
            <div class="rating-header">
              <span>为这场演出打分</span>
              <button @click="order.showRating = false">收起</button>
            </div>
            <div class="rating-stars" @mouseleave="order.hoverRating = 0">
              <span
                v-for="star in 5"
                :key="star"
                :class="{ active: star <= (order.hoverRating || order.tempRating || 0) }"
                @mouseenter="order.hoverRating = star"
                @click="submitRating(order, star)"
              >⭐</span>
            </div>
            <textarea v-model="order.ratingContent" placeholder="写下你的评价..." class="rating-input"></textarea>
          </div>
        </div>

        <!-- 空状态 -->
        <div class="empty-state" v-if="filteredOrders.length === 0">
          <div class="empty-icon">
            <span v-if="filterStatus === 0">💳</span>
            <span v-else-if="filterStatus === 1">✅</span>
            <span v-else-if="filterStatus === 2">🗑️</span>
            <span v-else>📋</span>
          </div>
          <h3>{{ getEmptyText() }}</h3>
          <p>{{ getEmptyHint() }}</p>
          <button class="btn-go" @click="router.push('/')" v-if="filterStatus !== 'ALL'">
            {{ filterStatus === 0 ? '去支付' : '去看看演出' }}
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div class="loading-state" v-else>
        <div class="loading-spinner"></div>
        <p>加载订单中...</p>
      </div>
    </div>

    <!-- 电子票弹窗 -->
    <div class="ticket-modal" v-if="ticketModal.show">
      <div class="ticket-content" @click="ticketModal.show = false">
        <div class="ticket-card">
          <div class="ticket-header">
            <span>🎫 电子票</span>
            <button @click="ticketModal.show = false">×</button>
          </div>
          <div class="ticket-show">
            <h3>{{ getShowTitle(ticketModal.order?.showId) }}</h3>
            <p>{{ getShowTime(ticketModal.order?.showId) }}</p>
            <p>{{ getShowLocation(ticketModal.order?.showId) }}</p>
          </div>
          <div class="ticket-divider">
            <div class="circle left"></div>
            <div class="dashed"></div>
            <div class="circle right"></div>
          </div>
          <div class="ticket-seats">
            <div class="seat-qr">
              <div class="qr-placeholder">二维码区域</div>
            </div>
            <div class="seat-details">
              <p v-for="seat in getSeatList(ticketModal.order)" :key="seat.id">
                {{ seat.seatNumber || '座位' + seat.seatId }} | ¥{{ seat.price || ticketModal.order?.amount }}
              </p>
            </div>
          </div>
          <div class="ticket-footer">
            <p>订单号: {{ ticketModal.order?.id }}</p>
            <p>请在入场时出示此票</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付后评分弹窗 -->
    <div class="rating-popup" v-if="ratingDialogVisible">
      <div class="rating-overlay" @click="closeRatingDialog"></div>
      <div class="rating-dialog">
        <div class="rating-dialog-header">
          <h3>🎉 支付成功！</h3>
          <p class="dialog-subtitle">感谢您的购买，请为这场演出打分</p>
        </div>
        
        <div class="rating-dialog-body">
          <div class="show-preview" v-if="currentRatingOrder">
            <span class="show-name">{{ getShowTitle(currentRatingOrder.showId) }}</span>
          </div>
          
          <div class="star-rating">
            <span
              v-for="star in 5"
              :key="star"
              :class="{ active: star <= tempRatingScore }"
              @click="tempRatingScore = star"
            >⭐</span>
          </div>
          <p class="rating-hint">点击星星选择评分 ({{ tempRatingScore }}星)</p>
          
          <textarea 
            v-model="tempRatingContent" 
            placeholder="写下您的评价（选填）..." 
            class="rating-textarea"
          ></textarea>
        </div>
        
        <div class="rating-dialog-footer">
          <button class="btn-skip" @click="closeRatingDialog">稍后评价</button>
          <button class="btn-submit-rating" @click="submitRatingDialog">提交评价</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div class="toast" v-if="toast.show" :class="toast.type">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '../api/request.js'

const router = useRouter()

const orders = ref([])
const shows = ref({})
const loading = ref(true)
const toast = ref({ show: false, message: '', type: 'info' })
const filterStatus = ref('ALL')
const showFilter = ref(false)
const timeRange = ref('all')
const categoryFilter = ref('')
const ticketModal = ref({ show: false, order: null })

// 倒计时更新
let countdownInterval = null

const userId = computed(() => parseInt(localStorage.getItem('userId') || '0'))

const stats = computed(() => ({
  total: orders.value.length,
  pending: orders.value.filter(o => o.status === 0).length,
  completed: orders.value.filter(o => o.status === 1).length,
  cancelled: orders.value.filter(o => o.status === 2).length
}))

const filteredOrders = computed(() => {
  let result = orders.value
  
  // 状态筛选
  if (filterStatus.value !== 'ALL') {
    result = result.filter(o => o.status === filterStatus.value)
  }
  
  // 时间筛选
  if (timeRange.value !== 'all') {
    const now = Date.now()
    const ranges = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      '3month': 90 * 24 * 60 * 60 * 1000
    }
    const diff = ranges[timeRange.value]
    result = result.filter(o => {
      const createTime = new Date(o.createTime).getTime()
      return now - createTime < diff
    })
  }
  
  // 分类筛选
  if (categoryFilter.value) {
    result = result.filter(o => {
      const show = shows.value[o.showId]
      return show && show.category === categoryFilter.value
    })
  }
  
  // 待支付优先排序
  return result.sort((a, b) => {
    if (a.status === 0 && b.status !== 0) return -1
    if (b.status === 0 && a.status !== 0) return 1
    return new Date(b.createTime) - new Date(a.createTime)
  })
})

const totalAmount = computed(() => {
  return filteredOrders.value
    .filter(o => o.status === 1)
    .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0)
    .toFixed(2)
})

const showToast = (message, type = 'info') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const getStatusText = (status) => {
  const map = { 0: '待支付', 1: '已完成', 2: '已取消' }
  return map[status] || '未知'
}

const getStatusClass = (status) => {
  const map = { 0: 'pending', 1: 'completed', 2: 'cancelled' }
  return map[status] || ''
}

const getStatusIcon = (status) => {
  const map = { 0: '⏰', 1: '✅', 2: '❌' }
  return map[status] || '❓'
}

const getCountdown = (expireTime) => {
  if (!expireTime) return ''
  const diff = new Date(expireTime) - Date.now()
  if (diff <= 0) return '已过期'
  const mins = Math.floor(diff / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  return `${mins}:${secs.toString().padStart(2, '0')}`
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

const getShowTitle = (showId) => shows.value[showId]?.title || `演出 #${showId}`
const getShowImage = (showId) => {
  const img = shows.value[showId]?.imageUrl
  if (!img) return '/placeholder.jpg'
  if (img.startsWith('http')) return img
  return `http://localhost:8081${img}`
}
const getShowLocation = (showId) => shows.value[showId]?.location || '待定'
const getShowTime = (showId) => {
  const time = shows.value[showId]?.showTime
  if (!time) return '待定'
  return time.replace('_', ' ').substring(0, 16)
}

const getSeatCount = (order) => 1
const getSeatList = (order) => [{ id: order.seatId, seatNumber: order.seatNumber || '座位', price: order.amount }]
const getSeatZone = (seatNumber) => {
  if (!seatNumber) return ''
  const num = parseInt(seatNumber.split('-')[0])
  if (num <= 3) return 'VIP区'
  if (num <= 6) return '看台A'
  return '看台B'
}

const getEmptyText = () => {
  const map = { 0: '没有待支付订单', 1: '暂无已完成订单', 2: '暂无已取消订单' }
  return map[filterStatus.value] || '暂无订单'
}

const getEmptyHint = () => {
  const map = {
    0: '快去抢购心仪的演出吧',
    1: '去支持你喜欢的演出',
    2: '看看其他精彩演出'
  }
  return map[filterStatus.value] || '去看看有哪些精彩演出'
}

const resetFilter = () => {
  filterStatus.value = 'ALL'
  timeRange.value = 'all'
  categoryFilter.value = ''
  showFilter.value = false
}

const goToSeat = (showId) => router.push(`/seat/${showId}`)

const loadOrders = async () => {
  loading.value = true
  try {
    if (userId.value) {
      const data = await request.get(`/api/order/user/${userId.value}`)
      orders.value = Array.isArray(data) ? data : []
      
      // 加载演出信息
      const showIds = [...new Set(orders.value.map(o => o.showId))]
      for (const showId of showIds) {
        try {
          const show = await request.get(`/api/show/${showId}`)
          if (show) shows.value[showId] = show
        } catch (e) {}
      }
      
      // 检查评分
      for (const order of orders.value) {
        if (order.status === 1) {
          try {
            const ratingData = await request.get(`/api/rating/byOrder/${order.id}?userId=${userId.value}`)
            if (ratingData) {
              order.hasRating = true
              order.rating = ratingData.score || 0
            }
          } catch (e) {
            order.hasRating = false
          }
        }
        // 设置过期时间
        if (order.status === 0) {
          order.expireTime = new Date(new Date(order.createTime).getTime() + 30 * 60000).toISOString()
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
    const msg = await request.post('/api/order/pay', {
      orderId: order.id,
      userId: userId.value
    })
    if (String(msg).includes('成功') || msg.code === 0) {
      showToast('🎉 支付成功！', 'success')
      await loadOrders()
      
      // 支付成功后直接打开评分弹窗
      setTimeout(() => {
        const updatedOrder = orders.value.find(o => o.id === order.id)
        if (updatedOrder) {
          currentRatingOrder.value = updatedOrder
          ratingDialogVisible.value = true
          tempRatingScore.value = 5
          tempRatingContent.value = ''
        }
      }, 500)
    } else {
      showToast(String(msg) || '支付失败', 'error')
    }
  } catch (error) {
    showToast('支付失败，请重试', 'error')
  }
}

// 评分弹窗相关
const ratingDialogVisible = ref(false)
const currentRatingOrder = ref(null)
const tempRatingScore = ref(5)
const tempRatingContent = ref('')

function closeRatingDialog() {
  ratingDialogVisible.value = false
  currentRatingOrder.value = null
}

async function submitRatingDialog() {
  if (!currentRatingOrder.value) return
  
  try {
    await request.post('/api/rating/submit', {
      userId: userId.value,
      orderId: currentRatingOrder.value.id,
      score: tempRatingScore.value,
      content: tempRatingContent.value
    })
    showToast('评价成功！感谢您的反馈！', 'success')
    closeRatingDialog()
    await loadOrders()
  } catch (error) {
    showToast(error?.message || '评价失败，请重试', 'error')
  }
}

const cancelOrder = async (order) => {
  if (!confirm('确定要取消该订单吗？')) return
  try {
    const msg = await request.post('/api/order/cancel', {
      orderId: order.id,
      userId: userId.value
    })
    if (String(msg).includes('成功') || msg.code === 0) {
      showToast('订单已取消', 'success')
      await loadOrders()
    } else {
      showToast(String(msg) || '取消失败', 'error')
    }
  } catch (error) {
    showToast('取消失败，请重试', 'error')
  }
}

const toggleRating = (order) => {
  order.showRating = !order.showRating
  order.tempRating = order.rating || 0
  order.ratingContent = ''
}

const submitRating = async (order, score) => {
  try {
    await request.post('/api/rating/submit', {
      userId: userId.value,
      orderId: order.id,
      score: score,
      content: order.ratingContent || ''
    })
    showToast('评分成功，感谢您的反馈！', 'success')
    order.hasRating = true
    order.rating = score
    order.showRating = false
  } catch (error) {
    showToast('评分失败，请重试', 'error')
  }
}

const showTicketModal = (order) => {
  ticketModal.value = { show: true, order }
}

const deleteOrder = async (order) => {
  if (!confirm('确定删除该订单？')) return
  orders.value = orders.value.filter(o => o.id !== order.id)
  showToast('订单已删除', 'success')
}

const rebuy = (order) => {
  router.push(`/seat/${order.showId}`)
}

// 定时更新倒计时
const updateCountdowns = () => {
  orders.value.forEach(order => {
    if (order.status === 0 && order.expireTime) {
      order._countdown = getCountdown(order.expireTime)
    }
  })
}

onMounted(() => {
  if (!userId.value) {
    showToast('请先登录', 'error')
    router.push('/login')
    return
  }
  loadOrders()
  countdownInterval = setInterval(updateCountdowns, 1000)
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
  padding-bottom: 40px;
}

/* 顶部导航 */
.header {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  padding: 16px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 800px;
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
  display: flex;
  align-items: center;
  gap: 4px;
}

.header h1 {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 8px;
}

.filter-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  padding: 8px 14px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 13px;
}

/* 统计卡片 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  max-width: 800px;
  margin: 16px auto;
  padding: 0 16px;
}

.stats-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.stats-card:hover, .stats-card.active {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.stats-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  border-radius: 0 16px 0 60px;
}

.stats-bg.all { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stats-bg.pending { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stats-bg.completed { background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); }
.stats-bg.cancelled { background: linear-gradient(135deg, #9e9e9e 0%, #616161 100%); }

.stats-content {
  position: relative;
  z-index: 1;
}

.stats-num {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.stats-label {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.stats-hint {
  font-size: 10px;
  color: #f5576c;
  margin-top: 4px;
  font-weight: 600;
}

/* 筛选面板 */
.filter-panel {
  max-width: 800px;
  margin: 0 auto 16px;
  padding: 0 16px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 12px 12px 0 0;
  font-weight: 600;
}

.filter-header button {
  background: none;
  border: none;
  color: #FF4D4D;
  cursor: pointer;
}

.filter-content {
  background: white;
  padding: 16px;
  border-radius: 0 0 12px 12px;
}

.filter-item {
  margin-bottom: 16px;
}

.filter-item:last-child {
  margin-bottom: 0;
}

.filter-item label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.filter-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tags span {
  padding: 6px 14px;
  background: #f5f5f5;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tags span.active {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
}

/* 订单列表 */
.orders-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.orders-count {
  font-size: 13px;
  color: #999;
}

.orders-total {
  font-size: 13px;
  color: #666;
}

.orders-total strong {
  color: #FF4D4D;
}

/* 订单卡片 */
.order-card {
  background: white;
  border-radius: 20px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.order-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  color: white;
  font-weight: 600;
}

.order-banner.pending {
  background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
}

.order-banner.completed {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
}

.order-banner.cancelled {
  background: linear-gradient(135deg, #9e9e9e 0%, #616161 100%);
}

.banner-icon {
  font-size: 18px;
}

.banner-text {
  flex: 1;
}

.banner-time {
  font-size: 13px;
  background: rgba(255,255,255,0.2);
  padding: 4px 10px;
  border-radius: 10px;
}

.order-show {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.order-show:hover {
  background: #f9f9f9;
}

.show-img {
  width: 60px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 16px;
}

.show-detail {
  flex: 1;
}

.show-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.show-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

.show-arrow {
  font-size: 24px;
  color: #ddd;
}

/* 座位信息 */
.order-seats {
  margin: 0 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f0f0 100%);
  border-radius: 12px;
}

.seats-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
}

.ticket-count {
  background: #FF4D4D;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}

.seats-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.seat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  font-size: 13px;
}

.seat-num {
  font-weight: 600;
}

.seat-zone {
  color: #FF4D4D;
  font-size: 11px;
}

.seat-price {
  color: #999;
}

/* 订单信息 */
.order-info {
  padding: 12px 20px;
  display: flex;
  gap: 24px;
}

.info-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
}

.info-label {
  color: #999;
}

.info-value {
  color: #666;
}

/* 底部操作栏 */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
}

.order-amount {
  display: flex;
  flex-direction: column;
}

.amount-label {
  font-size: 11px;
  color: #999;
}

.amount-value {
  font-size: 20px;
  font-weight: 700;
  color: #FF4D4D;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.order-actions button {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-pay {
  background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
  color: white;
  position: relative;
}

.btn-pay:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(255,65,108,0.4);
}

.pay-countdown {
  display: inline-block;
  margin-left: 8px;
  background: rgba(255,255,255,0.3);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}

.btn-ticket {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-rate {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-rated {
  background: #f5f5f5;
  color: #999;
}

.btn-delete {
  background: #f5f5f5;
  color: #999;
}

.btn-rebuy {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
}

.btn-go {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 24px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 16px;
}

/* 评分面板 */
.rating-panel {
  padding: 16px 20px;
  background: #f9f9f9;
  border-top: 1px solid #eee;
}

.rating-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 12px;
}

.rating-header button {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
}

.rating-stars {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.rating-stars span {
  font-size: 32px;
  cursor: pointer;
  opacity: 0.3;
  transition: all 0.2s;
}

.rating-stars span.active {
  opacity: 1;
  transform: scale(1.2);
}

.rating-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 12px;
  resize: none;
  font-size: 13px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 8px 0;
}

.empty-state p {
  color: #999;
  margin: 0;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 77, 77, 0.2);
  border-top-color: #FF4D4D;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 电子票弹窗 */
.ticket-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.ticket-content {
  width: 100%;
  padding: 20px;
}

.ticket-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  max-width: 400px;
  margin: 0 auto;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
  font-weight: 600;
}

.ticket-header button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.ticket-show {
  padding: 20px;
  text-align: center;
}

.ticket-show h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.ticket-show p {
  margin: 4px 0;
  font-size: 13px;
  color: #666;
}

.ticket-divider {
  display: flex;
  align-items: center;
  margin: 0 -20px;
}

.ticket-divider .circle {
  width: 24px;
  height: 24px;
  background: #f5f7fa;
  border-radius: 50%;
}

.ticket-divider .dashed {
  flex: 1;
  border-top: 2px dashed #ddd;
}

.ticket-seats {
  display: flex;
  padding: 20px;
  gap: 20px;
}

.ticket-seats .qr-placeholder {
  width: 100px;
  height: 100px;
  background: #f5f5f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
}

.ticket-seats .seat-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.ticket-seats .seat-details p {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.ticket-footer {
  padding: 16px 20px;
  background: #f9f9f9;
  text-align: center;
}

.ticket-footer p {
  margin: 4px 0;
  font-size: 12px;
  color: #999;
}

/* Toast */
.toast {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: #333;
  color: white;
  border-radius: 24px;
  font-size: 14px;
  z-index: 2000;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.toast.error {
  background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
}

.toast.success {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

/* 评分弹窗样式 */
.rating-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.rating-dialog {
  position: relative;
  width: 90%;
  max-width: 420px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.rating-dialog-header {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
  padding: 24px;
  text-align: center;
}

.rating-dialog-header h3 {
  margin: 0 0 8px 0;
  font-size: 22px;
  font-weight: 700;
}

.dialog-subtitle {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.rating-dialog-body {
  padding: 24px;
}

.show-preview {
  text-align: center;
  margin-bottom: 20px;
  padding: 12px;
  background: #FAFBFC;
  border-radius: 10px;
}

.show-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.star-rating {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.star-rating span {
  font-size: 40px;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0.3;
  filter: grayscale(100%);
}

.star-rating span:hover {
  transform: scale(1.2);
}

.star-rating span.active {
  opacity: 1;
  filter: grayscale(0%);
}

.rating-hint {
  text-align: center;
  font-size: 13px;
  color: #999;
  margin: 0 0 16px 0;
}

.rating-textarea {
  width: 100%;
  height: 100px;
  padding: 12px;
  border: 2px solid #E4E7ED;
  border-radius: 12px;
  font-size: 14px;
  resize: none;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.rating-textarea:focus {
  border-color: #FF4D4D;
}

.rating-dialog-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px;
}

.btn-skip {
  flex: 1;
  padding: 14px;
  background: #F0F2F5;
  color: #666;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-skip:hover {
  background: #E4E7ED;
}

.btn-submit-rating {
  flex: 2;
  padding: 14px;
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 77, 77, 0.4);
  transition: all 0.3s;
}

.btn-submit-rating:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 77, 77, 0.5);
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .order-footer {
    flex-direction: column;
    gap: 12px;
  }
  
  .order-amount {
    align-items: center;
  }
  
  .order-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>
