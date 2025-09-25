# Supabase Authentication Setup Guide

## Overview
Your app is configured to use NextAuth with Supabase as the database backend. This gives you the best of both worlds:
- Keep your existing NextAuth configuration
- Use Supabase's powerful PostgreSQL database
- Maintain your current auth flow

## Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project: "indiwave"
3. Save your database password

## Step 2: Get Database Connection String
1. Supabase dashboard → Settings → Database
2. Copy the "URI" connection string
3. Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## Step 3: Add Environment Variables to Vercel
In your Vercel project → Settings → Environment Variables:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=4ED+X2iduBE7eAaRd3PhYY29P775XmfU6410zdIXw2U=
NODE_ENV=production

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## Step 4: Run Database Migrations
After setting up the environment variables:

```bash
# Generate Prisma client
npx prisma generate

# Deploy migrations to Supabase
npx prisma migrate deploy
```

## Step 5: Test Authentication
1. Deploy your app to Vercel
2. Test Google OAuth sign-in
3. Test credentials sign-in
4. Verify user data is stored in Supabase

## What's Already Configured
✅ NextAuth with Prisma adapter
✅ Google OAuth provider
✅ Credentials provider
✅ User creation and role management
✅ Session handling
✅ Database schema for auth tables

## Benefits of This Setup
- **Familiar**: Keep your existing NextAuth code
- **Scalable**: Supabase handles database scaling
- **Secure**: Built-in security features
- **Real-time**: Can add real-time features later
- **Backup**: Automatic database backups

## Troubleshooting
- If auth fails, check DATABASE_URL is correct
- Verify NEXTAUTH_SECRET is set
- Check Google OAuth credentials are valid
- Ensure Prisma migrations ran successfully
