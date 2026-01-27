@echo off
REM OpexSales Backend Quick Setup Script for Windows with Docker Support

setlocal enabledelayedexpansion

echo.
echo 🚀 Starting OpexSales Backend Setup...
echo.

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed
    echo    Install from: https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js !NODE_VERSION!

REM Check for bun or npm
where bun >nul 2>nul
if errorlevel 0 (
    set PKG_MANAGER=bun
    echo ✅ Using Bun
) else (
    where npm >nul 2>nul
    if errorlevel 1 (
        echo ❌ Neither Bun nor npm found
        exit /b 1
    ) else (
        set PKG_MANAGER=npm
        echo ✅ Using npm
    )
)

REM Create .env if it doesn't exist
if not exist .env (
    echo.
    echo 📝 Creating .env file from template...
    copy .env.example .env >nul 2>&1
    if errorlevel 1 (
        echo ❌ Failed to create .env file
        exit /b 1
    )
    echo ✅ Created .env file
    echo    ⚠️  Update OPENAI_API_KEY if you want to use AI features
) else (
    echo ✅ .env file already exists
)

REM Install dependencies
echo.
echo 📦 Installing dependencies...
if "%PKG_MANAGER%"=="bun" (
    call bun install
) else (
    call npm install
)
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    exit /b 1
)
echo ✅ Dependencies installed

REM Check for Docker
echo.
echo 🐳 Checking Docker installation...
set USE_DOCKER=false

where docker >nul 2>nul
if errorlevel 0 (
    echo ✅ Docker is installed
    
    where docker-compose >nul 2>nul
    if errorlevel 0 (
        set DOCKER_CMD=docker-compose
        set USE_DOCKER=true
    ) else (
        REM Try docker compose (new syntax)
        docker compose version >nul 2>nul
        if errorlevel 0 (
            set DOCKER_CMD=docker compose
            set USE_DOCKER=true
        ) else (
            echo ❌ Docker Compose not found
        )
    )
    
    if "!USE_DOCKER!"=="true" (
        echo ✅ Docker Compose is available
    )
) else (
    echo ⚠️  Docker is not installed
    echo    Windows: https://docs.docker.com/desktop/install/windows-install/
    echo    WSL2 required for Docker Desktop on Windows
    echo.
    set /p CONTINUE="Continue with local PostgreSQL instead? (y/n): "
    if /i not "!CONTINUE!"=="y" (
        echo Please install Docker Desktop
        exit /b 1
    )
    echo ℹ️  Using local PostgreSQL - ensure it's running on localhost:5432
)

REM Start Docker database if available
if "!USE_DOCKER!"=="true" (
    echo.
    echo 🗄️  Starting PostgreSQL in Docker...
    call !DOCKER_CMD! up -d
    if errorlevel 1 (
        echo ❌ Failed to start Docker containers
        exit /b 1
    )
    
    echo    Waiting for database to be ready...
    timeout /t 3 /nobreak >nul
    
    REM Check if database is accessible (basic check)
    for /l %%i in (1,1,30) do (
        call !DOCKER_CMD! exec -T postgres pg_isready -U opexsales_user -d opexsales >nul 2>&1
        if errorlevel 0 (
            echo ✅ PostgreSQL is ready
            goto db_ready
        )
        if %%i equ 30 (
            echo ❌ PostgreSQL failed to start
            echo    Try: !DOCKER_CMD! logs postgres
            exit /b 1
        )
        echo    Attempt %%i/30...
        timeout /t 1 /nobreak >nul
    )
    
    :db_ready
)

REM Generate Prisma Client
echo.
echo 🔧 Generating Prisma Client...
if "%PKG_MANAGER%"=="bun" (
    call bunx prisma generate
) else (
    call npx prisma generate
)
if errorlevel 1 (
    echo ❌ Failed to generate Prisma client
    exit /b 1
)
echo ✅ Prisma Client generated

REM Run migrations
echo.
echo 🗄️  Running database migrations...
if "%PKG_MANAGER%"=="bun" (
    call bunx prisma migrate deploy >nul 2>&1 || call bunx prisma migrate dev --name init
) else (
    call npx prisma migrate deploy >nul 2>&1 || call npx prisma migrate dev --name init
)
if errorlevel 1 (
    echo ❌ Failed to run migrations
    exit /b 1
)
echo ✅ Database migrated

REM Seed database
echo.
echo 🌱 Seeding database with demo data...
if "%PKG_MANAGER%"=="bun" (
    call bunx prisma db seed
) else (
    call npx prisma db seed
)
if errorlevel 1 (
    echo ❌ Failed to seed database
    exit /b 1
)
echo ✅ Database seeded

echo.
echo ✨ Setup complete!
echo.
echo 📋 Demo Credentials:
echo    Admin:     admin@opexsales.com / password123
echo    Manager:   manager@opexsales.com / password123
echo    Sales Rep: salesrep@opexsales.com / password123
echo.
echo 🚀 Start the backend with:
echo    npm run dev
echo.
echo 📍 Backend will run on: http://localhost:3000
echo.
if "!USE_DOCKER!"=="true" (
    echo 🐳 View Docker logs:
    echo    !DOCKER_CMD! logs -f postgres
    echo.
)
echo 📚 Documentation:
echo    API Reference:  Read README.md
echo    Setup Guide:    Read ..\FULL_STACK_SETUP.md
echo    Code Examples:  Read ..\src\examples\api-client-examples.ts
echo.
pause
