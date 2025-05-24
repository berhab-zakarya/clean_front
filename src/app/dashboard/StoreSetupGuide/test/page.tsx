"use client"
import { useState, useRef, useEffect, useCallback, memo } from "react"
import type React from "react"
import dynamic from 'next/dynamic'

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useStore } from "@/hooks/useStore"
import { toast } from "react-hot-toast"
import { Terminal, TypingAnimation, AnimatedSpan } from "@/components/magicui/terminal"
import { Store, Sparkles, Rocket, Globe } from "lucide-react"

// Lazy load the MergedComponent
const MergedComponent = dynamic(() => import("@/components/dashboard/StoreSetupGuide/DeploymentBackground"), {
  loading: () => <div className="animate-pulse bg-gray-800 rounded-lg h-96"></div>
})

interface CreateStoreProps {
  onComplete: () => void
}

// Memoize the FeatureSpotlight component
const FeatureSpotlight = memo(({
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
      <div className="relative flex items-start gap-4 bg-white/5 p-5 rounded-lg border border-white/10 group-hover:border-[#6366f1]/30 transition-all duration-300 hover-lift hover-glow">
        <div className="flex-shrink-0 p-2 bg-gradient-to-tr from-[#6366f1]/20 to-[#8b5cf6]/20 rounded-lg text-[#6366f1] group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-[#6366f1] transition-colors duration-300">{title}</h3>
          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{description}</p>
        </div>
      </div>
    </div>
  )
})

