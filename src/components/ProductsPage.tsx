import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { PageKey, LanguageKey } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { t } from "../utils/translations";
import { ArrowLeft, X, Edit, Trash2, Eye, Search, Filter } from "lucide-react";
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

  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
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
              {/* 이미지 섹션 - 원본 비율 유지, 가로 1000px */}
              <div className="relative overflow-hidden bg-black/20" style={{ maxWidth: '1000px' }}>
                <ImageWithFallback
                  src={selectedItem.image_url}
                  alt={selectedItem.caption || "Product detail"}
                  className="w-full h-auto object-contain"
                />
                {/* Close Button */}
                <button
                  onClick={handleCloseDetail}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/60 hover:bg-[#FF2D55] text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                >
                  <X className="w-6 h-6" />
                </button>
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
                  <button
                  onClick={() => navigateTo("contact")}
                  className="flex-1 bg-gradient-to-r from-[#FF2D55] to-[#007AFF] text-white px-5 py-3 rounded-full font-bold text-base hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  {language === "th" ? "สั่งซื้อ" : "Order Now"}
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

          {/* Other Products */}
          {otherItems.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-6">
                {language === "th" ? "สินค้าที่เกี่ยวข้อง" : "Related Products"}
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
    <section className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#1a1f3a] to-[#0B0F1A] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="inline-block relative">
            <h1 className="font-fredoka text-6xl sm:text-7xl font-bold mb-6 relative z-10">
              <span className="bg-gradient-to-r from-[#FF2D55] via-[#FF6B9D] to-[#007AFF] bg-clip-text text-transparent drop-shadow-2xl">
                {language === "th" ? "สินค้า" : "Products"}
              </span>
            </h1>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#FF2D55]/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#007AFF]/20 rounded-full blur-3xl"></div>
          </div>
          <p className="text-lg sm:text-xl text-[#B8C4DB] font-light max-w-2xl mx-auto">
            {language === "th" 
              ? "ค้นพบผลิตภัณฑ์คุณภาพพรีเมี่ยมของเรา" 
              : "Discover our premium collection"}
          </p>
        </div>

        {/* Search Bar - Modern Design */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF2D55] to-[#007AFF] rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === "th" ? "🔍 ค้นหาสินค้า..." : "🔍 Search products..."}
                className="w-full pl-14 pr-6 py-4 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl text-white text-lg placeholder-gray-400 focus:outline-none focus:border-[#FF2D55]/50 focus:bg-white/10 transition-all duration-300 relative z-10"
              />
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => navigateTo('admin')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#FF2D55] to-[#007AFF] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF2D55]/50 transition-all duration-300 flex items-center gap-2 text-sm z-10"
                >
                  <Edit className="w-4 h-4" />
                  {language === "th" ? "จัดการ" : "Manage"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Category Filter - Elegant Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#FF2D55] to-[#FF6B9D] text-white shadow-lg shadow-[#FF2D55]/50'
                : 'bg-white/5 backdrop-blur-sm text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            ✨ {language === "th" ? "ทั้งหมด" : "All Products"}
          </button>
          {productCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border ${
                selectedCategory === category.id
                  ? 'text-white shadow-xl'
                  : 'text-gray-300 hover:bg-white/10 bg-white/5 backdrop-blur-sm border-white/10'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? category.color : undefined,
                boxShadow: selectedCategory === category.id ? `0 10px 40px ${category.color}40` : undefined,
              }}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{language === 'th' ? category.name_th : category.name_en}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2D55] mx-auto mb-4"></div>
            <p className="text-gray-400">{language === "th" ? "กำลังโหลด..." : "Loading..."}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">{language === "th" ? "ไม่พบรายการ" : "No items found"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="group relative"
              >
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-[#FF2D55]/20 hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-square">
                    <ImageWithFallback
                      src={item.thumbnail_url || item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>
                    
                    {/* Notice Badge */}
                    {item.is_notice && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-[#FF2D55] to-[#FF6B9D] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl backdrop-blur-sm">
                        ⭐ {language === "th" ? "ใหม่" : "NEW"}
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    {item.product_category_id && (
                      <div
                        className="absolute top-3 right-3 text-white text-lg px-3 py-1.5 rounded-full shadow-xl backdrop-blur-md"
                        style={{ backgroundColor: getProductCategoryColor(item.product_category_id) + 'DD' }}
                      >
                        {getProductCategoryIcon(item.product_category_id)}
                      </div>
                    )}

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-white text-sm line-clamp-2 mb-1">
                        {item.title}
                      </h3>
                      {item.product_category_id && (
                        <p className="text-xs font-semibold opacity-90" style={{ color: getProductCategoryColor(item.product_category_id) }}>
                          {getProductCategoryName(item.product_category_id)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Stats Bar */}
                  <div className="px-4 py-3 bg-black/40 backdrop-blur-md">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span className="font-medium">{item.view_count}</span>
                        </div>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 truncate">{item.author_name}</span>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {new Date(item.created_at).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
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
