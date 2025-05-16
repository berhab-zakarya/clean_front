"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useStore } from "@/hooks/useStore"
import { toast } from "react-hot-toast"
import { Terminal, TypingAnimation, AnimatedSpan } from "@/components/magicui/terminal"
import { Store, Sparkles, Rocket, Globe } from "lucide-react"
import MergedComponent from "@/components/dashboard/StoreSetupGuide/MergedComponent"

interface CreateStoreProps {
  onComplete: () => void
}

export const CreateStore = ({ onComplete }: CreateStoreProps) => {
  const router = useRouter()
  const { createStore, loading: storeLoading, error } = useStore()
  const [formData, setFormData] = useState({
    store_name: "",
    subdomain: "",
    store_type: "nextjs",
  })
  const [loading, setLoading] = useState(false)
  const [storeUrl, setStoreUrl] = useState<string | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  // Terminal log state
  const [terminalLines, setTerminalLines] = useState<
    {
      type: "typing" | "span"
      text: string
      className?: string
      delay?: number
    }[]
  >([])

  // Terminal scroll ref
  const terminalScrollRef = useRef<HTMLDivElement | null>(null)

  // Auto-scroll terminal to bottom on new line
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight
    }
  }, [terminalLines])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Add a new line to the terminal log
  const addTerminalLine = (line: {
    type: "typing" | "span"
    text: string
    className?: string
    delay?: number
  }) => {
    setTerminalLines((prev) => [...prev, line])
  }

  const handleWebSocket = (storeId: number) => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/deployment/${storeId}/`)
    wsRef.current = ws

    ws.onopen = () => {
      addTerminalLine({
        type: "typing",
        text: `> Deploying store #${storeId}...`,
        className: "text-[#00ff9d]",
      })
    }

    ws.onmessage = (event) => {
      let msg = event.data
      let status = ""
      let url = ""
      try {
        const data = JSON.parse(event.data)
        msg = data.message || event.data
        status = data.status
        url = data.url || data.store_url
      } catch {
        // plain text
      }

      // Check if the message indicates server is running
      if (msg.includes("Next.js server is running")) {
        addTerminalLine({
          type: "span",
          text: "✓ Store deployed successfully!",
          className: "text-[#00ff9d] font-semibold",
        })

        // Get the store URL from the WebSocket message
        if (url) {
          setStoreUrl(url)
          // Add a small delay before opening the URL
          setTimeout(() => {
            window.open(url, "_blank")
            // Close WebSocket and redirect after opening URL
            if (wsRef.current) {
              wsRef.current.close()
            }
            setTimeout(() => {
              router.push("/dashboard")
            }, 2000)
          }, 1000)
        }
      } else if (status === "failed") {
        addTerminalLine({
          type: "span",
          text: "✖ Deployment failed!",
          className: "text-[#ff4d4d] font-semibold",
        })
        ws.close()
      } else if (msg) {
        addTerminalLine({
          type: "span",
          text: msg,
          className: "text-[#00ffff]",
        })
      }
    }

    ws.onerror = () => {
      addTerminalLine({
        type: "span",
        text: "WebSocket error during deployment.",
        className: "text-[#ff4d4d] font-semibold",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setTerminalLines([]) // Reset terminal log
    setIsDeploying(true)

    try {
      const response = await createStore(formData)
      if (response && response.message) {
        toast.success(response.message)

        // Show initial command in terminal
        addTerminalLine({
          type: "typing",
          text: `> Creating store "${formData.store_name}"...`,
          className: "text-[#00ff9d]",
        })

        // Show API message
        addTerminalLine({
          type: "span",
          text: response.message,
          className: "text-[#00ffff]",
        })

        // Show store URL if available
        if (response.store_url) {
          addTerminalLine({
            type: "span",
            text: `Store URL: ${response.store_url}`,
            className: "text-[#00ff9d]",
          })
        }

        // Connect to WebSocket for deployment status
        if (response.id) {
          handleWebSocket(response.id)
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to create store")
      addTerminalLine({
        type: "span",
        text: err?.message || "Failed to create store",
        className: "text-[#ff4d4d]",
      })
      setIsDeploying(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col">
      {/* Header */}
 

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        {isDeploying && (
          <div className="fixed inset-0 z-50 bg-[#0f172a]/95 backdrop-blur-sm flex items-center justify-center">
            <MergedComponent
              content={
                <div className="w-full max-w-4xl mx-auto">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-6">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full blur opacity-70"></div>
                      <div className="relative bg-[#0f172a] p-4 rounded-full">
                        <Rocket className="h-12 w-12 text-[#6366f1]" />
                      </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Deploying Your Store</h1>
                    <p className="text-gray-300 text-center mb-8 max-w-2xl">
                      Please wait while we set up your store. This may take a few minutes. We're configuring your
                      server, setting up your domain, and preparing your store for launch.
                    </p>
                  </div>

                  {/* Terminal output */}
                  {terminalLines.length > 0 && (
                    <div className="w-full max-h-[60vh] flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative">
                      {/* Spotlight effect */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-xl blur opacity-30"></div>
                      <div
                        className="relative flex-1 overflow-y-auto p-6 bg-black/80 rounded-xl backdrop-blur-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border border-white/10"
                        ref={terminalScrollRef}
                      >
                        <Terminal className="text-white bg-[#0a0a0a] rounded-lg shadow-xl border border-gray-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                          {terminalLines.map((line, idx) =>
                            line.type === "typing" ? (
                              <TypingAnimation
                                key={idx}
                                className={`${line.className || "text-[#00ff9d]"} text-base font-mono`}
                                delay={idx * 200}
                              >
                                {line.text}
                              </TypingAnimation>
                            ) : (
                              <AnimatedSpan
                                key={idx}
                                className={`${line.className || "text-[#00ffff]"} text-base font-mono`}
                                delay={idx * 200 + 100}
                              >
                                <span>{line.text}</span>
                              </AnimatedSpan>
                            ),
                          )}
                        </Terminal>
                      </div>
                    </div>
                  )}

                  {/* Show store URL only after deployment */}
                  {storeUrl && (
                    <div className="mt-8 text-center animate-fade-in">
                      <div className="inline-block relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff9d] to-[#00ffff] rounded-lg blur opacity-70"></div>
                        <div className="relative bg-[#0f172a] p-6 rounded-lg border border-white/10">
                          <span className="text-[#00ff9d] font-bold text-xl flex items-center justify-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5" /> Your store is live! <Sparkles className="h-5 w-5" />
                          </span>
                          <a
                            href={storeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-[#00ffff] break-all text-xl font-semibold hover:text-[#00ff9d] transition"
                          >
                            <Globe className="h-5 w-5" />
                            {storeUrl}
                          </a>
                          <p className="text-gray-400 mt-2 text-sm">
                            Your store is now accessible to customers worldwide
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          </div>
        )}

        {/* Create Store Form */}
        {!isDeploying && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Form */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl blur opacity-30"></div>
              <div className="relative bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e293b] rounded-3xl shadow-2xl p-10 border border-white/10 overflow-hidden z-10">
                {/* Decorative background */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-tr from-[#6366f1]/30 via-[#8b5cf6]/20 to-transparent rounded-full blur-3xl z-0"></div>
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-br from-[#6366f1]/20 via-[#8b5cf6]/10 to-transparent rounded-full blur-3xl z-0"></div>

                <div className="relative z-10">
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full blur opacity-70"></div>
                      <span className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] shadow-lg">
                        <Store className="w-8 h-8 text-white" />
                      </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-2 text-center drop-shadow-lg">
                      Create Your Store
                    </h1>
                    <p className="text-gray-300 mb-4 text-center text-lg">
                      Start by entering your store name and a unique subdomain.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                      <label htmlFor="store_name" className="text-white font-medium">
                        Store Name
                      </label>
                      <Input
                        id="store_name"
                        name="store_name"
                        value={formData.store_name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Shop"
                        required
                        className="text-lg h-12 shadow-md focus:ring-2 focus:ring-[#6366f1]/40 bg-white/5 border-white/10 text-white placeholder-gray-400 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subdomain" className="text-white font-medium">
                        Subdomain
                      </label>
                      <Input
                        id="subdomain"
                        name="subdomain"
                        value={formData.subdomain}
                        onChange={handleChange}
                        placeholder="e.g. alexshop"
                        required
                        className="text-lg h-12 shadow-md focus:ring-2 focus:ring-[#6366f1]/40 bg-white/5 border-white/10 text-white placeholder-gray-400 rounded-lg"
                      />
                      <p className="text-sm text-gray-400 mt-1 ml-1">
                        Your store will be available at:{" "}
                        <span className="font-semibold text-[#00ffff]">
                          {formData.subdomain || "yourstore"}.algecom.com
                        </span>
                      </p>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading || storeLoading}
                      className="w-full h-12 rounded-full py-3 text-lg font-bold bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] text-white shadow-xl hover:scale-105 hover:from-[#4f46e5] hover:to-[#7c3aed] transition-all duration-200"
                    >
                      {loading || storeLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating...
                        </div>
                      ) : (
                        "Create Store"
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right side - Features */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white">Launch Your Online Business Today</h2>
              <p className="text-gray-300 text-lg">
                Create a professional e-commerce store in minutes with our powerful platform. No coding required.
              </p>

              {/* Feature spotlights */}
              <div className="grid gap-6">
                <FeatureSpotlight
                  icon={<Rocket className="h-6 w-6" />}
                  title="Instant Deployment"
                  description="Your store will be live in minutes, not days. Our automated deployment system handles all the technical details."
                />
                <FeatureSpotlight
                  icon={<Globe className="h-6 w-6" />}
                  title="Custom Domain"
                  description="Get a professional web address for your store, or connect your existing domain for a seamless experience."
                />
                <FeatureSpotlight
                  icon={<Sparkles className="h-6 w-6" />}
                  title="Beautiful Templates"
                  description="Choose from dozens of professionally designed templates to make your store stand out from the competition."
                />
              </div>

              {/* Testimonial */}
              <div className="relative mt-12">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#6366f1]/30 to-[#8b5cf6]/30 rounded-xl blur opacity-30"></div>
                <div className="relative bg-white/5 p-6 rounded-xl border border-white/10">
                  <p className="text-gray-300 italic">
                    "I launched my online store in less than an hour. The platform is incredibly easy to use and my
                    sales have increased by 200% since switching!"
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6]"></div>
                    <div className="ml-3">
                      <p className="text-white font-medium">Sarah Johnson</p>
                      <p className="text-gray-400 text-sm">Fashion Boutique Owner</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  )
}

// Feature Spotlight Component
const FeatureSpotlight = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1]/0 to-[#8b5cf6]/0 group-hover:from-[#6366f1]/30 group-hover:to-[#8b5cf6]/30 rounded-lg blur opacity-30 transition-all duration-300"></div>
      <div className="relative flex items-start gap-4 bg-white/5 p-5 rounded-lg border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <div className="flex-shrink-0 p-2 bg-gradient-to-tr from-[#6366f1]/20 to-[#8b5cf6]/20 rounded-lg text-[#6366f1]">
          {icon}
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default CreateStore
