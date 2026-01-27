# Full Stack Setup Guide - OpexSales

This guide covers setting up both the frontend (React) and backend (NestJS) for local development.

## Prerequisites

- Node.js 18+ (or Bun)
- PostgreSQL 13+ (local or Docker)
- OpenAI API key
- Git

## Part 1: Database Setup

### Option A: Local PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql@15  # macOS
sudo apt-get install postgresql postgresql-contrib  # Ubuntu/Linux

# Start PostgreSQL service
brew services start postgresql@15
# or
sudo service postgresql start

# Create database and user
psql postgres
CREATE DATABASE opexsales;
CREATE USER opexsales_user WITH PASSWORD 'secure_password';
ALTER ROLE opexsales_user WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE opexsales TO opexsales_user;
\q
```

### Option B: Docker PostgreSQL

```bash
# Run PostgreSQL in Docker
docker run --name opexsales-db \
  -e POSTGRES_DB=opexsales \
  -e POSTGRES_USER=opexsales_user \
  -e POSTGRES_PASSWORD=secure_password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

## Part 2: Backend Setup

```bash
# Navigate to server directory
cd /workspaces/opexsalesos/server

# Install dependencies
bun install
# or
npm install

# Create .env file
cat > .env << 'EOF'
NODE_ENV=development
PORT=3000

# Database (adjust password if different)
DATABASE_URL=postgresql://opexsales_user:secure_password@localhost:5432/opexsales

# JWT Tokens (use strong random values in production)
JWT_SECRET=your_super_secret_jwt_key_change_me_in_production
JWT_EXPIRATION=900s
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key_change_me_in_production
REFRESH_TOKEN_EXPIRATION=7d

# Frontend/Backend URLs
FRONTEND_URL=http://localhost:8080
BACKEND_URL=http://localhost:3000

# OpenAI (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Webhook Integrations (optional for local development)
SENDGRID_API_KEY=SG.your-key-here
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
MAILGUN_API_KEY=key-...

LOG_LEVEL=debug
EOF

# Initialize database
bunx prisma migrate dev --name init

# Seed database with demo data
bunx prisma db seed

# Start backend server
npm run dev
```

**Backend running on:** http://localhost:3000

### Demo Credentials (After Seeding)

```
Admin:     admin@opexsales.com / password123
Manager:   manager@opexsales.com / password123
Sales Rep: salesrep@opexsales.com / password123
```

## Part 3: Frontend Setup

```bash
# Navigate to frontend directory
cd /workspaces/opexsalesos

# Install dependencies (if not already done)
bun install
# or
npm install

# Create .env file
cat > .env << 'EOF'
VITE_API_BASE_URL=http://localhost:3000/api
EOF

# Start frontend dev server
npm run dev
```

**Frontend running on:** http://localhost:8080

## Part 4: Connect Frontend to Backend

The frontend is now configured to call your local backend. Test the connection:

1. Open http://localhost:8080 in your browser
2. Login with credentials above
3. Frontend will use `VITE_API_BASE_URL=http://localhost:3000/api` for all API calls

## Testing the Full Flow

### 1. Authentication Flow

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "salesrep@opexsales.com",
    "password": "password123"
  }'

# Response includes accessToken and sets refreshToken cookie
# Store accessToken for next requests
TOKEN="your_access_token_here"

# Get current user
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Refresh token
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Cookie: refreshToken=<your_refresh_token>" \
  -H "Content-Type: application/json"
```

### 2. Create and Manage Leads

```bash
TOKEN="your_access_token_here"

# List leads
curl -X GET http://localhost:3000/api/leads \
  -H "Authorization: Bearer $TOKEN"

# Create new lead
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prospect@company.com",
    "name": "Prospect Name",
    "company": "Company Name",
    "title": "Job Title",
    "phone": "+1-555-1234",
    "location": "City, State"
  }'

# Get specific lead
curl -X GET http://localhost:3000/api/leads/lead-id \
  -H "Authorization: Bearer $TOKEN"

# Update lead status
curl -X PUT http://localhost:3000/api/leads/lead-id \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "QUALIFIED"}'
```

### 3. Test AI Endpoints

```bash
TOKEN="your_access_token_here"

# Generate email copy
curl -X POST http://localhost:3000/api/ai/write \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Enterprise SaaS platform demo",
    "leadName": "John Smith",
    "companyName": "Acme Corp",
    "tone": "professional"
  }'

