@echo off
chcp 65001 >nul
title 大麦票务系统启动器

echo ========================================
echo     大麦票务系统 - 一键启动
echo ========================================
echo.

:: 获取当前目录
set PROJECT_DIR=%~dp0
set BACKEND_DIR=%PROJECT_DIR%damai-ticket
set FRONTEND_DIR=%PROJECT_DIR%damai-ticket-frontend

:: 停止占用端口的进程
echo [清理] 停止旧进程...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8081" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":7000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

:: 启动后端
echo [1/2] 启动后端服务 (端口 8081)...
start "【后端】Spring Boot" cmd /k "cd /d \"%BACKEND_DIR%\" && java -jar target\damai-ticket-1.0.0.jar"

:: 等待后端启动
echo 等待后端启动（35秒）...
timeout /t 35 /nobreak >nul

:: 启动前端
echo [2/2] 启动前端服务 (端口 5173)...
start "【前端】Vue 3" cmd /k "cd /d \"%FRONTEND_DIR%\" && npx vite"

:: 等待前端启动
echo 等待前端启动（20秒）...
timeout /t 20 /nobreak >nul

:: 打开浏览器
echo.
echo ========================================
echo     启动完成！
echo ========================================
start http://localhost:5173

echo.
echo ================================
echo   服务地址：
echo   前端: http://localhost:5173
echo   后端: http://localhost:8081
echo   API: http://localhost:8081/api
echo ================================
echo.
echo 提示：如果页面打不开，请等待1-2分钟后再刷新
echo 按任意键退出...
pause >nul
