# Vercel Deployment Guide - Forge & Steel E-commerce

## 📋 Prerequisites Checklist

- [ ] GitHub account
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] PostgreSQL database (options below)
- [ ] All services configured (Cloudinary, Resend, Google OAuth)

---

## Step 1: Choose & Setup PostgreSQL Database

### Option A: Neon (Recommended - Free Tier Available)

1. Go to https://neon.tech
2. Sign up/login
3. Create new project: "forge-steel-production"
4. Select region closest to your users
5. Copy the connection string (will look like: `postgresql://user:pass@ep-xxx.region.neon.tech/dbname?sslmode=require`)

### Option B: Supabase (Free Tier Available)

1. Go to https://supabase.com
2. Create new project
3. Go to Settings > Database
4. Copy the "Connection string" (Transaction mode)

### Option C: Vercel Postgres (Paid - $24/month)

1. In Vercel dashboard > Storage > Create Database
2. Choose Postgres
3. Connection string will be auto-added to your project

---

## Step 2: Prepare Your Code

### 2.1 Update package.json build script

Your `package.json` already has the correct scripts:
```json
"build": "next build"
```

### 2.2 Verify Prisma setup

Make sure `prisma/schema.prisma` includes:
```prisma
generator client {
  provider = "prisma-client-js"
}
```

---

## Step 3: Install Vercel CLI

Open your terminal and run:

```bash
npm install -g vercel
```

Then login:

```bash
vercel login
```

(This will open a browser to authenticate)

---

## Step 4: Deploy to Vercel (Two Methods)

### Method A: Via GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin master-single-lang
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository: `danielbugi/e-com-plat`
   - Select the branch: `master-single-lang`
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables:**
   Click "Environment Variables" and add each one:

   **Required Variables:**
   ```
   DATABASE_URL = postgresql://your-neon-or-supabase-connection-string
   NEXTAUTH_SECRET = (generate new: openssl rand -base64 32)
   NEXTAUTH_URL = https://your-project.vercel.app
   AUTH_TRUST_HOST = true
   ```

   **Optional but Recommended:**
   ```
   GOOGLE_CLIENT_ID = (from Google Cloud Console)
   GOOGLE_CLIENT_SECRET = (from Google Cloud Console)
   RESEND_API_KEY = re_ZHVhexF6_7WxRK2VqfZzS3unWEYK3y9eQ
   NEXT_PUBLIC_URL = https://your-project.vercel.app
   ADMIN_EMAIL = dabogatesting@gmail.com
   FROM_EMAIL = onboarding@resend.dev
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = diergd8rm
   CLOUDINARY_API_KEY = 279517452928368
   CLOUDINARY_API_SECRET = z8xHYbWCnURy4OdRO3mudyhTStY
   PAYMENT_SECRET_KEY = (your payment provider)
   PAYMENT_PUBLISHABLE_KEY = (your payment provider)
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at: `https://your-project.vercel.app`

### Method B: Via CLI (Alternative)

```bash
# From your project directory
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? forge-steel-ecommerce
# - Directory? ./
# - Override settings? No

# After successful deployment, set environment variables:
vercel env add DATABASE_URL
# Paste your database URL when prompted

# Repeat for all environment variables...

# Redeploy with environment variables:
vercel --prod
```

---

## Step 5: Run Database Migrations

After your first deployment, you need to set up the database schema:

### Via Vercel CLI:

```bash
# Install dependencies
npm install

# Set DATABASE_URL to your production database
export DATABASE_URL="your-neon-or-supabase-connection-string"

# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
npm run seed
npm run create-admin
```

### Or via Prisma Studio:

```bash
# Connect to production database
npx prisma studio
```

---

## Step 6: Configure Google OAuth (If Using)

1. Go to: https://console.cloud.google.com
2. Select your project or create new one
3. Go to "APIs & Services" > "Credentials"
4. Edit your OAuth 2.0 Client
5. Add authorized redirect URIs:
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```
6. Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Vercel

---

## Step 7: Test Your Deployment

1. **Visit your site:** `https://your-project.vercel.app`
2. **Test key features:**
   - [ ] Homepage loads
   - [ ] Product pages work
   - [ ] Shopping cart functions
   - [ ] User login/registration
   - [ ] Admin dashboard (if auth enabled)
   - [ ] Checkout flow
   - [ ] Image uploads (Cloudinary)

3. **Check Vercel logs:**
   - Go to: https://vercel.com/dashboard
   - Select your project
   - Click "Deployments" > Latest deployment > "Functions"
   - Review any errors

---

## Step 8: Set Up Custom Domain (Optional)

1. In Vercel dashboard > Settings > Domains
2. Add your domain (e.g., `forgensteel.com`)
3. Update DNS records as instructed by Vercel
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_URL` to your custom domain
5. Update Google OAuth redirect URIs

---

## 🔧 Troubleshooting

### Build Fails

**Error:** "Cannot find module '@prisma/client'"
```bash
# Solution: Prisma generates during build
# Check vercel.json has: "buildCommand": "prisma generate && next build"
```

**Error:** "DATABASE_URL is not defined"
```bash
# Solution: Add DATABASE_URL to Vercel environment variables
# Make sure to add it to "Production" environment
```

### Runtime Errors

**Error:** "PrismaClientInitializationError"
```
# Check DATABASE_URL format includes ?sslmode=require for Neon/Supabase
# Verify database allows connections from 0.0.0.0/0
```

**Error:** "Session callback error"
```
# Regenerate NEXTAUTH_SECRET
openssl rand -base64 32
```

### Database Connection Issues

1. **Verify connection string format:**
   ```
   postgresql://user:password@host:5432/dbname?sslmode=require
   ```

2. **Check database allows external connections**

3. **Test connection locally:**
   ```bash
   npx prisma db push --skip-generate
   ```

---

## 📊 Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Admin user created
- [ ] Sample products seeded (optional)
- [ ] All environment variables set
- [ ] Google OAuth working (if enabled)
- [ ] Email sending working
- [ ] Image uploads working
- [ ] Payment testing completed
- [ ] Custom domain configured (if applicable)
- [ ] Analytics added (Vercel Analytics)

---

## 🚀 Continuous Deployment

Once connected via GitHub:

1. **Any push to your branch automatically deploys:**
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```

2. **Vercel automatically:**
   - Builds your app
   - Runs tests
   - Deploys to preview URL
   - Deploys to production (if on main branch)

3. **Preview deployments:**
   - Every pull request gets a unique URL
   - Test changes before merging

---

## 💰 Expected Costs

- **Vercel Pro:** $20/month (recommended for production)
  - Includes: 100GB bandwidth, analytics, teams
- **Database (Neon/Supabase):** Free tier available, ~$10-20/month for production
- **Total estimated:** $20-40/month for small e-commerce site

---

## 📝 Quick Reference Commands

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Set environment variable
vercel env add VARIABLE_NAME

# Pull environment variables locally
vercel env pull .env.local

# View project info
vercel inspect
```

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Neon Docs: https://neon.tech/docs
- GitHub Issues: Create issue in your repository

---

**Ready to deploy? Start with Step 1! 🎉**
