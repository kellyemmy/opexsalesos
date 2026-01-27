#!/bin/bash

# OpexSales Backend Quick Setup Script
# Works with Docker PostgreSQL (recommended) or local PostgreSQL

set -e

echo ""
echo "🚀 Starting OpexSales Backend Setup..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Install from: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION"

# Check for bun or npm
if command -v bun &> /dev/null; then
    PKG_MANAGER="bun"
    echo "✅ Using Bun"
elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    echo "✅ Using npm"
else
    echo "❌ Neither Bun nor npm found"
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo "   ⚠️  Update OPENAI_API_KEY if you want to use AI features"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if [ "$PKG_MANAGER" = "bun" ]; then
    bun install
else
    npm install
fi
echo "✅ Dependencies installed"

# Check for Docker
echo ""
echo "🐳 Checking Docker installation..."
USE_DOCKER=false

if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
    
    if command -v docker-compose &> /dev/null; then
        DOCKER_CMD="docker-compose"
    elif docker compose version &> /dev/null 2>&1; then
        DOCKER_CMD="docker compose"
    else
        echo "❌ Docker Compose not found"
        DOCKER_CMD=""
    fi
    
    if [ -n "$DOCKER_CMD" ]; then
        echo "✅ Docker Compose is available"
        USE_DOCKER=true
    fi
else
    echo "⚠️  Docker is not installed"
    echo "   Codespaces users: Docker is available in your environment"
    echo ""
    read -p "Continue with local PostgreSQL instead? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "ℹ️  Using local PostgreSQL - ensure it's running on localhost:5432"
    else
        echo "Install Docker from: https://docs.docker.com/get-docker"
        exit 1
    fi
fi

# Start Docker database if available
if [ "$USE_DOCKER" = true ]; then
    echo ""
    echo "🗄️  Starting PostgreSQL in Docker..."
    $DOCKER_CMD up -d
    
    echo "   Waiting for database to be ready..."
    sleep 3
    
    # Check if database is accessible
    for i in {1..30}; do
        if $DOCKER_CMD exec -T postgres pg_isready -U opexsales_user -d opexsales > /dev/null 2>&1; then
            echo "✅ PostgreSQL is ready"
            break
        fi
        if [ $i -eq 30 ]; then
            echo "❌ PostgreSQL failed to start"
            echo "   Try: $DOCKER_CMD logs postgres"
            exit 1
        fi
        echo "   Attempt $i/30..."
        sleep 1
    done
fi

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
if [ "$PKG_MANAGER" = "bun" ]; then
    bunx prisma generate
else
    npx prisma generate
fi
echo "✅ Prisma Client generated"

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
if [ "$PKG_MANAGER" = "bun" ]; then
    bunx prisma migrate deploy 2>/dev/null || bunx prisma migrate dev --name init
else
    npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init
fi
echo "✅ Database migrated"

# Seed database
echo ""
echo "🌱 Seeding database with demo data..."
if [ "$PKG_MANAGER" = "bun" ]; then
    bunx prisma db seed
else
    npx prisma db seed
fi
echo "✅ Database seeded"

echo ""
echo "✨ Setup complete!"
echo ""
echo "📋 Demo Credentials:"
echo "   Admin:     admin@opexsales.com / password123"
echo "   Manager:   manager@opexsales.com / password123"
echo "   Sales Rep: salesrep@opexsales.com / password123"
echo ""
echo "🚀 Start the backend with:"
echo "   npm run dev"
echo ""
echo "📍 Backend will run on: http://localhost:3000"
echo ""
if [ "$USE_DOCKER" = true ]; then
    echo "🐳 View Docker logs:"
    echo "   $DOCKER_CMD logs -f postgres"
    echo ""
fi
echo "📚 Documentation:"
echo "   API Reference:  Read README.md"
echo "   Setup Guide:    Read ../FULL_STACK_SETUP.md"
echo "   Code Examples:  Read ../src/examples/api-client-examples.ts"
echo ""
