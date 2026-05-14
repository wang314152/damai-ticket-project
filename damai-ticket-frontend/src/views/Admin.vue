<template>
  <div class="wrap">
    <!-- 顶部栏 -->
    <div class="topbar">
      <div class="topbar-left">
        <span class="topbar-logo">🎭</span>
        <span class="topbar-title">大麦网管理系统</span>
        <el-tag type="warning" size="small" effect="dark" class="admin-tag">ADMIN</el-tag>
      </div>
      <div class="topbar-right">
        <el-button @click="router.push('/')" class="topbar-btn">
          <span>🏠</span> 前台首页
        </el-button>
        <el-button type="danger" plain @click="logout" class="topbar-btn">
          <span>🚪</span> 退出
        </el-button>
      </div>
    </div>

    <!-- 主体 Tabs -->
        <el-tabs v-model="active" type="border-card" class="admin-tabs">
      <!-- ===================== 演出管理 ===================== -->
      <el-tab-pane label="🎭 演出管理" name="show">
        <!-- 搜索 + 新增 -->
        <el-card>
          <div class="row">
            <div class="left">
              <el-input
                  v-model="keyword"
                  placeholder="按标题搜索（模糊）"
                  style="width: 260px"
                  clearable
                  @keyup.enter="loadShows(1)"
              />
              <el-button type="primary" @click="loadShows(1)">搜索</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </div>

            <div class="right">
              <el-button type="success" @click="openAdd">新增演出</el-button>
            </div>
          </div>
        </el-card>

        <!-- 分区票价设置 -->
        <el-card style="margin-top: 12px;">
          <div style="font-weight:800;margin-bottom:10px;">分区票价设置（按排数 A/B/C）</div>
          <el-form :inline="true">
            <el-form-item label="演出ID">
              <el-input-number v-model="priceSet.showId" :min="1" />
            </el-form-item>
            <el-form-item label="A区">
              <el-input-number v-model="priceSet.a" :min="0" />
            </el-form-item>
            <el-form-item label="B区">
              <el-input-number v-model="priceSet.b" :min="0" />
            </el-form-item>
            <el-form-item label="C区">
              <el-input-number v-model="priceSet.c" :min="0" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="setZonePrice">应用到该演出座位</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 列表 -->
        <el-table :data="shows" border style="margin-top: 16px;">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="title" label="名称" min-width="180" />
          <el-table-column prop="category" label="类别" width="120" />
          <el-table-column prop="location" label="地点" min-width="140" />
          <el-table-column prop="showTime" label="时间" width="180" />
          <el-table-column prop="price" label="基础票价" width="110" />
          <el-table-column prop="createTime" label="创建时间" width="180" />

          <el-table-column label="操作" width="240" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="openEdit(scope.row)">修改</el-button>

              <el-popconfirm title="确定删除该演出吗？" @confirm="delShow(scope.row.id)">
                <template #reference>
                  <el-button size="small" type="danger" plain>删除</el-button>
                </template>
              </el-popconfirm>

              <el-button size="small" type="primary" plain @click="initSeats(scope.row.id)">
                初始化座位
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div style="display:flex; justify-content:flex-end; margin-top: 12px;">
          <el-pagination
              background
              layout="prev, pager, next, jumper, total"
              :total="total"
              :page-size="pageSize"
              :current-page="current"
              @current-change="loadShows"
          />
        </div>

        <!-- 新增/编辑弹窗 -->
        <el-dialog v-model="dlgVisible" :title="dlgMode==='add' ? '新增演出' : '修改演出'" width="520px">
          <el-form :model="form" label-width="90px">
            <el-form-item label="名称">
              <el-input v-model="form.title" placeholder="例如：周杰伦演唱会" />
            </el-form-item>

            <el-form-item label="地点">
              <el-input v-model="form.location" placeholder="例如：上海体育场" />
            </el-form-item>

            <el-form-item label="时间">
              <el-date-picker
                  v-model="form.showTime"
                  type="datetime"
                  placeholder="选择时间"
                  style="width: 100%;"
              />
            </el-form-item>

            <el-form-item label="票价">
              <el-input-number v-model="form.price" :min="1" style="width: 100%;" />
            </el-form-item>

            <el-form-item label="类别">
              <el-select v-model="form.category" style="width:100%;">
                <el-option label="演唱会" value="演唱会" />
                <el-option label="体育赛事" value="体育赛事" />
                <el-option label="话剧歌剧" value="话剧歌剧" />
                <el-option label="展览" value="展览" />
              </el-select>
            </el-form-item>

            <el-form-item label="演出图片">
              <el-upload
                  action="http://localhost:8081/api/upload/image"
                  name="file"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="onUploadSuccess"
                  :on-error="onUploadError"
              >
                <el-button type="primary" plain>上传图片</el-button>
              </el-upload>

              <div v-if="form.imageUrl" style="margin-top:10px;">
                <el-image
                    :src="fullUrl(form.imageUrl)"
                    style="width: 220px; height: 140px; border-radius: 12px;"
                    fit="cover"
                />
              </div>
            </el-form-item>

            <el-form-item label="描述">
              <el-input v-model="form.description" type="textarea" :rows="3" placeholder="可选" />
            </el-form-item>
          </el-form>

          <template #footer>
            <el-button @click="dlgVisible=false">取消</el-button>
            <el-button type="primary" @click="submitShow">确定</el-button>
          </template>
        </el-dialog>
      </el-tab-pane>

      <!-- ===================== 订单管理 ===================== -->
      <el-tab-pane label="📋 订单管理" name="order">
        <el-table :data="orders" border>
          <el-table-column prop="id" label="订单ID" width="90" />
          <el-table-column prop="userId" label="用户ID" width="90" />
          <el-table-column prop="showId" label="演出ID" width="90" />
          <el-table-column prop="seatId" label="座位ID" width="90" />
          <el-table-column prop="amount" label="金额" width="120" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag v-if="scope.row.status===0" type="warning">未支付</el-tag>
              <el-tag v-else-if="scope.row.status===1" type="success">已支付</el-tag>
              <el-tag v-else type="info">已取消</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
        </el-table>
      </el-tab-pane>

      <!-- 用户管理 -->
      <el-tab-pane label="👥 用户管理" name="user">
        <el-card>
          <div class="row">
            <div class="left">
              <el-input
                  v-model="userKeyword"
                  placeholder="按用户名搜索（模糊）"
                  style="width: 260px"
                  clearable
                  @keyup.enter="loadUsers(1)"
              />
              <el-button type="primary" @click="loadUsers(1)">搜索</el-button>
              <el-button @click="resetUserSearch">重置</el-button>
            </div>

            <div class="right">
              <el-button @click="loadUsers(currentUserPage)">刷新</el-button>
            </div>
          </div>
        </el-card>

        <el-card style="margin-top: 12px;">
          <el-table
              :data="users"
              border
              row-key="id"
              :expand-row-keys="expandKeys"
              @expand-change="onExpandChange"
          >
            <el-table-column type="expand">
              <template #default="scope">
                <div style="padding: 10px 12px;">
                  <div style="font-weight:800;margin-bottom:8px;">
                    用户 {{ scope.row.username }} 的订单明细
                  </div>

                  <el-table
                      :data="userOrdersMap[scope.row.id] || []"
                      size="small"
                      border
                      v-loading="ordersLoadingMap[scope.row.id] === true"
                  >
                    <el-table-column prop="orderId" label="订单ID" width="90" />
                    <el-table-column prop="showTitle" label="演出" min-width="180" />
                    <el-table-column prop="seatNumber" label="座位" width="100" />
                    <el-table-column prop="amount" label="金额" width="100" />
                    <el-table-column prop="status" label="支付状态" width="120">
                      <template #default="s">
                        <el-tag v-if="s.row.status===0" type="warning">未支付</el-tag>
                        <el-tag v-else-if="s.row.status===1" type="success">已支付</el-tag>
                        <el-tag v-else type="info">已取消</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="下单时间" width="180" />
                  </el-table>

                  <div v-if="(userOrdersMap[scope.row.id] || []).length===0" style="color:#666;margin-top:10px;">
                    暂无订单
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="username" label="用户名" min-width="140" />
            <el-table-column prop="role" label="角色" width="110">
              <template #default="scope">
                <el-tag v-if="(scope.row.role||'').toUpperCase()==='ADMIN'" type="danger">ADMIN</el-tag>
                <el-tag v-else type="info">USER</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="150" />
            <el-table-column prop="email" label="邮箱" min-width="160" />
            <el-table-column prop="nickname" label="昵称" min-width="120" />
          </el-table>

          <div style="display:flex; justify-content:flex-end; margin-top: 12px;">
            <el-pagination
                background
                layout="prev, pager, next, jumper, total"
                :total="userTotal"
                :page-size="userPageSize"
                :current-page="currentUserPage"
                @current-change="loadUsers"
            />
          </div>
        </el-card>
      </el-tab-pane>


      <!-- ===================== 数据统计 ===================== -->
      <el-tab-pane label="📊 数据统计" name="stats">
        <div class="stats-container">
          <!-- 顶部选择区 -->
          <div class="stats-header">
            <div class="header-left">
              <span class="header-icon">📊</span>
              <span class="header-title">销售数据分析中心</span>
            </div>
            <div class="header-right">
              <el-select v-model="statsShowId" placeholder="选择演出查看统计" style="width:320px;" clearable filterable>
                <el-option
                    v-for="s in shows"
                    :key="s.id"
                    :label="`${s.title}`"
                    :value="s.id"
                >
                  <span style="float:left">{{ s.title }}</span>
                  <el-tag size="small" type="info" style="float:right;margin-left:8px;">{{ s.category }}</el-tag>
                </el-option>
              </el-select>
              <el-button type="primary" size="large" class="query-btn" @click="loadStats" :icon="'Search'">查询数据</el-button>
              <el-button size="large" @click="refreshStatsBase" :icon="'Refresh'">刷新</el-button>
            </div>
          </div>

          <div v-if="stats">
            <!-- 核心指标卡片 -->
            <div class="metrics-grid">
              <div class="metric-card metric-primary">
                <div class="metric-bg-icon">🎫</div>
                <div class="metric-content">
                  <div class="metric-label">总座位数</div>
                  <div class="metric-value">{{ stats.totalSeats }}</div>
                  <div class="metric-trend up">
                    <span>100%</span>
                    <span>座位容量</span>
                  </div>
                </div>
              </div>
              <div class="metric-card metric-success">
                <div class="metric-bg-icon">✅</div>
                <div class="metric-content">
                  <div class="metric-label">已售座位</div>
                  <div class="metric-value">{{ stats.soldSeats }}</div>
                  <div class="metric-trend">
                    <span>占比 {{ ((stats.soldSeats / stats.totalSeats) * 100).toFixed(1) }}%</span>
                  </div>
                </div>
              </div>
              <div class="metric-card metric-warning">
                <div class="metric-bg-icon">🔒</div>
                <div class="metric-content">
                  <div class="metric-label">锁定座位</div>
                  <div class="metric-value">{{ stats.lockedSeats }}</div>
                  <div class="metric-trend">
                    <span>占比 {{ ((stats.lockedSeats / stats.totalSeats) * 100).toFixed(1) }}%</span>
                  </div>
                </div>
              </div>
              <div class="metric-card metric-money">
                <div class="metric-bg-icon">💰</div>
                <div class="metric-content">
                  <div class="metric-label">销售收入</div>
                  <div class="metric-value money">¥{{ Number(stats.revenue || 0).toLocaleString() }}</div>
                  <div class="metric-trend up">
                    <span>平均 {{ stats.paidOrders > 0 ? Math.round(stats.revenue / stats.paidOrders) : 0 }}元/单</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 主图表区域 -->
            <div class="charts-section">
              <!-- 左侧：座位和订单饼图 -->
              <div class="chart-column">
                <el-card class="premium-chart-card">
                  <template #header>
                    <div class="chart-header">
                      <span class="chart-icon">🎭</span>
                      <span class="chart-title">座位销售分布</span>
                      <el-tag size="small" type="success" effect="dark">{{ ((stats.soldSeats / stats.totalSeats) * 100).toFixed(0) }}% 售出</el-tag>
                    </div>
                  </template>
                  <v-chart :option="seatPieOption" style="height:280px;"></v-chart>
                  <div class="chart-legend">
                    <div class="legend-item"><span class="dot" style="background:#67C23A"></span>已售座位</div>
                    <div class="legend-item"><span class="dot" style="background:#909399"></span>锁定座位</div>
                    <div class="legend-item"><span class="dot" style="background:#E4E7ED"></span>可售座位</div>
                  </div>
                </el-card>

                <el-card class="premium-chart-card">
                  <template #header>
                    <div class="chart-header">
                      <span class="chart-icon">📋</span>
                      <span class="chart-title">订单状态统计</span>
                    </div>
                  </template>
                  <v-chart :option="orderStatusOption" style="height:280px;"></v-chart>
                </el-card>
              </div>

              <!-- 右侧：仪表盘和进度 -->
              <div class="chart-column">
                <el-card class="premium-chart-card gauge-card">
                  <template #header>
                    <div class="chart-header">
                      <span class="chart-icon">🎯</span>
                      <span class="chart-title">销售目标达成</span>
                    </div>
                  </template>
                  <v-chart :option="sellRateGaugeOption" style="height:200px;"></v-chart>
                  <div class="gauge-footer">
                    <div class="gauge-stat">
                      <span class="gauge-stat-value success">{{ stats.paidOrders }}</span>
                      <span class="gauge-stat-label">已完成订单</span>
                    </div>
                    <el-divider direction="vertical"></el-divider>
                    <div class="gauge-stat">
                      <span class="gauge-stat-value warning">{{ stats.unpaidOrders }}</span>
                      <span class="gauge-stat-label">待支付订单</span>
                    </div>
                  </div>
                </el-card>

                <!-- 销售进度展示 -->
                <el-card class="progress-card">
                  <template #header>
                    <div class="chart-header">
                      <span class="chart-icon">📈</span>
                      <span class="chart-title">销售进度</span>
                    </div>
                  </template>
                  <div class="progress-list">
                    <div class="progress-item">
                      <div class="progress-label">
                        <span>已售出票</span>
                        <span class="progress-value">{{ ((stats.soldSeats / stats.totalSeats) * 100).toFixed(1) }}%</span>
                      </div>
                      <el-progress :percentage="Math.round((stats.soldSeats / stats.totalSeats) * 100)" :color="progressColors.green" :show-text="false" :stroke-width="10" />
                    </div>
                    <div class="progress-item">
                      <div class="progress-label">
                        <span>已支付订单</span>
                        <span class="progress-value">{{ stats.paidOrders }}单</span>
                      </div>
                      <el-progress :percentage="Math.min(Math.round((stats.paidOrders / (stats.paidOrders + stats.unpaidOrders || 1)) * 100), 100)" :color="progressColors.blue" :show-text="false" :stroke-width="10" />
                    </div>
                    <div class="progress-item">
                      <div class="progress-label">
                        <span>用户评分</span>
                        <span class="progress-value">{{ Number(stats.avgScore || 0).toFixed(1) }}分</span>
                      </div>
                      <el-progress :percentage="Math.round((stats.avgScore / 5) * 100)" :color="progressColors.orange" :show-text="false" :stroke-width="10" />
                    </div>
                  </div>
                </el-card>
              </div>
            </div>

            <!-- 底部图表区 -->
            <div class="bottom-charts">
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-card class="premium-chart-card">
                    <template #header>
                      <div class="chart-header">
                        <span class="chart-icon">💵</span>
                        <span class="chart-title">收入与订单分析</span>
                      </div>
                    </template>
                    <v-chart :option="revenueBarOption" style="height:260px;"></v-chart>
                  </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card class="premium-chart-card">
                    <template #header>
                      <div class="chart-header">
                        <span class="chart-icon">⭐</span>
                        <span class="chart-title">用户评价分布</span>
                        <el-tag size="small" type="warning" effect="plain">平均 {{ Number(stats.avgScore || 0).toFixed(1) }} 分</el-tag>
                      </div>
                    </template>
                    <v-chart :option="ratingBarOption" style="height:260px;"></v-chart>
                  </el-card>
                </el-col>
              </el-row>
            </div>

            <!-- 场馆座位热力图 -->
            <el-card class="premium-chart-card seat-map-card">
              <template #header>
                <div class="chart-header">
                  <span class="chart-icon">🏟️</span>
                  <span class="chart-title">场馆座位分布图</span>
                  <div class="seat-legend">
                    <span class="legend-item"><span class="seat-dot" style="background:#fff;border:2px solid #ddd"></span>可售</span>
                    <span class="legend-item"><span class="seat-dot" style="background:#909399"></span>已售</span>
                    <span class="legend-item"><span class="seat-dot" style="background:#E6A23C"></span>锁定</span>
                  </div>
                </div>
              </template>
              <div class="seat-map-container">
                <div class="stage">● 舞 台 ●</div>
                <v-chart :option="seatHeatmapOption" style="height:280px;"></v-chart>
              </div>
            </el-card>

            <!-- 最新评论区域 -->
            <el-card class="premium-chart-card comments-card">
              <template #header>
                <div class="chart-header">
                  <span class="chart-icon">💬</span>
                  <span class="chart-title">用户最新评价</span>
                  <span class="comment-count">共 {{ ratingPage.total }} 条评价</span>
                  <el-button size="small" @click="loadRatings(1)" :icon="'Refresh'" circle></el-button>
                </div>
              </template>

              <el-empty v-if="(ratingPage.records||[]).length===0" description="暂无评价" />

              <div v-else class="comments-grid">
                <div v-for="r in ratingPage.records" :key="r.id" class="comment-item">
                  <div class="comment-header">
                    <div class="comment-user">
                      <el-avatar :size="36" :icon="'User'" :style="'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)'"></el-avatar>
                      <div class="user-info">
                        <span class="user-name">用户 #{{ r.userId }}</span>
                        <el-rate :model-value="r.score" disabled size="small" show-score />
                      </div>
                    </div>
                    <span class="comment-time">{{ formatTime(r.createTime) }}</span>
                  </div>
                  <div class="comment-content">{{ r.content || "用户未留下文字评价" }}</div>
                  <div class="comment-footer">
                    <el-tag size="small" effect="plain">订单 #{{ r.orderId }}</el-tag>
                  </div>
                </div>
              </div>

              <div v-if="(ratingPage.records||[]).length>0" style="display:flex;justify-content:center;margin-top:16px;">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="Number(ratingPage.total||0)"
                    :page-size="Number(ratingPage.size||5)"
                    :current-page="Number(ratingPage.current||1)"
                    @current-change="loadRatings"
                />
              </div>
            </el-card>

          </div>

          <!-- 空状态 -->
          <div v-else class="empty-state">
            <div class="empty-icon">📊</div>
            <div class="empty-title">选择演出查看数据分析</div>
            <div class="empty-desc">从上方选择一个演出，即可查看详细的数据分析报表</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import request, { isDemoMode } from "../api/request";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart, GaugeChart, HeatmapChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, VisualMapComponent } from "echarts/components";

