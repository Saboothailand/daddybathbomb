import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase, Product, Content, Order, OrderItem, InstagramPost } from '../lib/supabase'

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState<'products' | 'content' | 'orders' | 'instagram'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [content, setContent] = useState<Content[]>([])
  const [orders, setOrders] = useState<(Order & { order_items: (OrderItem & { product: Product })[] })[]>([])
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin, activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      switch (activeTab) {
        case 'products':
          await fetchProducts()
          break
        case 'content':
          await fetchContent()
          break
        case 'orders':
          await fetchOrders()
          break
        case 'instagram':
          await fetchInstagramPosts()
          break
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    setProducts(data || [])
  }

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    setContent(data || [])
  }

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    setOrders(data || [])
  }

  const fetchInstagramPosts = async () => {
    const { data, error } = await supabase
      .from('instagram_posts')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    setInstagramPosts(data || [])
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error
      await fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const toggleProductActive = async (productId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !isActive })
        .eq('id', productId)

      if (error) throw error
      await fetchProducts()
    } catch (error) {
      console.error('Error updating product status:', error)
    }
  }

  const toggleContentActive = async (contentId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('content')
        .update({ is_active: !isActive })
        .eq('id', contentId)

      if (error) throw error
      await fetchContent()
    } catch (error) {
      console.error('Error updating content status:', error)
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600">관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">안녕하세요, {user?.nickname}님</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'products', label: '제품 관리', icon: '📦' },
              { id: 'content', label: '콘텐츠 관리', icon: '📝' },
              { id: 'orders', label: '주문 관리', icon: '🛒' },
              { id: 'instagram', label: 'Instagram 관리', icon: '📸' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        ) : (
          <>
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">제품 관리</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제품명</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가격</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">재고</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {product.image_url && (
                                <img className="h-10 w-10 rounded-full mr-4" src={product.image_url} alt="" />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ฿{product.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stock_quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.is_active ? '활성' : '비활성'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => toggleProductActive(product.id, product.is_active)}
                              className={`${
                                product.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {product.is_active ? '비활성화' : '활성화'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">콘텐츠 관리</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">타입</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">순서</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {content.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.content_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.order_index}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item.is_active ? '활성' : '비활성'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => toggleContentActive(item.id, item.is_active)}
                              className={`${
                                item.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {item.is_active ? '비활성화' : '활성화'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">주문 관리</h2>
                </div>
                <div className="space-y-4 p-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">주문 #{order.id.slice(0, 8)}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString('ko-KR')}
                          </p>
                          <p className="text-sm text-gray-600">
                            고객: {order.shipping_name} ({order.shipping_email})
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">฿{order.total_amount.toLocaleString()}</p>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="mt-1 text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">대기중</option>
                            <option value="confirmed">확인됨</option>
                            <option value="processing">처리중</option>
                            <option value="shipped">배송중</option>
                            <option value="delivered">배송완료</option>
                            <option value="cancelled">취소됨</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium mb-2">배송 정보</h4>
                          <p className="text-sm text-gray-600">
                            {order.shipping_address}<br />
                            {order.shipping_city}, {order.shipping_province} {order.shipping_postal_code}<br />
                            {order.shipping_country}<br />
                            전화: {order.shipping_phone}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">결제 정보</h4>
                          <p className="text-sm text-gray-600">
                            결제 방법: {order.payment_method === 'qr_pay' ? 'QR Pay' : '은행 송금'}<br />
                            결제 상태: {order.payment_status}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">주문 상품</h4>
                        <div className="space-y-2">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                              <span>{item.product?.name} × {item.quantity}</span>
                              <span>฿{item.total_price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-medium mb-2">주문 메모</h4>
                          <p className="text-sm text-gray-600">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instagram Tab */}
            {activeTab === 'instagram' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Instagram 갤러리 관리</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {instagramPosts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.caption || ''}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-2">{post.caption}</p>
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-1 text-xs rounded ${
                            post.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {post.is_active ? '활성' : '비활성'}
                          </span>
                          <span className="text-xs text-gray-500">순서: {post.order_index}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
