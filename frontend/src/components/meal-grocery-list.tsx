"use client";

import { useState, useEffect } from "react";
import { Check, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { RecipeCollection } from "@/types/recipe";
import type { GroceryItem } from "@/types/meal";

interface GroceryListProps {
  recipes: RecipeCollection;
}

export default function GroceryList({ recipes }: GroceryListProps) {
  const [groceryItems, setGroceryItems] = useLocalStorage<GroceryItem[]>(
    "batripal_grocery_list",
    []
  );
  const [newItem, setNewItem] = useState("");
  const [suggestedItems, setSuggestedItems] = useState<string[]>([]);

  // Extract all ingredients from recipes
  useEffect(() => {
    const allIngredients: string[] = [];
    Object.values(recipes).forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        // Extract the main ingredient name (remove quantities)
        const mainIngredient = ingredient.split(" ").slice(1).join(" ");
        if (!allIngredients.includes(mainIngredient)) {
          allIngredients.push(mainIngredient);
        }
      });
    });
    setSuggestedItems(allIngredients);
  }, [recipes]);

  const addGroceryItem = () => {
    if (newItem.trim()) {
      const newGroceryItem: GroceryItem = {
        id: Date.now().toString(),
        name: newItem.trim(),
        completed: false,
        addedAt: new Date().toISOString(),
      };
      setGroceryItems([...groceryItems, newGroceryItem]);
      setNewItem("");
    }
  };

  const toggleItemCompletion = (id: string) => {
    setGroceryItems(
      groceryItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setGroceryItems(groceryItems.filter((item) => item.id !== id));
  };

  const addSuggestedItem = (item: string) => {
    const newGroceryItem: GroceryItem = {
      id: Date.now().toString(),
      name: item,
      completed: false,
      addedAt: new Date().toISOString(),
    };
    setGroceryItems([...groceryItems, newGroceryItem]);
  };

  const clearCompletedItems = () => {
    setGroceryItems(groceryItems.filter((item) => !item.completed));
  };

  // Sort items: incomplete first, then by added date
  const sortedItems = [...groceryItems].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
  });

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <ShoppingBag className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-lg font-medium">Grocery List</h3>
      </div>

      <div className="flex mb-4">
        <Input
          placeholder="Add grocery item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="rounded-r-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addGroceryItem();
            }
          }}
        />
        <Button onClick={addGroceryItem} className="rounded-l-none">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {groceryItems.length > 0 && (
        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCompletedItems}
            className="text-xs text-gray-500"
          >
            Clear completed
          </Button>
        </div>
      )}

      <div className="space-y-2 mb-6">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                item.completed
                  ? "bg-gray-50 border-gray-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full p-1 h-auto mr-2 ${
                    item.completed ? "text-green-600" : "text-gray-400"
                  }`}
                  onClick={() => toggleItemCompletion(item.id)}
                >
                  <Check className="h-5 w-5" />
                </Button>
                <span
                  className={`${
                    item.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {item.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-500 p-1 h-auto"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            Your grocery list is empty
          </div>
        )}
      </div>

      {suggestedItems.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">
            Suggested items from your meal plan:
          </h4>
          <div className="flex flex-wrap gap-2">
            {suggestedItems.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => addSuggestedItem(item)}
              >
                {item} <Plus className="h-3 w-3 ml-1" />
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