use([CanvasRenderer, PieChart, BarChart, GaugeChart, HeatmapChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, VisualMapComponent]);

const router = useRouter();
const active = ref("show");

// ===================== 演示模式数据 =====================
const demoShows = [
  { id: 1, title: "周杰伦2026世界巡回演唱会", location: "北京国家体育场", showTime: "2026-06-15 19:30:00", price: 1280, category: "演唱会", createTime: "2026-05-01 10:00:00" },
  { id: 2, title: "开心麻花《乌龙山伯爵》", location: "上海人民大舞台", showTime: "2026-05-20 14:00:00", price: 380, category: "话剧歌剧", createTime: "2026-05-02 10:00:00" },
  { id: 3, title: "2026NBA中国赛", location: "广州体育馆", showTime: "2026-08-10 20:00:00", price: 880, category: "体育赛事", createTime: "2026-05-03 10:00:00" },
];

const demoOrders = [
  { id: 1, userId: 2, showId: 1, seatId: 1, amount: 1280, status: 1, createTime: "2026-05-05 14:30:00" },
  { id: 2, userId: 3, showId: 2, seatId: 5, amount: 380, status: 0, createTime: "2026-05-06 15:00:00" },
  { id: 3, userId: 2, showId: 3, seatId: 8, amount: 880, status: 1, createTime: "2026-05-07 16:00:00" },
];

