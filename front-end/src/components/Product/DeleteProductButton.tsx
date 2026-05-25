'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { softDeleteProduct } from "@/utils/dashboard/product-client";

interface DeleteProductButtonProps {
    productId: number;
    productName: string;
}

export default function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
    const router = useRouter();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        const result = await softDeleteProduct(productId);

        if (result.success) {
            setIsConfirmOpen(false);
            router.refresh();
        } else {
            setError(result.error || 'Failed to delete product');
        }

        setIsDeleting(false);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsConfirmOpen(true)}
                className="hover:text-danger"
                title="Delete Product"
            >
                <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" />
                </svg>
            </button>

            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md bg-white dark:bg-boxdark rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
                                Delete Product
                            </h3>
                            <p className="mb-6 text-body dark:text-bodydark">
                                Are you sure you want to delete <strong>{productName}</strong>? This will move it to the trash bin and you can restore it later.
                            </p>

                            {error && (
                                <div className="mb-5 rounded-md bg-danger bg-opacity-10 px-4 py-3 text-danger">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmOpen(false)}
                                    disabled={isDeleting}
                                    className="flex items-center justify-center gap-2.5 rounded-md border border-stroke py-3 px-6 text-center font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex items-center justify-center gap-2.5 rounded-md bg-danger py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-70"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Product'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}