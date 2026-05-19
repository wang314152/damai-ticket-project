<template>
  <div class="orders-page">
    <header class="header">
      <button class="back" @click="router.push('/')">← 返回</button>
      <h1>我的订单</h1>
    </header>

    <div v-if="loading" class="empty">加载中...</div>

    <div v-else-if="orders.length === 0" class="empty">
      <div>📋</div>
      <p>暂无订单</p>
      <button @click="router.push('/')" class="btn">去购票</button>
    </div>

    <div v-else class="order-list">
      <div v-for="o in orders" :key="o.id" :class="['order-card', statusClass(o.status)]">
        <h3>{{ showName(o.showId) }}</h3>
        <p>座位: {{ o.seatId }}</p>
        <p>金额: ¥{{ o.amount }} | {{ statusText(o.status) }}</p>
        <div v-if="o.status === 0" class="actions">
          <button @click="payOrder(o.id)" class="pay-btn">支付</button>
          <button @click="cancelOrder(o.id)" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const orders = ref([])
const loading = ref(true)
const shows = ref({})

function showName(id) { return shows.value[id] || `演出${id}` }
function statusText(s) { return {0:'⚠️ 待支付', 1:'✅ 已支付', 2:'❌ 已取消'}[s] || '' }
function statusClass(s) { return {0:'status-pending', 1:'status-paid', 2:'status-cancelled'}[s] || '' }

async function payOrder(id) {
  try {
    const uid = localStorage.getItem('userId')
    await axios.post('/api/order/pay', { orderId: id, userId: parseInt(uid) })
    alert('支付成功！'); load()
  } catch(e) { alert('支付失败') }
}

async function cancelOrder(id) {
  const uid = localStorage.getItem('userId')
  await axios.post('/api/order/cancel', { orderId: id, userId: parseInt(uid) })
  alert('已取消！'); load()
}

async function load() {
  loading.value = true
  try {
    const uid = localStorage.getItem('userId')
    const res = await axios.get(`/api/order/user/${uid}`)
    orders.value = Array.isArray(res.data) ? res.data : []
    // 加载演出名称
    for (const o of orders.value) {
      if (!shows.value[o.showId]) {
        try { const s = await axios.get(`/api/show/${o.showId}`); shows.value[o.showId] = s.data.title; } catch {}
      }
    }
  } catch(e) {}
  loading.value = false
}

onMounted(load)
</script>

<style scoped>
.orders-page { min-height:100vh; background:#f5f5f5; padding-bottom:30px; }
.header { background:linear-gradient(135deg,#FF4D4D,#FF6B35); padding:15px 20px; color:white; display:flex; align-items:center; gap:16px; }
.back { background:none; border:none; color:white; font-size:18px; cursor:pointer; }
.empty { text-align:center; padding:80px; background:white; margin:40px auto; max-width:400px; border-radius:12px; }
.empty div { font-size:48px; margin-bottom:10px; }
.btn { padding:12px 32px; background:#FF4D4D; color:white; border:none; border-radius:18px; cursor:pointer; margin-top:15px; }
.order-list { max-width:800px; margin:20px auto; display:flex; flex-direction:column; gap:14px; padding:0 20px; }
.order-card { background:white; padding:20px; border-radius:12px; border-left:4px solid #ddd; box-shadow:0 2px 8px rgba(0,0,0,0.04); }
.status-pending { border-left-color:#faad14; }
.status-paid { border-left-color:#52c41a; }
.status-cancelled { border-left-color:#999; opacity:0.6; }
.order-card h3 { font-size:17px; color:#333; margin-bottom:8px; }
.order-card p { font-size:13px; color:#666; margin:3px 0; }
.actions { margin-top:12px; display:flex; gap:10px; }
.pay-btn,.cancel-btn { padding:8px 24px; border:none; border-radius:16px; cursor:pointer; font-size:13px; }
.pay-btn { background:#52c41a; color:white; }
.cancel-btn { background:#ff4d4f; color:white; }
</style>
