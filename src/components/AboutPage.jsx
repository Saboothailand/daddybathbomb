import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">เกี่ยวกับเรา</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            ความเป็นมาและปรัชญาของ Daddy Bath Bomb
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Our Story with Image */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12">
                <h2 className="text-3xl font-bold text-white mb-6">เรื่องราวของเรา</h2>
                <div className="text-white/90 space-y-4 leading-relaxed">
                  <p>
                    Daddy Bath Bomb เกิดขึ้นจากความรักในการดูแลตัวเองและครอบครัว 
                    เราเชื่อว่าเวลาอาบน้ำไม่ใช่แค่การทำความสะอาดร่างกาย 
                    แต่เป็นช่วงเวลาแห่งการผ่อนคลายและฟื้นฟูจิตใจ
                  </p>
                  <p>
                    ด้วยความมุ่งมั่นที่จะสร้างผลิตภัณฑ์คุณภาพสูงจากวัตถุดิบธรรมชาติ 
                    เราคัดสรรส่วนผสมอย่างพิถีพิถัน เพื่อให้ทุกคนในครอบครัวได้สัมผัสประสบการณ์อาบน้ำที่พิเศษ
                  </p>
                  <div className="mt-6 flex items-center space-x-4">
                    <div className="text-4xl">🌿</div>
                    <div>
                      <h4 className="text-pink-300 font-semibold">100% ธรรมชาติ</h4>
                      <p className="text-sm text-gray-300">ไม่มีสารเคมีเป็นอันตราย</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=500&fit=crop"
                  alt="Natural Bath Bomb Ingredients"
                  className="w-full h-full object-cover lg:min-h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-medium">วัตถุดิบธรรมชาติคุณภาพสูง</p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Mission with Image */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative order-2 lg:order-1">
                <img
                  src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=500&fit=crop"
                  alt="Luxury Bath Experience"
                  className="w-full h-full object-cover lg:min-h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-medium">ประสบการณ์อาบน้ำสุดหรู</p>
                </div>
              </div>
              <div className="p-8 lg:p-12 order-1 lg:order-2">
                <h2 className="text-3xl font-bold text-white mb-6">พันธกิจของเรา</h2>
                <div className="text-white/90 space-y-4 leading-relaxed">
                  <p>
                    เราตั้งใจที่จะมอบประสบการณ์อาบน้ำสุดพิเศษให้กับทุกครอบครัวในประเทศไทย 
                    ด้วยบาธบอมคุณภาพสูงที่ผลิตจากวัตถุดิบธรรมชาติ 100%
                  </p>
                  <p>
                    เราเชื่อว่าการดูแลตัวเองไม่ควรเป็นความหรูหรา 
                    แต่เป็นสิ่งจำเป็นที่ทุกคนควรได้รับ
                  </p>
                  <div className="mt-6 flex items-center space-x-4">
                    <div className="text-4xl">💎</div>
                    <div>
                      <h4 className="text-pink-300 font-semibold">คุณภาพพรีเมียม</h4>
                      <p className="text-sm text-gray-300">มาตรฐานสากล ผ่านการรับรอง</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Values with Dynamic Cards */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">คุณค่าของเรา</h2>
              <p className="text-gray-300">สิ่งที่ทำให้เราแตกต่างและพิเศษ</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: '🌿',
                  title: 'ธรรมชาติ',
                  desc: 'ใช้วัตถุดิบธรรมชาติ 100% ปลอดภัยสำหรับทุกคนในครอบครัว',
                  image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop',
                  color: 'from-green-500/20 to-emerald-500/20'
                },
                {
                  icon: '💎',
                  title: 'คุณภาพ',
                  desc: 'ผลิตด้วยมาตรฐานสูง ผ่านการทดสอบคุณภาพอย่างเข้มงวด',
                  image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&sig=2',
                  color: 'from-blue-500/20 to-cyan-500/20'
                },
                {
                  icon: '❤️',
                  title: 'ใส่ใจ',
                  desc: 'ใส่ใจในทุกรายละเอียด เพื่อประสบการณ์ที่ดีที่สุด',
                  image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop&sig=3',
                  color: 'from-pink-500/20 to-rose-500/20'
                },
                {
                  icon: '🌟',
                  title: 'นวัตกรรม',
                  desc: 'พัฒนาผลิตภัณฑ์ใหม่อย่างต่อเนื่อง เพื่อตอบสนองความต้องการ',
                  image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&sig=4',
                  color: 'from-purple-500/20 to-violet-500/20'
                }
              ].map((value, index) => (
                <div key={index} className={`group bg-gradient-to-br ${value.color} backdrop-blur-md rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500`}>
                  <div className="relative">
                    <img
                      src={value.image}
                      alt={value.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute top-6 left-6">
                      <div className="text-5xl mb-2">{value.icon}</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Production Process */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">กระบวนการผลิต</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  title: 'คัดสรรวัตถุดิบ',
                  desc: 'เลือกเฉพาะวัตถุดิบธรรมชาติคุณภาพสูงจากแหล่งที่เชื่อถือได้',
                  image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=200&fit=crop&sig=5',
                  icon: '🌱'
                },
                {
                  step: 2,
                  title: 'ผลิตด้วยความพิถีพิถัน',
                  desc: 'ผสมผสานส่วนผสมอย่างระมัดระวัง เพื่อคุณภาพที่สมบูรณ์แบบ',
                  image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&sig=6',
                  icon: '⚗️'
                },
                {
                  step: 3,
                  title: 'ตรวจสอบคุณภาพ',
                  desc: 'ผ่านการทดสอบคุณภาพอย่างเข้มงวดก่อนส่งถึงลูกค้า',
                  image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=200&fit=crop&sig=7',
                  icon: '✅'
                }
              ].map((process, index) => (
                <div key={index} className="group text-center">
                  <div className="relative mb-6 overflow-hidden rounded-2xl">
                    <img
                      src={process.image}
                      alt={process.title}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute top-4 left-4 bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {process.step}
                    </div>
                    <div className="absolute bottom-4 right-4 text-3xl">
                      {process.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{process.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{process.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">พร้อมเริ่มต้นแล้วหรือยัง?</h3>
              <p className="text-white/80 mb-6">
                สัมผัสประสบการณ์อาบน้ำสุดพิเศษกับบาธบอมคุณภาพสูงของเรา
              </p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                เริ่มช้อปปิ้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
