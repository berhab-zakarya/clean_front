"use client"

import { useState, useCallback } from "react"
import type { Product } from "./use-products"

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
            Authorization: "Bearer bb_ma_371458ab06decf150cd9fe5dae2e0c",
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
      // Initial API call to create the image
      const response = await fetch("https://api.bannerbear.com/v2/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer bb_ma_371458ab06decf150cd9fe5dae2e0c",
        },
        body: JSON.stringify({
          template: "4KnlWBbKjj2QDOQGgm",
          project_id: "5OPnVJ1PGDYMA6rYb9",
          modifications: [
            {
              name: "title",
              text: product.title,
              color: customization.textColor || null,
              font_family: customization.fontFamily || null,
              font_size: customization.fontSize || null,
            },
            {
              name: "price",
              text: `${product.price} DA`,
              color: customization.textColor || null,
              font_family: customization.fontFamily || null,
            },
            {
              name: "photo",
              image_url: product.image_url,
            },
            ...(customization.backgroundColor
              ? [
                  {
                    name: "background",
                    color: customization.backgroundColor,
                  },
                ]
              : []),
          ],
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