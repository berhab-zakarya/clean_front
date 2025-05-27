"use client"

import { useState, useEffect } from "react"

export interface Product {
  id: string
  title: string
  price: number
  image_url: string
  category: string
  description: string
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call with enhanced mock data
    setTimeout(() => {
      try {
        setProducts([
          {
            id: "1",
            title: "Wireless Headphones Pro",
            price: 8500,
            image_url: "https://imresizer.com/_next/image?url=%2Fimages%2Fsample-photo-1.jpg&w=1920&q=75",
            category: "Electronics",
            description: "Premium wireless headphones with noise cancellation",
          },
          {
            id: "2",
            title: "Smart Watch Series X",
            price: 15000,
            image_url: "https://testimages.org/img/testimages_screenshot.jpg",
            category: "Wearables",
            description: "Advanced smartwatch with health monitoring",
          },
          {
            id: "3",
            title: "Bluetooth Speaker Max",
            price: 6500,
            image_url: "/placeholder.svg?height=400&width=400",
            category: "Audio",
            description: "Portable speaker with powerful bass",
          },
          {
            id: "4",
            title: "Gaming Mouse Elite",
            price: 4200,
            image_url: "/placeholder.svg?height=400&width=400",
            category: "Gaming",
            description: "High-precision gaming mouse with RGB lighting",
          },
          {
            id: "5",
            title: "Laptop Stand Aluminum",
            price: 3500,
            image_url: "/placeholder.svg?height=400&width=400",
            category: "Accessories",
            description: "Ergonomic laptop stand for better posture",
          },
        ])
        setLoading(false)
      } catch (err) {
        setError("Failed to load products")
        setLoading(false)
      }
    }, 1000)
  }, [])

  return { products, loading, error }
}
