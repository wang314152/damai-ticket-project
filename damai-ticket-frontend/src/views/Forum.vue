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
          <el-button @click="goForum" class="header-btn forum-btn" type="primary">
            <span>💬</span> 论坛
          </el-button>
          <el-button @click="goProfile" circle class="action-btn" title="个人中心">
            <span class="btn-icon">👤</span>
          </el-button>
          <el-button @click="goAdmin" v-if="isAdmin" class="header-btn admin-btn">
            <span>⚙️</span> 管理后台
          </el-button>
          <el-button @click="logout" class="header-btn logout-btn" plain>
            退出
          </el-button>
        </div>
      </div>
    </header>

    <!-- 论坛主体 -->
    <div class="forum-container">
      <div class="forum-header">
        <h1 class="forum-title">
          <span class="title-icon">💬</span>
          社区论坛
        </h1>
        <p class="forum-desc">在这里分享你的观演体验，讨论精彩演出！</p>
      </div>

      <!-- 发帖区域 -->
      <div class="post-form" v-if="isLoggedIn">
        <h3 class="form-title">发布新帖</h3>
        <div class="form-group">
          <input
            v-model="newPost.title"
            class="form-input"
            placeholder="请输入标题..."
            maxlength="100"
          />
        </div>
        <div class="form-group">
          <el-select
            v-model="newPost.showId"
            placeholder="选择关联的演出（可选）"
            clearable
            filterable
            class="show-select"
            @change="onShowChange"
          >
            <el-option
              v-for="show in showList"
              :key="show.id"
              :label="show.title"
              :value="show.id"
            >
              <span>{{ show.title }}</span>
              <span style="float: right; color: #999; font-size: 12px;">{{ show.showTime }}</span>
            </el-option>
          </el-select>
        </div>
        <div class="form-group">
          <textarea
            v-model="newPost.content"
            class="form-textarea"
            placeholder="请输入内容..."
            rows="4"
            maxlength="2000"
          ></textarea>
        </div>
        <div class="form-actions">
          <span class="char-count">{{ newPost.content.length }}/2000</span>
          <el-button type="primary" @click="submitPost" :loading="submitting">
            发布帖子
          </el-button>
        </div>
      </div>
      <div class="login-tip" v-else>
        <span>登录后可发布帖子</span>
        <el-button type="primary" size="small" @click="router.push('/login')">
          去登录
        </el-button>
      </div>

      <!-- 帖子列表 -->
      <div class="post-list">
        <h3 class="list-title">
          帖子列表 ({{ posts.length }})
          <el-select
            v-model="selectedShowId"
            placeholder="全部演出"
            clearable
            size="small"
            class="show-filter"
            @change="loadPosts"
          >
            <el-option
              v-for="show in showList"
              :key="show.id"
              :label="show.title"
              :value="show.id"
            >
              {{ show.title }}
            </el-option>
          </el-select>
        </h3>
        <div class="posts" v-if="posts.length > 0">
          <div
            class="post-card"
            v-for="post in posts"
            :key="post.id"
            @click="viewDetail(post.id)"
          >
            <div class="post-header">
              <span class="post-author">{{ post.authorName || '匿名用户' }}</span>
              <span class="post-time">{{ formatTime(post.createTime) }}</span>
            </div>
            <h4 class="post-title">{{ post.title }}</h4>
            <p class="post-content">{{ truncateContent(post.content) }}</p>
            <div class="post-show-tag" v-if="post.showName">
              <span class="show-tag">🎵 {{ post.showName }}</span>
            </div>
            <div class="post-footer">
              <span class="post-stat">
                <span class="stat-icon">👁️</span>
                {{ post.viewCount || 0 }}
              </span>
              <span class="post-stat">
                <span class="stat-icon">💬</span>
                {{ post.replyCount || 0 }}
              </span>
              <span class="post-action delete-action" @click.stop="deletePost(post.id)" v-if="canDelete(post)">
                删除
              </span>
            </div>
          </div>
        </div>
        <div class="empty-posts" v-else>
          <div class="empty-icon">📝</div>
          <p>暂无帖子，来说点什么吧！</p>
        </div>
      </div>
    </div>

    <!-- 帖子详情弹窗 -->
    <el-dialog v-model="showDetail" :title="currentPost.title" width="650px">
      <div class="detail-content" v-if="currentPost.id">
        <div class="detail-meta">
          <span>👤 {{ currentPost.authorName || '匿名用户' }}</span>
          <span>🕐 {{ formatTime(currentPost.createTime) }}</span>
        </div>
        <div class="detail-body">
          {{ currentPost.content }}
        </div>
        <div class="detail-stats">
          <span>👁️ {{ currentPost.viewCount || 0 }} 次浏览</span>
          <span>💬 {{ replies.length }} 条回复</span>
        </div>

        <!-- 回复列表 -->
        <div class="replies-section">
          <h4 class="replies-title">全部回复 ({{ replies.length }})</h4>
          <div class="replies-list" v-if="replies.length > 0">
            <div class="reply-item" v-for="reply in replies" :key="reply.id">
              <div class="reply-header">
                <span class="reply-user">{{ reply.userName || '匿名用户' }}</span>
                <span class="reply-time">{{ formatTime(reply.createTime) }}</span>
                <span class="reply-delete" @click="deleteReply(reply.id)" v-if="canDeleteReply(reply)">删除</span>
              </div>
              <div class="reply-content">{{ reply.content }}</div>
            </div>
          </div>
          <div class="replies-empty" v-else>
            <p>暂无回复，快来抢沙发吧！</p>
          </div>
        </div>

        <!-- 回复输入框 -->
        <div class="reply-form" v-if="isLoggedIn">
          <textarea
            v-model="newReply"
            class="reply-textarea"
            placeholder="写下你的回复..."
            rows="3"
            maxlength="500"
          ></textarea>
          <div class="reply-actions">
            <span class="char-count">{{ newReply.length }}/500</span>
            <el-button type="primary" size="small" @click="submitReply" :loading="replying">
              发表评论
            </el-button>
          </div>
        </div>
        <div class="reply-tip" v-else>
          <span>登录后可参与回复</span>
          <el-button type="primary" size="small" @click="goLogin">
            去登录
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "../api/request";

