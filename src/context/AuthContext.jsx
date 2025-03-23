"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/auth/status`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setUser(data.user)
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Handle OAuth callback
  const handleCallback = useCallback(async (code) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/auth/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
        credentials: "include",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to authenticate")
      }

      const data = await response.json()
      setUser(data.user)
      return data.user
    } catch (error) {
      console.error("Error in callback:", error)
      throw error
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}api/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
    } catch (error) {
      console.error("Error logging out:", error)
      throw error
    }
  }, [])

  const value = {
    user,
    isLoading,
    handleCallback,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

