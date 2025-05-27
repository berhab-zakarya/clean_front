"use client"

import { useState, useCallback } from "react"
import crypto from 'crypto';

interface BannerbearState {
  loading: boolean
  error: string | null
  result: string | null
  progress: string
}

interface AdCustomization {
  backgroundColor?: string
  textColor?: string
  fontSize?: string
  fontFamily?: string
}

interface Product {
  id: string;
  title: string;
  image_url: string;
  category: string;
  price: number;
  description: string;
}

// Add signature generation function
const generateSignature = (timestamp: string): string => {
  const params = `timestamp=${timestamp}`;
  return crypto
    .createHash('sha1')
    .update(params + 'CcxC-NqnzgTetFpOHGYxqGyT0_I')
    .digest('hex');
};

// Add Cloudinary upload function
const uploadToCloudinary = async (imageUrl: string): Promise<string> => {
  try {
    // First fetch the image from the local server
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();

    const formData = new FormData();
    formData.append('file', imageBlob);
    formData.append('upload_preset', 'algecom');
    formData.append('cloud_name', 'dzswvkay6');
    formData.append('api_key', '948688582188394');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dzswvkay6/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload error:', errorData);
      throw new Error(`Failed to upload to Cloudinary: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export function useBannerbear() {
  const [state, setState] = useState<BannerbearState>({
    loading: false,
    error: null,
    result: null,
    progress: "",
  })

  const pollForResult = async (imageId: string): Promise<string> => {
    const maxAttempts = 30 // 30 attempts with 2-second intervals = 1 minute max
    let attempts = 0

    while (attempts < maxAttempts) {
      try {
        setState((prev) => ({
          ...prev,
          progress: `Generating ad... (${attempts + 1}/${maxAttempts})`,
        }))

        const response = await fetch(`https://api.bannerbear.com/v2/images/${imageId}`, {
          headers: {
            Authorization: "Bearer bb_pr_ee95e619f3c17307b86150b4f5c5af",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to check status: ${response.status}`)
        }

        const data = await response.json()

        if (data.status === "completed" && data.image_url) {
          return data.image_url
        }

        if (data.status === "failed") {
          throw new Error("Image generation failed")
        }

        // Wait 2 seconds before next poll
        await new Promise((resolve) => setTimeout(resolve, 2000))
        attempts++
      } catch (error) {
        throw error
      }
    }

    throw new Error("Image generation timed out")
  }

  const generateAd = useCallback(async (product: Product, customization: AdCustomization = {}) => {
    setState({ loading: true, error: null, result: null, progress: "Starting generation..." })

    try {
      // Upload image to Cloudinary first
      setState(prev => ({ ...prev, progress: "Uploading image to Cloudinary..." }));
      const cloudinaryUrl = await uploadToCloudinary(product.image_url);

      // Initial API call to create the image
      const response = await fetch("https://api.bannerbear.com/v2/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer bb_pr_ee95e619f3c17307b86150b4f5c5af",
        },
        body: JSON.stringify(
          {
            "template": "V32jY9bBMMPxDBGWrl",
            "modifications": [
              {
                "name": "imagecontainer",
                "image_url": cloudinaryUrl,
              },
              {
                "name": "pretitle",
                "text": product.title,
                "color": null,
                "background": null
              },
              {
                "name": "productname",
                "text": product.description,
                "color": null,
                "background": null
              },
              {
                "name": "rectangle",
                "color": null
              },
              {
                "name": "circle",
                "color": null
              },
              {
                "name": "price",
                "text": product.price,
                "color": null,
                "background": null
              },
              {
                "name": "productdetails",
                "text": product.description,
                "color": null,
                "background": null
              },
              {
                "name": "logo",
                "image_url": product.image_url,
              },
              {
                "name": "productbrand",
                "text": product.category,
                "color": null,
                "background": null
              }
            ],
            "webhook_url": null,
            "transparent": false,
            "metadata": null
          }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.uid) {
        throw new Error("No image ID returned from API")
      }

      // Poll for the result
      const imageUrl = await pollForResult(data.uid)

      setState({
        loading: false,
        error: null,
        result: imageUrl,
        progress: "Completed!",
      })

      return imageUrl
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
        result: null,
        progress: "",
      })
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      result: null,
      progress: "",
    })
  }, [])

  return { ...state, generateAd, reset }
}