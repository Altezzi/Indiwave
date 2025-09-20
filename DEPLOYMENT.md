# Deployment Guide for IndiWave

## 🚀 Netlify Deployment

### Prerequisites
- GitHub repository with your IndiWave code
- Netlify account

### Step 1: Connect Repository
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Select your IndiWave repository

### Step 2: Build Settings
The following settings are already configured in `netlify.toml`:
- **Build command**: `npm install && npx prisma generate && npm run build`
- **Publish directory**: `.next`
- **Node version**: 20

### Step 3: Environment Variables
Set these in Netlify Dashboard > Site Settings > Environment Variables:

```env
# Database (use a PostgreSQL database for production)
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth.js
NEXTAUTH_URL="https://your-site-name.netlify.app"
NEXTAUTH_SECRET="your-production-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Step 4: Database Setup
For production, you'll need a PostgreSQL database:

**Recommended options:**
- **Supabase** (free tier available)
- **PlanetScale** (free tier available)
- **Railway** (free tier available)
- **Neon** (free tier available)

### Step 5: Deploy
1. Click "Deploy site"
2. Wait for build to complete
3. Your site will be available at `https://your-site-name.netlify.app`

## 🔧 Troubleshooting

### Common Issues:

**1. Build Fails with "Missing Package"**
- Ensure all dependencies are in `package.json`
- Check that Prisma is properly configured

**2. Database Connection Issues**
- Verify `DATABASE_URL` is set correctly
- Ensure database is accessible from Netlify

**3. NextAuth Issues**
- Check `NEXTAUTH_URL` matches your domain
- Verify `NEXTAUTH_SECRET` is set

**4. Prisma Client Issues**
- The build command includes `npx prisma generate`
- Ensure Prisma schema is committed to repository

## 📋 Production Checklist

- [ ] Environment variables set in Netlify
- [ ] PostgreSQL database configured
- [ ] `NEXTAUTH_URL` matches production domain
- [ ] `NEXTAUTH_SECRET` is a secure random string
- [ ] Database migrations run (if needed)
- [ ] Test admin dashboard access
- [ ] Verify all API endpoints work

## 🎯 Post-Deployment

1. **Test the site**: Visit your deployed URL
2. **Sign in as admin**: Use `admin@indiwave.com` / `admin123`
3. **Access admin dashboard**: Go to `/admin`
4. **Test user management**: Try changing user roles
5. **Check audit logs**: Verify actions are being logged

## 🔐 Security Notes

- Change default admin password in production
- Use strong `NEXTAUTH_SECRET`
- Enable HTTPS (automatic with Netlify)
- Consider rate limiting for API endpoints
- Regular database backups

## 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test locally with production settings
4. Check database connectivity

