import React, { useState, useEffect } from 'react';
import { Eye, Search, Star, Heart, Zap, ShoppingBag, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { PageKey, LanguageKey } from '../App';

type ProductItem = {
  id: string;
  name: string;
  image_url: string;
  category: string;
  price: number;
  description?: string;
  is_active: boolean;
  created_at: string;
};

type ProductsGalleryPageProps = {
  navigateTo: (page: PageKey) => void;
  language: LanguageKey;
};

const ITEMS_PER_PAGE = 8;

export default function ProductsGalleryPage({ navigateTo, language }: ProductsGalleryPageProps) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: language === 'th' ? 'ทั้งหมด' : 'All', icon: '✨', color: 'bg-red-500' },
    { id: 'bath_bomb', name: 'Daddy Bath Bomb', icon: '💣', color: 'bg-gray-600' },
    { id: 'bath_gel', name: 'Daddy Bath Gel', icon: '🧴', color: 'bg-gray-600' },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('🔄 Loading products for gallery...');
        
        const { data: productsData, error } = await supabase
          .from('products')
          .select('id, name, image_url, category, price, description, is_active, created_at')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error loading products:", error);
          // Fallback to sample data
          const sampleProducts: ProductItem[] = [
            { id: "1", name: "Lavender Dreams", image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", category: "bath_bomb", price: 150, description: "Relaxing lavender scent", is_active: true, created_at: new Date().toISOString() },
            { id: "2", name: "Rose Garden", image_url: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop", category: "bath_bomb", price: 180, description: "Romantic rose scent", is_active: true, created_at: new Date().toISOString() },
            { id: "3", name: "Ocean Breeze", image_url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop", category: "bath_bomb", price: 160, description: "Fresh ocean scent", is_active: true, created_at: new Date().toISOString() },
            { id: "4", name: "Citrus Burst", image_url: "https://images.unsplash.com/photo-1629150098631-4d99ad4a53a4?w=400&h=400&fit=crop", category: "bath_bomb", price: 170, description: "Energizing citrus scent", is_active: true, created_at: new Date().toISOString() },
            { id: "5", name: "Lavender Dreams Gel", image_url: "https://images.unsplash.com/photo-1576773689115-5cd2b0223523?w=400&h=400&fit=crop", category: "bath_gel", price: 120, description: "Soothing lavender gel", is_active: true, created_at: new Date().toISOString() },
            { id: "6", name: "Rose Garden Gel", image_url: "https://images.unsplash.com/photo-1540553016722-983e48a3eaffe?w=400&h=400&fit=crop", category: "bath_gel", price: 130, description: "Luxurious rose gel", is_active: true, created_at: new Date().toISOString() },
            { id: "7", name: "Ocean Breeze Gel", image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop", category: "bath_gel", price: 125, description: "Refreshing ocean gel", is_active: true, created_at: new Date().toISOString() },
            { id: "8", name: "Citrus Burst Gel", image_url: "https://images.unsplash.com/photo-1522335789205-0012b9b2f1a6?w=400&h=400&fit=crop", category: "bath_gel", price: 135, description: "Invigorating citrus gel", is_active: true, created_at: new Date().toISOString() },
          ];
          setProducts(sampleProducts);
        } else {
          setProducts(productsData || []);
          console.log(`✅ Loaded ${productsData?.length || 0} products`);
        }
      } catch (error) {
        console.error("Unable to load products", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Simple Header */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-8">
              {language === 'th' ? 'สินค้า' : 'Products'}
            </h1>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={language === 'th' ? 'ค้นสินค้า...' : 'Search products...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Filter Buttons - Modern Style */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-base">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Products Grid - Modern Card Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-105 group shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <ImageWithFallback
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">💣</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-800">
                <h3 className="text-white font-bold text-lg mb-2 truncate">{product.name}</h3>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <span>Admin</span>
                  <span>30/09</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white mb-4">
                  <Eye className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 200) + 100}</span>
                </div>
                <div className="flex justify-end">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200">
                    Daddy Bath Bomb
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {language === 'th' ? 'ไม่พบสินค้าที่ตรงกับเงื่อนไข' : 'No products found matching your criteria'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

