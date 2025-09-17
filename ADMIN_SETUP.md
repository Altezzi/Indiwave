# Admin Dashboard Setup

## 🎉 Admin Dashboard is Ready!

Your Indiwave platform now has a fully functional admin dashboard with user management and role-based permissions.

## 📍 Access the Admin Dashboard

**URL:** `/admin`

**Access Requirements:**
- Must be logged in as `ADMIN` or `SENIOR_MOD` role
- Dashboard will redirect unauthorized users

## 🔑 Test Accounts Created

The following test accounts have been created for you:

### Admin Account
- **Email:** `admin@indiwave.com`
- **Password:** `admin123`
- **Role:** `ADMIN`
- **Access:** Full admin dashboard + all features

### Regular User Account
- **Email:** `user@indiwave.com`
- **Password:** `user123`
- **Role:** `USER`
- **Access:** Basic user features only

### Creator Account
- **Email:** `creator@indiwave.com`
- **Password:** `creator123`
- **Role:** `CREATOR`
- **Access:** Creator menu + user features

## 🛠️ Admin Dashboard Features

### ✅ Currently Implemented

1. **Overview Tab**
   - Platform statistics (users, creators, series, comments)
   - Recent activity feed
   - Quick insights

2. **User Management Tab**
   - View all users with details
   - Change user roles (with permission checks)
   - See user status (active/silenced)
   - Role-based access control

3. **Audit Logs Tab**
   - View all privileged actions
   - Track who did what and when
   - Actor information included

4. **Navigation**
   - Tabbed interface for easy navigation
   - Role-based menu items in profile dropdown
   - Responsive design

### 🚧 Coming Soon (Placeholder Tabs)

- **Review Queue** - Handle creator claim requests
- **Content Moderation** - Tools for moderating content
- **Site Settings** - Platform configuration options

## 🔐 Role Permissions

### ADMIN
- ✅ Full access to all dashboard features
- ✅ Can change any user's role (including other admins)
- ✅ Can view all audit logs
- ✅ Can access all tabs

### SENIOR_MOD
- ✅ Can view dashboard
- ✅ Can change roles of users below them (not other Senior Mods/Admins)
- ✅ Can view audit logs
- ✅ Cannot access admin-only features

### Other Roles
- ❌ Cannot access admin dashboard
- ❌ Redirected to home page if they try to access `/admin`

## 🚀 How to Test

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Sign in as admin:**
   - Go to `/sign-in`
   - Use: `admin@indiwave.com` / `admin123`

3. **Access admin dashboard:**
   - Click your profile picture in the header
   - Select "Admin Dashboard" from the dropdown
   - Or go directly to `/admin`

4. **Test user management:**
   - Go to "User Management" tab
   - Try changing a user's role
   - Check the "Audit Logs" tab to see the action recorded

## 🔧 Environment Setup

Make sure you have these environment variables set up:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 📝 Database Schema

The admin dashboard works with the following key models:
- `User` - User accounts with roles
- `AuditLog` - Tracks all privileged actions
- `Series` - Comic series
- `Chapter` - Individual chapters
- `Comment` - User comments
- `CreatorClaim` - Creator verification requests

## 🎨 Customization

The admin dashboard is built with:
- **Next.js 14** with App Router
- **NextAuth.js** for authentication
- **Prisma** for database operations
- **TypeScript** for type safety
- **CSS-in-JS** for styling (easily customizable)

You can modify the dashboard by editing:
- `app/admin/page.tsx` - Main dashboard component
- `app/api/admin/*` - API endpoints
- `components/ProfileDropdown.tsx` - Navigation menu

## 🚨 Security Notes

- All admin actions are logged in the audit system
- Role changes are permission-checked on both frontend and backend
- Users cannot change their own roles
- Senior Mods cannot escalate to Admin/Senior Mod roles
- All API endpoints verify user permissions

## 📞 Need Help?

The admin dashboard is fully functional and ready for use. You can:
- Modify the UI/UX as needed
- Add new features to the placeholder tabs
- Customize the role system
- Add more detailed audit logging

Happy administrating! 🎉
