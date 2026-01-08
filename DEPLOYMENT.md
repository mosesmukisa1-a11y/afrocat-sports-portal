# Deployment Guide

## Quick Start - Run This

### Phase 1: MVP (Google Apps Script)

1. Go to [script.google.com](https://script.google.com)
2. Create new project
3. Copy `phase1-appscript/Code.gs` and all HTML files
4. Update `ADMIN_EMAIL` in Code.gs
5. Run `setup()` function
6. Deploy as web app

**See:** [phase1-appscript/README_PHASE1.md](./phase1-appscript/README_PHASE1.md)

### Phase 2: API Backend

```bash
cd phase2-web/api
npm install
cp .env.example .env
# Edit .env with your database URL and secrets
npm run generate
npm run migrate
npm run seed
npm run dev
```

**See:** [phase2-web/api/README_PHASE2_API.md](./phase2-web/api/README_PHASE2_API.md)

### Phase 2: Admin Web UI

```bash
cd phase2-web/admin-web
npm install
cp .env.example .env.local
# Edit .env.local with API URL
npm run dev
```

**See:** [phase2-web/admin-web/README_PHASE2_ADMIN_WEB.md](./phase2-web/admin-web/README_PHASE2_ADMIN_WEB.md)

### Phase 3: Mobile App

```bash
cd phase3-mobile
npm install
# Configure API URL in src/lib/api.ts or .env
npm start
```

**See:** [phase3-mobile/README_PHASE3_MOBILE.md](./phase3-mobile/README_PHASE3_MOBILE.md)

## Production Deployment

### API (Railway/Render/Fly.io)

1. Connect GitHub repository
2. Set environment variables:
   - `DATABASE_URL`
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `CORS_ORIGIN`
3. Set build command: `npm install && npm run generate && npm run migrate`
4. Set start command: `npm start`

### Database (Neon/Supabase)

1. Create PostgreSQL database
2. Copy connection string
3. Update `DATABASE_URL` in API environment
4. Run migrations on first deploy

### Admin Web (Vercel)

1. Connect GitHub repository
2. Set environment variable:
   - `NEXT_PUBLIC_API_URL` (your API URL)
3. Deploy

### Mobile (Expo EAS)

1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Configure: `eas build:configure`
4. Build: `eas build --platform all`
5. Submit: `eas submit --platform ios/android`

## Migration from Phase 1 to Phase 2

1. Export TEAM_LIST sheet as CSV
2. Run migration tool:
   ```bash
   cd tools
   npm install
   node migrate_sheets_to_postgres.js team_list_export.csv
   ```

**See:** [tools/README_TOOLS.md](./tools/README_TOOLS.md)

## Environment Variables

### Phase 2 API

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_ACCESS_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens

Optional:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment
- `CORS_ORIGIN` - Allowed CORS origin

### Phase 2 Admin Web

- `NEXT_PUBLIC_API_URL` - API endpoint URL

### Phase 3 Mobile

- `EXPO_PUBLIC_API_URL` - API endpoint URL

## Security Checklist

- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Set proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Regularly rotate secrets
- [ ] Review audit logs regularly

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` format
- Check network/firewall settings
- Verify database is accessible

### API Not Starting

- Check environment variables
- Verify database connection
- Check port availability

### CORS Errors

- Verify `CORS_ORIGIN` matches frontend URL
- Check API CORS configuration

### OTP Not Working

- Development: Check console logs
- Production: Verify email service integration
- Check OTP expiration settings