const demoUsers = [
  { id: 1, username: "admin", role: "ADMIN", phone: "13800138000", email: "admin@test.com", nickname: "管理员" },
  { id: 2, username: "test", role: "USER", phone: "13900139000", email: "test@test.com", nickname: "测试用户" },
  { id: 3, username: "user1", role: "USER", phone: "13700137000", email: "user1@test.com", nickname: "普通用户" },
];

const demoStats = {
  totalSeats: 120,
  soldSeats: 68,
  lockedSeats: 5,
  sellRate: 0.567,
  paidOrders: 45,
  unpaidOrders: 8,
  revenue: 56800,
  ratingCount: 32,
  avgScore: 4.5
};

// ===================== 图表配置 =====================
const progressColors = {
  green: [{ color: "#f0f9eb" }, { color: "#67C23A" }],
  blue: [{ color: "#ecf5ff" }, { color: "#409EFF" }],
  orange: [{ color: "#fdf6ec" }, { color: "#E6A23C" }]
};

const seatPieOption = computed(() => {
  if (!stats.value) return {};
  const sold = stats.value.soldSeats || 0;
  const locked = stats.value.lockedSeats || 0;
  const available = (stats.value.totalSeats || 0) - sold - locked;
  return {
    tooltip: { trigger: "item", formatter: "{b}: {c}座 ({d}%)" },
    legend: { show: false },
    color: ["#67C23A", "#909399", "#E4E7ED"],
    series: [{
      type: "pie",
      radius: ["55%", "80%"],
      center: ["50%", "50%"],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 12, borderColor: "#fff", borderWidth: 3 },
      label: { show: false },
      emphasis: { 
        scale: true, 
        scaleSize: 10,
        label: { show: true, fontSize: 14, fontWeight: "bold" }
      },
      data: [
        { value: sold, name: "已售", itemStyle: { color: "#67C23A" } },
        { value: locked, name: "锁定", itemStyle: { color: "#909399" } },
        { value: available, name: "可售", itemStyle: { color: "#E4E7ED" } }
      ]
    }]
  };
});

