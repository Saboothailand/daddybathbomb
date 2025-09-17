import React from 'react';

export default function FunFeatures() {
  const features = [
    {
      icon: '🌿',
      title: 'วัตถุดิบธรรมชาติ',
      description: 'ผลิตจากส่วนผสมธรรมชาติ 100% ปลอดภัยสำหรับทุกสมาชิกในครอบครัว'
    },
    {
      icon: '✨',
      title: 'ฟองฟู่สีสวย',
      description: 'ฟองฟู่สีสันสวยงาม พร้อมกลิ่นหอมที่ผ่อนคลาย'
    },
    {
      icon: '💧',
      title: 'บำรุงผิว',
      description: 'เติมความชุ่มชื้นและบำรุงผิวให้นุ่มเนียนหลังอาบน้ำ'
    },
    {
      icon: '🎁',
      title: 'ของขวัญสุดพิเศษ',
      description: 'ของขวัญที่เหมาะสำหรับคนพิเศษในทุกโอกาส'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            ทำไมต้องเลือกเรา?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            ค้นพบเหตุผลที่ทำให้บาธบอมของเราพิเศษกว่าใคร
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/10 backdrop-blur-md rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="text-6xl mb-6 text-center group-hover:animate-bounce">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-blue-100 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              พร้อมสัมผัสประสบการณ์ใหม่?
            </h3>
            <p className="text-white/80 mb-6">
              เปลี่ยนการอาบน้ำธรรมดาให้กลายเป็นช่วงเวลาพิเศษ
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              ช้อปเลย!
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
