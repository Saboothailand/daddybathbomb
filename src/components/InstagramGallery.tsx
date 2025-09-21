import { useEffect, useState } from "react";
import { Instagram, Heart, Star, Zap, Eye, MessageCircle, Calendar, User, ThumbsUp } from "lucide-react";

import type { LanguageKey } from "../App";
import { galleryService } from "../lib/supabase";
import { supabase } from "../lib/supabase";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type GalleryItem = {
  id: number | string;
  image_url: string;
  caption?: string;
  title?: string;
  author_name?: string;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  created_at?: string;
};

type InstagramGalleryProps = {
  language: LanguageKey;
};

const fallbackPosts: GalleryItem[] = [
  { id: 1, image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&fit=crop" },
  { id: 2, image_url: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&fit=crop" },
  { id: 3, image_url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&fit=crop" },
  { id: 4, image_url: "https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=600&fit=crop" },
  { id: 5, image_url: "https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=600&fit=crop" },
  { id: 6, image_url: "https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=600&fit=crop" },
  { id: 7, image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&fit=crop" },
  { id: 8, image_url: "https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=600&fit=crop" },
];

export default function InstagramGallery({ language }: InstagramGalleryProps) {
  const [posts, setPosts] = useState<GalleryItem[]>(fallbackPosts);
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        // 먼저 새로운 갤러리 데이터를 시도
        const { data: galleryData } = await supabase
          .from('gallery')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (galleryData && galleryData.length > 0) {
          setPosts(
            galleryData.map((item) => ({
              id: item.id,
              image_url: item.image_url,
              caption: item.content,
              title: item.title,
              author_name: item.author_name,
              view_count: item.view_count,
              like_count: item.like_count,
              comment_count: item.comment_count,
              created_at: item.created_at,
            }))
          );
        } else {
          // 폴백 데이터 사용
          const data = await galleryService.getActiveGalleryImages();
          if (Array.isArray(data) && data.length > 0) {
            setPosts(
              data.map((item, index) => ({
                id: item.id ?? index,
                image_url: item.image_url ?? fallbackPosts[index % fallbackPosts.length].image_url,
                caption: item.caption,
                title: `Gallery ${index + 1}`,
                author_name: 'User',
                view_count: Math.floor(Math.random() * 1000),
                like_count: Math.floor(Math.random() * 100),
                comment_count: Math.floor(Math.random() * 50),
                created_at: new Date().toISOString(),
              })),
            );
          }
        }
      } catch (error) {
        console.error("Unable to load gallery", error);
      }
    };

    loadGallery();
  }, []);

  const handleLike = async (postId: string | number) => {
    try {
      const userIp = 'anonymous'; // 실제로는 사용자 IP를 가져와야 함
      
      const { error } = await supabase
        .from('likes')
        .insert({
          gallery_id: postId,
          user_ip: userIp
        });

      if (!error) {
        // 좋아요 수 업데이트
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, like_count: (post.like_count || 0) + 1 }
            : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FF2D55] to-[#007AFF] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-[#FFD700] rotate-45 animate-bounce" />
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-white rounded-full animate-ping" />
        <div className="absolute bottom-20 right-1/3 w-24 h-24 border-4 border-white rounded-full animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Instagram className="w-12 h-12 text-white animate-bounce mr-4" />
            <Star className="w-8 h-8 text-[#FFD700] animate-spin" />
            <Heart className="w-10 h-10 text-white mx-4 animate-pulse" />
            <Star className="w-8 h-8 text-[#FFD700] animate-spin" />
            <Instagram className="w-12 h-12 text-white animate-bounce ml-4" />
          </div>

          <h2 className="font-fredoka text-5xl font-bold text-white mb-6 comic-shadow">
            {language === "th" ? "แกลเลอรี่" : "Gallery"}
          </h2>

          <div className="bg-white/20 rounded-2xl px-8 py-4 comic-border border-4 border-white inline-block backdrop-blur-lg">
            <p className="font-nunito text-white text-xl font-bold">
              {language === "th"
                ? "📸 แชร์ภาพสวย ๆ ของคุณ!"
                : "📸 Share your beautiful photos! 📱"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {posts.map((post) => (
            <div
              key={post.id}
              className="aspect-square bg-white/10 rounded-3xl comic-border border-4 border-white hover:border-[#FFD700] transition-all duration-300 transform hover:scale-105 comic-button relative overflow-hidden backdrop-blur-lg group cursor-pointer"
              onMouseEnter={() => setHoveredPost(post.id.toString())}
              onMouseLeave={() => setHoveredPost(null)}
            >
              <ImageWithFallback
                src={post.image_url}
                alt={post.caption || "Gallery post"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* 그누보드 스타일 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* 호버 시 나타나는 상세 정보 */}
              <div className={`absolute bottom-0 left-0 right-0 bg-black/80 text-white p-3 transition-all duration-300 ${
                hoveredPost === post.id.toString() ? 'translate-y-0' : 'translate-y-full'
              }`}>
                <h3 className="font-bold text-sm mb-2 line-clamp-2">
                  {post.title || post.caption || `Gallery ${post.id}`}
                </h3>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {post.author_name || '익명'}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {post.view_count || 0}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className="flex items-center hover:text-[#FFD700] transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {post.like_count || 0}
                    </button>
                    <div className="flex items-center">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {post.comment_count || 0}
                    </div>
                  </div>
                </div>
                {post.created_at && (
                  <div className="flex items-center text-xs text-gray-300 mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(post.created_at)}
                  </div>
                )}
              </div>

              {/* 기존 스타일 요소들 */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Heart className="w-6 h-6 text-[#FFD700] animate-pulse" />
              </div>
              
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#FFD700] rounded-full comic-border border-2 border-white flex items-center justify-center">
                <Star className="w-4 h-4 text-black" />
              </div>

              {/* 클릭 효과를 위한 인디케이터 */}
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-6 h-6 bg-[#FF2D55] rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white/20 rounded-3xl p-8 comic-border border-4 border-white inline-block backdrop-blur-lg">
            <p className="font-nunito text-white text-xl font-bold mb-4">
              {language === "th"
                ? "ติดตามเราเพื่อดูภาพสวย ๆ เพิ่มเติม!"
                : "Follow us for more beautiful photos!"}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Instagram className="w-8 h-8 text-white animate-bounce" />
              <Zap className="w-10 h-10 text-[#FFD700] animate-pulse" />
              <Instagram className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
