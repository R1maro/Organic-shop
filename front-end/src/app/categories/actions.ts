"use server";

import { revalidatePath } from "next/cache";
import type { Category } from "@/services/categoryService";

const BASE_URL = "http://localhost:8000/api/admin";

export async function deleteCategory(id: number) {
  try {
    const response = await fetch(`${BASE_URL}/categories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete categories");
    }

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting categories:", error);
    return { success: false, error: "Failed to delete categories" };
  }
}

export async function editCategory(id: number, data: Partial<Category>) {
  try {
    const response = await fetch(`${BASE_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update categories");
    }

    revalidatePath("/admin/categories");
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Error updating categories:", error);
    return { success: false, error: "Failed to update categories" };
  }
}
