import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, JWTPayload } from '@/lib/jwt'

/**
 * Get authenticated user from cookie
 */
export async function getCurrentUser(
  request: NextRequest
): Promise<JWTPayload | null> {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)
    return payload
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Middleware wrapper to require authentication
 */
export function requireAuth(
  handler: (request: NextRequest, user: JWTPayload) => Promise<Response>
) {
  return async (request: NextRequest) => {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Please login.',
        },
        { status: 401 }
      )
    }

    return handler(request, user)
  }
}

/**
 * Middleware wrapper to require super admin
 */
export function requireSuperAdmin(
  handler: (request: NextRequest, user: JWTPayload) => Promise<Response>
) {
  return async (request: NextRequest) => {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Please login.',
        },
        { status: 401 }
      )
    }

    if (!user.isSuperAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden. Super admin access required.',
        },
        { status: 403 }
      )
    }

    return handler(request, user)
  }
}