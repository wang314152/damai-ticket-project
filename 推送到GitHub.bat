@echo off
chcp 65001 >nul
echo ================================================
echo       GitHub 仓库推送脚本
echo ================================================
echo.

:: 检查Git是否安装
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo Git 未安装！请先安装 Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

:: 设置项目目录
set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

:: 检查远程仓库
git remote -v | findstr github >nul
if errorlevel 1 (
    echo 添加 GitHub 远程仓库...
    git remote add origin https://github.com/wang314152/damai-ticket-project.git
)

:: 添加所有文件
echo.
echo 添加文件到暂存区...
git add .

:: 显示状态
echo.
echo 当前修改内容:
git status --short
echo.

:: 提交
git commit -m "fix: 升级 Node.js 版本到 22 并添加 element-plus 依赖"

:: 推送
echo.
echo 推送到 GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo 推送失败！
) else (
    echo.
    echo 推送成功！
    echo 请查看: https://github.com/wang314152/damai-ticket-project/actions
)

echo.
pause
