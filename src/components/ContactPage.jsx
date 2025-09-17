import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">ติดต่อเรา</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            พร้อมให้บริการและตอบคำถามทุกเรื่องเกี่ยวกับบาธบอมของเรา
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">ช่องทางติดต่อ</h2>
            
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 cursor-pointer transition-all duration-300"
                   onClick={() => window.open('https://line.me/ti/p/@daddybathbomb', '_blank')}>
                <div className="flex items-center gap-4">
                  <div className="text-3xl">💬</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">LINE Official</h3>
                    <p className="text-white/80">@daddybathbomb</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">📧</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">อีเมล</h3>
                    <p className="text-white/80">hello@daddybathbomb.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🕒</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">เวลาทำการ</h3>
                    <p className="text-white/80">จันทร์-ศุกร์ 9:00-18:00 น.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">📍</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">ที่อยู่</h3>
                    <p className="text-white/80">กรุงเทพมหานคร ประเทศไทย</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                onClick={() => window.open('https://line.me/ti/p/@daddybathbomb', '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="text-2xl">💬</span>
                LINE Chat
              </button>
              
              <button
                onClick={() => window.open('mailto:hello@daddybathbomb.com', '_blank')}
                className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="text-2xl">📧</span>
                อีเมล
              </button>
            </div>
          </div>

          {/* Main CTA */}
          <div>
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-3xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">สั่งซื้อผ่าน LINE</h2>
              <div className="text-6xl mb-6">💬</div>
              <p className="text-white/80 mb-8 text-lg">
                วิธีที่ง่ายและรวดเร็วที่สุดในการสั่งซื้อ!<br/>
                ปรึกษา เลือกสินค้า และชำระเงินผ่าน LINE Chat
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-white/90">
                  <span className="text-green-400">✓</span>
                  <span>ปรึกษาแบบเรียลไทม์</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <span className="text-green-400">✓</span>
                  <span>แนะนำสินค้าตามความต้องการ</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <span className="text-green-400">✓</span>
                  <span>ชำระเงินสะดวกปลอดภัย</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <span className="text-green-400">✓</span>
                  <span>ติดตามสถานะการจัดส่ง</span>
                </div>
              </div>

              <button
                onClick={() => window.open('https://line.me/ti/p/@daddybathbomb', '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                💬 เริ่มสนทนาเลย!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
