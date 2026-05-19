<template>
  <div class="ai-page">
    <!-- 顶部导航 -->
    <header class="header">
      <button class="back-btn" @click="goBack">
        <span>‹</span>
      </button>
      <div class="header-title">
        <span class="ai-avatar">🤖</span>
        <div class="title-text">
          <span class="title-name">麦麦AI助手</span>
          <span class="title-status">在线</span>
        </div>
      </div>
      <button class="new-btn" @click="clearChat">
        <span>✨</span>
      </button>
    </header>

    <!-- 欢迎信息 -->
    <div v-if="messages.length <= 1" class="welcome-section">
      <div class="welcome-card">
        <div class="welcome-icon">🎭</div>
        <div class="welcome-title">我是大麦网AI助手「麦麦」</div>
        <div class="welcome-desc">我可以帮你：</div>
        <div class="welcome-features">
          <div class="feature-item">
            <span class="feature-icon">🎫</span>
            <span>推荐热门演出</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📋</span>
            <span>查询订单状态</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🎯</span>
            <span>解答购票问题</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💡</span>
            <span>提供购票建议</span>
          </div>
        </div>
        <div class="quick-questions">
          <div class="quick-title">试试问我：</div>
          <div class="quick-list">
            <button 
              v-for="q in quickQuestions" 
              :key="q"
              class="quick-btn"
              @click="inputText = q"
            >
              {{ q }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="messages-container" ref="messagesRef">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message-wrapper', msg.role]"
      >
        <!-- AI消息 -->
        <div v-if="msg.role === 'assistant'" class="message ai-message">
          <div class="ai-avatar-small">🤖</div>
          <div class="message-content">
            <div class="message-bubble">
              <div class="bubble-text" v-html="formatMessage(msg.content)"></div>
            </div>
          </div>
        </div>

        <!-- 用户消息 -->
        <div v-else class="message user-message">
          <div class="message-content">
            <div class="message-bubble user-bubble">
              {{ msg.content }}
            </div>
          </div>
          <div class="user-avatar-small">👤</div>
        </div>
      </div>

      <!-- 加载中 -->
      <div v-if="loading" class="message-wrapper assistant">
        <div class="message ai-message">
          <div class="ai-avatar-small">🤖</div>
          <div class="message-content">
            <div class="message-bubble loading">
              <div class="typing-indicator">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部输入区 -->
    <div class="input-section">
      <!-- 快捷功能下拉菜单 -->
      <div class="quick-dropdown">
        <button class="dropdown-toggle" @click="showQuickMenu = !showQuickMenu">
          <span>💬 快捷功能</span>
          <span class="dropdown-arrow" :class="{ open: showQuickMenu }">▼</span>
        </button>
        <div class="dropdown-menu" v-show="showQuickMenu">
          <button 
            v-for="item in quickItems" 
            :key="item.text"
            class="dropdown-item"
            @click="handleQuickAction(item)"
          >
            <span class="item-icon">{{ item.icon }}</span>
            <span class="item-text">{{ item.text }}</span>
          </button>
        </div>
      </div>

      <div class="input-wrapper">
        <textarea
          v-model="inputText"
          class="input-field"
          placeholder="问我任何关于演出、订单、抢票的问题..."
          rows="1"
          @keydown.enter.exact.prevent="sendMessage"
          @input="autoResize"
          ref="inputRef"
          :disabled="loading"
        ></textarea>
        <button 
          class="send-btn" 
          @click="sendMessage"
          :disabled="loading || !inputText.trim()"
        >
          <span v-if="loading" class="send-spinner"></span>
          <span v-else>➤</span>
        </button>
      </div>
      <div class="input-hint">
        按 Enter 发送，Shift + Enter 换行
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import request from "../api/request";

const router = useRouter();
const messagesRef = ref(null);
const inputRef = ref(null);
const inputText = ref("");
const loading = ref(false);
const showQuickMenu = ref(false);

// 快捷功能菜单
const quickItems = [
  { icon: "🔥", text: "热门推荐", action: "hot" },
  { icon: "🎫", text: "帮我买票", action: "buy" },
  { icon: "📋", text: "我的订单", action: "order" },
  { icon: "🎭", text: "演出推荐", action: "recommend" },
  { icon: "❓", text: "购票帮助", action: "help" },
  { icon: "🎵", text: "演唱会", action: "concert" },
  { icon: "🎬", text: "话剧歌剧", action: "drama" },
  { icon: "⚽", text: "体育赛事", action: "sports" },
];

// 处理快捷功能点击
function handleQuickAction(item) {
  showQuickMenu.value = false;
  const actionMap = {
    hot: "有什么热门演出推荐？",
    buy: "我想买票，请帮我推荐",
    order: "帮我查询一下我的订单状态",
    recommend: "推荐一些适合年轻人看的演出",
    help: "告诉我如何购买演唱会门票",
    concert: "推荐一些热门演唱会",
    drama: "推荐一些好看的话剧",
    sports: "推荐一些体育赛事",
  };
  inputText.value = actionMap[item.action] || item.text;
}

const messages = ref([
  {
    role: "assistant",
    content: "👋 你好！我是大麦网 AI 智能助手「麦麦」！\n\n很高兴为你服务！我可以帮你：\n\n🎫 **推荐热门演出** - 发现精彩的演唱会、话剧、音乐会\n📋 **查询订单状态** - 了解你的购票进度\n🎯 **解答购票问题** - 抢票技巧、座位选择\n💡 **提供购票建议** - 根据你的喜好推荐\n\n有什么我可以帮到你的吗？😊",
  },
]);

function goBack() {
  router.back();
}

function clearChat() {
  messages.value = [
    {
      role: "assistant",
      content: "👋 你好！我是大麦网 AI 智能助手「麦麦」！\n\n很高兴为你服务！我可以帮你：\n\n🎫 **推荐热门演出** - 发现精彩的演唱会、话剧、音乐会\n📋 **查询订单状态** - 了解你的购票进度\n🎯 **解答购票问题** - 抢票技巧、座位选择\n💡 **提供购票建议** - 根据你的喜好推荐\n\n有什么我可以帮到你的吗？😊",
    },
  ];
  inputText.value = "";
  ElMessage.success("已开启新对话");
  scrollToBottom();
}

async function sendMessage() {
  const text = inputText.value.trim();
  if (!text || loading.value) return;

  messages.value.push({
    role: "user",
    content: text,
  });
  inputText.value = "";
  scrollToBottom();

  loading.value = true;
  
  try {
    const res = await request.post("/api/ai/chat", { question: text });
    
    const responseData = res.data || res;
    
    if (responseData && responseData.answer) {
      messages.value.push({
        role: "assistant",
        content: responseData.answer,
      });
    } else if (responseData && responseData.error) {
      messages.value.push({
        role: "assistant",
        content: "❌ " + responseData.error,
      });
    } else {
      messages.value.push({
        role: "assistant",
        content: "抱歉，AI 服务暂时无法响应，请稍后重试。",
      });
    }
  } catch (error) {
    console.error("AI 请求失败:", error);
    const errorMsg = error.response?.data?.error || error.message || "网络错误";
    messages.value.push({
      role: "assistant",
      content: "❌ 抱歉，AI 服务暂时不可用。\n\n错误信息：" + errorMsg + "\n\n请稍后重试，或联系客服获取帮助。",
    });
  } finally {
    loading.value = false;
    scrollToBottom();
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }
  });
}

