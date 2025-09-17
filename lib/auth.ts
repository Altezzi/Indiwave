import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // Temporarily disabled for deployment
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Temporary hardcoded users for production deployment
        const testUsers = [
          {
            id: "admin-1",
            email: "admin@indiwave.com",
            password: "admin123",
            name: "Admin User",
            role: "ADMIN"
          },
          {
            id: "creator-1", 
            email: "creator@indiwave.com",
            password: "creator123",
            name: "Creator User",
            role: "CREATOR"
          },
          {
            id: "user-1",
            email: "user@indiwave.com", 
            password: "user123",
            name: "Regular User",
            role: "USER"
          }
        ]

        // Add your own admin account here
        const yourAccount = {
          id: "your-admin-1",
          email: "sfg.churst@gmail.com",
          password: "Impetigo8423@",
          name: "SealSCKS",
          role: "ADMIN"
        }
        
        testUsers.push(yourAccount)

        const user = testUsers.find(u => u.email === credentials.email)
        
        if (!user || user.password !== credentials.password) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: null,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/sign-in",
  }
}
