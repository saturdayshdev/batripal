"use client";

import { useState } from "react";
import { Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MealPlanSidebar from "@/components/meal-plan-sidebar";

export default function MealButton() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Utensils className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
          <span className="sr-only">Meal Plan</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="p-0 w-full sm:w-[85vw] sm:max-w-[350px]"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Meal Plan</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <MealPlanSidebar />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
