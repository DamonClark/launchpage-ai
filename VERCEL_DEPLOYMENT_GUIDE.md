# Vercel Deployment Guide - LaunchPage AI 🚀

## Prerequisites

Before deploying, make sure you have:
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ Supabase project (sign up at [supabase.com](https://supabase.com))
- ✅ OpenAI API key (get from [platform.openai.com](https://platform.openai.com))
- ✅ Git repository (GitHub, GitLab, or Bitbucket)

---

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project name: `launchpage-ai`
4. Set database password (save it!)
5. Choose region closest to your users
6. Click "Create new project"

### 1.2 Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Paste the following SQL:

```sql
-- Create pages table
CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX idx_pages_slug ON pages(slug);

-- Create leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  name TEXT,
  email TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on page_slug for faster queries
CREATE INDEX idx_leads_page_slug ON leads(page_slug);

-- Create index on created_at for sorting
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
```

4. Click "Run" to execute
5. Verify tables created in **Table Editor**

### 1.3 Get Supabase Credentials

1. Go to **Project Settings** > **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) ⚠️ Keep this secret!

---

## Step 2: Get OpenAI API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "+ Create new secret key"
3. Name it: `launchpage-ai`
4. Copy the key (starts with `sk-...`)
5. ⚠️ Save it somewhere safe - you can't view it again!

---

## Step 3: Push Code to Git Repository

### 3.1 Initialize Git (if not already)

```bash
cd launchpage-ai
git init
git add .
git commit -m "Initial commit - LaunchPage AI"
```

### 3.2 Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name: `launchpage-ai`
4. Keep it **private** (recommended)
5. Don't initialize with README (already have one)
6. Click "Create repository"

### 3.3 Push Code

```bash
git remote add origin https://github.com/YOUR_USERNAME/launchpage-ai.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Vercel

### 4.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repo: `launchpage-ai`
4. Click "Import"

### 4.2 Configure Project

**Framework Preset**: Next.js (should auto-detect)
**Root Directory**: `./` (leave as is)
**Build Command**: `npm run build` (auto-filled)
**Output Directory**: `.next` (auto-filled)

### 4.3 Add Environment Variables

Click "Environment Variables" and add:

#### Required Variables:

```bash
# OpenAI
OPENAI_API_KEY=sk-...your-actual-key...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...
```

#### Optional (Stripe - if you add payment later):

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

⚠️ **Important**:
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Keep `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` private (no `NEXT_PUBLIC_` prefix)

### 4.4 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. 🎉 Your app is live!

---

## Step 5: Get Your Public URL

After deployment completes:

1. Vercel shows your live URL: `https://your-project-name.vercel.app`
2. Click the URL to visit your live site
3. You can add a custom domain later in Vercel settings

### Example URLs:

- **Homepage**: `https://your-project-name.vercel.app`
- **Leads Dashboard**: `https://your-project-name.vercel.app/leads`
- **Published Pages**: `https://your-project-name.vercel.app/[slug]`

---

## Step 6: Test Your Live Site

### 6.1 Generate a Landing Page

1. Visit your Vercel URL
2. Enter a prompt: "AI-powered social media scheduler for solopreneurs"
3. Click "✨ Generate Landing Page"
4. Wait 5-10 seconds for AI generation

### 6.2 Publish the Page

1. Scroll down to preview
2. Click "🚀 Publish This Page" button
3. Get redirected to your published page
4. Copy the URL (e.g., `https://your-project-name.vercel.app/ai-social-media-scheduler-abc123`)

### 6.3 Test Email Capture

1. Submit an email on your published page
2. See success message
3. Go to Leads Dashboard
4. Enter the page slug (e.g., `ai-social-media-scheduler-abc123`)
5. Click "View Leads"
6. See your test email!

---

## Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain

1. In Vercel dashboard, go to **Settings** > **Domains**
2. Click "Add"
3. Enter your domain: `launchpage.yourdomain.com`
4. Click "Add"

### 7.2 Configure DNS

Vercel will show DNS records to add. Two options:

**Option A: A Record** (Apex domain like `yourdomain.com`)
```
Type: A
Name: @
Value: 76.76.21.21
```

**Option B: CNAME** (Subdomain like `launchpage.yourdomain.com`)
```
Type: CNAME
Name: launchpage
Value: cname.vercel-dns.com
```

3. Add these records in your domain registrar (GoDaddy, Namecheap, etc.)
4. Wait 5-60 minutes for DNS propagation
5. Vercel will auto-configure SSL certificate

---

## Environment Variables Reference

### Complete List

```bash
# ============================================
# OpenAI Configuration
# ============================================
OPENAI_API_KEY=sk-...
# Get from: https://platform.openai.com/api-keys
# Used for: Generating landing page content with AI

# ============================================
# Supabase Configuration
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
# Get from: Supabase Dashboard > Settings > API > Project URL
# Used for: Connecting to Supabase database

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
# Get from: Supabase Dashboard > Settings > API > anon public
# Used for: Client-side Supabase operations (public, safe)

SUPABASE_SERVICE_ROLE_KEY=eyJ...
# Get from: Supabase Dashboard > Settings > API > service_role
# Used for: Server-side database operations (KEEP SECRET!)

# ============================================
# Stripe Configuration (Optional)
# ============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
# Get from: Stripe Dashboard > Developers > API Keys
# Used for: Client-side Stripe Checkout

STRIPE_SECRET_KEY=sk_live_...
# Get from: Stripe Dashboard > Developers > API Keys
# Used for: Server-side Stripe operations (KEEP SECRET!)
```

---

## Troubleshooting

### Build Fails

**Error**: `Cannot find module '@supabase/supabase-js'`
**Solution**: Ensure `package.json` includes all dependencies. Vercel auto-installs from `package.json`.

**Error**: `Environment variable not found`
**Solution**: Check environment variables in Vercel dashboard. Redeploy after adding.

### Runtime Errors

**Error**: `OpenAI is not configured`
**Solution**: Add `OPENAI_API_KEY` in Vercel environment variables, then redeploy.

**Error**: `Supabase is not configured`
**Solution**: Add all Supabase variables (URL, anon key, service role key), then redeploy.

**Error**: `Failed to generate page`
**Solution**: Check OpenAI API key is valid and has credits. Check Vercel logs for details.

### Database Issues

**Error**: `Leads not showing in dashboard`
**Solution**:
1. Check Supabase tables exist (run SQL from Step 1.2)
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
3. Check Supabase logs for errors

### Check Logs

1. Go to Vercel dashboard
2. Select your project
3. Click "Logs" tab
4. View real-time logs for debugging

---

## Post-Deployment Checklist

- ✅ Homepage loads correctly
- ✅ Can generate landing pages
- ✅ Can publish pages
- ✅ Published pages are accessible via URL
- ✅ Email capture works on published pages
- ✅ Leads appear in dashboard
- ✅ CSV export works
- ✅ All styling looks correct
- ✅ Mobile responsive
- ✅ No console errors

---

## Updating Your Deployment

### For Code Changes:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel auto-deploys on push! ✨

### For Environment Variable Changes:

1. Go to Vercel dashboard
2. Project Settings > Environment Variables
3. Update/add variables
4. Click "Redeploy" to apply changes

---

## Performance Optimization

### Enable Caching

Vercel automatically caches:
- ✅ Static pages (`/`, `/leads`)
- ✅ Static assets (CSS, JS, images)
- ✅ API routes (can configure)

### Monitor Performance

1. Vercel Dashboard > Analytics
2. View:
   - Page load times
   - API response times
   - Error rates
   - Visitor stats

---

## Security Best Practices

### ✅ Do's:
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Keep `OPENAI_API_KEY` secret
- Keep `STRIPE_SECRET_KEY` secret
- Use environment variables (never hard-code keys)
- Enable Supabase Row Level Security (RLS) if adding auth

### ❌ Don'ts:
- Don't commit `.env.local` to Git
- Don't expose service role keys to client
- Don't share your OpenAI API key
- Don't disable HTTPS

---

## Cost Estimation

### Free Tier Limits:

**Vercel**:
- 100 GB bandwidth/month
- 100 hours serverless function execution/month
- Unlimited deployments

**Supabase**:
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth/month

**OpenAI**:
- Pay-as-you-go
- GPT-4o-mini: ~$0.15 per 1M tokens
- ~$0.01 per landing page generation

### Expected Costs:

**Light usage** (10 pages/day): ~$3-5/month (mostly OpenAI)
**Medium usage** (100 pages/day): ~$30-50/month
**Heavy usage** (500+ pages/day): Upgrade Vercel & Supabase plans

---

## Support & Resources

### Documentation:
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **OpenAI**: [platform.openai.com/docs](https://platform.openai.com/docs)

### Community:
- Vercel Discord
- Supabase Discord
- Next.js GitHub Discussions

---

## 🎉 You're Live!

Your LaunchPage AI is now deployed and accessible worldwide!

**Share your URL**: `https://your-project-name.vercel.app`

**Next Steps**:
1. Generate a few test pages
2. Share with friends for feedback
3. Collect real leads
4. Add custom domain
5. Monitor usage and performance

**Happy Launching!** 🚀
