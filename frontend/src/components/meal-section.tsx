"use client";

import { useState } from "react";
import { Clock, Check, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getMealRecipes } from "@/lib/meal-data";
import type { Recipe } from "@/types/recipe";

interface MealSectionProps {
  title: string;
  meal: string;
  protein: string;
  calories: string;
  imageSrc: string;
  recipeType: "breakfast" | "lunch" | "dinner";
  isCompleted?: boolean;
  onToggleCompletion?: () => void;
}

export default function MealSection({
  title,
  meal,
  protein,
  calories,
  imageSrc,
  recipeType,
  isCompleted = false,
  onToggleCompletion,
}: MealSectionProps) {
  const [showRecipe, setShowRecipe] = useState(false);
  const recipes = getMealRecipes();
  const recipe = recipes[recipeType];

  return (
    <>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium">{title}</span>
          </div>
          {onToggleCompletion && (
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full p-1 h-auto ${
                isCompleted ? "text-green-600" : "text-gray-400"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompletion();
              }}
            >
              <CheckCircle2 className="h-5 w-5" />
              <span className="sr-only">
                {isCompleted ? "Mark as not done" : "Mark as done"}
              </span>
            </Button>
          )}
        </div>
        <div
          className={`bg-white p-3 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
            isCompleted ? "bg-gray-50 border-green-200" : ""
          }`}
          onClick={() => setShowRecipe(true)}
        >
          <div className="flex items-center">
            <div
              className={`h-16 w-16 rounded-md overflow-hidden mr-3 bg-gray-100 relative ${
                isCompleted ? "opacity-70" : ""
              }`}
            >
              <Image
                src={imageSrc}
                alt={meal}
                width={64}
                height={64}
                className="object-cover h-full w-full"
              />
              {isCompleted && (
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <Check className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            <div className={isCompleted ? "opacity-70" : ""}>
              <h4 className="text-sm font-medium flex items-center">
                {meal}
                {isCompleted && (
                  <span className="ml-2 text-xs text-green-600 font-normal">
                    Completed
                  </span>
                )}
              </h4>
              <p className="text-xs text-gray-500">
                {protein} protein, {calories} cal
              </p>
              <p className="text-xs text-blue-600 mt-1">Click for recipe</p>
            </div>
          </div>
        </div>
      </div>

      <RecipeDialog
        recipe={recipe}
        imageSrc={imageSrc}
        open={showRecipe}
        onOpenChange={setShowRecipe}
      />
    </>
  );
}

interface RecipeDialogProps {
  recipe: Recipe;
  imageSrc: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function RecipeDialog({
  recipe,
  imageSrc,
  open,
  onOpenChange,
}: RecipeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{recipe.title}</DialogTitle>
          <DialogDescription>
            A bariatric-friendly recipe for your recovery stage
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="mb-4 rounded-md overflow-hidden h-48 w-full">
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={recipe.title}
              width={400}
              height={200}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
            <div className="bg-gray-50 p-2 rounded-md">
              <span className="font-medium">Protein:</span>{" "}
              {recipe.nutritionalInfo.protein}
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <span className="font-medium">Calories:</span>{" "}
              {recipe.nutritionalInfo.calories}
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <span className="font-medium">Carbs:</span>{" "}
              {recipe.nutritionalInfo.carbs}
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <span className="font-medium">Fat:</span>{" "}
              {recipe.nutritionalInfo.fat}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Ingredients</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Instructions</h4>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
