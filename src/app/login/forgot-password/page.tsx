"use client"

import Image from "next/image"
import { Mail } from "lucide-react"
import { useState } from "react"
import Header from "@/components/common/Header"

export default function ForgotPassword() {
  




  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setIsSubmitting(false)
      setIsEmailSent(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#f4f5fa] flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/assets/images/reset_pass_illustration.png"
                alt="Forgot Password Illustration"
                width={400}
                height={200}
                className="h-48 w-auto"
              />
            </div>
            <div className="text-center mb-6">
              <h1 className="text-[#303030] text-2xl font-semibold flex items-center justify-center gap-2">
                <span className="text-[#1e3a8a]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                {isEmailSent ? "Check your email" : "Forgot your password?"}
              </h1>
              <p className="text-[#828282] mt-2">
                {isEmailSent 
                  ? "We've sent you an email with instructions to reset your password."
                  : "Enter your email to reset your password."}
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-[#1e3a8a]">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    disabled={isSubmitting || isEmailSent}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-[#1e3a8a] focus:border-[#1e3a8a] disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isEmailSent}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-white bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e3a8a] cursor-pointer transition duration-200 ease-in-out disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isEmailSent ? "Resend Email" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}