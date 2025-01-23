import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import BlogForm from '@/components/Blogs/BlogForm';
import { apiUpdateBlog, getCategories, getAllTags, getBlog } from "@/utils/api";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import { BlogApiData, BlogFormData } from "@/types/blog";

export const metadata: Metadata = {
    title: 'Edit Blog | Admin Dashboard',
    description: 'Edit blog post',
};

async function updateBlogAction(id: string, formData: FormData) {
    'use server'

    try {
        const metaKeywords = JSON.parse(formData.get('meta_keywords')?.toString() || '[]');
        const categories = JSON.parse(formData.get('categories')?.toString() || '[]');
        const tags = JSON.parse(formData.get('tags')?.toString() || '[]');

        const data: BlogApiData = {
            title: formData.get('title')?.toString() || '',
            content: formData.get('content')?.toString() || '',
            excerpt: formData.get('excerpt')?.toString() || '',
            status: formData.get('status')?.toString() || 'draft',
            published_at: formData.get('published_at')?.toString(),
            meta_title: formData.get('meta_title')?.toString(),
            meta_description: formData.get('meta_description')?.toString(),
            meta_keywords: metaKeywords,
            categories: categories,
            tags: tags,
            featured_image: formData.get('featured_image') as File || undefined,
        };

        await apiUpdateBlog(id, data);

        revalidatePath('/dashboard/blogs');
        redirect('/dashboard/blogs');
    } catch (error) {
        console.error('Error updating blog:', error);
        throw error;
    }
}

export default async function EditBlogPage({
                                               params: { id },
                                           }: {
    params: { id: string };
}) {
    const [blogResponse, categoriesResponse, tagsResponse] = await Promise.all([
        getBlog(id),
        getCategories(),
        getAllTags(),
    ]);

    const blog = blogResponse.data;
    const categories = categoriesResponse.data;
    const tags = tagsResponse.data;

    const initialFormData: BlogFormData = {
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        featured_image: blog.featured_image,
        status: blog.status,
        published_at: blog.published_at,
        meta: {
            title: blog.meta_title,
            description: blog.meta_description,
            keywords: blog.meta_keywords,
        },
        categories: blog.categories,
        tags: blog.tags,
    };

    return (
        <DefaultLayout>
            <div className="min-h-screen max-w-5xl mx-auto p-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
                <BlogForm
                    categories={categories}
                    tags={tags}
                    action={async (formData: FormData) => {
                        'use server';
                        await updateBlogAction(id, formData);
                    }}
                    initialData={initialFormData}
                />
            </div>
        </DefaultLayout>
    );
}