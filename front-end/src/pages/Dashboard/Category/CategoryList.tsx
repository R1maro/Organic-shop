import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-hot-toast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import {categoryService, Category} from '../../../services/dashboard/categoryService.ts';
import Loader from '../../../common/Loader';


interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const CategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    useEffect(() => {
        fetchCategories(1);
    }, []);

    const fetchCategories = async (page: number) => {
        try {
            const response = await categoryService.getAll(page);
            setCategories(response.data);
            setPagination({
                current_page: response.current_page,
                last_page: response.last_page,
                per_page: response.per_page,
                total: response.total
            });
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoryService.delete(id);
                toast.success('Category deleted successfully');
                fetchCategories(pagination.current_page);
            } catch (error) {
                toast.error('Failed to delete category');
            }
        }
    };

    const renderCategory = (category: any) => {
        return (
            <tr key={category.id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                        {category.name}
                    </h5>
                    {category.children?.length > 0 && (
                        <div className="pl-6">
                            <table>
                                <tbody>
                                {category.children.map((child: any) => renderCategory(child))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                        {category.description || '-'}
                    </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                            category.is_active
                                ? 'bg-success text-success'
                                : 'bg-danger text-danger'
                        }`}
                    >
                        {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                        <Link
                            to={`/categories/edit/${category.id}`}
                            className="hover:text-primary"
                            title="Edit Category"
                        >

                            <svg className="w-6 h-6"
                                 aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                                 height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth="1.5"
                                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                            </svg>
                        </Link>
                        <button
                            onClick={() => handleDelete(category.id)}
                            className="hover:text-danger"
                            title="Delete Category"
                        >

                            <svg
                                className="fill-current"
                                width="20"
                                height="20"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                    fill=""
                                />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= pagination.last_page; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => fetchCategories(i)}
                    className={`px-3 py-1 rounded-md ${
                        pagination.current_page === i
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    if (loading) return <Loader/>;

    return (
        <>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mb-6 flex flex-col gap-3 ">
                    <Breadcrumb pageName="Categories"/>
                    <Link
                        to="/categories/create"
                        className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >

                        Add Category
                    </Link>
                </div>

                <div
                    className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Name
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Description
                                </th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                    Status
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {categories.map((category: any) => renderCategory(category))}
                            </tbody>

                        </table>
                    </div>
                    <div
                        className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={() => fetchCategories(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => fetchCategories(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {(pagination.current_page - 1) * pagination.per_page + 1}
                                    </span>{' '}
                                    to{' '}
                                    <span className="font-medium">
                                        {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-medium">{pagination.total}</span>{' '}
                                    results
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {renderPagination()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryList;