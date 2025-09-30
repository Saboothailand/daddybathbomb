import { useEffect, useMemo, useState } from "react";
import { galleryService } from "../lib/supabase";
import type { PageKey, LanguageKey } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { t } from "../utils/translations";
import { ChevronLeft, ChevronRight, Sparkles, ArrowLeft, X, Edit, Trash2 } from "lucide-react";
import { authService } from "../utils/auth";

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
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 최상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setIsAdmin(authService.isAdmin());
    
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

  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  const handleEdit = () => {
    // 관리자 페이지로 이동
    navigateTo("admin");
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    
    if (confirm(language === "th" ? "ลบรายการนี้หรือไม่?" : "Delete this item?")) {
      try {
        // 삭제 로직 추가 필요
        alert(language === "th" ? "กรุณาใช้หน้าผู้ดูแลระบบเพื่อลบ" : "Please use admin dashboard to delete");
        navigateTo("admin");
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  // 현재 선택된 아이템 제외한 나머지 아이템들 (최대 20개)
  const otherItems = items.filter(item => item.id !== selectedItem?.id).slice(0, 20);

  // 상세 페이지 렌더링
  if (selectedItem) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0B0F1A] via-[#131735] to-[#1E1F3F] min-h-screen">
        <div className="max-w-[1000px] mx-auto">
          {/* 뒤로가기 버튼 */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleCloseDetail}
              className="flex items-center gap-2 text-white hover:text-[#FF2D55] transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">
                {language === "th" ? "กลับไปยังสินค้า" : "Back to Products"}
              </span>
            </button>
            
            {/* 관리자 버튼 */}
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  {language === "th" ? "แก้ไข" : "Edit"}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {language === "th" ? "ลบ" : "Delete"}
                </button>
              </div>
            )}
          </div>

          {/* 상세 페이지 카드 - 중앙 정렬 */}
          <div className="flex justify-center mb-12">
            <div className="inline-block bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl max-w-full">
              {/* 이미지 섹션 - 원본 비율 유지, 가로 1000px */}
              <div className="relative overflow-hidden bg-black/20" style={{ maxWidth: '1000px' }}>
                <ImageWithFallback
                  src={selectedItem.image_url}
                  alt={selectedItem.caption || "Product detail"}
                  className="w-full h-auto object-contain"
                />
                {/* 닫기 버튼 */}
                <button
                  onClick={handleCloseDetail}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/60 hover:bg-[#FF2D55] text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* 정보 섹션 */}
              <div className="p-6">
                {selectedItem.caption && (
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-white mb-3">
                      {selectedItem.caption}
                    </h2>
                    <div className="h-1 w-16 bg-gradient-to-r from-[#FF2D55] to-[#007AFF] rounded-full"></div>
                  </div>
                )}

                <div className="max-w-none mb-16">
                  <p className="text-white text-base leading-relaxed">
                    {language === "th"
                      ? "แช่ตัวกับบาธบอมพ์พรีเมี่ยมที่ทำจากส่วนผสมธรรมชาติ ปลอดภัยสำหรับทุกคนในครอบครัว พร้อมมอบประสบการณ์ผ่อนคลายที่ไม่เหมือนใคร"
                      : "Indulge in our premium bath bombs made from natural ingredients. Safe for the whole family, delivering a unique relaxing experience."}
                  </p>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigateTo("contact")}
                    className="flex-1 bg-gradient-to-r from-[#FF2D55] to-[#007AFF] text-white px-5 py-3 rounded-full font-bold text-base hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    {language === "th" ? "สั่งซื้อเลย" : "Order Now"}
                  </button>
                  <button
                    onClick={handleCloseDetail}
                    className="px-5 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border-2 border-white/20"
                  >
                    {language === "th" ? "ดูสินค้าอื่น" : "View More"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 나머지 갤러리 아이템 20개 - 가로 200px, 4개씩, 왼쪽 정렬 */}
          {otherItems.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-6">
                {language === "th" ? "สินค้าอื่นๆ" : "Other Products"}
              </h3>
              <div className="flex flex-wrap gap-4">
                {otherItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur-lg shadow-lg hover:shadow-xl hover:border-[#FF2D55]/30 transition-all duration-300 cursor-pointer group"
                    style={{ width: '200px' }}
                  >
                    <div className="relative overflow-hidden" style={{ width: '200px', height: '200px' }}>
                      <ImageWithFallback
                        src={item.image_url}
                        alt={item.caption || "Product"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {item.caption && (
                      <div className="p-2 text-center text-white text-xs bg-gradient-to-t from-black/80 to-black/60 backdrop-blur-sm line-clamp-2">
                        {item.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {(loading && groupedItems.length === 0 ? fallbackItems.slice(0, 4) : currentGroup).map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="relative flex flex-col overflow-hidden rounded-3xl border-4 border-white/10 bg-white/5 backdrop-blur-lg shadow-xl hover:shadow-2xl hover:border-[#FF2D55]/30 transition-all duration-300 cursor-pointer group"
            >
              {/* 이미지 컨테이너 */}
              <div className="relative w-full aspect-square overflow-hidden">
                <ImageWithFallback
                  src={item.image_url}
                  alt={item.caption || "Product gallery"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF2D55]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {language === "th" ? "ดูรายละเอียด" : "View Details"}
                  </span>
                </div>
              </div>
              
              {/* 캡션 */}
              {item.caption && (
                <div className="p-4 text-center text-white text-sm bg-gradient-to-t from-black/80 to-black/60 backdrop-blur-sm">
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
