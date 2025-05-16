"use client"

import Link from "next/link"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ShoppingCart, User, Search, ChevronDown } from "lucide-react"

export default function Header() {
  const [cartCount, setCartCount] = useState(1)

  return (
    <header className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
      <Link href="/" className="text-2xl font-bold mr-5">
        ZJ.CO
      </Link>

      <nav className="hidden md:flex gap-5">
        <div className="relative group">
          <button className="flex items-center gap-1">
            Shop <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <Link href="/sale" className="hover:text-gray-600">
          On sale
        </Link>
        <Link href="/new-arrivals" className="hover:text-gray-600">
          New arrivals
        </Link>
        <Link href="/brands" className="hover:text-gray-600">
          Brands
        </Link>
      </nav>

      <div className="flex-grow mx-5 relative hidden md:block">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for products..."
          className="w-full pl-10 rounded-full bg-gray-100 border-none"
        />
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <ShoppingCart className="h-6 w-6 cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        </div>
        <User className="h-6 w-6 cursor-pointer" />
      </div>
    </header>
  )
}
