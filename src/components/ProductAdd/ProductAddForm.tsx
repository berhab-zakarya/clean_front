import { useState, useRef } from "react";
import {
  // Renamed to UnderlineIcon

  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import EditorToolbar from "./EditorToolbar";
import PricingComponent from "./PricingComponent";
import Model3DUpload from "./Model3DUpload";
import InventoryManagement from "./InventoryManagement";
import VariantsComponent from "./VariantsComponent";
import ShippingComponent from "./ShippingComponent";
import { Button } from "../common/ButtonModal";
import { Dialog } from "@headlessui/react"; // تأكد من تثبيت الحزمة أو استخدم أي Dialog آخر
import ProductSidebar from "./ProductSidebar";
import ProductDescriptionEditor from "./ProductDescriptionEditor";

function UrlDialogButton() {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // لإعادة رفع نفس الملف إذا لزم الأمر
      fileInputRef.current.click();
    }
  };

  const handleAddUrl = () => {
    if (!url) return;
    // هنا ضع منطق إضافة الملف من الرابط
    alert(`File added from URL: ${url}`);
    setShowUrlInput(false);
    setUrl("");
  };

  return showUrlInput ? (
    <div className="flex gap-2 items-center">
      <input
        type="url"
        className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Paste file URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        autoFocus
      />
      <Button
        type="button"
        className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded font-semibold text-sm"
        onClick={handleAddUrl}
        variant="primary"
      >
        Add
      </Button>
      <button
        type="button"
        className="text-gray-400 hover:text-gray-600 text-xl px-2"
        onClick={() => setShowUrlInput(false)}
        aria-label="Cancel"
      >
        ×
      </button>
    </div>
  ) : (
    <Button
      type="button"
      className="text-blue-700 underline bg-transparent px-4 py-2 font-semibold"
      onClick={() => setShowUrlInput(true)}
      variant="outline"
    >
      Add from URL
    </Button>
  );
}

