import React, { useState } from 'react';
import type { LanguageKey } from '../App';
import { X, Package } from 'lucide-react';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageKey;
}

export default function OrderForm({ isOpen, onClose, language }: OrderFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 주문 처리 시뮬레이션
    setTimeout(() => {
      setLoading(false);
      alert(language === "th" ? "ขอบคุณสำหรับการสนใจ! เราจะติดต่อกลับเร็ว ๆ นี้" : "Thank you for your interest! We'll contact you soon");
      onClose();
      setFormData({ name: '', email: '', phone: '', address: '', message: '' });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#0B0F1A] to-[#1a1f2e] rounded-2xl comic-border border-4 border-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-[#FF2D55]" />
            <h2 className="font-fredoka text-2xl font-bold text-white">
              {language === "th" ? "สั่งซื้อสินค้า" : "Order Products"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#FF2D55] transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="font-fredoka text-2xl font-bold text-white mb-4">
              {language === "th" ? "ได้รับความสนใจแล้ว!" : "We're Interested!"}
            </h3>
            <p className="text-[#B8C4DB] text-lg">
              {language === "th" 
                ? "กรอกข้อมูลด้านล่างเพื่อให้เราติดต่อกลับเกี่ยวกับสินค้า" 
                : "Fill out the form below and we'll contact you about our products"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  {language === "th" ? "ชื่อ-นามสกุล *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#151B2E] border border-white/20 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                  placeholder={language === "th" ? "ชื่อ-นามสกุลของคุณ" : "Your full name"}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  {language === "th" ? "เบอร์โทรศัพท์ *" : "Phone Number *"}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#151B2E] border border-white/20 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                  placeholder={language === "th" ? "เบอร์โทรศัพท์ของคุณ" : "Your phone number"}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                {language === "th" ? "อีเมล *" : "Email *"}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#151B2E] border border-white/20 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                placeholder={language === "th" ? "อีเมลของคุณ" : "Your email"}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                {language === "th" ? "ที่อยู่" : "Address"}
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#151B2E] border border-white/20 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
                placeholder={language === "th" ? "ที่อยู่ของคุณ (ไม่บังคับ)" : "Your address (optional)"}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                {language === "th" ? "ข้อความเพิ่มเติม" : "Additional Message"}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-[#151B2E] border border-white/20 rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D55] resize-none"
                placeholder={language === "th" ? "บอกเราเกี่ยวกับสินค้าที่คุณสนใจ..." : "Tell us about the products you're interested in..."}
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
                  ? (language === "th" ? "กำลังส่ง..." : "Sending...") 
                  : (language === "th" ? "ส่งข้อมูล" : "Send Information")
                }
              </button>
            </div>

            <p className="text-center text-[#94A3B8] text-sm">
              {language === "th" 
                ? "* ข้อมูลที่จำเป็น - เราจะติดต่อกลับภายใน 24 ชั่วโมง" 
                : "* Required fields - We'll contact you within 24 hours"}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
