# 大麦网票务系统 (Damai Ticket System)

## 项目介绍

这是一个基于 Vue 3 + Spring Boot 的在线票务系统，模拟大麦网的票务购买流程。系统支持演出浏览、座位选择、订单管理、支付模拟、AI智能客服等功能。

## 技术栈

### 前端
- **Vue 3** - 渐进式JavaScript框架
- **Vue Router** - 路由管理
- **Element Plus** - UI组件库
- **ECharts + vue-echarts** - 数据可视化图表
- **Vite** - 现代化前端构建工具
- **Axios** - HTTP请求库

### 后端
- **Spring Boot** - Java企业级开发框架
- **MyBatis-Plus** - ORM框架
- **MySQL** - 关系型数据库
- **DeepSeek API** - AI智能客服

## 功能特性

### 用户端
- ✅ 演出浏览与搜索
- ✅ 分类筛选（演唱会、话剧、体育赛事等）
- ✅ 座位选择与购买
- ✅ 订单管理（支付、取消）
- ✅ 评分评论
- ✅ AI智能客服
- ✅ 个人中心

### 管理端
- ✅ 演出管理（增删改查）
- ✅ 座位批量初始化
- ✅ 订单管理
- ✅ 用户管理
- ✅ 数据统计仪表盘（图表展示）

## 快速开始

### 环境要求
- Node.js 16+
- JDK 17+
- MySQL 8.0+
- Maven 3.8+

### 1. 数据库配置

创建数据库并导入SQL脚本：

```sql
CREATE DATABASE IF NOT EXISTS damai_ticket DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE damai_ticket;
-- 执行SQL脚本（位于 backend/sql/ 目录）
```

### 2. 后端启动

```bash
cd backend/damai-ticket

# 修改 src/main/resources/application.yml 中的数据库配置
# 配置 MySQL 连接信息

# 启动后端服务
mvn spring-boot:run

# 或打包后运行
mvn package -DskipTests
java -jar target/damai-ticket-0.0.1-SNAPSHOT.jar
```

后端服务地址：`http://localhost:8081`

### 3. 前端启动

```bash
cd frontend/damai-ticket-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务地址：`http://localhost:5173`

### 4. 初始化测试数据

1. 使用管理员账号登录管理后台
2. 创建演出信息
3. 初始化座位数据
4. 使用普通用户账号购买门票

## 默认账号

### 管理员账号
- 用户名：`admin`
- 密码：`123`
- 邀请码：`DAMAI-ADMIN-2025`（注册管理员需要）

### 普通用户账号
- 用户名：`test`
- 密码：`123`

## API接口文档

### 认证接口

#### 登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "test",
  "password": "123"
}

Response: User对象
```

#### 注册
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password",
  "phone": "13800138000"
}

Response: "注册成功" 或错误信息
```

### 演出接口

#### 获取演出列表
```
GET /api/show/list?keyword=周杰伦&category=演唱会

Response: ShowEvent[]
```

#### 获取演出详情
```
GET /api/show/{id}

Response: ShowEvent对象
```

### 座位接口

#### 获取座位列表
```
GET /api/seat/list/{showId}

Response: Seat[]
```

#### 初始化座位
```
POST /api/seat/init/{showId}

Response: "座位初始化成功"
```

### 订单接口

#### 创建订单（单张）
```
POST /api/order/create
Content-Type: application/json

{
  "userId": 1,
  "showId": 1,
  "seatId": 1
}

Response: "下单成功，订单ID=X"
```

#### 批量创建订单
```
POST /api/order/createBatch
Content-Type: application/json

{
  "userId": 1,
  "showId": 1,
  "seatIds": [1, 2, 3]
}

Response: { success: true, msg: "批量下单成功", data: [orderIds] }
```

#### 支付订单
```
POST /api/order/pay
Content-Type: application/json

{
  "orderId": 1,
  "userId": 1
}

Response: "支付成功（模拟支付）"
```

#### 取消订单
```
POST /api/order/cancel
Content-Type: application/json

{
  "orderId": 1,
  "userId": 1
}

Response: "取消成功：座位已释放"
```

#### 获取用户订单
```
GET /api/order/user/{userId}

Response: OrderInfo[]
```

### 用户接口

#### 获取用户信息
```
GET /api/user/{id}

Response: User对象
```

#### 更新用户信息
```
PUT /api/user/update
Content-Type: application/json

{
  "id": 1,
  "phone": "13800138000",
  "email": "user@example.com",
  "nickname": "昵称"
}

Response: "更新成功"
```

