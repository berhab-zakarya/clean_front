import { useState } from "react";
import { ChevronDown, Store as StoreIcon, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useStore } from "@/hooks/useStore";

export function StoreDropdown() {
  const { userStore, hasStore } = useStore();
  // إذا كان لديك أكثر من متجر، استبدل هذا بمصفوفة المتاجر من useStore
  const stores = userStore ? [userStore] : [];
  const [selectedStore, setSelectedStore] = useState(userStore);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-md border bg-white hover:bg-gray-50 min-w-[180px]">
          <span className="flex items-center gap-2">
            <span className="bg-orange-400 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold">
              {selectedStore?.store_name?.charAt(0).toUpperCase() || "S"}
            </span>
            <span className="font-medium">{selectedStore?.store_name || "Select Store"}</span>
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 p-0">
        <div className="py-2">
          {stores.map((store) => (
            <DropdownMenuItem
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer"
            >
              <span className="bg-orange-400 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                {store.store_name?.charAt(0).toUpperCase()}
              </span>
              <span className="flex-1">{store.store_name}</span>
              {selectedStore?.id === store.id && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem className="flex items-center gap-2 px-4 py-2 text-gray-700">
            <StoreIcon className="w-4 h-4" />
            <span>All stores</span>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <div className="py-2">
          <DropdownMenuItem className="px-4 py-2">Help Center</DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2">Changelog</DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2">Community forums</DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2">Hire a Algecom Partner</DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2">Keyboard shortcuts</DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <div className="px-4 py-2 text-xs text-gray-500 border-t">
          {selectedStore?.email || "store@email.com"}
        </div>
        <DropdownMenuItem className="px-4 py-2">Manage account</DropdownMenuItem>
        <DropdownMenuItem className="px-4 py-2 text-red-500">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}