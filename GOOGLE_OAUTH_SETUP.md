# Google OAuth Setup Guide

## 🔧 **Setting Up Google OAuth for Indiwave**

To enable Google sign-in functionality, you need to set up Google OAuth credentials.

### **Step 1: Create Google OAuth Application**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project (or select existing)**
   - Click "Select a project" → "New Project"
   - Name: "Indiwave" (or your preferred name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google OAuth2 API"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Indiwave Web Client"

5. **Configure Authorized URLs**
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (for local development)
     - `https://your-site-name.netlify.app` (for production)
   
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google` (for local development)
     - `https://your-site-name.netlify.app/api/auth/callback/google` (for production)

6. **Get Your Credentials**
   - After creating, you'll get:
     - **Client ID**: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
     - **Client Secret**: `GOCSPX-abcdefghijklmnopqrstuvwxyz`

### **Step 2: Configure Environment Variables**

#### **For Local Development:**
Create a `.env.local` file in your project root:

```env
NEXTAUTH_SECRET=94a7109fb6b7c7b5c7c6c2d31f28f5c69df641c0680f48b68467a86f379a33be
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=file:./dev.db
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

#### **For Netlify Production:**
1. Go to your Netlify dashboard
2. Navigate to "Site settings" → "Environment variables"
3. Add these variables:
   - `NEXTAUTH_SECRET`: `94a7109fb6b7c7b5c7c6c2d31f28f5c69df641c0680f48b68467a86f379a33be`
   - `NEXTAUTH_URL`: `https://your-site-name.netlify.app`
   - `DATABASE_URL`: `file:./dev.db`
   - `GOOGLE_CLIENT_ID`: `your-google-client-id-here`
   - `GOOGLE_CLIENT_SECRET`: `your-google-client-secret-here`

### **Step 3: Test Google OAuth**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test the sign-in flow:**
   - Go to `http://localhost:3000/sign-in`
   - Click "Continue with Google"
   - You should be redirected to Google's OAuth consent screen
   - After authorization, you should be redirected back to your app

### **Step 4: Troubleshooting**

#### **Common Issues:**

1. **"Error 400: redirect_uri_mismatch"**
   - Make sure the redirect URI in Google Console exactly matches your app URL
   - Check for trailing slashes and http vs https

2. **"Error 403: access_denied"**
   - Make sure the Google+ API is enabled
   - Check that your OAuth consent screen is configured

3. **"Invalid client"**
   - Double-check your Client ID and Client Secret
   - Make sure they're correctly set in environment variables

4. **"This app isn't verified"**
   - For development, you can add your email to test users
   - For production, you'll need to verify your app with Google

### **Step 5: OAuth Consent Screen Configuration**

1. **Go to "OAuth consent screen"**
2. **Choose "External" user type** (unless you have a Google Workspace)
3. **Fill in required fields:**
   - App name: "Indiwave"
   - User support email: your email
   - Developer contact: your email
4. **Add scopes:**
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
5. **Add test users** (for development):
   - Add your email and any other test emails

### **Step 6: Production Considerations**

1. **Verify your app** with Google (required for production)
2. **Update redirect URIs** to use your production domain
3. **Set up proper error handling** for OAuth failures
4. **Consider rate limiting** for OAuth requests

## 🚀 **Quick Setup Commands**

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Test Google OAuth
# Visit: http://localhost:3000/sign-in
# Click: "Continue with Google"
```

## 📝 **Notes**

- Google OAuth will automatically create user accounts in your database
- Users can sign in with either email/password or Google OAuth
- Google OAuth users get the default "USER" role
- Profile pictures from Google accounts are automatically imported
- Email verification is automatically set for Google OAuth users

## 🔒 **Security**

- Never commit your `.env.local` file to version control
- Use different OAuth credentials for development and production
- Regularly rotate your OAuth secrets
- Monitor OAuth usage in Google Cloud Console
