<<<<<<< HEAD
# 大麦网票务系统

> 软件集成开发课程项目 - 基于 Spring Boot + Vue 3 的演出票务平台

## 项目简介

本项目是一个完整的大麦网风格演出票务预订系统，包含用户端购票功能和后台管理系统。

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

## Gitee CI/CD 配置

本项目已配置 Gitee 流水线，实现代码推送后自动构建。

### 流水线功能

1. **后端构建** - Maven 编译打包
2. **前端构建** - Vue 项目构建
3. **单元测试** - 后端测试 + 前端检查
4. **构建报告** - 生成构建状态报告

### 流水线配置

配置文件位置：`.gitee/workflows/ci.yml`

### 使用步骤

1. **创建仓库**
   - 登录 [Gitee](https://gitee.com)
   - 创建新仓库，上传代码

2. **启用流水线**
   - 进入仓库 → 管理 → 流水线
   - 点击"开启流水线"

3. **配置运行器（可选）**
   - 使用 Gitee 官方免费 Runner
   - 或配置私有 Runner

4. **推送代码**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://gitee.com/你的用户名/damai-ticket-project.git
   git push -u origin master
   ```

5. **查看流水线**
   - 进入仓库 → 流水线
   - 查看构建状态和日志

## 项目结构

```
damai-ticket-project/
├── damai-ticket/              # 后端 Spring Boot 项目
│   ├── src/main/java/        # Java 源代码
│   ├── src/main/resources/    # 配置文件
│   │   ├── application.yml   # Spring Boot 配置
│   │   ├── schema.sql       # 数据库表结构
│   │   └── data.sql         # 初始数据
│   └── pom.xml              # Maven 依赖
├── damai-ticket-frontend/     # 前端 Vue 项目
│   ├── src/
│   │   ├── api/            # API 请求封装
│   │   ├── views/          # 页面组件
│   │   └── router/        # 路由配置
│   └── package.json
├── uploads/                  # 上传文件目录
├── .gitee/                   # Gitee 配置
│   └── workflows/           # CI/CD 流水线
│       └── ci.yml
└── README.md
```

## 功能模块

### 用户端
- [x] 用户注册/登录
- [x] 演出列表浏览
- [x] 演出详情查看
- [x] 座位选择（可视化）
- [x] 订单管理
- [x] 评分评价

### 管理端
- [x] 演出管理（增删改查）
- [x] 座位管理（初始化座位）
- [x] 订单管理
- [x] 用户管理
- [x] 数据统计

## API 接口

| 接口 | 方法 | 说明 |
|-----|------|------|
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/register` | POST | 用户注册 |
| `/api/show/list` | GET | 演出列表 |
| `/api/show/{id}` | GET | 演出详情 |
| `/api/seat/list/{showId}` | GET | 座位列表 |
| `/api/order/createBatch` | POST | 批量下单 |
| `/api/order/my` | GET | 我的订单 |

## 课程要求对照

| 要求 | 实现 |
|-----|------|
| 版本控制 | ✅ Git + Gitee |
| CI/CD | ✅ Gitee 流水线 |
| 前后端分离 | ✅ REST API |
| 数据库集成 | ✅ H2 Database |
| 自动化构建 | ✅ Maven + npm |
| 单元测试 | ✅ JUnit |

## License

MIT License
=======
# damai-ticket-project

#### 介绍
{**以下是 Gitee 平台说明，您可以替换此简介**
Gitee 是 OSCHINA 推出的基于 Git 的代码托管平台（同时支持 SVN）。专为开发者提供稳定、高效、安全的云端软件开发协作平台
无论是个人、团队、或是企业，都能够用 Gitee 实现代码托管、项目管理、协作开发。企业项目请看 [https://gitee.com/enterprises](https://gitee.com/enterprises)}

#### 软件架构
软件架构说明


#### 安装教程

1.  xxxx
2.  xxxx
3.  xxxx

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
>>>>>>> 41b53e1d2ca8ef3270bcfa1e020793d6f8ff2b1b
