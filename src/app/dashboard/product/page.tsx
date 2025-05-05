'use client';
import ProductsPage from '@/components/dashboard/Product/ProductsPage';
import React from 'react';



const ProductDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
           <ProductsPage/>
        </div>
    );
};

export default ProductDashboard;