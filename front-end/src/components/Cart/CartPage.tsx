'use client';

import React, { useState } from 'react';
import { useCart } from './CartContext';
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/navigation';


const CartPage = () => {
    const { cart, loading, itemsCount, formattedTotal, updateItem, removeItem, emptyCart , checkout  } = useCart();
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex justify-center items-center h-64">
                    <p>Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (!cart || itemsCount === 0) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-white/55 backdrop-blur-xl rounded-lg shadow-md p-6 mb-4 mt-15 ">
                    <p className="text-center mb-10">Your cart is empty...</p>
                    <div className="flex justify-center mt-4">
                        <Link
                            href="/products"
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleCheckout = async () => {
        if (isCheckingOut) return;

        setIsCheckingOut(true);
        try {
            const order = await checkout();
            router.push(`/orders/${order.id}`);
        } catch (error) {

            console.error('Checkout failed:', error);
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        await updateItem(cartItemId, newQuantity);
    };

    const handleRemoveItem = async (cartItemId: number) => {
        await removeItem(cartItemId);
    };

    const handleClearCart = async () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            await emptyCart();
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-25">
                <div className="relative lg:col-span-2">
                    <div className="bg-white/55 backdrop-blur-xl rounded-lg shadow-md p-6 mb-4">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-400">
                                <th className="text-left py-4">Product</th>
                                <th className="text-center py-4">Quantity</th>
                                <th className="text-right py-4">Price</th>
                                <th className="text-right py-4">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cart.items.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="py-4">
                                        <div className="flex items-center">
                                            <Image
                                                src={item.product.display_photo_url || "https://i.postimg.cc/sgs5xf0d/img.png"}
                                                alt={item.product.name}
                                                width={100}
                                                height={100}
                                                className="object-cover rounded"
                                                sizes="64px"
                                            />
                                            <span className="m-5">{item.product.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                className="bg-gray-200 px-3 py-1 rounded-l"
                                            >
                                                -
                                            </button>
                                            <span className="px-4">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                className="bg-gray-200 px-3 py-1 rounded-r"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right">
                                        {item.product.formatted_final_price}
                                    </td>
                                    <td className="py-4 text-right">
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleClearCart}
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="bg-white/65 backdrop-blur-xl relative rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span>Items ({itemsCount}):</span>
                            <span>{formattedTotal}</span>
                        </div>
                        <div className="border-t border-gray-200 mt-4 pt-4">
                            <div className="flex justify-between font-semibold">
                                <span>Total:</span>
                                <span>{formattedTotal}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut || loading}
                            className="block w-full bg-blue-500 text-white text-center py-2 px-4 rounded mt-6 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;