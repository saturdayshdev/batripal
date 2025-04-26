export interface CompletedMeals {
  [date: string]: string[];
}

export interface GroceryItem {
  id: string;
  name: string;
  completed: boolean;
  addedAt: string;
}
