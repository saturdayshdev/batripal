export interface NutritionalInfo {
  protein: string;
  calories: string;
  carbs: string;
  fat: string;
}

export interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: NutritionalInfo;
}

export interface RecipeCollection {
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
}
