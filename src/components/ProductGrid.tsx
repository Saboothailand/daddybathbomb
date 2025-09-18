import { useMemo, useState, useEffect } from "react";
import { Zap, Star, Heart } from "lucide-react";

import type { LanguageKey, PageKey } from "../App";
import { addToCart } from "../utils/cart";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { Button } from "./ui/button";
import { AdminService } from "../lib/adminService";

type Product = {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  description: string;
  short_description?: string;
  color: string;
  category: string;
  stock_quantity?: number;
  scent?: string;
  weight?: string;
  ingredients?: string;
  rating?: number;
  review_count?: number;
  is_featured?: boolean;
  is_active?: boolean;
};

type ProductGridProps = {
  language: LanguageKey;
  navigateTo: (page: PageKey) => void;
};

export default function ProductGrid({ language, navigateTo }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await AdminService.getProducts();
      
      // 홈페이지에는 featured 제품 6개만 표시
      const featuredProducts = data
        .filter(product => product.is_active && product.is_featured)
        .slice(0, 6);
      
      // 데이터 변환 (기존 구조에 맞춤)
      const transformedProducts = featuredProducts.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        original_price: product.original_price,
        image_url: product.image_url,
        description: product.description,
        short_description: product.short_description,
        color: product.color || "#FF2D55",
        category: product.category || "Bath Bombs",
        stock_quantity: product.stock_quantity,
        scent: product.scent,
        weight: product.weight,
        ingredients: product.ingredients,
        rating: product.rating,
        review_count: product.review_count,
        is_featured: product.is_featured,
        is_active: product.is_active
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      // 에러 시 fallback 데이터 사용
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  // Fallback 제품 데이터 (태국 바트로 수정)
  const fallbackProducts: Product[] = [
    {
      id: "1",
      name: "SUPER RED FIZZ",
      price: 390, // 태국 바트
      original_price: 450,
      image_url: "https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop",
      description: "POW! Cherry explosion with super bubbles and strawberry fun power!",
      color: "#FF2D55",
      category: "Hero Series",
    },
    {
      id: "2",
      name: "HERO BLUE BLAST",
      price: 420, // 태국 바트
      original_price: 480,
      image_url: "https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&sig=blue",
      description: "BOOM! Ocean breeze with cooling mint and superhero strength bubbles!",
      color: "#007AFF",
      category: "Hero Series",
    },
    {
      id: "3",
      name: "MAGIC GREEN GO",
      price: 380, // 태국 바트
      original_price: 430,
      image_url: "https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&sig=green",
      description: "ZAP! Tropical lime with energizing bubbles and adventure scent power!",
      color: "#00FF88",
      category: "Adventure",
    },
    {
      id: "4",
      name: "GOLDEN SUN POWER",
      price: 450, // 태국 바트
      original_price: 520,
      image_url: "https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&sig=gold",
      description: "SHINE! Sunny orange with citrus burst and happiness bubble magic!",
      color: "#FFD700",
      category: "Adventure",
    },
    {
      id: "5",
      name: "PURPLE STORM FUN",
      price: 430, // 태국 바트
      original_price: 480,
      image_url: "https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&sig=purple",
      description: "WHOOSH! Lavender lightning with dreamy bubbles and calm superhero vibes!",
      color: "#AF52DE",
      category: "Calm",
    },
    {
      id: "6",
      name: "RAINBOW MEGA MIX",
      price: 580, // 태국 바트
      original_price: 650,
      image_url: "https://images.unsplash.com/photo-1590147266845-821cd5ffb2d5?w=500&h=400&fit=crop&sig=rainbow",
      description: "AMAZING! All colors unite for the ultimate superhero bath adventure!",
      color: "#FF69B4",
      category: "Special",
    },
  ];

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url
    });
  };

  if (loading) {
    return (
      <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0F1A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white text-xl">Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0F1A] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-20 w-12 h-12 bg-[#FFD700] rotate-45" />
        <div className="absolute top-40 right-10 w-8 h-8 bg-[#00FF88] rounded-full" />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-4 border-[#FF2D55] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Star className="w-10 h-10 text-[#FFD700] mr-3" />
            <Zap className="w-12 h-12 text-[#FF2D55] mr-3" />
            <Heart className="w-10 h-10 text-[#00FF88]" />
          </div>

          <h2 className="font-fredoka text-5xl sm:text-6xl font-bold text-white mb-6 comic-shadow">
            {language === "th" ? "คอลเลกชันซุปเปอร์" : "EXPLOSIVE COLLECTION"}
          </h2>

          <div className="bg-[#151B2E] rounded-2xl px-8 py-4 comic-border border-4 border-black inline-block mb-8">
            <p className="font-nunito text-xl text-[#B8C4DB] font-bold">
              {language === "th"
                ? "🦸‍♂️ บาธบอมผ่านการรับรองจากเหล่าฮีโร่! 💥"
                : "🦸‍♂️ Hero-approved bath bombs for super fun adventures! 💥"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
              <ProductCard
                {...product}
                language={language}
                onAddToCart={() => handleAddToCart(product)}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button
            className="bg-gradient-to-r from-[#FF2D55] to-[#007AFF] hover:from-[#FF1744] hover:to-[#0051D5] text-white px-16 py-6 text-2xl font-bold font-fredoka tracking-wide rounded-3xl comic-border border-4 border-black comic-button"
            onClick={() => navigateTo("products")}
          >
            <Zap className="w-8 h-8 mr-3" />
            {language === "th" ? "ดูสินค้าทั้งหมด" : "VIEW ALL SUPER BOMBS"}
            <Star className="w-8 h-8 ml-3" />
          </Button>
        </div>
      </div>

      <ProductModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onCartUpdate={() => window.dispatchEvent(new CustomEvent("cartUpdated"))}
        language={language}
      />
    </section>
  );
}
