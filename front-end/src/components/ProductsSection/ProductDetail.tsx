'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/components/Cart/CartContext';
import { ProductDetail as ProductDetailType } from '@/types/product';
import { ShoppingCart, Heart, Share2, Truck, ShieldCheck, RotateCcw, Plus, Minus, Star } from 'lucide-react';

interface ProductDetailProps {
    product: ProductDetailType;
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const { addItem } = useCart();

    const [selectedImage, setSelectedImage] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleAddToCart = async () => {
        if (isAdding) return;

        setIsAdding(true);
        try {
            await addItem(product.id, quantity);
        } catch (error) {
            console.error('Failed to add product to cart:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const incrementQuantity = () => {
        if (quantity < product.quantity) {
            setQuantity(prev => prev + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const features = [
        { icon: Truck, text: "Free shipping on orders over $100" },
        { icon: RotateCcw, text: "30-day return policy" },
        { icon: ShieldCheck, text: "2-year warranty included" }
    ];

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
                <div className="bg-white/55 backdrop-blur-xl mb-50 mt-10 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black inset-shadow-black-100 overflow-hidden">
                    <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-12">
                        {/* Image Gallery Section */}
                        <div className="space-y-3 sm:space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group">
                                <Image
                                    src={product.images[selectedImage]?.url || product.display_photo_url || 'https://i.postimg.cc/sgs5xf0d/img.png'}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110 p-10"
                                    priority
                                />

                                {/* Favorite & Share Buttons */}
                                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1.5 sm:gap-2">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`p-2 sm:p-3 rounded-full backdrop-blur-md transition-all ${
                                            isFavorite
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/90 text-gray-700 hover:bg-white'
                                        }`}
                                    >
                                        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                    <button className="p-2 sm:p-3 rounded-full bg-white/90 backdrop-blur-md text-gray-700 hover:bg-white transition-all">
                                        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>

                                {/* Discount Badge */}
                                {product.discount > 0 && (
                                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold shadow-lg text-xs sm:text-sm">
                                        Save ${product.discount}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative aspect-square rounded-lg sm:rounded-xl overflow-hidden transition-all ${
                                                selectedImage === index
                                                    ? 'ring-2 sm:ring-4 ring-blue-500 scale-95'
                                                    : 'ring-2 ring-gray-200 hover:ring-gray-300'
                                            }`}>
                                            <Image
                                                src={image.thumb}
                                                alt={`${product.name} thumbnail ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details Section */}
                        <div className="flex flex-col">
                            {/* Category & Rating */}
                            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                                {product.category_name && (
                                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
                                        {product.category_name}
                                    </span>
                                )}
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    <span className="ml-1.5 text-gray-600 text-xs sm:text-sm">(4.8)</span>
                                </div>
                            </div>

                            {/* Product Name */}
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                                {product.name}
                            </h1>

                            {/* Price Section */}
                            <div className="flex items-baseline gap-2 sm:gap-4 mb-4 sm:mb-6">
                                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {product.formatted_final_price}
                                </span>
                                {product.discount > 0 && (
                                    <span className="text-lg sm:text-xl lg:text-2xl text-gray-400 line-through">
                                        {product.formatted_price}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            {product.description && (
                                <p className="text-gray-600 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
                                    {product.description}
                                </p>
                            )}

                            {/* Features */}
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 space-y-3 sm:space-y-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2.5 sm:gap-3">
                                        <div className="p-1.5 sm:p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                                            <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">{feature.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Stock & Shipping */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Availability</p>
                                    {product.quantity > 0 ? (
                                        <p className="font-semibold text-green-600 flex items-center gap-2 text-sm sm:text-base">
                                            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                                            {product.quantity} in stock
                                        </p>
                                    ) : (
                                        <p className="font-semibold text-red-600 text-sm sm:text-base">Out of stock</p>
                                    )}
                                </div>
                                <div className="sm:text-right">
                                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Shipping</p>
                                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{product.shipping_time}</p>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-6 sm:mb-8">
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                                        <button
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                            className="p-2.5 sm:p-3 hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                        <span className="text-lg sm:text-xl font-bold w-12 sm:w-16 text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={incrementQuantity}
                                            disabled={quantity >= product.quantity}
                                            className="p-2.5 sm:p-3 hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </div>
                                    <span className="text-gray-500 text-xs sm:text-sm lg:text-base">
                                        of {product.quantity} available
                                    </span>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding || product.quantity === 0}
                                className="group relative w-full py-4 sm:py-5 px-6 sm:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                                    {product.quantity === 0
                                        ? 'Out of Stock'
                                        : isAdding
                                            ? 'Adding to Cart...'
                                            : 'Add to Cart'}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>

                            {/* Trust Badges */}
                            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span>Secure Payment</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span>Fast Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span>Easy Returns</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}