FeatureSpotlight.displayName = 'FeatureSpotlight'

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
  const terminalScrollRef = useRef<HTMLDivElement | null>(null)

  // Memoize terminal lines state
  const [terminalLines, setTerminalLines] = useState<
    {
      type: "typing" | "span"
      text: string
      className?: string
      delay?: number
    }[]
  >([])

  // Optimize scroll handling with useCallback
  const handleScroll = useCallback(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight
    }
  }, [])

  // Use IntersectionObserver for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Optimize WebSocket handling
  const handleWebSocket = useCallback((storeId: number) => {
    if (wsRef.current) {
      wsRef.current.close()
    }

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

      if (msg.includes("Next.js server is running")) {
        addTerminalLine({
          type: "span",
          text: "✓ Store deployed successfully!",
          className: "text-[#00ff9d] font-semibold",
        })

        if (url) {
          setStoreUrl(url)
          setTimeout(() => {
            window.open(url, "_blank")
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

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [router])

  // Optimize form handling
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  // Optimize terminal line addition
  const addTerminalLine = useCallback((line: {
    type: "typing" | "span"
    text: string
    className?: string
    delay?: number
  }) => {
    setTerminalLines((prev) => [...prev, line])
    handleScroll()
  }, [handleScroll])

  // Optimize form submission
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setTerminalLines([])
    setIsDeploying(true)

    try {
      const response = await createStore(formData)
      if (response && response.message) {
        toast.success(response.message)

        addTerminalLine({
          type: "typing",
          text: `> Creating store "${formData.store_name}"...`,
          className: "text-[#00ff9d]",
        })

        addTerminalLine({
          type: "span",
          text: response.message,
          className: "text-[#00ffff]",
        })

        if (response.store_url) {
          addTerminalLine({
            type: "span",
            text: `Store URL: ${response.store_url}`,
            className: "text-[#00ff9d]",
          })
        }

        if (response.id) {
          handleWebSocket(response.id)
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create store"
      toast.error(errorMessage)
      addTerminalLine({
        type: "span",
        text: errorMessage,
        className: "text-[#ff4d4d]",
      })
      setIsDeploying(false)
    } finally {
      setLoading(false)
    }
  }, [formData, createStore, addTerminalLine, handleWebSocket])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col animate-gradient-flow">
      {/* Header */}
      <header className="relative w-full py-6 px-4 border-b border-white/10 animate-slide-in">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative animate-pulse-soft">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full blur opacity-70 animate-glow"></div>
              <div className="relative bg-[#0f172a] p-2 rounded-full">
                <Store className="h-6 w-6 text-[#6366f1] animate-float" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white animate-shimmer-text">Store Setup</h1>
          </div>
          <div className="flex items-center gap-4 animate-fade-up">
            <div className="h-2 w-2 rounded-full bg-[#00ff9d] animate-pulse-soft"></div>
            <span className="text-sm text-gray-400">Live Preview</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        {isDeploying && (
          <div className="fixed inset-0 z-50 bg-[#0f172a]/95 backdrop-blur-sm flex items-center justify-center animate-scale-in">
            <MergedComponent
              content={
                <div className="w-full max-w-4xl mx-auto animate-slide-in">
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-6 animate-float">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full blur opacity-70 animate-pulse"></div>
                      <div className="relative bg-[#0f172a] p-4 rounded-full">
                        <Rocket className="h-12 w-12 text-[#6366f1] animate-bounce" />
                      </div>
                    </div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] mb-4 animate-gradientText">
                      Deploying Your Store
                    </h1>
                    <p className="text-gray-300 text-center mb-8 max-w-2xl animate-fadeIn">
                      Please wait while we set up your store. This may take a few minutes. We&apos;re configuring your
                      server, setting up your domain, and preparing your store for launch.
                    </p>
                    
                    {/* Progress Steps */}
                    <div className="w-full max-w-md mb-8 animate-slideUp">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col items-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                          <div className="w-8 h-8 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-bold animate-pulse">1</div>
                          <span className="text-sm text-gray-400 mt-2">Initializing</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-700 mx-2">
                          <div className="h-full bg-[#6366f1] w-1/3 animate-progress"></div>
                        </div>
                        <div className="flex flex-col items-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">2</div>
                          <span className="text-sm text-gray-400 mt-2">Deploying</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-700 mx-2"></div>
                        <div className="flex flex-col items-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">3</div>
                          <span className="text-sm text-gray-400 mt-2">Launching</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terminal output */}
                  {terminalLines.length > 0 && (
                    <div className="w-full max-h-[60vh] flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative animate-slideUp">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-xl blur opacity-30 animate-pulse"></div>
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
                    <div className="mt-8 text-center animate-bounceIn">
                      <div className="inline-block relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff9d] to-[#00ffff] rounded-lg blur opacity-70 animate-pulse"></div>
                        <div className="relative bg-[#0f172a] p-6 rounded-lg border border-white/10">
                          <span className="text-[#00ff9d] font-bold text-xl flex items-center justify-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 animate-pulse" /> Your store is live! <Sparkles className="h-5 w-5 animate-pulse" />
                          </span>
                          <a
                            href={storeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-[#00ffff] break-all text-xl font-semibold hover:text-[#00ff9d] transition-colors duration-300 animate-float"
                          >
                            <Globe className="h-5 w-5" />
                            {storeUrl}
                          </a>
                          <p className="text-gray-400 mt-2 text-sm animate-fadeIn">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-up">
            {/* Left side - Form */}
            <div className="relative animate-slide-in">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-3xl blur opacity-30 animate-glow"></div>
              <div className="relative bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e293b] rounded-3xl shadow-2xl p-10 border border-white/10 overflow-hidden z-10 hover-border-glow">
                {/* Decorative background */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-tr from-[#6366f1]/30 via-[#8b5cf6]/20 to-transparent rounded-full blur-3xl z-0 animate-morph"></div>
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-br from-[#6366f1]/20 via-[#8b5cf6]/10 to-transparent rounded-full blur-3xl z-0 animate-morph" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-10">
                  <div className="flex flex-col items-center mb-8 animate-fade-up">
                    <div className="relative mb-4 animate-float">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full blur opacity-70 animate-glow"></div>
                      <span className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] shadow-lg hover-lift">
                        <Store className="w-8 h-8 text-white" />
                      </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] mb-2 text-center drop-shadow-lg animate-shimmer-text">
                      Create Your Store
                    </h1>
                    <p className="text-gray-300 mb-4 text-center text-lg animate-fade-up">
                      Start by entering your store name and a unique subdomain.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8 animate-fade-up">
                    <div className="space-y-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                      <label htmlFor="store_name" className="text-white font-medium flex items-center gap-2">
                        <span>Store Name</span>
                        <span className="text-[#6366f1] animate-pulse-soft">*</span>
                      </label>
                      <Input
                        id="store_name"
                        name="store_name"
                        value={formData.store_name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Shop"
                        required
                        className="text-lg h-12 shadow-md focus:ring-2 focus:ring-[#6366f1]/40 bg-white/5 border-white/10 text-white placeholder-gray-400 rounded-lg transition-all duration-300 hover-border-glow hover-lift"
                      />
                    </div>
                    <div className="space-y-2 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                      <label htmlFor="subdomain" className="text-white font-medium flex items-center gap-2">
                        <span>Subdomain</span>
                        <span className="text-[#6366f1] animate-pulse-soft">*</span>
                      </label>
                      <Input
                        id="subdomain"
                        name="subdomain"
                        value={formData.subdomain}
                        onChange={handleChange}
                        placeholder="e.g. alexshop"
                        required
                        className="text-lg h-12 shadow-md focus:ring-2 focus:ring-[#6366f1]/40 bg-white/5 border-white/10 text-white placeholder-gray-400 rounded-lg transition-all duration-300 hover-border-glow hover-lift"
                      />
                      <p className="text-sm text-gray-400 mt-1 ml-1 animate-fade-up">
                        Your store will be available at:{" "}
                        <span className="font-semibold text-[#00ffff] animate-shimmer-text">
                          {formData.subdomain || "yourstore"}.algecom.com
                        </span>
                      </p>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading || storeLoading}
                      className="w-full h-12 rounded-full py-3 text-lg font-bold bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] text-white shadow-xl hover:scale-105 hover:from-[#4f46e5] hover:to-[#7c3aed] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-glow hover-lift"
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
            <div className="space-y-8 animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] animate-shimmer-text">
                Launch Your Online Business Today
              </h2>
              <p className="text-gray-300 text-lg animate-fade-up">
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
              <div className="relative mt-12 animate-fade-up">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#6366f1]/30 to-[#8b5cf6]/30 rounded-xl blur opacity-30 animate-glow"></div>
                <div className="relative bg-white/5 p-6 rounded-xl border border-white/10 hover-border-glow transition-all duration-300 hover-lift">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-t-xl animate-gradient-flow"></div>
                  <p className="text-gray-300 italic">
                    &ldquo;I launched my online store in less than an hour. The platform is incredibly easy to use and my
                    sales have increased by 200% since switching!&rdquo;
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-bold animate-pulse-soft">SJ</div>
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

// Optimize CSS animations
const styles = `
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes morph {
  0%, 100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); }
  50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.4); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

@keyframes slideIn {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-shimmer {
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  will-change: background-position;
}

.animate-morph {
  animation: morph 8s ease-in-out infinite;
  will-change: border-radius;
}

.animate-glow {
  animation: glow 3s ease-in-out infinite;
  will-change: box-shadow;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
  will-change: transform;
}

.animate-gradient-flow {
  background-size: 200% 200%;
  animation: gradientFlow 15s ease infinite;
  will-change: background-position;
}

.animate-slide-in {
  animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  will-change: transform, opacity;
}

.animate-fade-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  will-change: transform, opacity;
}

.hover-lift {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.hover-lift:hover {
  transform: translateY(-3px);
}

.hover-glow {
  transition: box-shadow 0.3s ease;
  will-change: box-shadow;
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}

.hover-border-glow {
  transition: border-color 0.3s ease;
  will-change: border-color;
}

.hover-border-glow:hover {
  border-color: rgba(99, 102, 241, 0.5);
}
`

// Add the styles to the document with performance optimization
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  styleSheet.setAttribute('data-performance-optimized', 'true')
  document.head.appendChild(styleSheet)
}

export default CreateStore