const orderStatusOption = computed(() => {
  if (!stats.value) return {};
  const paid = stats.value.paidOrders || 0;
  const unpaid = stats.value.unpaidOrders || 0;
  const cancelled = Math.max(3, Math.round((paid + unpaid) * 0.1));
  return {
    tooltip: { trigger: "item", formatter: "{b}: {c}单 ({d}%)" },
    legend: { show: false },
    color: ["#67C23A", "#F56C6C", "#909399"],
    series: [{
      type: "pie",
      radius: ["50%", "75%"],
      center: ["50%", "50%"],
      roseType: "area",
      itemStyle: { borderRadius: 10, borderColor: "#fff", borderWidth: 2 },
      label: { show: true, formatter: "{b}\n{c}单", color: "#333", fontSize: 12 },
      labelLine: { length: 5, length2: 5 },
      data: [
        { value: paid, name: "已支付", itemStyle: { color: "#67C23A" } },
        { value: unpaid, name: "待支付", itemStyle: { color: "#F56C6C" } },
        { value: cancelled, name: "已取消", itemStyle: { color: "#909399" } }
      ]
    }]
  };
});

const sellRateGaugeOption = computed(() => {
  if (!stats.value) return {};
  const rate = Math.round((Number(stats.value.sellRate || 0)) * 100);
  const color = rate > 70 ? "#67C23A" : rate > 40 ? "#E6A23C" : "#F56C6C";
  return {
    series: [{
      type: "gauge",
      startAngle: 200,
      endAngle: -20,
      center: ["50%", "60%"],
      radius: "100%",
      min: 0,
      max: 100,
      splitNumber: 5,
      itemStyle: { color: color },
      progress: { show: true, width: 20, itemStyle: { borderRadius: 10 } },
      pointer: { show: false },
      axisLine: { lineStyle: { width: 20, color: [[1, "#F0F2F5"]] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      anchor: { show: false },
      title: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 42,
        fontWeight: "bold",
        fontFamily: "DIN Alternate",
        offsetCenter: [0, "30%"],
        formatter: "{value}%",
        color: color
      },
      data: [{ value: rate, name: "售出率" }]
    }]
  };
});

const revenueBarOption = computed(() => {
  if (!stats.value) return {};
  return {
    tooltip: { 
      trigger: "axis", 
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(255,255,255,0.95)",
      borderColor: "#ddd",
      textStyle: { color: "#333" }
    },
    legend: { data: ["订单数", "收入金额"], bottom: 0, textStyle: { color: "#666" } },
    grid: { left: "3%", right: "4%", bottom: "18%", top: "8%", containLabel: true },
    xAxis: { 
      type: "category", 
      data: ["已支付", "待支付", "已取消"],
      axisLine: { lineStyle: { color: "#E4E7ED" } },
      axisLabel: { color: "#666" }
    },
    yAxis: [
      { type: "value", name: "订单数", axisLabel: { color: "#999" }, splitLine: { lineStyle: { color: "#F0F2F5" } } },
      { type: "value", name: "金额(元)", axisLabel: { color: "#999" }, splitLine: { show: false } }
    ],
    series: [
      {
        name: "订单数",
        type: "bar",
        barWidth: "30%",
        barGap: "30%",
        itemStyle: { 
          color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "#409EFF" }, { offset: 1, color: "#66b1ff" }] },
          borderRadius: [6, 6, 0, 0] 
        },
        data: [stats.value.paidOrders || 0, stats.value.unpaidOrders || 0, Math.round((stats.value.paidOrders || 0) * 0.1)]
      },
      {
        name: "收入金额",
        type: "bar",
        yAxisIndex: 1,
        barWidth: "30%",
        itemStyle: { 
          color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "#67C23A" }, { offset: 1, color: "#95d475" }] },
          borderRadius: [6, 6, 0, 0] 
        },
        data: [stats.value.revenue || 0, Math.round((stats.value.revenue || 0) * 0.15), 0]
      }
    ]
  };
});

