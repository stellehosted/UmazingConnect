# 🚀 Vercel Deployment Guide - BPS Compass

## ✅ Why Vercel is Perfect for Your App

**Vercel is the BEST choice because:**
- ✅ Made by Next.js creators (perfect compatibility)
- ✅ **FREE** for your use case (up to 100GB bandwidth)
- ✅ Automatic HTTPS (fixes all mobile auth issues!)
- ✅ Global CDN (fast worldwide)
- ✅ Zero configuration needed
- ✅ Automatic deployments from Git
- ✅ Built-in analytics
- ✅ Easy environment variables
- ✅ Custom domains (free SSL)

**Cost:** $0/month for MVP (supports 500-2000 users easily)

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure you have:

- [ ] GitHub account (to store your code)
- [ ] Vercel account (free)
- [ ] Database ready (Supabase/Neon/Vercel Postgres)
- [ ] Azure AD app configured
- [ ] Environment variables ready

---

## 🎯 Step-by-Step Deployment

### Step 1: Push Code to GitHub (5 minutes)

1. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Name: `BPS Compass` or `school-social-app`
   - Make it **Private** (recommended for school projects)
   - Don't initialize with README (you already have code)
   - Click "Create repository"

2. **Initialize Git in your project** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - BPS Compass MVP"
   ```

3. **Connect to GitHub:**
   ```bash
   # Replace with your GitHub username and repo name
   git remote add origin https://github.com/YOUR_USERNAME/BPS Compass.git
   git branch -M main
   git push -u origin main
   ```

4. **Create .gitignore** (if you don't have one):
   ```
   # Add to .gitignore
   node_modules/
   .next/
   .env*.local
   .vercel
   ```

---

### Step 2: Set Up Database (10 minutes)

You need a PostgreSQL database. Choose one:

#### Option A: Vercel Postgres (Easiest)

1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database"
3. Select "Postgres"
4. Choose a name: `BPS Compass-db`
5. Select region (closest to your school)
6. Click "Create"
7. Copy the connection string

#### Option B: Supabase (Recommended - Free Forever)

1. Go to https://supabase.com
2. Sign up (free)
3. Click "New Project"
4. Fill in:
   - Name: `BPS Compass`
   - Database Password: (create a strong password)
   - Region: (closest to your school)
5. Wait for setup (~2 minutes)
6. Go to Settings → Database
7. Copy "Connection string" (URI format)
8. Replace `[YOUR-PASSWORD]` with your actual password

#### Option C: Neon (Serverless Postgres)

1. Go to https://neon.tech
2. Sign up (free)
3. Create new project: `BPS Compass`
4. Copy connection string

---

### Step 3: Run Database Migrations (5 minutes)

Connect to your database and run the schema:

```bash
# Replace with your actual database URL
$env:DATABASE_URL="your-database-connection-string"

# Run migrations
psql $env:DATABASE_URL -f database/schema.sql
```

**Or use a GUI tool:**
- Supabase: Use built-in SQL Editor
- TablePlus, pgAdmin, or DBeaver

---

### Step 4: Deploy to Vercel (5 minutes)

#### Method 1: Vercel Dashboard (Easiest)

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Click "Sign Up" (use GitHub to sign in)

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)

4. **Add Environment Variables:**
   Click "Environment Variables" and add:

   ```
   DATABASE_URL=your-database-connection-string
   NEXT_PUBLIC_AZURE_CLIENT_ID=your-azure-client-id
   NEXT_PUBLIC_AZURE_TENANT_ID=your-azure-tenant-id
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL like: `https://BPS Compass.vercel.app`

#### Method 2: Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? BPS Compass
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

### Step 5: Configure Custom Domain (Optional, 10 minutes)

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Click "Add"
   - Enter: `BPS Compass.berkeleyprep.org`

2. **In Your School's DNS:**
   - Add CNAME record:
     ```
     Type: CNAME
     Name: BPS Compass
     Value: cname.vercel-dns.com
     ```
   - Or A record (if root domain):
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     ```

3. **Wait for DNS propagation** (5-60 minutes)

4. **Vercel automatically provisions SSL certificate** ✅

---

### Step 6: Update Azure AD Redirect URIs (5 minutes)

1. **Go to Azure Portal:**
   - https://portal.azure.com
   - Azure Active Directory → App registrations
   - Your app

2. **Add Production URLs:**
   - Click "Authentication"
   - Add redirect URIs:
     ```
     https://BPS Compass.vercel.app
     https://BPS Compass.vercel.app/auth/callback
     ```
   - If using custom domain:
     ```
     https://BPS Compass.berkeleyprep.org
     https://BPS Compass.berkeleyprep.org/auth/callback
     ```

3. **Save**

---

### Step 7: Test Your Deployment (5 minutes)

1. **Visit your URL:**
   - `https://BPS Compass.vercel.app`
   - Or your custom domain

2. **Test Authentication:**
   - Click "Continue with Microsoft"
   - Sign in with school account
   - Should work perfectly! ✅

3. **Test Features:**
   - Browse clubs
   - Join a club
   - Create a post
   - Like a post

