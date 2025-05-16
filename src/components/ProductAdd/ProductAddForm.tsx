import { useState, useRef, useEffect } from "react";
import {
  Trash2,
  MoreHorizontal, Info,
  ChevronDown
} from "lucide-react";

import Image from "next/image";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

import Model3DUpload from "./Model3DUpload";
import InventoryManagement from "./InventoryManagement";
import VariantsComponent from "./VariantsComponent";
import ShippingComponent from "./ShippingComponent";
import { Button } from "../common/ButtonModal";
import { Dialog } from "@headlessui/react";
import SimpleInput from "../common/Input";
import { Checkbox } from "../common/Checkbox";
import ProductDescriptionEditor from "./ProductDescriptionEditor";
import { useProduct } from "@/hooks/useProduct";
import { useStore } from "@/hooks/useStore";
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import type { ProductVariant } from "@/lib/types/product";

// Fixed type definition for media files
interface MediaFile {
  id: string;
  name: string;
  type: string;
  preview: string;
}

function UrlDialogButton() {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleAddUrl = () => {
    if (!url) return;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { createProduct, addProductImages, addProductVariants } = useProduct();
  const { storeId, loading: storeLoading } = useStore();

  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: 0,
    price_discount: 0,
    discount: 0,
    status: "published" as const,
    category: "",
    product_type: "",
    vendor: "",
    collections: [],
    tags: [],
    sku: "",
    inventory_quantity: 0,
    available_quantity: 0,
    requires_shipping: true,
    channels: {
      onlineStore: true,
      shop: false,
      pointOfSale: false,
    },
    markets: {
      international: true,
      us: true,
    }
  });

  const [profit, setProfit] = useState(0);
  const [margin, setMargin] = useState(0);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExistingDialog, setShowExistingDialog] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

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

  const handleChannelChange = (channel: string) => {
    setProductData(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel as keyof typeof prev.channels]
      }
    }));
  };

  const handleMarketChange = (market: string) => {
    setProductData(prev => ({
      ...prev,
      markets: {
        ...prev.markets,
        [market]: !prev.markets[market as keyof typeof prev.markets]
      }
    }));
  };

  useEffect(() => {
    if (storeId) {
      setProductData(prev => ({
        ...prev,
        tenant_id: storeId
      }));
      console.log('Updated tenant_id:', storeId);
    }
  }, [storeId]);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      if (!storeId) {
        toast.error("Store information is missing");
        return;
      }

      // Prepare the product data according to CreateProductRequest type
      const finalProductData = {
        name: productData.title,
        slug: productData.title.toLowerCase().replace(/\s+/g, '-'),
        description: productData.description,
        price: productData.price.toString(),
        promotional_price: productData.price_discount.toString(),
        currency: "USD",
        stock_quantity: productData.inventory_quantity,
        sku: productData.sku,
        category: parseInt(productData.category) || 1,
        is_featured: false,
        status: productData.status,
        has_variants: variants.length > 0
      };

      // Create the product
      const result = await createProduct(finalProductData);
      
      if (result) {
        // If we have media files, add them as product images
        if (mediaFiles.length > 0) {
          const productImages = mediaFiles.map((file, index) => ({
            image_url: file.preview,
            alt_text: file.name,
            is_primary: index === 0, // First image is primary
            sort_order: index + 1
          }));

          await addProductImages(result.id, productImages);
        }

        // If the product has variants, add them
        if (variants.length > 0) {
          await addProductVariants(result.id, variants);
        }

        toast.success("Product created successfully!");
        router.push('/dashboard/products');
      }
    } catch (error) {
      console.error("Product creation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : 
              type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  const handleDescriptionChange = (content: string) => {
    setProductData(prev => ({
      ...prev,
      description: content
    }));
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      preview: URL.createObjectURL(file),
    }));

    setMediaFiles([...mediaFiles, ...newFiles]);
  };

  const removeMedia = (id: string) => {
    setMediaFiles(mediaFiles.filter((file) => file.id !== id));
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleAddOption = (option: { id: string; name: string; values: string[] }) => {
    // Convert option to ProductVariant format
    const newVariants = option.values.map(value => ({
      sku: `${productData.sku}-${value}`,
      price_adjustment: "0.00",
      stock_quantity: productData.inventory_quantity,
      attributes: [
        {
          attribute_id: parseInt(option.id),
          value_id: parseInt(value)
        }
      ]
    }));

    setVariants(prev => [...prev, ...newVariants]);
  };

  const handleRemoveOption = (optionId: string) => {
    // Remove variants associated with this option
    setVariants(prev => prev.filter(variant => 
      !variant.attributes.some(attr => attr.attribute_id === parseInt(optionId))
    ));
  };

  if (storeLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-[#1E3A8A]">Loading store information...</div>
      </div>
    );
  }

  

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
        
          <div className="lg:col-span-2 space-y-6">
        
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
             <ProductDescriptionEditor 
           onDescriptionChange={handleDescriptionChange}
          />
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

           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                 <h2 className="font-[500] text-[20px] text-gray-800 mb-2">Pricing</h2>
           
                 <div className="space-y-6">
                   <div className="flex">
                     <div className="mr-[29px]">
                       <label
                         htmlFor="price"
                         className="block text-[16px] font-[400] font-normal text-gray-700 mb-2"
                       >
                         Price
                       </label>
                       <SimpleInput
                         type="text"
                         id="price"
                         name="price"
                         value={productData.price}
                         onChange={handleInputChange}
                         placeholder="0.00"
                         width={200}
                         height={35}
                         iconFirst={
                           <span className="text-black font-semibold text-[16px]">$</span>
                         }
                         className="text-[16px]"
                       />
                     </div>
           
                     <div>
                       <label
                         htmlFor="comparePrice"
                         className="block text-[16px] font-normal font-[400] text-gray-700 mb-2"
                       >
                         Compare-price
                       </label>
                       <SimpleInput
                         type="text"
                         id="comparePrice"
                         name="price_discount"
                         value={productData.price_discount}
                         onChange={handleInputChange}
                         placeholder="0.00"
                         width={200}
                         height={35}
                         iconFirst={
                           <span className="text-black font-semibold text-[16px]">$</span>
                         }
                         iconLast={
                           <Image
                             src="/assets/icons/icon_help_hexagon.svg"
                             alt="Help Icon"
                             width={24}
                             height={24}
                             className="cursor-pointer"
                           />
                         }
                         className="text-[16px] pr-2"
                       />
                     </div>
                   </div>
           
                   <div className="py-2">
                     <div className="flex items-center">
                       <Checkbox
                         id="chargeTax"
                         name="requires_shipping"
                         checked={productData.requires_shipping}
                         onCheckedChange={(checked) =>
                           handleInputChange({
                             target: {
                               name: "requires_shipping",
                               type: "checkbox",
                               checked,
                             },
                           })
                         }
                         color="secondary"
                         
                         className="rounded-[4px]  h-[20px] w-[20px]"
                         
                       />
                       <label
                         htmlFor="chargeTax"
                         className="ml-2 text-sm text-black text-[16px] font-[400] "
                       >
                         Charge tax on this product
                       </label>
                     </div>
                   </div>
           
                   <div className="grid grid-cols-3 gap-6">
                     <div>
                       <label
                         htmlFor="cost"
                         className="block text-[16px] font-normal text-gray-700 mb-2"
                       >
                         Cost per items
                       </label>
                       <div className="relative flex items-center">
                         <SimpleInput
                           type="text"
                           id="cost"
                           name="discount"
                           value={productData.discount}
                           onChange={handleInputChange}
                           placeholder="0.00"
                           width={200}
                           height={45}
                           iconFirst={
                             <span className="text-black font-semibold text-[20px]">
                               $
                             </span>
                           }
                           iconLast={
                             <Image
                               src="/assets/icons/icon_help_hexagon.svg"
                               alt="Help Icon"
                               width={24}
                               height={24}
                               className="cursor-pointer"
                             />
                           }
                           className="text-[20px] text-black"
                         />
                       </div>
                     </div>
                     <div>
                       <label className="block text-[16px] font-[400] font-normal text-gray-700 mb-2">
                         Profit
                       </label>
                       <div
                         className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md"
                         style={{ width: "200px", height: "45px" }}
                       >
                         ${profit}
                       </div>
                     </div>
           
                     <div>
                       <label className="block text-[16px] font-[400] font-normal text-gray-700 mb-2">
                         Margin
                       </label>
                       <div
                         className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md"
                         style={{ width: "200px", height: "45px" }}
                       >
                         {margin}%
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
          

            
              <InventoryManagement />
            
              <ShippingComponent />
           
              <VariantsComponent 
                onAddOption={handleAddOption}
                onRemoveOption={handleRemoveOption}
                initialOptions={[]}
              />
           
           
             
       
          </div>
          <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-[20px] font-[600] text-black mb-4">Status</h2>
        <div className="relative">
          <select
            id="status"
            name="status"
            value={productData.status}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-3.5 text-gray-500"
            size={16}
          />
        </div>
      </div>

      {/* Sales Channels */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[20px] font-[600] text-black ">Publishing</h2>
          <button className="text-gray-500">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Sales Channels */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Sales channels
          </h3>
          <div className="flex flex-col space-y-4">
            {" "}
            {/* Changed to flex-col and increased spacing */}
            <Checkbox
              id="onlineStore"
              checked={productData.channels.onlineStore}
              onCheckedChange={() => handleChannelChange("onlineStore")}
              color="secondary"
              className="rounded-[2px] h-[20px] w-[20px]"
              labelClassName="text-[16px] text-gray-700"
              label="Online Store"
            />
            <Checkbox
              id="shop"
              checked={productData.channels.shop}
              onCheckedChange={() => handleChannelChange("shop")}
              color="secondary"
              className="rounded-[2px] h-[20px] w-[20px]"
              labelClassName="text-[16px] text-gray-700"
              label="Shop"
            />
            <Checkbox
              id="pointOfSale"
              checked={productData.channels.pointOfSale}
              onCheckedChange={() => handleChannelChange("pointOfSale")}
              color="secondary"
              className="rounded-[2px] h-[20px] w-[20px]"
              labelClassName="text-[16px] text-gray-700"
              label="Point of Sale"
            />
            {!productData.channels.pointOfSale && (
              <div className="ml-7 text-sm text-[var(--primary-900)]">
                <p className="text-[var(--primary-900)]">
                  Point of Sale has not been set up. Finish the
                  <br />
                  remaining steps to start selling in person.
                </p>
                <a
                  href="#"
                  className="text-[var(--primary-900)] font-medium mt-1 block"
                >
                  Learn more
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Markets */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Markets</h3>
          <div className="space-y-2">
            <Checkbox
              id="international"
              checked={
                productData.markets.international && productData.markets.us
              }
              onCheckedChange={() => {
                handleMarketChange("international");
                handleMarketChange("us");
              }}
              color="secondary"
              className="rounded h-5 w-5"
              labelClassName="text-base text-gray-700"
              label="International and United States"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Product organization
          </h2>
          <Info className="ml-1 text-black" size={18} />
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="category"
              className="block text-black text-[16px] font-[500] mb-1"
            >
              Category
            </label>
            <SimpleInput
              type="text"
              id="category"
              name="category"
              value={productData.category}
              onChange={handleInputChange}
              width={316}
              height={43}
              className="text-[16px]"
            />
            <p className="font-[500] text-[16px] text-[var(--primary-900)] mt-1">
              Determines US tax rates
            </p>
          </div>

          <div>
            <label
              htmlFor="productType"
              className="block text-black text-[16px] font-[500] mb-1"
            >
              Product type
            </label>
            <SimpleInput
              type="text"
              id="productType"
              name="product_type" // Fixed field name to match state
              value={productData.product_type}
              onChange={handleInputChange}
              width={316}
              height={43}
              className="text-[16px]"
            />
          </div>

          <div>
            <label
              htmlFor="vendor"
              className="block text-black text-[16px] font-[500] mb-1"
            >
              Vendor
            </label>
            <SimpleInput
              type="text"
              id="vendor"
              name="vendor"
              value={productData.vendor}
              onChange={handleInputChange}
              width={316}
              height={43}
              className="text-[16px]"
            />
          </div>

          <div>
            <label
              htmlFor="collections"
              className="block text-black text-[16px] font-[500] mb-1"
            >
              Collections
            </label>
            <SimpleInput
              type="text"
              id="collections"
              name="collections"
              value={productData.collections}
              onChange={handleInputChange}
              width={316}
              height={43}
              className="text-[16px]"
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-black text-[16px] font-[500] mb-1"
            >
              Tags
            </label>
            <SimpleInput
              type="text"
              id="tags"
              name="tags"
              value={productData.tags}
              onChange={handleInputChange}
              width={316}
              height={43}
              className="text-[16px]"
            />
          </div>
        </div>
      </div>
    </div>
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