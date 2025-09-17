import React from 'react';

export default function Footer() {
  const handleNavigation = (page) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
  };

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
              บาธบอมพรีเมียมจากวัตถุดิบธรรมชาติ 100% เพื่อประสบการณ์อาบน้ำสุดพิเศษ
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ลิงก์ด่วน</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleNavigation('home')}
                className="block text-blue-100 hover:text-white transition-colors"
              >
                หน้าแรก
              </button>
              <button
                onClick={() => handleNavigation('about')}
                className="block text-blue-100 hover:text-white transition-colors"
              >
                เกี่ยวกับเรา
              </button>
              <button
                onClick={() => handleNavigation('notice')}
                className="block text-blue-100 hover:text-white transition-colors"
              >
                ประกาศ
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
            <h3 className="text-lg font-semibold">บริการลูกค้า</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleNavigation('contact')}
                className="block text-blue-100 hover:text-white transition-colors"
              >
                ติดต่อเรา
              </button>
              <button
                onClick={() => handleNavigation('faq')}
                className="block text-blue-100 hover:text-white transition-colors"
              >
                คำถามที่พบบ่อย
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
            <h3 className="text-lg font-semibold">ติดต่อเรา</h3>
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
                <span>จันทร์-ศุกร์ 9:00-18:00 น.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-blue-100 text-sm">
            © 2024 Daddy Bath Bomb. สงวนลิขสิทธิ์
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
  );
}
