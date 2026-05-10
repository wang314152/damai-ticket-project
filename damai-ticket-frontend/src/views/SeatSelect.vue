<template>
  <div class="wrap">
    <div class="top">
      <el-button @click="goBack">← 返回列表</el-button>
      <div class="title">选座下单</div>
      <el-button type="primary" @click="goOrders">我的订单</el-button>
    </div>

    <el-card class="card">
      <div class="info">
        <div>演出ID：{{ showId }}</div>
        <div>已选：{{ selectedSeats.length }} / {{ maxBuy }} 张</div>
        <div class="hint">点击座位选择（0可选 / 1已售 / 2锁定）</div>
      </div>

      <!-- ✅ 评分展示 -->
      <el-card class="rateCard" shadow="never">
        <div class="rateTop">
          <div class="rateTitle">观众评分</div>

          <div class="rateSummary">
            <el-rate :model-value="Number(avgScore)" disabled />
            <span class="scoreText">{{ Number(avgScore).toFixed(1) }} 分</span>
            <span class="countText">（{{ ratingCount }} 人评分）</span>
          </div>

          <el-button size="small" @click="reloadRatings">刷新评价</el-button>
        </div>

        <div v-if="ratingList.length === 0" class="emptyRate">暂无评价</div>

        <div v-else class="rateList">
          <div class="rateItem" v-for="r in ratingList" :key="r.id">
            <div class="rLine1">
              <el-rate :model-value="r.score" disabled />
              <span class="rTime">{{ r.createTime || "" }}</span>
            </div>
            <div class="rContent">{{ r.content || "（未填写评价内容）" }}</div>
          </div>
        </div>

        <div class="ratePager" v-if="ratingTotal > 0">
          <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="ratingTotal"
              :page-size="ratingSize"
              :current-page="ratingCurrent"
              @current-change="loadRatings"
          />
        </div>
      </el-card>

      <!-- 分区选择 -->
      <div class="zone">
        <el-radio-group v-model="zone" @change="onZoneChange">
          <el-radio-button label="A">A区</el-radio-button>
          <el-radio-button label="B">B区</el-radio-button>
          <el-radio-button label="C">C区</el-radio-button>
        </el-radio-group>

        <el-button style="margin-left:12px" @click="reload">刷新座位</el-button>
        <el-button style="margin-left:12px" @click="clearSelected" plain>清空已选</el-button>
      </div>

      <!-- 舞台（居中） -->
      <div class="stage-wrap">
        <div class="stage">舞台 / 场地</div>
      </div>

      <div class="rows">
        <div v-for="r in seatRows" :key="r.row" class="row">
          <div class="row-label">第{{ r.row }}排</div>

          <div class="row-seats">
            <div
                v-for="s in r.seats"
                :key="s.id"
                class="seat"
                :class="seatClass(s)"
                @click="toggleSeat(s)"
            >
              <div class="num">{{ s.seatNumber }}</div>
              <div class="price">￥{{ s.price ?? "-" }}</div>
            </div>
          </div>
        </div>

        <div v-if="seatRows.length === 0" class="empty-seats">
          当前分区暂无座位
        </div>
      </div>


      <div v-if="filteredSeats.length===0" style="text-align:center;color:#888;padding:20px 0;">
        当前分区暂无座位（请检查 seatNumber 格式/分区规则）
      </div>

      <div class="bottom">
        <div class="sum">
          合计：<b>￥{{ totalAmount }}</b>
        </div>

        <el-button
            type="success"
            :disabled="selectedSeats.length === 0"
            @click="createOrderBatch"
        >
          下单（{{ selectedSeats.length }}张）
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import request, { isDemoMode } from "../api/request";

const route = useRoute();
const router = useRouter();

const showId = Number(route.params.showId);
const zone = ref("A");