function autoResize() {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto';
    inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 120) + 'px';
  }
}

function formatMessage(text) {
  // 简单的 Markdown 格式化
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  // 包装段落
  if (!html.startsWith('<p>')) {
    html = '<p>' + html + '</p>';
  }
  html = html.replace(/<p><\/p>/g, '');
  
  return html;
}
</script>

<style scoped>
.ai-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

/* 顶部导航 */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

.ai-avatar {
  font-size: 32px;
}

.title-text {
  display: flex;
  flex-direction: column;
}

.title-name {
  font-size: 16px;
  font-weight: 700;
}

.title-status {
  font-size: 11px;
  opacity: 0.8;
}

.new-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.new-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(30deg);
}

/* 欢迎区域 */
.welcome-section {
  padding: 16px;
}

.welcome-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.welcome-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.welcome-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.welcome-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 13px;
  color: #333;
}

.feature-icon {
  font-size: 18px;
}

.quick-questions {
  text-align: left;
}

.quick-title {
  font-size: 13px;
  color: #999;
  margin-bottom: 10px;
}

.quick-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-btn {
  padding: 8px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 18px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 消息容器 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-wrapper {
  display: flex;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-wrapper.user {
  flex-direction: row-reverse;
}

.message {
  display: flex;
  gap: 10px;
  max-width: 80%;
}

.message-content {
  flex: 1;
}

.message-bubble {
  background: white;
  border-radius: 18px 18px 18px 4px;
  padding: 14px 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.user-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 18px 18px 4px 18px;
}

.bubble-text {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  word-break: break-word;
}

.user-bubble {
  color: white;
}

.bubble-text :deep(p) {
  margin: 0 0 8px;
}

.bubble-text :deep(p:last-child) {
  margin-bottom: 0;
}

.bubble-text :deep(strong) {
  color: inherit;
  font-weight: 600;
}

.bubble-text :deep(code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.user-avatar-small, .ai-avatar-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.ai-avatar-small {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.user-avatar-small {
  background: #f0f0f0;
}

/* 加载动画 */
.message-bubble.loading {
  padding: 16px 20px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator .dot {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* 底部输入区 */
.input-section {
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: white;
  border-top: 1px solid #f0f0f0;
}

.input-wrapper {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.input-field {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e5e5e5;
  border-radius: 24px;
  font-size: 15px;
  resize: none;
  max-height: 120px;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
}

.input-field::placeholder {
  color: #bbb;
}

.input-field:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.send-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.send-btn:disabled {
  background: #ccc;
  box-shadow: none;
  cursor: not-allowed;
}

.send-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.input-hint {
  text-align: center;
  font-size: 11px;
  color: #ccc;
  margin-top: 8px;
}
</style>
