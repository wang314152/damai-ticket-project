<template>
  <div class="page">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-content">
        <div class="logo" @click="router.push('/')">
          <span class="logo-icon">🎭</span>
          <span class="logo-text">大麦网</span>
          <span class="logo-sub">Damai</span>
        </div>
        
        <div class="header-actions">
          <el-button @click="goOrders" class="header-btn order-btn">
            <span>📋</span> 我的订单
          </el-button>
          <el-button @click="goProfile" circle class="action-btn" title="个人中心">
            <span class="btn-icon">👤</span>
          </el-button>
          <el-button v-if="isAdmin" @click="goAdmin" class="header-btn admin-btn">
            <span>⚙️</span> 管理后台
          </el-button>
          <el-button @click="logout" class="header-btn logout-btn" plain>
            退出
          </el-button>
        </div>
      </div>
    </header>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-tabs">
          <span class="search-tab active">演出</span>
        </div>
        <div class="search-box">
          <input 
            v-model="keyword"
            class="search-input"
            placeholder="搜索演唱会、话剧、体育赛事..."
            @keyup.enter="applyFilter"
          />
          <button class="search-btn" @click="applyFilter">
            <span>🔍</span>
          </button>
        </div>
        <div class="hot-tags">
          <span class="hot-tag" @click="keyword='演唱会'; applyFilter()">🔥 热门演唱会</span>
          <span class="hot-tag" @click="keyword='周杰伦'; applyFilter()">🎤 周杰伦</span>
          <span class="hot-tag" @click="keyword='演唱会'; applyFilter()">🎵 演唱会</span>
        </div>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="category-section">
      <div class="category-container">
        <div class="category-tabs">
          <span 
            class="category-tab" 
            :class="{ active: category === '' }"
            @click="category=''; applyFilter()"
          >全部</span>
          <span 
            class="category-tab" 
            :class="{ active: category === '演唱会' }"
            @click="category='演唱会'; applyFilter()"
          >🎤 演唱会</span>
          <span 
            class="category-tab" 
            :class="{ active: category === '话剧歌剧' }"
            @click="category='话剧歌剧'; applyFilter()"
          >🎭 话剧歌剧</span>
          <span 
            class="category-tab" 
            :class="{ active: category === '体育赛事' }"
            @click="category='体育赛事'; applyFilter()"
          >⚽ 体育赛事</span>

        </div>
      </div>
    </div>

    <!-- 精选推荐 -->
    <div class="content-wrapper" v-if="recommendList.length > 0">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-icon">⭐</span>
          精选推荐
        </h2>
        <span class="more-link" @click="loadAll">查看更多 →</span>
      </div>
      
      <el-carousel height="380px" indicator-position="outside" autoplay :interval="5000" class="banner-carousel">
        <el-carousel-item v-for="item in recommendList" :key="item.id">
          <div class="banner-item" @click="goSeat(item.id)">
            <div class="banner-img-wrapper">
              <el-image :src="fullUrl(item.imageUrl)" fit="cover" class="banner-img">
                <template #error>
                  <div class="img-placeholder">🎭</div>
                </template>
              </el-image>
              <div class="banner-overlay"></div>
              <div class="banner-badge" v-if="item.category">{{ item.category }}</div>
            </div>
            <div class="banner-content">
              <h3 class="banner-title">{{ item.title }}</h3>
              <div class="banner-info">
                <span class="banner-location">📍 {{ item.location || '待定' }}</span>
                <span class="banner-time">🕐 {{ item.showTime || '待定' }}</span>
              </div>
              <div class="banner-footer">
                <div class="banner-price">
                  <span class="price-symbol">¥</span>
                  <span class="price-value">{{ item.price }}</span>
                  <span class="price-text">起</span>
                </div>
                <div class="banner-btn">立即购买</div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 演出列表 -->
    <div class="content-wrapper">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-icon">🎫</span>
          全部演出
          <span class="result-count">({{ filtered.length }}场演出)</span>
        </h2>
        <div class="sort-tabs">
          <span class="sort-tab active">全部演出</span>
        </div>
      </div>

      <div class="show-grid" v-if="pageList.length > 0">
        <div 
          class="show-card card-hover" 
          v-for="item in pageList" 
          :key="item.id"
          @click="goSeat(item.id)"
        >
          <div class="show-img-wrapper">
            <el-image :src="fullUrl(item.imageUrl)" fit="cover" class="show-img">
              <template #error>
                <div class="img-placeholder">🎭</div>
              </template>
            </el-image>
            <div class="show-tag" v-if="item.category">{{ item.category }}</div>
            <div class="show-time-badge" v-if="item.showTime">{{ formatShowTime(item.showTime) }}</div>
          </div>
          <div class="show-content">
            <h3 class="show-title text-ellipsis">{{ item.title }}</h3>
            <div class="show-location">
              <span>📍</span>
              <span class="text-ellipsis">{{ item.location || '待定' }}</span>
            </div>
            <div class="show-footer">
              <div class="show-price">
                <span class="price-symbol">¥</span>
                <span class="price-num">{{ item.price }}</span>
                <span class="price-unit">起</span>
              </div>
              <div class="show-btn">立即购买</div>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" v-else>
        <div class="empty-icon">🎭</div>
        <div class="empty-text">暂无相关演出</div>
        <el-button type="primary" @click="resetFilter">重新搜索</el-button>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="filtered.length > pageSize">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="filtered.length"
          :current-page="page"
          :page-size="pageSize"
          @current-change="onPageChange"
        />
      </div>
    </div>

    <!-- 底部 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <span class="logo-icon">🎭</span>
          <span>大麦网 Damai</span>
        </div>
        <div class="footer-links">
          <span>关于大麦</span>
          <span>帮助中心</span>
          <span>联系客服</span>
          <span>© 2026 Damai Inc.</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import request, { isDemoMode } from "../api/request";

