# Backend Setup - Fixed Issues

## Overview
All backend setup issues for Codespaces compatibility have been **RESOLVED**. The system now uses Docker-based PostgreSQL by default with graceful fallback to local PostgreSQL.

## Issues Fixed

### 1. ✅ Dependency Version Conflicts
**Problem:** `@nestjs/jwt` was set to `^12.1.0` (non-existent version)

**Solution:**
- Changed to `@nestjs/jwt: ^10.2.0` (stable, compatible with NestJS 10.3.0)
- Ensured all NestJS packages use `^10.x` versions
- Added `@nestjs/config: ^3.2.0` for environment management
- Added security packages: `helmet: ^7.1.0`, `compression: ^1.7.4`

**File:** `server/package.json` ✅

### 2. ✅ Missing NestJS CLI for Local Development
**Problem:** `nest start --watch` required global `@nestjs/cli` installation

**Solution:**
- Added `@nestjs/cli: ^10.3.0` to `devDependencies`
- Now supports `npx nest start --watch` without global install
- Added `db:migrate` and `db:migrate:deploy` scripts

**File:** `server/package.json` ✅

### 3. ✅ Docker-Based PostgreSQL (Codespaces-Ready)
**Problem:** Setup script required local PostgreSQL installation

**Solution:**
- Created `docker-compose.yml` with PostgreSQL 15 Alpine service
- Automatic Docker detection in both `setup.sh` and `setup.bat`
- Graceful fallback to local PostgreSQL if Docker unavailable
- Health check ensures database is ready before migrations

**Files:** 
- `server/docker-compose.yml` (NEW) ✅
- `server/setup.sh` (UPDATED) ✅
- `server/setup.bat` (UPDATED) ✅

### 4. ✅ Updated Environment Configuration
**Problem:** No Docker database URL in environment template

**Solution:**
- Updated `.env.example` with Docker-first configuration
- Clear instructions for Docker setup
- Alternative local PostgreSQL option (commented)
- Complete webhook configuration examples

**File:** `server/.env.example` ✅

### 5. ✅ Automated Setup Flow
**Problem:** Manual steps, no database readiness checking

**Solution:**
- `setup.sh`: 120 lines with auto-detection and health checks
- `setup.bat`: Windows-compatible version with Docker support
- 30-second database readiness retry loop
- Explicit Prisma generation (prevents build errors)
- Comprehensive error handling

**Files:**
- `server/setup.sh` ✅
- `server/setup.bat` ✅

## New Quick Start

### Linux/macOS
```bash
cd server
bash setup.sh
npm run dev
```

### Windows
```bash
cd server
setup.bat
npm run dev
```

### GitHub Codespaces
```bash
cd server
bash setup.sh
npm run dev
```
Everything works automatically - Docker is pre-installed in Codespaces.

## What's New

### docker-compose.yml
- PostgreSQL 15 Alpine container
- Database: `opexsales`
- User: `opexsales_user`
- Port: `5432`
- Health check: `pg_isready` with 10s interval
- Persistent volume: `postgres_data`

**Start:** `docker compose up -d`
**Stop:** `docker compose down`

### Setup Scripts Enhanced
Both `setup.sh` and `setup.bat` now:
- ✅ Detect Node.js, npm/bun
- ✅ Auto-detect Docker & docker-compose
- ✅ Start PostgreSQL in Docker (or use local)
- ✅ Generate Prisma Client
- ✅ Run migrations (with fallback)
- ✅ Seed demo database
- ✅ Provide clear error messages
- ✅ Include documentation links

### package.json Updates
**New Scripts:**
```json
{
  "dev": "nest start --watch",
  "build": "nest build",
  "start": "node dist/main",
  "db:migrate": "prisma migrate dev",
  "db:migrate:deploy": "prisma migrate deploy",
  "db:seed": "prisma db seed",
  "db:studio": "prisma studio"
}
```

**Updated Dependencies:**
- `@nestjs/jwt`: `^10.2.0` (was `^12.1.0`)
- `@nestjs/config`: `^3.2.0` (added)
- `helmet`: `^7.1.0` (added)
- `compression`: `^1.7.4` (added)

