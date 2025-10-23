# Quick Deploy Checklist - LaunchPage AI 🚀

## Before You Deploy

### ✅ Have These Ready:

1. **Vercel Account** → [vercel.com](https://vercel.com)
2. **Supabase Project** → [supabase.com](https://supabase.com)
3. **OpenAI API Key** → [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
4. **GitHub Account** → [github.com](https://github.com)

---

## 5-Minute Deploy Steps

### 1️⃣ **Setup Supabase** (2 minutes)

```sql
-- Run this SQL in Supabase SQL Editor:

CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pages_slug ON pages(slug);

CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  name TEXT,
  email TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_leads_page_slug ON leads(page_slug);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
```

**Get Your Keys** (Supabase Dashboard > Settings > API):
- ✅ Project URL
- ✅ anon public key
- ✅ service_role key

---

### 2️⃣ **Push to GitHub** (1 minute)

```bash
cd launchpage-ai
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/launchpage-ai.git
git push -u origin main
```

---

### 3️⃣ **Deploy to Vercel** (2 minutes)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Add environment variables:

```bash
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

4. Click "Deploy"
5. Wait 2-3 minutes
6. 🎉 **Done!**

---

## Your Live URLs

- **Homepage**: `https://your-project.vercel.app`
- **Leads Dashboard**: `https://your-project.vercel.app/leads`

---

## Test It Works

1. ✅ Visit homepage
2. ✅ Generate a landing page
3. ✅ Publish it
4. ✅ Submit an email
5. ✅ Check leads dashboard

---

## Need Help?

📖 See full guide: `VERCEL_DEPLOYMENT_GUIDE.md`

---

**That's it! You're live!** 🚀
