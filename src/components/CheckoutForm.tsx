import React, { useState } from 'react';
import type { LanguageKey } from '../App';
import { X } from 'lucide-react';

interface CheckoutFormProps {
  onOrderComplete: () => void;
  onClose: () => void;
  language: LanguageKey;
}

export default function CheckoutForm({ onOrderComplete, onClose, language }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 주문 처리 시뮬레이션
    setTimeout(() => {
      setLoading(false);
      onOrderComplete();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#0B0F1A] to-[#1a1f2e] rounded-2xl comic-border border-4 border-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="font-fredoka text-2xl font-bold text-white">
            {language === "th" ? "สั่งซื้อสินค้า" : "Checkout"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#FF2D55] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="font-fredoka text-2xl font-bold text-white mb-4">
              {language === "th" ? "เร็ว ๆ นี้!" : "Coming Soon!"}
            </h3>
            <p className="text-[#B8C4DB] text-lg">
              {language === "th" 
                ? "ระบบสั่งซื้อของเรากำลังอยู่ในระหว่างการพัฒนา" 
                : "Our ordering system is currently under development"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  {language === "th" ? "ชื่อ" : "First Name"}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-[#151B2E] border border-white/20 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                  placeholder={language === "th" ? "ชื่อของคุณ" : "Your first name"}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  {language === "th" ? "นามสกุล" : "Last Name"}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-[#151B2E] border border-white/20 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                  placeholder={language === "th" ? "นามสกุลของคุณ" : "Your last name"}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                {language === "th" ? "อีเมล" : "Email"}
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-[#151B2E] border border-white/20 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                placeholder={language === "th" ? "อีเมลของคุณ" : "Your email"}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                {language === "th" ? "เบอร์โทรศัพท์" : "Phone Number"}
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 bg-[#151B2E] border border-white/20 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                placeholder={language === "th" ? "เบอร์โทรศัพท์ของคุณ" : "Your phone number"}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                {language === "th" ? "ที่อยู่" : "Address"}
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 bg-[#151B2E] border border-white/20 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D55] resize-none"
                placeholder={language === "th" ? "ที่อยู่สำหรับจัดส่ง" : "Shipping address"}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                disabled={loading}
              >
                {language === "th" ? "ยกเลิก" : "Cancel"}
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#FF2D55] hover:bg-[#FF1744] text-white px-6 py-3 rounded-xl font-bold transition-colors comic-border border-4 border-black disabled:opacity-50"
                disabled={loading}
              >
                {loading 
                  ? (language === "th" ? "กำลังดำเนินการ..." : "Processing...") 
                  : (language === "th" ? "สั่งซื้อ" : "Place Order")
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
