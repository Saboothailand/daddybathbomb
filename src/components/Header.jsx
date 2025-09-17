import React, { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import CartSidebar from './CartSidebar';
import OrderForm from './OrderForm';
import { t } from '../utils/translations';
import { getCartItemCount } from '../utils/cart';
import { brandingService } from '../lib/supabase';

export default function Header({ navigateTo, language, changeLanguage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [branding, setBranding] = useState({
    logo_url: '',
    site_title: 'Daddy Bath Bomb',
    primary_color: '#ec4899'
  });

  // 브랜딩 설정 로드
  useEffect(() => {
    const loadBranding = async () => {
      try {
        const brandingData = await brandingService.getBrandingSettings();
        setBranding(brandingData);
      } catch (error) {
        console.error('Error loading branding:', error);
      }
    };
    
    loadBranding();
  }, []);

  // 장바구니 아이템 수 업데이트
  useEffect(() => {
    const updateCartCount = () => {
      setCartItemCount(getCartItemCount());
    };
    
    updateCartCount();
    
    // 장바구니 변경 이벤트 리스너
    window.addEventListener('cartUpdated', updateCartCount);
    
    // 브랜딩 업데이트 이벤트 리스너
    const handleBrandingUpdate = () => {
      loadBranding();
    };
    window.addEventListener('brandingUpdated', handleBrandingUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('brandingUpdated', handleBrandingUpdate);
    };
  }, []);

  const handleNavigation = (page) => {
    if (navigateTo) {
      navigateTo(page);
    } else {
      window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
    }
    setIsMenuOpen(false);
  };

  // 로고를 5번 클릭하면 관리자 페이지로 이동
  const handleLogoClick = () => {
    setAdminClicks(prev => {
      const newCount = prev + 1;
      console.log(`Logo clicked ${newCount} times`);
      
      if (newCount >= 5) {
        console.log('🔑 Admin access activated!');
        alert('관리자 페이지로 이동합니다!');
        handleNavigation('admin');
        window.location.hash = '#admin';
        setAdminClicks(0);
        return 0;
      }
      return newCount;
    });
    
    // 3초 후 카운트 리셋
    setTimeout(() => {
      setAdminClicks(0);
      console.log('Admin click counter reset');
    }, 3000);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - 5번 클릭하면 관리자 페이지 */}
          <div 
            className="flex items-center cursor-pointer relative"
            onClick={handleLogoClick}
            title={adminClicks > 0 ? `관리자 접근: ${adminClicks}/5` : "홈으로 이동"}
          >
            {branding.logo_url ? (
              <img 
                src={branding.logo_url} 
                alt={branding.site_title || 'Daddy Bath Bomb'}
                className="h-8 w-auto max-w-[200px] object-contain"
              />
            ) : (
              <div className="text-2xl font-bold text-white">
                🛁 {branding.site_title || 'Daddy Bath Bomb'}
              </div>
            )}
            {adminClicks > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {adminClicks}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => {
                console.log('Home clicked');
                handleNavigation('home');
              }}
              className="text-white hover:text-pink-300 transition-colors cursor-pointer"
            >
              {t('home', language)}
            </button>
            <button
              onClick={() => {
                console.log('About clicked');
                handleNavigation('about');
              }}
              className="text-white hover:text-pink-300 transition-colors cursor-pointer"
            >
              {t('about', language)}
            </button>
            <button
              onClick={() => {
                console.log('Notice clicked');
                handleNavigation('notice');
              }}
              className="text-white hover:text-pink-300 transition-colors cursor-pointer"
            >
              {t('notice', language)}
            </button>
            <button
              onClick={() => {
                console.log('FAQ clicked');
                handleNavigation('faq');
              }}
              className="text-white hover:text-pink-300 transition-colors cursor-pointer"
            >
              {t('faq', language)}
            </button>
            <button
              onClick={() => {
                console.log('Contact clicked');
                handleNavigation('contact');
              }}
              className="text-white hover:text-pink-300 transition-colors cursor-pointer"
            >
              ติดต่อเรา
            </button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <select 
              value={language}
              onChange={(e) => {
                console.log('Language changing to:', e.target.value);
                if (changeLanguage) {
                  changeLanguage(e.target.value);
                }
              }}
              className="bg-transparent text-white border border-white/20 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
            >
              <option value="th" className="bg-gray-800 text-white">🇹🇭 ไทย</option>
              <option value="en" className="bg-gray-800 text-white">🇺🇸 English</option>
            </select>

            {/* Cart */}
                <button 
                  onClick={() => setShowCart(true)}
                  className="relative text-white hover:text-pink-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h12" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {cartItemCount}
                    </span>
                  )}
                </button>

            {/* Login Button */}
            <button 
              onClick={() => {
                console.log('Login button clicked');
                setShowAuth(true);
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              {language === 'th' ? 'เข้าสู่ระบบ' : 'Login'}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/40 backdrop-blur-md border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => handleNavigation('home')}
                className="block w-full text-left px-3 py-2 text-white hover:text-pink-300 transition-colors"
              >
                หน้าแรก
              </button>
              <button
                onClick={() => handleNavigation('about')}
                className="block w-full text-left px-3 py-2 text-white hover:text-pink-300 transition-colors"
              >
                เกี่ยวกับเรา
              </button>
              <button
                onClick={() => handleNavigation('notice')}
                className="block w-full text-left px-3 py-2 text-white hover:text-pink-300 transition-colors"
              >
                ประกาศ
              </button>
              <button
                onClick={() => handleNavigation('faq')}
                className="block w-full text-left px-3 py-2 text-white hover:text-pink-300 transition-colors"
              >
                FAQ
              </button>
              <button
                onClick={() => handleNavigation('contact')}
                className="block w-full text-left px-3 py-2 text-white hover:text-pink-300 transition-colors"
              >
                ติดต่อเรา
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        language={language}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={() => {
          setShowCart(false);
          setShowOrderForm(true);
        }}
        language={language}
      />

      {/* Order Form */}
      <OrderForm
        isOpen={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        onOrderComplete={(order) => {
          console.log('Order completed:', order);
          setCartItemCount(0); // 장바구니 비워짐
          // 장바구니 업데이트 이벤트 발생
          window.dispatchEvent(new CustomEvent('cartUpdated'));
        }}
        language={language}
      />
    </header>
  );
}