const router = useRouter();
const isAdmin = (localStorage.getItem("role") || "").toUpperCase() === "ADMIN";

const demoData = [
  { id: 1, title: "周杰伦2026世界巡回演唱会", location: "北京国家体育场", showTime: "2026-06-15 19:30", price: 1280, category: "演唱会", imageUrl: "https://picsum.photos/seed/concert1/400/300" },
  { id: 2, title: "开心麻花爆笑喜剧《乌龙山伯爵》", location: "上海人民大舞台", showTime: "2026-05-20 14:00", price: 380, category: "话剧", imageUrl: "https://picsum.photos/seed/theater1/400/300" },
  { id: 3, title: "2026NBA中国赛", location: "广州体育馆", showTime: "2026-08-10 20:00", price: 880, category: "体育赛事", imageUrl: "https://picsum.photos/seed/sports1/400/300" },
  { id: 4, title: "理查德克莱德曼钢琴独奏会", location: "深圳音乐厅", showTime: "2026-07-25 20:00", price: 680, category: "音乐会", imageUrl: "https://picsum.photos/seed/piano1/400/300" },
  { id: 5, title: "舞剧《只此青绿》", location: "杭州大剧院", showTime: "2026-06-01 19:30", price: 480, category: "舞蹈", imageUrl: "https://picsum.photos/seed/dance1/400/300" },
  { id: 6, title: "德云社相声专场", location: "南京人民大会堂", showTime: "2026-05-18 19:30", price: 280, category: "曲艺杂技", imageUrl: "https://picsum.photos/seed/crosstalk1/400/300" },
];

const allList = ref([]);
const recommendList = ref([]);
const keyword = ref("");
const category = ref("");
const page = ref(1);
const pageSize = ref(12);

