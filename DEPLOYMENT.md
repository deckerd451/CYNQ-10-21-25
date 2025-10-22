# Deployment Guide

## Deploy to Vercel (Recommended - Simplest)

This project is configured for one-click deployment to Vercel.

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `CYNQ-10-21-25` repository

### Step 2: Configure Environment Variables

Add these environment variables in the Vercel project settings:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

You can find these values in:
- Supabase: Project Settings → API
- OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Step 3: Deploy

Click **"Deploy"** - that's it!

Vercel will automatically:
- Build your Vite frontend
- Deploy your Express API as serverless functions
- Give you a live URL (e.g., `https://cynq-10-21-25.vercel.app`)

### Automatic Deployments

Every time you push to your GitHub repository, Vercel will automatically deploy the changes.

---

## What Gets Deployed

- **Frontend**: React/Vite application (built from `/src`)
- **Backend API**: Express server (from `/api/server.ts`)
- **Database**: Supabase (remote service, already configured)

---

## Testing Your Deployment

Once deployed, test your application:

1. Visit your Vercel URL
2. Sign up or log in
3. Try creating a new chat session
4. Verify API endpoints are working

---

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Review the build logs in Vercel dashboard

### API Errors
- Verify your Supabase credentials are correct
- Check that your OpenAI API key is valid and has credits

### Need Help?
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
