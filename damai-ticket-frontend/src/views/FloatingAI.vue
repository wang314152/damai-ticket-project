<template>
  <div class="floating-ai">
    <!-- 悬浮按钮 -->
    <button class="floating-btn" @click="toggle" v-if="!isExpanded">
      <span class="ai-icon">🤖</span>
    </button>

    <!-- 展开窗口 -->
    <div class="ai-window" v-if="isExpanded">
      <div class="ai-header">
        <div class="ai-title">
          <span class="agent-icons">🤖</span>
          <span>麦麦AI助手</span>
          <span class="ai-status">DeepSeek驱动</span>
        </div>
        <button @click="toggle" class="min-btn">－</button>
      </div>

      <!-- 聊天消息区域 -->
      <div class="messages" ref="chatRef">
        <div v-for="(msg, i) in messages" :key="i" :class="['msg', msg.type]">
          <div class="msg-avatar">{{ msg.type === 'user' ? '👤' : '🤖' }}</div>
          <div class="msg-content">
            <div class="msg-bubble" v-html="formatContent(msg.content)"></div>
            <div v-if="msg.loading" class="msg-loading">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷功能 -->
      <div class="quick-btns" v-if="messages.length <= 1">
        <button @click="sendQuick('推荐一些热门演出')">🔥 热门推荐</button>
        <button @click="sendQuick('我想买票')">🎫 帮我买票</button>
        <button @click="sendQuick('查看我的订单')">📋 我的订单</button>
        <button @click="sendQuick('有什么好看的演出')">🎭 演出推荐</button>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <input v-model="inputText" @keyup.enter="sendMessage" placeholder="问我任何问题..." />
        <button @click="sendMessage" :disabled="!inputText.trim() || loading">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>➤</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from "../api/request"

const API_KEY = 'sk-e21a2d68201d4f9e97c04eba255001fd'
const API_URL = 'https://api.deepseek.com/v1/chat/completions'

const isExpanded = ref(false)
const inputText = ref('')
const messages = ref([])
const chatRef = ref(null)
const loading = ref(false)
const shows = ref([])
const orders = ref([])
const currentUserId = ref(88860174) // 默认测试用户ID

onMounted(() => {
  // 尝试从localStorage获取用户ID
  const storedId = localStorage.getItem('userId')
  if (storedId) {
    currentUserId.value = parseInt(storedId) || 88860174
  }
  addWelcome()
})

function addWelcome() {
  messages.value.push({
    type: 'assistant',
    content: `👋 你好！我是麦麦，你的智能票务助手！

🎫 **购票服务** - 帮我买XXX演出的票
📋 **订单管理** - 查订单/支付订单/取消订单
🔥 **演出推荐** - 有什么好看的演出
❓ **问题解答** - 任何购票问题

你可以这样说：
• "帮我买第1个演出"
• "查看我的订单"
• "支付订单123"
• "取消订单123"

有什么可以帮你的吗？😊`
  })
}

function formatContent(content) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || loading.value) return
  
  messages.value.push({ type: 'user', content: text })
  inputText.value = ''
  loading.value = true
  scrollToBottom()
  
  try {
    const response = await handleUserMessage(text)
    messages.value.push({ type: 'assistant', content: response })
  } catch (error) {
    console.error('处理失败:', error)
    messages.value.push({ 
      type: 'assistant', 
      content: '😅 出错了：' + error.message + '\n请稍后重试。' 
    })
  }
  
  loading.value = false
  scrollToBottom()
}

async function sendQuick(text) {
  inputText.value = text
  await sendMessage()
}

// 主处理函数
async function handleUserMessage(text) {
  const lower = text.toLowerCase()
  
  // 1. 取消订单
  if (lower.includes('取消')) {
    return await cancelOrder(text)
  }
  
  // 2. 支付订单
  if (lower.includes('支付') || lower.includes('付款') || lower.includes('付钱')) {
    return await payOrder(text)
  }
  
  // 3. 购票
  if (lower.includes('买') || lower.includes('购') || lower.includes('订票')) {
    return await buyTicket(text)
  }
  
  // 4. 查看订单
  if (lower.includes('订单') || lower.includes('我的订单')) {
    return await showOrders()
  }
  
  // 5. 其他走DeepSeek
  return await chatWithDeepSeek(text)
}

