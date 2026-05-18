<template>
  <div class="seat-page">
    <div class="header">
      <div class="header-content">
        <button class="back-btn" @click="router.push('/')">← 返回</button>
        <h1 class="title">{{ showTitle }}</h1>
        <div class="user-info">
          <span class="username">{{ username }}</span>
        </div>
      </div>
    </div>

    <div class="show-card">
      <div class="show-info">
        <h2 class="show-title">{{ showTitle }}</h2>
        <p class="show-venue">📍 {{ showLocation }}</p>
        <p class="show-time">🕐 {{ showTime }}</p>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-value">{{ filteredSeats.length }}</div>
        <div class="stat-label">总座位</div>
      </div>
      <div class="stat-item">
        <div class="stat-value available">{{ availableCount }}</div>
        <div class="stat-label">可售</div>
      </div>
      <div class="stat-item">
        <div class="stat-value sold">{{ soldCount }}</div>
        <div class="stat-label">已售</div>
      </div>
      <div class="stat-item">
        <div class="stat-value selected">{{ selectedSeats.length }}</div>
        <div class="stat-label">已选</div>
      </div>
    </div>

    <div class="zone-filter">
      <button :class="{active: zoneFilter === 'ALL'}" @click="zoneFilter = 'ALL'">全部</button>
      <button :class="{active: zoneFilter === 'A'}" @click="zoneFilter = 'A'">VIP区</button>
      <button :class="{active: zoneFilter === 'B'}" @click="zoneFilter = 'B'">看台A</button>
      <button :class="{active: zoneFilter === 'C'}" @click="zoneFilter = 'C'">看台B</button>
      <button :class="{active: showRatings}" @click="toggleRatings" class="rating-toggle">
        ⭐ 查看评价
      </button>
    </div>

    <div class="stage">
      <div class="stage-light left"></div>
      <div class="stage-board">🎭 STAGE 舞 台</div>
      <div class="stage-light right"></div>
    </div>

    <div class="seats-container" v-if="filteredSeats.length > 0">
      <div class="seat-grid">
        <div
          v-for="seat in filteredSeats"
          :key="seat.id"
          class="seat"
          :class="getSeatClass(seat)"
          @click="toggleSeat(seat)"
        >
          <span class="seat-number">{{ seat.seatNumber }}</span>
          <span class="seat-price">¥{{ seat.price }}</span>
        </div>
      </div>
    </div>

    <div class="loading-seats" v-else-if="loading">
      <div class="loading-spinner"></div>
      <p>正在加载座位...</p>
      <p class="debug-info">showId: {{ showId }}</p>
    </div>

    <div class="no-seats" v-else>
      <p>暂无座位</p>
      <button class="btn-init" @click="initSeats">初始化座位</button>
    </div>

    <div class="bottom-bar" v-if="selectedSeats.length > 0">
      <div class="selected-info">
        <span class="selected-count">已选 {{ selectedSeats.length }} 张</span>
        <span class="selected-total">合计: ¥{{ totalPrice }}</span>
      </div>
      <button class="btn-submit" @click="submitOrder">提交订单</button>
    </div>

    <div class="toast" v-if="toast">{{ toast }}</div>

    <!-- 用户评价区域 -->
    <div class="ratings-section" v-if="!loading && showRatings">
      <div class="ratings-header">
        <h3>⭐ 用户评价</h3>
        <button class="close-ratings" @click="showRatings = false">收起</button>
      </div>
      
      <!-- 评分概览 -->
      <div class="rating-summary" v-if="ratingSummary">
        <div class="summary-score">
          <div class="big-score">{{ Number(ratingSummary.avgScore || 0).toFixed(1) }}</div>
          <div class="score-stars">
            <span v-for="i in 5" :key="i" :class="{ active: i <= Math.round(ratingSummary.avgScore || 0) }">⭐</span>
          </div>
          <div class="score-count">{{ ratingSummary.count || 0 }} 人评价</div>
        </div>
        <div class="rating-bars">
          <div class="rating-bar-item" v-for="i in 5" :key="i">
            <span class="bar-label">{{ 6 - i }}星</span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: getRatingPercent(6 - i) + '%' }"></div>
            </div>
            <span class="bar-count">{{ getRatingCount(6 - i) }}</span>
          </div>
        </div>
      </div>

      <!-- 评价列表 -->
      <div class="ratings-list" v-if="ratings.length > 0">
        <div class="rating-card" v-for="r in ratings" :key="r.id">
          <div class="rating-user">
            <div class="user-avatar">用户</div>
            <div class="user-info">
              <span class="user-name">用户 #{{ r.userId }}</span>
              <div class="user-stars">
                <span v-for="i in 5" :key="i" :class="{ active: i <= r.score }">⭐</span>
              </div>
            </div>
            <span class="rating-time">{{ formatRatingTime(r.createTime) }}</span>
          </div>
          <div class="rating-content" v-if="r.content">{{ r.content }}</div>
          <div class="rating-content empty" v-else>用户未留下文字评价</div>
        </div>
        
        <div class="load-more" v-if="hasMoreRatings" @click="loadMoreRatings">
          加载更多评价
        </div>
        <div class="no-more" v-else-if="ratings.length > 0">
          已显示全部评价
        </div>
      </div>
      
      <div class="empty-ratings" v-else>
        <span>暂无评价</span>
        <span class="hint">成为第一个评价的用户吧！</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const showId = ref(0)
