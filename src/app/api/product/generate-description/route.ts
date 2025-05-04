import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { productName, category, features, keywords } = await req.json();

    const prompt = `
      Write a professional and attractive product description for an e-commerce website.
      Product Name: ${productName}
      Category: ${category}
      Features: ${features}
      Keywords: ${keywords || ""}
    `;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data[0]?.generated_text || "";
    return NextResponse.json({ description: generatedText });
  } catch (error: any) {
    console.error("API Error:", error?.response?.data || error?.message || error);
    return NextResponse.json(
      { message: "Error generating description", error: error?.response?.data || error?.message || error },
      { status: 500 }
    );
  }
}