// 取消订单
async function cancelOrder(text) {
  await loadOrders()
  
  // 提取订单ID
  const match = text.match(/订单\s*[号#]?\s*(\d+)|取消\s*(\d+)/i)
  
  if (!match) {
    const unpaid = orders.value.filter(o => o.status === 0)
    if (unpaid.length === 0) {
      return orders.value.length === 0 
        ? '📋 你没有任何订单。' 
        : '✅ 你没有待支付的订单需要取消。'
    }
    return `❓ 请告诉我要取消哪个订单，比如："取消订单${unpaid[0].id}"`
  }
  
  const orderId = parseInt(match[1] || match[2])
  const order = orders.value.find(o => o.id === orderId)
  
  if (!order) return `❌ 订单${orderId}不存在！`
  if (order.status === 1) return `❌ 订单${orderId}已支付，无法取消。`
  if (order.status === 2) return `ℹ️ 订单${orderId}已经是取消状态。`
  
  try {
    await request.post('/api/order/cancel', {
      orderId: orderId,
      userId: currentUserId.value
    })
    order.status = 2
    return `✅ 订单${orderId}已取消！座位已释放。`
  } catch (error) {
    return `❌ 取消失败：${error.response?.msg || error.message || '请稍后重试'}`
  }
}

// 支付订单
async function payOrder(text) {
  await loadOrders()
  
  const match = text.match(/订单\s*[号#]?\s*(\d+)|支付\s*(\d+)/i)
  
  if (!match) {
    const unpaid = orders.value.filter(o => o.status === 0)
    if (unpaid.length === 0) {
      return orders.value.length === 0 
        ? '📋 你没有任何订单。' 
        : '✅ 你没有待支付的订单。'
    }
    let msg = `❓ 请告诉我要支付哪个订单，比如："支付订单${unpaid[0].id}"\n\n`
    msg += `📋 待支付订单：\n`
    unpaid.forEach(o => {
      const show = shows.value.find(s => s.id === o.showId)
      msg += `• 订单${o.id}: ${show?.title || '演出'} | ¥${o.amount}\n`
    })
    return msg
  }
  
  const orderId = parseInt(match[1] || match[2])
  const order = orders.value.find(o => o.id === orderId)
  
  if (!order) return `❌ 订单${orderId}不存在！`
  if (order.status === 1) return `ℹ️ 订单${orderId}已经支付过了！`
  if (order.status === 2) return `❌ 订单${orderId}已取消，无法支付。`
  
  try {
    await request.post('/api/order/pay', {
      orderId: orderId,
      userId: currentUserId.value
    })
    order.status = 1
    return `🎉 支付成功！订单${orderId}已完成支付，祝您观演愉快！`
  } catch (error) {
    return `❌ 支付失败：${error.response?.msg || error.message || '请稍后重试'}`
  }
}

// 购票
async function buyTicket(text) {
  await loadShows()
  
  if (shows.value.length === 0) {
    return '😅 暂时没有演出信息，请稍后再试。'
  }
  
  // 找出用户想买的演出
  let targetShow = null
  
  // 按序号匹配
  const numMatch = text.match(/第?\s*(\d+)\s*[个个台部]/i)
  if (numMatch) {
    const idx = parseInt(numMatch[1]) - 1
    if (idx >= 0 && idx < shows.value.length) {
      targetShow = shows.value[idx]
    }
  }
  
  // 按名称匹配
  if (!targetShow) {
    for (const show of shows.value) {
      const name = show.title.toLowerCase()
      const keywords = text.toLowerCase()
      if (name.includes(keywords) || keywords.includes(name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ''))) {
        targetShow = show
        break
      }
    }
  }
  
  if (!targetShow) {
    let list = '🎫 请先选择演出：\n\n'
    shows.value.forEach((s, i) => {
      list += `${i + 1}. **${s.title}**\n`
      list += `   📍 ${s.location} | 💰 ¥${s.price}起 | 📅 ${formatDate(s.showTime)}\n\n`
    })
    list += '👉 告诉我"买第1个"或"买演唱会"'
    return list
  }
  
  // 获取可用座位
  let seats
  try {
    seats = await request.get(`/api/seat/list/${targetShow.id}`)
  } catch (e) {
    return `❌ 获取座位失败，请稍后重试。`
  }
  
  const availableSeats = Array.isArray(seats) ? seats.filter(s => s.status === 0) : []
  
  if (availableSeats.length === 0) {
    return `😢 抱歉，${targetShow.title}的座位已售罄！`
  }
  
  // 选择最便宜的座位
  const cheapest = availableSeats.sort((a, b) => a.price - b.price)[0]
  
  try {
    await request.post('/api/order/create', {
      userId: currentUserId.value,
      showId: targetShow.id,
      seatId: cheapest.id
    })
    await loadOrders()
    return `🎉 购票成功！

**订单信息**：
• 演出：${targetShow.title}
• 座位：${cheapest.seatNumber || '座位' + cheapest.id}
• 价格：¥${cheapest.price}

⚠️ 请尽快支付！`
  } catch (error) {
    return `❌ 购票失败：${error.response?.msg || error.message || '座位已被抢走'}`
  }
}

// 查看订单
async function showOrders() {
  await loadOrders()
  
  if (orders.value.length === 0) {
    return '📋 你没有任何订单。\n\n👉 试试说"帮我买第1个演出"来购票！'
  }
  
  let msg = `📋 你的订单（共${orders.value.length}个）：\n\n`
  
  orders.value.forEach(o => {
    const show = shows.value.find(s => s.id === o.showId)
    const statusMap = {0: '⚠️ 待支付', 1: '✅ 已支付', 2: '❌ 已取消'}
    msg += `订单${o.id}: ${show?.title || '演出'} | ¥${o.amount} | ${statusMap[o.status]}\n`
  })
  
  const unpaid = orders.value.filter(o => o.status === 0)
  if (unpaid.length > 0) {
    msg += `\n💡 你有${unpaid.length}个待支付订单，告诉我"支付订单"来支付。`
  }
  
  return msg
}

// 加载数据
async function loadShows() {
  if (shows.value.length === 0) {
    try {
      const data = await request.get('/api/show/list')
      shows.value = Array.isArray(data) ? data : []
    } catch (e) {
      console.error('加载演出失败', e)
    }
  }
}

async function loadOrders() {
  await loadShows()
  try {
    const data = await request.get(`/api/order/user/${currentUserId.value}`)
    orders.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('加载订单失败', e)
  }
}

// DeepSeek对话
async function chatWithDeepSeek(text) {
  await loadShows()
  await loadOrders()
  
  const systemPrompt = `你是"麦麦"，大麦网AI票务助手。

当前演出：
${shows.value.map(s => `${s.title} | ${s.location} | ¥${s.price}`).join('\n') || '暂无演出'}

用户订单：
${orders.value.map(o => {
  const show = shows.value.find(s => s.id === o.showId)
  const st = {0:'待支付',1:'已支付',2:'已取消'}
  return `订单${o.id}: ${show?.title||'演出'} | ¥${o.amount} | ${st[o.status]}`
}).join('\n') || '暂无订单'}

规则：简洁友好，用emoji，用户要购票引导说"买第X个"。`

  try {
    const history = messages.value.slice(-4).filter(m => m.type === 'user' || m.type === 'assistant').map(m => ({
      role: m.type === 'user' ? 'user' : 'assistant',
      content: m.content.replace(/<[^>]*>/g, '')
    }))
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history,
          { role: 'user', content: text }
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    })
    
    const data = await response.json()
    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content
    }
    return '😅 AI暂时无法回复，请稍后重试。'
  } catch (error) {
    console.error('DeepSeek错误:', error)
    return '😅 AI服务暂时不可用，请直接告诉我你要做什么！'
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return dateStr.replace('T', ' ').substring(0, 16)
}

function scrollToBottom() {
  nextTick(() => {
    if (chatRef.value) {
      chatRef.value.scrollTop = chatRef.value.scrollHeight
    }
  })
}

function toggle() {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.floating-ai {
  position: fixed;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.floating-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  font-size: 28px;
  transition: transform 0.3s;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 4px 30px rgba(102, 126, 234, 0.6); }
}

.floating-btn:hover {
  transform: scale(1.1);
}

.ai-window {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 420px;
  height: 600px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 60px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.ai-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.agent-icons { font-size: 24px; }

.ai-status {
  font-size: 10px;
  background: rgba(255,255,255,0.2);
  padding: 2px 8px;
  border-radius: 10px;
}

.min-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f0f2f5;
}

.msg {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.msg.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.msg.user .msg-avatar {
  background: #e0e0e0;
}

.msg-content {
  max-width: 75%;
}

.msg-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.msg.assistant .msg-bubble {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.msg.user .msg-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.msg-bubble :deep(strong) {
  color: #667eea;
}

.msg-loading {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: white;
  border-radius: 16px;
  margin-top: 8px;
  width: fit-content;
}

.msg-loading span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.msg-loading span:nth-child(1) { animation-delay: -0.32s; }
.msg-loading span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.quick-btns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #eee;
}

.quick-btns button {
  padding: 10px;
  background: #f5f7fa;
  border: none;
  border-radius: 10px;
  font-size: 12px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-btns button:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.input-area {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #eee;
}

.input-area input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.input-area input:focus {
  border-color: #667eea;
}

.input-area button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.input-area button:hover:not(:disabled) {
  transform: scale(1.05);
}

.input-area button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
