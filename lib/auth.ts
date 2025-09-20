import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    // Only add Google provider if credentials are configured
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ] : []),
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
          // Production: Only keep your admin account for hardcoded access
          const productionUsers = [
            {
              id: "your-admin-1",
              email: "sfg.churst@gmail.com",
              password: "Impetigo8423@",
              name: "SealSCKS",
              role: "ADMIN"
            }
          ]

          const productionUser = productionUsers.find(u => u.email === credentials.email)
          if (productionUser && productionUser.password === credentials.password) {
            return {
              id: productionUser.id,
              email: productionUser.email,
              name: productionUser.name,
              image: null,
              role: productionUser.role,
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
            // Get the next account ID
            const lastUser = await prisma.user.findFirst({
              orderBy: { accountId: 'desc' },
              select: { accountId: true }
            });
            const nextAccountId = (lastUser?.accountId || 0) + 1;

            // Create new user from Google OAuth
            const newUser = await prisma.user.create({
              data: {
                accountId: nextAccountId,
                email: user.email!,
                name: user.name!,
                image: user.image,
                role: "USER",
                isCreator: false,
                emailVerified: new Date()
              }
            })
            console.log("Created new user from Google OAuth:", newUser)
          } else {
            console.log("Existing user signed in via Google:", existingUser)
          }
          return true
        } catch (error) {
          console.error("Error handling Google sign in:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
      }
      
      // For Google OAuth, fetch user role from database
      if (account?.provider === "google" && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { role: true }
          })
          if (dbUser) {
            token.role = dbUser.role
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
        }
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
