<template>
  <div class="page">
    <header class="header">
      <div class="header-content">
        <div class="logo" @click="router.push('/')"><span>🎭</span><span>大麦网</span></div>
        <div class="header-actions">
          <button @click="router.push('/ai')" class="btn-ai">🤖 AI助手</button>
          <button @click="router.push('/orders')" class="btn-order">📋 订单</button>
          <span class="user">{{ username }}</span>
          <button @click="logout" class="btn-logout">退出</button>
        </div>
      </div>
    </header>

    <div class="search-section">
      <div class="search-box">
        <input v-model="keyword" placeholder="搜索演出..." @keyup.enter="applyFilter" />
        <button @click="applyFilter">🔍</button>
      </div>
    </div>

    <div class="content">
      <h2>全部演出 ({{ filtered.length }})</h2>
      <div class="show-grid">
        <div v-for="item in filtered" :key="item.id" class="show-card" @click="goSeat(item.id)">
          <div class="show-img">
            <img v-if="item.imageUrl" :src="fullUrl(item.imageUrl)" />
            <div v-else class="img-placeholder">🎭</div>
          </div>
          <div class="show-info">
            <h3>{{ item.title }}</h3>
            <p>📍 {{ item.location || '待定' }}</p>
            <p>📅 {{ item.showTime || '待定' }}</p>
            <div class="price-row">
              <span class="price">¥{{ item.price }}起</span>
              <span class="buy-btn">购买</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = localStorage.getItem('username') || '未登录'
const allList = ref([])
const keyword = ref('')

const filtered = computed(() => {
  if (!keyword.value.trim()) return allList.value
  const kw = keyword.value.toLowerCase()
  return allList.value.filter(x => x.title?.toLowerCase().includes(kw))
})

function goSeat(id) { router.push(`/seat/${id}`) }
function applyFilter() {}
function fullUrl(p) { if (!p) return ''; if (p.startsWith('http')) return p; return `http://localhost:8081${p}` }
function logout() { localStorage.clear(); router.push('/login') }

onMounted(async () => {
  try {
    const res = await fetch('/api/show/list')
    const data = await res.json()
    allList.value = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []
  } catch(e) {
    // 使用演示数据
    allList.value = [
      { id:1, title:'周杰伦2026世界巡回演唱会', location:'北京国家体育场', showTime:'2026-06-15 19:30', price:1280, category:'演唱会', imageUrl:'' },
      { id:2, title:'开心麻花爆笑喜剧《乌龙山伯爵》', location:'上海人民大舞台', showTime:'2026-05-20 14:00', price:380, category:'话剧', imageUrl:'' },
      { id:3, title:'2026NBA中国赛', location:'广州体育馆', showTime:'2026-08-10 20:00', price:880, category:'体育赛事', imageUrl:'' },
      { id:4, title:'理查德克莱德曼钢琴独奏会', location:'深圳音乐厅', showTime:'2026-07-25 20:00', price:680, category:'音乐会', imageUrl:'' },
      { id:5, title:'舞剧《只此青绿》', location:'杭州大剧院', showTime:'2026-06-01 19:30', price:480, category:'舞蹈', imageUrl:'' },
      { id:6, title:'德云社相声专场', location:'南京人民大会堂', showTime:'2026-05-18 19:30', price:280, category:'曲艺杂技', imageUrl:'' },
    ]
  }
})
</script>

<style scoped>
.page { min-height:100vh; background:#f5f5f5; }
.header { background:linear-gradient(135deg,#FF4D4D,#FF6B35); padding:15px 40px; color:white; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; }
.logo { font-size:24px; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:8px; letter-spacing:2px; }
.header-actions { display:flex; align-items:center; gap:12px; }
.btn-ai,.btn-order,.btn-logout { padding:8px 16px; border-radius:18px; border:none; cursor:pointer; font-size:13px; color:white; background:rgba(255,255,255,0.2); }
.btn-logout { background:rgba(255,255,255,0.15); }
.user { padding:6px 12px; background:rgba(255,255,255,0.2); border-radius:15px; font-size:13px; }
.search-section { padding:20px; text-align:center; }
.search-box { max-width:500px; margin:0 auto; display:flex; background:white; border-radius:28px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.08); }
.search-box input { flex:1; padding:14px 20px; border:none; outline:none; font-size:15px; }
.search-box button { width:56px; background:#FF4D4D; color:white; border:none; font-size:18px; cursor:pointer; }
.content { max-width:1200px; margin:0 auto; padding:20px; }
.content h2 { font-size:22px; color:#333; margin-bottom:20px; }
.show-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; }
.show-card { background:white; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06); cursor:pointer; transition:transform 0.2s; }
.show-card:hover { transform:translateY(-4px); }
.show-img { height:180px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.show-img img { width:100%; height:100%; object-fit:cover; }
.img-placeholder { font-size:48px; }
.show-info { padding:16px; }
.show-info h3 { font-size:16px; color:#333; margin-bottom:8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.show-info p { font-size:13px; color:#666; margin:4px 0; }
.price-row { display:flex; justify-content:space-between; align-items:center; margin-top:12px; }
.price { font-size:20px; font-weight:700; color:#FF4D4D; }
.buy-btn { padding:6px 16px; background:#FF4D4D; color:white; border-radius:14px; font-size:13px; cursor:pointer; }
</style>
