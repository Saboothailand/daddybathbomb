import { useEffect, useMemo, useState } from "react";
import { Grid, List, SlidersHorizontal, Star } from "lucide-react";

import type { LanguageKey, PageKey } from "../App";
import { addToCart, getCartItemCount } from "../utils/cart";
import ProductListingHeader from "./ProductListingHeader";
import ProductBreadcrumb from "./ProductBreadcrumb";
import ProductFilters from "./ProductFilters";
import ProductListingCard from "./ProductListingCard";
import ProductPagination from "./ProductPagination";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import AnimatedBackground from "./AnimatedBackground";

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  colors: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  description?: string;
  gallery?: string[];
};

const createGallery = (baseUrl: string, seed: string) =>
  Array.from({ length: 5 }, (_, index) =>
    `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}auto=format&fit=crop&ixlib=rb-4.1.0&sig=${seed}-${
      index + 1
    }`,
  );

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Superman Power Blast Bath Bomb",
    price: 12.99,
    originalPrice: 15.99,
    rating: 4.8,
    reviewCount: 124,
    image: "https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=400",
    category: "Superhero Series",
    colors: ["#FF2D55", "#007AFF"],
    inStock: true,
    isNew: true,
    isBestseller: true,
    description:
      "POW! 체리와 스트로베리의 상큼한 향을 한 번에 느낄 수 있는 슈퍼 히어로 배쓰밤. 아이들이 가장 좋아하는 폭발적인 버블로 욕조를 가득 채워줘요.",
    gallery: createGallery(
      "https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=600",
      "superman-power",
    ),
  },
  {
    id: "2",
    name: "Rainbow Galaxy Explosion",
    price: 14.99,
    rating: 4.6,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400",
    category: "Galaxy Adventure",
    colors: ["#FF0000", "#FF8800", "#FFFF00", "#00FF00", "#0088FF", "#8800FF"],
    inStock: true,
    isBestseller: true,
    description:
      "무지개 은하처럼 반짝이는 버블이 욕조를 감싸는 특별한 배쓰밤. 다채로운 향이 하루의 피로를 싹 잊게 해줍니다.",
    gallery: createGallery(
      "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=600",
      "rainbow-galaxy",
    ),
  },
  {
    id: "3",
    name: "Princess Power Pink Bomb",
    price: 11.99,
    rating: 4.7,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400",
    category: "Princess Power",
    colors: ["#FF69B4", "#FFB6C1"],
    inStock: true,
    description:
      "은은한 플로럴 향이 공주님들의 욕조 시간을 더욱 특별하게 만들어주는 핑크 배쓰밤. 피부를 촉촉하게 지켜줍니다.",
    gallery: createGallery(
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600",
      "princess-power",
    ),
  },
  {
    id: "4",
    name: "Dino Destruction Green Bomb",
    price: 13.99,
    originalPrice: 16.99,
    rating: 4.5,
    reviewCount: 67,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    category: "Dino Destruction",
    colors: ["#00FF88", "#228B22"],
    inStock: false,
    description:
      "공룡의 에너지를 담은 상쾌한 라임 향. 초록빛 버블이 모험심을 깨우지만 현재는 일시 품절입니다.",
    gallery: createGallery(
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
      "dino-destruction",
    ),
  },
  {
    id: "5",
    name: "Mystery Box Surprise",
    price: 19.99,
    rating: 4.9,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400",
    category: "Mystery Box",
    colors: ["#000000", "#FFD700"],
    inStock: true,
    isNew: true,
    description:
      "열어보기 전까지 알 수 없는 향과 색의 조합! 매번 새로움을 선사하는 미스터리 박스 한정 제품입니다.",
    gallery: createGallery(
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600",
      "mystery-box",
    ),
  },
  {
    id: "6",
    name: "Blue Ocean Adventure",
    price: 10.99,
    rating: 4.4,
    reviewCount: 78,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    category: "Superhero Series",
    colors: ["#007AFF", "#4169E1"],
    inStock: true,
    description:
      "바다 바람처럼 시원한 향을 담은 블루톤 배쓰밤. 상쾌한 민트와 해양 미네랄이 에너지를 북돋워줘요.",
    gallery: createGallery(
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
      "blue-ocean",
    ),
  },
  ...Array.from({ length: 18 }, (_, i) => ({
    id: `${i + 7}`,
    name: `Bath Bomb ${i + 7}`,
    price: Math.random() * 20 + 10,
    rating: Math.random() * 1 + 4,
    reviewCount: Math.floor(Math.random() * 200) + 20,
    image: `https://images.unsplash.com/photo-${1571019613454 + i}?w=400`,
    category: ["Superhero Series", "Princess Power", "Galaxy Adventure"][i % 3],
    colors: ["#FF2D55", "#007AFF", "#FFD700"].slice(0, Math.floor(Math.random() * 3) + 1),
    inStock: Math.random() > 0.2,
    isNew: Math.random() > 0.8,
    isBestseller: Math.random() > 0.7,
    description: "다채로운 향과 버블을 즐길 수 있는 한정판 배쓰밤입니다.",
    gallery: createGallery(
      `https://images.unsplash.com/photo-${1571019613454 + i}?w=600`,
      `random-${i}`,
    ),
  })),
];