# Generate email sequence
curl -X POST http://localhost:3000/api/ai/sequence \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "leadName": "John Smith",
    "companyName": "Acme Corp",
    "productSummary": "B2B SaaS sales engagement platform",
    "numberOfEmails": 5
  }'

# Check content compliance
curl -X POST http://localhost:3000/api/ai/compliance \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your email content here",
    "jurisdiction": "US"
  }'
```

### 4. Monitor Database

```bash
# View data in Prisma Studio
cd server
bunx prisma studio

# Opens http://localhost:5555 with visual database editor
```

## Frontend Features

Once fully connected, you can:

1. **Dashboard**: View metrics, activity feed
2. **Leads**: CRUD operations, status tracking, scoring
3. **Campaigns**: Create multi-lead campaigns, track engagement
4. **Conversations**: Message history, channel support (email, SMS, etc.)
5. **Templates**: Pre-built email templates (currently static)
6. **Analytics**: Engagement metrics, conversion funnels
7. **AI Assistance**: Generate content, sequences, insights (via backend)
8. **Settings**: User preferences, profile management

## Debugging

### View Backend Logs

```bash
# Terminal 1 - Backend logs
cd server
npm run dev

# Look for:
# [Nest] 12345  - 01/15/2024, 2:30:45 PM     LOG [NestFactory] Nest application successfully started +123ms
# API requests logged with method, path, status code
```

### View Frontend Logs

```bash
# Browser DevTools (F12)
# Console shows:
# - API request/response cycles
# - Zustand store updates
# - React Query cache hits/misses
```

### Test Backend API Directly

```bash
# Install REST client
npm install -g rest-client

# Create requests.rest file
cat > requests.rest << 'EOF'
@baseUrl = http://localhost:3000/api
@token = your_access_token_here

### Login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "salesrep@opexsales.com",
  "password": "password123"
}

### Get Leads
GET {{baseUrl}}/leads
Authorization: Bearer {{token}}
EOF

# Run with VSCode REST Client extension
```

## Troubleshooting

### "Cannot find module" errors
```bash
# Ensure aliases are configured
# Frontend: tsconfig.json has @ -> src mapping
# Backend: tsconfig.json has @ -> src mapping
# Both configured in vite.config.ts and vite.config.ts
```

### CORS errors
```
Access to XMLHttpRequest blocked by CORS policy

Solution: 
- Backend has CORS enabled for http://localhost:8080
- Frontend env: VITE_API_BASE_URL=http://localhost:3000/api (not https)
- Cookies: credentials: 'include' set in Axios client
```

### Database connection error
```
Error: connect ECONNREFUSED 127.0.0.1:5432

Solution:
- Check PostgreSQL is running: psql -l
- Verify DATABASE_URL in server/.env
- Port 5432 not in use: lsof -i :5432
```

### Port already in use
```bash
# Frontend (8080)
lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Backend (3000)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or specify different port
VITE_PORT=3001 npm run dev  # Frontend
PORT=3001 npm run dev       # Backend
```

### Token expired
```
Error: 401 Unauthorized

Solution:
- Frontend auto-refreshes tokens via /auth/refresh
- If still failing, re-login to get new tokens
- Check JWT_SECRET matches between requests
```

## Next Steps

1. **Develop Features**: Add new leads, create campaigns, test AI endpoints
2. **Customize AI**: Modify prompts in `/server/src/ai/ai.service.ts`
3. **Connect Webhooks**: Configure SendGrid/Twilio in respective dashboards
4. **Set Permissions**: Adjust RBAC roles in `/server/src/auth/guards/role.guard.ts`
5. **Style Frontend**: Customize TailwindCSS in `tailwind.config.ts`

## Production Deployment

When ready for production:

1. **Backend Deployment** (Vercel, Railway, Heroku, AWS):
   - Ensure environment variables set
   - Run `prisma migrate deploy`
   - Build with `npm run build`
   - Start with `npm start`

2. **Frontend Deployment** (Vercel, Netlify, GitHub Pages):
   - Set `VITE_API_BASE_URL` to production backend URL
   - Build with `npm run build`
   - Deploy `dist/` directory

3. **Database** (AWS RDS, Render, Planet Scale):
   - Create managed PostgreSQL instance
   - Update `DATABASE_URL` 
   - Run migrations

## Support

- **Frontend Issues**: See [src/README.md](../README.md)
- **Backend Issues**: See [server/README.md](./server/README.md)
- **Database Issues**: See Prisma docs at https://www.prisma.io/docs

---

**Happy coding! 🚀**