function goSeat(showId) { router.push(`/seat/${showId}`); }
function goOrders() { router.push("/orders"); }
function goProfile() { router.push("/profile"); }
function goAdmin() { router.push("/admin"); }
function logout() {
  localStorage.clear();
  router.push("/login");
}

function fullUrl(p) {
  if (!p) return "";
  if (p.startsWith("http")) return p;
  if (isDemoMode) return "https://picsum.photos/seed/default/400/300";
  return "http://localhost:8081" + p;
}

function formatShowTime(timeStr) {
  if (!timeStr) return "";
  const parts = timeStr.split(" ");
  if (parts.length >= 2) {
    const datePart = parts[0];
    const timePart = parts[1];
    const date = datePart.split("-");
    return `${date[1]}/${date[2]} ${timePart}`;
  }
  return timeStr;
}

async function loadAll() {
  if (isDemoMode) {
    allList.value = demoData;
    recommendList.value = demoData.slice(0, 4);
    page.value = 1;
    return;
  }
  try {
    const res = await request.get("/api/show/list");
    allList.value = Array.isArray(res.data) ? res.data : [];
    recommendList.value = allList.value.filter(i => i.imageUrl).slice(0, 4);
    page.value = 1;
  } catch (e) {
    ElMessage.warning("后端未启动，已切换为演示模式");
    allList.value = demoData;
    recommendList.value = demoData.slice(0, 4);
    page.value = 1;
  }
}

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  const cat = category.value.trim();
  return allList.value.filter(x => {
    const matchKw = !kw || (x.title || "").toLowerCase().includes(kw) || (x.location || "").toLowerCase().includes(kw);
    const matchCat = !cat || (x.category || "") === cat;
    return matchKw && matchCat;
  });
});

const pageList = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});

function applyFilter() { page.value = 1; }
function resetFilter() { keyword.value = ""; category.value = ""; page.value = 1; }
function onPageChange(p) { page.value = p; window.scrollTo({ top: 400, behavior: "smooth" }); }

watch(filtered, () => {
  const maxPage = Math.max(1, Math.ceil(filtered.value.length / pageSize.value));
  if (page.value > maxPage) page.value = 1;
});

onMounted(loadAll);
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f8f9fa;
}

/* 顶部导航 */
.header {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(255,77,77,0.3);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: white;
}

.logo-icon { font-size: 32px; }
.logo-text { font-size: 24px; font-weight: 800; letter-spacing: 2px; }
.logo-sub { font-size: 12px; opacity: 0.8; }

.nav {
  display: flex;
  gap: 32px;
}

.nav-item {
  color: white;
  font-size: 15px;
  cursor: pointer;
  padding: 8px 0;
  position: relative;
  opacity: 0.9;
  transition: opacity 0.2s;
}

.nav-item:hover, .nav-item.active {
  opacity: 1;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: white;
  border-radius: 2px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2) !important;
  border: none !important;
  font-size: 18px;
}

.action-btn:hover {
  background: rgba(255,255,255,0.3) !important;
}

.header-btn {
  height: 36px;
  border-radius: 18px;
  font-size: 14px;
  border: none;
}

.order-btn {
  background: white;
  color: #FF4D4D;
}

.order-btn:hover {
  background: #fff5f5;
}

.admin-btn {
  background: rgba(255,255,255,0.2);
  color: white;
}

.logout-btn {
  border: 1px solid rgba(255,255,255,0.5) !important;
  color: white;
}

