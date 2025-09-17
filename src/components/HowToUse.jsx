import React from 'react';

export default function HowToUse() {
  const steps = [
    {
      step: 1,
      title: 'เติมน้ำอุ่น',
      description: 'เติมน้ำอุ่นในอ่างอาบน้ำ อุณหภูมิที่เหมาะสมคือ 37-40°C',
      icon: '🛁'
    },
    {
      step: 2,
      title: 'หยอดบาธบอม',
      description: 'หยอดบาธบอม 1 ลูกลงในน้ำ และรอให้ละลายฟองฟู่',
      icon: '💫'
    },
    {
      step: 3,
      title: 'ผสมให้เข้ากัน',
      description: 'คนน้ำเบาๆ ให้สีและกลิ่นหอมกระจายทั่วอ่าง',
      icon: '🌊'
    },
    {
      step: 4,
      title: 'เพลิดเพลิน',
      description: 'แช่ตัวและเพลิดเพลินกับกลิ่นหอมและความนุ่มนวลของผิว',
      icon: '✨'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">วิธีใช้งาน</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            ขั้นตอนง่ายๆ เพื่อประสบการณ์อาบน้ำสุดพิเศษ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-pink-500 to-transparent transform translate-x-4 z-10"></div>
              )}
              
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 relative z-20">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="text-6xl mb-6 text-center group-hover:animate-bounce">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-blue-100 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              💡 เคล็ดลับเพิ่มเติม
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-400 text-xl">⏰</span>
                  <div>
                    <h4 className="text-white font-semibold">เวลาที่เหมาะสม</h4>
                    <p className="text-blue-100 text-sm">แช่ตัว 15-20 นาที เพื่อประสิทธิภาพสูงสุด</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-400 text-xl">💧</span>
                  <div>
                    <h4 className="text-white font-semibold">ล้างออกหรือไม่?</h4>
                    <p className="text-blue-100 text-sm">ไม่จำเป็นต้องล้าง ให้ผิวดูดซับความชุ่มชื้น</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-400 text-xl">🕯️</span>
                  <div>
                    <h4 className="text-white font-semibold">บรรยากาศแสนผ่อนคลาย</h4>
                    <p className="text-blue-100 text-sm">เปิดเพลงเบาๆ จุดเทียน เพิ่มความผ่อนคลาย</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-400 text-xl">📱</span>
                  <div>
                    <h4 className="text-white font-semibold">ปิดโลกภายนอก</h4>
                    <p className="text-blue-100 text-sm">วางโทรศัพท์ เพลิดเพลินกับช่วงเวลาส่วนตัว</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
