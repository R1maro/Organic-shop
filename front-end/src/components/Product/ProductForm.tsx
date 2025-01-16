
'use client';
import { useState } from 'react';
import config from "@/config/config";

interface Category {
    id: number;
    name: string;
}

interface ProductFormProps {
    categories: Category[];
    action: (formData: FormData) => Promise<void>;
    initialData?: {
        name?: string;
        description?: string;
        price?: number;
        discount?: number;
        quantity?: number;
        sku?: string;
        category_id?: number;
        status?: boolean;
        image_url?: string;
    };
}

export default function ProductForm({ categories, action, initialData }: ProductFormProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(
        initialData?.image_url ? `${config.PUBLIC_URL}${initialData.image_url}` : null
    );
    const [price, setPrice] = useState<string>(initialData?.price?.toString() || "");
    const [discount, setDiscount] = useState<string>(initialData?.discount?.toString() || "");

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(initialData?.image_url ? `${config.PUBLIC_URL}${initialData.image_url}` : null);
        }
    };

    const formatNumber = (value: string) => {
        if (!value) return "";
        const numberValue = value.replace(/\D/g, ""); // Remove non-numeric characters
        return new Intl.NumberFormat().format(Number(numberValue)); // Format with commas
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(formatNumber(event.target.value));
    };

    const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDiscount(formatNumber(event.target.value));
    };
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

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="price" className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Price
                        </label>
                        <input
                            type="text"
                            id="price"
                            name="price"
                            value={price}
                            onChange={handlePriceChange}
                            placeholder="Enter price"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="discount" className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Discount
                        </label>
                        <input
                            type="text"
                            id="discount"
                            name="discount"
                            value={discount}
                            onChange={handleDiscountChange}
                            placeholder="Enter discount"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="quantity" className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Quantity
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            defaultValue={initialData?.quantity}
                            min="0"
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="sku" className="mb-3 block text-sm font-medium text-black dark:text-white">
                            SKU
                        </label>
                        <input
                            type="text"
                            id="sku"
                            name="sku"
                            defaultValue={initialData?.sku}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                </div>


                <div>
                    <label htmlFor="category_id" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Category
                    </label>
                    <select
                        id="category_id"
                        name="category_id"
                        defaultValue={initialData?.category_id}
                        required
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
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
                    <label htmlFor="image" className="mb-3 mt-5 block text-sm font-medium text-black dark:text-white">
                        {initialData?.image_url ? 'New Product Image' : 'Product Image'}
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                        onChange={handleImageChange}
                    />
                </div>

                {previewImage && (
                    <div className="mt-2">
                        <p className="text-sm font-medium mb-2">Image Preview:</p>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-md"
                        />
                    </div>
                )}


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
                        {initialData ? 'Update Product' : 'Create Product'}
                    </button>
                </div>
            </div>
        </form>
    );
}