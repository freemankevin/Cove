#!/bin/bash

set -e

echo "🚀 启动前端开发服务器..."
echo "📦 检查依赖..."

if [ ! -d "node_modules" ]; then
    echo "📥 安装依赖..."
    npm install
else
    echo "✅ 依赖已安装"
fi

PORT=${COVE_PORT:-5173}

# 检查并释放端口
echo "🔍 检查端口 ${PORT}..."
if netstat -ano 2>/dev/null | grep ":${PORT} " | grep -q "LISTENING"; then
    echo "⚠️  端口 ${PORT} 已被占用，正在处理..."
    PID=$(netstat -ano 2>/dev/null | grep ":${PORT} " | grep "LISTENING" | awk '{print $NF}' | head -1)
    if [ -n "$PID" ]; then
        echo "🔪 杀掉进程 PID: $PID"
        taskkill //F //PID "$PID" 2>/dev/null || true
        sleep 1
    fi
elif lsof -i ":${PORT}" 2>/dev/null | grep -q LISTEN; then
    echo "⚠️  端口 ${PORT} 已被占用，正在处理..."
    PID=$(lsof -t -i ":${PORT}" 2>/dev/null | head -1)
    if [ -n "$PID" ]; then
        echo "🔪 杀掉进程 PID: $PID"
        kill -9 "$PID" 2>/dev/null || true
        sleep 1
    fi
fi
echo "✅ 端口已就绪"
echo ""

echo "🔧 启动开发服务器 (端口: ${PORT})..."
npm run dev -- --port ${PORT}