const router = useRouter();
const isAdmin = computed(() => (localStorage.getItem("role") || "").toUpperCase() === "ADMIN");
const isLoggedIn = computed(() => !!localStorage.getItem("userId"));
const currentUserId = computed(() => parseInt(localStorage.getItem("userId") || "0"));
const currentUsername = computed(() => localStorage.getItem("username") || "匿名用户");

const posts = ref([]);
const showDetail = ref(false);
const currentPost = ref({});
const submitting = ref(false);
const replying = ref(false);

// 回复相关
const replies = ref([]);
const newReply = ref("");

// 演出列表
const showList = ref([]);
const selectedShowId = ref(null);

// 新帖子
const newPost = ref({
  title: "",
  content: "",
  showId: null,
  showName: ""
});

// 加载演出列表
async function loadShows() {
  try {
    const data = await request.get("/api/show/list");
    showList.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.log("获取演出列表失败", e);
    showList.value = [];
  }
}

const demoPosts = [
  { id: 1, title: "周杰伦演唱会观后感", content: "终于看到偶像现场了！太震撼了，嗓子都喊哑了。舞台效果超级棒，周杰伦的状态也非常好，唱了好多经典老歌。", authorName: "杰迷小王", createTime: "2026-05-15 14:30:00", viewCount: 256, replyCount: 2 },
  { id: 2, title: "开心麻花话剧推荐", content: "强烈推荐《乌龙山伯爵》，笑点密集，演员演技炸裂！适合带朋友一起去看，保证让你笑到肚子疼。", authorName: "戏剧爱好者", createTime: "2026-05-14 09:20:00", viewCount: 189, replyCount: 1 },
  { id: 3, title: "德云社相声专场体验", content: "昨晚去听了德云社的相声，演员功底扎实，包袱不断。现场氛围超级好，散场后还意犹未尽！", authorName: "相声迷", createTime: "2026-05-13 20:45:00", viewCount: 145, replyCount: 0 },
  { id: 4, title: "2026NBA中国赛观赛攻略", content: "分享一些观赛经验：提前2小时到场，选座位尽量选靠近通道的，方便进出。带好防晒和充电宝！", authorName: "篮球达人", createTime: "2026-05-12 16:00:00", viewCount: 312, replyCount: 1 },
];

const demoReplies = {
  1: [
    { id: 1, postId: 1, content: "太真实了！我也是周董的粉丝，下次演唱会一起吗？", userName: "音乐达人", createTime: "2026-05-15 15:30:00", userId: 2 },
    { id: 2, postId: 1, content: "周董的演唱会真的值回票价！", userName: "演唱会爱好者", createTime: "2026-05-15 16:00:00", userId: 3 }
  ],
  2: [
    { id: 3, postId: 2, content: "已经买好票了，期待！", userName: "剧迷", createTime: "2026-05-14 10:00:00", userId: 4 }
  ],
  4: [
    { id: 4, postId: 4, content: "补充一下：最好带个小板凳，场馆的座位有点硬", userName: "老球迷", createTime: "2026-05-12 17:00:00", userId: 5 }
  ]
};

function goForum() { router.push("/forum"); }
function goProfile() { router.push("/profile"); }
function goAdmin() { router.push("/admin"); }
function goLogin() { router.push("/login"); }
function logout() {
  localStorage.clear();
  router.push("/login");
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  return timeStr.replace("T", " ").substring(0, 19);
}

