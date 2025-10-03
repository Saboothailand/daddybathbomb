import React, { useEffect, useState } from 'react';
import {
  Mail,
  Send,
  User,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  QrCode,
  CheckCircle,
  XCircle,
  Shield,
  Star,
  Zap,
  Heart,
  Rocket,
  Users,
} from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

import type { LanguageKey, PageKey } from '../App';

type ContactPageProps = {
  language: LanguageKey;
  navigateTo: (page: PageKey) => void;
};

type SubmitStatus = 'idle' | 'success' | 'error';

const translations = {
  en: {
    title: 'Contact Us',
    subtitle: 'Get in touch with our team',
    formTitle: 'Send us a message',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    subject: 'Subject',
    message: 'Message',
    submit: 'Send Message',
    submitting: 'Sending...',
    success: 'Message sent successfully!',
    error: 'Failed to send message. Please try again.',
    quickContact: 'Quick Contact',
    businessHours: 'Business Hours',
    lineQR: 'LINE QR Code',
    address: 'Address',
    addressDetail: '123 Super Street, Hero City, 12345',
    deliveryNote: 'Free delivery within 5km radius',
    scanLine: 'Scan to add us on LINE',
  },
  th: {
    title: 'ติดต่อเรา',
    subtitle: 'ติดต่อทีมงานของเรา',
    formTitle: 'ส่งข้อความถึงเรา',
    name: 'ชื่อ-นามสกุล',
    email: 'อีเมล',
    phone: 'เบอร์โทรศัพท์',
    subject: 'หัวข้อ',
    message: 'ข้อความ',
    submit: 'ส่งข้อความ',
    submitting: 'กำลังส่ง...',
    success: 'ส่งข้อความสำเร็จ!',
    error: 'ส่งข้อความไม่สำเร็จ กรุณาลองใหม่',
    quickContact: 'ติดต่อด่วน',
    businessHours: 'เวลาทำการ',
    lineQR: 'QR Code LINE',
    address: 'ที่อยู่',
    addressDetail: '123 ถนนซุปเปอร์ เขตฮีโร่ 12345',
    deliveryNote: 'จัดส่งฟรีในรัศมี 5 กิโลเมตร',
    scanLine: 'สแกนเพื่อเพิ่มเราใน LINE',
  },
};

const contactItems = [
  {
    title: 'Email',
    value: 'info@daddybathbomb.com',
    link: 'mailto:info@daddybathbomb.com',
    icon: <Mail className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Phone',
    value: '+66 123-456-7890',
    link: 'tel:+661234567890',
    icon: <Phone className="w-6 h-6" />,
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'LINE',
    value: '@daddybathbomb',
    link: 'https://line.me/ti/p/~daddybathbomb',
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    title: 'Address',
    value: '123 Super Street',
    link: 'https://maps.google.com',
    icon: <MapPin className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600',
  },
];

