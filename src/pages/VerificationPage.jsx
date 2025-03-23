// src/pages/VerificationPage.jsx
"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { CheckCircle, RefreshCw, ArrowLeft } from "lucide-react"
import { toast } from "../components/ui/use-toast"

export default function VerificationPage() {
  const [tweetUrl, setTweetUrl] = useState("")
  const [isVerified, setIsVerified] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const location = useLocation();

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Check for URL passed from dashboard
    if (location.state?.tweetUrl) {
      setTweetUrl(location.state.tweetUrl);
    }
  }, [location.state]);

  const handleVerifyTweet = async () => {
    if (!tweetUrl.trim()) return

    setIsVerifying(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}tweets/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ url: tweetUrl }),
        credentials: "include",
      })

      const data = await response.json()
      console.log("data log",data)

      if (response.ok) {
        setIsVerified(data.isVerified)
        toast({
          title: data.isVerified ? "Tweet verified!" : "Tweet verification failed",
          description: data.message,
        })
      } else {
        throw new Error(data.message || "Failed to verify tweet")
      }
    } catch (error) {
      toast({
        title: "Error verifying tweet",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
      setIsVerified(null)
    } finally {
      setIsVerifying(false)
    }
  }

  if (!user) {
    navigate("/")
    return null
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Verify a Tweet</CardTitle>
          <CardDescription>Check if a tweet is authentic and unmodified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Enter tweet URL" 
            value={tweetUrl} 
            onChange={(e) => setTweetUrl(e.target.value)} 
          />
          {isVerified !== null && (
            <div className="flex items-center gap-2">
              <Badge variant={isVerified ? "default" : "destructive"}>
                {isVerified ? "Verified" : "Not Verified"}
              </Badge>
              {isVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={handleVerifyTweet} disabled={isVerifying || !tweetUrl.trim()}>
            {isVerifying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verify Tweet
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}