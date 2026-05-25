'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TrashBinModal from "@/components/TrashBin/TrashBinModal";
import {
    getTrashedProducts,
    restoreProduct,
    forceDeleteProduct,
} from "@/utils/dashboard/product-client";
import { Product } from "@/types/product";

export default function ProductActionBar() {
    const router = useRouter();
    const [isTrashedModalOpen, setIsTrashedModalOpen] = useState(false);

    const handleProductRestored = () => {
        router.refresh();
    };

    return (
        <div className="mb-6 flex flex-row gap-3 flex-wrap">
            <Link
                href="/dashboard/products/create"
                className="flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                </svg>
                Add Product
            </Link>

            <button
                onClick={() => setIsTrashedModalOpen(true)}
                className="flex items-center justify-center gap-2.5 rounded-md bg-warning py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
                Trash Bin
            </button>

            <TrashBinModal<Product>
                isOpen={isTrashedModalOpen}
                onClose={() => setIsTrashedModalOpen(false)}
                title="Trashed Products"
                itemLabel="product"
                fetchItems={getTrashedProducts}
                restoreItem={restoreProduct}
                forceDeleteItem={forceDeleteProduct}
                onRestored={handleProductRestored}
                columns={[
                    {
                        header: 'Name',
                        accessor: (item) => item.name,
                    },
                    {
                        header: 'Price',
                        accessor: (item) => item.formatted_final_price ?? `$${item.price}`,
                    },
                ]}
            />
        </div>
    );
}