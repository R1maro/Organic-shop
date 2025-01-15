// services/categoryService.ts
import config from "@/Config/config";
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  is_active: boolean;
  children: Category[];
  parent: Category | null;
}

export interface PaginatedResponse {
  data: Category[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const categoryService = {
  getCategories: async (page: number = 1): Promise<PaginatedResponse> => {
    try {
      const response = await fetch(
        `${config.API_URL}/admin/categories?page=${page}`,
        {
          cache: "no-store", // This ensures fresh data on each request
        },
      );

      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};
