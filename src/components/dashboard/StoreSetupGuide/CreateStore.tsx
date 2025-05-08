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
        if (url) setStoreUrl(url);
        ws.close();
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
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
    <div className="max-w-2xl mx-auto mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      {!isDeploying ? (
        <>
          <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2 text-center">
            Create Your Store
          </h1>
          <p className="text-gray-500 mb-8 text-center">
            Start by entering your store name and a unique subdomain.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2 text-center">
            Deploying Your Store...
          </h1>
          <p className="text-gray-500 mb-8 text-center">
            Please wait while we deploy your store. You will see real-time logs
            below.
          </p>
        </>
      )}
      {/* Hide form when deploying */}
      {!isDeploying && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              label="Store Name"
              name="store_name"
              value={formData.store_name}
              onChange={handleChange}
              placeholder="e.g. Alex Shop"
              required
              radius="lg"
              className="text-lg"
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
              className="text-lg"
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
            className="w-full rounded-full py-3 text-lg font-semibold bg-[#1E3A8A] hover:bg-[#2546b3] transition"
          >
            {loading || storeLoading ? "Creating..." : "Create Store"}
          </Button>
        </form>
      )}

      {/* Terminal output */}
      {terminalLines.length > 0 && (
        <div
          className="mt-8 max-h-[70vh] min-h-[250px] overflow-y-auto bg-black rounded-lg p-4"
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
        <div className="mt-6 text-center">
          <span className="text-green-700 font-semibold">
            Your store is live:
          </span>
          <br />
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-700 break-all"
          >
            {storeUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default CreateStore;
