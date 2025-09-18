// @ts-nocheck
import React, { useState } from 'react';
import { addToCart } from '../utils/cart';

export default function ProductModal({ product, isOpen, onClose, onCartUpdate, language = 'th' }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!isOpen || !product) return null;

  const productImages = [
    product.image,
    product.image + '&sig=2',
    product.image + '&sig=3'
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onCartUpdate && onCartUpdate();
    
    // 성공 알림
    alert(language === 'th' 
      ? `เพิ่ม ${product.name} ${quantity} ชิ้น ลงในตะกร้าแล้ว!` 
      : `Added ${quantity} ${product.name} to cart!`
    );
    
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onCartUpdate && onCartUpdate();
    
    // LINE 연결 (실제로는 주문 페이지로 이동)
    alert(language === 'th' 
      ? 'กำลังเชื่อมต่อ LINE เพื่อดำเนินการสั่งซื้อ...' 
      : 'Connecting to LINE for order processing...'
    );
  };

  const texts = {
    th: {
      weight: 'น้ำหนัก:',
      scent: 'กลิน:',
      stock: 'คงเหลือ:',
      quantity: 'จำนวน:',
      addToCart: 'ใส่ตะกร้า',
      buyNow: '💬 สั่งซื้อผ่าน LINE',
      description: 'บาธบอมกลิ่นหอมโรแมนติก สำหรับคืนพิเศษ',
      ingredients: 'น้ำมันหอมระเหย, เบกกิ้งโซดา, กรดซิตริก'
    },
    en: {
      weight: 'Weight:',
      scent: 'Scent:',
      stock: 'Stock:',
      quantity: 'Quantity:',
      addToCart: 'Add to Cart',
      buyNow: '💬 Order via LINE',
      description: 'Romantic scented bath bomb for special nights',
      ingredients: 'Essential oils, Baking soda, Citric acid'
    }
  };

  const t = texts[language] || texts.th;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 rounded-full p-2 transition-colors shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Images */}
            <div className="relative">
              <div className="aspect-square relative overflow-hidden rounded-l-3xl lg:rounded-r-none">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Image Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        selectedImage === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12">
              <div className="mb-6">
                <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {language === 'th' ? 'โรแมนติก' : 'Romantic'}
                </span>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                  {product.name}
                </h1>
                <div className="text-3xl font-bold text-pink-500 mb-6">
                  ฿{product.price}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t.weight}</span>
                  <span className="font-medium">100g</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t.scent}</span>
                  <span className="font-medium">{language === 'th' ? 'กุหลาบ' : 'Rose'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t.stock}</span>
                  <span className="font-medium text-green-600">30 {language === 'th' ? 'ชิ้น' : 'pieces'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t.description}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>{language === 'th' ? 'ส่วนผสม:' : 'Ingredients:'}</strong> {t.ingredients}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t.quantity}
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600 font-medium"
                    >
                      −
                    </button>
                    <div className="px-6 py-3 bg-white font-medium text-lg min-w-[60px] text-center">
                      {quantity}
                    </div>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600 font-medium"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {language === 'th' ? 'รวม:' : 'Total:'} <span className="font-bold text-pink-500">฿{(product.price * quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
                >
                  {t.addToCart}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
                >
                  {t.buyNow}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl mb-2">🚚</div>
                    <div className="text-xs text-gray-600">
                      {language === 'th' ? 'ส่งฟรี' : 'Free Shipping'}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl mb-2">🌿</div>
                    <div className="text-xs text-gray-600">
                      {language === 'th' ? '100% ธรรมชาติ' : '100% Natural'}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl mb-2">💬</div>
                    <div className="text-xs text-gray-600">
                      {language === 'th' ? 'สนับสนุน 24/7' : '24/7 Support'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
