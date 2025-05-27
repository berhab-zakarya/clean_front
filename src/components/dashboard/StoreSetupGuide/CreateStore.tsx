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
import { Store as StoreIcon, Sparkles, Rocket, Globe, ExternalLink, CheckCircle, Clock, Zap } from "lucide-react"
import type { Store } from "@/lib/types/store";

// Lazy load the MergedComponent
const DeploymentBackground = dynamic(() => import("@/components/dashboard/StoreSetupGuide/DeploymentBackground"), {
  loading: () => <div className="animate-pulse bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-lg h-80 border border-indigo-500/20"></div>
})

interface CreateStoreProps {
  onComplete: (store: Store) => void
}

// Enhanced FeatureSpotlight component with new design
const FeatureSpotlight = memo(({
  icon,
  title,
  description,
  gradient = "from-indigo-500 to-purple-600"
}: {
  icon: React.ReactNode
  title: string
  description: string
  gradient?: string
}) => {
  return (
    <div className="relative group">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 rounded-xl blur-sm transition-all duration-500`}></div>
      <div className="relative flex items-start gap-4 bg-gradient-to-br from-gray-900/90 to-gray-800/50 p-6 rounded-xl border border-gray-700/50 group-hover:border-indigo-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 backdrop-blur-sm">
        <div className={`p-3 bg-gradient-to-br ${gradient} rounded-lg text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-indigo-300 transition-colors duration-300">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{description}</p>
        </div>
      </div>
    </div>
  )
})

FeatureSpotlight.displayName = 'FeatureSpotlight'

