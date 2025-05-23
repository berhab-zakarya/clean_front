"use client"

import { useState } from "react"
import { MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat popup */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs mb-4 relative">
          {/* Close button */}
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </button>

          {/* Bot avatar at top center */}
          <div className="w-10 h-10 bg-[#f97316] rounded-full flex items-center justify-center text-white absolute -top-5 left-1/2 transform -translate-x-1/2 shadow-md">
            🤖
          </div>

          {/* Message content with padding for avatar */}
          <div className="mt-6">
            <p className="text-sm">👋 Want to chat about Algecom? I'm an AI chatbot here to help you find your way.</p>
            <Button className="w-full bg-[#f97316] hover:bg-[#dc5c03] text-white mt-3">Get in touch</Button>
          </div>

          {/* Chat bubble pointer */}
          <div className="absolute -bottom-2 right-5 w-4 h-4 bg-white transform rotate-45"></div>
        </div>
      )}

      {/* Chat button */}
      <div
        className="w-12 h-12 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer ml-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquare className="h-6 w-6" />
      </div>
    </div>
  )
}
