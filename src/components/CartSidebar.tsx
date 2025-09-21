import React from 'react';
import type { LanguageKey } from '../App';
import { X, ShoppingCart } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageKey;
}

export default function CartSidebar({ isOpen, onClose, language }: CartSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-[#0B0F1A] to-[#1a1f2e] z-50 transform transition-transform duration-300 comic-border border-l-4 border-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-[#FF2D55]" />
            <h2 className="font-fredoka text-xl font-bold text-white">
              {language === "th" ? "ตะกร้าสินค้า" : "Shopping Cart"}
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
        <div className="flex-1 p-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🛒</div>
            <h3 className="font-fredoka text-2xl font-bold text-white mb-4">
              {language === "th" ? "ตะกร้าว่างเปล่า" : "Cart is Empty"}
            </h3>
            <p className="text-[#B8C4DB] text-lg mb-8">
              {language === "th" 
                ? "ยังไม่มีสินค้าในตะกร้าของคุณ" 
                : "You haven't added any items to your cart yet"}
            </p>
            
            <div className="space-y-4">
              <button
                onClick={onClose}
                className="w-full bg-[#FF2D55] hover:bg-[#FF1744] text-white px-6 py-4 rounded-xl font-bold transition-all hover:scale-105 comic-border border-4 border-black"
              >
                {language === "th" ? "เลือกซื้อสินค้า" : "Continue Shopping"}
              </button>
              
              <div className="text-center">
                <p className="text-[#B8C4DB] text-sm">
                  {language === "th" 
                    ? "สินค้าจะพร้อมให้บริการเร็ว ๆ นี้!" 
                    : "Products coming soon!"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-fredoka text-lg font-bold text-white">
              {language === "th" ? "รวมทั้งหมด:" : "Total:"}
            </span>
            <span className="font-fredoka text-xl font-bold text-[#FF2D55]">
              ฿0.00
            </span>
          </div>
          
          <button
            className="w-full bg-gray-600 text-white px-6 py-4 rounded-xl font-bold transition-colors opacity-50 cursor-not-allowed"
            disabled
          >
            {language === "th" ? "ชำระเงิน" : "Checkout"}
          </button>
          
          <p className="text-center text-[#B8C4DB] text-xs mt-2">
            {language === "th" 
              ? "ระบบชำระเงินจะเปิดให้บริการเร็ว ๆ นี้" 
              : "Payment system coming soon"}
          </p>
        </div>
      </div>
    </>
  );
}
