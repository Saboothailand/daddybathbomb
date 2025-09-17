import { useState, useEffect } from 'react'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useI18n } from '../hooks/useI18n'
import { Product, supabase } from '../lib/supabase'
import SEOHead, { createProductStructuredData } from './SEOHead'
import AuthModal from './AuthModal'

interface ProductDetailProps {
  productId: string
  onClose: () => void
}

export default function ProductDetail({ productId, onClose }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description')
  
  const { addItem } = useCart()
  const { user } = useAuth()
  const { language, t, formatPrice } = useI18n()

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('is_active', true)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      setShowAuth(true)
      return
    }
    
    if (product) {
      addItem(product, quantity)
      // 성공 피드백
      const button = document.querySelector('.add-to-cart-btn')
      if (button) {
        button.textContent = '장바구니에 추가됨! ✓'
        setTimeout(() => {
          button.textContent = '장바구니에 추가'
        }, 2000)
      }
    }
  }

  const handleBuyNow = () => {
    if (!user) {
      setShowAuth(true)
      return
    }
    
    if (product) {
      addItem(product, quantity)
      // 장바구니로 이동하는 이벤트 발생
      window.dispatchEvent(new CustomEvent('openCart'))
      onClose()
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">제품 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-gray-600 mb-4">제품을 찾을 수 없습니다.</p>
          <button
            onClick={onClose}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
          >
            닫기
          </button>
        </div>
      </div>
    )
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image_url 
    ? [product.image_url] 
    : ['/placeholder-product.jpg']

  // SEO 데이터 생성
  const seoTitle = `${product.name} - Bath Bomb Thailand | Daddy Bath Bomb`
  const seoDescription = `${product.description?.replace(/<[^>]*>/g, '').substring(0, 150) || 'Premium bath bomb'} ฿${product.price} - Natural ingredients, ${product.scent || 'amazing scent'}, ${product.weight || '100g'}. Free shipping in Thailand.`
  const seoKeywords = [
    product.name,
    'Bath Bomb',
    'Bubble Bath Bomb',
    'Bathbomb Thailand',
    product.category || 'Bath Products',
    product.scent || 'Scented Bath Bomb',
    'Natural Bath Bomb',
    'Premium Bath Bomb'
  ]

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        ogImage={product.image_url}
        structuredData={createProductStructuredData(product, language)}
      />
      
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index 
                            ? 'border-pink-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Price and Stock */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold text-pink-600">
                      ฿{product.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      재고: {product.stock_quantity}개
                    </div>
                  </div>
                  
                  {product.category && (
                    <div className="inline-block bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                      {product.category}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  {product.weight && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium">무게:</span>
                      <span className="text-gray-800">{product.weight}</span>
                    </div>
                  )}
                  
                  {product.scent && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium">향:</span>
                      <span className="text-gray-800">{product.scent}</span>
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-4 mb-6">
                    <label className="text-gray-700 font-medium">수량:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 min-w-[60px] text-center border-x border-gray-300">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                        disabled={quantity >= product.stock_quantity}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock_quantity === 0}
                      className="add-to-cart-btn w-full bg-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {product.stock_quantity === 0 ? '품절' : '장바구니에 추가'}
                    </button>
                    
                    <button
                      onClick={handleBuyNow}
                      disabled={product.stock_quantity === 0}
                      className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {product.stock_quantity === 0 ? '품절' : '바로 구매'}
                    </button>
                  </div>

                  {!user && (
                    <p className="text-center text-gray-600 text-sm mt-3">
                      구매하려면 로그인이 필요합니다
                    </p>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-green-500">✓</span>
                      무료배송 (1000바트 이상)
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-green-500">✓</span>
                      천연 재료 사용
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-green-500">✓</span>
                      안전한 결제
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-green-500">✓</span>
                      빠른 배송
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="mt-12">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    { id: 'description', label: '상품설명' },
                    { id: 'ingredients', label: '성분정보' },
                    { id: 'reviews', label: '리뷰' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-pink-500 text-pink-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="py-8">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    {product.description ? (
                      <div 
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    ) : (
                      <div className="text-gray-700 leading-relaxed">
                        <h3 className="text-xl font-semibold mb-4">프리미엄 배스밤</h3>
                        <p className="mb-4">
                          천연 재료로 만든 고품질 배스밤으로, 편안하고 향긋한 목욕 시간을 선사합니다.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          <li>천연 오일과 에센셜 오일 사용</li>
                          <li>피부에 자극이 적은 순한 성분</li>
                          <li>오래 지속되는 향기</li>
                          <li>보습 효과로 부드러운 피부</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'ingredients' && (
                  <div className="text-gray-700">
                    <h3 className="text-xl font-semibold mb-4">성분 정보</h3>
                    {product.ingredients ? (
                      <p className="leading-relaxed">{product.ingredients}</p>
                    ) : (
                      <div className="space-y-4">
                        <p>주요 성분:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          <li>베이킹소다 (Sodium Bicarbonate)</li>
                          <li>구연산 (Citric Acid)</li>
                          <li>천연 에센셜 오일</li>
                          <li>코코넛 오일</li>
                          <li>시어버터</li>
                        </ul>
                        <p className="text-sm text-gray-500 mt-4">
                          * 민감한 피부를 가진 분은 사용 전 패치 테스트를 권장합니다.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="text-gray-700">
                    <h3 className="text-xl font-semibold mb-4">고객 리뷰</h3>
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <p className="text-gray-500 mb-4">아직 리뷰가 없습니다.</p>
                      <p className="text-sm text-gray-400">
                        첫 번째 리뷰를 남겨보세요!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialMode="login"
      />
    </>
  )
}