const ratingBarOption = computed(() => {
  const ratingCount = stats.value?.ratingCount || 10;
  return {
    tooltip: { 
      trigger: "axis", 
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(255,255,255,0.95)",
      textStyle: { color: "#333" }
    },
    grid: { left: "3%", right: "4%", bottom: "8%", top: "8%", containLabel: true },
    xAxis: { 
      type: "category", 
      data: ["5星", "4星", "3星", "2星", "1星"],
      axisLine: { lineStyle: { color: "#E4E7ED" } },
      axisLabel: { color: "#666" }
    },
    yAxis: { 
      type: "value", 
      name: "评价人数",
      axisLabel: { color: "#999" },
      splitLine: { lineStyle: { color: "#F0F2F5" } }
    },
    series: [{
      type: "bar",
      barWidth: "45%",
      itemStyle: {
        color: (params) => {
          const colors = ["#67C23A", "#95D475", "#E6A23C", "#F56C6C", "#909399"];
          return {
            type: "linear", x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: colors[params.dataIndex] }, { offset: 1, color: colors[params.dataIndex] + "99" }]
          };
        },
        borderRadius: [6, 6, 0, 0]
      },
      data: [
        Math.round(ratingCount * 0.5),
        Math.round(ratingCount * 0.3),
        Math.round(ratingCount * 0.12),
        Math.round(ratingCount * 0.05),
        Math.round(ratingCount * 0.03)
      ]
    }]
  };
});

const seatHeatmapOption = computed(() => {
  const rows = 10;
  const cols = 20;
  const sold = stats.value?.soldSeats || 0;
  const locked = stats.value?.lockedSeats || 0;
  const total = rows * cols;
  
  // 生成座位数据：0=可售(白色), 1=已售(灰色), 2=锁定(橙色)
  const data = [];
  const seatStatus = Array(rows).fill(null).map(() => Array(cols).fill(0));
  
  // 随机分配已售座位
  let soldCount = 0;
  const soldTarget = Math.min(sold, total * 0.6);
  while (soldCount < soldTarget) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (seatStatus[r][c] === 0) {
      seatStatus[r][c] = 1;
      soldCount++;
    }
  }
  
  // 随机分配锁定座位
  let lockedCount = 0;
  const lockedTarget = Math.min(locked, total * 0.1);
  while (lockedCount < lockedTarget) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (seatStatus[r][c] === 0) {
      seatStatus[r][c] = 2;
      lockedCount++;
    }
  }
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      data.push([j, i, seatStatus[i][j]]);
    }
  }
  
  return {
    tooltip: {
      formatter: (params) => {
        const status = params.data[2];
        const statusText = status === 0 ? "可售" : status === 1 ? "已售" : "锁定";
        const statusColor = status === 0 ? "#E4E7ED" : status === 1 ? "#909399" : "#E6A23C";
        return `<div style="padding:4px;">
          <div style="font-weight:bold;">${String.fromCharCode(65 + params.data[1])}${(params.data[0] + 1)}</div>
          <div style="color:${statusColor};margin-top:4px;">● ${statusText}</div>
        </div>`;
      },
      backgroundColor: "rgba(255,255,255,0.98)",
      borderColor: "#ddd",
      textStyle: { color: "#333" }
    },
    grid: { left: "3%", right: "2%", bottom: "12%", top: "5%", containLabel: true },
    xAxis: { 
      type: "category", 
      data: Array.from({length: cols}, (_, i) => i + 1),
      name: "座位号",
      nameLocation: "middle",
      nameGap: "30",
      nameTextStyle: { color: "#999", fontSize: 12 },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#CCC", fontSize: 10 }
    },
    yAxis: { 
      type: "category", 
      data: Array.from({length: rows}, (_, i) => String.fromCharCode(65 + i)),
      name: "排号",
      nameLocation: "middle",
      nameGap: "25",
      nameTextStyle: { color: "#999", fontSize: 12 },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#999", fontSize: 11 }
    },
    visualMap: {
      show: false,
      min: 0,
      max: 2,
      inRange: { color: ["#FFFFFF", "#909399", "#E6A23C"] }
    },
    series: [{
      type: "heatmap",
      data: data,
      emphasis: { 
        itemStyle: { 
          shadowBlur: 8, 
          shadowColor: "rgba(0,0,0,0.3)",
          borderColor: "#fff",
          borderWidth: 1
        } 
      },
      itemStyle: {
        borderColor: "#fff",
        borderWidth: 2,
        borderRadius: 4
      }
    }]
  };
});

