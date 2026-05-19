<template>
  <div class="seat-page">
    <header class="header">
      <button class="back" @click="router.back()">←</button>
      <h1>{{ showTitle }}</h1>
      <span>{{ username }}</span>
    </header>

    <div class="show-info">
      <h2>{{ showTitle }}</h2>
      <p>📍 {{ location }} | 🕐 {{ showTime }}</p>
    </div>

    <div class="stats">
      <div>总座位: {{ seats.length }}</div>
      <div style="color:#52c41a">可售: {{ availableCount }}</div>
      <div style="color:#ff4d4f">已选: {{ selectedSeats.length }}</div>
    </div>

    <div class="stage">🎭 STAGE 舞 台</div>

    <div class="seats">
      <div v-for="s in filteredSeats" :key="s.id" :class="['seat', getSeatClass(s)]" @click="toggle(s)">
        {{ s.seatNumber }}
      </div>
    </div>

    <div v-if="selectedSeats.length > 0" class="bottom-bar">
      <span>已选 {{ selectedSeats.length }} 张 | ¥{{ totalPrice }}</span>
      <button @click="submitOrder" class="btn-submit">提交订单</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const showId = ref(0)
const showTitle = ref('')
const location = ref('')
const showTime = ref('')
const seats = ref([])
const selectedSeats = ref([])
const zoneFilter = ref('ALL')
const username = localStorage.getItem('username') || ''

const userId = computed(() => parseInt(localStorage.getItem('userId') || '0'))
const availableCount = computed(() => seats.value.filter(s => s.status === 0).length)
const totalPrice = computed(() => selectedSeats.value.reduce((sum, s) => sum + parseFloat(s.price), 0))

function getZone(num) {
  if (!num || !num.includes('-')) return 'C'
  const r = parseInt(num.split('-')[0])
  return r <= 3 ? 'A' : r <= 6 ? 'B' : 'C'
}

function getSeatClass(s) {
  const z = getZone(s.seatNumber)
  const sel = selectedSeats.value.find(x => x.id === s.id)
  if (sel) return `zone-${z} seat-sel`
  if (s.status === 1) return `zone-${z} seat-sold`
  return `zone-${z} seat-ok`
}

function toggle(s) {
  if (s.status === 1) return
  const i = selectedSeats.value.findIndex(x => x.id === s.id)
  i > -1 ? selectedSeats.value.splice(i, 1) : selectedSeats.value.push(s)
}

const filteredSeats = computed(() => {
  if (zoneFilter.value === 'ALL') return seats.value
  return seats.value.filter(s => getZone(s.seatNumber) === zoneFilter.value)
})

async function submitOrder() {
  if (!userId.value) { alert('请先登录'); router.push('/login'); return }
  try {
    const res = await axios.post('/api/order/createBatch', {
      userId: userId.value,
      showId: showId.value,
      seatIds: selectedSeats.value.map(s => s.id)
    })
    alert('订单创建成功！')
    router.push('/orders')
  } catch(e) {
    alert('下单失败: ' + (e.response?.data?.msg || e.message))
  }
}

onMounted(async () => {
  showId.value = parseInt(route.params.showId) || 1
  try {
    const sRes = await axios.get(`/api/show/${showId.value}`)
    const sd = sRes.data
    showTitle.value = sd.title; location.value = sd.location; showTime.value = sd.showTime
    const seatRes = await axios.get(`/api/seat/list/${showId.value}`)
    seats.value = Array.isArray(seatRes.data) ? seatRes.data : []
  } catch(e) { console.error('加载失败', e) }
})
</script>

<style scoped>
.seat-page { min-height:100vh; background:#f8f9fa; padding-bottom:80px; }
.header { background:linear-gradient(135deg,#FF4D4D,#FF6B35); color:white; padding:15px 20px; display:flex; align-items:center; justify-content:space-between; }
.back { background:none; border:none; color:white; font-size:22px; cursor:pointer; }
.show-info { max-width:1200px; margin:20px auto; background:white; padding:20px; border-radius:12px; text-align:center; box-shadow:0 2px 10px rgba(0,0,0,0.06); }
.stats { max-width:1200px; margin:20px auto; display:flex; gap:20px; justify-content:center; }
.stats div { background:white; padding:16px 32px; border-radius:10px; text-align:center; font-size:14px; }
.stage { text-align:center; padding:30px; background:#1a1a1a; color:white; margin:0 20px; border-radius:8px; font-size:18px; letter-spacing:4px; }
.seats { max-width:1000px; margin:20px auto; display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
.seat { width:50px; height:40px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:11px; cursor:pointer; transition:all 0.2s; border:2px solid transparent; }
.zone-A { background:linear-gradient(135deg,#FFD700,#FFA500); color:white; }
.zone-B { background:linear-gradient(135deg,#87CEEB,#4169E1); color:white; }
.zone-C { background:linear-gradient(135deg,#90EE90,#228B22); color:white; }
.seat-sel { border-color:#FF4D4F !important; box-shadow:0 0 8px #FF4D4F; transform:scale(1.1); }
.seat-sold { background:#ddd !important; opacity:0.5; cursor:not-allowed; }
.bottom-bar { position:fixed; bottom:0; left:0; right:0; background:white; padding:14px 24px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 -3px 15px rgba(0,0,0,0.1); z-index:99; }
.btn-submit { background:linear-gradient(135deg,#FF4D4D,#FF6B35); color:white; border:none; padding:12px 36px; border-radius:22px; font-size:15px; cursor:pointer; font-weight:600; }
</style>
