# Supabase Database Setup Guide

## Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Log in with GitHub
3. Click "New Project"
4. Name: `indiwave`
5. Set a strong database password (save it!)
6. Choose region closest to your users
7. Click "Create new project"

## Step 2: Get Connection String
1. In Supabase dashboard → Settings → Database
2. Copy the "URI" connection string
3. It looks like: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## Step 3: Add to Vercel Environment Variables
Go to your Vercel project → Settings → Environment Variables and add:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=4ED+X2iduBE7eAaRd3PhYY29P775XmfU6410zdIXw2U=
NODE_ENV=production
```

## Step 4: Run Database Migrations
After setting up the environment variables, run:
```bash
npx prisma migrate deploy
```

## Step 5: Remove Temporary Files
Once everything is working, remove the temporary `vercel.json` file.

## Benefits of Supabase:
- ✅ Free tier with generous limits
- ✅ Built-in authentication (can replace NextAuth if needed)
- ✅ Real-time subscriptions
- ✅ Built-in API
- ✅ Easy to scale
- ✅ Great developer experience
