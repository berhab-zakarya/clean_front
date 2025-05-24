"use client";
import { useRouter } from "next/navigation";
import { CreateStore } from "@/components/dashboard/StoreSetupGuide/CreateStore";

export default function CreateStorePage() {
  const router = useRouter();

  const handleStoreCreated = () => {
    router.push('/dashboard/StoreSetupGuide');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CreateStore onComplete={handleStoreCreated} />
    </div>
  );
} 