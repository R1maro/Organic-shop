import React from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {  Product  } from '@/types/product';


interface ProductCardProps {
    product: Product;
    viewMode: 'grid' | 'list';
}

const Products: React.FC<ProductCardProps> = ({ product, viewMode }) => {
    const router = useRouter();
    const hasDiscount = product.discount > 0;
    const discountPercentage = hasDiscount ? Math.round((product.discount / product.price) * 100) : 0;

    const handleViewProduct = () => {
        router.push(`/products/${product.slug}`);
    };

    if (viewMode === 'list') {
        return (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-48 h-48">
                        <img
                            src={product.full_image_url || '/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {hasDiscount && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                -{discountPercentage}%
                            </div>
                        )}
                    </div>

                    <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                            <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                                {product.category?.name}
                            </span>
                        </div>

                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {hasDiscount && (
                                    <span className="text-slate-400 line-through text-sm">
                                        {product.formatted_price}
                                    </span>
                                )}
                                <span className="text-xl font-bold text-white">
                                    {product.formatted_final_price}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-purple-600 hover:text-white transition-all duration-300">
                                    <Heart size={16} />
                                </button>
                                <button
                                    onClick={handleViewProduct}
                                    className="p-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-purple-600 hover:text-white transition-all duration-300"
                                >
                                    <Eye size={16} />
                                </button>
                                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300">
                                    <ShoppingCart size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all duration-300 hover:scale-105">
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={product.full_image_url || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{discountPercentage}%
                    </div>
                )}

                <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-300">
                        <Heart size={18} />
                    </button>
                    <button
                        onClick={handleViewProduct}
                        className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-300"
                    >
                        <Eye size={18} />
                    </button>
                    <button className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300">
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white line-clamp-1 flex-1">{product.name}</h3>
                    <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full ml-2">
                        {product.category?.name}
                    </span>
                </div>

                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between">
                    <div>
                        {hasDiscount && (
                            <span className="text-slate-400 line-through text-sm block">
                                {product.formatted_price}
                            </span>
                        )}
                        <span className="text-lg font-bold text-white">
                            {product.formatted_final_price}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;