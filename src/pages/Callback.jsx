"use client"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Callback() {
  const [searchParams] = useSearchParams()
  const { handleCallback } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get("code")
        if (!code) {
          throw new Error("No authorization code found in URL")
        }

        await handleCallback(code)
        navigate("/dashboard")
      } catch (err) {
        console.error("Error during callback processing:", err)
        setError(err.message || "Authentication failed")
        // Redirect to home after a delay
        setTimeout(() => navigate("/"), 3000)
      }
    }

    processCallback()
  }, [searchParams, handleCallback, navigate])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Authentication Error</h1>
          <p className="mt-2">{error}</p>
          <p className="mt-4">Redirecting to home page...</p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold">Authenticating...</h1>
          <p className="mt-2">Please wait while we complete your authentication.</p>
        </div>
      )}
    </div>
  )
}

