import Link from 'next/link';
import Pagination from '@/components/Pagination/Pagination';
import {getBlogs} from '@/utils/dashboard/blog';
import {BlogApiListResponse, BlogApiResponse, MediaUrls} from "@/types/blog";
import config from "@/config/config";
import BlogActions from "@/components/Blogs/BlogActions";
import Image from "next/image";

interface BlogListProps {
    page?: number;
    categoryId?: string;
    status?: string;
    search?: string;
}

async function BlogList({
                            page = 1,
                            categoryId,
                            status,
                            search
                        }: BlogListProps) {
    const blogs: BlogApiListResponse = await getBlogs(page, categoryId, status, search);

    const isMediaUrls = (featured_image: any): featured_image is MediaUrls => {
        return featured_image && 'original' in featured_image;
    };
    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <div className="mb-6 flex flex-col gap-3">
                <Link
                    href="/dashboard/blogs/create"
                    className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                    Add Blog
                </Link>
            </div>

            <div
                className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[80px] py-4 px-4 font-medium text-black dark:text-white">
                                Image
                            </th>
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                Title
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                Author
                            </th>
                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                Status
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {blogs.data.map((blog: BlogApiResponse) => (
                            <tr key={blog.id}>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    {blog.featured_image && isMediaUrls(blog.featured_image) ? (
                                        <div className="relative h-20 w-20">
                                            <Image
                                                src={`${config.PUBLIC_URL}${blog.featured_image.original}`}
                                                alt={blog.title}
                                                width={100}
                                                height={100}
                                                className="object-cover rounded-md"
                                                sizes="80px"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="flex h-20 w-20 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                                            <svg
                                                className="h-8 w-8 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                                    {blog.title}
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    {blog.author?.name}
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                            blog.status
                                ? 'bg-success text-success'
                                : 'bg-danger text-danger'
                        }`}
                    >
                      {blog.status || ''}
                    </span>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <BlogActions blog={blog}/>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={blogs.meta.current_page}
                    totalItems={blogs.meta.total}
                    itemsPerPage={blogs.meta.per_page}
                    baseUrl="/dashboard/blogs"
                    searchParams={{
                        ...(categoryId ? { category_id: categoryId } : {}),
                        ...(status ? { status } : {}),
                        ...(search ? { search } : {})
                    }}
                    showItemCount={true}
                    className="sm:flex sm:flex-1 sm:items-center sm:justify-between"
                />
            </div>
        </div>
    );
}

export default BlogList;
