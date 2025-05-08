"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Lock, Eye, EyeOff } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { toast } from "@/hooks/use-toast"
import Header from "@/components/common/Header"

export default function PasswordReset() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [strength, setStrength] = useState("")
  const [showError, setShowError] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [confirmTouched, setConfirmTouched] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const confirmTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Evaluate password strength
  const evaluatePasswordStrength = (password: string) => {
    let score = 0

    if (!password) return ""

    // Check password length
    if (password.length > 8) score += 1
    // Contains lowercase
    if (/[a-z]/.test(password)) score += 1
    // Contains uppercase
    if (/[A-Z]/.test(password)) score += 1
    // Contains numbers
    if (/\d/.test(password)) score += 1
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    switch (score) {
      case 0:
      case 1:
      case 2:
        return "Weak"
      case 3:
        return "Medium"
      case 4:
      case 5:
        return "Strong"
    }
  }

  // Get strength bar width and color based on password strength
  const getStrengthBarStyles = () => {
    switch (strength) {
      case "Weak":
        return {
          width: "25%",
          color: "#ff0000",
          bgColor: "#ff0000",
        }
      case "Medium":
        return {
          width: "50%",
          color: "#FFA500",
          bgColor: "#FFA500",
        }
      case "Strong":
        return {
          width: "100%",
          color: "#00A86B",
          bgColor: "#00A86B",
        }
      default:
        return {
          width: "0%",
          color: "#ff0000",
          bgColor: "#ff0000",
        }
    }
  }

  // Handle password changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)

    if (!passwordTouched && newPassword) {
      setPasswordTouched(true)
    }

    if (newPassword === "") {
      setStrength("")
      setShowError(passwordTouched)
    } else {
      setStrength(evaluatePasswordStrength(newPassword) || "")
      setShowError(false)
    }

    // Check if passwords match whenever password changes
    if (confirmTouched) {
      setPasswordsMatch(newPassword === confirmPassword)
    }
  }

  // Handle confirm password changes
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value
    setConfirmPassword(newConfirmPassword)

    if (!confirmTouched) {
      setConfirmTouched(true)
    }

    // Clear any existing timeout
    if (confirmTimeoutRef.current) {
      clearTimeout(confirmTimeoutRef.current)
    }

    // Set a new timeout to check password match after 1 second of inactivity
    confirmTimeoutRef.current = setTimeout(() => {
      setPasswordsMatch(newConfirmPassword === password)
    }, 1000)
  }

  // Check password match on blur
  const handleConfirmBlur = () => {
    // Clear any existing timeout
    if (confirmTimeoutRef.current) {
      clearTimeout(confirmTimeoutRef.current)
      confirmTimeoutRef.current = null
    }

    setPasswordsMatch(confirmPassword === password)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword || !passwordsMatch || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Password reset successfully",
        variant: "default",
      })

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    }, 1000)
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (confirmTimeoutRef.current) {
        clearTimeout(confirmTimeoutRef.current)
      }
    }
  }, [])

  const strengthStyles = getStrengthBarStyles()
  const isButtonDisabled = !password || !confirmPassword || !passwordsMatch || isSubmitting

  return (
    <div className="min-h-screen bg-[#f4f5fa]">

      <Header />

      <div className="container mx-auto px-4 py-6">

        {/* Password Reset Card */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Illustration */}
          <div className="border-b border-gray-100 p-6 flex justify-center">
            <Image
              src="/assets/images/reset_pass_illustration.png"
              alt="Password Reset Illustration"
              width={400}
              height={200}
              className="h-48 w-auto"
            />
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Heading */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock className="text-[#1e3a8a]" />
              <h1 className="text-[#303030] text-2xl font-bold text-center">Reset Your Password</h1>
            </div>

            {/* Instructions */}
            <p className="text-[#828282] text-center mb-6">
              Please enter your current and new password
              <br />
            </p>

            {/* Password Form */}
            <form onSubmit={handleSubmit}>
              {/* New Password Field */}
              <div className="mb-4">
                <label htmlFor="new-password" className="block text-[#303030] text-sm font-medium mb-2">
                  New password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#1e3a8a]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new-password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-full text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator - only show when password has content */}
                {password && strength && (
                  <div className="mt-2">
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: strengthStyles.width,
                          backgroundColor: strengthStyles.bgColor,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1" style={{ color: strengthStyles.color }}>
                      {strength}
                    </p>
                  </div>
                )}

                {/* Error message when password is deleted */}
                {showError && <p className="text-[#ff0000] text-xs mt-1">Password is required</p>}
              </div>

              {/* Confirm Password Field */}
              <div className="mb-6">
                <label htmlFor="confirm-password" className="block text-[#303030] text-sm font-medium mb-2">
                  Confirm new password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#1e3a8a]" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onBlur={handleConfirmBlur}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-full text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1e3a8a] focus:border-[#1e3a8a]"
                    placeholder="Confirm the new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password match error */}
                {confirmTouched && !passwordsMatch && (
                  <p className="text-[#ff0000] text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isButtonDisabled}
                className={`w-full bg-[#1e3a8a] text-white py-3 px-4 rounded-full font-medium transition-colors ${
                  isButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-900"
                }`}
              >
                {isSubmitting ? "Processing..." : "Confirm reset"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
