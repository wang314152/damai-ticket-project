<template>
  <div class="multi-agent-page">
    <header class="header">
      <button class="back-btn" @click="router.push('/')">← 返回</button>
      <h1>🤖🤖 双Agent购票助手</h1>
      <button class="clear-btn" @click="initChat">重置</button>
    </header>

    <div class="chat-container">
      <div class="chat-messages" ref="chatRef">
        <div v-for="(msg, i) in messages" :key="i" :class="['message', msg.agent]">
          <div class="msg-avatar">{{ msg.agent === 'maimai' ? '🤖' : '🎫' }}</div>
          <div class="msg-body">
            <div class="msg-name">{{ msg.agent === 'maimai' ? '麦麦' : '票票' }}</div>
            <div class="msg-content">
              <div v-if="msg.type === 'show'">
                <div class="show-card" v-for="s in msg.shows" :key="s.id" @click="selectShow(s)">
                  <span class="show-title">{{ s.title }}</span>
                  <span class="show-info">{{ s.location }} | ¥{{ s.price }}</span>
                </div>
              </div>
              <div v-else-if="msg.type === 'seats'">
                <div class="seats-info">{{ msg.content }}</div>
                <div class="seats-grid">
                  <div v-for="seat in msg.seats" :key="seat.id" :class="['seat-item', getZoneClass(seat)]" @click="toggleSeat(seat)">
                    {{ seat.seatNumber }}排{{ seat.column }}座 ¥{{ seat.price }}
                  </div>
                </div>
                <div class="order-bar" v-if="selectedSeats.length > 0">
                  <span>已选: {{ selectedSeats.length }}张 ¥{{ selectedSeats.reduce((s,c)=>s+c.price,0) }}</span>
                  <button @click="confirmPurchase">确认购买</button>
                </div>
              </div>
              <div v-else-if="msg.type === 'success'">
                <div class="success-msg">🎉 {{ msg.content }}</div>
              </div>
              <div v-else>{{ msg.content }}</div>
            </div>
          </div>
        </div>
        
        <div v-if="agentTyping" class="message typing">
          <div class="msg-avatar">{{ currentTypingAgent === 'maimai' ? '🤖' : '🎫' }}</div>
          <div class="msg-body">
            <div class="msg-name">{{ currentTypingAgent === 'maimai' ? '麦麦' : '票票' }}</div>
            <div class="msg-content typing-content">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="input-bar">
      <input v-model="userInput" placeholder="输入你想看的演出或直接说'帮我买票'..." @keyup.enter="sendMessage" :disabled="isProcessing" />
      <button @click="sendMessage" :disabled="isProcessing || !userInput.trim()">
        {{ isProcessing ? '处理中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const API_KEY = 'sk-e21a2d68201d4f9e97c04eba255001fd'
const API_URL = 'https://api.deepseek.com/v1/chat/completions'

const userInput = ref('')
const messages = ref([])
const isProcessing = ref(false)
const agentTyping = ref(false)
const currentTypingAgent = ref('')
const chatRef = ref(null)

// 购票相关状态
const selectedShow = ref(null)
const selectedSeats = ref([])
const allShows = ref([])

const projectContext = `【大麦网项目信息】
演出列表：
1. 周杰伦2026世界巡回演唱会 - 北京国家体育场 - 1280元起
2. 开心麻花《乌龙山伯爵》 - 上海人民大舞台 - 380元起
3. 2026NBA中国赛 - 广州体育馆 - 880元起
4. 理查德克莱德曼钢琴独奏会 - 深圳音乐厅 - 680元起
5. 舞剧《只此青绿》 - 杭州大剧院 - 480元起
6. 德云社相声专场 - 南京人民大会堂 - 280元起

座位区域：VIP区(1-3排)、看台A区(4-6排)、看台B区(7-10排)
价格：VIP区1480元，看台A区1380-1280元，看台B区1280-880元
每排10个座位

API接口：
- GET /api/show/list 获取演出列表
- GET /api/seat/list/{showId} 获取座位列表
- POST /api/order/createBatch 创建订单 {userId, showId, seatIds}`

function initChat() {
  messages.value = [{
    agent: 'maimai',
    type: 'text',
    content: '🤖 你好！我是麦麦，大麦网项目顾问！\n🎫 我是票票，智能购票助手！\n\n我们可以帮你：\n• 了解项目所有内容\n• 查询热门演出\n• 自动帮你选座购票\n\n直接说"帮我买XX的票"试试吧！'
  }]
  userInput.value = ''
  selectedShow.value = null
  selectedSeats.value = []
}

// 获取演出列表
async function fetchShows() {
  try {
    const res = await axios.get('/api/show/list')
    if (res.data && res.data.code === 0) {
      allShows.value = res.data.data
      return res.data.data
    }
  } catch (err) {
    console.error('获取演出失败:', err)
  }
  return []
}

// 获取座位列表
async function fetchSeats(showId) {
  try {
    const res = await axios.get(`/api/seat/list/${showId}`)
    if (res.data && res.data.code === 0) {
      return res.data.data.filter(s => s.status === 0) // 只返回可售座位
    }
  } catch (err) {
    console.error('获取座位失败:', err)
  }
  return []
}

// 创建订单
async function createOrder(showId, seatIds) {
  try {
    const userId = localStorage.getItem('userId') || 1
    const res = await axios.post('/api/order/createBatch', {
      userId: parseInt(userId),
      showId: showId,
      seatIds: seatIds
    })
    return res.data
  } catch (err) {
    return { code: -1, msg: err.message }
  }
}

async function callAI(prompt) {
  try {
    const res = await axios.post(API_URL, {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: `你是大麦网的双Agent助手团队。麦麦负责项目咨询，票票负责购票。

当用户要购票时，你必须按照以下JSON格式回复：
{
  "agent": "piaopiao",
  "type": "action",
  "action": "buy_ticket",
  "params": {
    "showName": "演出名称(模糊匹配)",
    "count": 购票数量,
    "zone": "VIP/A/B/C或空",
    "reason": "推荐理由"
  }
}

当用户只是咨询时，回答普通问题即可。
${projectContext}` },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    })
    return res.data.choices[0].message.content
  } catch (err) {
    return '抱歉，服务暂时不可用。' + err.message
  }
}

function getZoneClass(seat) {
  const num = parseInt(seat.seatNumber.split('-')[0])
  if (num <= 3) return 'zone-vip'
  if (num <= 6) return 'zone-a'
  return 'zone-b'
}

function toggleSeat(seat) {
  const idx = selectedSeats.value.findIndex(s => s.id === seat.id)
  if (idx > -1) {
    selectedSeats.value.splice(idx, 1)
  } else {
    if (selectedSeats.value.length >= 6) {
      alert('最多选6张')
      return
    }
    selectedSeats.value.push(seat)
  }
}

async function selectShow(show) {
  selectedShow.value = show
  const seats = await fetchSeats(show.id)
  
  messages.value.push({
    agent: 'piaopiao',
    type: 'seats',
    content: `为你找到 ${show.title} 的可选座位：`,
    seats: seats.slice(0, 30), // 只显示前30个
    showId: show.id
  })
  
  // 添加购票说明
  messages.value.push({
    agent: 'piaopiao',
    type: 'text',
    content: '💡 点击选择座位，选择后点击"确认购买"即可下单！'
  })
  
  scrollToBottom()
}

async function confirmPurchase() {
  if (selectedSeats.value.length === 0) {
    alert('请先选择座位')
    return
  }
  
  const showId = selectedShow.value.id
  const seatIds = selectedSeats.value.map(s => s.id)
  const total = selectedSeats.value.reduce((s, c) => s + c.price, 0)
  
  messages.value.push({
    agent: 'piaopiao',
    type: 'text',
    content: `正在为你购买 ${selectedSeats.value.length} 张票，总价 ¥${total}...`
  })
  scrollToBottom()
  
  const result = await createOrder(showId, seatIds)
  
  if (result.code === 0) {
    messages.value.push({
      agent: 'piaopiao',
      type: 'success',
      content: `🎉 购票成功！\n\n演出：${selectedShow.value.title}\n座位：${selectedSeats.value.map(s => s.seatNumber).join(', ')}\n总价：¥${total}\n\n请前往订单页面完成支付！`
    })
    
    // 清空选择
    selectedSeats.value = []
    selectedShow.value = null
  } else {
    messages.value.push({
      agent: 'piaopiao',
      type: 'text',
      content: `❌ 购票失败：${result.msg || '未知错误'}`
    })
  }
  
  scrollToBottom()
}

async function sendMessage() {
  if (!userInput.value.trim() || isProcessing.value) return
  
  const text = userInput.value.trim()
  userInput.value = ''
  
  // 添加用户消息
  messages.value.push({
    agent: 'user',
    type: 'text',
    content: text
  })
  scrollToBottom()
  
  // 检查是否涉及购票
  const isBuying = text.includes('买') || text.includes('票') || text.includes('抢') || text.includes('订')
  
  if (isBuying) {
    isProcessing.value = true
    agentTyping.value = true
    currentTypingAgent.value = 'piaopiao'
    
    // 先加载演出列表
    const shows = await fetchShows()
    
    agentTyping.value = false
    
    // 查找匹配的演出
    let matchedShow = null
    for (const show of shows) {
      if (show.title.includes(text.replace(/[^\\u4e00-\\u9fa5a-zA-Z0-9]/g, '')) || 
          text.includes(show.title.substring(0, 4))) {
        matchedShow = show
        break
      }
    }
    
    if (matchedShow) {
      await selectShow(matchedShow)
    } else {
      // 显示所有演出让用户选择
      messages.value.push({
        agent: 'piaopiao',
        type: 'show',
        content: '请选择你想购买的演出：',
        shows: shows
      })
    }
  } else {
    // 普通对话
    isProcessing.value = true
    agentTyping.value = true
    currentTypingAgent.value = 'maimai'
    await delay(500)
    
    const response = await callAI(text)
    
    agentTyping.value = false
    
    messages.value.push({
      agent: 'maimai',
      type: 'text',
      content: response
    })
  }
  
  isProcessing.value = false
  scrollToBottom()
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function scrollToBottom() {
  nextTick(() => {
    if (chatRef.value) {
      chatRef.value.scrollTop = chatRef.value.scrollHeight
    }
  })
}

initChat()
</script>

<style scoped>
.multi-agent-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b4e 100%);
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
}

