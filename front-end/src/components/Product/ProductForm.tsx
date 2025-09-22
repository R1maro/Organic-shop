'use client';
import {useState, useEffect} from 'react';
import {ProductFormProps} from "@/types/product";
import config from "@/config/config";
import Image from "next/image";



export default function ProductForm({
                                        categories,
                                        action,
                                        initialData
                                    }: ProductFormProps & {
    action: (formData: FormData) => Promise<void>
}) {
    const [selectedCategory, setSelectedCategory] = useState<number | ''>(
        initialData?.category_id || ''
    );
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [displayPhotoIndex, setDisplayPhotoIndex] = useState<number>(initialData?.display_photo_index ?? 0);


    const [price, setPrice] = useState<string>(initialData?.price?.toString() || "");
    const [discount, setDiscount] = useState<string>(initialData?.discount?.toString() || "");

    useEffect(() => {
        if (initialData?.category_id) {
            setSelectedCategory(initialData.category_id);
        }
        if (Array.isArray(initialData?.image_urls)) {
            setPreviewImages(initialData.image_urls);
        } else {
            setPreviewImages([]);
        }
        if (typeof initialData?.display_photo_index === 'number') {
            setDisplayPhotoIndex(initialData.display_photo_index);
        }
    }, [initialData?.category_id, initialData?.image_urls,initialData?.display_photo_index]);


    const handleFileSelection = (files: FileList | null) => {
        if (files) {
            const fileArray = Array.from(files);

            const totalImages = previewImages.length + fileArray.length;
            if (totalImages > 5) {
                alert("You can only upload up to 5 images.");
                return;
            }
            setSelectedFiles(prev => [...prev, ...fileArray]);

            const previews = fileArray.map((file) => {
                const reader = new FileReader();
                return new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(previews).then((newImages) => {
                setPreviewImages(prev => [...prev, ...newImages]);
            });
        }
    };
    const handleImageDelete = async (index: number) => {
        const imageUrl = previewImages[index];
        const isExistingImage = initialData?.image_urls?.includes(imageUrl); // Check if it's an existing image

        try {
            if (isExistingImage) {
                const response = await fetch(`${config.API_URL}/admin/products/${initialData?.id}/image`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image_url: imageUrl }),
                });

                if (!response.ok) {
                    throw new Error('Failed to delete image');
                }
            }
            if (index === displayPhotoIndex && previewImages.length > 1) {
                setDisplayPhotoIndex(0);
            } else if (index < displayPhotoIndex) {
                setDisplayPhotoIndex(prev => prev - 1);
            }

            setPreviewImages((prevImages) => prevImages.filter((_, i) => i !== index));
            setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        formData.delete('images[]');

        formData.append('display_photo_index', displayPhotoIndex.toString());

        selectedFiles.forEach(file => {
            formData.append('images[]', file);
        });

        await action(formData);
    };
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelection(event.target.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-gray-300');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-gray-300');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-gray-300');
        handleFileSelection(e.dataTransfer.files);
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
        <form action={action} onSubmit={handleSubmit}>
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
                        <label htmlFor="shipping_time" className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Shipping Time
                        </label>
                        <input
                            type="text"
                            id="shipping_time"
                            name="shipping_time"
                            placeholder="7 Day"
                            defaultValue={initialData?.shipping_time}
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
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(Number(e.target.value))}
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
                    <label htmlFor="images" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        {initialData?.image_urls ? 'New Product Image' : 'Product Image'}
                    </label>
                    <div
                        className="relative w-full h-[300px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            id="images"
                            name="images[]"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        <label
                            htmlFor="images"
                            className="absolute inset-0 flex flex-col items-center justify-center"
                        >
                            <span className="text-6xl text-gray-400 mb-4">+</span>
                            <p className="text-gray-500">Click or drag and drop images here</p>
                            <p className="text-gray-400 text-sm mt-2">Up to 5 images allowed</p>
                        </label>
                    </div>
                </div>

                {previewImages.length > 0 && (
                    <div className="w-full">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Product Images (Click to set display photo)
                        </label>
                        <div className="flex flex-wrap gap-4">
                            {previewImages.map((src, index) => (
                                <div key={index} className="relative">
                                    <div
                                        className={`w-full h-32 object-cover rounded-md cursor-pointer ${
                                            index === displayPhotoIndex ? 'ring-4 ring-blue-500' : ''
                                            
                                        }`}
                                        onClick={() => setDisplayPhotoIndex(index)}
                                    >
                                        <Image
                                            src={src}
                                            alt={`Preview ${index}`}
                                            width={200}
                                            height={200}
                                            className="object-cover rounded-md"
                                            sizes="128px"
                                            priority
                                        />
                                        {index === displayPhotoIndex && (
                                            <span className="absolute bottom-0 left-5 bg-blue-500 text-white px-2 py-1 rounded-md text-xs">
                                            Display Photo
                                        </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleImageDelete(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 px-2 rounded-full text-xs"
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
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