import { useI18n } from '../hooks/useI18n'

export default function AboutPage() {
  const { language, t } = useI18n()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {language === 'th' ? 'เกี่ยวกับเรา' : 'About Us'}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {language === 'th' 
              ? 'ความเป็นมาและปรัชญาของ Daddy Bath Bomb'
              : 'The story and philosophy behind Daddy Bath Bomb'
            }
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Our Story */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {language === 'th' ? 'เรื่องราวของเรา' : 'Our Story'}
            </h2>
            <div className="text-white/90 space-y-4 leading-relaxed">
              {language === 'th' ? (
                <>
                  <p>
                    Daddy Bath Bomb เกิดขึ้นจากความรักในการดูแลตัวเองและครอบครัว 
                    เราเชื่อว่าเวลาอาบน้ำไม่ใช่แค่การทำความสะอาดร่างกาย 
                    แต่เป็นช่วงเวลาแห่งการผ่อนคลายและฟื้นฟูจิตใจ
                  </p>
                  <p>
                    ด้วยความมุ่งมั่นที่จะสร้างผลิตภัณฑ์คุณภาพสูงจากวัตถุดิบธรรมชาติ 
                    เราคัดสรรส่วนผสมอย่างพิถีพิถัน เพื่อให้ทุกคนในครอบครัวได้สัมผัสประสบการณ์อาบน้ำที่พิเศษ
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Daddy Bath Bomb was born from a love of self-care and family wellness. 
                    We believe that bath time isn't just about cleansing the body, 
                    but it's a precious moment for relaxation and mental rejuvenation.
                  </p>
                  <p>
                    With our commitment to creating high-quality products from natural ingredients, 
                    we carefully select each component to ensure everyone in the family can experience 
                    an exceptional bathing ritual.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Our Mission */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {language === 'th' ? 'พันธกิจของเรา' : 'Our Mission'}
            </h2>
            <div className="text-white/90 space-y-4 leading-relaxed">
              {language === 'th' ? (
                <>
                  <p>
                    เราตั้งใจที่จะมอบประสบการณ์อาบน้ำสุดพิเศษให้กับทุกครอบครัวในประเทศไทย 
                    ด้วยบาธบอมคุณภาพสูงที่ผลิตจากวัตถุดิบธรรมชาติ 100%
                  </p>
                  <p>
                    เราเชื่อว่าการดูแลตัวเองไม่ควรเป็นความหรูหรา 
                    แต่เป็นสิ่งจำเป็นที่ทุกคนควรได้รับ
                  </p>
                </>
              ) : (
                <>
                  <p>
                    We're dedicated to bringing exceptional bathing experiences to every family in Thailand 
                    through our premium bath bombs made from 100% natural ingredients.
                  </p>
                  <p>
                    We believe that self-care shouldn't be a luxury, 
                    but a necessity that everyone deserves to enjoy.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Our Values */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {language === 'th' ? 'คุณค่าของเรา' : 'Our Values'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '🌿',
                  title: language === 'th' ? 'ธรรมชาติ' : 'Natural',
                  desc: language === 'th' 
                    ? 'ใช้วัตถุดิบธรรมชาติ 100% ปลอดภัยสำหรับทุกคนในครอบครัว'
                    : '100% natural ingredients, safe for the whole family'
                },
                {
                  icon: '💎',
                  title: language === 'th' ? 'คุณภาพ' : 'Quality',
                  desc: language === 'th'
                    ? 'ผลิตด้วยมาตรฐานสูง ผ่านการทดสอบคุณภาพอย่างเข้มงวด'
                    : 'Manufactured to high standards with rigorous quality testing'
                },
                {
                  icon: '❤️',
                  title: language === 'th' ? 'ใส่ใจ' : 'Care',
                  desc: language === 'th'
                    ? 'ใส่ใจในทุกรายละเอียด เพื่อประสบการณ์ที่ดีที่สุด'
                    : 'Attention to every detail for the best experience'
                },
                {
                  icon: '🌟',
                  title: language === 'th' ? 'นวัตกรรม' : 'Innovation',
                  desc: language === 'th'
                    ? 'พัฒนาผลิตภัณฑ์ใหม่อย่างต่อเนื่อง เพื่อตอบสนองความต้องการ'
                    : 'Continuous product development to meet customer needs'
                }
              ].map((value, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-3">{value.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-white/80 text-sm">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                {language === 'th' ? 'พร้อมเริ่มต้นแล้วหรือยัง?' : 'Ready to Get Started?'}
              </h3>
              <p className="text-white/80 mb-6">
                {language === 'th' 
                  ? 'สัมผัสประสบการณ์อาบน้ำสุดพิเศษกับบาธบอมคุณภาพสูงของเรา'
                  : 'Experience exceptional bathing with our premium bath bombs'
                }
              </p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {language === 'th' ? 'เริ่มช้อปปิ้ง' : 'Start Shopping'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
