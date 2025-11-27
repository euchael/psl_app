import { LoginInput } from "@/lib/validations/login";
import { SignupInput } from "@/lib/validations/auth";

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
      isActive: boolean;
      isSuperAdmin: boolean;
      createdAt: string;
      updatedAt: string;
      lastLoginAt: string | null;
    };
  };
  error?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

interface SignupResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    isActive: boolean;
    isSuperAdmin: boolean;
    createdAt: string;
  };
  error?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export const authService = {
  signup: async (data: SignupInput): Promise<SignupResponse> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Signup failed",
          details: result.details,
        };
      }

      return result;
    } catch (error: any) {
      console.error("Signup service error:", error);
      return {
        success: false,
        error: error.message || "An error occurred during signup",
      };
    }
  },

  login: async (data: LoginInput): Promise<AuthResponse> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: Include cookies
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Login failed",
          details: result.details,
        };
      }

      return result;
    } catch (error: any) {
      console.error("Login service error:", error);
      return {
        success: false,
        error: error.message || "An error occurred during login",
      };
    }
  },

  logout: async (): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Important: Include cookies
      });

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error("Logout service error:", error);
      return {
        success: false,
        error: error.message || "An error occurred during logout",
      };
    }
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // Important: Include cookies
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Failed to get user",
        };
      }

      return result;
    } catch (error: any) {
      console.error("Get current user error:", error);
      return {
        success: false,
        error: error.message || "An error occurred",
      };
    }
  },
};