// 演示模式座位数据
const demoSeats = [
  { id: 1, seatNumber: "A1", status: 0, price: 1280 },
  { id: 2, seatNumber: "A2", status: 0, price: 1280 },
  { id: 3, seatNumber: "A3", status: 1, price: 1280 },
  { id: 4, seatNumber: "A4", status: 0, price: 1280 },
  { id: 5, seatNumber: "A5", status: 0, price: 1280 },
  { id: 6, seatNumber: "A6", status: 2, price: 1280 },
  { id: 7, seatNumber: "A7", status: 0, price: 1280 },
  { id: 8, seatNumber: "A8", status: 0, price: 1280 },
  { id: 9, seatNumber: "A9", status: 0, price: 1280 },
  { id: 10, seatNumber: "A10", status: 0, price: 1280 },
  { id: 11, seatNumber: "B1", status: 0, price: 980 },
  { id: 12, seatNumber: "B2", status: 0, price: 980 },
  { id: 13, seatNumber: "B3", status: 0, price: 980 },
  { id: 14, seatNumber: "B4", status: 1, price: 980 },
  { id: 15, seatNumber: "B5", status: 0, price: 980 },
  { id: 16, seatNumber: "B6", status: 0, price: 980 },
  { id: 17, seatNumber: "B7", status: 0, price: 980 },
  { id: 18, seatNumber: "B8", status: 0, price: 980 },
  { id: 19, seatNumber: "B9", status: 0, price: 980 },
  { id: 20, seatNumber: "B10", status: 0, price: 980 },
  { id: 21, seatNumber: "C1", status: 0, price: 680 },
  { id: 22, seatNumber: "C2", status: 0, price: 680 },
  { id: 23, seatNumber: "C3", status: 0, price: 680 },
  { id: 24, seatNumber: "C4", status: 0, price: 680 },
  { id: 25, seatNumber: "C5", status: 1, price: 680 },
  { id: 26, seatNumber: "C6", status: 0, price: 680 },
  { id: 27, seatNumber: "C7", status: 0, price: 680 },
  { id: 28, seatNumber: "C8", status: 0, price: 680 },
  { id: 29, seatNumber: "C9", status: 0, price: 680 },
  { id: 30, seatNumber: "C10", status: 0, price: 680 },
];

const seats = ref([]);
const selectedSeats = ref([]);

const maxBuy = 10;

// ---------- 路由 ----------
function goBack() {
  router.push("/events");
}
function goOrders() {
  router.push("/orders");
}

// ---------- 登录校验（带回跳）----------
function requireLogin() {
  const uid = localStorage.getItem("userId");
  if (!uid) {
    ElMessage.warning("请先登录，再继续下单");
    router.push({ name: "login", query: { redirect: route.fullPath } });
    return null;
  }
  return Number(uid);
}

// ---------- 座位加载 ----------
async function reload() {
  // 演示模式使用本地数据
  if (isDemoMode) {
    seats.value = demoSeats;
    return;
  }

  try {
    const res = await request.get(`/api/seat/list/${showId}`);

    // 兼容：List 或 R<List>
    let list = [];
    if (res.data && typeof res.data === "object" && "code" in res.data) {
      if (res.data.code !== 0) {
        ElMessage.error(res.data.msg || "座位加载失败");
        seats.value = [];
        return;
      }
      list = res.data.data || [];
    } else {
      list = res.data || [];
    }

    seats.value = Array.isArray(list) ? list : [];
  } catch (e) {
    // 后端不可用时切换演示模式
    ElMessage.warning("后端未启动，已切换演示模式");
    seats.value = demoSeats;
  }
}

function onZoneChange() {
  selectedSeats.value = [];
}

// ---------- 区域过滤 ----------
// ---------- 分区规则：按座位首字母分 A/B/C ----------
function parseRow(seatNumber) {
  const s = String(seatNumber || "");
  // 匹配 "A1", "B2", "VIP1" 等格式
  const m = s.match(/^([A-Za-z]+)/);
  if (m) return m[1].toUpperCase();
  // 匹配 "10-3", "1排1座" 等格式
  const m2 = s.match(/^(\d+)/);
  if (m2) return Number(m2[1]);
  return null;
}
function parseCol(seatNumber) {
  const s = String(seatNumber || "");
  // 匹配 "A1", "B2" -> 提取数字部分
  const m = s.match(/[A-Za-z]*(\d+)$/);
  if (m) return Number(m[1]);
  // 匹配 "10-3", "1排1座" -> 提取最后一个数字
  const m2 = s.match(/(\d+)$/);
  if (m2) return Number(m2[1]);
  return null;
}
function calcZoneByRow(row) {
  if (row == null) return "A";
  // 字母分区
  if (typeof row === 'string') {
    if (row.startsWith('A')) return "A";
    if (row.startsWith('B')) return "B";
    if (row.startsWith('C')) return "C";
    return "A";
  }
  // 数字分区
  if (row >= 1 && row <= 3) return "A";
  if (row >= 4 && row <= 6) return "B";
  return "C";
}

