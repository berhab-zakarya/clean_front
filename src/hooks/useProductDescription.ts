import { useState } from "react";

type Params = {
  productName: string;
  category: string;
  features: string;
  keywords?: string;
};

export function useProductDescription() {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generate = async (params: Params) => {
    setLoading(true);
    setError(null);
    setDescription("");
    try {
      const res = await fetch("/api/product/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: params.productName, category: params.category, features: params.features, keywords: params.keywords }),
      });
      const data = await res.json();
      if (res.ok) {
        setDescription(data.description);
      } else {
        setError(data.message || "حدث خطأ");
      }
    } catch (e: any) {
      setError(e.message || "حدث خطأ");
    }
    setLoading(false);
  };

  return { loading, description, error, generate };
}