const showTitle = ref('加载中...')
const showLocation = ref('')
const showTime = ref('')
const seats = ref([])
const selectedSeats = ref([])
const loading = ref(true)
const toast = ref('')
const zoneFilter = ref('ALL')

const username = localStorage.getItem('username') || '未登录'
const userId = computed(() => parseInt(localStorage.getItem('userId') || '0'))

const availableCount = computed(() => filteredSeats.value.filter(s => s.status === 0).length)
const soldCount = computed(() => filteredSeats.value.filter(s => s.status === 1).length)
const totalPrice = computed(() => selectedSeats.value.reduce((sum, s) => sum + parseFloat(s.price), 0))

const filteredSeats = computed(() => {
  if (zoneFilter.value === 'ALL') return seats.value
  return seats.value.filter(s => getZone(s.seatNumber) === zoneFilter.value)
})

function getZone(seatNumber) {
  if (!seatNumber) return 'C'
  // 格式 "1-1" 根据排数判断
  if (seatNumber.includes('-')) {
    const row = parseInt(seatNumber.split('-')[0])
    if (row <= 3) return 'A'  // 1-3排是VIP区
    if (row <= 6) return 'B'  // 4-6排是看台A区
    return 'C'                 // 7-10排是看台B区
  }
  return 'C'
}

function getSeatClass(seat) {
  const zone = getZone(seat.seatNumber)
  const isSelected = selectedSeats.value.find(s => s.id === seat.id)
  if (isSelected) return `zone-${zone} seat-selected`
  if (seat.status === 1) return `zone-${zone} seat-sold`
  return `zone-${zone} seat-available`
}

function toggleSeat(seat) {
  if (seat.status === 1) {
    showToast('已售出')
    return
  }
  const idx = selectedSeats.value.findIndex(s => s.id === seat.id)
  if (idx > -1) {
    selectedSeats.value.splice(idx, 1)
  } else {
    if (selectedSeats.value.length >= 10) {
      showToast('最多选10张')
      return
    }
    selectedSeats.value.push(seat)
  }
}

function showToast(msg) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 2000)
}

async function loadData() {
  loading.value = true
  
  // 从URL获取showId
  const id = route.params.showId || route.query.showId || route.params.id || route.query.id
  showId.value = parseInt(id) || 1
  
  try {
    // 加载演出信息
    const showRes = await axios.get(`/api/show/${showId.value}`)
    if (showRes.data && showRes.data.code === 0) {
      const data = showRes.data.data
      showTitle.value = data.title || '未知演出'
      showLocation.value = data.location || ''
      showTime.value = data.showTime ? data.showTime.replace(':', '时') : ''
    }
    
    // 加载座位
    const seatRes = await axios.get(`/api/seat/list/${showId.value}`)
    if (seatRes.data && seatRes.data.code === 0) {
      seats.value = seatRes.data.data || []
    }
  } catch (err) {
    console.error('加载失败:', err)
    showToast('加载失败: ' + (err.message || '未知错误'))
  }
  
  loading.value = false
}

async function initSeats() {
  try {
    showToast('正在初始化...')
    await axios.post(`/api/seat/init/${showId.value}`)
    showToast('初始化成功')
    await loadData()
  } catch (err) {
    showToast('初始化失败')
  }
}

async function submitOrder() {
  if (selectedSeats.value.length === 0) {
    showToast('请选择座位')
    return
  }
  if (!userId.value) {
    showToast('请先登录')
    router.push('/login')
    return
  }
  
  try {
    const seatIds = selectedSeats.value.map(s => s.id)
    const res = await axios.post('/api/order/createBatch', {
      userId: userId.value,
      showId: showId.value,
      seatIds: seatIds
    })
    if (res.data && res.data.code === 0) {
      showToast('订单创建成功!')
      setTimeout(() => router.push('/orders'), 1500)
    } else {
      showToast(res.data?.msg || '创建失败')
    }
  } catch (err) {
    showToast('提交失败')
  }
}

