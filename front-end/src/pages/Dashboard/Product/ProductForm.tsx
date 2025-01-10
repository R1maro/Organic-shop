import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { productService } from '../../../services/dashboard/productService.ts';
import { categoryService } from '../../../services/dashboard/categoryService.ts';
import type { ProductInput } from '../../../services/dashboard/productService.ts';
import Loader from '../../../common/Loader';
import config from "../../../config";

interface Category {
    id: number;
    name: string;
}


interface ProductFormData extends ProductInput {
    image: File | null;
}

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: 0,
        discount: 0,
        quantity: 0,
        sku: '',
        image: null,
        category_id: 0,
        status: true,
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchProduct();
        } else {
            setPreviewImage(null);
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getAll();
            setCategories(response.data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await productService.getById(Number(id));
            setFormData({
                name: response.name,
                description: response.description ?? '',
                price: response.price,
                discount: response.discount ?? 0,
                quantity: response.quantity,
                sku: response.sku,
                image: null,
                category_id: response.category_id,
                status: response.status,
            });

            if (response.media && response.media.length > 0) {
                const mediaUrl = response.media[0].original_url;
                setPreviewImage(
                    mediaUrl.startsWith('http')
                        ? mediaUrl
                        : `${config.PUBLIC_URL}${mediaUrl}`
                );
            } else {
                setPreviewImage(null);
            }
        } catch (error) {
            toast.error('Failed to fetch product');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();

        // Convert and append form fields
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'image' && value instanceof File) {
                formDataToSend.append('image', value);
            } else if (key === 'status') {
                formDataToSend.append(key, value ? '1' : '0');
            } else if (value !== null && value !== undefined) {
                formDataToSend.append(key, value.toString());
            }
        });

        try {
            if (id) {
                await productService.update(Number(id), formDataToSend);
                toast.success('Product updated successfully');
            } else {
                await productService.create(formDataToSend);
                toast.success('Product created successfully');
            }
            navigate('/products');
        } catch (error: unknown) {
            if (error instanceof Error) {
                const axiosError = error as any;
                if (axiosError.response?.data?.errors) {
                    Object.values(axiosError.response.data.errors).forEach((errorMessages: unknown) => {
                        if (Array.isArray(errorMessages)) {
                            errorMessages.forEach((message: string) => {
                                toast.error(message);
                            });
                        }
                    });
                } else {
                    toast.error(id ? 'Failed to update product' : 'Failed to create product');
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (value: string): string => {
        const numericValue = value.replace(/,/g, '');
        return !isNaN(Number(numericValue))
            ? new Intl.NumberFormat('en-US').format(Number(numericValue))
            : value;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, type, value } = e.target;

        // Type guard for input[type="checkbox"]
        if (type === 'checkbox') {
            const inputElement = e.target as HTMLInputElement; // Narrowing type to HTMLInputElement
            setFormData(prev => ({ ...prev, [name]: inputElement.checked }));
        }
        // Handle file input
        else if (type === 'file' && e.target instanceof HTMLInputElement && e.target.files) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
        // Handle number and text inputs (like price, discount, etc.)
        else if (name === 'price' || name === 'discount') {
            const formattedValue = formatPrice(value);
            setFormData(prev => ({
                ...prev,
                [name]: Number(formattedValue.replace(/,/g, '')),
            }));
        }
        // Handle select elements
        else if (name === 'category_id') {
            setFormData(prev => ({
                ...prev,
                [name]: Number(value),
            }));
        }
        // Handle other input types (like text, textarea, etc.)
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };


    if (loading) return <Loader />;

    return (
        <>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Breadcrumb pageName={id ? 'Edit Product' : 'Create Product'} />

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            {id ? 'Edit Product' : 'Create New Product'}
                        </h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Name <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    required
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Enter product description"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4.5">
                                <div>
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Price <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formatPrice(formData.price.toString())}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Discount
                                    </label>
                                    <input
                                        type="text"
                                        name="discount"
                                        value={formatPrice((formData.discount ?? 0).toString())}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4.5">
                                <div>
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Quantity <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        SKU <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Category <span className="text-meta-1">*</span>
                                </label>
                                <select
                                    name="category_id"
                                    value={formData.category_id || ''}
                                    onChange={handleChange}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Product Image
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                {previewImage && (
                                    <div className="mt-2">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="max-w-xs rounded"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="flex cursor-pointer select-none items-center">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="status"
                                            className="sr-only"
                                            checked={formData.status}
                                            onChange={handleChange}
                                        />
                                        <div
                                            className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                                                formData.status
                                                    ? 'border-primary bg-primary'
                                                    : 'border-stroke dark:border-strokedark'
                                            }`}
                                        >
                                            <span className={`opacity-0 ${formData.status && '!opacity-100'}`}>
                                                <svg
                                                    width="11"
                                                    height="8"
                                                    viewBox="0 0 11 8"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                                        fill="#fff"
                                                        stroke="#fff"
                                                        strokeWidth="0.4"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    Active
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                            >
                                {loading ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProductForm;