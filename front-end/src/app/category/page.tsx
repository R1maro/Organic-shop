import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CategoryList from "@/components/Categories/CategoryList";
import { categoryService } from "@/Services/categoryService";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Categories | TailAdmin Next.js",
  description: "Category management page",
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;

  try {
    const categories = await categoryService.getCategories(page);

    return (
      <>
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <DefaultLayout>
            <Breadcrumb pageName="Categories" />
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <button className="flex items-center gap-2 rounded-sm bg-primary px-4.5 py-2 font-medium text-white hover:bg-opacity-90">
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Category
              </button>
            </div>
            <CategoryList initialData={categories} />
          </DefaultLayout>
        </div>
      </>
    );
  } catch (error) {
    return (
      <div className="rounded-sm border border-stroke bg-white p-4">
        <p className="text-danger">
          Error loading categories. Please try again later.
        </p>
      </div>
    );
  }
}
