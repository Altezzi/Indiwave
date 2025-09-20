# IndiWave Deployment with Portainer & Cloudflare

## 🚀 Quick Deployment Guide

### Prerequisites
- Portainer installed and running
- Cloudflare account with a domain
- Docker image built and available

### Step 1: Prepare Environment Variables

1. Copy `env.production` to `.env.production` and fill in your values:
   ```bash
   cp .env.production .env.production.local
   ```

2. **Required Variables:**
   - `NEXTAUTH_URL`: Your domain (e.g., `https://indiwave.yourdomain.com`)
   - `NEXTAUTH_SECRET`: Generate a secure random string (32+ characters)

3. **Optional Variables:**
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: For Google OAuth login
   - `POSTGRES_PASSWORD`: If using PostgreSQL database

### Step 2: Deploy with Portainer

#### Option A: Using Portainer UI

1. **Access Portainer**
   - Open your Portainer web interface
   - Navigate to "Stacks" or "Containers"

2. **Create New Stack**
   - Click "Add stack"
   - Name: `indiwave`
   - Copy the contents of `docker-compose.prod.yml`

3. **Configure Environment**
   - Add environment variables from your `.env.production.local`
   - Ensure `NEXTAUTH_URL` points to your domain

4. **Deploy**
   - Click "Deploy the stack"
   - Wait for the container to start

#### Option B: Using Portainer CLI

```bash
# Build and push image (if using registry)
docker tag indiwave:latest your-registry/indiwave:latest
docker push your-registry/indiwave:latest

# Deploy via Portainer API
curl -X POST "https://your-portainer-url/api/stacks" \
  -H "X-API-Key: your-portainer-api-key" \
  -H "Content-Type: application/json" \
  -d @docker-compose.prod.yml
```

### Step 3: Configure Cloudflare

#### A. DNS Setup
1. **Add A Record**
   - Type: `A`
   - Name: `indiwave` (or your subdomain)
   - IPv4 address: Your server's public IP
   - Proxy status: ✅ Proxied (orange cloud)

2. **Add CNAME Record (if using www)**
   - Type: `CNAME`
   - Name: `www.indiwave`
   - Target: `indiwave.yourdomain.com`
   - Proxy status: ✅ Proxied

#### B. SSL/TLS Configuration
1. **SSL/TLS Settings**
   - Go to SSL/TLS → Overview
   - Set encryption mode to "Full (strict)"

2. **Page Rules (Optional)**
   - Create rule: `indiwave.yourdomain.com/*`
   - Settings: Always Use HTTPS ✅

#### C. Security Settings
1. **Firewall Rules**
   - Block countries if needed
   - Rate limiting for API endpoints

2. **Bot Fight Mode**
   - Enable to protect against bots

### Step 4: Verify Deployment

1. **Check Container Status**
   ```bash
   # In Portainer or via SSH
   docker ps | grep indiwave
   ```

2. **Test Health Check**
   ```bash
   curl https://indiwave.yourdomain.com/api/health
   ```

3. **Access Admin Panel**
   - Visit: `https://indiwave.yourdomain.com/admin`
   - Login: `admin@indiwave.com` / `admin123`

### Step 5: Post-Deployment Setup

#### A. Update Admin Credentials
1. Access admin panel
2. Go to user management
3. Change default admin password

#### B. Configure Database (if using PostgreSQL)
```bash
# Run migrations
docker exec indiwave-prod npx prisma migrate deploy
```

#### C. Import Sample Data (Optional)
```bash
# Run seed script
docker exec indiwave-prod npm run seed
```

## 🔧 Troubleshooting

### Common Issues:

**1. Container Won't Start**
- Check environment variables
- Verify port 3000 is available
- Check container logs in Portainer

**2. SSL Certificate Issues**
- Ensure Cloudflare proxy is enabled
- Check SSL/TLS mode is "Full (strict)"
- Verify domain DNS propagation

**3. Database Connection Issues**
- Check DATABASE_URL format
- Ensure database container is running
- Verify network connectivity

**4. NextAuth Issues**
- Verify NEXTAUTH_URL matches your domain exactly
- Check NEXTAUTH_SECRET is set
- Ensure HTTPS is properly configured

### Useful Commands:

```bash
# View container logs
docker logs indiwave-prod

# Restart container
docker restart indiwave-prod

# Update container
docker pull your-registry/indiwave:latest
docker-compose -f docker-compose.prod.yml up -d

# Backup database
docker exec indiwave-prod cp /app/data/prod.db /app/data/backup-$(date +%Y%m%d).db
```

## 📋 Production Checklist

- [ ] Environment variables configured
- [ ] Domain DNS configured in Cloudflare
- [ ] SSL certificate working
- [ ] Container running and healthy
- [ ] Admin panel accessible
- [ ] Database migrations completed
- [ ] Default admin password changed
- [ ] Backup strategy in place
- [ ] Monitoring configured (optional)

## 🔐 Security Recommendations

1. **Change Default Credentials**
   - Update admin password immediately
   - Use strong, unique passwords

2. **Environment Security**
   - Keep `.env.production.local` secure
   - Don't commit secrets to git

3. **Network Security**
   - Use Cloudflare's security features
   - Enable rate limiting
   - Consider IP whitelisting for admin

4. **Regular Updates**
   - Keep Docker images updated
   - Monitor for security updates
   - Regular backups

## 📞 Support

If you encounter issues:
1. Check Portainer container logs
2. Verify Cloudflare DNS settings
3. Test local deployment first
4. Check environment variables
5. Review this troubleshooting guide

Your IndiWave site should now be live at `https://indiwave.yourdomain.com`! 🎉
