# Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying Synaptic to production using Vercel (frontend) and Supabase Cloud (backend).

## 📋 Prerequisites

- GitHub account
- Vercel account
- Supabase account
- Domain name (optional)

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│     Vercel      │────▶│  Supabase Cloud  │────▶│    OpenAI      │
│   (Frontend)    │     │   (Backend)      │     │    (AI API)    │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │
        │                        │
        ▼                        ▼
   Vercel CDN              PostgreSQL +
                             pgvector
```

## 🛠️ Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - Organization: Your org name
   - Project name: `synaptic-prod`
   - Database Password: Generate strong password
   - Region: Choose closest to users
   - Pricing Plan: Free tier or Pro

### 1.2 Configure Database

1. Go to SQL Editor
2. Run migrations in order:
```sql
-- Run each migration file from database/migrations/
001_enable_extensions.sql
002_create_users_tables.sql
003_create_notes_tables.sql
004_create_ai_tables.sql
005_create_indexes.sql
```

3. Run seed data (optional):
```sql
-- Only for testing, skip for production
-- database/seeds/01_test_users.sql
-- database/seeds/02_sample_notes.sql
```

### 1.3 Configure Authentication

1. Go to Authentication → Providers
2. Enable Email Auth
3. Configure OAuth providers:
   - **Google OAuth**:
     - Client ID: `your-google-client-id`
     - Client Secret: `your-google-client-secret`
   - **GitHub OAuth**:
     - Client ID: `your-github-client-id`
     - Client Secret: `your-github-client-secret`

4. Set redirect URLs:
```
https://your-domain.com/auth/callback
http://localhost:3000/auth/callback (for development)
```

### 1.4 Configure Storage

1. Go to Storage
2. Create bucket: `captures`
3. Set policies:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload captures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'captures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own captures
CREATE POLICY "Users can view own captures"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'captures' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 1.5 Get API Keys

1. Go to Settings → API
2. Copy:
   - `Project URL`: Your Supabase URL
   - `anon public`: Your public key
   - `service_role`: Your service key (keep secret!)

## 🌐 Step 2: Vercel Deployment

### 2.1 Prepare Repository

1. Push code to GitHub:
```bash
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

2. Ensure `.gitignore` includes:
```
.env
.env.local
.env.production
node_modules/
.next/
```

### 2.2 Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `pnpm build`
   - Output Directory: `.next`

### 2.3 Environment Variables

Add these in Vercel dashboard:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Backend API (if separate)
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### 2.4 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Test deployment at provided URL

## 🔧 Step 3: Backend API Deployment

### Option A: Supabase Edge Functions (Recommended)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login:
```bash
supabase login
```

3. Link project:
```bash
supabase link --project-ref your-project-ref
```

4. Deploy functions:
```bash
supabase functions deploy process-note
supabase functions deploy search-semantic
```

### Option B: Separate Node.js API

Deploy to Railway/Render/Fly.io:

1. Create new project
2. Connect GitHub repo
3. Set environment variables:
```env
PORT=3001
SUPABASE_URL=your-url
SUPABASE_SERVICE_KEY=your-key
OPENAI_API_KEY=your-key
FRONTEND_URL=https://your-domain.com
```

4. Deploy

## 🌍 Step 4: Custom Domain

### 4.1 Configure in Vercel

1. Go to Project Settings → Domains
2. Add your domain: `your-domain.com`
3. Add DNS records as instructed

### 4.2 Update Environment Variables

Update in Vercel:
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 4.3 Update Supabase

1. Go to Authentication → URL Configuration
2. Update Site URL: `https://your-domain.com`
3. Update Redirect URLs

## 📊 Step 5: Monitoring Setup

### 5.1 Sentry (Error Tracking)

1. Create project at [sentry.io](https://sentry.io)
2. Get DSN
3. Add to environment:
```env
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### 5.2 Analytics

1. Create Google Analytics property
2. Add to environment:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🔒 Step 6: Security Checklist

- [ ] Enable RLS on all tables
- [ ] Set secure database password
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up DDoS protection (Cloudflare)
- [ ] Regular security audits
- [ ] Backup strategy configured

## 🚦 Step 7: Health Checks

### Frontend Health Check
```bash
curl https://your-domain.com/api/health
```

### Supabase Health Check
```bash
curl https://your-project.supabase.co/rest/v1/
```

## 📱 Step 8: Post-Deployment

### 8.1 Test Critical Paths

1. User Registration
2. Login (Email + OAuth)
3. Create Note
4. Quick Capture
5. Search
6. AI Processing

### 8.2 Performance Testing

```bash
# Load testing with k6
k6 run scripts/load-test.js
```

### 8.3 Monitor Logs

- Vercel: Function logs
- Supabase: Postgres logs
- Sentry: Error tracking

## 🔄 Continuous Deployment

### GitHub Actions Setup

`.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
      
      # Vercel automatically deploys on push
```

## 🆘 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node version (18+)
   - Verify environment variables
   - Check build logs

2. **Auth Not Working**
   - Verify redirect URLs
   - Check OAuth credentials
   - Confirm Site URL in Supabase

3. **Database Connection**
   - Check connection pooling
   - Verify RLS policies
   - Monitor query performance

### Rollback Procedure

1. Vercel: Use instant rollback feature
2. Database: Restore from backup
3. Re-deploy previous git tag

## 📈 Scaling Considerations

### When to Scale

- API response time > 500ms
- Database CPU > 80%
- Storage > 80% capacity
- Concurrent users > 1000

### Scaling Options

1. **Vercel**: Automatic scaling
2. **Supabase**: Upgrade to Pro/Team
3. **CDN**: Add Cloudflare
4. **Database**: Read replicas

## 🔗 Useful Links

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Production Checklist](https://nextjs.org/docs/going-to-production)