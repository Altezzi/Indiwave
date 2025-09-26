# Vercel Environment Variables for Indiwave

## Required Environment Variables

Set these in your Vercel dashboard under **Settings** → **Environment Variables**:

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://uvzlcfqbwwaqafzjeivx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2emxjZnFid3dhcWFmemplaXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjYwNjMsImV4cCI6MjA3NDQwMjA2M30.GklR3s5ITYSOGYdCoJrkBZn8ot24StBeLm3IFrtasyQ
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

### NextAuth Configuration
```
NEXTAUTH_URL=https://indiwave.vercel.app
NEXTAUTH_SECRET=4ED+X2iduBE7eAaRd3PhYY29P775XmfU6410zdIXw2U=
```

### Environment
```
NODE_ENV=production
```

### Google OAuth (Optional)
```
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## How to Set in Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Click on your **Indiwave project**
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add each variable above with its value
6. Make sure to set **Environment** to **Production** for all variables
7. Click **Save**

## Important Notes:

- Get your Supabase keys from your Supabase dashboard → Settings → API
- The NEXTAUTH_SECRET should be a secure random string (the one provided is already secure)
- Make sure all variables are set for **Production** environment
- After adding variables, redeploy your project

## How to Get Supabase Keys:

1. Go to your Supabase dashboard
2. Click on your project
3. Go to **Settings** → **API**
4. Copy the **anon public** key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy the **service_role** key for `SUPABASE_SERVICE_ROLE_KEY`
