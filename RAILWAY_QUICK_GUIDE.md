# Quick Railway Deployment Reference

## Fixed Issues 

### Server Issues Fixed:
1. Created `migrate.js` script for automatic database initialization
2. Fixed CORS configuration (removed trailing slash)
3. Added environment variable support for dynamic client URL
4. Added `migrate` command to package.json

### Client Issues Fixed:
1. Confirmed proper build and start scripts
2. Created `.env.example` with proper `VITE_API_URL` format

## Quick Deploy Checklist

### Server Setup:
- [ ] Create PostgreSQL database on Railway
- [ ] Set Root Directory to `server`
- [ ] Add environment variables:
  - `NODE_ENV=production`
  - `CLIENT_URL=<your-client-url>`
- [ ] Run migration: `railway run npm run migrate`
- [ ] Seed database: `railway run npm run seed`

### Client Setup:
- [ ] Set Root Directory to `client`
- [ ] Set Build Command: `npm install && npm run build`
- [ ] Set Start Command: `npm start`
- [ ] Add environment variable:
  - `VITE_API_URL=<your-server-url>/api`

## Important URLs Structure:
- Server API: `https://your-server.up.railway.app/api`
- Client App: `https://your-client.up.railway.app`

## Test Deployment:
1. Open client URL
2. Login with demo account:
   - Email: `demo@demo.com`
   - Password: `password123`
3. Verify dashboard loads with properties

For detailed step-by-step instructions, see [RAILWAY_DEPLOYMENT_GUIDE.md](RAILWAY_DEPLOYMENT_GUIDE.md)