4. **Test on Mobile:**
   - Open on your phone
   - Everything should work (HTTPS!)
   - No crypto errors!

---

## 🔄 Automatic Deployments

**Every time you push to GitHub, Vercel automatically deploys!**

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push

# Vercel automatically:
# 1. Detects the push
# 2. Builds your app
# 3. Runs tests
# 4. Deploys to production
# 5. Sends you a notification
```

**Preview Deployments:**
- Every branch gets its own URL
- Test before merging to main
- Share with team for feedback

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Built-in)

1. Go to your project dashboard
2. Click "Analytics"
3. See:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Vercel Logs

1. Click "Deployments"
2. Click any deployment
3. Click "Functions" to see API logs
4. Debug errors in real-time

---

## 🔧 Environment Variables Management

### Add/Update Variables:

1. **Vercel Dashboard:**
   - Project → Settings → Environment Variables
   - Add new or edit existing
   - Choose environments: Production, Preview, Development

2. **Redeploy after changes:**
   - Go to Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"

### Important Variables:

```bash
# Required
DATABASE_URL=postgresql://...
NEXT_PUBLIC_AZURE_CLIENT_ID=...
NEXT_PUBLIC_AZURE_TENANT_ID=...

# Optional
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
NEXT_PUBLIC_DEMO_MODE=false
```

---

## 💰 Pricing & Limits

### Free Tier (Hobby)
- ✅ **Perfect for your school (500-2000 users)**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Analytics
- ✅ Serverless functions

### Pro Tier ($20/month)
- Only needed if you exceed:
  - 100GB bandwidth
  - 1TB serverless function execution
  - Need team collaboration features

**Recommendation:** Start with Free tier, upgrade only if needed

---

## 🚨 Troubleshooting

### Build Fails

**Check build logs:**
1. Vercel Dashboard → Deployments
2. Click failed deployment
3. Read error messages

**Common fixes:**
```bash
# Missing dependencies
npm install

# TypeScript errors
npm run build  # Test locally first

# Environment variables
# Make sure all required vars are set in Vercel
```

### Database Connection Issues

**Error: "Connection refused"**
- Check DATABASE_URL is correct
- Ensure database allows connections from Vercel IPs
- Supabase: Enable "Connection Pooling"

### Authentication Not Working

**Error: "Redirect URI mismatch"**
- Add production URL to Azure AD redirect URIs
- Make sure URL matches exactly (https, no trailing slash)

---

## 📱 Mobile Testing After Deployment

**Now that you have HTTPS, mobile works perfectly!**

1. Visit your production URL on phone
2. Authentication works! ✅
3. No crypto errors! ✅
4. Fast and responsive! ✅

---

## 🎓 For Your School Launch

### Soft Launch (Week 1)
```bash
# Deploy to Vercel
vercel --prod

# Share URL with beta testers
https://BPS Compass.vercel.app
```

### Full Launch (Week 2-4)
```bash
# Set up custom domain
BPS Compass.berkeleyprep.org

# Update Azure AD
# Add production redirect URIs

# Announce to school
# Email, posters, morning announcements
```

---

## 🔐 Security Checklist

Before going live:

- [ ] HTTPS enabled (automatic with Vercel ✅)
- [ ] Environment variables set (not in code)
- [ ] Azure AD redirect URIs configured
- [ ] Database has strong password
- [ ] Demo mode disabled in production
- [ ] Error logging enabled
- [ ] Backup strategy in place

---

## 📈 Scaling

**Your app can handle:**
- Free tier: 500-2000 users comfortably
- Pro tier: 5000-10000 users
- Enterprise: Unlimited

**If you grow beyond free tier:**
1. Upgrade to Pro ($20/month)
2. Consider database scaling (Supabase Pro)
3. Add caching (Redis)
4. Optimize images (Vercel Image Optimization)

---

## 🎉 Quick Start Commands

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/BPS Compass.git
git push -u origin main

# 2. Deploy to Vercel
npm install -g vercel
vercel login
vercel --prod

# 3. Done! 🚀
```

---

## 📞 Support Resources

### Vercel Documentation
- https://vercel.com/docs
- https://vercel.com/docs/frameworks/nextjs

### Community
- Vercel Discord: https://vercel.com/discord
- Next.js Discord: https://nextjs.org/discord

### Your Resources
- `DEPLOYMENT.md` - Full deployment guide
- `MVP-READINESS-REPORT.md` - Launch checklist
- `QUICK-START.md` - 30-minute setup

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Database created and migrated
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Custom domain configured (optional)
- [ ] Azure AD redirect URIs updated
- [ ] Tested authentication
- [ ] Tested on mobile
- [ ] Tested all features
- [ ] Monitoring enabled
- [ ] Ready to launch! 🚀

---

## 🎯 Summary

**Vercel is perfect for your app because:**
1. ✅ Zero configuration
2. ✅ Free for your needs
3. ✅ Automatic HTTPS
4. ✅ Fast deployment
5. ✅ Easy to manage
6. ✅ Scales automatically

**Total deployment time: ~30-45 minutes**

**Cost: $0/month for MVP**

**You're ready to launch! 🚀**
