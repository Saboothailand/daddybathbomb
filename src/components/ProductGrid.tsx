import { useState, useEffect } from 'react'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { Product, supabase } from '../lib/supabase'
import ProductDetail from './ProductDetail'
import AuthModal from './AuthModal'

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  
  const { addItem } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAdd = (product: Product) => {
    if (!user) {
      setShowAuth(true)
      return
    }
    addItem(product, 1)
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">제품 로딩 중...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">프리미엄 배스밤 컬렉션</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              천연 재료로 만든 최고급 배스밤으로 특별한 목욕 시간을 경험하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image_url || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Stock Badge */}
                  {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      재고 {product.stock_quantity}개
                    </div>
                  )}
                  
                  {product.stock_quantity === 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      품절
                    </div>
                  )}

                  {/* Category Badge */}
                  {product.category && (
                    <div className="absolute top-4 right-4 bg-pink-500/80 text-white px-2 py-1 rounded-full text-xs">
                      {product.category}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setSelectedProductId(product.id)}
                      className="bg-white text-gray-800 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium"
                    >
                      상세보기
                    </button>
                    
                    {product.stock_quantity > 0 && (
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors font-medium"
                      >
                        장바구니
                      </button>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                    {product.name}
                  </h3>
                  
                  {product.description && (
                    <p className="text-blue-100 text-sm mb-4 line-clamp-2">
                      {product.description.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-pink-300">
                      ฿{product.price.toLocaleString()}
                    </div>
                    
                    {product.weight && (
                      <div className="text-blue-200 text-sm">
                        {product.weight}
                      </div>
                    )}
                  </div>

                  {/* Product Features */}
                  <div className="space-y-2 mb-4">
                    {product.scent && (
                      <div className="flex items-center gap-2 text-blue-100 text-sm">
                        <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                        향: {product.scent}
                      </div>
                    )}
                    
                    {product.ingredients && (
                      <div className="flex items-center gap-2 text-blue-100 text-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        천연 성분
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedProductId(product.id)}
                      className="w-full bg-white/20 text-white py-3 rounded-2xl hover:bg-white/30 transition-colors font-medium backdrop-blur-sm"
                    >
                      상세보기
                    </button>
                    
                    {product.stock_quantity > 0 ? (
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all font-medium shadow-lg"
                      >
                        장바구니에 추가
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-400 text-gray-200 py-3 rounded-2xl cursor-not-allowed font-medium"
                      >
                        품절
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🛁</div>
              <h3 className="text-2xl font-bold text-white mb-4">제품을 준비 중입니다</h3>
              <p className="text-blue-100">곧 멋진 배스밤들을 만나보실 수 있습니다!</p>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProductId && (
        <ProductDetail
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialMode="login"
      />
    </>
  )
}
