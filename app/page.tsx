"use client"

import { useState, useEffect } from "react"
import LoginForm from "@/components/login-form"
import MainUpload from "@/components/main-upload"
import LoadingView from "@/components/loading-view"
import ResultsView from "@/components/results-view"

type AppState = "login" | "main" | "loading" | "results"

export default function WellnessApp() {
  const [currentView, setCurrentView] = useState<AppState>("login")
  const [mealsData, setMealsData] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const userId = localStorage.getItem("USER_ID")
    if (userId) {
      setCurrentView("main")
    }
  }, [])

  const handleLoginSuccess = () => {
    setCurrentView("main")
  }

  const handleImageUploaded = () => {
    setCurrentView("loading")
  }

  const handleAnalysisComplete = (data: any) => {
    setMealsData(data)
    setCurrentView("results")
  }

  const handleUploadNew = () => {
    setCurrentView("main")
    setMealsData(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {currentView === "login" && <LoginForm onLoginSuccess={handleLoginSuccess} />}
      {currentView === "main" && <MainUpload onImageUploaded={handleImageUploaded} />}
      {currentView === "loading" && <LoadingView onAnalysisComplete={handleAnalysisComplete} />}
      {currentView === "results" && <ResultsView mealsData={mealsData} onUploadNew={handleUploadNew} />}
    </div>
  )
}
