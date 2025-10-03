import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { PageKey, LanguageKey } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { t } from "../utils/translations";
import { ArrowLeft, X, Edit, Trash2, Eye, Search, Filter, ChevronLeft, ChevronRight, Star, Zap, Shield, Heart } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import { authService } from "../utils/auth";

type ProductCategory = {
  id: string;
  name: string;
  name_th: string;
  name_en: string;
  icon: string;
  color: string;
  display_order: number;
};

type GalleryImage = {
  id: string;
  image_url: string;
  caption?: string;
  display_order: number;
  is_primary: boolean;
};

type GalleryItem = {
  id: string | number;
  title: string;
  content?: string;
  image_url: string;
  thumbnail_url?: string;
  author_name: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_notice: boolean;
  product_category_id?: string;
  buy_link?: string;
  created_at: string;
};

type ProductsPageProps = {
  navigateTo: (page: PageKey) => void;
  language: LanguageKey;
};

const ITEMS_PER_PAGE = 20;

export default function ProductsPage({ navigateTo, language }: ProductsPageProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedImages, setSelectedImages] = useState<GalleryImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // 페이지 로드 시 최상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setIsAdmin(authService.isAdmin());
    loadProductCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchTerm]);

  const loadProductCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('❌ Error loading product categories:', error);
      } else {
        console.log('✅ Product categories loaded:', data);
        setProductCategories(data || []);
      }
    } catch (error) {
      console.error('❌ Exception loading product categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .not('product_category_id', 'is', null); // 제품 카테고리가 있는 것만

      // 카테고리 필터
      if (selectedCategory !== 'all') {
        query = query.eq('product_category_id', selectedCategory);
      }

      // 검색 필터
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,author_name.ilike.%${searchTerm}%`);
      }

      query = query
        .order('is_notice', { ascending: false })
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error loading products:', error);
        setItems([]);
      } else {
        console.log(`✅ Products loaded: ${data?.length || 0} items`);
        setItems(data || []);
      }
    } catch (error) {
      console.error('❌ Exception loading products:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (item: GalleryItem) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    
    // 기본 이미지를 먼저 설정
    const defaultImage: GalleryImage = {
      id: 'default',
      image_url: item.image_url,
      display_order: 1,
      is_primary: true
    };
    setSelectedImages([defaultImage]);
    
    // 해당 아이템의 추가 이미지 가져오기 시도
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('gallery_id', item.id)
        .order('display_order', { ascending: true });

              if (!error && data && data.length > 0) {
        console.log('✅ Loaded slider images:', data.length, data);
        setSelectedImages(data);
      } else {
        console.log('⚠️ No slider images found in DB, using default image');
        if (error) console.error('Error:', error);
      }
    } catch (error) {
      console.error('Error loading gallery images:', error);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
    setSelectedImages([]);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : selectedImages.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < selectedImages.length - 1 ? prev + 1 : 0));
  };

  const getProductCategoryName = (productCategoryId: string) => {
    const category = productCategories.find(cat => cat.id === productCategoryId);
    return language === 'th' ? category?.name_th : category?.name_en;
  };

  const getProductCategoryColor = (productCategoryId: string) => {
    const category = productCategories.find(cat => cat.id === productCategoryId);
    return category?.color || '#6B7280';
  };

  const getProductCategoryIcon = (productCategoryId: string) => {
    const category = productCategories.find(cat => cat.id === productCategoryId);
    return category?.icon || '🛁';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
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
    console.log('🎨 Detail page rendering');
    console.log('  - Selected images count:', selectedImages.length);
    console.log('  - Current image index:', currentImageIndex);
    console.log('  - Show arrows?', selectedImages.length > 1);
    
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0B0F1A] via-[#131735] to-[#1E1F3F] min-h-screen">
        <div className="max-w-[1000px] mx-auto">
          {/* 뒤로가기 & 카테고리 정보 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCloseDetail}
                className="flex items-center gap-2 text-white hover:text-[#FF2D55] transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">
                  {language === "th" ? "กลับ" : "Back"}
                </span>
              </button>
              
              {/* 현재 제품 카테고리 표시 */}
              {selectedItem.product_category_id && (
                <div 
                  className="px-4 py-2 rounded-full font-bold text-white border-3 comic-border flex items-center gap-2"
                  style={{ backgroundColor: getProductCategoryColor(selectedItem.product_category_id) }}
                >
                  <span className="text-xl">{getProductCategoryIcon(selectedItem.product_category_id)}</span>
                  <span>{getProductCategoryName(selectedItem.product_category_id)}</span>
                </div>
              )}
            </div>
            
            {/* Admin Buttons */}
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

          {/* Product Detail Card */}
          <div className="flex justify-center mb-12">
            <div className="inline-block bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl max-w-full">
              {/* Image Slider Section */}
              <div className="relative overflow-hidden bg-black/20 group" style={{ maxWidth: '1000px' }}>
                <ImageWithFallback
                  src={selectedImages[currentImageIndex]?.image_url || selectedItem.image_url}
                  alt={selectedImages[currentImageIndex]?.caption || selectedItem.title}
                  className="w-full h-auto object-contain transition-opacity duration-300"
                />
                
                {/* Image Counter */}
                {selectedImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold text-sm z-20">
                    {currentImageIndex + 1} / {selectedImages.length}
                  </div>
                )}

                {/* Navigation Arrows - Always Visible */}
                {selectedImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-white/20 hover:bg-white/40 backdrop-blur-lg rounded-full flex items-center justify-center transition-all duration-300 border-3 border-white shadow-2xl comic-button z-20"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-10 h-10 text-white" strokeWidth={4} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-white/20 hover:bg-white/40 backdrop-blur-lg rounded-full flex items-center justify-center transition-all duration-300 border-3 border-white shadow-2xl comic-button z-20"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-10 h-10 text-white" strokeWidth={4} />
                    </button>
                  </>
                )}

                {/* Close Button */}
                <button
                  onClick={handleCloseDetail}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/70 hover:bg-[#FF2D55] text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-30 border-2 border-white/50"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Thumbnail Navigation */}
                {selectedImages.length > 1 && (
                  <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 px-4 z-20">
                    {selectedImages.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-20 h-20 rounded-2xl overflow-hidden comic-border transition-all duration-300 ${
                          idx === currentImageIndex 
                            ? 'border-4 border-[#FF2D55] scale-110 shadow-2xl' 
                            : 'border-3 border-white/60 hover:border-white hover:scale-105'
                        }`}
                      >
                        <img 
                          src={img.image_url} 
                          alt={img.caption || `Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Section */}
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
                <div 
                  className="text-white text-base leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: selectedItem.content || (language === "th"
                      ? "แช่ตัวกับบาธบอมพ์พรีเมี่ยมที่ทำจากส่วนผสมธรรมชาติ ปลอดภัยสำหรับทุกคนในครอบครัว พร้อมมอบประสบการณ์ผ่อนคลายที่ไม่เหมือนใคร"
                      : "Indulge in our premium bath bombs made from natural ingredients. Safe for the whole family, delivering a unique relaxing experience.")
                  }}
                />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {selectedItem.buy_link ? (
                    <a
                      href={selectedItem.buy_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-[#FF2D55] to-[#007AFF] text-white px-5 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center comic-button border-3 border-white flex items-center justify-center gap-2"
                    >
                      🛒 {language === "th" ? "ซื้อเลย" : "Buy Now"}
                    </a>
                  ) : (
                    <button
                      onClick={() => navigateTo("contact")}
                      className="flex-1 bg-gradient-to-r from-[#FF2D55] to-[#007AFF] text-white px-5 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 comic-button border-3 border-white"
                    >
                      {language === "th" ? "สั่งซื้อ" : "Order Now"}
                    </button>
                  )}
                  <button
                    onClick={handleCloseDetail}
                    className="px-5 py-4 bg-white/20 backdrop-blur-lg text-white rounded-full font-bold hover:bg-white/30 transition-all duration-300 border-3 border-white comic-button"
                  >
                    {language === "th" ? "ดูสินค้าอื่น" : "View More"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Other Products */}
          {otherItems.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {language === "th" ? "สินค้าที่เกี่ยวข้อง" : "Related Products"}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
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
    <div className="min-h-screen bg-[#0B0F1A]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#007AFF]/20 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center">
        <AnimatedBackground />
        
        {/* Comic speech bubble */}
        <div className="absolute top-20 right-10 hidden lg:block animate-bounce">
          <div className="bg-[#FFD700] rounded-2xl px-6 py-3 comic-border border-4 border-black relative">
            <span className="font-fredoka text-black font-bold text-lg">Super Products!</span>
            <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-6 border-r-6 border-t-12 border-transparent border-t-[#FFD700]"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <Shield className="w-10 h-10 text-[#FFD700] mr-3 animate-pulse" />
                <span className="font-nunito text-[#B8C4DB] text-xl font-bold">Daddy Bath Bomb Products</span>
                <Shield className="w-10 h-10 text-[#FFD700] ml-3 animate-pulse" />
              </div>
              
              <h1 className="font-fredoka text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-none comic-shadow">
                <span className="inline-block animate-bounce text-[#FF2D55]" style={{ animationDelay: '0s' }}>SUPER</span>
                <span className="block text-[#007AFF] relative">
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>PRODUCTS</span>
                  <Zap className="absolute -top-4 -right-8 w-12 h-12 text-[#FFD700] rotate-12 animate-spin" style={{ animationDuration: '3s' }} />
                </span>
                <span className="block text-white animate-bounce" style={{ animationDelay: '0.4s' }}>FOR HEROES</span>
              </h1>
              
              <div className="bg-[#151B2E]/80 rounded-3xl p-6 comic-border border-4 border-[#FFD700] backdrop-blur-lg mb-6">
                <p className="font-nunito text-xl text-[#B8C4DB] leading-relaxed mb-4">
                  🦸‍♂️ Discover our amazing collection of 
                  <span className="text-[#FF2D55] font-bold"> SUPER BATH BOMBS</span>!
                </p>
                <p className="font-nunito text-lg text-[#B8C4DB] leading-relaxed">
                  💥 Turn every bath into an <span className="text-[#00FF88] font-bold">explosive adventure</span>! 💥
                </p>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <Star className="w-8 h-8 text-[#FFD700] animate-spin" />
                <span className="font-fredoka text-2xl text-white font-bold">Premium Quality</span>
                <Star className="w-8 h-8 text-[#FFD700] animate-spin" />
              </div>
            </div>
            
            <div className="relative">
              {/* Super Products character showcase */}
              <div className="w-96 h-96 mx-auto bg-gradient-to-br from-[#FF2D55] via-[#007AFF] to-[#FFD700] rounded-full comic-border border-8 border-white flex items-center justify-center relative overflow-hidden animate-float">
                {/* Main superhero character */}
                <div className="text-9xl animate-bounce" style={{ animationDuration: '2s' }}>
                  🛁
                </div>
                
                {/* Cape effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF2D55]/30 to-transparent rounded-full"></div>
                
                {/* Floating bath bombs around character */}
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#FFD700] rounded-full comic-border border-4 border-black flex items-center justify-center animate-bounce">
                  <span className="text-2xl">💣</span>
                </div>
                
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#00FF88] rounded-full comic-border border-4 border-black flex items-center justify-center animate-pulse">
                  <span className="text-3xl">✨</span>
                </div>
                
                <div className="absolute top-1/4 -right-8 w-12 h-12 bg-[#007AFF] rounded-full comic-border border-4 border-black flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                  <Heart className="w-6 h-6 text-white" />
                </div>
                
                <div className="absolute bottom-1/4 -left-8 w-14 h-14 bg-[#FF2D55] rounded-full comic-border border-4 border-black flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
                  <Star className="w-8 h-8 text-white" />
                </div>
                
                {/* Action lines */}
                <div className="absolute top-8 left-8 w-8 h-1 bg-[#FFD700] rotate-45 animate-pulse"></div>
                <div className="absolute bottom-8 right-8 w-6 h-1 bg-white rotate-12 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute top-1/2 right-4 w-4 h-1 bg-[#00FF88] -rotate-45 animate-pulse" style={{ animationDelay: '0.7s' }}></div>
              </div>
              
              {/* Power-up effects */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#FF2D55] rounded-full opacity-20 blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#007AFF] rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/3 -right-8 w-20 h-20 bg-[#FFD700] rounded-full opacity-30 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              
              {/* Comic "Bubble" text */}
              <div className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 comic-border border-3 border-black animate-pulse">
                <span className="font-fredoka text-black font-bold text-lg">Bubble</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0F1A] relative overflow-hidden">
        {/* Comic book background effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-24 h-24 bg-[#FFD700] rotate-45 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-[#FF2D55] rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 border-4 border-[#007AFF] rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-[#00FF88] rounded-full animate-ping"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Star className="w-10 h-10 text-[#FFD700] animate-spin mr-4" />
              <span className="font-fredoka text-3xl text-[#FF2D55] font-bold comic-shadow">PRODUCT CATALOG</span>
              <Star className="w-10 h-10 text-[#FFD700] animate-spin ml-4" />
            </div>
            
            <h2 className="font-fredoka text-5xl font-bold text-white mb-6 comic-shadow">
              {language === "th" ? "ค้นพบคอลเลกชันของเรา" : "DISCOVER OUR COLLECTION"}
            </h2>
            
            <div className="bg-[#151B2E] rounded-2xl px-8 py-4 comic-border border-4 border-[#FFD700] inline-block">
              <p className="font-nunito text-xl text-[#B8C4DB] font-bold">
                {language === "th" 
                  ? "✨ ค้นพบผลิตภัณฑ์คุณภาพพรีเมี่ยมของเรา ✨" 
                  : "✨ Discover Our Premium Collection ✨"}
              </p>
            </div>
          </div>

          {/* Search Bar - Comic Style */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-2 comic-border border-4 border-white">
              <div className="relative flex items-center gap-3">
                <div className="flex items-center flex-1 relative">
                  <div className="absolute left-4 flex items-center justify-center w-8">
                    <Search className="text-white w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === "th" ? "ค้นหาสินค้า..." : "Search products..."}
                    className="w-full pl-16 pr-4 py-3 bg-transparent text-white text-lg placeholder-white/60 focus:outline-none font-nunito font-bold"
                  />
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => navigateTo('admin')}
                    className="bg-gradient-to-r from-[#FF2D55] to-[#007AFF] text-white px-5 py-2.5 rounded-2xl font-bold hover:scale-105 transition-transform duration-300 flex items-center gap-2 comic-button border-2 border-white whitespace-nowrap"
                  >
                    <Edit className="w-4 h-4" />
                    {language === "th" ? "จัดการ" : "Manage"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Category Filter - Comic Style */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-6 py-3 rounded-2xl font-bold font-nunito transition-all duration-300 transform hover:scale-105 comic-border border-4 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#FF2D55] to-[#FFD700] text-white border-white shadow-2xl'
                : 'bg-white/20 backdrop-blur-lg text-white border-white/50 hover:bg-white/30'
            }`}
          >
            ✨ {language === "th" ? "ทั้งหมด" : "All Products"}
          </button>
          {productCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-3 rounded-2xl font-bold font-nunito transition-all duration-300 transform hover:scale-105 flex items-center gap-2 comic-border border-4 ${
                selectedCategory === category.id
                  ? 'text-white border-white shadow-2xl'
                  : 'bg-white/20 backdrop-blur-lg text-white border-white/50 hover:bg-white/30'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? category.color : undefined,
              }}
            >
              <span className="text-2xl">{category.icon}</span>
              <span>{language === 'th' ? category.name_th : category.name_en}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block bg-white/20 backdrop-blur-lg rounded-3xl px-12 py-8 comic-border border-4 border-white">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF2D55] mx-auto mb-4"></div>
              <p className="font-nunito font-bold text-white text-xl comic-shadow">
                {language === "th" ? "กำลังโหลด..." : "Loading..."}
              </p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block bg-white/20 backdrop-blur-lg rounded-3xl px-12 py-8 comic-border border-4 border-white">
              <Filter className="w-20 h-20 text-white mx-auto mb-4" />
              <p className="font-nunito font-bold text-white text-xl comic-shadow">
                {language === "th" ? "ไม่พบรายการ" : "No items found"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="group relative cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-white/20 backdrop-blur-lg rounded-3xl overflow-hidden comic-border border-4 border-white hover:border-[#FFD700] transition-all duration-300 hover:shadow-2xl">
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-square">
                    <ImageWithFallback
                      src={item.thumbnail_url || item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Notice Badge */}
                    {item.is_notice && (
                      <div className="absolute top-3 left-3 bg-[#FF2D55] text-white text-xs font-bold px-3 py-1.5 rounded-full comic-border border-2 border-white shadow-xl">
                        ⭐ {language === "th" ? "ใหม่" : "NEW"}
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    {item.product_category_id && (
                      <div
                        className="absolute top-3 right-3 text-white text-xl px-3 py-1.5 rounded-full comic-border border-2 border-white shadow-xl"
                        style={{ backgroundColor: getProductCategoryColor(item.product_category_id) }}
                      >
                        {getProductCategoryIcon(item.product_category_id)}
                      </div>
                    )}
                  </div>
                  
                  {/* Info Card - Comic Style */}
                  <div className="p-4 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-lg">
                    <h3 className="font-nunito font-bold text-sm text-white mb-2 line-clamp-2 min-h-[40px] comic-shadow">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-white/80 mb-2">
                      <span className="truncate flex-1 mr-2 font-medium">{item.author_name}</span>
                      <span className="font-bold">
                        {new Date(item.created_at).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { 
                          month: '2-digit', 
                          day: '2-digit' 
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t-2 border-white/30">
                      <div className="flex items-center gap-2 text-white">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span className="font-bold">{item.view_count}</span>
                        </div>
                      </div>
                      {item.product_category_id && (
                        <span className="font-bold text-xs px-2 py-1 rounded-full comic-border border-2" style={{ 
                          backgroundColor: getProductCategoryColor(item.product_category_id),
                          color: 'white',
                          borderColor: 'white'
                        }}>
                          {getProductCategoryName(item.product_category_id)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </section>
    </div>
  );
}