function truncateContent(content) {
  if (!content) return "";
  return content.length > 100 ? content.substring(0, 100) + "..." : content;
}

function canDelete(post) {
  return post.userId === currentUserId.value || isAdmin.value;
}

function canDeleteReply(reply) {
  return reply.userId === currentUserId.value || isAdmin.value;
}

// 演出选择变化时更新showName
function onShowChange(showId) {
  if (showId) {
    const show = showList.value.find(s => s.id === showId);
    newPost.value.showName = show ? show.title : "";
  } else {
    newPost.value.showName = "";
  }
}

async function loadPosts() {
  try {
    const params = selectedShowId.value ? `?showId=${selectedShowId.value}` : "";
    const data = await request.get(`/api/forum/list${params}`);
    posts.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.log("使用演示数据");
    posts.value = JSON.parse(JSON.stringify(demoPosts));
  }
}

async function submitPost() {
  if (!newPost.value.title.trim()) {
    ElMessage.warning("请输入标题");
    return;
  }
  if (!newPost.value.content.trim()) {
    ElMessage.warning("请输入内容");
    return;
  }
  submitting.value = true;
  try {
    // 构建请求数据，过滤掉null值
    const postData = {
      title: newPost.value.title,
      content: newPost.value.content,
      userId: currentUserId.value,
      authorName: currentUsername.value
    };
    // 只有当showId存在时才添加
    if (newPost.value.showId) {
      postData.showId = newPost.value.showId;
      postData.showName = newPost.value.showName;
    }
    
    await request.post("/api/forum/post", postData);
    ElMessage.success("发布成功");
    newPost.value.title = "";
    newPost.value.content = "";
    newPost.value.showId = null;
    newPost.value.showName = "";
    loadPosts();
  } catch (e) {
    // 演示模式 - 本地保存
    const newId = Math.max(...posts.value.map(p => p.id), 0) + 1;
    posts.value.unshift({
      id: newId,
      title: newPost.value.title,
      content: newPost.value.content,
      authorName: currentUsername.value,
      createTime: new Date().toLocaleString(),
      viewCount: 0,
      replyCount: 0,
      userId: currentUserId.value,
      showId: newPost.value.showId,
      showName: newPost.value.showName
    });
    ElMessage.success("发布成功（本地保存）");
    newPost.value.title = "";
    newPost.value.content = "";
    newPost.value.showId = null;
    newPost.value.showName = "";
  } finally {
    submitting.value = false;
  }
}

async function viewDetail(id) {
  try {
    const data = await request.get(`/api/forum/detail/${id}`);
    if (data) {
      currentPost.value = data;
      showDetail.value = true;
      loadReplies(id);
      // 本地演示模式下也刷新浏览量
      const post = posts.value.find(p => p.id === id);
      if (post) post.viewCount = (post.viewCount || 0) + 1;
    }
  } catch (e) {
    currentPost.value = posts.value.find(p => p.id === id) || {};
    showDetail.value = true;
    replies.value = demoReplies[id] || [];
  }
}

async function loadReplies(postId) {
  try {
    const data = await request.get(`/api/forum/replies/${postId}`);
    replies.value = Array.isArray(data) ? data : [];
  } catch (e) {
    replies.value = demoReplies[postId] || [];
  }
}

async function submitReply() {
  if (!newReply.value.trim()) {
    ElMessage.warning("请输入回复内容");
    return;
  }
  replying.value = true;
  try {
    const res = await request.post("/api/forum/reply", {
      postId: currentPost.value.id,
      content: newReply.value,
      userId: currentUserId.value,
      userName: currentUsername.value
    });
    if (res.code === 200 || res.code === 0) {
      ElMessage.success("回复成功");
      newReply.value = "";
      loadReplies(currentPost.value.id);
      // 更新帖子回复数
      const post = posts.value.find(p => p.id === currentPost.value.id);
      if (post) post.replyCount = (post.replyCount || 0) + 1;
      currentPost.value.replyCount = (currentPost.value.replyCount || 0) + 1;
    } else {
      ElMessage.error(res.message || "回复失败");
    }
  } catch (e) {
    // 本地演示模式
    const newId = Math.max(...replies.value.map(r => r.id), 0) + 1;
    replies.value.push({
      id: newId,
      postId: currentPost.value.id,
      content: newReply.value,
      userName: currentUsername.value,
      createTime: new Date().toLocaleString(),
      userId: currentUserId.value
    });
    ElMessage.success("回复成功（演示模式）");
    newReply.value = "";
    // 更新帖子回复数
    const post = posts.value.find(p => p.id === currentPost.value.id);
    if (post) post.replyCount = (post.replyCount || 0) + 1;
    currentPost.value.replyCount = (currentPost.value.replyCount || 0) + 1;
  } finally {
    replying.value = false;
  }
}

