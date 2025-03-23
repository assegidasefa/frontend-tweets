// src/pages/Dashboard.jsx
"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Textarea } from "../components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Send, LogOut, RefreshCw, CheckCircle } from "lucide-react"
import { toast } from "../components/ui/use-toast"

export default function Dashboard() {
  const [tweet, setTweet] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [postedUrl, setPostedUrl] = useState("");


  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/")
    }
  }, [user, navigate])

  const handlePostTweet = async () => {
    if (!tweet.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tweets/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ content: tweet }),
        credentials: "include",
      })

      const data = await response.json()
      console.log("data for tweets",data)

      if (response.ok) {
        toast({
          title: "Tweet posted successfully!",
          description: "Your tweet has been posted to Twitter.",
        })
        setTweet("")
        setPostedUrl(data.tweet.url);
        navigate('/verify', { state: { tweetUrl: data.tweet.url } });
      } else {
        throw new Error(data.message || "Failed to post tweet")
      }
    } catch (error) {
      toast({
        title: "Error posting tweet",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} alt={user.name} />
            <AvatarFallback>{user.name ? user.name.charAt(0) : "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.handle || "@user"}</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Post a Tweet</CardTitle>
            <CardDescription>Compose and post a new tweet to your Twitter account</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What's happening?"
              className="min-h-[120px] resize-none"
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
              maxLength={280}
            />
            <div className="mt-2 text-right text-sm text-muted-foreground">{tweet.length}/280</div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto" onClick={handlePostTweet} disabled={isLoading || !tweet.trim()}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post Tweet
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center">
          <Button asChild variant="ghost">
            <Link to="/verify">
              <CheckCircle className="mr-2 h-4 w-4" />
              Verify Existing Tweets
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}