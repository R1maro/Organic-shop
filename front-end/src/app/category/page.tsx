import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
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
                <DefaultLayout>
                            <Breadcrumb pageName="Categories"/>
                            >
                                Add Category
                        </div>
                            <CategoryList initialData={categories}/>
                </DefaultLayout>
            </>
        );
    } catch (error) {
        return (
                <div className="rounded-sm border border-stroke bg-white p-4">
            </div>
        );
    }
}