# OpexSales Backend API

A production-ready NestJS backend server for the OpexSales engagement platform. Features JWT authentication, PostgreSQL/Prisma ORM, RBAC, webhook integration, and AI-powered content generation via OpenAI.

## Quick Start

### Prerequisites

- Node.js 18+ and Bun or npm
- PostgreSQL 13+
- OpenAI API key

### Installation

```bash
# Install dependencies
bun install
# or
npm install

# Copy environment template
cp .env.example .env

# Create/migrate database
bunx prisma migrate dev --name init

# Seed database with demo data
bunx prisma db seed

# Start development server
npm run dev
```

Server runs on `http://localhost:3000`

## Environment Variables

Create `.env` file:

```env
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/opexsales

# JWT Tokens
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRATION=900s
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
REFRESH_TOKEN_EXPIRATION=7d

# Frontend CORS
FRONTEND_URL=http://localhost:8080
BACKEND_URL=http://localhost:3000

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# Webhooks
SENDGRID_API_KEY=SG...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
MAILGUN_API_KEY=key-...

LOG_LEVEL=debug
```

## Project Structure

```
/server
├── src/
│   ├── app.module.ts          # Root module
│   ├── main.ts                # Bootstrap with middleware
│   ├── auth/                  # JWT authentication
│   │   ├── auth.service.ts    # Login, refresh, logout
│   │   ├── auth.controller.ts # Auth endpoints
│   │   ├── strategies/        # Passport JWT strategy
│   │   └── guards/            # JwtAuthGuard, RoleGuard
│   ├── leads/                 # Lead CRUD
│   ├── campaigns/             # Campaign management
│   ├── messages/              # Message/conversation tracking
│   ├── events/                # Event tracking (webhooks)
│   ├── webhooks/              # SendGrid, Twilio, Mailgun handlers
│   ├── ai/                    # OpenAI integration
│   ├── audit/                 # Action logging
│   └── prisma/                # Database service
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Demo data seeding
└── package.json
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with email/password |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout and clear refresh token |
| GET | `/auth/me` | Get current user (requires JWT) |

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "SALES_REP"
  },
  "accessToken": "eyJhbGc..."
}
```
*Refresh token set in httpOnly cookie*

### Leads (Protected Routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leads` | List all leads for user |
| GET | `/leads?status=QUALIFIED` | Filter by status |
| POST | `/leads` | Create new lead |
| GET | `/leads/:id` | Get lead details |
| PUT | `/leads/:id` | Update lead |
| DELETE | `/leads/:id` | Delete lead |

**Create Lead:**
```json
{
  "email": "john@acme.com",
  "name": "John Smith",
  "phone": "+1-555-0101",
  "company": "Acme Corp",
  "title": "Sales Director",
  "location": "San Francisco, CA",
  "source": "LinkedIn"
}
```

### Campaigns (Protected Routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/campaigns` | List campaigns |
| POST | `/campaigns` | Create campaign |
| GET | `/campaigns/:id` | Get campaign with leads |
| PUT | `/campaigns/:id` | Update campaign |
| DELETE | `/campaigns/:id` | Delete campaign |
| POST | `/campaigns/:id/leads/:leadId` | Add lead to campaign |
| DELETE | `/campaigns/:id/leads/:leadId` | Remove lead from campaign |

### Messages (Protected Routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/messages/leads/:leadId` | Get conversation for lead |
| POST | `/messages/leads/:leadId` | Send message to lead |
| GET | `/messages/campaigns/:campaignId` | Get all messages in campaign |
| PUT | `/messages/:id/status` | Update message status |

**Send Message:**
```json
{
  "content": "Hi John, interested in our solution?",
  "subject": "Regarding your sales process",
  "channel": "EMAIL",
  "campaignId": "campaign-123"
}
```

### Events (Protected Routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events?leadId=lead-123` | Get events for lead |
| GET | `/events/campaigns/:campaignId` | Get campaign events |
| POST | `/events` | Create event (webhook integration) |