async function deleteReply(id) {
  try {
    await ElMessageBox.confirm("确定要删除这条回复吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
    try {
      const res = await request.delete(`/api/forum/reply/${id}`);
      if (res.code === 200 || res.code === 0) {
        ElMessage.success("删除成功");
        loadReplies(currentPost.value.id);
        // 更新帖子回复数
        const post = posts.value.find(p => p.id === currentPost.value.id);
        if (post && post.replyCount > 0) post.replyCount--;
        if (currentPost.value.replyCount > 0) currentPost.value.replyCount--;
      }
    } catch (e) {
      replies.value = replies.value.filter(r => r.id !== id);
      ElMessage.success("删除成功（演示模式）");
      const post = posts.value.find(p => p.id === currentPost.value.id);
      if (post && post.replyCount > 0) post.replyCount--;
    }
  } catch (e) {
    // 取消删除
  }
}

async function deletePost(id) {
  try {
    await ElMessageBox.confirm("确定要删除这篇帖子吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
    try {
      const res = await request.delete(`/api/forum/delete/${id}`);
      if (res.code === 200 || res.code === 0) {
        ElMessage.success("删除成功");
        loadPosts();
      }
    } catch (e) {
      posts.value = posts.value.filter(p => p.id !== id);
      ElMessage.success("删除成功（演示模式）");
    }
  } catch (e) {
    // 取消删除
  }
}

onMounted(() => {
  loadShows();
  loadPosts();
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 顶部导航 */
.header {
  background: linear-gradient(135deg, #FF4D4D 0%, #FF6B35 100%);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(255, 77, 77, 0.3);
}

.header-content {
  max-width: 1200px;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2) !important;
  border: none !important;
  font-size: 18px;
}

.header-btn {
  height: 36px;
  border-radius: 18px;
  font-size: 14px;
  border: none;
}

.forum-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.admin-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.logout-btn {
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  color: white;
}

/* 论坛主体 */
.forum-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.forum-header {
  text-align: center;
  margin-bottom: 30px;
}

.forum-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.title-icon { font-size: 36px; }

.forum-desc {
  color: #666;
  font-size: 16px;
}

/* 发帖表单 */
.post-form {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #FF4D4D;
}

.show-select {
  width: 100%;
}

.post-show-tag {
  margin-top: 8px;
}

.show-tag {
  display: inline-block;
  padding: 4px 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 12px;
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-textarea:focus {
  border-color: #FF4D4D;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  color: #999;
  font-size: 13px;
}

.login-tip {
  background: #fff7e6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  padding: 16px 24px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ad6800;
}

/* 帖子列表 */
.post-list {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.list-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.show-filter {
  width: 200px;
  margin-left: auto;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.post-card:hover {
  border-color: #FF4D4D;
  box-shadow: 0 4px 12px rgba(255, 77, 77, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.post-author {
  font-weight: 600;
  color: #FF4D4D;
  font-size: 14px;
}

.post-time {
  color: #999;
  font-size: 13px;
}

.post-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.post-content {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.post-footer {
  display: flex;
  align-items: center;
  gap: 20px;
}

.post-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #999;
  font-size: 13px;
}

.stat-icon {
  font-size: 14px;
}

.post-action {
  font-size: 13px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.post-action:hover {
  color: #FF4D4D;
}

.delete-action {
  margin-left: auto;
}

.empty-posts {
  text-align: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-posts p {
  color: #999;
  font-size: 16px;
}

/* 详情弹窗 */
.detail-content {
  padding: 10px 0;
}

.detail-meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-body {
  color: #333;
  font-size: 15px;
  line-height: 1.8;
  white-space: pre-wrap;
  margin-bottom: 16px;
}

.detail-stats {
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 14px;
  margin-bottom: 20px;
}

/* 回复列表 */
.replies-section {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
  margin-top: 16px;
}

.replies-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.replies-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 250px;
  overflow-y: auto;
}

.reply-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.reply-user {
  font-weight: 600;
  color: #FF4D4D;
  font-size: 14px;
}

.reply-time {
  color: #999;
  font-size: 12px;
  flex: 1;
}

.reply-delete {
  color: #999;
  font-size: 12px;
  cursor: pointer;
}

.reply-delete:hover {
  color: #FF4D4D;
}

.reply-content {
  color: #333;
  font-size: 14px;
  line-height: 1.6;
}

.replies-empty {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

/* 回复表单 */
.reply-form {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
  margin-top: 16px;
}

.reply-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  font-family: inherit;
  box-sizing: border-box;
  margin-bottom: 10px;
}

.reply-textarea:focus {
  border-color: #FF4D4D;
  outline: none;
}

.reply-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reply-tip {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #999;
  font-size: 14px;
}
</style>
