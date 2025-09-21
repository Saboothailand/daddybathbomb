import React, { useState, useEffect } from 'react';
import { Eye, MessageCircle, Calendar, User, ThumbsUp, Image as ImageIcon, Search, Plus, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ImageWithFallback } from './figma/ImageWithFallback';
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
  created_at: string;
};

type GalleryPageProps = {
  navigateTo: (page: PageKey) => void;
  language: LanguageKey;
};

export default function GalleryPage({ navigateTo, language }: GalleryPageProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('is_notice', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading gallery items:', error);
        setGalleryItems(getFallbackData());
      } else {
        setGalleryItems(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setGalleryItems(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = (): GalleryItem[] => [
    {
      id: '1',
      title: '프리미엄 바스밤 컬렉션',
      content: '자연 재료로 만든 프리미엄 바스밤들을 소개합니다!',
      image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      author_name: '관리자',
      view_count: 156,
      like_count: 23,
      comment_count: 8,
      is_notice: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: '아로마 테라피 바스밤',
      content: '편안한 라벤더 향의 바스밤으로 스트레스를 날려보세요',
      image_url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=600&fit=crop',
      thumbnail_url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop',
      author_name: '김바스밤',
      view_count: 89,
      like_count: 15,
      comment_count: 4,
      is_notice: false,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      title: '자연스러운 색감의 바스밤',
      content: '화학 색소 없는 자연스러운 색감으로 만든 바스밤',
      image_url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=600&fit=crop',
      thumbnail_url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop',
      author_name: '이자연',
      view_count: 67,
      like_count: 12,
      comment_count: 2,
      is_notice: false,
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: '4',
      title: '가족 모두가 즐기는 바스밤',
      content: '아이부터 어른까지 모두 안전하게 사용할 수 있는 바스밤',
      image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&sig=family',
      thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&sig=family',
      author_name: '박가족',
      view_count: 134,
      like_count: 28,
      comment_count: 6,
      is_notice: false,
      created_at: new Date(Date.now() - 259200000).toISOString(),
    },
  ];

  const handleLike = async (itemId: string) => {
    try {
      const userIp = 'anonymous';
      
      const { error } = await supabase
        .from('likes')
        .insert({
          gallery_id: itemId,
          user_ip: userIp
        });

      if (!error) {
        setGalleryItems(prev => prev.map(item => 
          item.id === itemId 
            ? { ...item, like_count: item.like_count + 1 }
            : item
        ));
      }
    } catch (error) {
      console.error('Error liking item:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredItems = galleryItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#1A1F3A] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedItem(null)}
            className="flex items-center text-[#B8C4DB] hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            목록으로 돌아가기
          </button>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden comic-border border-4 border-white/20">
            {selectedItem.is_notice && (
              <div className="bg-[#FF2D55] text-white text-sm px-3 py-1 rounded-full inline-block m-6">
                공지사항
              </div>
            )}
            
            <div className="aspect-video relative">
              <ImageWithFallback
                src={selectedItem.image_url}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8">
              <h1 className="text-3xl font-bold text-white mb-6">
                {selectedItem.title}
              </h1>
              
              <div className="flex items-center justify-between text-[#B8C4DB] mb-8 pb-4 border-b border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {selectedItem.author_name}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(selectedItem.created_at)}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    {selectedItem.view_count}
                  </div>
                  <button 
                    onClick={() => handleLike(selectedItem.id)}
                    className="flex items-center hover:text-[#FFD700] transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {selectedItem.like_count}
                  </button>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {selectedItem.comment_count}
                  </div>
                </div>
              </div>

              {selectedItem.content && (
                <div className="prose prose-invert max-w-none text-[#B8C4DB] leading-relaxed">
                  <p>{selectedItem.content}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#1A1F3A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF2D55] mx-auto mb-4"></div>
          <p className="text-[#B8C4DB]">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#1A1F3A] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="font-fredoka text-5xl font-bold text-white mb-6 comic-shadow">
            {language === "th" ? "แกลเลอรี่" : "Gallery"}
          </h1>
          <p className="text-[#B8C4DB] text-xl">
            {language === "th" 
              ? "แชร์ภาพสวย ๆ ของคุณ!" 
              : "Share your beautiful photos!"}
          </p>
        </div>

        {/* 검색 및 업로드 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 comic-border border-4 border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B8C4DB] w-5 h-5" />
              <input
                type="text"
                placeholder={language === "th" ? "ค้นหาตามชื่อหรือผู้เขียน..." : "Search by title or author..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#151B2E] border border-[#334155] rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
              />
            </div>
            <button className="bg-[#FF2D55] hover:bg-[#FF1744] text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              {language === "th" ? "อัปโหลดรูป" : "Upload Image"}
            </button>
          </div>
        </div>

        {/* 갤러리 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden comic-border border-4 border-white/20 hover:border-[#FFD700] transition-all duration-300 transform hover:scale-105 cursor-pointer group"
              onClick={() => setSelectedItem(item)}
            >
              <div className="aspect-square relative">
                <ImageWithFallback
                  src={item.thumbnail_url || item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {item.is_notice && (
                  <div className="absolute top-3 left-3 bg-[#FF2D55] text-white text-xs px-2 py-1 rounded-full">
                    공지
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {item.author_name}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {item.view_count}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(item.id);
                        }}
                        className="flex items-center hover:text-[#FFD700] transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {item.like_count}
                      </button>
                      <div className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {item.comment_count}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-[#B8C4DB] mx-auto mb-4" />
            <p className="text-[#B8C4DB]">등록된 갤러리가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