/* 搜索区域 */
.search-section {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  padding: 30px 0 50px;
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.search-tabs {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 20px;
}

.search-tab {
  color: rgba(255,255,255,0.7);
  font-size: 16px;
  cursor: pointer;
  padding-bottom: 4px;
}

.search-tab.active {
  color: white;
  font-weight: 600;
  border-bottom: 2px solid white;
}

.search-box {
  display: flex;
  background: white;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 16px 24px;
  font-size: 16px;
}

.search-btn {
  width: 60px;
  border: none;
  background: #FF4D4D;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #e64545;
}

.hot-tags {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.hot-tag {
  color: rgba(255,255,255,0.9);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 12px;
  background: rgba(255,255,255,0.15);
  border-radius: 20px;
  transition: background 0.2s;
}

.hot-tag:hover {
  background: rgba(255,255,255,0.25);
}

/* 分类导航 */
.category-section {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: sticky;
  top: 70px;
  z-index: 99;
}

.category-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  overflow-x: auto;
}

.category-tabs {
  display: flex;
  gap: 8px;
  padding: 16px 0;
}

.category-tab {
  padding: 8px 20px;
  font-size: 15px;
  color: #666;
  cursor: pointer;
  border-radius: 20px;
  white-space: nowrap;
  transition: all 0.2s;
}

.category-tab:hover {
  color: #FF4D4D;
}

.category-tab.active {
  background: #FF4D4D;
  color: white;
}

/* 内容区域 */
.content-wrapper {
  max-width: 1400px;
  margin: 30px auto;
  padding: 0 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon { font-size: 24px; }

.result-count {
  font-size: 14px;
  font-weight: normal;
  color: #999;
  margin-left: 8px;
}

.more-link {
  color: #FF4D4D;
  font-size: 14px;
  cursor: pointer;
}

/* 轮播图 */
.banner-carousel {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.banner-item {
  display: flex;
  height: 100%;
  cursor: pointer;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
}

.banner-img-wrapper {
  width: 55%;
  position: relative;
}

.banner-img {
  width: 100%;
  height: 100%;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent, rgba(0,0,0,0.3));
}

.banner-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #FF4D4D;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.banner-content {
  width: 45%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.banner-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.4;
}

.banner-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 15px;
  opacity: 0.9;
  margin-bottom: 30px;
}

.banner-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.banner-price {
  display: flex;
  align-items: baseline;
}

.price-symbol { font-size: 16px; }
.price-value { font-size: 36px; font-weight: 800; color: #FF4D4D; }
.price-text { font-size: 14px; color: #999; margin-left: 4px; }

.banner-btn {
  background: linear-gradient(135deg, #FF4D4D, #FF6B35);
  color: white;
  padding: 12px 32px;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
}

/* 演出网格 */
.show-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1200px) {
  .show-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 900px) {
  .show-grid { grid-template-columns: repeat(2, 1fr); }
}

.show-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.show-img-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.show-img {
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
}

.show-card:hover .show-img {
  transform: scale(1.05);
}

.show-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.show-time-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(255,77,77,0.9);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.show-content {
  padding: 16px;
}

.show-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.show-location {
  font-size: 13px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
}

.show-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.show-price {
  display: flex;
  align-items: baseline;
}

.price-num {
  font-size: 22px;
  font-weight: 700;
  color: #FF4D4D;
}

.price-unit {
  font-size: 12px;
  color: #999;
  margin-left: 2px;
}

.show-btn {
  background: linear-gradient(135deg, #FF4D4D, #FF6B35);
  color: white;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
}

.img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  font-size: 48px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 0;
}

.empty-icon { font-size: 64px; margin-bottom: 20px; }
.empty-text { font-size: 16px; color: #999; margin-bottom: 20px; }

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

/* 底部 */
.footer {
  background: #1a1a1a;
  color: white;
  padding: 40px 0;
  margin-top: 60px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
}

.footer-links {
  display: flex;
  gap: 24px;
  font-size: 13px;
  color: #999;
}

.footer-links span {
  cursor: pointer;
}

.footer-links span:hover {
  color: white;
}

/* 排序标签 */
.sort-tabs {
  display: flex;
  gap: 8px;
}

.sort-tab {
  padding: 6px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-radius: 16px;
}

.sort-tab:hover {
  color: #FF4D4D;
}

.sort-tab.active {
  background: #FFF0F0;
  color: #FF4D4D;
}
</style>
