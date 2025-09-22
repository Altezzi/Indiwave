# indiwave - Comic Platform

A modern web platform for reading and sharing comics, built with Next.js 14, featuring a comprehensive role-based admin system.

## 🚀 Features

### Core Platform
- **Comic Reading Experience** - Clean, responsive comic reader
- **User Authentication** - Secure login with NextAuth.js
- **User Profiles** - Customizable profiles with image cropping
- **Library Management** - Save and organize favorite comics
- **Search & Discovery** - Find comics by title, author, or creator

### Admin System
- **Role-Based Access Control** - 7-tier permission system (USER → ADMIN)
- **Admin Dashboard** - Comprehensive management interface
- **User Management** - View, edit, and manage user roles
- **Audit Logging** - Track all privileged actions
- **Content Moderation** - Tools for platform management

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Authentication:** NextAuth.js with Google OAuth & Credentials
- **Database:** Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Styling:** CSS-in-JS with CSS variables for theming
- **Deployment:** Netlify-ready with serverless functions

## 📋 Role System

| Role | Permissions |
|------|-------------|
| **USER** | Browse, read, comment on comics |
| **CREATOR** | Upload and manage own series/chapters |
| **REVIEWER** | Handle creator claim requests |
| **UPLOAD_TEAM** | Create unclaimed creators, upload content |
| **MODERATOR** | Moderate content, silence users, handle takedowns |
| **SENIOR_MOD** | All moderator powers + role management |
| **ADMIN** | Full platform access + site configuration |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/indiwave.git
   cd indiwave
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your values:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Seed the database with test users**
   ```bash
   npx tsx scripts/seed.ts
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Test Accounts

After seeding, you can use these test accounts:

| Role | Email | Password | Access |
|------|-------|----------|---------|
| **Admin** | `admin@indiwave.com` | `admin123` | Full admin dashboard |
| **Creator** | `creator@indiwave.com` | `creator123` | Creator tools |
| **User** | `user@indiwave.com` | `user123` | Basic features |

## 📁 Project Structure

```
indiwave/
├── app/                    # Next.js 14 App Router
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── ...                # Other pages
├── components/            # Reusable React components
├── lib/                   # Utility functions
├── prisma/               # Database schema & migrations
├── scripts/              # Database seeding scripts
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Run database migrations
- `npx tsx scripts/seed.ts` - Seed database with test data

## 🎨 Customization

### Theming
The app uses CSS variables for theming. Edit `app/globals.css` to customize colors:

```css
:root {
  --bg: #ffffff;
  --fg: #000000;
  --accent: #3b82f6;
  --border: #e5e7eb;
  /* ... more variables */
}
```

### Adding New Roles
1. Update the `UserRole` enum in `prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Update role hierarchy in `app/api/admin/users/[userId]/role/route.ts`
4. Add UI elements in `app/admin/page.tsx`

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Vercel
1. Import project from GitHub
2. Set environment variables
3. Deploy automatically on push

### Other Platforms
The app is built with standard Next.js and can be deployed to any platform that supports Node.js.

## 📚 Documentation

- [Role System Details](ROLES.md) - Complete role and permission documentation
- [Admin Setup Guide](ADMIN_SETUP.md) - Admin dashboard usage guide
- [API Documentation](docs/api.md) - API endpoints reference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- Database management with [Prisma](https://prisma.io/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

---

**Happy coding! 🎉**
