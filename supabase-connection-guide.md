# Supabase Connection Details Guide

## What You'll See in Supabase Dashboard

When you create a Supabase project, you'll see several connection details:

### 1. Project URL
- **What it is**: Your Supabase project's web interface URL
- **Format**: `https://[PROJECT-REF].supabase.co`
- **Used for**: Supabase dashboard, API calls
- **Example**: `https://abcdefghijklmnop.supabase.co`

### 2. API Key (anon/public)
- **What it is**: Public API key for client-side operations
- **Format**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Used for**: Frontend API calls, Supabase client
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2MjQwMCwiZXhwIjoyMDE0MzM4NDAwfQ.example`

### 3. Database Password
- **What it is**: Password you set when creating the project
- **Format**: The password you chose
- **Used for**: Database connection string
- **Example**: `your-secure-password-123`

## What We Need for Prisma: Connection String (URI)

For your `DATABASE_URL`, you need the **Connection String** (also called "URI"):

### How to Get It:
1. Go to your Supabase project dashboard
2. Click **Settings** (gear icon)
3. Click **Database** in the left sidebar
4. Scroll down to **"Connection string"** section
5. Copy the **"URI"** (not the other options)

### Format:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Example:
```
postgresql://postgres:mySecurePassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

## Where to Find Each Piece:

### In Supabase Dashboard → Settings → Database:
- **Host**: `db.[PROJECT-REF].supabase.co`
- **Database name**: `postgres`
- **Port**: `5432`
- **User**: `postgres`
- **Password**: The password you set when creating the project

### In Supabase Dashboard → Settings → API:
- **Project URL**: `https://[PROJECT-REF].supabase.co`
- **API Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## For Your Environment Variables:

### DATABASE_URL (for Prisma):
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### Optional: Supabase Client (if you want to use Supabase features later):
```
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Quick Summary:
- **For Prisma/NextAuth**: Use the **Connection String (URI)**
- **For Supabase API**: Use **Project URL** + **API Key**
- **For now**: You only need the **Connection String** for your DATABASE_URL
