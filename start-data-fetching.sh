#!/bin/bash

# PriceValve Development Server Startup Script
# Starts both frontend and backend for development

echo "🎮 Starting PriceValve Development Environment..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Function to check if dependencies are installed
check_dependencies() {
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing root dependencies..."
        npm install
    fi
    
    if [ ! -d "frontend/node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        cd frontend && npm install && cd ..
    fi
    
    if [ ! -d "backend/node_modules" ]; then
        echo "📦 Installing backend dependencies..."
        cd backend && npm install && cd ..
    fi
}

# Install dependencies if needed
check_dependencies

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️ Creating .env file..."
    cat > backend/.env << EOF
# Server Configuration
PORT=3001
NODE_ENV=development

# Steam API (optional but recommended)
# Get your key from: https://steamcommunity.com/dev/apikey
STEAM_API_KEY=
ITAD_API_KEY=a59414cc337e298d6bc443ad633ec49790592e69
# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
EOF
    echo "✅ Created .env file"
    echo "⚠️ You can add your Steam API key to the .env file for enhanced functionality"
else
    echo "✅ .env file already exists"
fi

echo ""

# Start the server
echo "🚀 Starting PriceValve backend server..."
echo "   Server will be available at: http://localhost:3001"
echo "   Health check: http://localhost:3001/api/health"
echo "   Data API: http://localhost:3001/api/data"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start backend server
cd backend && npm run dev