**Event Types:**
- EMAIL_SENT, EMAIL_DELIVERED, EMAIL_OPENED, EMAIL_CLICKED, EMAIL_BOUNCED, EMAIL_UNSUBSCRIBED
- SMS_SENT, SMS_DELIVERED, SMS_FAILED
- CALL_MADE, CALL_ANSWERED, REPLY_RECEIVED
- FORM_SUBMITTED, WEBPAGE_VISITED

### AI Endpoints (Protected Routes)

All AI endpoints require `Authorization: Bearer <accessToken>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/write` | Generate email copy |
| POST | `/ai/sequence` | Generate multi-email sequence |
| POST | `/ai/summarize` | Summarize lead interactions |
| POST | `/ai/insights` | Get next-step recommendations |
| POST | `/ai/compliance` | Review content for compliance |

**Generate Email Copy:**
```bash
curl -X POST http://localhost:3000/api/ai/write \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "B2B SaaS platform demo",
    "leadName": "John Smith",
    "companyName": "Acme Corp",
    "tone": "professional"
  }'
```

**Response:**
```json
{
  "response": "Subject: Acme Corp - B2B SaaS Platform Demo Opportunity...",
  "tokens": 145,
  "cost": 0.0012
}
```

### Webhooks (Public - No Auth Required)

| Method | Endpoint | Provider |
|--------|----------|----------|
| POST | `/webhooks/sendgrid` | SendGrid email events |
| POST | `/webhooks/twilio` | Twilio SMS events |
| POST | `/webhooks/mailgun` | Mailgun email events |

**SendGrid Webhook Setup:**
```
POST http://your-domain.com/api/webhooks/sendgrid
```

**Twilio Webhook Setup:**
```
POST http://your-domain.com/api/webhooks/twilio
```

## Authentication Flow

### JWT Token Strategy

1. **Login**: User sends credentials → Server returns accessToken (JSON) + refreshToken (httpOnly cookie)
2. **API Calls**: Client sends `Authorization: Bearer <accessToken>` header
3. **Token Refresh**: When accessToken expires (900s), client POSTs to `/auth/refresh`
4. **Refresh Handler**: Server reads refreshToken from cookie, returns new accessToken
5. **Logout**: Client POSTs to `/auth/logout` → refreshToken cookie cleared

### Role-Based Access Control (RBAC)

Three roles available:
- **ADMIN**: Full system access, user management
- **MANAGER**: Can manage team leads and campaigns
- **SALES_REP**: Can only access their own leads/campaigns

Example protected route:
```typescript
@Post('settings')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('ADMIN', 'MANAGER')
updateSettings(@Body() dto: SettingsDto) {
  // Only admin and managers can access
}
```

## Database Schema

### User Model
- `id`: Unique identifier
- `email`: Unique email address
- `password`: Bcrypt hashed
- `role`: ADMIN | MANAGER | SALES_REP
- `avatar`: Profile image URL
- Relations: leads, campaigns, messages, auditLogs, aiUsage

### Lead Model
- `id`: Unique identifier
- `email`: Lead email (indexed for webhook matching)
- `name`, `phone`, `company`, `title`, `location`
- `status`: NEW | CONTACTED | QUALIFIED | NEGOTIATION | CLOSED_WON | CLOSED_LOST
- `score`: Lead scoring (0-100)
- Relations: campaigns, messages, events

### Campaign Model
- `id`: Unique identifier
- `name`, `description`, `template`, `status`
- `recipients`: Total lead count
- Relations: campaignLeads, messages, events

### Message Model
- `id`, `content`, `subject`
- `channel`: EMAIL | SMS | LINKEDIN | PHONE | WHATSAPP
- `status`: PENDING | SENT | DELIVERED | OPENED | CLICKED | REPLIED | BOUNCED | FAILED
- `externalId`: For webhook tracking
- `sentAt`, `openedAt`, `clickedAt`: Timestamps

### Event Model
- `type`: EventType enum (EMAIL_OPENED, SMS_SENT, etc.)
- `source`: "sendgrid", "twilio", "mailgun"
- `externalId`: For provider tracking
- `metadata`: JSON data from webhooks

