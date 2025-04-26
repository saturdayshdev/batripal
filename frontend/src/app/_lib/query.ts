"use server";

import { db } from "@/db";
import { surgeries } from "../../../drizzle/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

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

export async function selectNamebyId(id: string) {
  try {
    const result = await db
      .select({ name: surgeries.name })
      .from(surgeries)
      .where(eq(surgeries.id, id))
      .limit(1);

    const name = result[0];

    if (name === undefined) {
      throw new Error("Name not found");
    }

    if (name) {
      return name;
    } else {
      throw new Error("No data found");
    }
  } catch (error) {
    console.error("Error fetching name by ID:", error);
    throw error;
  }
}
