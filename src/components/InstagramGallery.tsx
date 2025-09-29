import { useEffect, useState } from "react";
import { Instagram, Heart, Star, Zap } from "lucide-react";

import type { LanguageKey } from "../App";
import { galleryService } from "../lib/supabase";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import ImageModal from "./ImageModal";

type GalleryItem = {
  id: number | string;
  image_url: string;
  caption?: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await galleryService.getActiveGalleryImages();
        if (Array.isArray(data) && data.length > 0) {
          setPosts(
            data.map((item, index) => ({
              id: item.id ?? index,
              image_url: item.image_url ?? fallbackPosts[index % fallbackPosts.length].image_url,
              caption: item.caption,
            })),
          );
        }
      } catch (error) {
        console.error("Unable to load gallery", error);
      }
    };

    loadGallery();
  }, []);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleIndexChange = (index: number) => {
    setCurrentImageIndex(index);
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
            {language === "th" ? "ช่วงเวลามหัศจรรย์" : "BATH TIME ADVENTURES"}
          </h2>

          <div className="bg-white/20 rounded-2xl px-8 py-4 comic-border border-4 border-white inline-block backdrop-blur-lg">
            <p className="font-nunito text-white text-xl font-bold">
              {language === "th"
                ? "📸 เก็บช่วงเวลาสนุกไว้ในฟีดของคุณ!"
                : "📸 Super fun moments captured! 📱"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {posts.map((post, index) => (
            <div
              key={post.id}
              onClick={() => handleImageClick(index)}
              className="aspect-square bg-white/10 rounded-3xl comic-border border-4 border-white hover:border-[#FFD700] transition-all duration-300 transform hover:scale-105 comic-button relative overflow-hidden backdrop-blur-lg group cursor-pointer"
            >
              <ImageWithFallback
                src={post.image_url}
                alt={post.caption || "Instagram post"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Heart className="w-6 h-6 text-[#FFD700] animate-pulse" />
              </div>
              {post.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs font-semibold py-2 px-3">
                  {post.caption}
                </div>
              )}
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#FFD700] rounded-full comic-border border-2 border-white flex items-center justify-center">
                <Star className="w-4 h-4 text-black" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white/20 rounded-3xl p-8 comic-border border-4 border-white inline-block backdrop-blur-lg">
            <p className="font-nunito text-white text-xl font-bold mb-4">
              {language === "th"
                ? "ติดตาม @DaddyBathBomb เพื่อแรงบันดาลใจสีสันสดใส!"
                : "Follow us @DaddyBathBomb for more super fun moments!"}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Instagram className="w-8 h-8 text-white animate-bounce" />
              <Zap className="w-10 h-10 text-[#FFD700] animate-pulse" />
              <Instagram className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        images={posts}
        currentIndex={currentImageIndex}
        onIndexChange={handleIndexChange}
      />
    </section>
  );
}
