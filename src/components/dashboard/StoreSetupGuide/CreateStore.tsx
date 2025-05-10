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

export const CreateStore = () => {
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
        className: "text-black",
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
        url = data.store_url;
      } catch {
        // plain text
      }

      if (status === "deployed") {
        addTerminalLine({
          type: "span",
          text: "✔ Store deployed successfully!",
          className: "text-green-500",
        });
        
        if (url) {
          setStoreUrl(url); // Set the URL first
          // Add a small delay before opening the URL
          setTimeout(() => {
            window.open(url, "_blank");
          }, 1000);
        }
        
        // Don't redirect to dashboard immediately
        ws.close();
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000); // Increased timeout to allow seeing the success message
      } else if (status === "failed") {
        addTerminalLine({
          type: "span",
          text: "✖ Deployment failed!",
          className: "text-red-500",
        });
        ws.close();
      } else if (msg) {
        addTerminalLine({
          type: "span",
          text: msg,
          className: "text-blue-500",
        });
      }
    };

    ws.onerror = () => {
      addTerminalLine({
        type: "span",
        text: "WebSocket error during deployment.",
        className: "text-red-500",
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
          className: "text-black",
        });

        // Show API message
        addTerminalLine({
          type: "span",
          text: response.message,
          className: "text-blue-500",
        });

        // Show store URL if available
        if (response.store_url) {
          addTerminalLine({
            type: "span",
            text: `Store URL: ${response.store_url}`,
            className: "text-green-500",
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
        className: "text-red-500",
      });
      setIsDeploying(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto mt-16 bg-gradient-to-br from-[#e0e7ff] via-white to-[#f0f4ff] rounded-3xl shadow-2xl p-10 border border-gray-200 overflow-hidden">
      {/* خلفية زخرفية عصرية */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-tr from-[#1E3A8A]/30 via-[#60a5fa]/20 to-[#f0f4ff]/0 rounded-full blur-3xl z-0"></div>
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-br from-[#1E3A8A]/20 via-[#f472b6]/10 to-[#f0f4ff]/0 rounded-full blur-3xl z-0"></div>
      <div className="relative z-10">
        {!isDeploying ? (
          <>
            <div className="flex flex-col items-center mb-6">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#1E3A8A] to-[#60a5fa] shadow-lg mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 7l9-4 9 4M4 10v6a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 012-2h0a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 002-2v-6" />
                </svg>
              </span>
              <h1 className="text-4xl font-extrabold text-[#1E3A8A] mb-2 text-center drop-shadow-lg">
                Create Your Store
              </h1>
              <p className="text-gray-500 mb-4 text-center text-lg">
                Start by entering your store name and a unique subdomain.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center mb-6 animate-pulse">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#1E3A8A] to-[#60a5fa] shadow-lg mb-3">
                <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0110 10" />
                </svg>
              </span>
              <h1 className="text-4xl font-extrabold text-[#1E3A8A] mb-2 text-center drop-shadow-lg">
                Deploying Your Store...
              </h1>
              <p className="text-gray-500 mb-4 text-center text-lg">
                Please wait while we deploy your store. You will see real-time logs below.
              </p>
            </div>
          </>
        )}
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
                className="text-lg shadow-md focus:ring-2 focus:ring-[#1E3A8A]/40"
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
                className="text-lg shadow-md focus:ring-2 focus:ring-[#1E3A8A]/40"
              />
              <p className="text-xs text-gray-400 mt-1 ml-1">
                Your store will be available at:{" "}
                <span className="font-semibold text-[#1E3A8A]">
                  {formData.subdomain || "yourstore"}.algecom.com
                </span>
              </p>
            </div>
            <Button
              type="submit"
              
              loading={loading || storeLoading}
              className="w-full rounded-full py-3 text-lg font-bold bg-gradient-to-tr from-[#1E3A8A] to-[#60a5fa] text-white shadow-xl hover:scale-105 hover:from-[#2546b3] hover:to-[#3b82f6] transition-all duration-200"
            >
              {loading || storeLoading ? "Creating..." : "Create Store"}
            </Button>
          </form>
        )}

        {/* Terminal output */}
        {terminalLines.length > 0 && (
          <div
            className="mt-10 max-h-[70vh] min-h-[250px] overflow-y-auto bg-black/90 rounded-xl p-6 shadow-inner border border-gray-800"
            ref={terminalScrollRef}
          >
            <Terminal>
              {terminalLines.map((line, idx) =>
                line.type === "typing" ? (
                  <TypingAnimation
                    key={idx}
                    className={line.className}
                    delay={idx * 200}
                  >
                    {line.text}
                  </TypingAnimation>
                ) : (
                  <AnimatedSpan
                    key={idx}
                    className={line.className}
                    delay={idx * 200 + 100}
                  >
                    <span>{line.text}</span>
                  </AnimatedSpan>
                )
              )}
            </Terminal>
          </div>
        )}

        {/* Show store URL only after deployment */}
        {storeUrl && (
          <div className="mt-8 text-center animate-fade-in">
            <span className="text-green-700 font-bold text-lg">
              🎉 Your store is live:
            </span>
            <br />
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-700 break-all text-xl font-semibold hover:text-blue-900 transition"
            >
              {storeUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateStore;
