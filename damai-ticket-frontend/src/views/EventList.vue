<template>
  <div class="page">
    <!-- 顶部栏 -->
    <div class="topbar">
      <div class="brand">大麦网票务系统</div>

      <div class="actions">
        <el-button @click="goProfile" plain>个人中心</el-button>
        <el-button @click="goOrders" type="primary" plain>我的订单</el-button>
        <el-button v-if="isAdmin" @click="goAdmin" type="warning" plain>后台管理</el-button>
        <el-button type="danger" plain @click="logout">退出</el-button>
      </div>
    </div>

    <!-- ✅ 滚动推荐演出 -->
    <el-card class="recommend-card" v-if="recommendList.length > 0">
      <div class="recommend-title">🔥 推荐演出</div>

      <el-carousel height="260px" indicator-position="outside" autoplay :interval="4000">
        <el-carousel-item v-for="item in recommendList" :key="item.id">
          <div class="recommend-item" @click="goSeat(item.id)">
            <img class="recommend-img" :src="fullUrl(item.imageUrl)" alt="" />
            <div class="recommend-info">
              <div class="recommend-name">{{ item.title }}</div>
              <div class="recommend-sub">
                <span class="tag">{{ item.category || "未分类" }}</span>
                <span class="meta">{{ item.location || "-" }}</span>
                <span class="meta">{{ item.showTime || "-" }}</span>
              </div>
              <div class="recommend-price">￥{{ item.price ?? "-" }} 起</div>
              <div class="recommend-tip">点击进入选座下单 →</div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-card>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <div class="search-row">
        <el-input
            v-model="keyword"
            placeholder="按名称搜索（模糊）"
            style="width: 260px"
            clearable
            @keyup.enter="applyFilter"
        />
        <el-select v-model="category" placeholder="按类别筛选" clearable style="width: 200px">
          <el-option label="演唱会" value="演唱会" />
          <el-option label="体育赛事" value="体育赛事" />
          <el-option label="话剧歌剧" value="话剧歌剧" />
          <el-option label="展览" value="展览" />
        </el-select>

        <el-button type="primary" @click="applyFilter">查询</el-button>
        <el-button @click="resetFilter">重置</el-button>
        <el-button plain @click="loadAll">刷新</el-button>
      </div>
    </el-card>

    <!-- 演出列表 -->
    <div class="grid">
      <el-card
          v-for="item in pageList"
          :key="item.id"
          class="card"
          shadow="hover"
          @click="goSeat(item.id)"
      >
        <el-image
            class="img"
            :src="fullUrl(item.imageUrl)"
            fit="cover"
            :preview-src-list="item.imageUrl ? [fullUrl(item.imageUrl)] : []"
        >
          <template #error>
            <div class="img-fallback">暂无图片</div>
          </template>
        </el-image>

        <div class="name">{{ item.title }}</div>
        <div class="line">
          <span class="tag2">{{ item.category || "未分类" }}</span>
          <span class="price">￥{{ item.price ?? "-" }}</span>
        </div>

        <div class="desc">
          <div>地点：{{ item.location || "-" }}</div>
          <div>时间：{{ item.showTime || "-" }}</div>
        </div>

        <div class="go">点击选座 →</div>
      </el-card>
    </div>

    <div class="empty" v-if="filtered.length === 0">暂无演出</div>

    <!-- ✅ 分页条 -->
    <div class="pager" v-if="filtered.length > 0">
      <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="filtered.length"
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[8, 12, 16, 20]"
          @current-change="onPageChange"
          @size-change="onSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import request, { isDemoMode } from "../api/request";

const router = useRouter();
const isAdmin = (localStorage.getItem("role") || "").toUpperCase() === "ADMIN";

// 演示模式数据 - 使用网络图片
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
const pageSize = ref(8);

function goSeat(showId) {
  router.push(`/seat/${showId}`);
}
function goOrders() {
  router.push("/orders");
}
function goProfile() {
  router.push("/profile");
}
function goAdmin() {
  router.push("/admin");
}
function logout() {
  localStorage.clear();
  router.push("/login");
}

