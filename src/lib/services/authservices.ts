import { SignupInput } from '@/lib/validations/auth'

interface SignupResponse {
  success: boolean
  message?: string
  data?: {
    id: string
    name: string
    email: string
    avatar: string | null
    isActive: boolean
    isSuperAdmin: boolean
    createdAt: string
  }
  error?: string
  details?: Array<{
    field: string
    message: string
  }>
}

export const authService = {
  /**
   * Sign up a new user
   * @param data - User signup data (validated by Zod schema)
   * @returns Promise with signup response
   */
  signup: async (data: SignupInput): Promise<SignupResponse> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Signup failed',
          details: result.details,
        }
      }

      return result
    } catch (error: any) {
      console.error('Signup service error:', error)
      return {
        success: false,
        error: error.message || 'An error occurred during signup',
      }
    }
  },
}
