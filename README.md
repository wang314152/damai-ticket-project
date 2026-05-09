

# 大麦网票务系统

> 软件集成开发课程项目 - 基于 Spring Boot + Vue 3 的演出票务平台

## 项目简介

本项目是一个功能完整的演出票务预订系统，采用前后端分离架构设计。系统提供用户端购票功能和后台管理功能，模拟大麦网的核心票务业务场景。

### 技术栈

| 端 | 技术 |
|---|---|
| 前端 | Vue 3 + Vite + Element Plus + Axios |
| 后端 | Spring Boot 2.7 + MyBatis Plus + H2 Database |
| 数据库 | H2 内存数据库 |

## 快速开始

### 环境要求

- JDK 8+
- Node.js 18+
- Maven 3.6+

### 启动步骤

#### 1. 启动后端

```bash
cd damai-ticket
mvnw.cmd spring-boot:run
```

或打包运行：
```bash
mvnw.cmd clean package -DskipTests
java -jar target/damai-ticket-1.0.0.jar
```

#### 2. 启动前端

```bash
cd damai-ticket-frontend
npm install
npm run dev
```

#### 3. 访问系统

- 前端：http://localhost:5173
- 后端：http://localhost:8081
- H2控制台：http://localhost:8081/h2-console

### 测试账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |
| 普通用户 | test | 123456 |

> 注册管理员需要邀请码：`DAMAI-ADMIN-2025`

## 项目结构

```
damai-ticket-project/
├── damai-ticket/              # 后端 Spring Boot 项目
│   ├── src/main/java/        # Java 源代码
│   │   └── com/damai/damaiticket/
│   │       ├── config/       # 配置类
│   │       ├── controller/   # 控制器
│   │       ├── entity/       # 实体类
│   │       ├── mapper/        # MyBatis Mapper
│   │       └── service/      # 业务服务
│   ├── src/main/resources/    # 配置文件
│   │   ├── application.yml   # Spring Boot 配置
│   │   ├── schema.sql        # 数据库表结构
│   │   └── data.sql          # 初始数据
│   └── pom.xml               # Maven 依赖
├── damai-ticket-frontend/     # 前端 Vue 项目
│   ├── src/
│   │   ├── api/             # API 请求封装
│   │   ├── views/           # 页面组件
│   │   ├── router/          # 路由配置
│   │   └── style.css        # 全局样式
│   └── package.json
├── uploads/                   # 上传文件目录
└── .gitee/                   # Gitee CI/CD 配置
    └── workflows/
        └── ci.yml
```

## 功能模块

### 用户端
- 用户注册/登录
- 演出列表浏览与搜索
- 演出详情查看
- 座位可视化选择
- 订单管理与支付
- 评分评价功能

### 管理端
- 演出管理（增删改查）
- 座位价格分区设置
- 订单管理
- 用户管理
- 数据统计分析

## API 接口

| 接口 | 方法 | 说明 |
|-----|------|------|
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/show/list` | GET | 演出列表 |
| `/api/show/{id}` | GET | 演出详情 |
| `/api/seat/list/{showId}` | GET | 座位列表 |
| `/api/seat/init/{showId}` | POST | 初始化座位 |
| `/api/order/create` | POST | 创建订单 |
| `/api/order/createBatch` | POST | 批量下单 |
| `/api/order/pay` | POST | 订单支付 |
| `/api/order/user/{userId}` | GET | 用户订单 |
| `/api/rating/submit` | POST | 提交评分 |
| `/api/admin/show/*` | REST | 演出管理 |
| `/api/admin/user/*` | REST | 用户管理 |
| `/api/admin/order/*` | REST | 订单管理 |
| `/api/admin/stats/*` | REST | 统计分析 |

## Gitee CI/CD 配置

本项目已配置 Gitee 流水线，实现代码推送后自动构建。

### 流水线功能

1. 后端构建 - Maven 编译打包
2. 前端构建 - Vue 项目构建
3. 单元测试 - 后端测试
4. 构建报告 - 生成构建状态

### 使用步骤

1. 创建仓库并上传代码
2. 进入仓库 → 管理 → 流水线 → 开启流水线
3. 推送代码查看构建状态

## 课程要求对照

| 要求 | 实现 |
|-----|------|
| 版本控制 | ✅ Git + Gitee |
| CI/CD | ✅ Gitee 流水线 |
| 前后端分离 | ✅ REST API |
| 数据库集成 | ✅ H2 Database |
| 自动化构建 | ✅ Maven + npm |

## License

MIT License