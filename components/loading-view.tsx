"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, Loader2 } from "lucide-react"
import { useToast } from "@/components/hooks/use-toast"

interface LoadingViewProps {
  onAnalysisComplete: (data: unknown) => void
}

export default function LoadingView({ onAnalysisComplete }: LoadingViewProps) {
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const eventId = localStorage.getItem("EVENT_ID")
    const userId = localStorage.getItem("USER_ID")

    if (!eventId || !userId) {
      toast({
        title: "Error",
        description: "Missing analysis data. Please try again.",
        variant: "destructive",
      })
      return
    }

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 15, 90))
    }, 500)

    // Poll for status
    const pollStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals/status/${eventId}`)

        if (!response.ok) {
          throw new Error("Failed to check status")
        }

        const statusData = await response.json()

        if (statusData.status === "COMPLETED") {
          clearInterval(progressInterval)
          setProgress(100)

          // Fetch meals data
          const mealsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/meals`)

          if (!mealsResponse.ok) {
            throw new Error("Failed to fetch meals data")
          }

          const mealsData = await mealsResponse.json()

          setTimeout(() => {
            onAnalysisComplete(mealsData)
          }, 1000)
        } else if (statusData.status === "FAILED") {
          clearInterval(progressInterval)
          toast({
            title: "Analysis Failed",
            description: "Unable to analyze your meal. Please try again.",
            variant: "destructive",
          })
        } else {
          // Continue polling
          setTimeout(pollStatus, 2000)
        }
      } catch (error) {
        console.error(error)
        clearInterval(progressInterval)
        toast({
          title: "Error",
          description: "Something went wrong during analysis.",
          variant: "destructive",
        })
      }
    }

    // Start polling after a short delay
    setTimeout(pollStatus, 1000)

    return () => {
      clearInterval(progressInterval)
    }
  }, [onAnalysisComplete, toast])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Analyzing Your Meal</CardTitle>
          <div className="flex items-center justify-center mt-4">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-blue-600" />
            <span className="text-sm text-muted-foreground">
              Our AI is examining your meal for nutritional insights...
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
