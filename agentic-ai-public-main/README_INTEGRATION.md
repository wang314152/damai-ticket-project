# Agentic AI 集成到抢票系统

## 功能概述

将 Agentic AI 研究代理整合到抢票系统，实现：
- 🤖 **AI 智能客服**：回答用户关于演出、订单的问题
- 📊 **AI 票务助手**：帮助用户查找演出、推荐座位
- 💬 **AI 对话界面**：集成到前端，用户可直接与 AI 交互

## 目录结构

```
damai-ticket-project/
├── agentic-ai/              # AI Agent 服务（独立运行）
│   ├── main.py              # FastAPI 应用
│   ├── src/
│   │   ├── planning_agent.py
│   │   ├── agents.py
│   │   └── research_tools.py
│   ├── templates/
│   │   └── index.html       # AI 对话界面
│   ├── requirements.txt
│   └── .env                 # API 密钥配置
│
├── damai-ticket-frontend/   # 已有前端
│   └── src/
│       └── views/
│           └── AIAssistant.vue  # 新增：AI 助手页面
│
└── damai-ticket/            # 已有后端
```

## 快速启动

### 1. 配置环境变量

在 `agentic-ai/` 目录下创建 `.env` 文件：

```
OPENAI_API_KEY=your-openai-api-key
TAVILY_API_KEY=your-tavily-api-key
```

### 2. 启动 AI Agent 服务

```bash
cd agentic-ai
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. 启动前端

```bash
cd damai-ticket-frontend
npm run dev
```

### 4. 访问 AI 助手

打开 http://localhost:5173/ai-assistant

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/` | GET | AI 助手界面 |
| `/generate_report` | POST | 发起 AI 研究任务 |
| `/task_progress/{id}` | GET | 获取任务进度 |
| `/task_status/{id}` | GET | 获取任务结果 |
| `/api/chat` | POST | 简单对话接口（新增）|
