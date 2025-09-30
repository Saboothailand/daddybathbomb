import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { PageKey, LanguageKey } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { t } from "../utils/translations";
import { ArrowLeft, X, Edit, Trash2, Eye, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
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
        console.error('Error loading product categories:', error);
      } else {
        setProductCategories(data || []);
      }
    } catch (error) {
      console.error('Error loading product categories:', error);
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
        console.error('Error loading products:', error);
        setItems([]);
      } else {
        setItems(data || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
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
        console.log('Loaded slider images:', data.length);
        setSelectedImages(data);
      } else {
        console.log('No slider images found, using default');
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
                {language === "th" ? "กลับ" : "Back"}
              </span>
            </button>
            
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

                {/* Navigation Arrows - Transparent on hover */}
                {selectedImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 border-2 border-white/30 hover:border-white z-20"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-8 h-8 text-white" strokeWidth={3} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 border-2 border-white/30 hover:border-white z-20"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-8 h-8 text-white" strokeWidth={3} />
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
                  <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    {selectedImages.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                          idx === currentImageIndex 
                            ? 'border-[#FF2D55] scale-110 shadow-lg shadow-[#FF2D55]/50' 
                            : 'border-white/40 hover:border-white/80 hover:scale-105'
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
    <section className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#1E1F3F] to-[#0B0F1A] py-20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#FF2D55] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-60 h-60 bg-[#007AFF] rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-50 h-50 bg-[#FFD700] rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header - Comic Style */}
        <div className="text-center mb-16">
          <h1 className="font-fredoka text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white comic-shadow">
            {language === "th" ? "สินค้า" : "Products"}
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-lg rounded-3xl px-8 py-4 comic-border border-4 border-white">
            <p className="font-nunito text-white text-lg sm:text-xl font-bold">
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
  );
}