// ✅ 当前分区的座位（先筛选，再排序：排号升序、座号升序）
const filteredSeats = computed(() => {
  const z = String(zone.value || "A");
  return seats.value
      .filter((s) => calcZoneByRow(parseRow(s.seatNumber)) === z)
      .slice()
      .sort((a, b) => {
        const ra = parseRow(a.seatNumber) ?? 9999;
        const rb = parseRow(b.seatNumber) ?? 9999;
        if (ra !== rb) return ra - rb;

        const ca = parseCol(a.seatNumber) ?? 9999;
        const cb = parseCol(b.seatNumber) ?? 9999;
        if (ca !== cb) return ca - cb;

        // 兜底：字符串排序
        return String(a.seatNumber || "").localeCompare(String(b.seatNumber || ""));
      });
});

// ✅ 自动分行：[{ row: 10, seats: [...] }, ...]
const seatRows = computed(() => {
  const map = new Map(); // row -> seats[]
  for (const s of filteredSeats.value) {
    const r = parseRow(s.seatNumber);
    const rowKey = r == null ? "Z" : r;
    if (!map.has(rowKey)) map.set(rowKey, []);
    map.get(rowKey).push(s);
  }

  // map 内每排再按座号排序
  const rows = Array.from(map.entries())
      .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
      .map(([row, list]) => {
        list.sort((x, y) => (parseCol(x.seatNumber) ?? 9999) - (parseCol(y.seatNumber) ?? 9999));
        return { row, seats: list };
      });

  return rows;
});


// ---------- 选座 ----------
function seatClass(s) {
  const picked = selectedSeats.value.some((x) => x.id === s.id);
  return {
    ok: s.status === 0,
    sold: s.status === 1,
    lock: s.status === 2,
    picked,
  };
}

function toggleSeat(s) {
  if (s.status !== 0) return;

  const idx = selectedSeats.value.findIndex((x) => x.id === s.id);
  if (idx >= 0) {
    selectedSeats.value.splice(idx, 1);
    return;
  }

  if (selectedSeats.value.length >= maxBuy) {
    ElMessage.warning(`最多购买${maxBuy}张票`);
    return;
  }

  selectedSeats.value.push(s);
}

function clearSelected() {
  selectedSeats.value = [];
}

const totalAmount = computed(() => {
  return selectedSeats.value.reduce((sum, s) => {
    const p = Number(s.price || 0);
    return sum + (isNaN(p) ? 0 : p);
  }, 0);
});

// ---------- 下单（多张）----------
async function createOrderBatch() {
  const uid = requireLogin();
  if (!uid) return;

  if (selectedSeats.value.length === 0) {
    ElMessage.warning("请先选择座位");
    return;
  }

  try {
    await ElMessageBox.confirm(
        `确认下单 ${selectedSeats.value.length} 张票？合计 ￥${totalAmount.value}`,
        "下单确认",
        { type: "warning" }
    );

    // 演示模式
    if (isDemoMode) {
      ElMessage.success(`演示模式：下单成功！共 ${selectedSeats.value.length} 张票，合计 ￥${totalAmount.value}`);
      selectedSeats.value = [];
      return;
    }

    const payload = {
      userId: uid,
      showId: showId,
      seatIds: selectedSeats.value.map((s) => s.id),
    };

    const res = await request.post("/api/order/createBatch", payload);

    if (!res.data?.success) {
      ElMessage.error(res.data?.msg || "下单失败");
      return;
    }

    ElMessage.success(res.data?.msg || "下单成功");
    selectedSeats.value = [];
    await reload();
    await reloadRatings();
    router.push("/orders");
  } catch (e) {
    if (e === "cancel" || e === "close") return;
    // 后端不可用时切换演示模式
    ElMessage.success(`演示模式：下单成功！共 ${selectedSeats.value.length} 张票，合计 ￥${totalAmount.value}`);
    selectedSeats.value = [];
  }
}

// ===================== 评分展示（平均分 + 评论分页） =====================
const avgScore = ref(0);
const ratingCount = ref(0);

