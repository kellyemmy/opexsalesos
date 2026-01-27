# OpexSales Quick Reference

## Starting the Stack

### Backend
```bash
cd server
npm install
cp .env.example .env
bunx prisma migrate dev
bunx prisma db seed
npm run dev
```
Backend: `http://localhost:3000`

### Frontend
```bash
npm install
npm run dev
```
Frontend: `http://localhost:8080`

## Demo Credentials
```
Admin:     admin@opexsales.com / password123
Manager:   manager@opexsales.com / password123
Sales Rep: salesrep@opexsales.com / password123
```

## Key Endpoints

### Auth
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `GET /auth/me` - Get user

### Leads
- `GET /leads` - List leads
- `POST /leads` - Create lead
- `GET /leads/:id` - Get lead
- `PUT /leads/:id` - Update lead
- `DELETE /leads/:id` - Delete lead

### Campaigns
- `GET /campaigns` - List campaigns
- `POST /campaigns` - Create campaign
- `GET /campaigns/:id` - Get campaign
- `POST /campaigns/:id/leads/:leadId` - Add lead

### Messages
- `GET /messages/leads/:leadId` - Get conversation
- `POST /messages/leads/:leadId` - Send message
- `PUT /messages/:id/status` - Update status

### AI
- `POST /ai/write` - Generate email
- `POST /ai/sequence` - Generate sequence
- `POST /ai/summarize` - Summarize interactions
- `POST /ai/insights` - Get recommendations
- `POST /ai/compliance` - Check compliance

### Webhooks (Public)
- `POST /webhooks/sendgrid` - SendGrid events
- `POST /webhooks/twilio` - Twilio SMS events
- `POST /webhooks/mailgun` - Mailgun events

## Token Flow

1. **Login**: `POST /auth/login` → Get `accessToken`
2. **API Calls**: Add header: `Authorization: Bearer <accessToken>`
3. **Expired Token**: Auto-refresh via `POST /auth/refresh`
4. **Logout**: `POST /auth/logout`

## Frontend Integration

```typescript
import api from '@/lib/api';

// All requests auto-include JWT
const leads = await api.get('/leads');
const email = await api.post('/ai/write', { ... });
```

## Database Models

| Model | Purpose |
|-------|---------|
| User | Users with roles (ADMIN, MANAGER, SALES_REP) |
| Lead | Prospects/contacts with status |
| Campaign | Multi-lead email/SMS campaigns |
| Message | Sent messages with channel + status |
| Event | Webhook events (email opens, SMS delivery, etc.) |
| AuditLog | Action history for compliance |
| AIUsage | AI prompt/response logging with costs |

## Common Tasks

### Create Lead & Campaign
```typescript
const lead = await api.post('/leads', { email: 'x@y.com', name: 'John' });
const campaign = await api.post('/campaigns', { name: 'Q1' });
await api.post(`/campaigns/${campaign.id}/leads/${lead.id}`);
```

### Send AI-Generated Email
```typescript
const { response } = await api.post('/ai/write', {
  topic: 'SaaS demo',
  leadName: 'John',
  companyName: 'Acme'
});

await api.post(`/messages/leads/${leadId}`, {
  content: response,
  channel: 'EMAIL'
});
```

### Track Lead Activity
```typescript
const events = await api.get('/events', { params: { leadId } });
// Returns: EMAIL_OPENED, EMAIL_CLICKED, REPLY_RECEIVED, etc.
```

## Environment Variables

Backend (`.env`):
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
OPENAI_API_KEY=sk-...
FRONTEND_URL=http://localhost:8080
```

Frontend (`.env`):
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Debugging

**Backend logs:**
```bash
npm run dev  # See logs in terminal
```

**Frontend logs:**
```
F12 → Console → Check API calls, store updates
```

**Database GUI:**
```bash
bunx prisma studio  # Opens http://localhost:5555
```

## Testing with cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"salesrep@opexsales.com","password":"password123"}'

# Get leads (replace TOKEN with accessToken)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/leads

# Generate content
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topic":"SaaS","leadName":"John","companyName":"Acme","tone":"professional"}' \
  http://localhost:3000/api/ai/write
```

## File Locations

| Component | Files |
|-----------|-------|
| Frontend | `/src/pages/`, `/src/components/` |
| Backend | `/server/src/` |
| Database Schema | `/server/prisma/schema.prisma` |
| Auth | `/server/src/auth/` |
| API Examples | `/src/examples/api-client-examples.ts` |
| Setup Guide | `FULL_STACK_SETUP.md` |

## Common Issues

**CORS Error?**
- Backend CORS enabled for `http://localhost:8080`
- Check `VITE_API_BASE_URL` is `http://localhost:3000/api`

**Port in use?**
```bash
lsof -i :3000  # Backend
lsof -i :8080  # Frontend
```

**Database connection failed?**
- Verify PostgreSQL running: `psql -l`
- Check `DATABASE_URL` in `.env`

**Token expired?**
- Frontend auto-refreshes; if failing, re-login

## Production Checklist

- [ ] Set strong JWT secrets
- [ ] Configure real PostgreSQL (RDS, Render, etc.)
- [ ] Set OPENAI_API_KEY
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Enable rate limiting
- [ ] Configure webhook verification
- [ ] Set up email templates
- [ ] Create admin dashboard

## Resources

- NestJS: https://docs.nestjs.com
- Prisma: https://www.prisma.io/docs
- OpenAI: https://platform.openai.com/docs
- SendGrid Webhooks: https://docs.sendgrid.com/for-developers/tracking-events/event
- Twilio: https://www.twilio.com/docs
- Mailgun: https://documentation.mailgun.com

## Support

For detailed docs, see:
- `server/README.md` - Complete API reference
- `FULL_STACK_SETUP.md` - Setup guide
- `BACKEND_BUILD_SUMMARY.md` - What was built
- `.github/copilot-instructions.md` - Architecture guide

---

**Happy coding! 🚀**