### 评分接口

#### 提交评分
```
POST /api/rating/submit
Content-Type: application/json

{
  "userId": 1,
  "orderId": 1,
  "score": 5,
  "content": "很棒的演出！"
}

Response: { code: 200, msg: "评分成功" }
```

#### 获取演出评分汇总
```
GET /api/rating/show/{showId}/summary

Response: { avgScore: 4.5, count: 100 }
```

### AI助手接口

#### 聊天
```
POST /api/ai/chat
Content-Type: application/json

{
  "question": "有什么热门演出推荐？"
}

Response: { answer: "根据您的喜好..." }
```

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | EventList.vue | 首页演出列表 |
| `/login` | Login.vue | 登录/注册 |
| `/seat/:id` | SeatSelect.vue | 座位选择 |
| `/orders` | MyOrders.vue | 我的订单 |
| `/profile` | Profile.vue | 个人中心 |
| `/ai` | AIAssistant.vue | AI智能助手 |
| `/admin` | Admin.vue | 管理后台 |

## AI智能客服配置

系统使用 DeepSeek API 作为AI智能客服的后端。需要配置以下环境变量或在配置文件中设置：

```yaml
# application.yml
ai:
  api-key: your-deepseek-api-key
  api-url: https://api.deepseek.com/chat/completions
  model: deepseek-chat
```

获取DeepSeek API Key：https://platform.deepseek.com/

## 项目结构

```
damai-ticket-project/
├── backend/
│   ├── damai-ticket/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── java/com/damai/damaiticket/
│   │   │       │   ├── controller/    # 控制器
│   │   │       │   ├── entity/        # 实体类
│   │   │       │   ├── mapper/        # 数据访问层
│   │   │       │   ├── service/      # 服务层
│   │   │       │   └── common/       # 通用工具
│   │   │       └── resources/
│   │   │           ├── application.yml
│   │   │           └── mapper/       # MyBatis XML映射
│   │   └── pom.xml
│   └── sql/
│       └── damai_ticket.sql          # 数据库脚本
│
├── frontend/
│   └── damai-ticket-frontend/
│       ├── src/
│       │   ├── api/                  # API请求封装
│       │   ├── components/           # 公共组件
│       │   ├── router/               # 路由配置
│       │   ├── styles/               # 全局样式
│       │   ├── views/                # 页面组件
│       │   ├── App.vue
│       │   └── main.js
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
│
└── README.md
```

## 开发指南

### 前端开发

1. **使用API服务**
   ```javascript
   import { showAPI, orderAPI } from '@/api/services'
   
   // 获取演出列表
   const shows = await showAPI.getList('周杰伦', '演唱会')
   
   // 创建订单
   await orderAPI.create({ userId: 1, showId: 1, seatId: 1 })
   ```

2. **组件开发**
   - 遵循 Vue 3 Composition API 风格
   - 使用 `<script setup>` 语法
   - 样式使用 Scoped CSS

### 后端开发

1. **新增API**
   - 在 `controller/` 创建Controller
   - 使用 `@RestController` 和 `@RequestMapping`
   - 注入Service层进行处理

2. **数据模型**
   - 在 `entity/` 创建实体类
   - 在 `mapper/` 创建Mapper接口
   - 在 `service/` 创建Service类

## 部署说明

### 前端部署

```bash
cd frontend/damai-ticket-frontend

# 构建生产版本
npm run build

# 构建产物在 dist/ 目录
# 可部署到 Nginx、Apache 或 CDN
```

### 后端部署

```bash
cd backend/damai-ticket

# 构建JAR包
mvn clean package -DskipTests

# 运行
java -jar target/damai-ticket-0.0.1-SNAPSHOT.jar
```

### Nginx配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /var/www/damai-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://localhost:8081/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 注意事项

1. **并发安全**
   - 座位选择使用乐观锁机制，防止超卖
   - 订单状态更新使用条件更新

2. **数据安全**
   - 用户密码建议使用加密存储
   - 敏感操作需要身份验证

3. **支付模拟**
   - 当前为模拟支付，实际生产需对接真实支付渠道
   - 建议添加支付回调处理

4. **AI客服限制**
   - DeepSeek API有调用频率限制
   - 建议添加缓存机制

## License

MIT License

## 联系方式

如有问题，请提交 Issue 或联系开发者。