export const CreateStore = ({ onComplete }: CreateStoreProps) => {
  const router = useRouter()
  const [storeId, setStoreId] = useState<number | null>(null)

  const { createStore, loading: storeLoading } = useStore()
  const [formData, setFormData] = useState({
    store_name: "",
    subdomain: "",
    store_type: "nextjs",
  })
  const [loading, setLoading] = useState(false)
  const [storeUrl, setStoreUrl] = useState<string | null>(null)
  const [terminalLines, setTerminalLines] = useState<{ type: "typing" | "span"; text: string; className?: string; delay?: number }[]>([])
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentComplete, setDeploymentComplete] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const terminalScrollRef = useRef<HTMLDivElement | null>(null)

  // Enhanced scroll handler
  const handleScroll = useCallback(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight
    }
  }, [])

  // Enhanced IntersectionObserver with staggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-fade-up')
            }, index * 100)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    const elements = document.querySelectorAll('.animate-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Enhanced WebSocket handler with better error handling and URL validation
  const handleWebSocket = useCallback((storeId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close()
    }

    const initialLines = [{
      type: "span" as const,
      text: "🚀 Initializing deployment pipeline...",
      className: "text-cyan-400 font-medium",
    }]
    setTerminalLines(initialLines)

    try {
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/deployment/${storeId}/`)
      wsRef.current = ws

      // Connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          setTerminalLines(prev => [...prev, {
            type: "span" as const,
            text: "⚠️ Connection timeout. Please check if the deployment server is running.",
            className: "text-amber-400 font-semibold",
          }])
          ws.close()
          setIsDeploying(false)
        }
      }, 10000)

      ws.onopen = () => {
        clearTimeout(connectionTimeout)
        setTerminalLines(prev => [...prev, {
          type: "span" as const,
          text: "✅ Connected to deployment server",
          className: "text-emerald-400 font-medium",
        }, {
          type: "typing" as const,
          text: `📦 Preparing deployment for store #${storeId}...`,
          className: "text-indigo-400 font-medium",
        }])
      }

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout)
        
        if (!deploymentComplete) {
          setTerminalLines(prev => [...prev, {
            type: "span" as const,
            text: `🔌 Connection closed (${event.code === 1000 ? 'Normal' : `Code: ${event.code}`})`,
            className: event.code === 1000 ? "text-gray-400" : "text-amber-400",
          }])
          setIsDeploying(false)
        }
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
          // Handle plain text messages
        }

        // Check for successful deployment
        if (msg.includes("Pure store deployment successful") || 
            msg.includes("deployment successful") ||
            msg.includes("Store deployed successfully") ||
            msg.includes("ready") ||
            msg.toLowerCase().includes("ready") ||
            status === "success" || 
            status === "deployed" ||
            msg.includes("deployed successfully")) {
          
          setDeploymentComplete(true)
          
          setTerminalLines(prev => [...prev, {
            type: "span" as const,
            text: "🎉 Store deployed successfully!",
            className: "text-emerald-400 font-bold text-lg",
          }, {
            type: "span" as const,
            text: "🚀 Terminal Ready",
            className: "text-cyan-400 font-bold text-lg",
          }])
          
          if (url) {
            let cleanUrl = url.trim()
            if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
              cleanUrl = `https://${cleanUrl}`
            }
            
            setStoreUrl(cleanUrl)
            setTerminalLines(prev => [...prev, {
              type: "span" as const,
              text: `🌐 Store URL: ${cleanUrl}`,
              className: "text-emerald-400 font-medium",
            }])
          }
        } else if (status === "failed" || 
                   msg.toLowerCase().includes("deployment failed") ||
                   msg.toLowerCase().includes("error") || 
                   msg.toLowerCase().includes("failed")) {
          setTerminalLines(prev => [...prev, {
            type: "span" as const,
            text: `❌ Deployment failed: ${msg}`,
            className: "text-red-400 font-semibold",
          }])
          toast.error("Deployment failed. Please try again.")
          setIsDeploying(false)
        } else if (msg.trim()) {
          // Show deployment progress messages
          let displayMsg = msg
          let className = "text-cyan-300 text-sm"
          
          // Enhanced message customization based on content
          if (msg.includes("Creating store directory")) {
            displayMsg = "📁 Setting up store structure..."
            className = "text-blue-400 text-sm"
          } else if (msg.includes("Looking for template")) {
            displayMsg = "🔍 Loading store template..."
            className = "text-purple-400 text-sm"
          } else if (msg.includes("Copying static file") || msg.includes("Created processed file")) {
            displayMsg = "📋 Installing store assets..."
            className = "text-indigo-400 text-sm"
          } else if (msg.includes("deployment_status")) {
            displayMsg = "⚙️ Finalizing deployment..."
            className = "text-yellow-400 text-sm"
          } else if (msg.includes("Installing dependencies")) {
            displayMsg = "📦 Installing dependencies..."
            className = "text-green-400 text-sm"
          } else if (msg.includes("Building application")) {
            displayMsg = "🔨 Building application..."
            className = "text-orange-400 text-sm"
          } else if (msg.includes("Starting server")) {
            displayMsg = "🚀 Starting server..."
            className = "text-pink-400 text-sm"
          }
          
          setTerminalLines(prev => [...prev, {
            type: "span" as const,
            text: displayMsg,
            className: className,
          }])
        }

        // Auto-scroll terminal
        setTimeout(handleScroll, 150)
      }

      ws.onerror = (error) => {
        clearTimeout(connectionTimeout)
        setTerminalLines(prev => [...prev, {
          type: "span" as const,
          text: "🚨 WebSocket connection error. Please check your network and try again.",
          className: "text-red-400 font-semibold",
        }])
        console.error("WebSocket error:", error)
        setIsDeploying(false)
        toast.error("Connection error during deployment")
      }

      return () => {
        clearTimeout(connectionTimeout)
        if (ws.readyState === WebSocket.OPEN) {
          ws.close()
        }
      }
    } catch (error) {
      setTerminalLines(prev => [...prev, {
        type: "span" as const,
        text: "🚨 Failed to establish WebSocket connection. Please ensure the deployment server is running.",
        className: "text-red-400 font-semibold",
      }])
      setIsDeploying(false)
      toast.error("Failed to connect to deployment server")
    }
  }, [router, onComplete, deploymentComplete, handleScroll])

  // Enhanced form change handler with validation
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Clean subdomain input
    if (name === 'subdomain') {
      const cleanValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20)
      setFormData((prev) => ({ ...prev, [name]: cleanValue }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }, [])

  // Enhanced form submission with better validation
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validation
    if (!formData.store_name.trim()) {
      toast.error("Please enter a store name")
      return
    }
    
    if (!formData.subdomain.trim()) {
      toast.error("Please enter a subdomain")
      return
    }
    
    if (formData.subdomain.length < 3) {
      toast.error("Subdomain must be at least 3 characters long")
      return
    }

    setLoading(true)
    setTerminalLines([])
    setIsDeploying(true)
    setDeploymentComplete(false)
    setStoreUrl(null)

    try {
      const store = await createStore(formData)
      if (store) {
        setStoreId(store.id)
        setStoreUrl(store.store_url)
        handleWebSocket(store.id)
        // Don't call onComplete here - wait for user to click the button
      } else {
        throw new Error("No store received from server")
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create store"
      toast.error(errorMessage)
      setTerminalLines([{
        type: "span",
        text: `❌ Error: ${errorMessage}`,
        className: "text-red-400 font-semibold",
      }])
      setIsDeploying(false)
    } finally {
      setLoading(false)
    }
  }, [formData, createStore, handleWebSocket])

  // Function to open store URL and complete the step
  const openStoreUrl = useCallback(() => {
    if (storeUrl && storeId) {
      window.open(storeUrl, "_blank", "noopener,noreferrer")
      toast.success("Opening your store in a new tab!")
      // Only call onComplete when the user explicitly clicks the button
      onComplete({
        id: storeId,
        store_url: storeUrl,
        store_name: formData.store_name,
        subdomain: formData.subdomain,
        store_type: formData.store_type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "active",
        owner_id: 0, // This will be set by the backend
        theme: "default",
        settings: {},
        metadata: {},
        analytics: {},
        features: [],
        integrations: [],
        custom_domain: null,
        ssl_status: "pending",
        deployment_status: "deployed",
        last_deployment: new Date().toISOString(),
        version: "1.0.0"
      })
      // Reset deployment state after completion
      setIsDeploying(false)
      setDeploymentComplete(false)
      setTerminalLines([])
    }
  }, [storeUrl, onComplete, storeId, formData])

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/20 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-600/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      
      {/* Enhanced Header */}
      <header className="relative w-full py-6 px-4 border-b border-gray-800/50 backdrop-blur-sm animate-slide-in">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <StoreIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Store Creator</h1>
              <p className="text-sm text-gray-400">Deploy your store in minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-400">System Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {/* Enhanced Deployment Modal */}
        {isDeploying && (
          <div className="fixed inset-0 z-50">
            <DeploymentBackground
              content={
                <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-indigo-900/30">
                  <div className="w-full max-w-4xl mx-auto">
                    <div className="flex flex-col items-center mb-8">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
                        <div className="relative p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
                          <Rocket className="h-12 w-12 text-white animate-bounce" />
                        </div>
                      </div>
                      <h1 className="text-4xl font-bold text-white mb-3 text-center">
                        {deploymentComplete ? "🎉 Deployment Complete!" : "🚀 Deploying Your Store"}
                      </h1>
                      <p className="text-gray-300 text-center max-w-md text-lg">
                        {deploymentComplete 
                          ? "Your store is now live and ready for customers!"
                          : "We're setting up your professional online store. This process typically takes 2-3 minutes."
                        }
                      </p>
                    </div>

                    {/* Enhanced Terminal */}
                    <div className="relative w-full max-h-[50vh] overflow-y-auto bg-gradient-to-br from-gray-950/90 to-gray-900/90 rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-2xl">
                      <div className="p-6" ref={terminalScrollRef}>
                        <Terminal className="text-white bg-transparent">
                          {terminalLines.length === 0 ? (
                            <AnimatedSpan className="text-cyan-400 text-sm font-mono">
                              🔄 Connecting to deployment server...
                            </AnimatedSpan>
                          ) : (
                            terminalLines.slice(-50).map((line, idx) => (
                              line.type === "typing" ? (
                                <TypingAnimation
                                  key={idx}
                                  className={`${line.className || "text-emerald-400"} text-sm font-mono mb-1 block`}
                                  delay={idx * 50}
                                >
                                  {line.text}
                                </TypingAnimation>
                              ) : (
                                <AnimatedSpan
                                  key={idx}
                                  className={`${line.className || "text-cyan-400"} text-sm font-mono mb-1 block`}
                                  delay={idx * 50}
                                >
                                  {line.text}
                                </AnimatedSpan>
                              )
                            ))
                          )}
                        </Terminal>
                      </div>
                    </div>

                    {/* Store URL Display */}
                    {storeUrl && (
                      <div className="mt-8 text-center">
                        <div className="inline-block bg-gradient-to-r from-emerald-500/20 to-green-500/20 p-6 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
                          <div className="flex items-center justify-center gap-3 mb-4">
                            <CheckCircle className="h-6 w-6 text-emerald-400" />
                            <span className="text-emerald-400 font-bold text-lg">Your Store is Live!</span>
                          </div>
                          <div className="flex gap-4 justify-center">
                            <button
                              onClick={openStoreUrl}
                              className="flex items-center gap-2 text-white bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                              <Globe className="h-5 w-5" />
                              Visit Your Store
                              <ExternalLink className="h-4 w-4" />
                            </button>
                            {storeId && (
                              <button
                                onClick={() => {
                                  router.push(`/dashboard/${storeId}`);
                                }}
                                className="flex items-center gap-2 text-white bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                              >
                                <StoreIcon className="h-5 w-5" />
                                Go to Dashboard
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-2 font-mono">{storeUrl}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              }
            />
          </div>
        )}

        {/* Enhanced Create Store Form */}
        {!isDeploying && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Enhanced Form */}
            <div className="relative animate-on-scroll">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-sm opacity-20"></div>
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/50 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl mb-4">
                    <StoreIcon className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">Create Your Store</h1>
                  <p className="text-gray-400 text-center leading-relaxed">
                    Launch your professional online business in minutes with our streamlined setup process.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="store_name" className="block text-white text-sm font-semibold mb-2">
                      Store Name <span className="text-indigo-400">*</span>
                    </label>
                    <Input
                      id="store_name"
                      name="store_name"
                      value={formData.store_name}
                      onChange={handleChange}
                      placeholder="e.g. Alex's Premium Shop"
                      required
                      className="h-12 bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subdomain" className="block text-white text-sm font-semibold mb-2">
                      Subdomain <span className="text-indigo-400">*</span>
                    </label>
                    <Input
                      id="subdomain"
                      name="subdomain"
                      value={formData.subdomain}
                      onChange={handleChange}
                      placeholder="e.g. alexshop"
                      required
                      minLength={3}
                      maxLength={20}
                      pattern="[a-z0-9-]+"
                      className="h-12 bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />
                    <div className="mt-2 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                      <p className="text-xs text-gray-400 mb-1">Your store will be available at:</p>
                      <p className="text-sm font-mono text-indigo-400">
                        https://{formData.subdomain || "yourstore"}.algecom.com
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={loading || storeLoading || !formData.store_name.trim() || !formData.subdomain.trim()}
                    className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg transform hover:scale-105"
                  >
                    {loading || storeLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Your Store...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Rocket className="h-5 w-5" />
                        <span>Deploy Store Now</span>
                      </div>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Enhanced Features Section */}
            <div className="space-y-8 animate-on-scroll">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Launch Your Dream Store</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Join thousands of entrepreneurs who've built successful online businesses with our platform.
                </p>
              </div>
              
              <div className="grid gap-6">
                <FeatureSpotlight
                  icon={<Zap className="h-6 w-6" />}
                  title="Lightning Fast Deployment"
                  description="Your store goes live in under 3 minutes with our automated deployment system and global CDN."
                  gradient="from-yellow-500 to-orange-600"
                />
                <FeatureSpotlight
                  icon={<Globe className="h-6 w-6" />}
                  title="Professional Domain"
                  description="Get a beautiful subdomain instantly, or connect your custom domain with one-click DNS setup."
                  gradient="from-blue-500 to-indigo-600"
                />
                <FeatureSpotlight
                  icon={<Sparkles className="h-6 w-6" />}
                  title="Premium Templates"
                  description="Choose from professionally designed, mobile-optimized templates that convert visitors into customers."
                  gradient="from-purple-500 to-pink-600"
                />
              </div>
              
              {/* Enhanced Testimonial */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-xl blur-sm opacity-20"></div>
                <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/50 p-6 rounded-xl border border-emerald-500/30 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 text-white flex items-center justify-center text-lg font-bold shadow-lg">
                      SJ
                    </div>
                    <div className="flex-1">
                      <blockquote className="text-gray-300 text-lg italic mb-3 font-medium">
                        "I went from idea to $10K in monthly sales in just 2 weeks. The deployment was seamless!"
                      </blockquote>
                      <div>
                        <p className="text-white font-semibold">Sarah Johnson</p>
                        <p className="text-emerald-400 text-sm font-medium">Fashion Boutique • $50K+ Revenue</p>
                      </div>
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

// Enhanced CSS animations
const styles = `
@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-slide-in {
  animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`

// Add styles to document
if (typeof document !== 'undefined') {
  const existingStyle = document.querySelector('style[data-performance-optimized]')
  if (!existingStyle) {
    const styleSheet = document.createElement('style')
    styleSheet.textContent = styles
    styleSheet.setAttribute('data-performance-optimized', 'true')
    document.head.appendChild(styleSheet)
  }
}

export default CreateStore