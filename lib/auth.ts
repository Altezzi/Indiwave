import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
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

        try {
          // First check hardcoded test users for backward compatibility
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
            },
            {
              id: "your-admin-1",
              email: "sfg.churst@gmail.com",
              password: "Impetigo8423@",
              name: "SealSCKS",
              role: "ADMIN"
            }
          ]

          const testUser = testUsers.find(u => u.email === credentials.email)
          if (testUser && testUser.password === credentials.password) {
            return {
              id: testUser.id,
              email: testUser.email,
              name: testUser.name,
              image: null,
              role: testUser.role,
            }
          }

          // If not a test user, check database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign in
      if (account?.provider === "google") {
        try {
          // Check if user exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // Create new user from Google OAuth
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image,
                role: "USER",
                isCreator: false,
                emailVerified: new Date()
              }
            })
          }
          return true
        } catch (error) {
          console.error("Error handling Google sign in:", error)
          return false
        }
      }
      return true
    },
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
