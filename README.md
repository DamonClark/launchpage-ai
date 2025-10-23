# LaunchPage AI

A Next.js 14 application that generates conversion-ready landing pages from simple text descriptions using OpenAI's GPT-4o-mini. Built with TypeScript, TailwindCSS, Supabase, and Stripe integration.

## Features

- **AI-Powered Generation**: Create landing pages from a single text prompt
- **Multiple Conversion Goals**: Support for lead capture, direct payments, and booking flows
- **Live Preview**: See generated pages before publishing
- **One-Click Publishing**: Publish pages and get shareable URLs instantly
- **Lead Capture**: Built-in lead forms with Supabase storage
- **Payment Integration**: Stripe Checkout for direct sales
- **Booking Integration**: Calendly embed for appointment scheduling
- **Responsive Design**: Mobile-first, conversion-optimized layouts
- **SEO Ready**: Dynamic metadata and clean URLs

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **AI**: OpenAI GPT-4o-mini
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe Checkout
- **Deployment**: Vercel

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd launchpage-ai
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-publishable-key
STRIPE_SECRET_KEY=sk_live_your-secret-key

# Application Configuration
NEXTAUTH_URL=http://localhost:3000
SENDER_EMAIL=your-email@example.com
```

### 3. Database Setup

#### Option A: Supabase Cloud (Recommended)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the following schema:

```sql
-- Create pages table
CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL REFERENCES pages(slug),
  name TEXT,
  email TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_leads_page_slug ON leads(page_slug);
CREATE INDEX idx_leads_email ON leads(email);
```

#### Option B: Local Supabase (Development)

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Apply migrations
supabase db reset
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### POST `/api/generate-page`
Generates a landing page from a text prompt.

**Request:**
```json
{
  "prompt": "I sell a Notion course for busy freelancers — I want signups"
}
```

**Response:**
```json
{
  "title": "Notion Mastery Course",
  "headline": "Master Notion in 30 Days",
  "subheadline": "The complete course for busy freelancers who want to organize their business",
  "cta": "Get Started Free",
  "goalType": "lead",
  "sections": [
    {
      "title": "What You'll Learn",
      "content": "Build powerful databases, automate workflows, and create client-ready templates."
    }
  ],
  "metadata": {
    "theme": "simple",
    "imgPrompt": "notion productivity workspace"
  }
}
```

### POST `/api/publish-page`
Publishes a generated page and returns a shareable URL.

**Request:**
```json
{
  "pageJson": { /* Generated page data */ },
  "desiredSlug": "optional-custom-slug"
}
```

**Response:**
```json
{
  "slug": "master-notion-30-days-abc123",
  "url": "https://yourdomain.com/master-notion-30-days-abc123"
}
```

### POST `/api/lead`
Captures lead information from published pages.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "pageSlug": "master-notion-30-days-abc123"
}
```

### POST `/api/create-checkout-session`
Creates a Stripe Checkout session for payment pages.

**Request:**
```json
{
  "pageSlug": "premium-course-xyz789",
  "priceId": "price_1234567890"
}
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate-page/route.ts
│   │   ├── publish-page/route.ts
│   │   ├── lead/route.ts
│   │   └── create-checkout-session/route.ts
│   ├── [slug]/page.tsx          # Dynamic page routes
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css              # Global styles
├── components/
│   ├── GeneratedPage.tsx        # Main page renderer
│   ├── LeadForm.tsx            # Lead capture form
│   ├── PaymentBlock.tsx        # Stripe payment integration
│   └── BookingBlock.tsx       # Calendly booking integration
└── lib/
    ├── openai.ts               # OpenAI client and generation logic
    ├── supabase.ts             # Supabase client and database operations
    └── stripe.ts               # Stripe client and checkout sessions
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXTAUTH_URL` (your production domain)

## Usage Examples

### Lead Generation Page
```
Prompt: "I'm a freelance web designer targeting small businesses — I want email signups for my portfolio"
```

### Direct Sales Page
```
Prompt: "I sell premium coffee beans online — I want customers to buy directly from the landing page"
```

### Booking Page
```
Prompt: "I'm a life coach offering 1-on-1 sessions — I want people to book consultations"
```

## Customization

### Themes
The AI generates pages with three theme options:
- **Simple**: Professional, clean design (default)
- **Bold**: Creative, gradient-heavy design
- **Minimal**: Tech-focused, minimal design

### Adding Custom Components
Extend the `GeneratedPage` component to add:
- Custom sections
- Additional form fields
- Third-party integrations
- Analytics tracking

## Troubleshooting

### Common Issues

1. **OpenAI API Errors**: Check your API key and billing status
2. **Supabase Connection**: Verify your URL and keys
3. **Stripe Integration**: Ensure webhook endpoints are configured
4. **Build Errors**: Check TypeScript types and imports

### Development Tips

- Use `npm run build` to check for build errors
- Run `npm run lint` to check code quality
- Test API endpoints with tools like Postman or curl
- Check browser console for client-side errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check the troubleshooting section
- Open an issue on GitHub
- Review the API documentation

---

Built with ❤️ using Next.js, OpenAI, and Supabase.