type ProductListingProps = {
  language: LanguageKey;
  navigateTo: (page: PageKey) => void;
};

export default function ProductListing({ language }: ProductListingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState(() => getCartItemCount());

  useEffect(() => {
    const handleCartUpdate = () => setCartCount(getCartItemCount());
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 50] as [number, number],
    minRating: 0,
    colors: [] as string[],
    inStock: false,
  });

  const itemsPerPage = 12;

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = mockProducts.filter((product) => {
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      if (filters.categories.length > 0) {
        const categoryKey = product.category.toLowerCase().replace(/\s+/g, "");
        if (!filters.categories.some((cat) => categoryKey.includes(cat))) {
          return false;
        }
      }

      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      if (product.rating < filters.minRating) {
        return false;
      }

      if (filters.inStock && !product.inStock) {
        return false;
      }

      return true;
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => {
          const aScore = (a.isBestseller ? 2 : 0) + (a.isNew ? 1 : 0);
          const bScore = (b.isBestseller ? 2 : 0) + (b.isNew ? 1 : 0);
          return bScore - aScore;
        });
    }

    return filtered;
  }, [searchTerm, filters, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleAddToCart = (productId: string) => {
    const product = mockProducts.find((item) => item.id === productId);
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      setCartCount(getCartItemCount());
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      window.dispatchEvent(new CustomEvent("cartSidebar:open"));
    }
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  };

  const breadcrumbItems = [
    { label: "Products", href: "/products" },
    { label: "Bath Bombs", active: true },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F1A] relative">
      <AnimatedBackground />

      {/* 검색 헤더 - 상단 고정 */}
      <div className="sticky top-0 z-40 bg-[#0B0F1A]/95 backdrop-blur-sm border-b border-[#334155]">
        <ProductListingHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          cartItemCount={cartCount}
          onToggleFilters={() => setFiltersOpen(!filtersOpen)}
          language={language}
          onCartClick={() => window.dispatchEvent(new CustomEvent("cartSidebar:open"))}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4">
        <ProductBreadcrumb items={breadcrumbItems} />

        <div className="flex gap-8">
          <ProductFilters
            isOpen={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            filters={filters}
            onFiltersChange={setFilters}
          />

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-white font-fredoka comic-shadow">
                  {language === "th" ? "สินค้าทั้งหมด" : "BATH BOMBS"}
                </h1>
                <div className="hidden sm:flex items-center gap-2 text-sm text-[#B8C4DB]">
                  <span>{filteredAndSortedProducts.length} products</span>
                  {searchTerm && <span>• Results for "{searchTerm}"</span>}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-[#151B2E] rounded-lg border border-[#334155] p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-[#007AFF] text-white" : "text-[#64748B] hover:text-white"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-[#007AFF] text-white" : "text-[#64748B] hover:text-white"}`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-[#151B2E] border-[#334155] text-white">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#151B2E] border-[#334155]">
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {currentProducts.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                }`}
              >
                {currentProducts.map((product) => (
                  <ProductListingCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorited={favorites.includes(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {language === "th" ? "ไม่พบสินค้า" : "No products found"}
                </h3>
                <p className="text-[#B8C4DB] mb-6">
                  {language === "th"
                    ? "ลองปรับคำค้นหาหรือฟิลเตอร์ใหม่อีกครั้ง"
                    : "Try adjusting your search terms or filters to find what you're looking for."}
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      categories: [],
                      priceRange: [0, 50],
                      minRating: 0,
                      colors: [],
                      inStock: false,
                    });
                  }}
                  className="bg-[#007AFF] hover:bg-[#0051D5] text-white comic-button"
                >
                  {language === "th" ? "รีเซ็ตฟิลเตอร์" : "Clear all filters"}
                </Button>
              </div>
            )}

            {totalPages > 1 && (
              <ProductPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredAndSortedProducts.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
