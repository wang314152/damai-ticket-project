<template>
  <div class="admin-page">
    <header class="header">
      <button @click="router.push('/')">← 返回</button>
      <h1>🛠️ 管理后台</h1>
    </header>

    <div class="tabs">
      <button :class="{ active: tab === 'show' }" @click="tab = 'show'">演出管理</button>
      <button :class="{ active: tab === 'seat' }" @click="tab = 'seat'">座位管理</button>
      <button :class="{ active: tab === 'order' }" @click="tab = 'order'">订单管理</button>
    </div>

    <!-- 演出管理 -->
    <div v-if="tab === 'show'" class="section">
      <h3>演出列表</h3>
      <div class="table-wrap">
        <table><thead><tr><th>ID</th><th>名称</th><th>类别</th><th>价格</th><th>时间</th></tr></thead>
          <tbody><tr v-for="s in shows" :key="s.id"><td>{{ s.id }}</td><td>{{ s.title }}</td><td>{{ s.category }}</td><td>¥{{ s.price }}</td><td>{{ s.showTime }}</td></tr></tbody>
        </table>
      </div>
    </div>

    <!-- 座位管理 -->
    <div v-if="tab === 'seat'" class="section">
      <h3>重置被锁定的座位</h3>
      <p class="tip">将所有锁定状态(status=2)的座位释放为可用</p>
      <button @click="resetSeats" class="btn-primary">🔄 重置全部座位</button>
      <input v-model="resetShowId" placeholder="输入演ID单独重置" style="padding:10px;border:1px solid #ddd;border-radius:8px;margin-top:10px;width:200px;" />
      <button @click="resetOneSeat" class="btn-primary">重置指定演出</button>
    </div>

    <!-- 订单管理 -->
    <div v-if="tab === 'order'" class="section">
      <h3>订单列表</h3>
      <div class="table-wrap">
        <table><thead><tr><th>订单ID</th><th>用户ID</th><th>演出</th><th>金额</th><th>状态</th></tr></thead>
          <tbody><tr v-for="o in orders" :key="o.id"><td>{{ o.id }}</td><td>{{ o.userId }}</td><td>{{ o.showId }}</td><td>¥{{ o.amount }}</td><td>{{ {0:'待支付',1:'已支付',2:'已取消'}[o.status] }}</td></tr></tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tab = ref('show')
const shows = ref([])
const orders = ref([])
const resetShowId = ref('')

async function resetSeats() {
  try {
    await axios.post('/api/seat/resetAll')
    alert('已重置全部被锁定的座位！')
  } catch(e) { alert('失败: ' + e.message) }
}

async function resetOneSeat() {
  if (!resetShowId.value) return alert('请输入演出ID')
  try {
    await axios.post(`/api/seat/reset/${resetShowId.value}`)
    alert(`已重置演出 ${resetShowId.value} 的座位！`)
  } catch(e) { alert('失败') }
}

onMounted(async () => {
  try {
    const [sRes, oRes] = await Promise.all([axios.get('/api/show/list'), axios.get('/api/order/user/0')])
    const sd = sRes.data
    shows.value = Array.isArray(sd?.data) ? sd.data : Array.isArray(sd) ? sd : []
    orders.value = Array.isArray(oRes.data) ? oRes.data : []
  } catch(e) {}
})
</script>

<style scoped>
.admin-page { min-height:100vh; background:#f5f5f5; padding-bottom:30px; }
.header { background:#333; color:white; padding:15px 20px; display:flex; align-items:center; gap:16px; border-radius:12px; margin:15px; }
.tabs { display:flex; gap:8px; padding:10px 20px; background:white; margin:-5px 20px 15px; border-radius:10px; }
.tabs button { padding:10px 24px; border:none; border-radius:18px; cursor:pointer; font-size:14px; background:#f0f0f0; color:#666; transition:all .2s; }
.tabs button.active { background:#FF4D4F; color:white; }
.section { max-width:1000px; margin:0 auto; padding:20px; background:white; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,0.04); }
.section h3 { font-size:18px; color:#333; margin-bottom:16px; }
.tip { color:#999; font-size:13px; margin-bottom:12px; }
.btn-primary { padding:12px 28px; background:#FF4D4F; color:white; border:none; border-radius:18px; cursor:pointer; font-size:14px; margin-right:10px; }
.table-wrap { overflow-x:auto; }
table { width:100%; border-collapse:collapse; font-size:13px; }
th,td { padding:12px; text-align:left; border-bottom:1px solid #eee; }
th { background:#fafafa; color:#666; font-weight:600; }
</style>
