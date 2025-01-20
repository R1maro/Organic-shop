'use client';

import { CategoryFormData } from '@/types/category';

interface CategoryFormProps {
    categories: CategoryFormData[];
    action: (formData: FormData) => Promise<void>;
    initialData?: {
        name?: string;
        description?: string;
        status?: boolean;
        parent_id?: number | null;
    };
}

export default function CategoryForm({categories, action, initialData }: CategoryFormProps) {
    return (
        <form action={action}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="name" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={initialData?.name}
                        required
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={initialData?.description}
                        rows={4}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-md text-black dark:text-white font-medium">Status:</span>
                    <label className="relative inline-block w-14 h-8">
                        <input
                            type="checkbox"
                            id="status"
                            name="status"
                            defaultChecked={initialData?.status ?? true}
                            className="peer hidden"
                        />
                        <span
                            className="absolute inset-0 bg-gray-300 rounded-full transition duration-300 peer-checked:bg-blue-500"
                        ></span>
                        <span
                            className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-6"
                        ></span>
                    </label>
                </div>
                <div>
                    <label htmlFor="parent_id" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Parent Category
                    </label>
                    <select
                        id="parent_id"
                        name="parent_id"
                        defaultValue={initialData?.parent_id?.toString() || ''}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                        <option value="">None (Top Level Category)</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => history.back()}
                        className="px-4 py-2 border rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        {initialData ? 'Update Category' : 'Create Category'}
                    </button>
                </div>
            </div>
        </form>
    );
}