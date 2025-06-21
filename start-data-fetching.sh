#!/bin/bash

# PriceValve Data Fetching Startup Script
# This script helps you quickly start and test the data fetching functionality

echo "🎮 PriceValve Data Fetching Setup"
echo "=================================="
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

echo "✅ Node.js and npm are installed"
echo ""

# Navigate to backend directory
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install backend dependencies"
        exit 1
    fi
    echo "✅ Backend dependencies installed"
else
    echo "✅ Backend dependencies already installed"
fi

echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Server Configuration
PORT=3001
NODE_ENV=development

# Steam API (optional but recommended)
# Get your key from: https://steamcommunity.com/dev/apikey
STEAM_API_KEY=

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database (optional)
MONGODB_URI=mongodb://localhost:27017/pricevalve
EOF
    echo "✅ Created .env file"
    echo "💡 You can add your Steam API key to the .env file for enhanced functionality"
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

# Start the server
npm run dev 