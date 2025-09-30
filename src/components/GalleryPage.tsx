import React, { useState, useEffect } from 'react';
import { Eye, MessageCircle, Calendar, User, ThumbsUp, Image as ImageIcon, Search, Plus, ArrowLeft, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { authService } from '../utils/auth';
import type { PageKey, LanguageKey } from '../App';

type GalleryItem = {
  id: string;
  title: string;
  content?: string;
  image_url: string;
  thumbnail_url?: string;
  author_name: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_notice: boolean;
  category_id?: string;
  created_at: string;
};

type GalleryCategory = {
  id: string;
  name: string;
  name_th: string;
  color: string;
  icon: string;
};

type GalleryPageProps = {
  navigateTo: (page: PageKey) => void;
  language: LanguageKey;
};

const ITEMS_PER_PAGE = 20;

export default function GalleryPage({ navigateTo, language }: GalleryPageProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 최상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setIsAdmin(authService.isAdmin());
    loadCategories();
    loadGalleryItems();
  }, []);

  useEffect(() => {
    loadGalleryItems();
  }, [selectedCategory, currentPage, searchTerm]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading categories:', error);
        setCategories(getFallbackCategories());
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories(getFallbackCategories());
    }
  };

  const loadGalleryItems = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('gallery')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .is('product_category_id', null); // 제품이 아닌 일반 갤러리만

      // 카테고리 필터
      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      // 검색 필터
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,author_name.ilike.%${searchTerm}%`);
      }

      // 페이지네이션
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      query = query
        .order('is_notice', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error loading gallery items:', error);
        setGalleryItems(getFallbackData());
        setTotalPages(1);
      } else {
        setGalleryItems(data || []);
        setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error('Error loading gallery items:', error);
      setGalleryItems(getFallbackData());
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackCategories = (): GalleryCategory[] => [
    { id: 'all', name: 'All', name_th: 'ทั้งหมด', color: '#6B7280', icon: '📷' },
    { id: '1', name: 'Products', name_th: 'สินค้า', color: '#3B82F6', icon: '🛍️' },
    { id: '2', name: 'Lifestyle', name_th: 'ไลฟ์สไตล์', color: '#10B981', icon: '✨' },
    { id: '3', name: 'Reviews', name_th: 'รีวิว', color: '#F59E0B', icon: '⭐' },
  ];

  const getFallbackData = (): GalleryItem[] => [
    {
      id: '1',
      title: 'Perfect Gift for Special Occasions',
      content: 'Our bath bombs make the perfect gift for any special occasion.',
      image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      author_name: 'Admin',
      view_count: 150,
      like_count: 25,
      comment_count: 8,
      is_notice: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Luxury Spa Experience',
      content: 'Transform your home into a luxury spa with our premium bath bombs.',
      image_url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
      author_name: 'Admin',
      view_count: 120,
      like_count: 18,
      comment_count: 5,
      is_notice: false,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Natural Ingredients',
      content: '100% natural and safe for the whole family.',
      image_url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
      author_name: 'Admin',
      view_count: 95,
      like_count: 12,
      comment_count: 3,
      is_notice: false,
      created_at: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Customer Review',
      content: 'Amazing product! Highly recommended.',
      image_url: 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=400&h=400&fit=crop',
      author_name: 'Customer',
      view_count: 80,
      like_count: 15,
      comment_count: 7,
      is_notice: false,
      created_at: new Date().toISOString(),
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadGalleryItems();
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return language === 'th' ? category?.name_th : category?.name;
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || '📷';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#6B7280';
  };

  const t = {
    th: {
      title: 'แกลเลอรี่',
      subtitle: 'แชร์รูปภาพสวยๆ ของคุณ!',
      searchPlaceholder: 'ค้นหาตามชื่อเรื่องหรือผู้เขียน...',
      uploadImage: 'อัปโหลดรูปภาพ',
      allCategories: 'ทั้งหมด',
      viewDetails: 'ดูรายละเอียด',
      backToGallery: 'กลับไปยังแกลเลอรี่',
      noItems: 'ไม่พบรายการ',
      loading: 'กำลังโหลด...',
      page: 'หน้า',
      of: 'จาก',
      previous: 'ก่อนหน้า',
      next: 'ถัดไป',
    },
    en: {
      title: 'Gallery',
      subtitle: 'Share your beautiful photos!',
      searchPlaceholder: 'Search by title or author...',
      uploadImage: 'Upload Image',
      allCategories: 'All',
      viewDetails: 'View Details',
      backToGallery: 'Back to Gallery',
      noItems: 'No items found',
      loading: 'Loading...',
      page: 'Page',
      of: 'of',
      previous: 'Previous',
      next: 'Next',
    }
  };

  if (selectedItem) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedItem(null)}
            className="flex items-center gap-2 mb-6 text-[#FF2D55] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t[language].backToGallery}
          </button>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
            <div className="aspect-video relative">
              <ImageWithFallback
                src={selectedItem.image_url}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[#FF2D55] text-white text-sm rounded-full">
                  {selectedItem.is_notice ? '공지' : getCategoryIcon(selectedItem.category_id || 'all')}
                </span>
                <span className="text-sm text-gray-300">
                  {new Date(selectedItem.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{selectedItem.title}</h1>
              
              {selectedItem.content && (
                <div 
                  className="text-gray-300 mb-6 leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedItem.content }}
                />
              )}
              
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {selectedItem.author_name}
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {selectedItem.view_count}
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  {selectedItem.like_count}
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {selectedItem.comment_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF2D55] to-[#007AFF] bg-clip-text text-transparent">
            {t[language].title}
          </h1>
          <p className="text-xl text-gray-300">{t[language].subtitle}</p>
        </div>

        {/* Search and Upload */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t[language].searchPlaceholder}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
              />
            </div>
          </form>
          
          {isAdmin && (
            <button
              onClick={() => navigateTo('admin')}
              className="bg-gradient-to-r from-[#FF2D55] to-[#007AFF] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#FF2D55]/80 hover:to-[#007AFF]/80 transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t[language].uploadImage}
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-[#FF2D55] text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {t[language].allCategories}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'text-white'
                  : 'text-gray-300 hover:bg-white/20'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? category.color : 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <span>{category.icon}</span>
              {language === 'th' ? category.name_th : category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Gnuboard Style */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2D55] mx-auto mb-4"></div>
            <p className="text-gray-400">{t[language].loading}</p>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">{t[language].noItems}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer group border border-white/10 hover:border-[#FF2D55]/50"
                style={{ maxHeight: '360px' }}
              >
                {/* 이미지 섹션 - 고정 높이 */}
                <div className="relative overflow-hidden" style={{ height: '200px' }}>
                  <ImageWithFallback
                    src={item.thumbnail_url || item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* 오버레이 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* 공지사항 배지 */}
                  {item.is_notice && (
                    <div className="absolute top-2 left-2 bg-[#FF2D55] text-white text-xs px-2 py-1 rounded font-semibold shadow-lg">
                      공지
                    </div>
                  )}
                  
                  {/* 카테고리 배지 */}
                  {item.category_id && (
                    <div
                      className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded shadow-lg backdrop-blur-sm"
                      style={{ backgroundColor: getCategoryColor(item.category_id) + 'CC' }}
                    >
                      {getCategoryIcon(item.category_id)}
                    </div>
                  )}
                </div>
                
                {/* 정보 섹션 - 컴팩트 */}
                <div className="p-3">
                  {/* 제목 */}
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[40px] text-white">
                    {item.title}
                  </h3>
                  
                  {/* 메타 정보 */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="truncate flex-1 mr-2">{item.author_name}</span>
                    <span className="text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('ko-KR', { 
                        month: '2-digit', 
                        day: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  {/* 통계 정보 */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{item.view_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{item.like_count}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#FF2D55]">
                      <MessageCircle className="w-3 h-3" />
                      <span>{item.comment_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {t[language].previous}
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-[#FF2D55] text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
            >
              {t[language].next}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Info */}
        <div className="text-center mt-4 text-gray-400 text-sm">
          {t[language].page} {currentPage} {t[language].of} {totalPages}
        </div>
      </div>
    </div>
  );
}