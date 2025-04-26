"use client";
import { useState } from "react";
import MealHeader from "@/components/meal-header";
import WeekdaySelector from "@/components/weekday-selector";
import MealSection from "@/components/meal-section";
import GroceryList from "@/components/meal-grocery-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMealRecipes } from "@/lib/meal-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { CompletedMeals } from "@/types/meal";

export default function MealPlanSidebar() {
  const recipes = getMealRecipes();
  const [activeTab, setActiveTab] = useState("meals");
  const [completedMeals, setCompletedMeals] = useLocalStorage<CompletedMeals>(
    "batripal_completed_meals",
    {}
  );

  const today = new Date().toISOString().split("T")[0];

  const toggleMealCompletion = (mealType: string) => {
    setCompletedMeals((prev) => {
      const newCompletedMeals = { ...prev };

      if (!newCompletedMeals[today]) {
        newCompletedMeals[today] = [];
      }

      if (newCompletedMeals[today].includes(mealType)) {
        newCompletedMeals[today] = newCompletedMeals[today].filter(
          (meal) => meal !== mealType
        );
      } else {
        newCompletedMeals[today].push(mealType);
      }

      return newCompletedMeals;
    });
  };

  const isMealCompleted = (mealType: string) => {
    return completedMeals[today]?.includes(mealType) || false;
  };

  return (
    <div className="h-full flex flex-col">
      <MealHeader />
      <WeekdaySelector />

      <Tabs
        defaultValue="meals"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="meals">Meal Plan</TabsTrigger>
          <TabsTrigger value="grocery">Grocery List</TabsTrigger>
        </TabsList>

        <TabsContent value="meals" className="flex-1 overflow-y-auto">
          <MealSection
            title="Breakfast"
            meal="Protein Smoothie"
            protein="15g"
            calories="150"
            imageSrc="/protein-smoothie.png"
            recipeType="breakfast"
            isCompleted={isMealCompleted("breakfast")}
            onToggleCompletion={() => toggleMealCompletion("breakfast")}
          />
          <MealSection
            title="Lunch"
            meal="Pureed Soup"
            protein="12g"
            calories="120"
            imageSrc="/pureed-soup.png"
            recipeType="lunch"
            isCompleted={isMealCompleted("lunch")}
            onToggleCompletion={() => toggleMealCompletion("lunch")}
          />
          <MealSection
            title="Dinner"
            meal="Soft Proteins"
            protein="18g"
            calories="180"
            imageSrc="/protein-smoothie.png"
            recipeType="dinner"
            isCompleted={isMealCompleted("dinner")}
            onToggleCompletion={() => toggleMealCompletion("dinner")}
          />
        </TabsContent>

        <TabsContent value="grocery" className="flex-1 overflow-y-auto">
          <GroceryList recipes={recipes} />
        </TabsContent>
      </Tabs>

      <div className="p-4 mt-auto border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Personalized for your recovery
        </p>
      </div>
    </div>
  );
}
