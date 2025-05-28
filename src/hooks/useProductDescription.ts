import { useState } from "react";

type Params = {
  productName: string;
  category: string;
  features: string;
  keywords?: string;
};

const GEMINI_API_KEY = "AIzaSyDQ-NsMhugktNHxzU_c6F6pFiujOwTEHb0";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export function useProductDescription() {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generate = async (params: Params) => {
    setLoading(true);
    setError(null);
    setDescription("");

    const prompt = `Generate a product description for:
    Product Name: ${params.productName}
    Category: ${params.category}
    Features: ${params.features}
    ${params.keywords ? `Keywords: ${params.keywords}` : ''}
    
    Please provide a compelling and detailed product description.`;

    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        }),
      });

      const data = await res.json();
      
      if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setDescription(data.candidates[0].content.parts[0].text);
      } else {
        setError(data.error?.message || "حدث خطأ");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ";
      setError(errorMessage);
    }
    setLoading(false);
  };

  return { loading, description, error, generate };
}