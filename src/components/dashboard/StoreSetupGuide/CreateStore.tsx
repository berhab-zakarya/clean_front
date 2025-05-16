"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useStore } from "@/hooks/useStore";
import { toast } from "react-hot-toast";
import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/magicui/terminal";
import MergedComponent from "./MergedComponent";

interface CreateStoreProps {
  onComplete: () => void;
}

export const CreateStore = ({ onComplete }: CreateStoreProps) => {
  const router = useRouter();
  const { createStore, loading: storeLoading, error } = useStore();
  const [formData, setFormData] = useState({
    store_name: "",
    subdomain: "",
    store_type: "nextjs",
  });
  const [loading, setLoading] = useState(false);
  const [storeUrl, setStoreUrl] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Terminal log state
  const [terminalLines, setTerminalLines] = useState<
    {
      type: "typing" | "span";
      text: string;
      className?: string;
      delay?: number;
    }[]
  >([]);

  // Terminal scroll ref
  const terminalScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll terminal to bottom on new line
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop =
        terminalScrollRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a new line to the terminal log
  const addTerminalLine = (line: {
    type: "typing" | "span";
    text: string;
    className?: string;
    delay?: number;
  }) => {
    setTerminalLines((prev) => [...prev, line]);
  };

  const handleWebSocket = (storeId: number) => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/deployment/${storeId}/`);
    wsRef.current = ws;

    ws.onopen = () => {
      addTerminalLine({
        type: "typing",
        text: `> Deploying store #${storeId}...`,
        className: "text-[#00ff9d]",
      });
    };

    ws.onmessage = (event) => {
      let msg = event.data;
      let status = "";
      let url = "";
      try {
        const data = JSON.parse(event.data);
        msg = data.message || event.data;
        status = data.status;
        url = data.url || data.store_url;
      } catch {
        // plain text
      }

      // Check if the message indicates server is running
      if (msg.includes("Next.js server is running")) {
        addTerminalLine({
          type: "span",
          text: "✓ Store deployed successfully!",
          className: "text-[#00ff9d] font-semibold",
        });

        // Get the store URL from the WebSocket message
        if (url) {
          setStoreUrl(url);
          // Add a small delay before opening the URL
          setTimeout(() => {
            window.open(url, "_blank");
            // Close WebSocket and redirect after opening URL
            if (wsRef.current) {
              wsRef.current.close();
            }
            setTimeout(() => {
              router.push("/dashboard");
            }, 2000);
          }, 1000);
        }
      } else if (status === "failed") {
        addTerminalLine({
          type: "span",
          text: "✖ Deployment failed!",
          className: "text-[#ff4d4d] font-semibold",
        });
        ws.close();
      } else if (msg) {
        addTerminalLine({
          type: "span",
          text: msg,
          className: "text-[#00ffff]",
        });
      }
    };

    ws.onerror = () => {
      addTerminalLine({
        type: "span",
        text: "WebSocket error during deployment.",
        className: "text-[#ff4d4d] font-semibold",
      });
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTerminalLines([]); // Reset terminal log
    setIsDeploying(true);

    try {
      const response = await createStore(formData);
      if (response && response.message) {
        toast.success(response.message);

        // Show initial command in terminal
        addTerminalLine({
          type: "typing",
          text: `> Creating store "${formData.store_name}"...`,
          className: "text-[#00ff9d]",
        });

        // Show API message
        addTerminalLine({
          type: "span",
          text: response.message,
          className: "text-[#00ffff]",
        });

        // Show store URL if available
        if (response.store_url) {
          addTerminalLine({
            type: "span",
            text: `Store URL: ${response.store_url}`,
            className: "text-[#00ff9d]",
          });
        }

        // Connect to WebSocket for deployment status
        if (response.id) {
          handleWebSocket(response.id);
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to create store");
      addTerminalLine({
        type: "span",
        text: err?.message || "Failed to create store",
        className: "text-[#ff4d4d]",
      });
      setIsDeploying(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isDeploying && (
        <div className="fixed inset-0 z-50">
          <MergedComponent 
            content={
              <div className="w-full max-w-4xl mx-auto">
                <div className="flex flex-col items-center mb-6">
                  <h1 className="text-3xl font-bold text-white mb-4">Deploying Your Store</h1>
                  <p className="text-gray-300 text-center mb-8">
                    Please wait while we set up your store. This may take a few minutes.
                  </p>
                </div>
                
                {/* Terminal output */}
                {terminalLines.length > 0 && (
                  <div className="w-full max-h-[60vh] flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div
                      className="flex-1 overflow-y-auto p-6 bg-black/50 rounded-xl backdrop-blur-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                      ref={terminalScrollRef}
                    >
                      <Terminal className="text-white bg-[#0a0a0a] rounded-lg shadow-xl border border-gray-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {terminalLines.map((line, idx) =>
                          line.type === "typing" ? (
                            <TypingAnimation
                              key={idx}
                              className={`${
                                line.className || "text-[#00ff9d]"
                              } text-base font-mono`}
                              delay={idx * 200}
                            >
                              {line.text}
                            </TypingAnimation>
                          ) : (
                            <AnimatedSpan
                              key={idx}
                              className={`${
                                line.className || "text-[#00ffff]"
                              } text-base font-mono`}
                              delay={idx * 200 + 100}
                            >
                              <span>{line.text}</span>
                            </AnimatedSpan>
                          )
                        )}
                      </Terminal>
                    </div>
                  </div>
                )}

                {/* Show store URL only after deployment */}
                {storeUrl && (
                  <div className="mt-8 text-center animate-fade-in">
                    <span className="text-[#00ff9d] font-bold text-lg">
                      🎉 Your store is live:
                    </span>
                    <br />
                    <a
                      href={storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00ffff] break-all text-xl font-semibold hover:text-[#00ff9d] transition"
                    >
                      {storeUrl}
                    </a>
                  </div>
                )}
              </div>
            }
          />
        </div>
      )}
      <div
        className={`relative max-w-2xl mx-auto mt-16 ${
          isDeploying
            ? "hidden"
            : "bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e293b]"
        } rounded-3xl shadow-2xl p-10 border border-white/10 overflow-hidden z-10`}
      >
        {/* خلفية زخرفية عصرية */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-tr from-[#6366f1]/30 via-[#8b5cf6]/20 to-transparent rounded-full blur-3xl z-0"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-br from-[#6366f1]/20 via-[#8b5cf6]/10 to-transparent rounded-full blur-3xl z-0"></div>
        <div className="relative z-10">
          {!isDeploying ? (
            <>
              <div className="flex flex-col items-center mb-6">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] shadow-lg mb-3">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 7l9-4 9 4M4 10v6a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 012-2h0a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 002-2v-6" />
                  </svg>
                </span>
                <h1 className="text-4xl font-extrabold text-white mb-2 text-center drop-shadow-lg">
                  Create Your Store
                </h1>
                <p className="text-gray-300 mb-4 text-center text-lg">
                  Start by entering your store name and a unique subdomain.
                </p>
              </div>
            </>
          ) : null}
          
          {/* Hide form when deploying */}
          {!isDeploying && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <Input
                  label="Store Name"
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Shop"
                  required
                  radius="lg"
                  className="text-lg shadow-md focus:ring-2 focus:ring-[#6366f1]/40 bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Input
                  label="Subdomain"
                  name="subdomain"
                  value={formData.subdomain}
                  onChange={handleChange}
                  placeholder="e.g. alexshop"
                  required
                  radius="lg"
                  className="text-lg shadow-md focus:ring-2 focus:ring-[#6366f1]/40 bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1 ml-1">
                  Your store will be available at:{" "}
                  <span className="font-semibold text-[#00ffff]">
                    {formData.subdomain || "yourstore"}.algecom.com
                  </span>
                </p>
              </div>
              <Button
                type="submit"
                disabled={loading || storeLoading}
                // loading={loading || storeLoading}
                className="w-full rounded-full py-3 text-lg font-bold bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] text-white shadow-xl hover:scale-105 hover:from-[#4f46e5] hover:to-[#7c3aed] transition-all duration-200"
              >
                {loading || storeLoading ? "Creating..." : "Create Store"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateStore;