const ratingList = ref([]);
const ratingTotal = ref(0);
const ratingCurrent = ref(1);
const ratingSize = ref(5);

async function loadRatingSummary() {
  try {
    const res = await request.get(`/api/rating/show/${showId}/summary`);
    if (!res.data || res.data.code !== 0) return;

    avgScore.value = Number(res.data.data?.avgScore || 0);
    ratingCount.value = Number(res.data.data?.count || 0);
  } catch (e) {}
}

async function loadRatings(page = 1) {
  ratingCurrent.value = page;
  try {
    const res = await request.get(`/api/rating/show/${showId}/page`, {
      params: { current: ratingCurrent.value, size: ratingSize.value },
    });
    if (!res.data || res.data.code !== 0) return;

    const p = res.data.data;
    ratingList.value = p.records || [];
    ratingTotal.value = Number(p.total || 0);
    ratingSize.value = Number(p.size || ratingSize.value);
  } catch (e) {}
}

async function reloadRatings() {
  await loadRatingSummary();
  await loadRatings(1);
}

onMounted(() => {
  if (!showId) {
    ElMessage.error("演出ID无效");
    router.push("/events");
    return;
  }
  reload();
  reloadRatings();
});
</script>

<style scoped>
.wrap { padding: 18px; }
.top { display:flex; justify-content:space-between; align-items:center; margin-bottom: 14px; }
.title { font-size: 18px; font-weight: 900; }

.card { border-radius: 16px; }

.info{
  display:flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items:center;
  justify-content:space-between;
  margin-bottom: 10px;
}
.hint{ color:#666; font-size: 12px; }

.zone{
  margin: 10px 0 12px;
  display:flex;
  align-items:center;
  flex-wrap: wrap;
  gap: 10px;
}

.grid{
  display:grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.seat{
  border-radius: 14px;
  padding: 10px 8px;
  text-align:center;
  cursor:pointer;
  border: 1px solid rgba(0,0,0,.08);
  background: rgba(255,255,255,.9);
  user-select:none;
  transition: transform .08s ease;
}
.seat:hover{ transform: translateY(-1px); }

.seat .num{ font-weight: 900; }
.seat .price{ font-size: 12px; color:#666; margin-top: 4px; }

.seat.ok{}
.seat.sold{ opacity:.45; cursor:not-allowed; }
.seat.lock{ opacity:.65; cursor:not-allowed; }
.seat.picked{ border-color: rgba(30,128,255,.65); box-shadow: 0 0 0 3px rgba(30,128,255,.16); }

.rows{
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row{
  display: grid;
  grid-template-columns: 96px 1fr;
  align-items: start;
  gap: 12px;
}

.row-label{
  height: 54px;
  border-radius: 12px;
  background: rgba(0,0,0,.04);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #334155;
}

.row-seats{
  display: grid;
  grid-template-columns: repeat(10, minmax(92px, 1fr));
  gap: 10px;
}

.empty-seats{
  padding: 24px 0;
  text-align: center;
  color: #94a3b8;
}

.bottom{
  margin-top: 14px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap: 10px;
}
.sum b{ font-size: 18px; }

.rateCard{
  margin: 10px 0 12px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,.06);
}
.rateTop{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
}
.rateTitle{ font-weight: 900; font-size: 14px; }
.rateSummary{
  display:flex;
  align-items:center;
  gap: 8px;
  flex: 1;
  justify-content:center;
}

.stage-wrap{
  display: flex;
  justify-content: center;
  margin: 14px 0 10px;
}
.stage{
  width: 360px;          /* 你想更宽就改这里 */
  height: 44px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.92);
  color: #fff;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 2px;
  box-shadow: 0 10px 24px rgba(0,0,0,.12);
}

.scoreText{ font-weight: 900; }
.countText{ color:#666; }
.emptyRate{ margin-top: 10px; color:#666; text-align:center; }
.rateList{ margin-top: 10px; display:flex; flex-direction:column; gap: 10px; }
.rateItem{ padding: 10px 12px; border-radius: 12px; background: rgba(0,0,0,.03); }
.rLine1{ display:flex; align-items:center; justify-content:space-between; }
.rTime{ color:#666; font-size: 12px; }
.rContent{ margin-top: 6px; line-height: 1.5; }
.ratePager{ margin-top: 10px; display:flex; justify-content:flex-end; }
</style>
