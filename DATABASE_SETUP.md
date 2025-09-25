# Database Setup for Indiwave

## Local Development

1. Create a `.env` file in the root directory with:
```
DATABASE_URL="file:./prod.db"
```

2. Run database migrations:
```bash
npm run migrate:dev
```

## Production (Vercel)

For production deployment on Vercel, you need to set up a hosted database:

### Option 1: Vercel Postgres (Recommended)
1. Add Vercel Postgres to your project in the Vercel dashboard
2. Copy the connection string and set it as `DATABASE_URL` in your Vercel environment variables

### Option 2: External Database
1. Set up a PostgreSQL or MySQL database (Railway, PlanetScale, etc.)
2. Set the `DATABASE_URL` environment variable in Vercel dashboard

### Environment Variables for Vercel
Set these in your Vercel project settings:
- `DATABASE_URL` - Your production database connection string
- `NEXTAUTH_SECRET` - A random secret for authentication
- `NEXTAUTH_URL` - Your production URL (e.g., https://your-app.vercel.app)

## Migration Commands

- `npm run migrate:dev` - Apply migrations in development
- `npm run migrate:deploy` - Apply migrations in production
- `npm run db:reset` - Reset database and re-import series data

## Troubleshooting

If you get "table does not exist" errors:
1. Ensure `DATABASE_URL` is set correctly
2. Run `npm run migrate:deploy` to apply migrations
3. Check that the database is accessible from your deployment environment
