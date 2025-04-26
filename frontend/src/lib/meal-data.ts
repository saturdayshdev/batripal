import type { RecipeCollection } from "@/types/recipe";

export function getMealRecipes(): RecipeCollection {
  return {
    breakfast: {
      title: "Protein Smoothie",
      ingredients: [
        "1 scoop protein powder (20g)",
        "120ml unsweetened almond milk",
        "1/2 small banana",
        "Ice cubes",
        "1 tsp chia seeds (optional)",
      ],
      instructions: [
        "Add all ingredients to a blender.",
        "Blend until smooth and creamy.",
        "Pour into a glass and consume slowly.",
        "Sip over 15-20 minutes to avoid discomfort.",
      ],
      nutritionalInfo: {
        protein: "15g",
        calories: "150",
        carbs: "12g",
        fat: "4g",
      },
    },
    lunch: {
      title: "Pureed Soup",
      ingredients: [
        "100g cooked chicken breast",
        "1/2 cup vegetable broth (low sodium)",
        "1/4 cup cooked carrots",
        "1/4 cup cooked zucchini",
        "1 tsp olive oil",
        "Herbs to taste",
      ],
      instructions: [
        "Cook vegetables until very soft.",
        "Blend cooked chicken and vegetables with broth.",
        "Add olive oil and blend again until smooth.",
        "Heat gently and season with herbs.",
        "Consume in small spoonfuls.",
      ],
      nutritionalInfo: {
        protein: "12g",
        calories: "120",
        carbs: "8g",
        fat: "5g",
      },
    },
    dinner: {
      title: "Soft Proteins",
      ingredients: [
        "2 scrambled eggs (soft)",
        "30g soft white fish",
        "1 tbsp Greek yogurt",
        "1 tsp herbs",
        "Salt and pepper to taste (minimal)",
      ],
      instructions: [
        "Scramble eggs very softly with minimal oil.",
        "Steam fish until very tender and flaky.",
        "Mix Greek yogurt with herbs for added flavor.",
        "Serve in small portions and chew thoroughly.",
        "Eat slowly over 20-30 minutes.",
      ],
      nutritionalInfo: {
        protein: "18g",
        calories: "180",
        carbs: "2g",
        fat: "10g",
      },
    },
  };
}
