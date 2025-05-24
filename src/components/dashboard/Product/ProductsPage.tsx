"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Package,
  Loader2,
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import { useProduct } from "@/hooks/useProduct";
import { useStorePath } from "@/hooks/useStorePath";
import type { Product } from "@/lib/types/product";
import Image from "next/image";
import { folder, users } from "@/lib/icons";
import { Checkbox } from "@/components/common/Checkbox";

export default function ProductsPage() {
  const { currentStoreId } = useStorePath();
  const { products, loading, error, refetch } = useProduct();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("This week");
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);

  // Extract unique categories from products
  const categories = [
    "all",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  // Filter products based on search, category and status
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toString() === selectedCategory;
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

  return (
    <div className="flex flex-col w-full bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between px-[24px]  mb-4">
        <h1 className="text-[36px] text-black font-bold ">Stocks</h1>
        <Link
          href={`/dashboard/${currentStoreId}/product/productAdd`}
          className="inline-flex h-[40px] w-[185px] items-center justify-center px-4 py-2 bg-[#1E3A8A] text-white rounded-full text-sm font-medium hover:bg-[#1E3A8A] transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Link>
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
                  {products.filter(product => product.status === "published").length}
                  <span className="ml-2 text-[10px] text-gray-500">
                    %{Math.round((products.filter(product => product.status === "published").length / products.length) * 100)}
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
              <div className="text-xl font-bold text-gray-900">23</div>
            </div>
            <div>
              <div className="text-gray-600">Expired</div>
              <div className="text-xl font-bold text-gray-900">3</div>
            </div>
            <div>
              <div className="text-gray-600">1 Start rating</div>
              <div className="text-xl font-bold text-gray-900">2</div>
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
                    className="rounded-none"
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
                      onCheckedChange={() => handleSelectProduct(product.id.toString())}
                      color="primary"
                      className="rounded-[8px] w-[24px] h-[24px] stroke-black"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {product.images?.[0]?.image_url ? (
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={product.images[0].image_url}
                            alt={product.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-orange-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-orange-600" />
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {product.category_name || "Uncategorized"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">
                      DZD {parseFloat(product.price).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {product.stock_quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      DZD{" "}
                      {product.promotional_price
                        ? (
                            parseFloat(product.price) -
                            parseFloat(product.promotional_price)
                          ).toLocaleString()
                        : "0.00"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">
                      DZD {product.promotional_price}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Publish</option>
                      <option>Draft</option>
                      <option>Archive</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === "published"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {product.status === "published" ? "Published" : "Unpublished"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}