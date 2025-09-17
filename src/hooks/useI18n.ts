import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

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
    'product.description': 'รายละเอียดสินค้า',
    'product.ingredients': 'ส่วนผสม',
    'product.weight': 'น้ำหนัก',
    'product.scent': 'กลิ่น',
    'product.category': 'หมวดหมู่',
    'product.stock': 'จำนวนในสต็อก',
    'product.outOfStock': 'สินค้าหมด',
    'product.addToCart': 'ใส่ตะกร้า',
    'product.buyNow': 'ซื้อเลย',
    'product.viewDetails': 'ดูรายละเอียด',

    // 장바구니 관련
    'cart.title': 'ตะกร้าสินค้า',
    'cart.empty': 'ตะกร้าสินค้าว่าง',
    'cart.continueShopping': 'ช้อปปิ้งต่อ',
    'cart.quantity': 'จำนวน',
    'cart.total': 'รวมทั้งหมด',
    'cart.checkout': 'ชำระเงิน',
    'cart.clear': 'ล้างตะกร้า',
    'cart.remove': 'ลบ',

    // 주문 관련
    'order.title': 'สั่งซื้อสินค้า',
    'order.summary': 'สรุปการสั่งซื้อ',
    'order.shipping': 'ข้อมูลการจัดส่ง',
    'order.payment': 'การชำระเงิน',
    'order.complete': 'สั่งซื้อเสร็จสิ้น',
    'order.id': 'หมายเลขคำสั่งซื้อ',

    // 배송 정보
    'shipping.name': 'ชื่อผู้รับ',
    'shipping.email': 'อีเมล',
    'shipping.phone': 'เบอร์โทรศัพท์',
    'shipping.address': 'ที่อยู่',
    'shipping.city': 'จังหวัด',
    'shipping.province': 'จังหวัด',
    'shipping.postalCode': 'รหัสไปรษณีย์',
    'shipping.country': 'ประเทศ',

    // 결제 관련
    'payment.method': 'วิธีการชำระเงิน',
    'payment.qrPay': 'QR Pay',
    'payment.bankTransfer': 'โอนเงินผ่านธนาคาร',
    'payment.lineChat': 'LINE Chat',
    'payment.info': 'ข้อมูลการชำระเงิน',
    'payment.instructions': 'วิธีการชำระเงิน',

    // 인증 관련
    'auth.email': 'อีเมล',
    'auth.password': 'รหัสผ่าน',
    'auth.nickname': 'ชื่อเล่น',
    'auth.phone': 'เบอร์โทรศัพท์',
    'auth.loginTitle': 'เข้าสู่ระบบ',
    'auth.registerTitle': 'สมัครสมาชิก',
    'auth.loginButton': 'เข้าสู่ระบบ',
    'auth.registerButton': 'สมัครสมาชิก',
    'auth.noAccount': 'ยังไม่มีบัญชี?',
    'auth.hasAccount': 'มีบัญชีแล้ว?',
    'auth.loginRequired': 'กรุณาเข้าสู่ระบบเพื่อสั่งซื้อ',

    // 일반적인 텍스트
    'common.loading': 'กำลังโหลด...',
    'common.error': 'เกิดข้อผิดพลาด',
    'common.success': 'สำเร็จ',
    'common.cancel': 'ยกเลิก',
    'common.save': 'บันทึก',
    'common.edit': 'แก้ไข',
    'common.delete': 'ลบ',
    'common.confirm': 'ยืนยัน',
    'common.close': 'ปิด',
    'common.yes': 'ใช่',
    'common.no': 'ไม่',

    // 브랜드 관련
    'brand.title': 'Daddy Bath Bomb',
    'brand.subtitle': 'บาธบอมพรีเมียมจากวัตถุดิบธรรมชาติ',
    'brand.description': 'สัมผัสประสบการณ์อาบน้ำสุดพิเศษด้วยบาธบอมคุณภาพสูงที่ทำจากวัตถุดิบธรรมชาติ 100%',

    // LINE 관련
    'line.title': 'LINE Chat สำหรับสั่งซื้อ',
    'line.scanQR': 'สแกน QR Code เพื่อเชื่อมต่อ LINE',
    'line.addFriend': 'เพิ่มเพื่อนใน LINE',
    'line.sendMessage': 'ส่งข้อความ',
    'line.orderInstructions': 'วิธีการสั่งซื้อผ่าน LINE',
    'line.quickMessage': 'ข้อความด่วน (คัดลอกเพื่อใช้งาน)',
    'line.copyMessage': 'คัดลอกข้อความ',

    // 관리자 관련
    'admin.dashboard': 'แดชบอร์ดผู้ดูแลระบบ',
    'admin.products': 'จัดการสินค้า',
    'admin.orders': 'จัดการคำสั่งซื้อ',
    'admin.content': 'จัดการเนื้อหา',
    'admin.users': 'จัดการผู้ใช้',
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
    'product.description': 'Description',
    'product.ingredients': 'Ingredients',
    'product.weight': 'Weight',
    'product.scent': 'Scent',
    'product.category': 'Category',
    'product.stock': 'Stock',
    'product.outOfStock': 'Out of Stock',
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.viewDetails': 'View Details',

    // Cart related
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continueShopping': 'Continue Shopping',
    'cart.quantity': 'Quantity',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.clear': 'Clear Cart',
    'cart.remove': 'Remove',

    // Order related
    'order.title': 'Place Order',
    'order.summary': 'Order Summary',
    'order.shipping': 'Shipping Information',
    'order.payment': 'Payment',
    'order.complete': 'Order Complete',
    'order.id': 'Order ID',

    // Shipping info
    'shipping.name': 'Full Name',
    'shipping.email': 'Email',
    'shipping.phone': 'Phone Number',
    'shipping.address': 'Address',
    'shipping.city': 'City',
    'shipping.province': 'Province',
    'shipping.postalCode': 'Postal Code',
    'shipping.country': 'Country',

    // Payment related
    'payment.method': 'Payment Method',
    'payment.qrPay': 'QR Pay',
    'payment.bankTransfer': 'Bank Transfer',
    'payment.lineChat': 'LINE Chat',
    'payment.info': 'Payment Information',
    'payment.instructions': 'Payment Instructions',

    // Authentication
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.nickname': 'Nickname',
    'auth.phone': 'Phone Number',
    'auth.loginTitle': 'Login',
    'auth.registerTitle': 'Register',
    'auth.loginButton': 'Login',
    'auth.registerButton': 'Register',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.loginRequired': 'Please login to place an order',

    // Common text
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',

    // Brand related
    'brand.title': 'Daddy Bath Bomb',
    'brand.subtitle': 'Premium Bath Bombs from Natural Ingredients',
    'brand.description': 'Experience luxurious bathing with our premium bath bombs made from 100% natural ingredients',

    // LINE related
    'line.title': 'Order via LINE Chat',
    'line.scanQR': 'Scan QR Code to connect LINE',
    'line.addFriend': 'Add Friend on LINE',
    'line.sendMessage': 'Send Message',
    'line.orderInstructions': 'How to Order via LINE',
    'line.quickMessage': 'Quick Message (Copy to use)',
    'line.copyMessage': 'Copy Message',

    // Admin related
    'admin.dashboard': 'Admin Dashboard',
    'admin.products': 'Manage Products',
    'admin.orders': 'Manage Orders',
    'admin.content': 'Manage Content',
    'admin.users': 'Manage Users',
  }
}

type Language = 'th' | 'en'
type TranslationKey = keyof typeof translations['th']

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  formatPrice: (amount: number, currency?: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

interface I18nProviderProps {
  children: ReactNode
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  // 태국어를 기본 언어로 설정
  const [language, setLanguage] = useState<Language>('th')

  useEffect(() => {
    // 로컬스토리지에서 언어 설정 로드
    const savedLanguage = localStorage.getItem('daddy-bathbomb-language') as Language
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

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations['th'][key] || key
  }

  const formatPrice = (amount: number, currency = 'THB'): string => {
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

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// 언어 선택 컴포넌트
export const LanguageSelector = () => {
  const { language, setLanguage } = useI18n()

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-transparent text-white border border-white/20 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none cursor-pointer"
      >
        <option value="th" className="bg-gray-800 text-white">🇹🇭 ไทย</option>
        <option value="en" className="bg-gray-800 text-white">🇺🇸 English</option>
      </select>
    </div>
  )
}
