import { useI18n } from '../hooks/useI18n'

export default function Footer() {
  const { language, t } = useI18n()

  const handleNavigation = (page: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: page }))
  }

  return (
    <footer className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              🛁 Daddy Bath Bomb
            </div>
            <p className="text-blue-100">
              {language === 'th' 
                ? 'บาธบอมพรีเมียมจากวัตถุดิบธรรมชาติ 100% เพื่อประสบการณ์อาบน้ำสุดพิเศษ'
                : 'Premium bath bombs made from 100% natural ingredients for an exceptional bathing experience'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {language === 'th' ? 'ลิงก์ด่วน' : 'Quick Links'}
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleNavigation('home')}
                className="block text-blue-100 hover:text-white transition-colors"
              >
                {t('home')}
              </button>
              <button
                onClick={() => handleNavigation('about')}
                className="block text-blue-100 hover:text-white transition-colors"
              >
                {t('about')}
              </button>
              <button
                onClick={() => handleNavigation('notice')}
                className="block text-blue-100 hover:text-white transition-colors"
              >
                {language === 'th' ? 'ประกาศ' : 'Notice'}
              </button>
              <button
                onClick={() => handleNavigation('faq')}
                className="block text-blue-100 hover:text-white transition-colors"
              >
                FAQ
              </button>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {language === 'th' ? 'บริการลูกค้า' : 'Customer Service'}
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleNavigation('contact')}
                className="block text-blue-100 hover:text-white transition-colors"
              >
                {t('contact')}
              </button>
              <button
                onClick={() => handleNavigation('faq')}
                className="block text-blue-100 hover:text-white transition-colors"
              >
                {language === 'th' ? 'คำถามที่พบบ่อย' : 'FAQ'}
              </button>
              <a
                href="https://line.me/ti/p/@daddybathbomb"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-100 hover:text-white transition-colors"
              >
                💬 LINE Chat
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {language === 'th' ? 'ติดต่อเรา' : 'Contact Us'}
            </h3>
            <div className="space-y-2 text-blue-100">
              <div className="flex items-center space-x-2">
                <span>📧</span>
                <span>hello@daddybathbomb.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>💬</span>
                <span>@daddybathbomb</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🕒</span>
                <span>
                  {language === 'th' 
                    ? 'จันทร์-ศุกร์ 9:00-18:00 น.'
                    : 'Mon-Fri 9:00-18:00'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-blue-100 text-sm">
            © 2024 Daddy Bath Bomb. {language === 'th' ? 'สงวนลิขสิทธิ์' : 'All rights reserved.'}
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="https://www.facebook.com/daddybathbomb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-100 hover:text-white transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/daddybathbomb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-100 hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://line.me/ti/p/@daddybathbomb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-100 hover:text-white transition-colors"
            >
              LINE
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