// ========== 评价功能 ==========
const showRatings = ref(false)
const ratingSummary = ref(null)
const ratings = ref([])
const ratingPage = ref(1)
const hasMoreRatings = ref(true)

async function loadRatingSummary() {
  try {
    const res = await axios.get(`/api/rating/show/${showId.value}/summary`)
    if (res.data && res.data.code === 0) {
      ratingSummary.value = res.data.data
    }
  } catch (err) {
    console.error('加载评分概览失败:', err)
  }
}

async function loadRatings(append = false) {
  try {
    const res = await axios.get(`/api/rating/show/${showId.value}/page`, {
      params: { current: ratingPage.value, size: 10 }
    })
    if (res.data && res.data.code === 0) {
      const page = res.data.data
      if (append) {
        ratings.value = [...ratings.value, ...(page.records || [])]
      } else {
        ratings.value = page.records || []
      }
      hasMoreRatings.value = (page.records || []).length >= 10
    }
  } catch (err) {
    console.error('加载评价失败:', err)
  }
}

function loadMoreRatings() {
  ratingPage.value++
  loadRatings(true)
}

function toggleRatings() {
  showRatings.value = !showRatings.value
  if (showRatings.value && ratings.value.length === 0) {
    loadRatingSummary()
    loadRatings()
  }
}

function getRatingPercent(star) {
  if (!ratingSummary.value || !ratingSummary.value.count) return 0
  const count = getRatingCount(star)
  return Math.round((count / ratingSummary.value.count) * 100)
}

function getRatingCount(star) {
  if (!ratings.value.length) return 0
  return ratings.value.filter(r => r.score === star).length
}

