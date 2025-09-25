# Vercel Deployment Setup Guide

## Prerequisites
- Vercel account
- Your project already pushed to GitHub

## Step 1: Create Vercel Postgres Database

1. Go to your Vercel Dashboard
2. Navigate to your project
3. Go to the "Storage" tab
4. Click "Create Database"
5. Select "Postgres"
6. Choose a name (e.g., "indiwave-db")
7. Select a region close to your users
8. Click "Create"

## Step 2: Add Environment Variables

Go to your project Settings > Environment Variables and add:

### Required Variables:
```
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
NODE_ENV=production
```

### Optional Variables (if using Google OAuth):
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## Step 3: Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## Step 4: Deploy

1. Push your changes to GitHub
2. Vercel will automatically deploy
3. The build should now succeed!

## Step 5: Run Database Migrations

After deployment, you may need to run migrations:
1. Go to your Vercel project dashboard
2. Go to Functions tab
3. Create a new function to run migrations
4. Or use Vercel CLI: `vercel env pull` then `npx prisma migrate deploy`

## Troubleshooting

### If you get DATABASE_URL errors:
- Make sure the DATABASE_URL is correctly set in Vercel
- Check that the Postgres database is created and running
- Verify the connection string format

### If you get build errors:
- Check that all environment variables are set
- Make sure NEXTAUTH_URL matches your actual Vercel domain
- Verify NEXTAUTH_SECRET is set and secure

### If you get migration errors:
- Run `npx prisma migrate deploy` locally with production DATABASE_URL
- Or create a Vercel function to handle migrations
