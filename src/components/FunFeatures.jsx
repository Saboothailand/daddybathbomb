import React, { useState, useEffect } from 'react';

export default function FunFeatures({ language = 'th' }) {
  const [features, setFeatures] = useState([]);

  // 샘플 피처 데이터 (추후 관리자가 수정할 수 있도록)
  const defaultFeatures = [
    {
      id: 1,
      title: 'วัตถุดิบธรรมชาติ',
      description: 'ผลิตจากส่วนผสมธรรมชาติ 100% ปลอดภัยสำหรับทุกสมาชิกในครอบครัว',
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&h=400&fit=crop',
      isActive: true
    },
    {
      id: 2,
      title: 'ฟองฟู่สีสวย',
      description: 'ฟองฟู่สีสันสวยงาม พร้อมกลิ่นหอมที่ผ่อนคลาย',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
      isActive: true
    },
    {
      id: 3,
      title: 'บำรุงผิว',
      description: 'เติมความชุ่มชื้นและบำรุงผิวให้นุ่มเนียนหลังอาบน้ำ',
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=400&fit=crop',
      isActive: true
    },
    {
      id: 4,
      title: 'ของขวัญสุดพิเศษ',
      description: 'ของขวัญที่เหมาะสำหรับคนพิเศษในทุกโอกาส',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop&sig=gift',
      isActive: true
    }
  ];

  useEffect(() => {
    // 추후 Supabase에서 데이터를 가져올 예정
    // 현재는 샘플 데이터 사용
    setFeatures(defaultFeatures);
  }, []);

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
          {features.filter(f => f.isActive).map((feature, index) => (
            <div
              key={feature.id}
              className="group bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Feature Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gray overlay with white text */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/80 to-transparent p-4">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
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
