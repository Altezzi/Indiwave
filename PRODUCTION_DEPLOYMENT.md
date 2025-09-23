# Production Database Deployment Guide

## 🗄️ **Production Database Setup**

Your Indiwave site now uses a **database-first architecture** with PostgreSQL for production!

## 🚀 **Deployment Steps**

### Step 1: Update Portainer Stack

1. **Open your Portainer dashboard**
2. **Go to "Stacks"** → Find your indiwave stack
3. **Click "Editor"** to edit the stack
4. **Replace the stack content** with the new production configuration:

```yaml
version: '3.8'

services:
  db:
    image: postgres:16
    container_name: indiwave-postgres
    environment:
      POSTGRES_DB: indiwave
      POSTGRES_USER: indiwave_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - indiwave_pg_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U indiwave_user -d indiwave"]
      interval: 5s
      timeout: 5s
      retries: 10
    restart: unless-stopped

  app:
    build: .
    container_name: indiwave-app
    environment:
      NODE_ENV: production
      DATABASE_PROVIDER: postgresql
      DATABASE_URL: postgresql://indiwave_user:${POSTGRES_PASSWORD}@db:5432/indiwave?schema=public
      NEXTAUTH_URL: https://indiwave.io
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "3000:3000"
    volumes:
      - indiwave_data:/app/data
      - indiwave_public:/app/public
    command: sh -c "npx prisma migrate deploy && npm run import:series && npm run build && npm start"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  indiwave_pg_data:
    driver: local
  indiwave_data:
    driver: local
  indiwave_public:
    driver: local
```

### Step 2: Set Environment Variables

In Portainer, set these environment variables:

**Required:**
- `POSTGRES_PASSWORD` - A secure password for your database
- `NEXTAUTH_SECRET` - A secure secret key (generate with `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret

**Example values:**
```
POSTGRES_PASSWORD=your-super-secure-password-123
NEXTAUTH_SECRET=your-generated-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Step 3: Deploy

1. **Click "Update the stack"**
2. **Wait for deployment** (5-10 minutes)
3. **Check container logs** to ensure both services start successfully

## 🔍 **What Happens During Deployment**

1. **PostgreSQL starts** and creates the database
2. **App container builds** with the latest code
3. **Database migrations run** (`npx prisma migrate deploy`)
4. **Series are imported** from your series folder (`npm run import:series`)
5. **App builds and starts** (`npm run build && npm start`)

## ✅ **Verification**

After deployment, check:

1. **Database connection**: Visit `https://indiwave.io/api/health`
2. **Manga loading**: Visit `https://indiwave.io` - should show all 67 manga
3. **Admin panel**: Visit `https://indiwave.io/admin` - should work normally

## 🗄️ **Database Benefits**

- **PostgreSQL**: Much faster and more reliable than SQLite
- **Persistent data**: Your manga data survives container restarts
- **Scalable**: Can handle thousands of manga and users
- **Backup ready**: Easy to backup with `pg_dump`

## 🔧 **Troubleshooting**

### If deployment fails:
1. **Check container logs** in Portainer
2. **Verify environment variables** are set correctly
3. **Check database connection** - ensure PostgreSQL is running
4. **Check disk space** - ensure you have enough storage

### If manga don't load:
1. **Check import logs** - look for import errors
2. **Verify series folder** is mounted correctly
3. **Check database tables** - ensure data was imported

## 📊 **Performance Improvements**

- **Faster loading**: Database queries are much faster than filesystem reads
- **Better caching**: Database can be cached more effectively
- **Concurrent access**: Multiple users can access simultaneously
- **Search functionality**: Database enables fast search across all manga

---

**Your production database is ready!** 🎉

This setup will give you a much more robust and scalable manga site.
