import { useState } from "react";
import { X, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";

interface FilterSection {
  title: string;
  isOpen: boolean;
}

interface ProductFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    categories: string[];
    priceRange: [number, number];
    minRating: number;
    colors: string[];
    inStock: boolean;
  };
  onFiltersChange: (filters: any) => void;
}

export default function ProductFilters({ isOpen, onClose, filters, onFiltersChange }: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    rating: true,
    colors: true,
    availability: true
  });

  const categories = [
    { id: 'superhero', label: 'Superhero Series', count: 24 },
    { id: 'princess', label: 'Princess Power', count: 18 },
    { id: 'dinosaur', label: 'Dino Destruction', count: 15 },
    { id: 'galaxy', label: 'Galaxy Adventure', count: 12 },
    { id: 'rainbow', label: 'Rainbow Burst', count: 21 },
    { id: 'mystery', label: 'Mystery Box', count: 8 }
  ];

  const colors = [
    { id: 'red', label: 'Red', color: '#FF2D55', count: 16 },
    { id: 'blue', label: 'Blue', color: '#007AFF', count: 20 },
    { id: 'purple', label: 'Purple', color: '#AF52DE', count: 14 },
    { id: 'green', label: 'Green', color: '#00FF88', count: 18 },
    { id: 'yellow', label: 'Yellow', color: '#FFD700', count: 12 },
    { id: 'pink', label: 'Pink', color: '#FF69B4', count: 15 },
    { id: 'orange', label: 'Orange', color: '#FF8C42', count: 10 },
    { id: 'rainbow', label: 'Rainbow', color: 'linear-gradient(45deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff)', count: 8 }
  ];

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilters = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 50],
      minRating: 0,
      colors: [],
      inStock: false
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-[#FFD700] fill-current' : 'text-[#475569]'}`}
      />
    ));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-full lg:h-auto w-80 lg:w-72 
        bg-[#151B2E] border-r border-[#334155] z-50 lg:z-auto
        transform lg:transform-none transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-white font-fredoka comic-shadow">
                FILTERS
              </h2>
              <div className="ml-2 w-6 h-6 bg-[#FF2D55] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden text-[#64748B] hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Clear filters */}
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="w-full mb-6 bg-transparent border-[#334155] text-[#64748B] hover:bg-[#1E293B] hover:text-white"
          >
            Clear All Filters
          </Button>

          {/* Categories */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full mb-4 text-white font-medium hover:text-[#007AFF] transition-colors"
            >
              <span className="font-nunito font-bold">Categories</span>
              {openSections.categories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openSections.categories && (
              <div className="space-y-3">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center cursor-pointer group">
                    <Checkbox
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        const newCategories = checked
                          ? [...filters.categories, category.id]
                          : filters.categories.filter(c => c !== category.id);
                        updateFilters('categories', newCategories);
                      }}
                      className="mr-3"
                    />
                    <span className="flex-1 text-[#B8C4DB] group-hover:text-white transition-colors">
                      {category.label}
                    </span>
                    <Badge variant="secondary" className="bg-[#334155] text-[#94A3B8] text-xs">
                      {category.count}
                    </Badge>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full mb-4 text-white font-medium hover:text-[#007AFF] transition-colors"
            >
              <span className="font-nunito font-bold">Price Range</span>
              {openSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openSections.price && (
              <div className="space-y-4">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilters('priceRange', value)}
                  max={50}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-[#B8C4DB]">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}+</span>
                </div>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('rating')}
              className="flex items-center justify-between w-full mb-4 text-white font-medium hover:text-[#007AFF] transition-colors"
            >
              <span className="font-nunito font-bold">Rating</span>
              {openSections.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openSections.rating && (
              <div className="space-y-3">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center cursor-pointer group">
                    <Checkbox
                      checked={filters.minRating === rating}
                      onCheckedChange={(checked) => {
                        updateFilters('minRating', checked ? rating : 0);
                      }}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      {renderStars(rating)}
                      <span className="ml-2 text-[#B8C4DB] group-hover:text-white transition-colors">
                        & Up
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Colors */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('colors')}
              className="flex items-center justify-between w-full mb-4 text-white font-medium hover:text-[#007AFF] transition-colors"
            >
              <span className="font-nunito font-bold">Colors</span>
              {openSections.colors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openSections.colors && (
              <div className="grid grid-cols-2 gap-3">
                {colors.map(color => (
                  <label key={color.id} className="flex items-center cursor-pointer group">
                    <Checkbox
                      checked={filters.colors.includes(color.id)}
                      onCheckedChange={(checked) => {
                        const newColors = checked
                          ? [...filters.colors, color.id]
                          : filters.colors.filter(c => c !== color.id);
                        updateFilters('colors', newColors);
                      }}
                      className="mr-2"
                    />
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-[#334155] mr-2"
                        style={{ 
                          background: color.id === 'rainbow' 
                            ? 'linear-gradient(45deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff)'
                            : color.color 
                        }}
                      />
                      <span className="text-xs text-[#B8C4DB] group-hover:text-white transition-colors">
                        {color.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('availability')}
              className="flex items-center justify-between w-full mb-4 text-white font-medium hover:text-[#007AFF] transition-colors"
            >
              <span className="font-nunito font-bold">Availability</span>
              {openSections.availability ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openSections.availability && (
              <label className="flex items-center cursor-pointer group">
                <Checkbox
                  checked={filters.inStock}
                  onCheckedChange={(checked) => updateFilters('inStock', checked)}
                  className="mr-3"
                />
                <span className="text-[#B8C4DB] group-hover:text-white transition-colors">
                  In Stock Only
                </span>
              </label>
            )}
          </div>
        </div>
      </div>
    </>
  );
}