export default function ContactPage({ language, navigateTo }: ContactPageProps) {
  const [localLanguage, setLocalLanguage] = useState<LanguageKey>(language);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const t = translations[localLanguage];

  useEffect(() => {
    setLocalLanguage(language);
  }, [language]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#007AFF]/20 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center">
        <AnimatedBackground />

        {/* Comic speech bubble */}
        <div className="absolute top-20 right-10 hidden lg:block animate-bounce">
          <div className="bg-[#FFD700] rounded-2xl px-6 py-3 comic-border border-4 border-black relative">
            <span className="font-fredoka text-black font-bold text-lg">Contact Us!</span>
            <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-6 border-r-6 border-t-12 border-transparent border-t-[#FFD700]"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <Shield className="w-10 h-10 text-[#FFD700] mr-3 animate-pulse" />
                <span className="font-nunito text-[#B8C4DB] text-xl font-bold">Super Dad Support</span>
                <Shield className="w-10 h-10 text-[#FFD700] ml-3 animate-pulse" />
              </div>

              <h1 className="font-fredoka text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-none comic-shadow">
                <span className="inline-block animate-bounce text-[#FF2D55]" style={{ animationDelay: '0s' }}>GET IN</span>
                <span className="block text-[#007AFF] relative">
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>TOUCH</span>
                  <Zap className="absolute -top-4 -right-8 w-12 h-12 text-[#FFD700] rotate-12 animate-spin" style={{ animationDuration: '3s' }} />
                </span>
                <span className="block text-white animate-bounce" style={{ animationDelay: '0.4s' }}>WITH US!</span>
              </h1>

              <div className="bg-[#151B2E]/80 rounded-3xl p-6 comic-border border-4 border-[#FFD700] backdrop-blur-lg mb-6">
                <p className="font-nunito text-xl text-[#B8C4DB] leading-relaxed mb-4">
                  🦸‍♂️ Have questions? Need help? Our superhero support team is here to
                  <span className="text-[#FF2D55] font-bold"> SAVE THE DAY</span>!
                </p>
                <p className="font-nunito text-lg text-[#B8C4DB] leading-relaxed">
                  We're always ready to help with your bath time adventures and make sure
                  <span className="text-[#00FF88] font-bold"> every family has fun</span>! 💥
                </p>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <Star className="w-8 h-8 text-[#FFD700] animate-spin" />
                <span className="font-fredoka text-2xl text-white font-bold">24/7 Support</span>
                <Star className="w-8 h-8 text-[#FFD700] animate-spin" />
              </div>
            </div>

            <div className="relative">
              {/* Super Support character showcase */}
              <div className="w-96 h-96 mx-auto bg-gradient-to-br from-[#FF2D55] via-[#007AFF] to-[#FFD700] rounded-full comic-border border-8 border-white flex items-center justify-center relative overflow-hidden animate-float">
                {/* Main superhero character */}
                <div className="text-9xl animate-bounce" style={{ animationDuration: '2s' }}>
                  🦸‍♂️
                </div>

                {/* Cape effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF2D55]/30 to-transparent rounded-full"></div>

                {/* Floating support elements around character */}
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#FFD700] rounded-full comic-border border-4 border-black flex items-center justify-center animate-bounce">
                  <span className="text-2xl">📞</span>
                </div>

                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#00FF88] rounded-full comic-border border-4 border-black flex items-center justify-center animate-pulse">
                  <span className="text-3xl">💬</span>
                </div>

                <div className="absolute top-1/4 -right-8 w-12 h-12 bg-[#007AFF] rounded-full comic-border border-4 border-black flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                  <Mail className="w-6 h-6 text-white" />
                </div>

                <div className="absolute bottom-1/4 -left-8 w-14 h-14 bg-[#FF2D55] rounded-full comic-border border-4 border-black flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
                  <Heart className="w-8 h-8 text-white" />
                </div>

                {/* Action lines */}
                <div className="absolute top-8 left-8 w-8 h-1 bg-[#FFD700] rotate-45 animate-pulse"></div>
                <div className="absolute bottom-8 right-8 w-6 h-1 bg-white rotate-12 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute top-1/2 right-4 w-4 h-1 bg-[#00FF88] -rotate-45 animate-pulse" style={{ animationDelay: '0.7s' }}></div>
              </div>

              {/* Power-up effects */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#FF2D55] rounded-full opacity-20 blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#007AFF] rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/3 -right-8 w-20 h-20 bg-[#FFD700] rounded-full opacity-30 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>

              {/* Comic "HELP!" text */}
              <div className="absolute top-4 left-4 bg-white rounded-full px-4 py-2 comic-border border-3 border-black animate-pulse">
                <span className="font-fredoka text-black font-bold text-lg">HELP!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0F1A] relative overflow-hidden">
        {/* Comic background effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-24 h-24 bg-[#FFD700] rotate-45 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-[#FF2D55] rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 border-4 border-[#007AFF] rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-[#00FF88] rounded-full animate-ping"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Star className="w-10 h-10 text-[#FFD700] animate-spin mr-4" />
              <span className="font-fredoka text-3xl text-[#FF2D55] font-bold comic-shadow">CONTACT FORM</span>
              <Star className="w-10 h-10 text-[#FFD700] animate-spin ml-4" />
            </div>

            <h2 className="font-fredoka text-5xl font-bold text-white mb-6 comic-shadow">
              SEND US A MESSAGE
            </h2>

            <div className="bg-[#151B2E] rounded-2xl px-8 py-4 comic-border border-4 border-[#FFD700] inline-block">
              <p className="font-nunito text-xl text-[#B8C4DB] font-bold">
                📧 Get in touch with our superhero team! 📧
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 justify-items-stretch">
            <div className="lg:col-span-2 w-full max-w-2xl">
              <div className="bg-[#151B2E] rounded-3xl comic-border border-4 border-[#FF2D55] overflow-hidden">
                <div className="bg-gradient-to-r from-[#FF2D55] via-[#007AFF] to-[#FFD700] px-8 py-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3 font-fredoka">
                    <MessageSquare className="w-7 h-7" />
                    {t.formTitle}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#B8C4DB] mb-2 font-fredoka">
                        {t.name} <span className="text-[#FF2D55]">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FFD700]" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-12 pr-4 py-3.5 bg-[#0B0F1A] border-2 border-[#FFD700] rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all outline-none text-white placeholder-gray-400"
                          placeholder=""
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#B8C4DB] mb-2 font-fredoka">
                        {t.email} <span className="text-[#FF2D55]">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FFD700]" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-12 pr-4 py-3.5 bg-[#0B0F1A] border-2 border-[#FFD700] rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all outline-none text-white placeholder-gray-400"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#B8C4DB] mb-2 font-fredoka">
                        {t.phone}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FFD700]" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3.5 bg-[#0B0F1A] border-2 border-[#FFD700] rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all outline-none text-white placeholder-gray-400"
                          placeholder=""
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#B8C4DB] mb-2 font-fredoka">
                        {t.subject} <span className="text-[#FF2D55]">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3.5 bg-[#0B0F1A] border-2 border-[#FFD700] rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all outline-none text-white placeholder-gray-400"
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#B8C4DB] mb-2 font-fredoka">
                      {t.message} <span className="text-[#FF2D55]">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3.5 bg-[#0B0F1A] border-2 border-[#FFD700] rounded-xl focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all outline-none resize-none text-white placeholder-gray-400"
                      placeholder=""
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="flex items-center gap-3 p-4 bg-[#00FF88]/20 border-2 border-[#00FF88] rounded-xl text-[#00FF88]">
                      <CheckCircle className="w-6 h-6 flex-shrink-0" />
                      <span className="font-medium font-fredoka">{t.success}</span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-3 p-4 bg-[#FF2D55]/20 border-2 border-[#FF2D55] rounded-xl text-[#FF2D55]">
                      <XCircle className="w-6 h-6 flex-shrink-0" />
                      <span className="font-medium font-fredoka">{t.error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#FF2D55] via-[#007AFF] to-[#FFD700] hover:from-[#FF1744] hover:via-[#0051D5] hover:to-[#E6C200] text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed comic-button font-fredoka"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{t.submitting}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{t.submit}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6 w-full max-w-sm ml-auto">
              {/* Quick Contact Card */}
              <div className="bg-[#151B2E] rounded-3xl comic-border border-4 border-[#007AFF] overflow-hidden">
                <div className="bg-gradient-to-r from-[#007AFF] to-[#00FF88] px-6 py-5">
                  <h3 className="text-xl font-bold text-white font-fredoka flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    {t.quickContact}
                  </h3>
                </div>
                <div className="p-6 space-y-3">
                  {contactItems.map((item, index) => (
                    <a
                      key={item.title}
                      href={item.link}
                      className="flex items-center gap-3 p-3 bg-[#0B0F1A] hover:bg-[#1a1f2e] rounded-xl transition-all duration-200 group border-2 border-[#FFD700] hover:border-[#FF2D55] comic-button"
                    >
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform comic-border border-2 border-black flex-shrink-0`}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[#FFD700] uppercase tracking-wider font-fredoka">
                          {item.title}
                        </div>
                        <div className="text-sm font-bold text-white truncate font-nunito">{item.value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* QR Code Card - Separate column */}
            <div className="w-full max-w-sm ml-auto">
              <div className="bg-[#151B2E] rounded-3xl comic-border border-4 border-[#00FF88] overflow-hidden">
                <div className="bg-gradient-to-r from-[#00FF88] to-[#007AFF] px-6 py-5">
                  <h3 className="text-xl font-bold text-black flex items-center gap-2 font-fredoka">
                    <QrCode className="w-5 h-5" />
                    {t.lineQR}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="bg-gradient-to-br from-[#0B0F1A] to-[#1a1f2e] rounded-xl p-4 text-center border-2 border-dashed border-[#FFD700]">
                    <div className="w-40 h-40 bg-[#0B0F1A] rounded-lg mx-auto mb-3 flex items-center justify-center shadow-inner border-2 border-[#FFD700] comic-border">
                      <div className="w-full h-full flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-[#FFD700]" />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white mb-1 font-nunito">@daddybathbomb</p>
                    <p className="text-xs text-[#B8C4DB] font-fredoka">{t.scanLine}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Card - Separate column */}
            <div className="w-full max-w-sm ml-auto">
              <div className="bg-[#151B2E] rounded-3xl comic-border border-4 border-[#FFD700] overflow-hidden">
                <div className="bg-gradient-to-r from-[#FFD700] to-[#FF2D55] px-6 py-5">
                  <h3 className="text-xl font-bold text-black flex items-center gap-2 font-fredoka">
                    <Clock className="w-5 h-5" />
                    {t.businessHours}
                  </h3>
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex justify-between items-center py-2 px-3 bg-[#0B0F1A] rounded-lg border-2 border-[#FFD700]">
                    <span className="font-semibold text-[#B8C4DB] font-fredoka text-sm">Mon - Fri</span>
                    <span className="font-bold text-white font-nunito text-sm">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-[#0B0F1A] rounded-lg border-2 border-[#FFD700]">
                    <span className="font-semibold text-[#B8C4DB] font-fredoka text-sm">Saturday</span>
                    <span className="font-bold text-white font-nunito text-sm">10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-[#FF2D55]/20 rounded-lg border-2 border-[#FF2D55]">
                    <span className="font-semibold text-[#FF2D55] font-fredoka text-sm">Sunday</span>
                    <span className="font-bold text-[#FF2D55] font-nunito text-sm">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Language Toggle Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setLocalLanguage((prev) => (prev === 'th' ? 'en' : 'th'))}
          className="bg-[#FFD700] text-black px-6 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all font-bold border-4 border-black hover:border-[#FF2D55] comic-button font-fredoka"
        >
          {localLanguage === 'th' ? '🇹🇭 TH' : '🇬🇧 EN'}
        </button>
      </div>
    </div>
  );
}