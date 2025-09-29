import { ADMIN_EMAIL_DISPLAY } from './auth';

// 다국어 번역 데이터
export const translations = {
  th: {
    // Header
    home: 'หน้าแรก',
    about: 'เกี่ยวกับเรา',
    products: 'สินค้า',
    notice: 'ประกาศ',
    faq: 'FAQ',
    contact: 'ติดต่อเรา',
    login: 'เข้าสู่ระบบ',
    
    // Hero
    heroTitle1: 'Premium Bath Bombs',
    heroSubtitle1: 'ธรรมชาติ 100%',
    heroDesc1: 'สัมผัสประสบการณ์อาบน้ำสุดพิเศษด้วยบาธบอมธรรมชาติ',
    heroButton1: 'ดูสินค้า',
    
    heroTitle2: 'Luxury Spa Experience',
    heroSubtitle2: 'ผ่อนคลายที่บ้าน',
    heroDesc2: 'เปลี่ยนบ้านของคุณให้เป็นสปาสุดหรูด้วยกลิ่นหอมบำบัด',
    heroButton2: 'เกี่ยวกับเรา',
    
    heroTitle3: 'Perfect Gift for Loved Ones',
    heroSubtitle3: 'ของขวัญสุดพิเศษ',
    heroDesc3: 'มอบความสุขและผ่อนคลายให้คนที่คุณรักด้วย Daddy Bath Bomb',
    heroButton3: 'ติดต่อเรา',
    
    // Features
    featuresTitle: 'ทำไมต้องเลือกเรา?',
    featuresSubtitle: 'ค้นพบเหตุผลที่ทำให้บาธบอมของเราพิเศษกว่าใคร',
    
    // Notice Page
    noticePageTitle: 'ประกาศ & ข่าวสาร',
    noticePageSubtitle: 'ข่าวสารและประกาศสำคัญจากร้าน Daddy Bath Bomb',
    readMore: 'อ่านเพิ่มเติม',
    backToNotices: 'กลับไปยังประกาศ',
    
    // Contact
    contactQuestion: 'มีคำถาม?',
    contactDesc: 'ติดต่อทีมงานของเราผ่าน LINE Chat เพื่อความช่วยเหลือแบบเรียลไทม์',
    contactButton: '💬 ติดต่อเรา',
    
    // Auth Modal
    loginTitle: 'เข้าสู่ระบบ',
    signupTitle: 'สมัครสมาชิก',
    email: 'อีเมล',
    password: 'รหัสผ่าน',
    nickname: 'ชื่อเล่น',
    phone: 'เบอร์โทรศัพท์',
    loginButton: 'เข้าสู่ระบบ',
    signupButton: 'สมัครสมาชิก',
    noAccount: 'ยังไม่มีบัญชี?',
    hasAccount: 'มีบัญชีแล้ว?',
    adminHint: `ใช้ ${ADMIN_EMAIL_DISPLAY} สำหรับการเข้าถึงผู้ดูแลระบบ`
  },
  
  en: {
    // Header
    home: 'Home',
    about: 'About Us',
    products: 'Products',
    notice: 'Notice',
    faq: 'FAQ',
    contact: 'Contact',
    login: 'Login',
    
    // Hero
    heroTitle1: 'Premium Bath Bombs',
    heroSubtitle1: '100% Natural',
    heroDesc1: 'Experience the ultimate bathing experience with natural bath bombs',
    heroButton1: 'View Products',
    
    heroTitle2: 'Luxury Spa Experience',
    heroSubtitle2: 'Relax at Home',
    heroDesc2: 'Transform your home into a luxury spa with aromatherapy scents',
    heroButton2: 'About Us',
    
    heroTitle3: 'Perfect Gift for Loved Ones',
    heroSubtitle3: 'Special Gift',
    heroDesc3: 'Give happiness and relaxation to your loved ones with Daddy Bath Bomb',
    heroButton3: 'Contact Us',
    
    // Features
    featuresTitle: 'Why Choose Us?',
    featuresSubtitle: 'Discover what makes our bath bombs special',
    
    // Notice Page
    noticePageTitle: 'Notice & News',
    noticePageSubtitle: 'Important news and announcements from Daddy Bath Bomb',
    readMore: 'Read More',
    backToNotices: 'Back to Notices',
    
    // Contact
    contactQuestion: 'Have Questions?',
    contactDesc: 'Contact our team via LINE Chat for real-time assistance',
    contactButton: '💬 Contact Us',
    
    // Auth Modal
    loginTitle: 'Login',
    signupTitle: 'Sign Up',
    email: 'Email',
    password: 'Password',
    nickname: 'Nickname',
    phone: 'Phone Number',
    loginButton: 'Login',
    signupButton: 'Sign Up',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    adminHint: `Use ${ADMIN_EMAIL_DISPLAY} for admin access`
  }
};

// 번역 함수
export const t = (key, language = 'th') => {
  return translations[language]?.[key] || translations.th[key] || key;
};