function fullUrl(p) {
  if (!p) return "";
  // 网络图片直接返回
  if (p.startsWith("http")) return p;
  // 演示模式或本地模式
  if (isDemoMode) {
    return "https://picsum.photos/seed/default/400/300";
  }
  return "http://localhost:8081" + p;
}

async function loadAll() {
  // 演示模式直接使用本地数据
  if (isDemoMode) {
    allList.value = demoData;
    recommendList.value = demoData.slice(0, 5);
    page.value = 1;
    return;
  }

  try {
    const res = await request.get("/api/show/list");
    const list = res.data || [];
    allList.value = Array.isArray(list) ? list : [];
    recommendList.value = allList.value.filter((i) => i.imageUrl).slice(0, 5);
    page.value = 1;
  } catch (e) {
    console.error(e);
    // 后端不可用时自动切换演示模式
    ElMessage.warning("后端未启动，已切换为演示模式");
    allList.value = demoData;
    recommendList.value = demoData.slice(0, 5);
    page.value = 1;
  }
}

const filtered = computed(() => {
  const kw = (keyword.value || "").trim();
  const cat = (category.value || "").trim();
  return allList.value.filter((x) => {
    const okKw = !kw || String(x.title || "").includes(kw);
    const okCat = !cat || String(x.category || "") === cat;
    return okKw && okCat;
  });
});

const pageList = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filtered.value.slice(start, end);
});

function applyFilter() {
  page.value = 1;
  ElMessage.success("筛选已应用");
}
function resetFilter() {
  keyword.value = "";
  category.value = "";
  page.value = 1;
  ElMessage.success("已重置");
}

function onPageChange(p) {
  page.value = p;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function onSizeChange(s) {
  pageSize.value = s;
  page.value = 1;
}

watch(filtered, () => {
  const maxPage = Math.max(1, Math.ceil(filtered.value.length / pageSize.value));
  if (page.value > maxPage) page.value = 1;
});

onMounted(loadAll);
</script>

<style scoped>
.page {
  padding: 18px;
  background: #f6f7fb;
  min-height: 100vh;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.brand {
  font-size: 20px;
  font-weight: 900;
}

.actions {
  display: flex;
  gap: 10px;
}

/* 推荐 */
.recommend-card {
  margin-bottom: 14px;
  border-radius: 14px;
}
.recommend-title {
  font-size: 18px;
  font-weight: 900;
  margin-bottom: 12px;
}
.recommend-item {
  height: 100%;
  display: flex;
  gap: 18px;
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.25s;
}
.recommend-item:hover {
  background: #f5f7fa;
}
.recommend-img {
  width: 360px;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
}
.recommend-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}
.recommend-name {
  font-size: 22px;
  font-weight: 900;
}
.recommend-sub {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.tag {
  background: #409eff;
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
}
.meta {
  color: #666;
}
.recommend-price {
  font-size: 18px;
  font-weight: 900;
  color: #f56c6c;
}
.recommend-tip {
  color: #409eff;
  font-weight: 700;
}

/* 搜索 */
.search-card {
  border-radius: 14px;
  margin-bottom: 14px;
}
.search-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

/* 列表 */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
@media (max-width: 1200px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-2px);
}

.img {
  width: 100%;
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
}
.img-fallback {
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee;
  color: #666;
  border-radius: 12px;
}
.name {
  margin-top: 10px;
  font-weight: 900;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.line {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tag2 {
  background: #eef5ff;
  color: #409eff;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}
.price {
  font-size: 16px;
  font-weight: 900;
  color: #f56c6c;
}
.desc {
  margin-top: 8px;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}
.go {
  margin-top: 10px;
  color: #409eff;
  font-weight: 700;
}
.empty {
  text-align: center;
  margin-top: 18px;
  color: #666;
}

/* 分页 */
.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}
</style>
