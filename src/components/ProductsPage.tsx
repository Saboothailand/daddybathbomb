import { useEffect, useMemo, useState } from "react";
import { galleryService } from "../lib/supabase";
import type { PageKey, LanguageKey } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { t } from "../utils/translations";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

type GalleryItem = {
  id: string | number;
  image_url: string;
  caption?: string | null;
  display_order?: number | null;
};

type ProductsPageProps = {
  navigateTo: (page: PageKey) => void;
  language: LanguageKey;
};

const fallbackItems: GalleryItem[] = [
  {
    id: "fallback-1",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop",
    caption: "Vibrant fizzy bath bombs"
  },
  {
    id: "fallback-2",
    image_url: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=800&fit=crop",
    caption: "Natural ingredients"
  },
  {
    id: "fallback-3",
    image_url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop",
    caption: "Rainbow bubbles"
  },
  {
    id: "fallback-4",
    image_url: "https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=800&h=800&fit=crop",
    caption: "Family bath time"
  },
  {
    id: "fallback-5",
    image_url: "https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=800&h=800&fit=crop",
    caption: "Gift-ready packs"
  },
  {
    id: "fallback-6",
    image_url: "https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=800&h=800&fit=crop",
    caption: "Relaxing aroma"
  },
  {
    id: "fallback-7",
    image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop",
    caption: "Limited editions"
  },
  {
    id: "fallback-8",
    image_url: "https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=800&h=800&fit=crop",
    caption: "Hand crafted"
  }
];

function chunkItems<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export default function ProductsPage({ navigateTo, language }: ProductsPageProps) {
  const [items, setItems] = useState<GalleryItem[]>(fallbackItems);
  const [loading, setLoading] = useState(true);
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await galleryService.getActiveGalleryImages();
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map<GalleryItem>((item, idx) => ({
            id: item.id ?? `gallery-${idx}`,
            image_url: item.image_url ?? fallbackItems[idx % fallbackItems.length].image_url,
            caption: item.caption ?? null,
            display_order: item.display_order ?? idx
          }));
          setItems(normalized);
        }
      } catch (error) {
        console.error("Failed to load gallery images for products page", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const groupedItems = useMemo(() => chunkItems(items, 4), [items]);
  const currentGroup = groupedItems[activeSetIndex] ?? [];
  const canGoPrev = activeSetIndex > 0;
  const canGoNext = activeSetIndex < groupedItems.length - 1;

  const handlePrev = () => {
    if (canGoPrev) {
      setActiveSetIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setActiveSetIndex((prev) => prev + 1);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0B0F1A] via-[#131735] to-[#1E1F3F] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 text-[#FF2D55] mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="font-fredoka text-4xl sm:text-5xl font-bold text-white">
              {t("products", language)}
            </h1>
            <Sparkles className="w-8 h-8" />
          </div>
          <p className="text-lg text-[#B8C4DB] max-w-2xl mx-auto">
            {language === "th"
              ? "เลือกชมสินค้า Daddy Bath Bomb ผ่านแกลเลอรี่ 4 ภาพต่อชุด"
              : "Explore the Daddy Bath Bomb collection in curated sets of four."}
          </p>
        </header>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white transition ${
              canGoPrev ? "bg-white/10 hover:bg-white/20" : "bg-white/5 opacity-40 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            {language === "th" ? "ก่อนหน้า" : "Previous"}
          </button>

          <div className="text-sm text-[#B8C4DB] font-semibold">
            {groupedItems.length > 0
              ? `${activeSetIndex + 1} / ${groupedItems.length}`
              : language === "th" ? "ไม่มีข้อมูล" : "No data"}
          </div>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white transition ${
              canGoNext ? "bg-white/10 hover:bg-white/20" : "bg-white/5 opacity-40 cursor-not-allowed"
            }`}
          >
            {language === "th" ? "ถัดไป" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(loading && groupedItems.length === 0 ? fallbackItems.slice(0, 4) : currentGroup).map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-3xl border-4 border-white/10 bg-white/5 backdrop-blur-lg shadow-xl"
            >
              <ImageWithFallback
                src={item.image_url}
                alt={item.caption || "Product gallery"}
                className="w-full h-64 object-cover"
              />
              {item.caption && (
                <div className="p-4 text-center text-white text-sm bg-gray-900/60">
                  {item.caption}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigateTo("gallery")}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#FF2D55] hover:bg-[#ff4d72] text-white font-semibold transition shadow-lg"
          >
            {language === "th" ? "ดูแกลเลอรี่ทั้งหมด" : "See full gallery"}
          </button>
        </div>
      </div>
    </section>
  );
}
