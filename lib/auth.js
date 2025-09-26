import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { supabase } from "./supabase.js"

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Google provider
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
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single()

          if (error || !user || !user.password) {
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
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback - user:", user?.email, "account:", account?.provider)
      
      // Handle Google OAuth sign in
      if (account?.provider === "google") {
        try {
          // Check if user exists in database
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single()

          if (!existingUser) {
            // Create new user from Google OAuth
            const { data: newUser, error } = await supabase
              .from('users')
              .insert({
                email: user.email,
                name: user.name,
                image: user.image,
                role: "USER",
                isCreator: false,
                emailVerified: new Date().toISOString()
              })
              .select()
              .single()

            if (error) {
              console.error("Error creating user:", error)
            } else {
              console.log("Created new user from Google OAuth:", newUser)
            }
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
          const { data: dbUser } = await supabase
            .from('users')
            .select('role')
            .eq('email', token.email)
            .single()
          
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
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: "/sign-in",
  }
}
