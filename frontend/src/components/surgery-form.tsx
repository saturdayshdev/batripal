"use client";

import { CalendarIcon, Scale, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Form from "next/form";
import { insertSurgeryData } from "@/app/_lib/query";

export function SurgeryForm() {
  const [surgeryDate, setDate] = useState<Date>();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string;
    const weight = formData.get("weight") as number | null;
    const surgeryType = formData.get("surgeryType") as "sleve" | "bypass";
    const additionalInfo = formData.get("additionalInfo") as string;

    startTransition(() => {
      insertSurgeryData({
        id: crypto.randomUUID(),
        name,
        surgeryDate,
        weight,
        surgeryType,
        additionalInfo,
      });
    });
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <Form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <Label htmlFor="name">Your Name</Label>
          </div>
          <Input name="name" placeholder="Enter your name" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <Label htmlFor="date">Surgery Date</Label>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !surgeryDate && "text-muted-foreground"
                )}
              >
                {surgeryDate
                  ? format(surgeryDate, "PPP")
                  : "Select surgery date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={surgeryDate}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <Label htmlFor="weight">Current Weight (kg)</Label>
          </div>
          <Input
            name="weight"
            type="number"
            placeholder="Enter your current weight"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="surgeryType">Surgery Type</Label>
          <Tabs defaultValue="sleve">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="sleve">Sleve</TabsTrigger>
              <TabsTrigger value="bypass">Bypass</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInfo">Additional Information</Label>
          <Textarea
            name="additionalInfo"
            placeholder="Share any relevant information about your journey, food intolerances, goals, etc."
            className="min-h-[150px]"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          Submit
        </Button>
      </Form>
    </div>
  );
}