## Verification

### Check Setup Worked
```bash
# Check Docker is running
docker ps

# Check database connection
docker compose exec postgres psql -U opexsales_user -d opexsales -c "SELECT 1"

# Check backend starts
npm run dev
# Expected: [Nest] ... NestJS v10.x.x started successfully on 0.0.0.0:3000
```

### Demo Credentials
- **Admin:** `admin@opexsales.com` / `password123`
- **Manager:** `manager@opexsales.com` / `password123`
- **Sales Rep:** `salesrep@opexsales.com` / `password123`

## Environment Variables

### Docker (Default - RECOMMENDED)
```env
DATABASE_URL=postgresql://opexsales_user:secure_password@localhost:5432/opexsales
NODE_ENV=development
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_change_me_in_production
JWT_EXPIRATION=900s
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key_change_me_in_production
REFRESH_TOKEN_EXPIRATION=7d
OPENAI_API_KEY=sk-your-key-here
```

### Local PostgreSQL (Fallback)
Just change DATABASE_URL to your local connection string in `.env`

## Architecture

### Database Service (Docker)
```
┌─────────────────────────────────────┐
│ NestJS Backend (port 3000)          │
│  - Prisma ORM                       │
│  - Auth: JWT + Refresh Tokens       │
│  - API: REST endpoints              │
└──────────┬──────────────────────────┘
           │ (connection string)
┌──────────▼──────────────────────────┐
│ PostgreSQL 15 Container (port 5432) │
│  - Database: opexsales              │
│  - User: opexsales_user             │
│  - Health check: pg_isready         │
└─────────────────────────────────────┘
```

## Troubleshooting

### Docker Issues
```bash
# View logs
docker compose logs -f postgres

# Restart containers
docker compose restart postgres

# Full cleanup (WARNING: deletes data)
docker compose down -v
docker compose up -d
```

### Database Connection Failed
```bash
# Check if port 5432 is in use
lsof -i :5432  # macOS/Linux
netstat -ano | findstr :5432  # Windows

# Check database credentials in .env
cat .env | grep DATABASE_URL
```

### Prisma Errors
```bash
# Regenerate Prisma Client
npx prisma generate

# View database schema
npx prisma studio

# Reset database (deletes all data)
npx prisma migrate reset
```

## Documentation

- **API Reference:** [API Documentation in README.md](./server/README.md)
- **Full Setup Guide:** [FULL_STACK_SETUP.md](./FULL_STACK_SETUP.md)
- **API Examples:** [API Client Examples](./src/examples/api-client-examples.ts)
- **Frontend Integration:** [Frontend Template](./src/lib/api.ts)

## Summary of Changes

| Issue | Status | File | Change |
|-------|--------|------|--------|
| @nestjs/jwt version | ✅ FIXED | package.json | ^12.1.0 → ^10.2.0 |
| @nestjs/cli missing | ✅ ADDED | package.json | Added to devDependencies |
| Docker PostgreSQL | ✅ ADDED | docker-compose.yml | NEW - PostgreSQL service |
| Codespaces support | ✅ FIXED | setup.sh, setup.bat | Added Docker detection & health checks |
| Environment config | ✅ UPDATED | .env.example | Docker-first configuration |

## Production Deployment

For production, consider:
- Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.) instead of Docker
- Set `NODE_ENV=production`
- Generate strong `JWT_SECRET` and `REFRESH_TOKEN_SECRET`
- Configure proper CORS and security headers (Helmet)
- Set `FRONTEND_URL` to production domain
- Create production Dockerfile for backend container

## Next Steps

1. **Run Setup:**
   ```bash
   cd server
   bash setup.sh  # or setup.bat on Windows
   ```

2. **Start Backend:**
   ```bash
   npm run dev
   ```

3. **Start Frontend:** (in another terminal)
   ```bash
   npm run dev
   ```

4. **Access Dashboard:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000
   - API Docs: http://localhost:3000/api (if Swagger configured)

---

**Last Updated:** 2024
**Status:** All setup issues RESOLVED ✨
