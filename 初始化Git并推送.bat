@echo off
chcp 65001 >nul
echo ================================================
echo       Gitee 仓库初始化和推送脚本
echo ================================================
echo.

:: 检查Git是否安装
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git 未安装！请先安装 Git
    echo    下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

:: 设置项目目录
set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

:: 检查远程仓库是否已配置
git remote -v >nul 2>&1
if %errorlevel% neq 0 (
    echo 📌 步骤1: 添加远程仓库
    echo.
    set /p GIT_URL="请输入Gitee仓库地址 (例如: https://gitee.com/你的用户名/damai-ticket-project.git): "
    if "%GIT_URL%"=="" (
        echo ❌ 仓库地址不能为空
        pause
        exit /b 1
    )
    git remote add origin %GIT_URL%
)

:: 初始化Git（如果是新仓库）
if not exist ".git" (
    echo 📌 步骤2: 初始化Git仓库...
    git init
    echo.
)

:: 配置用户信息（如果未配置）
git config user.email "your.email@example.com" 2>nul
git config user.name "Your Name" 2>nul

:: 添加所有文件
echo 📌 步骤3: 添加文件到暂存区...
git add .

:: 显示状态
echo.
echo 📌 当前修改内容:
git status --short
echo.

:: 提交
set /p COMMIT_MSG="输入提交信息 (直接回车使用默认): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Initial commit - 大麦网票务系统
git commit -m "%COMMIT_MSG%"

:: 推送
echo.
echo 📌 步骤4: 推送到Gitee...
echo.

:: 检查分支
git branch -m master main 2>nul
git branch -M main 2>nul

:: 推送
git push -u origin main --force
echo.

if %errorlevel% equ 0 (
    echo ================================================
    echo ✅ 推送成功！
    echo.
    echo 📌 下一步操作:
    echo    1. 打开 Gitee 仓库页面
    echo    2. 进入 管理 -> 流水线
    echo    3. 开启流水线功能
    echo    4. 之后的每次推送都会自动触发构建！
    echo ================================================
) else (
    echo ❌ 推送失败！请检查网络连接或仓库权限
)

echo.
pause
