import React, { useEffect, useMemo, useState } from 'react';
import { Camera, Star } from 'lucide-react';
import type { PageKey, LanguageKey } from '../App';
import { supabase } from '../lib/supabase';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { cn } from './ui/utils';

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  category: string | null;
  display_order: number | null;
  is_active: boolean | null;
}

interface ProductsGalleryProps {
  language: LanguageKey;
  navigateTo: (page: PageKey) => void;
}

const FALLBACK_IMAGES: GalleryItem[] = [
  { id: 'fallback-1', image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&fit=crop', caption: 'Dreamy Pastel Soak', category: 'highlight', display_order: 1, is_active: true },
  { id: 'fallback-2', image_url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&fit=crop', caption: 'Rose Cloud Burst', category: 'highlight', display_order: 2, is_active: true },
  { id: 'fallback-3', image_url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&fit=crop', caption: 'Emerald Cascade', category: 'highlight', display_order: 3, is_active: true },
  { id: 'fallback-4', image_url: 'https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=800&fit=crop', caption: 'Sunset Whirl', category: 'highlight', display_order: 4, is_active: true },
  { id: 'fallback-5', image_url: 'https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=800&fit=crop', caption: 'Lavender Breeze', category: 'studio', display_order: 5, is_active: true },
  { id: 'fallback-6', image_url: 'https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=800&fit=crop', caption: 'Soft Blush Mood', category: 'studio', display_order: 6, is_active: true },
  { id: 'fallback-7', image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&fit=crop', caption: 'Ocean Bloom', category: 'studio', display_order: 7, is_active: true },
  { id: 'fallback-8', image_url: 'https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=800&fit=crop', caption: 'Buttercream Dream', category: 'studio', display_order: 8, is_active: true }
];

export default function ProductsGallery({ language, navigateTo }: ProductsGalleryProps) {
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK_IMAGES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGalleryPreview = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('id, image_url, caption, category, display_order, is_active')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(12);

        if (error) {
          console.error('Error loading gallery preview:', error);
          return;
        }

        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.error('Unexpected error loading gallery preview:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryPreview();
  }, []);

  const bombItems = useMemo(
    () => items.filter((item) => item.category === 'bath_bomb').slice(0, 4),
    [items],
  );

  const gelItems = useMemo(
    () => items.filter((item) => item.category === 'bath_gel').slice(0, 4),
    [items],
  );

  const handleViewGallery = (category?: 'bath_bomb' | 'bath_gel') => {
    if (category) {
      window.dispatchEvent(new CustomEvent('gallery:filter', { detail: category }));
    }
    navigateTo('gallery');
  };

  return (
    <section id="gallery-preview" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0B0F1A] via-[#141B2E] to-[#1F2740]">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 text-[#FFD700]">
            <Star className="w-6 h-6" />
            <Camera className="w-7 h-7" />
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="font-fredoka text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
            {language === 'th' ? 'แกลเลอรี่ไฮไลท์' : 'Gallery Highlights'}
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto">
            {language === 'th'
              ? 'เก็บภาพช่วงเวลาสีสันจาก Daddy Bath Bomb Studio ทั้งเบื้องหน้าและเบื้องหลัง'
              : 'A curated glimpse into the colourful stories from the Daddy Bath Bomb studio.'}
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-2">
          <CategorySection
            title="Daddy Bath Bomb"
            subtitle={language === 'th' ? 'ผลงานจาก Daddy Bath Bomb' : 'Signature bath bomb creations'}
            items={bombItems}
            accent="bg-[#FF2D55]/20"
            onViewAll={() => handleViewGallery('bath_bomb')}
            language={language}
          />
          <CategorySection
            title="Daddy Bath Gel"
            subtitle={language === 'th' ? 'ผลงานจาก Daddy Bath Gel' : 'Dreamy bath gel visuals'}
            items={gelItems}
            accent="bg-[#007AFF]/20"
            onViewAll={() => handleViewGallery('bath_gel')}
            language={language}
          />
        </div>

        <div className="mt-12 text-center">
          <GalleryButton onClick={() => handleViewGallery()} loading={loading} language={language} />
        </div>
      </div>
    </section>
  );
}

function CategorySection({
  title,
  subtitle,
  items,
  accent,
  onViewAll,
  language,
}: {
  title: string;
  subtitle: string;
  items: GalleryItem[];
  accent: string;
  onViewAll: () => void;
  language: LanguageKey;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-fredoka text-2xl font-bold text-white drop-shadow">{title}</h3>
          <p className="text-white/60 text-sm">{subtitle}</p>
        </div>
        <button
          onClick={onViewAll}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:border-white/30 hover:text-white"
        >
          {language === 'th' ? 'ดูทั้งหมด' : 'View all'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={onViewAll}
            className={cn(
              'group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl',
              accent,
            )}
            aria-label={item.caption ?? 'Gallery image preview'}
          >
            <ImageWithFallback
              src={item.image_url}
              alt={item.caption ?? 'Gallery image'}
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-left">
              <p className="text-white text-sm font-semibold line-clamp-2">
                {item.caption || (language === 'th' ? 'ผลงานแกลเลอรี่' : 'Gallery piece')}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function GalleryButton({ onClick, loading, language }: { onClick: () => void; loading: boolean; language: LanguageKey }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full bg-[#FF2D55] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[#ff1f49] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Camera className="w-4 h-4" />
      {language === 'th' ? 'ชมแกลเลอรี่ทั้งหมด' : 'View Full Gallery'}
    </button>
  );
}
