"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Camera, Lightbulb, TrendingUp } from "lucide-react"
import { Meal } from "@/app/types"

interface ResultsViewProps {
  mealsData: Meal[]
  onUploadNew: () => void
}

export default function ResultsView({ mealsData, onUploadNew }: ResultsViewProps) {
  if (!mealsData || mealsData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p>No meal data available.</p>
            <Button onClick={onUploadNew} className="mt-4">
              Upload New Photo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Meal Analysis Results</h1>
          <p className="text-muted-foreground">Here&apos;s what we discovered about your meal</p>
        </div>

        <div className="space-y-6">
          {mealsData.map((meal, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  {meal.name}
                </CardTitle>
                <CardDescription>Nutritional breakdown and personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nutrition Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{meal.calories}</div>
                    <div className="text-sm text-red-700">Calories</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{meal.proteins}g</div>
                    <div className="text-sm text-blue-700">Protein</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{meal.carbs}g</div>
                    <div className="text-sm text-yellow-700">Carbs</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{meal.fats}g</div>
                    <div className="text-sm text-purple-700">Fats</div>
                  </div>
                </div>

                <Separator />

                {/* AI Insights */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    AI Insights
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{meal.aiInsights}</p>
                </div>

                <Separator />

                {/* Tips */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Personalized Tips
                  </h3>
                  <div className="space-y-2">
                    {meal.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <Badge variant="secondary" className="mt-0.5 text-xs">
                          {tipIndex + 1}
                        </Badge>
                        <p className="text-sm text-green-800 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload New Button */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <Button onClick={onUploadNew} size="lg" className="shadow-lg">
            <Camera className="mr-2 h-5 w-5" />
            Analyze Another Meal
          </Button>
        </div>
      </div>
    </div>
  )
}
