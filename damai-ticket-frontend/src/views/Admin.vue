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
        <!-- 订单统计概览 -->
        <div class="order-dashboard">
          <div class="dashboard-header">
            <h3>📊 订单概览</h3>
            <div class="dashboard-actions">
              <el-button size="small" @click="loadOrders">🔄 刷新</el-button>
              <el-button size="small" type="primary" @click="exportOrders">📥 导出Excel</el-button>
              <el-button size="small" type="danger" @click="batchCancelOrders" v-if="selectedOrders.length > 0">
                🗑️ 批量取消 ({{ selectedOrders.length }})
              </el-button>
              <el-button size="small" type="success" @click="batchConfirmOrders" v-if="selectedOrders.length > 0">
                ✅ 批量确认 ({{ selectedOrders.length }})
              </el-button>
            </div>
          </div>
          
          <div class="stats-row">
            <div class="stat-box" @click="orderStatusFilter = null; filterOrders()">
              <div class="stat-icon-box all">📦</div>
              <div class="stat-content">
                <div class="stat-number">{{ orders.length }}</div>
                <div class="stat-text">全部订单</div>
                <div class="stat-percent">100%</div>
              </div>
            </div>
            <div class="stat-box" @click="orderStatusFilter = 0; filterOrders()">
              <div class="stat-icon-box pending">⏳</div>
              <div class="stat-content">
                <div class="stat-number">{{ getOrderCountByStatus(0) }}</div>
                <div class="stat-text">待支付</div>
                <div class="stat-percent">{{ ((getOrderCountByStatus(0) / orders.length) * 100 || 0).toFixed(1) }}%</div>
              </div>
            </div>
            <div class="stat-box" @click="orderStatusFilter = 1; filterOrders()">
              <div class="stat-icon-box success">✅</div>
              <div class="stat-content">
                <div class="stat-number">{{ getOrderCountByStatus(1) }}</div>
                <div class="stat-text">已完成</div>
                <div class="stat-percent success">{{ ((getOrderCountByStatus(1) / orders.length) * 100 || 0).toFixed(1) }}%</div>
              </div>
            </div>
            <div class="stat-box" @click="orderStatusFilter = 2; filterOrders()">
              <div class="stat-icon-box danger">❌</div>
              <div class="stat-content">
                <div class="stat-number">{{ getOrderCountByStatus(2) }}</div>
                <div class="stat-text">已取消</div>
                <div class="stat-percent">{{ ((getOrderCountByStatus(2) / orders.length) * 100 || 0).toFixed(1) }}%</div>
              </div>
            </div>
            <div class="stat-box revenue">
              <div class="stat-icon-box money">💰</div>
              <div class="stat-content">
                <div class="stat-number">¥{{ getTotalRevenue() }}</div>
                <div class="stat-text">总收入</div>
                <div class="stat-percent">已完成订单</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 高级筛选面板 -->
        <div class="filter-panel">
          <div class="filter-row">
            <div class="filter-group">
              <label>关键词搜索</label>
              <el-input v-model="orderKeyword" placeholder="订单号/用户ID/演出ID" clearable style="width: 200px" @input="filterOrders">
                <template #prefix><span>🔍</span></template>
              </el-input>
            </div>
            <div class="filter-group">
              <label>订单状态</label>
              <el-select v-model="orderStatusFilter" placeholder="全部" clearable style="width: 120px" @change="filterOrders">
                <el-option label="全部" :value="null" />
                <el-option label="⏳ 待支付" :value="0" />
                <el-option label="✅ 已完成" :value="1" />
                <el-option label="❌ 已取消" :value="2" />
              </el-select>
            </div>
            <div class="filter-group">
              <label>日期范围</label>
              <el-date-picker v-model="orderDateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 260px" @change="filterOrders" />
            </div>
            <div class="filter-group">
              <label>金额范围</label>
              <el-input-number v-model="orderMinAmount" :min="0" placeholder="最低" style="width: 100px" @change="filterOrders" /> -
              <el-input-number v-model="orderMaxAmount" :min="0" placeholder="最高" style="width: 100px" @change="filterOrders" />
            </div>
            <div class="filter-actions">
              <el-button size="small" type="primary" @click="filterOrders">应用筛选</el-button>
              <el-button size="small" @click="resetOrderFilter">重置</el-button>
            </div>
          </div>
        </div>

        <!-- 订单列表 -->
        <div class="order-list-container">
          <el-table :data="paginatedOrders" border stripe @selection-change="handleSelectionChange" v-loading="ordersLoading" :row-class-name="getRowClass">
            <el-table-column type="selection" width="50" />
            <el-table-column prop="id" label="订单号" width="100" fixed>
              <template #default="{ row }">
                <span class="order-no">#{{ row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="userId" label="用户" width="100">
              <template #default="{ row }">
                <el-tag size="small" type="info">{{ row.userId }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="showId" label="演出" width="180">
              <template #default="{ row }">
                <div class="show-name-cell">
                  <el-tag size="small" type="warning" class="show-id-tag">#{{ row.showId }}</el-tag>
                  <span class="show-title-text">{{ getShowTitle(row.showId) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="seatId" label="座位" width="100" />
            <el-table-column prop="amount" label="金额" width="120" sortable>
              <template #default="{ row }">
                <span class="amount-text">¥{{ row.amount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="110" sortable>
              <template #default="{ row }">
                <el-tag :type="row.status === 0 ? 'warning' : row.status === 1 ? 'success' : 'info'" size="small">
                  {{ row.status === 0 ? '⏳ 待支付' : row.status === 1 ? '✅ 已完成' : '❌ 已取消' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="下单时间" width="160" sortable>
              <template #default="{ row }">
                <span class="time-text">{{ formatDateTime(row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单追踪" width="200">
              <template #default="{ row }">
                <div class="order-timeline-mini">
                  <span class="timeline-dot" :class="{ active: row.createTime }">创</span>
                  <span class="timeline-line"></span>
                  <span class="timeline-dot" :class="{ active: row.status >= 1 }">付</span>
                  <span class="timeline-line"></span>
                  <span class="timeline-dot" :class="{ active: row.status >= 2 }">完</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="260" fixed="right">
              <template #default="{ row }">
                <div class="action-btns">
                  <el-button size="small" type="primary" plain @click="openOrderDetail(row)">详情</el-button>
                  <el-button size="small" type="success" v-if="row.status === 0" @click="handleOrderAction(row, 'pay')">确认支付</el-button>
                  <el-button size="small" type="warning" v-if="row.status === 1" @click="handleOrderAction(row, 'refund')">退款</el-button>
                  <el-button size="small" type="danger" v-if="row.status === 0" @click="handleOrderAction(row, 'cancel')">取消</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <div class="pagination-wrapper">
            <span class="pagination-info">共 {{ filteredOrders.length }} 条订单，已选 {{ selectedOrders.length }} 条</span>
            <el-pagination 
              background 
              layout="prev, pager, next, jumper, total" 
              :total="filteredOrders.length" 
              :page-size="orderPageSize" 
              :current-page="orderCurrentPage"
              @current-change="handleOrderPageChange"
            />
          </div>
        </div>

        <!-- 订单详情弹窗 -->
        <el-dialog v-model="orderDetailVisible" title="订单详情" width="700px" class="order-detail-dialog">
          <div v-if="currentOrder" class="order-detail-content">
            <!-- 基本信息卡片 -->
            <div class="detail-section">
              <div class="section-title">📋 基本信息</div>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">订单编号</span>
                  <span class="detail-value highlight">#{{ currentOrder.id }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">订单状态</span>
                  <el-tag :type="currentOrder.status === 0 ? 'warning' : currentOrder.status === 1 ? 'success' : 'info'">
                    {{ currentOrder.status === 0 ? '⏳ 待支付' : currentOrder.status === 1 ? '✅ 已完成' : '❌ 已取消' }}
                  </el-tag>
                </div>
                <div class="detail-item">
                  <span class="detail-label">下单时间</span>
                  <span class="detail-value">{{ formatDateTime(currentOrder.createTime) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">订单金额</span>
                  <span class="detail-value price">¥{{ currentOrder.amount }}</span>
                </div>
              </div>
            </div>

            <!-- 关联信息卡片 -->
            <div class="detail-section">
              <div class="section-title">👤 关联信息</div>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">用户ID</span>
                  <span class="detail-value">{{ currentOrder.userId }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">关联演出</span>
                  <span class="detail-value show-highlight">{{ getShowTitle(currentOrder.showId) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">演出ID</span>
                  <span class="detail-value">#{{ currentOrder.showId }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">座位ID</span>
                  <span class="detail-value">{{ currentOrder.seatId }}</span>
                </div>
              </div>
            </div>

            <!-- 订单时间轴 -->
            <div class="detail-section">
              <div class="section-title">📍 订单时间轴</div>
              <div class="order-timeline">
                <div class="timeline-item" :class="{ active: true, completed: true }">
                  <div class="timeline-icon">📝</div>
                  <div class="timeline-content">
                    <div class="timeline-title">订单创建</div>
                    <div class="timeline-time">{{ formatDateTime(currentOrder.createTime) }}</div>
                  </div>
                </div>
                <div class="timeline-item" :class="{ active: currentOrder.status >= 1, completed: currentOrder.status > 1 }">
                  <div class="timeline-icon">{{ currentOrder.status >= 1 ? '💳' : '⏳' }}</div>
                  <div class="timeline-content">
                    <div class="timeline-title">{{ currentOrder.status >= 1 ? '支付完成' : '等待支付' }}</div>
                    <div class="timeline-time" v-if="currentOrder.status >= 1">{{ formatDateTime(currentOrder.payTime || currentOrder.createTime) }}</div>
                  </div>
                </div>
                <div class="timeline-item" :class="{ active: currentOrder.status === 1, completed: currentOrder.status === 2 }">
                  <div class="timeline-icon">{{ currentOrder.status === 1 ? '✅' : currentOrder.status === 2 ? '❌' : '⏳' }}</div>
                  <div class="timeline-content">
                    <div class="timeline-title">{{ currentOrder.status === 1 ? '订单完成' : currentOrder.status === 2 ? '订单取消' : '等待完成' }}</div>
                    <div class="timeline-time" v-if="currentOrder.status >= 1">{{ formatDateTime(currentOrder.updateTime || currentOrder.createTime) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template #footer>
            <el-button @click="orderDetailVisible = false">关闭</el-button>
            <el-button type="primary" v-if="currentOrder?.status === 0" @click="handleOrderAction(currentOrder, 'pay')">确认支付</el-button>
            <el-button type="danger" v-if="currentOrder?.status === 0" @click="handleOrderAction(currentOrder, 'cancel')">取消订单</el-button>
          </template>
        </el-dialog>
      </el-tab-pane>

      <!-- 用户管理 -->
      <el-tab-pane label="👥 用户管理" name="user">
        <!-- 用户统计概览 -->
        <div class="user-dashboard">
          <div class="dashboard-header">
            <h3>👥 用户概览</h3>
            <div class="dashboard-actions">
              <el-button size="small" @click="loadUsers(1)">🔄 刷新</el-button>
              <el-button size="small" type="primary" @click="exportUsers">📥 导出用户</el-button>
              <el-button size="small" type="success" @click="openAddUser" v-if="false">➕ 新增用户</el-button>
            </div>
          </div>
          
          <div class="stats-row">
            <div class="stat-box" @click="userRoleFilter = null; filterUsers()">
              <div class="stat-icon-box all">👤</div>
              <div class="stat-content">
                <div class="stat-number">{{ users.length }}</div>
                <div class="stat-text">全部用户</div>
                <div class="stat-percent">100%</div>
              </div>
            </div>
            <div class="stat-box" @click="userRoleFilter = 'USER'; filterUsers()">
              <div class="stat-icon-box pending">🎫</div>
              <div class="stat-content">
                <div class="stat-number">{{ getUserCountByRole('USER') }}</div>
                <div class="stat-text">普通用户</div>
                <div class="stat-percent">{{ getUserPercent('USER') }}%</div>
              </div>
            </div>
            <div class="stat-box" @click="userRoleFilter = 'ADMIN'; filterUsers()">
              <div class="stat-icon-box danger">🔐</div>
              <div class="stat-content">
                <div class="stat-number">{{ getUserCountByRole('ADMIN') }}</div>
                <div class="stat-text">管理员</div>
                <div class="stat-percent">{{ getUserPercent('ADMIN') }}%</div>
              </div>
            </div>
            <div class="stat-box revenue">
              <div class="stat-icon-box money">📊</div>
              <div class="stat-content">
                <div class="stat-number">{{ getTotalUserOrders() }}</div>
                <div class="stat-text">用户订单总数</div>
                <div class="stat-percent">活跃度指标</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 高级筛选面板 -->
        <div class="filter-panel">
          <div class="filter-row">
            <div class="filter-group">
              <label>关键词搜索</label>
              <el-input v-model="userKeyword" placeholder="用户名/昵称/手机/邮箱" clearable style="width: 200px" @input="filterUsers">
                <template #prefix><span>🔍</span></template>
              </el-input>
            </div>
            <div class="filter-group">
              <label>用户角色</label>
              <el-select v-model="userRoleFilter" placeholder="全部角色" clearable style="width: 120px" @change="filterUsers">
                <el-option label="全部" :value="null" />
                <el-option label="🔐 管理员" value="ADMIN" />
                <el-option label="🎫 普通用户" value="USER" />
              </el-select>
            </div>
            <div class="filter-group">
              <label>注册时间</label>
              <el-date-picker v-model="userDateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 260px" @change="filterUsers" />
            </div>
            <div class="filter-actions">
              <el-button size="small" type="primary" @click="filterUsers">应用筛选</el-button>
              <el-button size="small" @click="resetUserFilter">重置</el-button>
            </div>
          </div>
        </div>

        <!-- 用户列表 -->
        <div class="user-list-container">
          <el-table 
            :data="paginatedUsers" 
            border 
            stripe 
            v-loading="usersLoading"
            @selection-change="handleUserSelectionChange"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column prop="id" label="用户ID" width="100" fixed>
              <template #default="{ row }">
                <span class="user-id">#{{ row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" width="140">
              <template #default="{ row }">
                <div class="user-cell">
                  <el-avatar :size="36" :style="'background: linear-gradient(135deg, ' + getAvatarColor(row.username) + ')'">
                    {{ row.username?.charAt(0)?.toUpperCase() || 'U' }}
                  </el-avatar>
                  <div class="user-info-mini">
                    <span class="username-text">{{ row.username }}</span>
                    <span class="nickname-text">{{ row.nickname || '-' }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="role" label="角色" width="110" sortable>
              <template #default="{ row }">
                <el-tag :type="(row.role||'').toUpperCase()==='ADMIN' ? 'danger' : 'info'" effect="dark" size="small">
                  {{ (row.role||'').toUpperCase()==='ADMIN' ? '🔐 管理员' : '🎫 普通用户' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="140">
              <template #default="{ row }">
                <span class="contact-text">{{ row.phone || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" min-width="180">
              <template #default="{ row }">
                <span class="contact-text">{{ row.email || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="orderCount" label="订单数" width="100">
              <template #default="{ row }">
                <el-badge :value="getUserOrderCount(row.id)" type="primary" :max="99" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <div class="action-btns">
                  <el-button size="small" type="primary" plain @click="openUserDetail(row)">详情</el-button>
                  <el-button size="small" type="info" plain @click="viewUserOrders(row)">订单</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <div class="pagination-wrapper">
            <span class="pagination-info">共 {{ filteredUsers.length }} 位用户，已选 {{ selectedUsers.length }} 位</span>
            <el-pagination 
              background 
              layout="prev, pager, next, jumper, total" 
              :total="filteredUsers.length" 
              :page-size="userPageSize" 
              :current-page="userCurrentPage"
              @current-change="handleUserPageChange"
            />
          </div>
        </div>

        <!-- 用户详情弹窗 -->
        <el-dialog v-model="userDetailVisible" title="用户详情" width="650px" class="user-detail-dialog">
          <div v-if="currentUser" class="user-detail-content">
            <!-- 用户信息卡片 -->
            <div class="detail-section">
              <div class="section-title">👤 基本信息</div>
              <div class="user-profile-header">
                <el-avatar :size="80" :style="'background: linear-gradient(135deg, ' + getAvatarColor(currentUser.username) + ')'">
                  {{ currentUser.username?.charAt(0)?.toUpperCase() || 'U' }}
                </el-avatar>
                <div class="profile-info">
                  <div class="profile-name">{{ currentUser.username }}</div>
                  <div class="profile-nickname">{{ currentUser.nickname || '暂无昵称' }}</div>
                  <el-tag :type="(currentUser.role||'').toUpperCase()==='ADMIN' ? 'danger' : 'info'" effect="dark">
                    {{ (currentUser.role||'').toUpperCase()==='ADMIN' ? '🔐 管理员' : '🎫 普通用户' }}
                  </el-tag>
                </div>
              </div>
            </div>

            <!-- 联系信息 -->
            <div class="detail-section">
              <div class="section-title">📞 联系信息</div>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">用户ID</span>
                  <span class="detail-value highlight">#{{ currentUser.id }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">手机号</span>
                  <span class="detail-value">{{ currentUser.phone || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">邮箱</span>
                  <span class="detail-value">{{ currentUser.email || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">注册时间</span>
                  <span class="detail-value">{{ formatDateTime(currentUser.createTime) }}</span>
                </div>
              </div>
            </div>

            <!-- 订单统计 -->
            <div class="detail-section">
              <div class="section-title">📋 订单统计</div>
              <div class="user-order-stats">
                <div class="order-stat-item">
                  <div class="order-stat-number">{{ getUserOrderCount(currentUser.id) }}</div>
                  <div class="order-stat-label">总订单数</div>
                </div>
                <div class="order-stat-item success">
                  <div class="order-stat-number">{{ getUserOrderCountByStatus(currentUser.id, 1) }}</div>
                  <div class="order-stat-label">已完成</div>
                </div>
                <div class="order-stat-item warning">
                  <div class="order-stat-number">{{ getUserOrderCountByStatus(currentUser.id, 0) }}</div>
                  <div class="order-stat-label">待支付</div>
                </div>
                <div class="order-stat-item danger">
                  <div class="order-stat-number">{{ getUserOrderCountByStatus(currentUser.id, 2) }}</div>
                  <div class="order-stat-label">已取消</div>
                </div>
              </div>
            </div>

            <!-- 最近订单 -->
            <div class="detail-section" v-if="currentUserOrders.length > 0">
              <div class="section-title">🛒 最近订单</div>
              <el-table :data="currentUserOrders.slice(0, 5)" size="small" border>
                <el-table-column prop="id" label="订单号" width="80">
                  <template #default="{ row }">
                    <span class="order-no-small">#{{ row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="showTitle" label="演出" min-width="120" />
                <el-table-column prop="amount" label="金额" width="90">
                  <template #default="{ row }">
                    <span class="amount-text-small">¥{{ row.amount }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="90">
                  <template #default="{ row }">
                    <el-tag :type="row.status === 0 ? 'warning' : row.status === 1 ? 'success' : 'info'" size="small">
                      {{ row.status === 0 ? '待支付' : row.status === 1 ? '已完成' : '已取消' }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <template #footer>
            <el-button @click="userDetailVisible = false">关闭</el-button>
            <el-button type="primary" @click="viewUserOrders(currentUser)">查看全部订单</el-button>
          </template>
        </el-dialog>

        <!-- 用户订单弹窗 -->
        <el-dialog v-model="userOrdersVisible" :title="'📋 ' + (currentUser?.username || '') + ' 的订单明细'" width="900px">
          <el-table :data="currentUserOrders" border stripe v-loading="userOrdersLoading">
            <el-table-column prop="id" label="订单ID" width="90">
              <template #default="{ row }">
                <span class="order-no-small">#{{ row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showTitle" label="演出" min-width="180" />
            <el-table-column prop="seatNumber" label="座位" width="100" />
            <el-table-column prop="amount" label="金额" width="100">
              <template #default="{ row }">
                <span class="amount-text-small">¥{{ row.amount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="支付状态" width="110">
              <template #default="{ row }">
                <el-tag :type="row.status === 0 ? 'warning' : row.status === 1 ? 'success' : 'info'" size="small">
                  {{ row.status === 0 ? '⏳ 待支付' : row.status === 1 ? '✅ 已完成' : '❌ 已取消' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="下单时间" width="160" />
          </el-table>
          <div v-if="currentUserOrders.length === 0 && !userOrdersLoading" style="text-align:center;padding:40px;color:#999;">
            暂无订单记录
          </div>
          <template #footer>
            <el-button @click="userOrdersVisible = false">关闭</el-button>
          </template>
        </el-dialog>
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

  try {
    const res = await request.get(`/api/rating/show/${statsShowId.value}/page`, {
      params: { current: ratingPage.value.current, size: ratingPage.value.size },
    });

    ratingPage.value = res || { records: [], total: 0, current: 1, size: 5 };
  } catch (e) {
    console.error("获取评价失败:", e);
    ratingPage.value = { records: [], total: 0, current: 1, size: 5 };
  }
}

async function loadStats() {
  if (!statsShowId.value) {
    return ElMessage.warning("请选择一个演出");
  }

  try {
    console.log("[stats] querying showId =", statsShowId.value);

    const res = await request.get(`/api/admin/stats/show/${statsShowId.value}`);
    console.log("[stats] response =", res);

    stats.value = res;
    await loadRatings(1);
    ElMessage.success("统计加载成功");
  } catch (e) {
    console.error("[stats] error =", e);
    ElMessage.warning("获取统计失败：" + (e.message || "未知错误"));
  }
}

// ===================== 用户管理（分页/搜索 + 展开查看订单） =====================
const users = ref([]);
const allUsers = ref([]); // 保存所有用户用于统计
const userKeyword = ref("");
const currentUserPage = ref(1);
const userPageSize = ref(10);
const userTotal = ref(0);
const usersLoading = ref(false);

// 筛选相关
const userRoleFilter = ref(null);
const userDateRange = ref(null);

// 用户详情弹窗
const userDetailVisible = ref(false);
const currentUser = ref(null);

// 用户订单弹窗
const userOrdersVisible = ref(false);
const currentUserOrders = ref([]);
const userOrdersLoading = ref(false);

// 选中的用户
const selectedUsers = ref([]);

// 所有用户订单映射（用于统计）
const allUserOrdersMap = reactive({}); // userId -> orders[]

const filteredUsers = computed(() => {
  let result = allUsers.value;
  
  // 角色筛选
  if (userRoleFilter.value) {
    result = result.filter(u => (u.role || '').toUpperCase() === userRoleFilter.value.toUpperCase());
  }
  
  // 关键词搜索
  if (userKeyword.value) {
    const kw = userKeyword.value.toLowerCase();
    result = result.filter(u => 
      (u.username || '').toLowerCase().includes(kw) ||
      (u.nickname || '').toLowerCase().includes(kw) ||
      (u.phone || '').includes(kw) ||
      (u.email || '').toLowerCase().includes(kw)
    );
  }
  
  // 日期范围筛选
  if (userDateRange.value && userDateRange.value.length === 2) {
    const [startDate, endDate] = userDateRange.value;
    result = result.filter(u => {
      if (!u.createTime) return false;
      const regDate = u.createTime.split(' ')[0];
      return regDate >= startDate && regDate <= endDate;
    });
  }
  
  return result;
});

const paginatedUsers = computed(() => {
  const start = (currentUserPage.value - 1) * userPageSize.value;
  const end = start + userPageSize.value;
  return filteredUsers.value.slice(start, end);
});

// 统计函数
function getUserCountByRole(role) {
  return allUsers.value.filter(u => (u.role || '').toUpperCase() === role.toUpperCase()).length;
}

function getUserPercent(role) {
  const total = allUsers.value.length;
  if (total === 0) return 0;
  return ((getUserCountByRole(role) / total) * 100).toFixed(1);
}

function getTotalUserOrders() {
  return Object.values(allUserOrdersMap).reduce((sum, orders) => sum + (orders?.length || 0), 0);
}

function getUserOrderCount(userId) {
  return allUserOrdersMap[userId]?.length || 0;
}

function getUserOrderCountByStatus(userId, status) {
  const orders = allUserOrdersMap[userId] || [];
  return orders.filter(o => o.status === status).length;
}

// 头像颜色生成
function getAvatarColor(username) {
  const colors = [
    '#667eea, #764ba2', '#f093fb, #f5576c', '#4facfe, #00f2fe',
    '#43e97b, #38f9d7', '#fa709a, #fee140', '#a8edea, #fed6e3',
    '#ff9a9e, #fecfef', '#667eea, #764ba2', '#ffecd2, #fcb69f'
  ];
  const index = username ? (username.charCodeAt(0) % colors.length) : 0;
  return colors[index];
}

function resetUserSearch() {
  userKeyword.value = "";
  loadUsers(1);
}

function filterUsers() {
  currentUserPage.value = 1;
}

function resetUserFilter() {
  userKeyword.value = '';
  userRoleFilter.value = null;
  userDateRange.value = null;
  currentUserPage.value = 1;
}

function handleUserPageChange(page) {
  currentUserPage.value = page;
}

function handleUserSelectionChange(selection) {
  selectedUsers.value = selection;
}

function openUserDetail(user) {
  currentUser.value = user;
  currentUserOrders.value = allUserOrdersMap[user.id] || [];
  userDetailVisible.value = true;
}

function viewUserOrders(user) {
  currentUser.value = user;
  userOrdersLoading.value = true;
  userOrdersVisible.value = true;
  
  // 如果还没有加载过用户订单
  if (!allUserOrdersMap[user.id]) {
    fetchUserOrdersForStats(user.id).then(orders => {
      currentUserOrders.value = orders;
      userOrdersLoading.value = false;
    });
  } else {
    currentUserOrders.value = allUserOrdersMap[user.id] || [];
    userOrdersLoading.value = false;
  }
}

function openAddUser() {
  // 新增用户功能预留
  ElMessage.info('新增用户功能开发中...');
}

async function fetchUserOrdersForStats(userId) {
  try {
    const res = await request.get(`/api/admin/user/${userId}/orders`);
    return Array.isArray(res) ? res : [];
  } catch (e) {
    console.error("[fetchUserOrdersForStats error]", e);
    return [];
  }
}

async function fetchAllUserOrders() {
  // 预加载所有用户的订单用于统计
  for (const user of allUsers.value) {
    if (!allUserOrdersMap[user.id]) {
      const orders = await fetchUserOrdersForStats(user.id);
      allUserOrdersMap[user.id] = orders;
    }
  }
}

function exportUsers() {
  const data = filteredUsers.value.map(u => ({
    用户ID: u.id,
    用户名: u.username,
    昵称: u.nickname || '',
    角色: (u.role || '').toUpperCase() === 'ADMIN' ? '管理员' : '普通用户',
    手机号: u.phone || '',
    邮箱: u.email || '',
    订单数: getUserOrderCount(u.id),
    注册时间: formatDateTime(u.createTime)
  }));
  
  const csv = '用户ID,用户名,昵称,角色,手机号,邮箱,订单数,注册时间\n' + 
    data.map(row => Object.values(row).join(',')).join('\n');
  
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `用户列表_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  ElMessage.success('导出成功，共 ' + data.length + ' 条记录');
}

async function loadUsers(page = 1) {
  currentUserPage.value = page;
  usersLoading.value = true;
  
  try {
    const res = await request.get("/api/admin/user/page", {
      params: {
        current: currentUserPage.value,
        size: 100, // 加载更多用于统计
        keyword: userKeyword.value || undefined,
      },
    });

    const p = res; // 响应拦截器已解包
    users.value = p.records || [];
    allUsers.value = p.records || [];
    userTotal.value = Number(p.total || 0);
    userPageSize.value = Number(p.size || userPageSize.value);
    
    // 异步加载所有用户的订单用于统计
    fetchAllUserOrders();
  } catch (e) {
    console.error("[loadUsers error]", e);
    ElMessage.error("获取用户列表失败：" + (e.message || "未知错误"));
  } finally {
    usersLoading.value = false;
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
  
  try {
    await request.post("/api/admin/seat/price/set", null, {
      params: {
        showId: priceSet.showId,
        priceA: priceSet.a,
        priceB: priceSet.b,
        priceC: priceSet.c,
      },
    });
    ElMessage.success("座位价格设置成功");
  } catch (e) {
    console.error("设置座位价格失败:", e);
    ElMessage.error("设置失败：" + (e.message || "未知错误"));
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
  
  try {
    const res = await request.get("/api/admin/show/page", {
      params: {
        current: current.value,
        size: pageSize.value,
        keyword: keyword.value || undefined,
      },
    });

    const p = res; // 响应拦截器已解包
    shows.value = p.records || [];
    total.value = Number(p.total || 0);
    pageSize.value = Number(p.size || pageSize.value);
  } catch (e) {
    console.error("[loadShows error]", e);
    ElMessage.error("获取演出列表失败：" + (e.message || "未知错误"));
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
      await request.post("/api/admin/show/add", payload);
      ElMessage.success("新增成功");
    } else {
      await request.put("/api/admin/show/update", payload);
      ElMessage.success("修改成功");
    }

    dlgVisible.value = false;
    await loadShows(current.value);
  } catch (e) {
    console.error("提交失败:", e);
    ElMessage.error("提交失败：" + (e.message || "未知错误"));
  }
}

// 删除：DELETE /api/admin/show/delete/{id}
async function delShow(id) {
  try {
    await request.delete(`/api/admin/show/delete/${id}`);
    ElMessage.success("删除成功");

    const left = shows.value.length - 1;
    const targetPage = left <= 0 && current.value > 1 ? current.value - 1 : current.value;
    await loadShows(targetPage);
  } catch (e) {
    console.error("删除失败:", e);
    ElMessage.error("删除失败：" + (e.message || "未知错误"));
  }
}

// 初始化座位：POST /api/seat/init/{showId}
async function initSeats(showId) {
  try {
    await request.post(`/api/seat/init/${showId}`);
    ElMessage.success("座位初始化成功");
  } catch (e) {
    console.error("初始化座位失败:", e);
    ElMessage.error("初始化座位失败：" + (e.message || "未知错误"));
  }
}

// ===================== 订单管理 =====================
const orders = ref([]);
const orderKeyword = ref('');
const orderStatusFilter = ref(null);
const orderDateRange = ref(null);
const orderMinAmount = ref(null);
const orderMaxAmount = ref(null);
const orderCurrentPage = ref(1);
const orderPageSize = ref(15);
const selectedOrders = ref([]);
const ordersLoading = ref(false);
const orderDetailVisible = ref(false);
const currentOrder = ref(null);
const orderShowsMap = ref({}); // showId -> showTitle 映射

const filteredOrders = computed(() => {
  let result = orders.value;
  
  // 状态筛选
  if (orderStatusFilter.value !== null) {
    result = result.filter(o => o.status === orderStatusFilter.value);
  }
  
  // 关键词搜索
  if (orderKeyword.value) {
    const kw = orderKeyword.value.toLowerCase();
    result = result.filter(o => 
      String(o.id).includes(kw) ||
      String(o.userId).includes(kw) ||
      String(o.showId).includes(kw)
    );
  }
  
  // 日期范围筛选
  if (orderDateRange.value && orderDateRange.value.length === 2) {
    const [startDate, endDate] = orderDateRange.value;
    result = result.filter(o => {
      if (!o.createTime) return false;
      const orderDate = o.createTime.split(' ')[0];
      return orderDate >= startDate && orderDate <= endDate;
    });
  }
  
  // 金额范围筛选
  if (orderMinAmount.value !== null) {
    result = result.filter(o => parseFloat(o.amount || 0) >= orderMinAmount.value);
  }
  if (orderMaxAmount.value !== null) {
    result = result.filter(o => parseFloat(o.amount || 0) <= orderMaxAmount.value);
  }
  
  return result;
});

const paginatedOrders = computed(() => {
  const start = (orderCurrentPage.value - 1) * orderPageSize.value;
  const end = start + orderPageSize.value;
  return filteredOrders.value.slice(start, end);
});

function getOrderCountByStatus(status) {
  return orders.value.filter(o => o.status === status).length;
}

function getTotalRevenue() {
  return orders.value.filter(o => o.status === 1).reduce((sum, o) => sum + parseFloat(o.amount || 0), 0).toFixed(2);
}

function getStatusText(status) {
  const map = { 0: '待支付', 1: '已完成', 2: '已取消' };
  return map[status] || '未知';
}

function getStatusClass(status) {
  const map = { 0: 'pending', 1: 'success', 2: 'cancelled' };
  return map[status] || '';
}

function formatDateTime(dateTime) {
  if (!dateTime) return '-';
  const date = new Date(dateTime);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function filterOrders() {
  orderCurrentPage.value = 1; // 重置到第一页
}

function resetOrderFilter() {
  orderKeyword.value = '';
  orderStatusFilter.value = null;
  orderDateRange.value = null;
  orderMinAmount.value = null;
  orderMaxAmount.value = null;
  orderCurrentPage.value = 1;
}

function handleOrderPageChange(page) {
  orderCurrentPage.value = page;
}

function handleSelectionChange(selection) {
  selectedOrders.value = selection;
}

function getRowClass({ row }) {
  return row.status === 0 ? 'pending-row' : row.status === 2 ? 'cancelled-row' : '';
}

async function handleOrderAction(order, action) {
  try {
    if (action === 'pay') {
      await request.post('/api/order/pay', { orderId: order.id, userId: order.userId });
      ElMessage.success('支付确认成功');
    } else if (action === 'cancel') {
      await request.post('/api/order/cancel', { orderId: order.id, userId: order.userId });
      ElMessage.success('订单已取消');
    } else if (action === 'refund') {
      await request.post('/api/order/refund', { orderId: order.id });
      ElMessage.success('退款处理成功');
    } else if (action === 'print') {
      window.print();
      return;
    }
    orderDetailVisible.value = false;
    await loadOrders();
  } catch (e) {
    console.error('[order action error]', e);
    ElMessage.error('操作失败：' + (e.message || '未知错误'));
  }
}

function openOrderDetail(order) {
  currentOrder.value = order;
  orderDetailVisible.value = true;
}

async function batchConfirmOrders() {
  if (selectedOrders.value.length === 0) {
    return ElMessage.warning('请先选择订单');
  }
  
  const pendingOrders = selectedOrders.value.filter(o => o.status === 0);
  if (pendingOrders.length === 0) {
    return ElMessage.warning('选中的订单中没有待支付的订单');
  }
  
  try {
    for (const order of pendingOrders) {
      await request.post('/api/order/pay', { orderId: order.id, userId: order.userId });
    }
    ElMessage.success(`成功确认 ${pendingOrders.length} 笔订单`);
    selectedOrders.value = [];
    await loadOrders();
  } catch (e) {
    console.error('[batch confirm error]', e);
    ElMessage.error('批量确认失败');
  }
}

async function batchCancelOrders() {
  if (selectedOrders.value.length === 0) {
    return ElMessage.warning('请先选择订单');
  }
  
  const cancelableOrders = selectedOrders.value.filter(o => o.status === 0);
  if (cancelableOrders.length === 0) {
    return ElMessage.warning('选中的订单中没有可取消的订单');
  }
  
  try {
    for (const order of cancelableOrders) {
      await request.post('/api/order/cancel', { orderId: order.id, userId: order.userId });
    }
    ElMessage.success(`成功取消 ${cancelableOrders.length} 笔订单`);
    selectedOrders.value = [];
    await loadOrders();
  } catch (e) {
    console.error('[batch cancel error]', e);
    ElMessage.error('批量取消失败');
  }
}

function exportOrders() {
  const data = filteredOrders.value.map(o => ({
    订单ID: o.id,
    用户ID: o.userId,
    演出ID: o.showId,
    座位ID: o.seatId,
    金额: o.amount,
    状态: getStatusText(o.status),
    创建时间: formatDateTime(o.createTime)
  }));
  
  const csv = '订单ID,用户ID,演出ID,座位ID,金额,状态,创建时间\n' + 
    data.map(row => Object.values(row).join(',')).join('\n');
  
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `订单_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  ElMessage.success('导出成功，共 ' + data.length + ' 条记录');
}

async function loadOrders() {
  ordersLoading.value = true;
  try {
    const res = await request.get("/api/admin/order/all");
    orders.value = Array.isArray(res) ? res : [];
    
    // 构建演出名称映射（使用已加载的shows列表）
    const map = {};
    shows.value.forEach(s => {
      if (s.id) {
        map[s.id] = s.title;
      }
    });
    orderShowsMap.value = map;
  } catch (e) {
    console.error("[loadOrders error]", e);
    ElMessage.error("获取订单列表失败：" + (e.message || "未知错误"));
  } finally {
    ordersLoading.value = false;
  }
}

function getShowTitle(showId) {
  const title = orderShowsMap.value[showId];
  if (title) return title;
  // 如果映射中没有，尝试从shows列表中查找
  const show = shows.value.find(s => s.id === showId);
  return show ? show.title : `演出 #${showId}`;
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
  // 上传接口可能返回 {code, data} 或直接返回URL
  if (res && typeof res === 'object') {
    if (res.code === 0) {
      form.imageUrl = res.data;
      ElMessage.success("上传成功");
    } else {
      ElMessage.error(res.msg || "上传失败");
    }
  } else if (typeof res === 'string') {
    form.imageUrl = res;
    ElMessage.success("上传成功");
  }
}

function onUploadError() {
  ElMessage.error("上传失败：请检查后端是否启动/CORS");
}

onMounted(() => {
  // 已移除权限检查，任何人都可访问后台（演示用）
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

/* ===================== 订单管理新样式 ===================== */
/* 订单仪表盘 */
.order-dashboard {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #F0F2F5;
}

.dashboard-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.dashboard-actions {
  display: flex;
  gap: 10px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.stat-box {
  background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.stat-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  border-color: #FF4D4D;
}

.stat-box.revenue {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
}

.stat-box.revenue .stat-percent {
  color: rgba(255,255,255,0.8);
}

.stat-icon-box {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-icon-box.all {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-icon-box.pending {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-icon-box.success {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  color: white;
}

.stat-icon-box.danger {
  background: linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%);
  color: white;
}

.stat-icon-box.money {
  background: rgba(255,255,255,0.2);
}

.stat-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: #333;
  line-height: 1.2;
}

.stat-text {
  font-size: 13px;
  color: #999;
  margin: 4px 0;
}

.stat-percent {
  font-size: 12px;
  color: #666;
}

/* 筛选面板 */
.filter-panel {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group label {
  font-size: 12px;
  color: #999;
  font-weight: 600;
}

.filter-actions {
  display: flex;
  gap: 10px;
}

/* 订单列表容器 */
.order-list-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
}

.order-no {
  font-weight: 700;
  color: #FF4D4D;
  font-family: 'Courier New', monospace;
}

.amount-text {
  font-weight: 700;
  color: #FF4D4D;
  font-size: 16px;
}

.time-text {
  font-size: 13px;
  color: #666;
}

.order-timeline-mini {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #E4E7ED;
  color: #999;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.timeline-dot.active {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
}

.timeline-line {
  flex: 1;
  height: 2px;
  background: #E4E7ED;
  max-width: 30px;
}

.action-btns {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* 演出名称显示 */
.show-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.show-id-tag {
  align-self: flex-start;
}

.show-title-text {
  font-size: 13px;
  color: #333;
  font-weight: 600;
  line-height: 1.3;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.show-highlight {
  color: #FF4D4D;
  font-weight: 700;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #F0F2F5;
}

.pagination-info {
  font-size: 13px;
  color: #999;
}

/* 表格行样式 */
:deep(.pending-row) {
  background-color: #FFF9F0 !important;
}

:deep(.cancelled-row) {
  background-color: #F5F5F5 !important;
  opacity: 0.7;
}

/* 订单详情弹窗 */
.order-detail-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
  padding: 20px;
}

.order-detail-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.order-detail-dialog :deep(.el-dialog__close) {
  color: white;
}

.order-detail-content {
  padding: 10px 0;
}

.detail-section {
  background: #FAFBFC;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid #FF4D4D;
  display: inline-block;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  font-size: 12px;
  color: #999;
  font-weight: 600;
}

.detail-value {
  font-size: 15px;
  color: #333;
  font-weight: 600;
}

.detail-value.highlight {
  color: #FF4D4D;
  font-size: 18px;
  font-weight: 800;
}

.detail-value.price {
  color: #FF4D4D;
  font-size: 24px;
  font-weight: 800;
}

/* 订单时间轴 */
.order-timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 20px 0;
}

.order-timeline::before {
  content: '';
  position: absolute;
  top: 38px;
  left: 40px;
  right: 40px;
  height: 3px;
  background: #E4E7ED;
  z-index: 0;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  flex: 1;
}

.timeline-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #E4E7ED;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 10px;
  transition: all 0.3s;
}

.timeline-item.active .timeline-icon {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(255,77,77,0.4);
  transform: scale(1.1);
}

.timeline-item.completed .timeline-icon {
  background: #67C23A;
  color: white;
}

.timeline-content {
  text-align: center;
}

.timeline-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.timeline-time {
  font-size: 12px;
  color: #999;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .order-timeline {
    flex-direction: column;
    gap: 20px;
  }
  
  .order-timeline::before {
    top: 20px;
    bottom: 20px;
    left: 24px;
    right: auto;
    width: 3px;
    height: auto;
  }
  
  .timeline-item {
    flex-direction: row;
    gap: 16px;
  }
  
  .timeline-content {
    text-align: left;
  }
}

/* ===================== 用户管理新样式 ===================== */
/* 用户仪表盘 */
.user-dashboard {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
}

.user-dashboard .dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #F0F2F5;
}

.user-dashboard .dashboard-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

/* 用户列表容器 */
.user-list-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
}

.user-id {
  font-weight: 700;
  color: #667EEA;
  font-family: 'Courier New', monospace;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info-mini {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.username-text {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.nickname-text {
  font-size: 12px;
  color: #999;
}

.contact-text {
  font-size: 13px;
  color: #666;
}

.order-no-small {
  font-weight: 600;
  color: #FF4D4D;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.amount-text-small {
  font-weight: 600;
  color: #FF4D4D;
  font-size: 14px;
}

/* 用户详情弹窗 */
.user-detail-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  color: white;
  padding: 20px;
}

.user-detail-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.user-detail-dialog :deep(.el-dialog__close) {
  color: white;
}

.user-detail-content {
  padding: 10px 0;
}

.user-profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  border-radius: 12px;
  color: white;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
}

.profile-nickname {
  font-size: 14px;
  opacity: 0.9;
}

.user-order-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.order-stat-item {
  background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.order-stat-item:hover {
  border-color: #667EEA;
  transform: translateY(-2px);
}

.order-stat-item.success {
  background: linear-gradient(135deg, #f0f9eb 0%, #fff 100%);
}

.order-stat-item.warning {
  background: linear-gradient(135deg, #fdf6ec 0%, #fff 100%);
}

.order-stat-item.danger {
  background: linear-gradient(135deg, #fef0f0 0%, #fff 100%);
}

.order-stat-number {
  font-size: 28px;
  font-weight: 800;
  color: #333;
}

.order-stat-item.success .order-stat-number {
  color: #67C23A;
}

.order-stat-item.warning .order-stat-number {
  color: #E6A23C;
}

.order-stat-item.danger .order-stat-number {
  color: #F56C6C;
}

.order-stat-label {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

/* 响应式 */
@media (max-width: 768px) {
  .user-order-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
