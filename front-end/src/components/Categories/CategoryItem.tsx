"use client";

import { useState } from "react";
import type { Category } from "@/services/categoryService";

interface CategoryItemProps {
  category: Category;
  level?: number;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => Promise<void>;
}

const CategoryItem = ({
  category,
  level = 0,
  onEdit,
  onDelete,
}: CategoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full">
      <div
        className={`flex items-center rounded-sm p-4 hover:bg-gray-2 dark:hover:bg-meta-4
          ${level > 0 ? "ml-6" : ""}`}
      >
        {category.children.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 rounded-sm p-1 hover:bg-gray-2 dark:hover:bg-meta-4"
          >
            <svg
              className={`h-4 w-4 transform transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        <span
          className={`flex-grow ${!category.is_active ? "text-gray-4" : ""}`}
        >
          {category.name}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(category)}
            className="hover:text-primary"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="hover:text-danger"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded &&
        category.children.map((child) => (
          <CategoryItem
            key={child.id}
            category={child}
            level={level + 1}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
};

export default CategoryItem;
