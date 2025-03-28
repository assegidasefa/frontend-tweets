"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Twitter } from "lucide-react"

export default function Home() {
  const { user, isLoading } = useAuth()
  const [isButtonClicked,setIsButtonClicked] = useState(false)
  const navigate = useNavigate()

  console.log("is log",isLoading,user)

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard")
    }
  }, [user, isLoading, navigate])

  const handleTwitterLogin = () => {
    // Redirect to backend auth endpoint
    setIsButtonClicked(true)
    console.log("err",import.meta.env.VITE_API_URL)
    window.location.href = `${import.meta.env.VITE_API_URL}api/auth/twitter`
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Twitter Connect</CardTitle>
          <CardDescription>Login with Twitter to post and verify tweets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Twitter className="h-24 w-24 text-sky-500" />
          </div>
          <div className="space-y-2">
            <p className="text-center text-sm text-muted-foreground">Connect your Twitter account to:</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center justify-center">
                <span className="mr-2">•</span> Post tweets directly from our platform
              </li>
              <li className="flex items-center justify-center">
                <span className="mr-2">•</span> Verify tweet authenticity
              </li>
              <li className="flex items-center justify-center">
                <span className="mr-2">•</span> Manage your Twitter activity
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-sky-500 hover:bg-sky-600" onClick={handleTwitterLogin} 
          
          disabled={isButtonClicked}
          >
            <Twitter className="mr-2 h-4 w-4" />
            Login with Twitter
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

