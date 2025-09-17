import React, { useState, useEffect } from "react";

// 간단한 메인 페이지 컴포넌트
function MainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-white">
              🛁 Daddy Bath Bomb
            </div>
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="text-white hover:text-pink-300 transition-colors">หน้าแรก</a>
              <a href="#products" className="text-white hover:text-pink-300 transition-colors">สินค้า</a>
              <a href="#about" className="text-white hover:text-pink-300 transition-colors">เกี่ยวกับเรา</a>
              <a href="#contact" className="text-white hover:text-pink-300 transition-colors">ติดต่อเรา</a>
            </nav>
            <div className="flex items-center space-x-4">
              <select className="bg-transparent text-white border border-white/20 rounded-lg px-3 py-1 text-sm">
                <option value="th" className="bg-gray-800">🇹🇭 ไทย</option>
                <option value="en" className="bg-gray-800">🇺🇸 English</option>
              </select>
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-colors">
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Daddy Bath Bomb
            </span>
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl">บาธบอมพรีเมียม</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            สัมผัสประสบการณ์อาบน้ำสุดพิเศษด้วยบาธบอมธรรมชาติ 100%
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-2xl">
              ช้อปเลย!
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-md border border-white/30">
              เรียนรู้เพิ่มเติม
            </button>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-2">🌿</div>
              <h3 className="font-semibold mb-1">ธรรมชาติ 100%</h3>
              <p className="text-blue-100 text-sm">วัตถุดิบธรรมชาติ</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🚚</div>
              <h3 className="font-semibold mb-1">ส่งฟรี</h3>
              <p className="text-blue-100 text-sm">ทั่วประเทศไทย</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <h3 className="font-semibold mb-1">LINE Chat</h3>
              <p className="text-blue-100 text-sm">ปรึกษาได้ตลอด</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">สินค้าของเรา</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              บาธบอมคุณภาพสูงหลากหลายกลิ่น
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[
              {
                name: 'บาธบอมลาเวนเดอร์',
                price: '150',
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
                category: 'ผ่อนคลาย'
              },
              {
                name: 'บาธบอมโรส',
                price: '180',
                image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
                category: 'โรแมนติก'
              },
              {
                name: 'บาธบอมยูคาลิปตัส',
                price: '160',
                image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
                category: 'สดชื่น'
              },
              {
                name: 'บาธบอมวานิลลา',
                price: '170',
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
                category: 'หวานหอม'
              }
            ].map((product, index) => (
              <div key={index} className="group bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-pink-500/80 text-white px-2 py-1 rounded-full text-xs">
                    {product.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <div className="text-2xl font-bold text-pink-300 mb-4">
                    ฿{product.price}
                  </div>
                  <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all font-medium shadow-lg">
                    ใส่ตะกร้า
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">ทำไมต้องเลือกเรา?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🌿', title: 'วัตถุดิบธรรมชาติ', desc: 'ผลิตจากส่วนผสมธรรมชาติ 100%' },
              { icon: '✨', title: 'ฟองฟู่สีสวย', desc: 'ฟองฟู่สีสันสวยงาม พร้อมกลิ่นหอม' },
              { icon: '💧', title: 'บำรุงผิว', desc: 'เติมความชุ่มชื้นให้ผิวนุ่มเนียน' },
              { icon: '🎁', title: 'ของขวัญสุดพิเศษ', desc: 'เหมาะสำหรับมอบให้คนพิเศษ' }
            ].map((feature, index) => (
              <div key={index} className="group bg-white/10 backdrop-blur-md rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
                <div className="text-6xl mb-6 text-center group-hover:animate-bounce">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">{feature.title}</h3>
                <p className="text-blue-100 text-center">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">ติดต่อเรา</h2>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-white font-semibold mb-2">LINE Official</h3>
                <p className="text-blue-100">@daddybathbomb</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-white font-semibold mb-2">อีเมล</h3>
                <p className="text-blue-100">hello@daddybathbomb.com</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🕒</div>
                <h3 className="text-white font-semibold mb-2">เวลาทำการ</h3>
                <p className="text-blue-100">จันทร์-ศุกร์ 9:00-18:00</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-500/20 backdrop-blur-md rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">สั่งซื้อผ่าน LINE Chat</h3>
            <p className="text-white/80 mb-6">เพิ่มเพื่อนและส่งข้อความเพื่อสั่งซื้อสินค้า</p>
            <button 
              onClick={() => window.open('https://line.me/ti/p/@daddybathbomb', '_blank')}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            >
              เปิด LINE Chat
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">🛁 Daddy Bath Bomb</div>
            <p className="text-blue-100 mb-6">
              บาธบอมพรีเมียมจากวัตถุดิบธรรมชาติ 100%
            </p>
            <div className="flex justify-center space-x-6">
              <a href="https://www.facebook.com/daddybathbomb" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="https://www.instagram.com/daddybathbomb" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="https://line.me/ti/p/@daddybathbomb" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white transition-colors">
                LINE
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-blue-100 text-sm">
                © 2024 Daddy Bath Bomb. สงวนลิขสิทธิ์
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return <MainPage />;
}
