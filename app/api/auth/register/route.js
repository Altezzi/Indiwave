import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabase } from "../../../lib/supabase.js"

export async function POST(request) {
  try {
    const { email, password, name, username } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Check if username is taken (if provided)
    if (username) {
      const { data: existingUsername } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

      if (existingUsername) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Get the next account ID
    const { data: lastUser } = await supabase
      .from('users')
      .select('accountId')
      .order('accountId', { ascending: false })
      .limit(1)
      .single()
    
    const nextAccountId = (lastUser?.accountId || 0) + 1;

    // Create user
    const { data: user, error: createError } = await supabase
      .from('users')
      .insert({
        accountId: nextAccountId,
        email,
        password: hashedPassword,
        name,
        username: username || null,
        role: "USER", // Default role
        isCreator: false,
      })
      .select()
      .single()

    if (createError) {
      throw createError
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: userWithoutPassword 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
