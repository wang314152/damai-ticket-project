@echo off
chcp 65001 > nul
echo ========================================
echo    大麦网票务系统 - 一键启动脚本
echo ========================================
echo.

:: 检查前端依赖
echo [1/3] 检查前端依赖...
cd damai-ticket-frontend
if not exist node_modules (
    echo 首次运行，正在安装前端依赖...
    call npm install
) else (
    echo 前端依赖已就绪
)

:: 启动后端（新窗口）
echo [2/3] 启动后端服务...
cd ..\damai-ticket
start "后端服务" cmd /k "cd /d %~dp0 && .\mvnw.cmd spring-boot:run"

:: 启动前端
echo [3/3] 启动前端服务...
cd ..\damai-ticket-frontend
start "前端服务" cmd /k "npm run dev"

echo.
echo ========================================
echo    启动中，请稍候...
echo    后端: http://localhost:8081
echo    前端: http://localhost:5173
echo ========================================
pause