function formatRatingTime(time) {
  if (!time) return ''
  const d = new Date(time)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

watch(() => route.params.showId, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.seat-page { min-height: 100vh; background: linear-gradient(180deg, #f8f9fa 0%, #fff 100%); padding-bottom: 100px; }
.zone-filter { max-width: 1200px; margin: 0 auto 20px; display: flex; gap: 10px; justify-content: center; }
.zone-filter button { padding: 8px 20px; border: 2px solid #ddd; background: white; border-radius: 20px; cursor: pointer; font-size: 14px; }
.zone-filter button.active { background: #FF4D4D; color: white; border-color: #FF4D4D; }
.header { background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%); padding: 20px; color: white; }
.header-content { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
.back-btn { background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 20px; cursor: pointer; }
.title { font-size: 20px; font-weight: 600; }
.username { background: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 15px; font-size: 13px; }
.show-card { max-width: 1200px; margin: 20px auto; background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.show-title { font-size: 22px; font-weight: 700; color: #333; margin: 0 0 12px 0; }
.show-venue, .show-time { font-size: 14px; color: #666; margin: 0; }
.stats-bar { max-width: 1200px; margin: 20px auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat-item { background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.stat-value { font-size: 28px; font-weight: 700; color: #333; }
.stat-value.available { color: #52c41a; }
.stat-value.sold { color: #ff4d4f; }
.stat-value.selected { color: #FF6B35; }
.stat-label { font-size: 13px; color: #999; margin-top: 4px; }
.stage { max-width: 1200px; margin: 30px auto; display: flex; justify-content: center; align-items: center; gap: 30px; }
.stage-light { width: 60px; height: 60px; background: radial-gradient(circle, rgba(255,215,0,0.8) 0%, transparent 70%); animation: pulse 2s ease-in-out infinite; }
.stage-light.left { animation-delay: 0s; }
.stage-light.right { animation-delay: 1s; }
@keyframes pulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
.stage-board { background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); color: white; padding: 20px 60px; border-radius: 8px; font-size: 20px; font-weight: 700; letter-spacing: 4px; }
.seats-container { max-width: 1200px; margin: 20px auto; padding: 20px; }
.seat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 10px; }
.seat { border-radius: 8px; padding: 12px 8px; text-align: center; cursor: pointer; transition: all 0.3s; border: 2px solid transparent; }
.zone-A { background: linear-gradient(135deg, #FFD700, #FFA500) !important; color: white !important; }
.zone-A .seat-number, .zone-A .seat-price { color: white !important; }
.zone-B { background: linear-gradient(135deg, #87CEEB, #4169E1) !important; color: white !important; }
.zone-B .seat-number, .zone-B .seat-price { color: white !important; }
.zone-C { background: linear-gradient(135deg, #90EE90, #228B22) !important; color: white !important; }
.zone-C .seat-number, .zone-C .seat-price { color: white !important; }
.seat:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.seat-selected { border-color: #FF4D4D !important; box-shadow: 0 0 10px #FF4D4F; }
.seat-sold { background: #ddd !important; cursor: not-allowed; opacity: 0.6; }
.seat-sold:hover { transform: none; box-shadow: none; }
.seat-number { display: block; font-size: 12px; color: #666; margin-bottom: 4px; }
.seat-price { display: block; font-size: 13px; font-weight: 600; color: #333; }
.seat-price { display: block; font-size: 13px; font-weight: 600; color: #333; }
.loading-seats, .no-seats { max-width: 1200px; margin: 60px auto; text-align: center; padding: 60px; background: white; border-radius: 16px; }
.debug-info { font-size: 12px; color: #999; margin-top: 10px; }
.loading-spinner { display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(255, 77, 77, 0.2); border-top-color: #FF4D4D; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
.btn-init { margin-top: 16px; padding: 12px 32px; background: #FF4D4D; color: white; border: none; border-radius: 20px; cursor: pointer; font-size: 15px; font-weight: 600; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: white; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 -4px 20px rgba(0,0,0,0.1); z-index: 100; }
.selected-info { display: flex; flex-direction: column; gap: 4px; }
.selected-count { font-size: 14px; color: #666; }
.selected-total { font-size: 20px; font-weight: 700; color: #FF4D4D; }
.btn-submit { background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%); color: white; border: none; padding: 16px 40px; border-radius: 25px; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(255, 77, 77, 0.4); }
.toast { position: fixed; top: 100px; left: 50%; transform: translateX(-50%); padding: 12px 24px; background: #333; color: white; border-radius: 8px; font-size: 14px; z-index: 1000; }

/* 评价样式 */
.rating-toggle { margin-left: auto; background: linear-gradient(135deg, #FFD700, #FFA500) !important; color: white !important; border: none !important; }

.ratings-section { max-width: 1200px; margin: 20px auto; background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }

.ratings-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.ratings-header h3 { font-size: 18px; font-weight: 700; color: #333; margin: 0; }
.close-ratings { background: #f0f0f0; border: none; padding: 6px 16px; border-radius: 15px; cursor: pointer; font-size: 13px; }

.rating-summary { display: flex; gap: 40px; padding: 20px; background: linear-gradient(135deg, #FFF9F0, #FFF5E6); border-radius: 12px; margin-bottom: 20px; }
.summary-score { text-align: center; min-width: 120px; }
.big-score { font-size: 48px; font-weight: 800; color: #FF6B35; line-height: 1; }
.score-stars { margin: 8px 0; }
.score-stars span { font-size: 18px; opacity: 0.3; }
.score-stars span.active { opacity: 1; }
.score-count { font-size: 13px; color: #999; }

.rating-bars { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 8px; }
.rating-bar-item { display: flex; align-items: center; gap: 10px; }
.bar-label { font-size: 12px; color: #666; width: 30px; }
.bar-track { flex: 1; height: 8px; background: #E4E7ED; border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; background: linear-gradient(90deg, #FFD700, #FFA500); border-radius: 4px; transition: width 0.3s; }
.bar-count { font-size: 12px; color: #999; width: 30px; text-align: right; }

.ratings-list { display: flex; flex-direction: column; gap: 16px; }
.rating-card { padding: 16px; background: #FAFBFC; border-radius: 12px; }
.rating-user { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.user-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; }
.user-info { flex: 1; }
.user-name { font-size: 14px; font-weight: 600; color: #333; display: block; margin-bottom: 4px; }
.user-stars span { font-size: 12px; opacity: 0.3; }
.user-stars span.active { opacity: 1; }
.rating-time { font-size: 12px; color: #999; }
.rating-content { font-size: 14px; color: #555; line-height: 1.6; padding: 12px; background: white; border-radius: 8px; }
.rating-content.empty { color: #999; font-style: italic; }

.load-more, .no-more { text-align: center; padding: 16px; color: #FF4D4D; cursor: pointer; font-size: 14px; }
.no-more { color: #999; cursor: default; }

.empty-ratings { text-align: center; padding: 40px; color: #999; }
.empty-ratings .hint { display: block; margin-top: 8px; font-size: 13px; }

@media (max-width: 768px) { .stats-bar { grid-template-columns: repeat(2, 1fr); } .seat-grid { grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); } .rating-summary { flex-direction: column; gap: 20px; } }
</style>
