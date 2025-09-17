import { useState } from 'react'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import CheckoutModal from './CheckoutModal'
import AuthModal from './AuthModal'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [showCheckout, setShowCheckout] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  const handleCheckout = () => {
    if (!user) {
      setShowAuth(true)
      return
    }
    setShowCheckout(true)
  }

  const handleCheckoutComplete = () => {
    clearCart()
    setShowCheckout(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">장바구니</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-600 text-lg">장바구니가 비어있습니다</p>
                <button
                  onClick={onClose}
                  className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  쇼핑 계속하기
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      {item.product.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                        <p className="text-pink-600 font-medium">
                          ฿{item.product.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ฿{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-500 hover:text-red-700 text-sm mt-1"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-semibold">총 금액:</span>
                    <span className="text-2xl font-bold text-pink-600">
                      ฿{totalPrice.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => clearCart()}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      장바구니 비우기
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="flex-1 bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors font-medium"
                    >
                      주문하기
                    </button>
                  </div>
                  
                  {!user && (
                    <p className="text-center text-gray-600 text-sm mt-3">
                      주문하려면 로그인이 필요합니다
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialMode="login"
      />

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onComplete={handleCheckoutComplete}
      />
    </>
  )
}
