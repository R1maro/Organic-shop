"use client";

import { useRouter } from "next/navigation";
import CategoryItem from "@/components/Categories/CategoryItem";
import { deleteCategory, editCategory } from "@/app/category/action";
import type { PaginatedResponse, Category } from "@/Services/categoryService";

interface CategoryListProps {
  initialData: PaginatedResponse;
}

const CategoryList = ({ initialData }: CategoryListProps) => {
  const router = useRouter();

  const handleEdit = async (category: Category) => {
    // Implement edit modal/form logic here
    console.log("Edit category:", category);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const result = await deleteCategory(id);
      if (result.success) {
        router.refresh(); // This will trigger a server-side rerender
      } else {
        alert("Failed to delete category");
      }
    }
  };

  return (
    <>
      <div className="max-w-full overflow-x-auto">
        <div className="space-y-1">
          {initialData.data.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {initialData.last_page > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-3 py-4">
          {Array.from({ length: initialData.last_page }).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => {
                router.push(`/admin/categories?page=${index + 1}`);
              }}
              className={`flex items-center justify-center rounded-sm ${
                initialData.current_page === index + 1
                  ? "bg-primary text-white"
                  : "bg-gray hover:bg-primary hover:text-white"
              } px-3 py-1.5 font-medium`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default CategoryList;
