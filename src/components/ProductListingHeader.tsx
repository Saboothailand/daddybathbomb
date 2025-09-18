import { Search, ShoppingCart, Filter } from "lucide-react";

import type { LanguageKey } from "../App";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

interface ProductListingHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cartItemCount: number;
  onToggleFilters: () => void;
  onCartClick?: () => void;
  language?: LanguageKey;
}

export default function ProductListingHeader({
  searchTerm,
  setSearchTerm,
  cartItemCount,
  onToggleFilters,
  onCartClick,
  language = "en",
}: ProductListingHeaderProps) {
  const placeholder =
    language === "th"
      ? "ค้นหาบาธบอม กลิ่น หรือสี..."
      : "Search for bath bombs, fragrances, colors...";

  return (
    <div className="bg-[#151B2E] border-b border-[#334155] sticky top-20 z-40 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile filter toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFilters}
            className="lg:hidden bg-[#0B0F1A] border-[#334155] hover:bg-[#1E293B] text-white"
          >
            <Filter className="w-4 h-4 mr-2" />
            {language === "th" ? "ฟิลเตอร์" : "Filters"}
          </Button>

          {/* Search bar */}
          <div className="flex-1 max-w-lg relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] w-5 h-5" />
              <Input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-[#0B0F1A] border-[#334155] text-white placeholder-[#64748B] focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 rounded-xl"
              />
              {searchTerm && (
                <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#64748B] hover:text-white transition-colors"
              >
                ×
              </button>
              )}
            </div>
          </div>
          
          {/* Cart icon */}
          <div className="relative">
            <Button 
              size="lg"
              className="bg-[#FF2D55] hover:bg-[#FF1744] text-white rounded-xl px-6 py-3 comic-button relative overflow-hidden"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">{language === "th" ? "ตะกร้า" : "Cart"}</span>
              {cartItemCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-[#FFD700] text-black text-xs min-w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#151B2E] animate-pulse"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            
            {/* Sparkle effect for cart */}
            {cartItemCount > 0 && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#FFD700] rounded-full animate-ping"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
