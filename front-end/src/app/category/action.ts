"use server";

import { revalidatePath } from "next/cache";
import type { Category } from "@/Services/categoryService";

const BASE_URL = "http://localhost:8000/api/admin";

export async function deleteCategory(id: number) {
  try {
    const response = await fetch(`${BASE_URL}/categories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete category");
    }

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
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
      throw new Error("Failed to update category");
    }

    revalidatePath("/admin/categories");
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}