export default function ProductAddForm() {
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    comparePrice: "",
    cost: "",
    chargeTax: true,
    status: "draft",
    channels: {
      onlineStore: true,
      shop: false,
      pointOfSale: false,
    },
    markets: {
      international: true,
      us: true,
    },
    category: "",
    productType: "",
    vendor: "",
  });

  const [profit, setProfit] = useState(0);
  const [margin, setMargin] = useState(0);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExistingDialog, setShowExistingDialog] = useState(false);

  const [hovering, setHovering] = useState(false);

  const handleDragEnter = () => setHovering(true);
  const handleDragLeave = () => setHovering(false);
  const handleDrop = () => setHovering(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
  });

  const calculateProfitMargin = () => {
    const price = parseFloat(productData.price) || 0;
    const cost = parseFloat(productData.cost) || 0;

    const calculatedProfit = price - cost;
    setProfit(calculatedProfit);

    const calculatedMargin = price > 0 ? (calculatedProfit / price) * 100 : 0;
    setMargin(calculatedMargin);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setProductData({ ...productData, [name]: checked });
    } else {
      setProductData({ ...productData, [name]: value });
    }

    if (["price", "cost"].includes(name)) {
      setTimeout(calculateProfitMargin, 0);
    }
  };

  const handleChannelChange = (channel) => {
    setProductData({
      ...productData,
      channels: {
        ...productData.channels,
        [channel]: !productData.channels[channel],
      },
    });
  };

  const handleMarketChange = (market) => {
    setProductData({
      ...productData,
      markets: {
        ...productData.markets,
        [market]: !productData.markets[market],
      },
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // لإعادة رفع نفس الملف إذا لزم الأمر
      fileInputRef.current.click();
    }
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      preview: URL.createObjectURL(file),
    }));

    setMediaFiles([...mediaFiles, ...newFiles]);
  };

  const removeMedia = (id) => {
    setMediaFiles(mediaFiles.filter((file) => file.id !== id));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!productData.title) {
        alert("Please enter a product title");
        return;
      }

      // Create form data to handle both text and files
      const formData = new FormData();

      // Add product data
      formData.append("productData", JSON.stringify(productData));

      // Add media files
      mediaFiles.forEach((file) => {
        formData.append("media", file);
      });

      // Make API call
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      // Show success message
      setShowSuccess(true);

      // Clear form or redirect
      // setProductData({ ...initialProductState });
      // router.push('/products');

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[28px] md:text-[38px] font-[600] leading-[40px] md:leading-[60px] text-gray-800  mt-[40px] md:mt-[111px]">
            Add Product
          </h1>
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-[142px] h-[42px] bg-[#1E3A8A] rounded-full mt-[40px] md:mt-[111px] ml-[20px] "
              variant="primary"
            >
              {isSubmitting ? (
                <>
                  <Image
                    src="/assets/icons/landing.svg"
                    alt="Loading icon"
                    width={24}
                    height={24}
                  />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <span className="text-[16px]">Publish product</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-[16px] md:text-[20px] font-[500] leading-[24px] md:leading-[28px] text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={productData.title}
                  onChange={handleInputChange}
                  placeholder="Short sleeve t-shirt"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Description
              </h2>

             <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
                <ProductDescriptionEditor editor={editor} />
               
              </div> 
            </div>

            {/* Media Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="font-[500] text-[16px] md:text-[20px] text-gray-800 mb-0">
                Media
              </h2>

              <div
                className={`border-1 border-solid rounded-lg p-8 flex flex-col items-center justify-center min-h-[160px] ${
                  hovering ? "border-blue-400 bg-blue-50" : "border-gray-300"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex items-center justify-center gap-6 mb-2">
                  <Button
                    type="button"
                    onClick={handleUploadClick}
                    className={`px-6 py-2 rounded-full bg-[#1E3A8A] font-medium text-base transition ${
                      activeTab === "upload"
                        ? "bg-[#1E3A8A] text-white"
                        : "bg-[#1E3A8A] text-white "
                    }`}
                    variant={activeTab === "upload" ? "primary" : "outline"}
                  >
                    Upload new
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleMediaUpload}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      setActiveTab("existing");
                      setShowExistingDialog(true);
                    }}
                    className={`px-6 py-2 font-medium text-[16px] transition !bg-transparent text-gray-800 ${
                      activeTab !== "existing" ? "hover:underline" : ""
                    }`}
                    variant={activeTab === "existing" ? "secondary" : "outline"}
                  >
                    Select existing
                  </Button>
                </div>

                {/* Show text only if no files */}
                {mediaFiles.length === 0 && (
                  <p className="text-[14px] text-[#828282] mt-2">
                    Accepts images, videos, or 3D models
                  </p>
                )}

                {/* Show files inside the box */}
                {mediaFiles.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-4 w-full justify-center">
                    {mediaFiles.map((file) => (
                      <div key={file.id} className="relative group">
                        {file.type.startsWith("image") ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          />
                        ) : file.type.startsWith("video") ? (
                          <video
                            src={file.preview}
                            controls
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          />
                        ) : null}
                        <button
                          type="button"
                          onClick={() => removeMedia(file.id)}
                          className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-600 hover:text-red-600 shadow group-hover:visible invisible"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Model3DUpload />

           
              <PricingComponent />
          

            
              <InventoryManagement />
            
              <ShippingComponent />
           
              <VariantsComponent />
           
           
             
       
          </div>
          <ProductSidebar
    productData={productData}
    handleInputChange={handleInputChange}
    handleChannelChange={handleChannelChange}
    handleMarketChange={handleMarketChange}
  />
          {/* Sidebar - Right Section */}
       
        </div>
      </div>
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in z-50">
          <svg
            className="w-6 h-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Product added successfully!</span>
        </div>
      )}
      {/* Dialog for Select Existing */}
      <Dialog
        open={showExistingDialog}
        onClose={() => setShowExistingDialog(false)}
        className="fixed z-50 inset-0 flex items-center justify-center"
      >
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto p-8 relative z-50 animate-fade-in">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            onClick={() => setShowExistingDialog(false)}
            aria-label="Close"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex flex-col items-center">
            <img
              alt=""
              src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/fr/assets/empty-state-media-DnFQWaULcLdk.svg"
              className="w-36 h-36 mb-6 drop-shadow"
              role="presentation"
            />
            <div className="max-w-xs text-center">
              <p className="text-xl font-bold mb-2 text-gray-800">No files yet</p>
              <p className="text-gray-500 mb-6 text-base">
                Upload files to select from your media library. You can reuse
                these files in other sections of your store.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  type="button"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
                  onClick={() => {
                    setShowExistingDialog(false);
                    setActiveTab("upload");
                    // Optionally, focus the upload input if available
                  }}
                  variant="primary"
                >
                  Upload a file
                </Button>
                <UrlDialogButton />
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}