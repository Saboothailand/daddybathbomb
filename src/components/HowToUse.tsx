import { useI18n } from '../hooks/useI18n'

export default function HowToUse() {
  const { language } = useI18n()

  const steps = [
    {
      step: 1,
      title: language === 'th' ? 'เติมน้ำอุ่น' : 'Fill with Warm Water',
      description: language === 'th' 
        ? 'เติมน้ำอุ่นในอ่างอาบน้ำ อุณหภูมิที่เหมาะสมคือ 37-40°C'
        : 'Fill your bathtub with warm water at 37-40°C temperature',
      icon: '🛁'
    },
    {
      step: 2,
      title: language === 'th' ? 'หยอดบาธบอม' : 'Drop Bath Bomb',
      description: language === 'th'
        ? 'หยอดบาธบอม 1 ลูกลงในน้ำ และรอให้ละลายฟองฟู่'
        : 'Drop one bath bomb into the water and watch it fizz',
      icon: '💫'
    },
    {
      step: 3,
      title: language === 'th' ? 'ผสมให้เข้ากัน' : 'Mix Gently',
      description: language === 'th'
        ? 'คนน้ำเบาๆ ให้สีและกลิ่นหอมกระจายทั่วอ่าง'
        : 'Gently swirl the water to distribute colors and fragrance',
      icon: '🌊'
    },
    {
      step: 4,
      title: language === 'th' ? 'เพลิดเพลิน' : 'Enjoy & Relax',
      description: language === 'th'
        ? 'แช่ตัวและเพลิดเพลินกับกลิ่นหอมและความนุ่มนวลของผิว'
        : 'Soak, relax and enjoy the aromatherapy and soft skin',
      icon: '✨'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            {language === 'th' ? 'วิธีใช้งาน' : 'How to Use'}
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {language === 'th' 
              ? 'ขั้นตอนง่ายๆ เพื่อประสบการณ์อาบน้ำสุดพิเศษ'
              : 'Simple steps for an extraordinary bathing experience'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connection Line (hidden on mobile) */}
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
              {language === 'th' ? '💡 เคล็ดลับเพิ่มเติม' : '💡 Pro Tips'}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-400 text-xl">⏰</span>
                  <div>
                    <h4 className="text-white font-semibold">
                      {language === 'th' ? 'เวลาที่เหมาะสม' : 'Perfect Timing'}
                    </h4>
                    <p className="text-blue-100 text-sm">
                      {language === 'th' 
                        ? 'แช่ตัว 15-20 นาที เพื่อประสิทธิภาพสูงสุด'
                        : 'Soak for 15-20 minutes for maximum benefits'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-400 text-xl">💧</span>
                  <div>
                    <h4 className="text-white font-semibold">
                      {language === 'th' ? 'ล้างออกหรือไม่?' : 'Rinse or Not?'}
                    </h4>
                    <p className="text-blue-100 text-sm">
                      {language === 'th' 
                        ? 'ไม่จำเป็นต้องล้าง ให้ผิวดูดซับความชุ่มชื้น'
                        : 'No need to rinse - let your skin absorb the moisture'
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-400 text-xl">🕯️</span>
                  <div>
                    <h4 className="text-white font-semibold">
                      {language === 'th' ? 'บรรยากาศแสนผ่อนคลาย' : 'Relaxing Atmosphere'}
                    </h4>
                    <p className="text-blue-100 text-sm">
                      {language === 'th' 
                        ? 'เปิดเพลงเบาๆ จุดเทียน เพิ่มความผ่อนคลาย'
                        : 'Play soft music, light candles for extra relaxation'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-400 text-xl">📱</span>
                  <div>
                    <h4 className="text-white font-semibold">
                      {language === 'th' ? 'ปิดโลกภายนอก' : 'Disconnect'}
                    </h4>
                    <p className="text-blue-100 text-sm">
                      {language === 'th' 
                        ? 'วางโทรศัพท์ เพลิดเพลินกับช่วงเวลาส่วนตัว'
                        : 'Put away devices and enjoy your personal time'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
