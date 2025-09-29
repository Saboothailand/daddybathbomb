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
} from 'lucide-react';

import type { LanguageKey, PageKey } from '../App';

type ContactPageProps = {
  language: LanguageKey;
  navigateTo: (page: PageKey) => void;
};

type SubmitStatus = 'idle' | 'success' | 'error';

const textsMap = {
  th: {
    title: 'ติดต่อเรา',
    subtitle: 'พร้อมให้คำปรึกษาและบริการที่ดีที่สุด',
    description:
      'มีคำถามหรือต้องการสอบถามข้อมูล? ทีมงานของเราพร้อมให้บริการและตอบคำถามทุกข้อสงสัย',
    formTitle: 'ส่งข้อความถึงเรา',
    name: 'ชื่อ-นามสกุล',
    email: 'อีเมล',
    phone: 'เบอร์โทรศัพท์',
    subject: 'หัวข้อ',
    message: 'ข้อความ',
    submit: 'ส่งข้อความ',
    submitting: 'กำลังส่ง...',
    success: 'ส่งข้อความสำเร็จ! เราจะติดต่อกลับโดยเร็วที่สุด',
    error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
    contactInfo: 'ข้อมูลการติดต่อ',
    businessHours: 'เวลาทำการ',
    quickContact: 'ช่องทางติดต่อด่วน',
    lineQR: 'LINE QR Code',
    scanLine: 'สแกนเพื่อเพิ่มเพื่อน LINE',
    address: 'ที่อยู่',
    addressDetail: 'Bangkok, Thailand',
    deliveryNote: 'บริการจัดส่งทั่วประเทศ',
  },
  en: {
    title: 'Contact Us',
    subtitle: 'Ready to provide the best consultation and service',
    description:
      "Have questions or need information? Our team is ready to serve and answer all your inquiries",
    formTitle: 'Send us a message',
    name: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    subject: 'Subject',
    message: 'Message',
    submit: 'Send Message',
    submitting: 'Sending...',
    success: "Message sent successfully! We'll get back to you soon.",
    error: 'An error occurred. Please try again.',
    contactInfo: 'Contact Information',
    businessHours: 'Business Hours',
    quickContact: 'Quick Contact',
    lineQR: 'LINE QR Code',
    scanLine: 'Scan to add us on LINE',
    address: 'Address',
    addressDetail: 'Bangkok, Thailand',
    deliveryNote: 'Nationwide delivery service',
  },
} as const;

type TextsKey = keyof typeof textsMap;

const contactItems = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email',
    value: 'admin@daddybathbomb.com',
    color: 'from-blue-500 to-blue-600',
    link: 'mailto:admin@daddybathbomb.com',
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'LINE',
    value: '@daddybathbomb',
    color: 'from-green-500 to-green-600',
    link: 'https://line.me/ti/p/@daddybathbomb',
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Phone',
    value: '+66 123-456-7890',
    color: 'from-purple-500 to-purple-600',
    link: 'tel:+66123456789',
  },
];

export default function ContactPage({ language, navigateTo }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [localLanguage, setLocalLanguage] = useState<TextsKey>(language);

  useEffect(() => {
    setLocalLanguage(language);
  }, [language]);

  const t = textsMap[localLanguage];

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2340&auto=format&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center max-w-4xl">
            <div className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-white/90 text-sm font-medium tracking-wider uppercase">
                Contact
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/95 font-light mb-4 leading-relaxed">
              {t.subtitle}
            </p>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              {t.description}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-16 md:h-24"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path d="M0,64 C240,120 480,120 720,64 C960,8 1200,8 1440,64 L1440,120 L0,120 Z" fill="#F9FAFB" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <MessageSquare className="w-7 h-7" />
                  {t.formTitle}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.name} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder={localLanguage === 'th' ? 'กรอกชื่อ-นามสกุล' : 'Enter your name'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.email} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.phone}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        placeholder="0XX-XXX-XXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.subject} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                      placeholder={localLanguage === 'th' ? 'หัวข้อข้อความ' : 'Subject'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.message} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                    placeholder={localLanguage === 'th' ? 'กรอกข้อความที่ต้องการติดต่อ...' : 'Enter your message...'}
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-800">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <span className="font-medium">{t.success}</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800">
                    <XCircle className="w-6 h-6 flex-shrink-0" />
                    <span className="font-medium">{t.error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
                <h3 className="text-xl font-bold text-white">{t.quickContact}</h3>
              </div>
              <div className="p-6 space-y-4">
                {contactItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.link}
                    className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group border border-gray-200 hover:border-gray-300"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {item.title}
                      </div>
                      <div className="text-sm font-bold text-gray-900 truncate">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {t.businessHours}
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Mon - Fri</span>
                  <span className="font-bold text-gray-900">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Saturday</span>
                  <span className="font-bold text-gray-900">10:00 - 16:00</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-red-50 rounded-lg border border-red-200">
                  <span className="font-semibold text-gray-700">Sunday</span>
                  <span className="font-bold text-red-600">Closed</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  {t.lineQR}
                </h3>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center border-2 border-dashed border-gray-300">
                  <div className="w-40 h-40 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center shadow-inner border border-gray-200">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                      <span className="text-xs text-gray-400">QR Code</span>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-700 mb-1">@daddybathbomb</p>
                  <p className="text-xs text-gray-500">{t.scanLine}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {t.address}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-lg font-bold text-gray-900 mb-2">{t.addressDetail}</p>
                <p className="text-sm text-gray-600">{t.deliveryNote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setLocalLanguage((prev) => (prev === 'th' ? 'en' : 'th'))}
          className="bg-white text-gray-700 px-6 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all font-bold border-2 border-gray-200 hover:border-gray-300"
        >
          {localLanguage === 'th' ? '🇹🇭 TH' : '🇬🇧 EN'}
        </button>
      </div>
    </div>
  );
}
