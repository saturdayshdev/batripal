"use server";

import { db } from "@/db";
import { surgeries } from "../../../drizzle/schema";
import { redirect } from "next/navigation";

interface SurgeryDataProps {
  id: string;
  name: string;
  surgeryDate: Date | undefined;
  weight: number | null;
  surgeryType: "sleve" | "bypass";
  additionalInfo: string;
}

export async function insertSurgeryData(input: SurgeryDataProps) {
  const { id, name, surgeryDate, weight, surgeryType, additionalInfo } = input;
  console.log("Inserting data:", {
    id,
    name,
    surgeryDate,
    weight,
    surgeryType,
    additionalInfo,
  });

  try {
    await db.insert(surgeries).values({
      id,
      name,
      surgeryDate: surgeryDate ? surgeryDate.toISOString() : null,
      weight,
      surgeryType,
      additionalInfo,
    });
    redirect(`/chat/${id}`);
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
}