function formatTime(timeStr) {
  if (!timeStr) return "";
  const d = new Date(timeStr);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// ===================== 数据统计 =====================
const statsShowId = ref(null);
const stats = ref(null);
const ratingPage = ref({ records: [], total: 0, current: 1, size: 5 });

async function loadRatings(page = 1) {
  if (!statsShowId.value) return;
  ratingPage.value.current = page;

  const res = await request.get(`/api/rating/show/${statsShowId.value}/page`, {
    params: { current: ratingPage.value.current, size: ratingPage.value.size },
  });

  if (!res.data || res.data.code !== 0) {
    return ElMessage.error(res.data?.msg || "获取评价失败");
  }
  ratingPage.value = res.data.data;
}

async function loadStats() {
  if (!statsShowId.value) {
    return ElMessage.warning("请选择一个演出");
  }

  // 演示模式
  if (isDemoMode) {
    stats.value = { ...demoStats, showId: statsShowId.value };
    ratingPage.value = { records: [
      { id: 1, userId: 2, orderId: 1, score: 5, content: "非常棒的演出！", createTime: "2026-05-05 18:00:00" },
      { id: 2, userId: 3, orderId: 2, score: 4, content: "还不错，推荐！", createTime: "2026-05-06 19:00:00" },
    ], total: 2, current: 1, size: 5 };
    ElMessage.success("演示模式：统计加载成功！");
    return;
  }

  try {
    console.log("[stats] querying showId =", statsShowId.value);

    const res = await request.get(`/api/admin/stats/show/${statsShowId.value}`);
    console.log("[stats] response =", res);

    if (!res.data || res.data.code !== 0) {
      return ElMessage.error(res.data?.msg || "获取统计失败（后端返回非成功）");
    }

    stats.value = res.data.data;
    await loadRatings(1);
    ElMessage.success("统计加载成功");
  } catch (e) {
    console.error("[stats] error =", e);
    ElMessage.warning("后端未启动，已切换演示模式");
    stats.value = { ...demoStats, showId: statsShowId.value };
    ratingPage.value = { records: [
      { id: 1, userId: 2, orderId: 1, score: 5, content: "非常棒的演出！", createTime: "2026-05-05 18:00:00" },
    ], total: 1, current: 1, size: 5 };
  }
}

// ===================== 用户管理（分页/搜索 + 展开查看订单） =====================
const users = ref([]);
const userKeyword = ref("");
const currentUserPage = ref(1);
const userPageSize = ref(10);
const userTotal = ref(0);

// 展开行控制
const expandKeys = ref([]); // 当前展开的 userId 列表（我这里做成一次只展开一个）
const userOrdersMap = reactive({}); // userId -> orders[]
const ordersLoadingMap = reactive({}); // userId -> true/false

function resetUserSearch() {
  userKeyword.value = "";
  loadUsers(1);
}

async function loadUsers(page = 1) {
  currentUserPage.value = page;
  
  // 演示模式
  if (isDemoMode) {
    const filtered = demoUsers.filter(u => 
      !userKeyword.value || u.username.includes(userKeyword.value)
    );
    users.value = filtered;
    userTotal.value = filtered.length;
    return;
  }
  
  try {
    const res = await request.get("/api/admin/user/page", {
      params: {
        current: currentUserPage.value,
        size: userPageSize.value,
        keyword: userKeyword.value || undefined,
      },
    });

    if (!res.data || res.data.code !== 0) {
      return ElMessage.error(res.data?.msg || "获取用户列表失败");
    }

    const p = res.data.data; // Page<User>
    users.value = p.records || [];
    userTotal.value = Number(p.total || 0);
    userPageSize.value = Number(p.size || userPageSize.value);
  } catch (e) {
    console.error("[loadUsers error]", e);
    ElMessage.warning("后端未启动，已切换演示模式");
    const filtered = demoUsers.filter(u => 
      !userKeyword.value || u.username.includes(userKeyword.value)
    );
    users.value = filtered;
    userTotal.value = filtered.length;
  }
}

async function fetchUserOrders(userId) {
  try {
    ordersLoadingMap[userId] = true;
    const res = await request.get(`/api/admin/user/${userId}/orders`);

    if (!res.data || res.data.code !== 0) {
      userOrdersMap[userId] = [];
      return ElMessage.error(res.data?.msg || "获取用户订单失败");
    }

    userOrdersMap[userId] = res.data.data || [];
  } catch (e) {
    console.error("[fetchUserOrders error]", e);
    userOrdersMap[userId] = [];
    ElMessage.error("获取用户订单失败：请检查后端/CORS/X-ADMIN");
  } finally {
    ordersLoadingMap[userId] = false;
  }
}

// 展开/收起时拉取订单
function onExpandChange(row, expanded) {
  const userId = row.id;

  if (expanded) {
    // 一次只展开一个，避免页面太长
    expandKeys.value = [userId];

    // 没拉过才拉
    if (!Array.isArray(userOrdersMap[userId])) {
      fetchUserOrders(userId);
    }
  } else {
    expandKeys.value = [];
  }
}


// 刷新统计下拉（简单做法：把页大小临时调大，拉更多演出用于下拉）
async function refreshStatsBase() {
  const old = pageSize.value;
  pageSize.value = 999;
  await loadShows(1);
  pageSize.value = old;
  ElMessage.success("已刷新演出列表");
}

// ===================== 演出管理 =====================
const shows = ref([]);
const keyword = ref("");
const current = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 弹窗：新增/编辑
const dlgVisible = ref(false);
const dlgMode = ref("add"); // add | edit

const form = reactive({
  id: null,
  title: "",
  location: "",
  showTime: "",
  price: 100,
  description: "",
  category: "演唱会",
  imageUrl: "",
});

const priceSet = reactive({
  showId: 1,
  a: 0,
  b: 0,
  c: 0,
});

const uploadHeaders = {
  "X-ADMIN": "1",
};

async function setZonePrice() {
  if (!priceSet.showId) return ElMessage.warning("请输入演出ID");
  
  // 演示模式
  if (isDemoMode) {
    ElMessage.success(`演示模式：座位价格设置成功！\nA区: ¥${priceSet.a}\nB区: ¥${priceSet.b}\nC区: ¥${priceSet.c}`);
    return;
  }
  
  try {
    const res = await request.post("/api/admin/seat/price/set", null, {
      params: {
        showId: priceSet.showId,
        priceA: priceSet.a,
        priceB: priceSet.b,
        priceC: priceSet.c,
      },
    });
    if (res.data.code !== 0) return ElMessage.error(res.data.msg || "设置失败");
    ElMessage.success(res.data.data || "设置成功");
  } catch (e) {
    ElMessage.warning("后端未启动，已切换演示模式");
    ElMessage.success(`演示模式：座位价格设置成功！\nA区: ¥${priceSet.a}\nB区: ¥${priceSet.b}\nC区: ¥${priceSet.c}`);
  }
}

function resetForm() {
  form.id = null;
  form.title = "";
  form.location = "";
  form.showTime = "";
  form.price = 100;
  form.description = "";
  form.imageUrl = "";
  // category 不在这里清空，交给 openAdd/openEdit 决定
}

function resetSearch() {
  keyword.value = "";
  loadShows(1);
}

// Date -> "yyyy-MM-dd HH:mm:ss"
function fmtDateTime(v) {
  if (!v) return null;
  if (!(v instanceof Date)) return v; // 已经是字符串
  const pad = (n) => String(n).padStart(2, "0");
  const d = v;
  return (
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

// 分页查询（可按标题模糊搜索）=> GET /api/admin/show/page
async function loadShows(page = 1) {
  current.value = page;
  
  // 演示模式
  if (isDemoMode) {
    const filtered = demoShows.filter(s => 
      !keyword.value || s.title.includes(keyword.value)
    );
    shows.value = filtered;
    total.value = filtered.length;
    return;
  }
  
  try {
    const res = await request.get("/api/admin/show/page", {
      params: {
        current: current.value,
        size: pageSize.value,
        keyword: keyword.value || undefined,
      },
    });

    if (!res.data || res.data.code !== 0) {
      return ElMessage.error(res.data?.msg || "获取演出列表失败");
    }

    const p = res.data.data; // Page<ShowEvent>
    shows.value = p.records || [];
    total.value = Number(p.total || 0);
    pageSize.value = Number(p.size || pageSize.value);
  } catch (e) {
    ElMessage.warning("后端未启动，已切换演示模式");
    const filtered = demoShows.filter(s => 
      !keyword.value || s.title.includes(keyword.value)
    );
    shows.value = filtered;
    total.value = filtered.length;
  }
}

function openAdd() {
  dlgMode.value = "add";
  resetForm();
  form.category = "演唱会";
  dlgVisible.value = true;
}

function openEdit(row) {
  dlgMode.value = "edit";
  form.id = row.id;
  form.title = row.title;
  form.location = row.location;
  form.showTime = row.showTime; // 字符串也可提交
  form.price = row.price;
  form.description = row.description || "";
  form.imageUrl = row.imageUrl || "";
  form.category = row.category || "演唱会";
  dlgVisible.value = true;
}

// 新增：POST /api/admin/show/add
// 修改：PUT  /api/admin/show/update
async function submitShow() {
  if (!form.title || !form.location || !form.showTime) {
    return ElMessage.warning("请填写名称/地点/时间");
  }

  // 演示模式
  if (isDemoMode) {
    if (dlgMode.value === "add") {
      const newShow = {
        id: demoShows.length + 1,
        title: form.title,
        location: form.location,
        showTime: fmtDateTime(form.showTime),
        price: form.price,
        category: form.category,
        createTime: new Date().toLocaleString()
      };
      demoShows.push(newShow);
      ElMessage.success("演示模式：新增成功！");
    } else {
      const idx = demoShows.findIndex(s => s.id === form.id);
      if (idx !== -1) {
        demoShows[idx] = { ...demoShows[idx], ...form };
        ElMessage.success("演示模式：修改成功！");
      }
    }
    dlgVisible.value = false;
    await loadShows(current.value);
    return;
  }

  const payload = {
    id: dlgMode.value === "edit" ? form.id : undefined,
    title: form.title,
    location: form.location,
    showTime: fmtDateTime(form.showTime),
    price: form.price,
    description: form.description,
    category: form.category,
    imageUrl: form.imageUrl,
  };

  try {
    if (dlgMode.value === "add") {
      const res = await request.post("/api/admin/show/add", payload);
      if (res.data.code !== 0) return ElMessage.error(res.data.msg || "新增失败");
      ElMessage.success(res.data.data || "新增成功");
    } else {
      const res = await request.put("/api/admin/show/update", payload);
      if (res.data.code !== 0) return ElMessage.error(res.data.msg || "修改失败");
      ElMessage.success(res.data.data || "修改成功");
    }

    dlgVisible.value = false;
    await loadShows(current.value);
  } catch (e) {
    ElMessage.error("提交失败：请检查后端/CORS/X-ADMIN");
  }
}

// 删除：DELETE /api/admin/show/delete/{id}
async function delShow(id) {
  // 演示模式
  if (isDemoMode) {
    const idx = demoShows.findIndex(s => s.id === id);
    if (idx !== -1) {
      demoShows.splice(idx, 1);
      ElMessage.success("演示模式：删除成功！");
    }
    await loadShows(current.value);
    return;
  }
  
  try {
    const res = await request.delete(`/api/admin/show/delete/${id}`);
    if (res.data.code !== 0) return ElMessage.error(res.data.msg || "删除失败");
    ElMessage.success(res.data.data || "删除成功");

    const left = shows.value.length - 1;
    const targetPage = left <= 0 && current.value > 1 ? current.value - 1 : current.value;
    await loadShows(targetPage);
  } catch (e) {
    ElMessage.error("删除失败：请检查后端/CORS/X-ADMIN");
  }
}

// 初始化座位：POST /api/seat/init/{showId}
async function initSeats(showId) {
  // 演示模式
  if (isDemoMode) {
    ElMessage.success("演示模式：座位初始化成功！");
    return;
  }
  try {
    const res = await request.post(`/api/seat/init/${showId}`);
    ElMessage.success(typeof res.data === "string" ? res.data : "初始化成功");
  } catch (e) {
    ElMessage.error("初始化座位失败：请检查后端");
  }
}

// ===================== 订单管理 =====================
const orders = ref([]);

async function loadOrders() {
  // 演示模式
  if (isDemoMode) {
    orders.value = demoOrders;
    return;
  }
  
  try {
    const res = await request.get("/api/admin/order/all");
    if (res.data && typeof res.data === "object" && "code" in res.data) {
      if (res.data.code !== 0) return ElMessage.error(res.data.msg || "获取订单失败");
      orders.value = res.data.data || [];
    } else {
      orders.value = res.data || [];
    }
  } catch (e) {
    ElMessage.warning("后端未启动，已切换演示模式");
    orders.value = demoOrders;
  }
}

// ===================== 通用 =====================
function logout() {
  localStorage.clear();
  router.push("/login");
}

function fullUrl(p) {
  if (!p) return "";
  if (p.startsWith("http")) return p;
  return "http://localhost:8081" + p;
}

function onUploadSuccess(res) {
  if (res && res.code === 0) {
    form.imageUrl = res.data;
    ElMessage.success("上传成功");
  } else {
    ElMessage.error(res?.msg || "上传失败");
  }
}

function onUploadError() {
  ElMessage.error("上传失败：请检查后端是否启动/CORS");
}

onMounted(() => {
  if ((localStorage.getItem("role") || "").toUpperCase() !== "ADMIN") {
    ElMessage.error("无权限访问后台");
    router.push("/login");
    return;
  }
  loadShows(1);
  loadOrders();
  loadUsers(1);

});
</script>

<style scoped>
.wrap {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.admin-tabs :deep(.el-tabs__header) {
  background: white;
  border-radius: 12px 12px 0 0;
  margin-bottom: 0;
}

.admin-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 0;
}

.admin-tabs :deep(.el-tabs__item) {
  font-size: 15px;
  font-weight: 600;
  padding: 0 24px;
  height: 50px;
  line-height: 50px;
}

.admin-tabs :deep(.el-tabs__item.is-active) {
  color: #FF4D4D;
}

.admin-tabs :deep(.el-tabs__active-bar) {
  background-color: #FF4D4D;
  height: 3px;
}

.admin-tabs :deep(.el-tabs__content) {
  background: white;
  padding: 24px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 4px 20px rgba(255, 77, 77, 0.3);
}
.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.topbar-logo {
  font-size: 32px;
}
.topbar-title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 1px;
}
.admin-tag {
  margin-left: 8px;
}
.topbar-right {
  display: flex;
  gap: 12px;
}
.topbar-btn {
  border-radius: 20px;
  font-weight: 600;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 数据统计页面样式 */
.stats-container {
  padding: 0;
}

/* 卡片统一样式 */
:deep(.el-card) {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #F0F2F5;
  font-weight: 700;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  border-radius: 16px 16px 0 0;
  margin: -20px -20px 20px -20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 28px;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.query-btn {
  background: white;
  color: #FF4D4D;
  border: none;
  font-weight: 600;
}

/* 核心指标卡片 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.metric-card {
  position: relative;
  padding: 20px 24px;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: default;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.metric-bg-icon {
  position: absolute;
  right: -10px;
  bottom: -10px;
  font-size: 80px;
  opacity: 0.15;
}

.metric-primary {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
}

.metric-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.metric-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.metric-money {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.metric-content {
  position: relative;
  z-index: 1;
}

.metric-label {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.metric-value {
  font-size: 32px;
  font-weight: 800;
  line-height: 1.2;
}

.metric-value.money {
  font-family: "DIN Alternate", sans-serif;
}

.metric-trend {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.3);
}

.metric-trend.up {
  color: #ffd700;
}

/* 图表区域 */
.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.chart-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.premium-chart-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  transition: box-shadow 0.3s;
}

.premium-chart-card:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}

.premium-chart-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #F0F2F5;
  background: linear-gradient(to right, #FAFBFC, #fff);
  border-radius: 16px 16px 0 0;
}

.premium-chart-card :deep(.el-card__body) {
  padding: 16px 20px;
}

.chart-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chart-icon {
  font-size: 20px;
}

.chart-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  flex: 1;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #F0F2F5;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* 仪表盘卡片 */
.gauge-card {
  background: linear-gradient(135deg, #FAFBFC 0%, #fff 100%);
}

.gauge-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 16px 0 4px;
  border-top: 1px solid #F0F2F5;
  margin-top: 8px;
}

.gauge-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.gauge-stat-value {
  font-size: 24px;
  font-weight: 800;
}

.gauge-stat-value.success { color: #67C23A; }
.gauge-stat-value.warning { color: #F56C6C; }

.gauge-stat-label {
  font-size: 12px;
  color: #999;
}

/* 进度卡片 */
.progress-card :deep(.el-card__body) {
  padding: 20px;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #666;
}

.progress-value {
  font-weight: 600;
  color: #333;
}

.progress-item :deep(.el-progress-bar__outer) {
  border-radius: 6px;
}

/* 底部图表 */
.bottom-charts {
  margin-bottom: 16px;
}

/* 座位图 */
.seat-map-card :deep(.el-card__body) {
  padding: 16px;
}

.seat-map-container {
  position: relative;
}

.stage {
  text-align: center;
  padding: 12px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 4px;
}

.seat-legend {
  display: flex;
  gap: 20px;
}

.seat-legend .legend-item {
  font-size: 12px;
}

.seat-dot {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  display: inline-block;
}

/* 评论卡片 */
.comments-card :deep(.el-card__body) {
  padding: 20px;
}

.comment-count {
  font-size: 12px;
  color: #999;
  flex: 1;
  text-align: center;
}

.comments-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.comment-item {
  padding: 16px;
  background: #FAFBFC;
  border-radius: 12px;
  transition: all 0.3s;
}

.comment-item:hover {
  background: #F0F2F5;
  transform: translateY(-2px);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-content {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.comment-footer {
  display: flex;
  gap: 8px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: linear-gradient(135deg, #FAFBFC 0%, #fff 100%);
  border-radius: 16px;
  margin-top: 20px;
}

.empty-icon {
  font-size: 72px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
}

.empty-desc {
  font-size: 14px;
  color: #999;
}

/* Element Plus 表格美化 */
:deep(.el-table) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

:deep(.el-table th) {
  background: #FAFBFC !important;
  font-weight: 700;
  color: #333;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  border: none;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #e64545 0%, #e66030 100%);
}

:deep(.el-button--success) {
  background: linear-gradient(135deg, #67C23A 0%, #85ce61 100%);
  border: none;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%) !important;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .charts-section {
    grid-template-columns: 1fr;
  }
  .comments-grid {
    grid-template-columns: 1fr;
  }
}
</style>
