"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Package,
  Loader2,
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  Edit,
  Trash2,
  X,
  Edit3,
  Save,
  AlertTriangle,
} from "lucide-react";
import { useProduct } from "@/hooks/useProduct";
import { useStorePath } from "@/hooks/useStorePath";
import type { Product, CreateProductRequest } from "@/lib/types/product";
import Image from "next/image";
import { folder, users } from "@/lib/icons";
import { Checkbox } from "@/components/common/Checkbox";
import Button from "@/components/common/Button";
import AdGeneratorPage from "@/app/ad-generator/page";

interface EditProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

function EditProductDialog({ isOpen, onClose, product, onEdit, onDelete }: EditProductDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  useEffect(() => {
    setEditedProduct(product);
    setIsEditing(false);
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSave = () => {
    if (editedProduct) {
      onEdit(editedProduct);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedProduct(product);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Product, value: string | number) => {
    if (editedProduct) {
      setEditedProduct({
        ...editedProduct,
        [field]: value
      });
    }
  };

  const currentProduct = editedProduct || product;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl transform transition-all max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1D1178] to-[#2D1D92] px-8 py-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Product Details</h2>
              <p className="text-[#7C5CFC] text-sm">Manage your product information</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Image */}
            <div className="lg:col-span-1 flex flex-col items-center">
              <div className="relative group">
                {currentProduct.images?.[0]?.image ? (
                  <img
                    src={currentProduct.images[0].image}
                    alt={currentProduct.name}
                    className="h-64 w-64 object-cover rounded-2xl shadow-lg transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="h-64 w-64 bg-gradient-to-br from-[#CEBEFE] to-[#E7DEFE] rounded-2xl flex items-center justify-center shadow-lg">
                    <Package className="h-20 w-20 text-[#432EB5]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Status Badge */}
              <div className="mt-4">
                <span className={`inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold shadow-lg ${
                  currentProduct.status === "published"
                    ? "bg-gradient-to-r from-[#9F84FD] to-[#B49DFE] text-white"
                    : "bg-gradient-to-r from-[#CEBEFE] to-[#E7DEFE] text-[#432EB5]"
                }`}>
                  {currentProduct.status === "published" ? "Published" : "Draft"}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Name */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                <label className="block text-sm font-semibold text-[#1D1178] mb-3">Product Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentProduct.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full text-xl font-bold text-gray-900 bg-white border-2 border-[#7C5CFC] rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#7C5CFC]/20"
                  />
                ) : (
                  <div className="text-xl font-bold text-gray-900">{currentProduct.name}</div>
                )}
              </div>

              {/* Price and Stock Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#9F84FD]/10 to-[#B49DFE]/10 p-6 rounded-2xl border border-[#7C5CFC]/20">
                  <label className="block text-sm font-semibold text-[#1D1178] mb-3">Price (DZD)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={currentProduct.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full text-xl font-bold text-gray-900 bg-white border-2 border-[#7C5CFC] rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#7C5CFC]/20"
                    />
                  ) : (
                    <div className="text-xl font-bold text-gray-900">
                      {parseFloat(currentProduct.price).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-[#CEBEFE]/30 to-[#E7DEFE]/30 p-6 rounded-2xl border border-[#7C5CFC]/20">
                  <label className="block text-sm font-semibold text-[#1D1178] mb-3">Stock Quantity</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={currentProduct.stock_quantity}
                      onChange={(e) => handleInputChange('stock_quantity', parseInt(e.target.value))}
                      className="w-full text-xl font-bold text-gray-900 bg-white border-2 border-[#7C5CFC] rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#7C5CFC]/20"
                    />
                  ) : (
                    <div className="text-xl font-bold text-gray-900">{currentProduct.stock_quantity} units</div>
                  )}
                </div>
              </div>

              {/* Category and Total Value */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200">
                  <label className="block text-sm font-semibold text-[#1D1178] mb-3">Category</label>
                  <div className="text-lg font-medium text-gray-700">{currentProduct.category_name || "Uncategorized"}</div>
                </div>

                <div className="bg-gradient-to-br from-[#9F84FD] to-[#B49DFE] p-6 rounded-2xl text-white">
                  <label className="block text-sm font-semibold text-white/90 mb-3">Total Value</label>
                  <div className="text-xl font-bold">
                    DZD {(parseFloat(currentProduct.price) * currentProduct.stock_quantity).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Promotional Price */}
              <div className="bg-gradient-to-br from-[#CEBEFE]/20 to-[#E7DEFE]/20 p-6 rounded-2xl border border-[#7C5CFC]/20">
                <label className="block text-sm font-semibold text-[#1D1178] mb-3">Promotional Price (DZD)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={currentProduct.promotional_price || ''}
                    onChange={(e) => handleInputChange('promotional_price', e.target.value)}
                    placeholder="Enter promotional price"
                    className="w-full text-lg font-medium text-gray-900 bg-white border-2 border-[#7C5CFC] rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#7C5CFC]/20"
                  />
                ) : (
                  <div className="text-lg font-medium text-gray-700">
                    {currentProduct.promotional_price ? 
                      parseFloat(currentProduct.promotional_price).toLocaleString() : 
                      'No promotional price set'
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 rounded-b-3xl border-t border-gray-100">
          <div className="flex justify-between items-center">
            {/* Delete Button */}
            <button
              onClick={() => onDelete(currentProduct)}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
            </button>

            {/* Edit/Save Controls */}
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-gradient-to-r from-[#9F84FD] to-[#B49DFE] text-white rounded-xl hover:from-[#8B70FD] hover:to-[#A088FE] transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#1D1178] to-[#2D1D92] text-white rounded-xl hover:from-[#0F0A5C] hover:to-[#1D1178] transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Product
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

function DeleteConfirmationDialog({ isOpen, onClose, onConfirm, productName }: DeleteConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Delete Product</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-semibold text-gray-900">{productName}</span>? 
            This action cannot be undone.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 rounded-b-3xl border-t border-gray-100">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { currentStoreId } = useStorePath();
  const { products, loading, error, refetch, deleteProduct, updateProduct } = useProduct();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedCategory] = useState("all");
  const [selectedStatus] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("This week");
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showAdGenerator, setShowAdGenerator] = useState(false);
  const [selectedProductForAd, setSelectedProductForAd] = useState<Product | null>(null);

  // Filter products based on search, category and status
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category_name === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || product.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "price") {
      comparison = parseFloat(a.price) - parseFloat(b.price);
    } else if (sortBy === "stock") {
      comparison = a.stock_quantity - b.stock_quantity;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Handle product selection
  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === sortedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(
        sortedProducts.map((product) => product.id.toString())
      );
    }
  };

  // Calculate total value
  const calculateTotalValue = (product: Product) => {
    const price = parseFloat(product.price);
    const stock = product.stock_quantity;
    return (price * stock).toFixed(2);
  };

  // Handle sort
  const handleSort = (field: "name" | "price" | "stock") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Add these handlers
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleEditProduct = async (product: Product) => {
    try {
      // Convert the product to the format expected by updateProduct
      const updateData: Partial<CreateProductRequest> = {
        name: product.name,
        price: parseFloat(product.price),
        promotional_price: product.promotional_price ? parseFloat(product.promotional_price) : undefined,
        stock_quantity: product.stock_quantity,
        status: product.status,
        // Add other fields as needed
      };

      await updateProduct(product.id, updateData);
      
      // Close the dialog
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating product:', error);
      // Error handling is already done in the hook with toast notifications
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id);
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error('Error deleting product:', error);
        // Error handling is already done in the hook with toast notifications
      }
    }
  };

  return (
    <div className="flex flex-col w-full bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between px-[24px]  mb-4">
        <h1 className="text-[36px] text-black font-bold ">Stocks</h1>
        <Button
          onClick={() =>
            (window.location.href = `/dashboard/${currentStoreId}/product/productAdd`)
          }
          className="inline-flex items-center h-[45px] justify-center cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex gap-6 px-[24px]  py-4">
        <div className="flex-1 bg-[#1E3A8A] text-white rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="bg-white p-3 rounded-lg">
              <Image src={folder} alt="Folder" width={25} height={25} />
            </div>
            <div className="text-sm flex items-center bg-transparent gap-1 relative">
              <button
                onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
                className="bg-transparent text-[#DBDEEE] text-sm outline-none cursor-pointer border-none flex items-center gap-1"
              >
                {selectedTimeRange}
                <ChevronDown className="h-4 w-4" />
              </button>
              {isTimeRangeOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg py-1 z-10">
                  {["This week", "This month", "This year"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedTimeRange(option);
                        setIsTimeRangeOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="mt-4">
              <div className="text-lg font-semibold">All Products</div>
              <div className="text-[20px] font-bold">{products.length}</div>
            </div>
            <div className="mt-4 text-sm">
              <div>
                <div className="text-lg font-semibold">Active</div>
                <div className="text-[20px] font-bold p-2 ">
                  {
                    products.filter((product) => product.status === "published")
                      .length
                  }
                  <span className="ml-2 text-[10px] text-gray-500">
                    %
                    {Math.round(
                      (products.filter(
                        (product) => product.status === "published"
                      ).length /
                        products.length) *
                        100
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Card */}
        <div className="flex-1 bg-white text-gray-900 rounded-lg p-6 flex flex-col justify-between border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="bg-[#1E3A8A] p-3 rounded-lg">
              <Image src={users} alt="Folder" width={25} height={25} />
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1 relative">
              <button
                onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
                className="bg-transparent text-black text-sm outline-none cursor-pointer border-0 flex items-center gap-1"
              >
                {selectedTimeRange}
                <ChevronDown className="h-4 w-4" />
              </button>
              {isTimeRangeOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg py-1 z-10">
                  {["This week", "This month", "This year"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedTimeRange(option);
                        setIsTimeRangeOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <div className="text-red-600 font-semibold">Low stock alert</div>
              <div className="text-xl font-bold text-gray-900">
                {products.filter(product => product.stock_quantity < 10).length}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Expired</div>
              <div className="text-xl font-bold text-gray-900">
                {products.filter(product => product.stock_quantity === 0).length}
              </div>
            </div>
            <div>
              <div className="text-gray-600">1 Start rating</div>
              <div className="text-xl font-bold text-gray-900">0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Search - No spacing */}
      <div className="bg-white mx-6 rounded-t-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Inventory Items
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-[#1E3A8A]"
            />
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>
      </div>

      {/* Table - Connected to header with no spacing */}
      <div className="mx-6 bg-white border-t-0 rounded-b-xl border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-600">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p>{error.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Package className="h-12 w-12 mb-4" />
            <p className="text-lg mb-4">No products found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-12">
                  <Checkbox
                    checked={selectedProducts.length === sortedProducts.length}
                    onCheckedChange={handleSelectAll}
                    color="primary"
                    className="rounded-[8px] w-[24px] h-[24px] stroke-black"
                  />
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Product Name
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    Category
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center gap-2">
                    Unit Price
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("stock")}
                >
                  <div className="flex items-center gap-2">
                    In-Stock
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    Discount
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    Total Value
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    Action
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedProducts.map((product: Product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selectedProducts.includes(product.id.toString())}
                      onCheckedChange={() =>
                        handleSelectProduct(product.id.toString())
                      }
                      color="primary"
                      className="rounded-[8px] w-[24px] h-[24px] stroke-black"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {product.images?.[0]?.image ? (
                          <img
                            src={product.images[0].image}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gradient-to-br from-[#CEBEFE] to-[#E7DEFE] rounded flex items-center justify-center">
                            <Package className="h-5 w-5 text-[#432EB5]" />
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.category_name || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    DZD {parseFloat(product.price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.stock_quantity} units
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {product.promotional_price ? (
                      <span className="text-red-600">
                        DZD {parseFloat(product.promotional_price).toLocaleString()}
                      </span>
                    ) : (
                      "No discount"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    DZD {calculateTotalValue(product)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-2 text-gray-500 hover:text-[#1E3A8A] transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProductForAd(product);
                          setShowAdGenerator(true);
                        }}
                        className="p-2 text-gray-500 hover:text-[#1E3A8A] transition-colors"
                      >
                        <Package className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Dialog */}
      <EditProductDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        product={selectedProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteClick}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.name || ''}
      />

      {/* Ad Generator Dialog */}
      {showAdGenerator && selectedProductForAd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#1D1178] to-[#2D1D92] px-8 py-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white mb-1">Ad Generator</h2>
                <button 
                  onClick={() => {
                    setShowAdGenerator(false);
                    setSelectedProductForAd(null);
                  }}
                  className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-8">
              <AdGeneratorPage initialProduct={selectedProductForAd} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