### AuditLog Model
- `action`: Action type (CREATE_LEAD, UPDATE_CAMPAIGN, etc.)
- `resource`: Resource type
- `resourceId`: ID of affected resource
- `description`: Human-readable description
- `changes`: JSON of what changed

### AIUsage Model
- `action`: AI action type (write, sequence, summarize, insights, compliance)
- `prompt`: User input sent to OpenAI
- `response`: Full response from OpenAI
- `tokens`: Total tokens used
- `cost`: Estimated cost ($)

## Development

### Run Development Server

```bash
npm run dev
```

Server includes:
- Hot reload on file changes
- Debug logging
- Global exception handling
- Request/response logging

### Database Migrations

```bash
# Generate new migration
bunx prisma migrate dev --name migration_name

# Check schema
bunx prisma db push

# View database GUI
bunx prisma studio
```

### Running Tests

```bash
npm run test
npm run test:watch
npm run test:cov
```

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Database Migrations (Production)

```bash
bunx prisma migrate deploy
bunx prisma db seed --skip-generate
```

### Environment for Production

```env
NODE_ENV=production
DATABASE_URL=postgresql://prod_user:prod_pass@prod_host/opexsales
JWT_SECRET=<strong-random-key>
REFRESH_TOKEN_SECRET=<strong-random-key>
FRONTEND_URL=https://opexsales.com
BACKEND_URL=https://api.opexsales.com
OPENAI_API_KEY=sk-...
LOG_LEVEL=warn
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Common Tasks

### Add New Lead from Frontend

```typescript
// Frontend code
const { data } = await api.post('/leads', {
  email: 'john@acme.com',
  name: 'John Smith',
  company: 'Acme Corp',
  title: 'CTO'
});
```

### Create Campaign and Add Leads

```typescript
// Create campaign
const campaign = await api.post('/campaigns', {
  name: 'Q1 Outreach',
  description: 'Enterprise push'
});

// Add leads
await api.post(`/campaigns/${campaign.id}/leads/${lead1.id}`);
await api.post(`/campaigns/${campaign.id}/leads/${lead2.id}`);
```

### Generate AI Content

```typescript
const { response, tokens, cost } = await api.post('/ai/write', {
  topic: 'B2B SaaS platform',
  leadName: 'John',
  companyName: 'Acme',
  tone: 'professional'
});
```

### Handle Webhook from SendGrid

SendGrid will POST to `/webhooks/sendgrid` automatically. Backend:
1. Parses event (sent, delivered, opened, clicked, bounced)
2. Finds lead by recipient email
3. Creates Event record
4. Updates Message status if opened/clicked

No manual setup needed on backend; configure webhook URL in SendGrid dashboard.

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

### Database Connection Error
- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Check username/password/host

### JWT Errors
- Verify `JWT_SECRET` matches between login/refresh
- Check token expiration (default 900s)
- Ensure `Authorization: Bearer` header format

### OpenAI API Errors
- Verify `OPENAI_API_KEY` is valid
- Check API key has appropriate permissions
- Monitor token usage in OpenAI dashboard

## Performance Optimization

- **Database indexing**: Indexes on userId, status, createdAt for fast queries
- **Query caching**: TanStack Query on frontend caches lead/campaign lists
- **Pagination**: Implement cursor-based pagination for large datasets
- **Rate limiting**: Add helmet + express-rate-limit for API protection
- **Compression**: Enable gzip compression with compression middleware

## Security Best Practices

✅ Implemented:
- JWT with short-lived access tokens (900s)
- Refresh tokens in httpOnly cookies (7d)
- RBAC with role-based guards
- Bcrypt password hashing
- CORS with credentials support
- Audit logging of all mutations

🔄 Recommended (Future):
- Add request rate limiting (express-rate-limit)
- Implement refresh token rotation
- Add CSRF protection
- Use API keys for webhook verification
- Enable HTTPS in production
- Add IP whitelisting for webhooks

## Support & Documentation

- **NestJS Docs**: https://docs.nestjs.com
- **Prisma Docs**: https://www.prisma.io/docs
- **OpenAI API**: https://platform.openai.com/docs
- **SendGrid Webhooks**: https://docs.sendgrid.com/for-developers/tracking-events/event
