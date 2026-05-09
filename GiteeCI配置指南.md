# Gitee CI/CD 配置指南

## 一、Gitee 仓库创建

### 1.1 登录 Gitee
访问 https://gitee.com 并登录你的账号

### 1.2 创建新仓库
1. 点击右上角 "+" → "新建仓库"
2. 填写仓库信息：
   - **仓库名称**: `damai-ticket-project`
   - **路径**: `damai-ticket-project`
   - **归属**: 选择你的个人空间
   - **是否开源**: 选择私有（课程项目建议私有）
3. 点击"创建"

## 二、推送代码到 Gitee

### 2.1 使用脚本推送（推荐）
双击运行 `初始化Git并推送.bat`，按提示操作。

### 2.2 手动推送
```bash
# 进入项目目录
cd d:\2026\集成\damai-ticket-project

# 初始化 Git
git init

# 添加远程仓库（将 url 替换为你的仓库地址）
git remote add origin https://gitee.com/你的用户名/damai-ticket-project.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 推送
git push -u origin master
```

## 三、启用 Gitee 流水线

### 3.1 进入仓库设置
1. 打开你的仓库页面
2. 点击顶部菜单 "管理"

### 3.2 开启流水线
1. 在左侧菜单找到 "流水线"
2. 点击 "开启流水线"
3. 选择 Runner 类型：
   - **Gitee 官方 Runner**: 免费，适合公开仓库
   - **私有 Runner**: 需要自行配置

### 3.3 流水线功能
开启后，每次推送代码到 `master` 或 `main` 分支都会自动：
1. 构建后端（Spring Boot）
2. 构建前端（Vue）
3. 运行单元测试
4. 生成构建报告

## 四、查看流水线状态

### 4.1 进入流水线页面
- 在仓库页面点击 "流水线" 菜单

### 4.2 查看构建详情
- 点击某次构建记录
- 查看各个任务的执行状态
- 查看构建日志

## 五、流水线配置说明

### 5.1 配置文件位置
`.gitee/workflows/ci.yml`

### 5.2 流水线任务

| 任务 | 说明 |
|-----|------|
| backend | Maven 编译打包后端项目 |
| frontend | npm 构建前端项目 |
| test | 运行单元测试 |
| build-report | 生成构建报告 |

### 5.3 自定义配置

如需修改流水线，可编辑 `.gitee/workflows/ci.yml`：

```yaml
# 修改 JDK 版本
- name: Set up JDK 8
  uses: actions/setup-java@v3
  with:
    java-version: '8'  # 改为 '11' 或 '17'

# 修改 Node 版本
- name: Set up Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '18'  # 改为 '16' 或 '20'
```

## 六、常见问题

### 6.1 流水线不触发
- 检查是否推送到正确的分支（master/main）
- 检查仓库设置中流水线是否已开启

### 6.2 构建失败
- 查看构建日志定位问题
- 常见错误：
  - Maven 依赖下载失败 → 检查网络
  - Node 模块安装失败 → 检查 package-lock.json
  - Java 版本不匹配 → 调整 pipeline 配置

### 6.3 私有仓库需要付费
- Gitee 免费版每个仓库有流水线分钟数限制
- 公开仓库流水线分钟数更充足
- 可申请学生认证获得更多免费额度

## 七、CI/CD 考核要求

### 7.1 课程需要提交的内容

1. **Gitee 仓库地址**
   - 在报告中附上仓库链接

2. **流水线运行截图**
   - 展示至少一次成功的构建
   - 包含构建日志

3. **README.md**
   - 项目说明文档
   - 已包含在项目中

### 7.2 验收标准

| 项目 | 要求 |
|-----|------|
| 仓库 | ✅ 已创建并上传代码 |
| CI 配置 | ✅ 包含 `.gitee/workflows/ci.yml` |
| 流水线 | ✅ 已开启并能运行 |
| 构建成功 | ✅ 至少一次成功构建 |
| 文档 | ✅ README.md 完整 |

## 八、获取帮助

- Gitee 流水线文档：https://gitee.com/help/articles/4320
- Gitee Actions 语法：https://gitee.com/help/articles/4187
