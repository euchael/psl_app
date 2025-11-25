import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signupSchema } from '@/lib/validations/auth'
import { ZodError } from 'zod'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = signupSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User with this email already exists' 
        },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        isActive: true,
        isSuperAdmin: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        isActive: true,
        isSuperAdmin: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        data: user,
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      )
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false,
          error: 'User with this email already exists' 
        },
        { status: 409 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    )
  }
}