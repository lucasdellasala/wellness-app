"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, Loader2 } from "lucide-react"
import { useToast } from "@/components/hooks/use-toast"
import Image from "next/image"

interface MainUploadProps {
  onImageUploaded: () => void
}

export default function MainUpload({ onImageUploaded }: MainUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"]
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please select a JPG, JPEG, or PNG image.",
          variant: "destructive",
        })
        return
      }

      setSelectedImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedImage) return

    const userId = localStorage.getItem("USER_ID")
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found. Please log in again.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", selectedImage)
      formData.append("userId", userId)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals/analyze`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      localStorage.setItem("EVENT_ID", data.eventId)

      toast({
        title: "Image Uploaded!",
        description: "Analyzing your meal... This may take a moment.",
      })

      onImageUploaded()
    } catch (error) {
      console.error(error)
      toast({
        title: "Upload Failed",
        description: "Unable to analyze your meal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Capture Your Meal</CardTitle>
          <CardDescription>
            Take a photo of your meal and get instant nutritional insights and personalized tips for healthier eating
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {imagePreview && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
              <Image src={imagePreview || "/placeholder.svg"} alt="Selected meal" fill className="object-cover" />
            </div>
          )}

          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageSelect}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full h-12"
              disabled={isUploading}
            >
              <Upload className="mr-2 h-5 w-5" />
              {selectedImage ? "Change Photo" : "Select Photo"}
            </Button>

            {selectedImage && (
              <Button onClick={handleUpload} className="w-full h-12" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Meal...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-5 w-5" />
                    Analyze My Meal
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
