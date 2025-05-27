import { useState, useRef, useEffect } from "react";
import {
  Trash2,
  MoreHorizontal, Info,
  ChevronDown,
  Plus
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
import { useToast } from "@/hooks/use-toast";
import type { CreateProductRequest, ProductVariant } from "@/lib/types/product";
import { useStorePath } from "@/hooks/useStorePath";


// Fixed type definition for media files
interface MediaFile {
  id: string;
  name: string;
  type: string;
  preview: string;
  file: File;
}

interface FAQ {
  question: string;
  answer: string;
}

// Extended ProductVariant type to include all required properties
interface ExtendedProductVariant extends ProductVariant {
  attributes: Array<{
    attribute_id: number;
    value_id: number;
  }>;
}

export default function ProductAddForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { createProduct, addProductVariants } = useProduct();
  const { storeId, loading: storeLoading } = useStore();
  const { currentStoreId } = useStorePath();
  const { toast } = useToast();

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
    inventory_quantity: 10,
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
  const [variants, setVariants] = useState<ExtendedProductVariant[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

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
      
      if (!storeId || !currentStoreId) {
        toast({
          title: "Error",
          description: "Store information is missing",
          variant: "destructive"
        });
        return;
      }

      // Prepare the product data according to CreateProductRequest type
      const finalProductData: CreateProductRequest = {
        name: productData.title,
        slug: productData.title.toLowerCase().replace(/\s+/g, '-'),
        description: productData.description,
        price: productData.price,
        promotional_price: productData.price_discount,
        currency: "USD",
        stock_quantity: productData.inventory_quantity,
        sku: productData.sku,
        category: parseInt(productData.category) || 1,
        is_featured: false,
        status: productData.status,
        has_variants: variants.length > 0,
        faqs: faqs.map(faq => ({
          question: faq.question,
          answer: faq.answer
        })),
        images: mediaFiles.map((file, index) => ({
          file: file.file,
          alt_text: file.name,
          is_primary: index === 0,
          sort_order: index
        }))
      };

      // Create the product using the hook
      const result = await createProduct(finalProductData);
      
      if (!result) {
        throw new Error('Failed to create product: No response received');
      }

      // If there are variants, add them to the product
      if (variants.length > 0) {
        try {
          await addProductVariants(result.id, variants);
          toast({
            title: "Success",
            description: "Product variants added successfully"
          });
        } catch (error) {
          console.error("Error adding variants:", error);
          toast({
            title: "Error",
            description: "Product created but failed to add variants",
            variant: "destructive"
          });
        }
      }

      toast({
        title: "Success",
        description: "Product created successfully!"
      });
      router.push(`/dashboard/${currentStoreId}/products`);
    } catch (error) {
      console.error("Product creation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add product",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
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
      file: file
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

  const handleAddOption = (option: { id: string; name: string; values: string[]; attributeId?: number; valueIds?: number[] }) => {
    // Convert option to variant format expected by the API
    const newVariants = option.values.map((value, index) => {
      // Use the attribute and value IDs from the option if available
      const attributeId = option.attributeId;
      const valueId = option.valueIds?.[index];

      if (!attributeId || !valueId) {
        console.error('Missing attribute or value IDs:', { option, value, index });
        return null;
      }

      // Format SKU based on the option type
      const skuPrefix = `${productData.sku}-${value.toUpperCase()}`;

      return {
        sku: skuPrefix,
        price_adjustment: "0.00",
        stock_quantity: productData.inventory_quantity || 0,
        attributes: [{
          attribute_id: attributeId,
          value_id: valueId
        }]
      };
    }).filter((variant): variant is { 
      sku: string; 
      price_adjustment: string; 
      stock_quantity: number; 
      attributes: Array<{ attribute_id: number; value_id: number; }>; 
    } => variant !== null);

    // Validate variants before adding
    const validVariants = newVariants.filter(variant => {
      return (
        variant.sku &&
        variant.stock_quantity >= 0 &&
        variant.attributes.length > 0 &&
        variant.attributes.every(attr => 
          attr.attribute_id > 0 && 
          attr.value_id > 0
        )
      );
    });

    if (validVariants.length === 0) {
      toast({
        title: "Error",
        description: "Failed to create valid variants",
        variant: "destructive"
      });
      return;
    }

    console.log('Adding variants:', validVariants);
    setVariants(prev => [...prev, ...validVariants]);
  };

  const handleRemoveOption = (optionId: string) => {
    // Remove variants associated with this option
    setVariants(prev => prev.filter(variant => 
      !variant.attributes.some(attr => attr.attribute_id === parseInt(optionId))
    ));
  };

  const handleAddFAQ = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFAQ = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFAQChange = (index: number, field: keyof FAQ, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqs(newFaqs);
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
          <h1 className="text-[28px] md:text-[38px] font-[600] leading-[40px] md:leading-[60px] text-gray-800">
            Add Product
          </h1>
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-[142px] h-[42px] bg-[#1E3A8A] rounded-full ml-[20px] cursor-pointer"
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
          

            
              <InventoryManagement 
                initialQuantity={productData.inventory_quantity}
                onQuantityChange={(quantity) => {
                  setProductData(prev => ({
                    ...prev,
                    inventory_quantity: quantity
                  }));
                }}
              />
            
              <ShippingComponent />
           
              <VariantsComponent 
                onAddOption={handleAddOption}
                onRemoveOption={handleRemoveOption}
                initialOptions={[]}
              />

              {/* FAQ Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[20px] font-[600] text-black">FAQ</h2>
                    <Info size={18} className="text-gray-400" />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddFAQ}
                    className="flex items-center gap-2 bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 px-4 py-2 rounded-full transition-all duration-200"
                    variant="primary"
                  >
                    <Plus size={16} />
                    <span>Add FAQ</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 space-y-4 bg-gray-50/50 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Question
                            </label>
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                              placeholder="Enter your question"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] bg-white text-gray-800 placeholder-gray-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Answer
                            </label>
                            <textarea
                              value={faq.answer}
                              onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                              placeholder="Enter your answer"
                              rows={3}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] bg-white text-gray-800 placeholder-gray-400 resize-none"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFAQ(index)}
                          className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                          title="Remove FAQ"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {faqs.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <div className="text-gray-400 mb-3">
                        <Info size={32} className="mx-auto" />
                      </div>
                      <p className="text-gray-500 text-sm mb-4">
                        No FAQs added yet. Click &quot;Add FAQ&quot; to create one.
                      </p>
                      <Button
                        type="button"
                        onClick={handleAddFAQ}
                        className="flex items-center gap-2 bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 px-4 py-2 rounded-full transition-all duration-200 mx-auto"
                        variant="primary"
                      >
                        <Plus size={16} />
                        <span>Add FAQ</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
           
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
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Select Existing Media</h2>
            <button
              onClick={() => setShowExistingDialog(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-4">
            <p className="text-gray-500">No existing media found.</p>
          </div>
        </div>
      </Dialog>
    </div>
  );
}