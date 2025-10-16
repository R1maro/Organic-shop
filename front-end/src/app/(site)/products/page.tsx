'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import Products from '@/components/ProductsSection/Products';
import ViewToggle from '@/components/ViewToggle/ViewToggle';
import EmptyState from '@/components/EmptyState/EmptyState';
import {getProducts} from "@/utils/website/productService";
import { Product  } from '@/types/product';



const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getProducts()

            if (response) {
                setProducts(response);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = Array.from(
        new Set(products.map(product => product.category?.name).filter(Boolean))
    );

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        // return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen mt-15 bg-gradient-to-br from-slate-900 via-green-100 to-slate-900">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="relative container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Our Products
                        </h1>
                        <p className="text-slate-400">Discover amazing products</p>
                    </div>
                    <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                </div>

                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-xl text-white rounded-lg border border-slate-700/50 focus:border-purple-500/50 focus:outline-none transition-all duration-300"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="pl-10 pr-8 py-3 bg-slate-800/50 backdrop-blur-xl text-white rounded-lg border border-slate-700/50 focus:border-purple-500/50 focus:outline-none transition-all duration-300 min-w-[200px]"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <p className="text-slate-400 mb-6">
                    {filteredProducts.length} products found
                </p>

                {/* Products */}
                {filteredProducts.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className={
                        viewMode === 'grid'
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "space-y-4"
                    }>
                        {filteredProducts.map((product) => (
                            <Products
                                key={product.id}
                                product={product}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;