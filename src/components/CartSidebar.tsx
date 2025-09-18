// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { getCart, updateCartItemQuantity, removeFromCart, getCartTotal, getCartItemCount, clearCart } from '../utils/cart';

export default function CartSidebar({ isOpen, onClose, onCheckout, language = 'th' }) {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      loadCartData();
    }
  }, [isOpen]);

  const loadCartData = () => {
    const items = getCart();
    const totalAmount = getCartTotal();
    const count = getCartItemCount();
    
    setCartItems(items);
    setTotal(totalAmount);
    setItemCount(count);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    updateCartItemQuantity(productId, newQuantity);
    loadCartData();
  };

  const handleRemoveItem = (productId) => {
    if (confirm(language === 'th' ? 'ลบสินค้านี้ออกจากตะกร้า?' : 'Remove this item from cart?')) {
      removeFromCart(productId);
      loadCartData();
    }
  };

  const handleClearCart = () => {
    if (confirm(language === 'th' ? 'ลบสินค้าทั้งหมดออกจากตะกร้า?' : 'Clear all items from cart?')) {
      clearCart();
      loadCartData();
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert(language === 'th' ? 'ตะกร้าว่างเปล่า' : 'Cart is empty');
      return;
    }
    onCheckout && onCheckout();
    onClose();
  };

  const texts = {
    th: {
      title: 'ตะกร้าสินค้า',
      empty: 'ตะกร้าว่างเปล่า',
      emptyDesc: 'เริ่มเลือกซื้อสินค้าของเรากันเลย!',
      quantity: 'จำนวน:',
      remove: 'ลบ',
      clearAll: 'ลบทั้งหมด',
      subtotal: 'รวมย่อย',
      shipping: 'ค่าจัดส่ง',
      freeShipping: 'ฟรี',
      total: 'รวมทั้งหมด',
      checkout: 'สั่งซื้อ',
      continueShopping: 'เลือกซื้อต่อ'
    },
    en: {
      title: 'Shopping Cart',
      empty: 'Cart is Empty',
      emptyDesc: 'Start adding some products to your cart!',
      quantity: 'Qty:',
      remove: 'Remove',
      clearAll: 'Clear All',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      freeShipping: 'Free',
      total: 'Total',
      checkout: 'Checkout',
      continueShopping: 'Continue Shopping'
    }
  };

  const t = texts[language] || texts.th;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{t.title}</h2>
              <p className="text-sm text-gray-600">{itemCount} {language === 'th' ? 'รายการ' : 'items'}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 text-gray-300">🛒</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.empty}</h3>
                <p className="text-gray-600 mb-6">{t.emptyDesc}</p>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 font-medium"
                >
                  {t.continueShopping}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">฿{item.price.toLocaleString()}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{t.quantity}</span>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                              >
                                −
                              </button>
                              <span className="px-3 py-1 bg-white font-medium min-w-[40px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            {t.remove}
                          </button>
                        </div>
                        
                        {/* Item Total */}
                        <div className="text-right mt-2">
                          <span className="font-bold text-gray-800">
                            ฿{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Clear All Button */}
                {cartItems.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="w-full text-red-500 hover:text-red-700 text-sm font-medium py-2"
                  >
                    {t.clearAll}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer - Checkout */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t.subtotal}</span>
                  <span>฿{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t.shipping}</span>
                  <span className="text-green-600 font-medium">{t.freeShipping}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t border-gray-300">
                  <span>{t.total}</span>
                  <span>฿{total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
                >
                  {t.checkout}
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  {t.continueShopping}
                </button>
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-xl mb-1">🚚</div>
                  <div className="text-xs text-gray-600">
                    {language === 'th' ? 'ส่งฟรี' : 'Free Ship'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl mb-1">🔒</div>
                  <div className="text-xs text-gray-600">
                    {language === 'th' ? 'ปลอดภัย' : 'Secure'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl mb-1">💬</div>
                  <div className="text-xs text-gray-600">
                    {language === 'th' ? 'สนับสนุน' : 'Support'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
