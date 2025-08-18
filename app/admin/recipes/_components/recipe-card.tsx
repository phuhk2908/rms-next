"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, DollarSign } from "lucide-react"

export function RecipeCard({ recipe, onSelect }: { recipe: any; onSelect: (r: any) => void }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-500"
      case "MEDIUM":
        return "bg-yellow-500"
      case "HARD":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg"
      onClick={() => onSelect(recipe)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{recipe.name}</CardTitle>
            <CardDescription>{recipe.menuItemName}</CardDescription>
          </div>
          <div className={`w-3 h-3 rounded-full ${getDifficultyColor(recipe.difficulty)}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{recipe.totalTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{recipe.servingSize} serving</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>${recipe.totalCost.toFixed(2)}</span>
            </div>
            <Badge variant="outline">{recipe.profitMargin.toFixed(1)}% margin</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
