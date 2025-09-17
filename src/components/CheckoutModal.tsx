import { useState } from 'react'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function CheckoutModal({ isOpen, onClose, onComplete }: CheckoutModalProps) {
  const { items, totalPrice } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    shipping_name: user?.nickname || '',
    shipping_email: user?.email || '',
    shipping_phone: user?.phone || '',
    shipping_address: '',
    shipping_city: '',
    shipping_province: '',
    shipping_postal_code: '',
    payment_method: 'line_chat',
    notes: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          ...formData,
          shipping_country: 'Thailand'
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      setSuccess(true)
      setTimeout(() => {
        onComplete()
      }, 2000)

    } catch (err: any) {
      setError(err.message || '주문 처리 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">주문 완료!</h2>
          <p className="text-gray-600 mb-4">
            주문이 성공적으로 접수되었습니다.<br />
            결제 안내를 확인해주세요.
          </p>
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-4">
            <p className="font-medium">주문 완료!</p>
            <p className="text-sm mt-1">
              {formData.payment_method === 'line_chat' ? 'LINE으로 연결하여 결제를 진행해주세요' : 
               formData.payment_method === 'qr_pay' ? 'QR Pay로 결제해주세요' : 
               '은행 송금으로 결제해주세요'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">주문하기</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">주문 상품</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-gray-600 ml-2">× {item.quantity}</span>
                  </div>
                  <span className="font-medium">฿{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 text-lg font-bold">
                <span>총 금액:</span>
                <span className="text-pink-600">฿{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">배송 정보 (태국 주소)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input
                  type="text"
                  name="shipping_name"
                  value={formData.shipping_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  name="shipping_email"
                  value={formData.shipping_email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                <input
                  type="tel"
                  name="shipping_phone"
                  value={formData.shipping_phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">도시</label>
                <input
                  type="text"
                  name="shipping_city"
                  value={formData.shipping_city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주/도</label>
                <input
                  type="text"
                  name="shipping_province"
                  value={formData.shipping_province}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">우편번호</label>
                <input
                  type="text"
                  name="shipping_postal_code"
                  value={formData.shipping_postal_code}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
              <input
                type="text"
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="상세 주소를 입력하세요"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">결제 방법</h3>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="payment_method"
                  value="line_chat"
                  checked={formData.payment_method === 'line_chat'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <span className="text-2xl mr-2">💬</span>
                  <div>
                    <div className="font-medium">LINE 채팅 상담</div>
                    <div className="text-sm text-gray-600">실시간 상담 및 맞춤 결제 (추천)</div>
                  </div>
                </div>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="payment_method"
                  value="qr_pay"
                  checked={formData.payment_method === 'qr_pay'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <span className="text-2xl mr-2">📱</span>
                  <div>
                    <div className="font-medium">QR Pay</div>
                    <div className="text-sm text-gray-600">PromptPay 즉시 결제</div>
                  </div>
                </div>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="payment_method"
                  value="bank_transfer"
                  checked={formData.payment_method === 'bank_transfer'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🏦</span>
                  <div>
                    <div className="font-medium">은행 송금</div>
                    <div className="text-sm text-gray-600">계좌 이체</div>
                  </div>
                </div>
              </label>
            </div>
            <div className="mt-2 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-sm">
              주문 완료 후 별도로 결제를 진행해주세요. 결제 완료 후 확인되면 배송이 시작됩니다.
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">주문 메모 (선택사항)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="추가 요청사항이 있으면 입력해주세요"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? '주문 중...' : '주문 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
