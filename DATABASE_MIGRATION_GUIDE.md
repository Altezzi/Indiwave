# Database Migration Guide: SQLite → Supabase

## Prerequisites
- Supabase account
- Your existing Indiwave project

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
3. Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## Step 3: Set Up Environment Variables

### For Local Development:
1. Create `.env.local` file in your project root
2. Add your Supabase connection string:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXTAUTH_URL="http://localhost:3003"
NEXTAUTH_SECRET="4ED+X2iduBE7eAaRd3PhYY29P775XmfU6410zdIXw2U="
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
NODE_ENV="development"
```

### For Vercel Production:
1. Go to your Vercel project → Settings → Environment Variables
2. Add the same variables with production values:
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=4ED+X2iduBE7eAaRd3PhYY29P775XmfU6410zdIXw2U=
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NODE_ENV=production
```

## Step 4: Run Migration
1. Open terminal in your project directory
2. Run the migration script:
```bash
node migrate-to-supabase.js
```

## Step 5: Test Connection
1. Test the connection:
```bash
node test-supabase-connection.js
```

## Step 6: Deploy to Vercel
1. Push your changes to GitHub
2. Vercel will automatically deploy
3. Your app should now use Supabase!

## What Happens During Migration
- ✅ Creates all database tables in Supabase
- ✅ Sets up NextAuth tables (users, accounts, sessions)
- ✅ Creates your app tables (series, chapters, etc.)
- ✅ Preserves your existing auth configuration
- ✅ No data loss (tables are created fresh)

## Troubleshooting
- **Connection failed**: Check DATABASE_URL is correct
- **Migration failed**: Ensure Supabase project is created and running
- **Auth not working**: Verify NEXTAUTH_SECRET is set
- **Build fails**: Check all environment variables are set in Vercel

## Benefits After Migration
- 🚀 **Scalable**: Supabase handles database scaling
- 🔒 **Secure**: Built-in security and backups
- ⚡ **Fast**: Optimized PostgreSQL performance
- 🔄 **Real-time**: Can add real-time features later
- 📊 **Analytics**: Built-in database analytics
