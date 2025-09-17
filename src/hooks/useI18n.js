import React, { useState, useEffect, createContext, useContext } from 'react'

// 다국어 텍스트 정의
const translations = {
  th: {
    // 네비게이션
    home: 'หน้าแรก',
    about: 'เกี่ยวกับเรา',
    products: 'สินค้า',
    contact: 'ติดต่อเรา',
    cart: 'ตะกร้าสินค้า',
    login: 'เข้าสู่ระบบ',
    logout: 'ออกจากระบบ',
    register: 'สมัครสมาชิก',
    admin: 'ผู้ดูแลระบบ',

    // 제품 관련
    'product.name': 'ชื่อสินค้า',
    'product.price': 'ราคา',
    'product.addToCart': 'ใส่ตะกร้า',
    'product.buyNow': 'ซื้อเลย',

    // 일반적인 텍스트
    'common.loading': 'กำลังโหลด...',
    'common.error': 'เกิดข้อผิดพลาด',
    'common.success': 'สำเร็จ',
    'common.cancel': 'ยกเลิก',
    'common.save': 'บันทึก',
    'common.close': 'ปิด',
  },
  
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    products: 'Products',
    contact: 'Contact',
    cart: 'Cart',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    admin: 'Admin',

    // Product related
    'product.name': 'Product Name',
    'product.price': 'Price',
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',

    // Common text
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.close': 'Close',
  }
}

const I18nContext = createContext(undefined)

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export const I18nProvider = ({ children }) => {
  // 태국어를 기본 언어로 설정
  const [language, setLanguage] = useState('th')

  useEffect(() => {
    // 로컬스토리지에서 언어 설정 로드
    const savedLanguage = localStorage.getItem('daddy-bathbomb-language')
    if (savedLanguage && (savedLanguage === 'th' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // 언어 변경 시 로컬스토리지에 저장
    localStorage.setItem('daddy-bathbomb-language', language)
    
    // HTML lang 속성 업데이트
    document.documentElement.lang = language
  }, [language])

  const t = (key) => {
    return translations[language][key] || translations['th'][key] || key
  }

  const formatPrice = (amount, currency = 'THB') => {
    if (language === 'th') {
      return `฿${amount.toLocaleString('th-TH')}`
    } else {
      return `฿${amount.toLocaleString('en-US')}`
    }
  }

  const value = {
    language,
    setLanguage,
    t,
    formatPrice
  }

  return React.createElement(I18nContext.Provider, { value }, children)
}

// 언어 선택 컴포넌트
export const LanguageSelector = () => {
  const { language, setLanguage } = useI18n()

  return React.createElement('div', { className: 'relative' },
    React.createElement('select', {
      value: language,
      onChange: (e) => setLanguage(e.target.value),
      className: 'bg-transparent text-white border border-white/20 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none cursor-pointer'
    },
      React.createElement('option', { value: 'th', className: 'bg-gray-800 text-white' }, '🇹🇭 ไทย'),
      React.createElement('option', { value: 'en', className: 'bg-gray-800 text-white' }, '🇺🇸 English')
    )
  )
}
