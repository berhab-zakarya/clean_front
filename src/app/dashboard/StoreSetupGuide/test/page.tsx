'use client';
import { CreateStore } from '@/components/dashboard/StoreSetupGuide/CreateStore';
import React from 'react';



const StoreSetupGuidePage = () => {
    return (
        <div className="p-4">
            <div>
                <CreateStore/>
            </div>
        </div>
    );
};

export default StoreSetupGuidePage;