.header h1 {
  color: white;
  font-size: 18px;
  margin: 0;
  background: linear-gradient(90deg, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.back-btn, .clear-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.back-btn {
  background: rgba(255,255,255,0.1);
  color: white;
}

.clear-btn {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
}

.chat-container {
  flex: 1;
  overflow: hidden;
  padding: 0 16px;
}

.chat-messages {
  height: calc(100vh - 200px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 0;
}

.message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.message.maimai .msg-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.message.piaopiao .msg-avatar {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
}

.msg-body {
  max-width: 80%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.msg-name {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.6);
}

.message.user .msg-name {
  text-align: right;
}

.msg-content {
  padding: 14px 18px;
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  color: white;
  font-size: 14px;
  line-height: 1.6;
}

.message.user .msg-content {
  background: linear-gradient(135deg, #00d2d3 0%, #01a3a4 100%);
}

.show-card {
  padding: 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  margin: 8px 0;
  cursor: pointer;
  transition: all 0.2s;
}

.show-card:hover {
  background: rgba(255,255,255,0.2);
}

.show-title {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
}

.show-info {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
}

.seats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin: 12px 0;
}

.seat-item {
  padding: 10px 8px;
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.zone-vip {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
}

.zone-a {
  background: linear-gradient(135deg, #87CEEB, #4169E1);
  color: white;
}

.zone-b {
  background: linear-gradient(135deg, #90EE90, #228B22);
  color: white;
}

.seat-item:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.order-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border-radius: 12px;
  margin-top: 12px;
}

.order-bar button {
  padding: 10px 24px;
  background: white;
  color: #ff416c;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
}

.success-msg {
  padding: 16px;
  background: linear-gradient(135deg, #52c41a, #73d13d);
  border-radius: 12px;
  color: white;
}

.typing-content span {
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-content span:nth-child(1) { animation-delay: 0s; }
.typing-content span:nth-child(2) { animation-delay: 0.2s; }
.typing-content span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-8px); }
}

.input-bar {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(255,255,255,0.05);
  border-top: 1px solid rgba(255,255,255,0.1);
}

.input-bar input {
  flex: 1;
  padding: 14px 20px;
  border: 2px solid rgba(255,65,108,0.3);
  border-radius: 25px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 14px;
}

.input-bar input::placeholder {
  color: rgba(255,255,255,0.5);
}

.input-bar input:focus {
  outline: none;
  border-color: #ff416c;
}

.input-bar button {
  padding: 14px 28px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.input-bar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
