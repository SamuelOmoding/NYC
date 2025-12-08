# How to Fix the Migration Error

## The Problem

You're seeing this error:
```
❌ Migration failed: getaddrinfo ENOTFOUND postgres.railway.internal
```

This happens because `railway run` from your local machine can't access Railway's **private network**. The database hostname `postgres.railway.internal` only works inside Railway's infrastructure.

## The Solution

You have **3 options** to run the migration:

---

## Option 1: Auto-Run on Deployment (EASIEST) 

I just created `railway.json` in your server folder. This will automatically run migrations every time you deploy.

### Steps:
1. **Commit and push the changes:**
   ```bash
   cd ~/nyc-housing_/nyc-housing
   git add .
   git commit -m "Add railway.json for auto-migrations"
   git push
   ```

2. **Redeploy in Railway:**
   - Go to Railway dashboard → Your server service
   - Click "Deploy" or wait for auto-deploy
   - The migration will run automatically on startup!

3. **Check logs:**
   - Go to Deployments → View Logs
   - You should see " Database migration completed successfully!"

---

## Option 2: Use Railway Dashboard (ONE-TIME)

If you just need to run it once without auto-running on every deploy:

### Steps:
1. **Go to Railway dashboard**
2. **Select your server service**
3. **Go to "Deployments" tab**
4. **Click on the latest deployment**
5. **In the deployment view, look for "Run Command" or similar**
   - Or go to Settings → Deploy → "Custom Start Command"
6. **Run this command in Railway's console:**
   ```bash
   npm run migrate && npm run seed
   ```

---

## Option 3: Trigger from Code (GitHub Action)

Add a deploy command in Railway settings:

### Steps:
1. **Go to Railway → Your server service → Settings**
2. **Find "Deploy" section**
3. **Set "Custom Start Command" to:**
   ```bash
   npm run migrate && npm run seed && npm start
   ```
4. **Save and redeploy**

---

## Recommended Approach

**Use Option 1** (railway.json file I just created). Here's why:
- ✅ Runs automatically on every deploy
- ✅ Ensures database is always up-to-date
- ✅ No manual steps needed
- ✅ Idempotent (safe to run multiple times due to `CREATE TABLE IF NOT EXISTS`)

---

## Quick Commands

First, exit the Railway bash session:
```bash
exit  # Exit the railway run bash session
```

Then commit and push:
```bash
cd ~/nyc-housing_/nyc-housing
git add server/railway.json server/migrate.js server/.env.example server/package.json server/server.js client/.env.example RAILWAY_QUICK_GUIDE.md
git commit -m "Add Railway deployment fixes and auto-migration"
git push origin main  # or your branch name
```

Railway will auto-deploy and run the migration! 🚀

---

## Verify It Worked

After deployment:
1. Go to Railway → Server service → Logs
2. Look for these messages:
   ```
   Starting database migration...
   ✅ Database migration completed successfully!
   Database has X properties.
   Server running on http://...
   ```

If you see "Database is empty", then also run the seed:
- The `railway.json` already includes seed command ✅

---

## Why `railway run` Didn't Work

- `railway run` executes commands on **your local machine** with Railway environment variables
- But the `DATABASE_URL` contains `postgres.railway.internal` which is only accessible **inside** Railway's network
- You need to run commands **in Railway's infrastructure**, not locally

---

## Next Steps

1. Exit the bash session
2. Commit and push the changes (commands above)
3. Wait for Railway to redeploy
4. Check the logs to confirm migration succeeded
5. Test your client app!
