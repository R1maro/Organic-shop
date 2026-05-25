import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import { getProducts } from '@/utils/dashboard/product';
import Image from "next/image";
import ProductActionBar from "@/components/Product/ProductActionBar";
import DeleteProductButton from "@/components/Product/DeleteProductButton";

async function ProductList({ page = 1, categoryId }: {
    page?: number;
    categoryId?: string;
}) {
    const products = await getProducts(page, categoryId);

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <ProductActionBar />

            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[80px] py-4 px-4 font-medium text-black dark:text-white">Image</th>
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Name</th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Price</th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Status</th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.data.map((product) => (
                            <tr key={product.id}>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    {product.display_photo_url ? (
                                        <Image
                                            src={product.display_photo_url}
                                            alt={product.name}
                                            width={100}
                                            height={100}
                                            className="object-cover rounded-md"
                                            sizes="80px"
                                        />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                                    {product.name}
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    {product.formatted_final_price}
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <span
                                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                                            product.status
                                                ? 'bg-success text-success'
                                                : 'bg-danger text-danger'
                                        }`}
                                    >
                                        {product.status ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <div className="flex items-center space-x-3.5">
                                        <Link
                                            href={`/dashboard/products/edit/${product.id}`}
                                            className="hover:text-primary"
                                            title="Edit Product"
                                        >
                                            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                            </svg>
                                        </Link>
                                        <DeleteProductButton
                                            productId={product.id}
                                            productName={product.name}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={products.meta.current_page}
                    totalItems={products.meta.total}
                    itemsPerPage={products.meta.per_page}
                    baseUrl="/dashboard/products"
                    searchParams={categoryId ? { category_id: categoryId } : {}}
                    showItemCount={true}
                    className="sm:flex sm:flex-1 sm:items-center sm:justify-before"
                />
            </div>
        </div>
    );
}

export default ProductList;