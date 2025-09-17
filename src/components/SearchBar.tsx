import { useState, useEffect, useRef } from 'react'
import { useI18n } from '../hooks/useI18n'
import { Product, supabase } from '../lib/supabase'

interface SearchBarProps {
  onProductSelect?: (product: Product) => void
  onSearchResults?: (products: Product[]) => void
  className?: string
}

export default function SearchBar({ onProductSelect, onSearchResults, className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { language, t } = useI18n()
  const searchRef = useRef<HTMLDivElement>(null)

  // 추천 검색어
  const suggestedKeywords = {
    th: [
      'บาธบอม',
      'Bath Bomb',
      'Bubble Bath Bomb',
      'บาธบอมธรรมชาติ',
      'บาธบอมลาเวนเดอร์',
      'บาธบอมโรส',
      'Family Bath Bomb',
      'บาธบอมเด็ก'
    ],
    en: [
      'Bath Bomb',
      'Bubble Bath Bomb', 
      'Bathbomb Thailand',
      'Natural Bath Bomb',
      'Lavender Bath Bomb',
      'Rose Bath Bomb',
      'Family Bath Bomb',
      'Relaxing Bath Bomb'
    ]
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length > 1) {
      const debounceTimer = setTimeout(() => {
        searchProducts(query)
      }, 300)

      return () => clearTimeout(debounceTimer)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  const searchProducts = async (searchQuery: string) => {
    setLoading(true)
    try {
      // Supabase에서 제품 검색 (이름, 설명, 카테고리, 향, 성분에서 검색)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,scent.ilike.%${searchQuery}%,ingredients.ilike.%${searchQuery}%`)
        .limit(8)

      if (error) throw error

      setResults(data || [])
      setIsOpen(data && data.length > 0)
      
      if (onSearchResults) {
        onSearchResults(data || [])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleProductClick = (product: Product) => {
    setQuery(product.name)
    setIsOpen(false)
    if (onProductSelect) {
      onProductSelect(product)
    }
  }

  const handleSuggestedKeywordClick = (keyword: string) => {
    setQuery(keyword)
    searchProducts(keyword)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    if (onSearchResults) {
      onSearchResults([])
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(query.length > 1 && results.length > 0)}
          placeholder={language === 'th' ? 'ค้นหาสินค้า...' : 'Search products...'}
          className="w-full px-4 py-3 pl-12 pr-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/30"
        />
        
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear Button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">
                  {language === 'th' ? 'ผลการค้นหา' : 'Search Results'} ({results.length})
                </span>
              </div>
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                      {product.category && `${product.category} • `}
                      ฿{product.price.toLocaleString()}
                    </p>
                  </div>
                  {product.stock_quantity <= 5 && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      {product.stock_quantity === 0 
                        ? (language === 'th' ? 'หมด' : 'Out') 
                        : `${product.stock_quantity} ${language === 'th' ? 'ชิ้น' : 'left'}`
                      }
                    </span>
                  )}
                </button>
              ))}
            </>
          ) : query.length > 1 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>{language === 'th' ? 'ไม่พบสินค้าที่ต้องการ' : 'No products found'}</p>
              <p className="text-sm mt-1">
                {language === 'th' ? 'ลองค้นหาด้วยคำอื่น' : 'Try different keywords'}
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Suggested Keywords (when no query) */}
      {!query && !isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <p className="text-white/80 text-sm mb-2">
              {language === 'th' ? 'คำค้นหายอดนิยม:' : 'Popular searches:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedKeywords[language].slice(0, 6).map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedKeywordClick(keyword)}
                  className="px-3 py-1 bg-white/20 text-white text-sm rounded-full hover:bg-white/30 transition-colors"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
