import React from 'react';
import { Package } from 'lucide-react';

const EmptyState = () => {
    return (
        <div className="text-center py-16">
            <Package className="mx-auto text-slate-600 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
        </div>
    );
};

export default EmptyState;