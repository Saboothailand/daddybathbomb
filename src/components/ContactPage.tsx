import React, { useState, useEffect } from 'react';
import { Mail, Send, User, MessageSquare, Phone, MapPin, Clock, QrCode } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { supabase } from '../lib/supabase';
import type { LanguageKey, PageKey } from '../App';

type ContactPageProps = {
  language: LanguageKey;
  navigateTo: (page: PageKey) => void;
};

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type ContactInfo = {
  id: string;
  contact_type: string;
  title: string;
  value: string;
  display_order: number;
  is_active: boolean;
  icon?: string;
  color?: string;
};

export default function ContactPage({ language, navigateTo }: ContactPageProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerImage, setBannerImage] = useState<string>('');
  const [bannerLoading, setBannerLoading] = useState(true);

  const texts = {
    th: {
      title: 'ติดต่อเรา',
      subtitle: 'มีคำถามหรือต้องการความช่วยเหลือ? เราพร้อมให้บริการ!',
      name: 'ชื่อ-นามสกุล',
      email: 'อีเมล',
      phone: 'เบอร์โทรศัพท์',
      subject: 'หัวข้อ',
      message: 'ข้อความ',
      submit: 'ส่งข้อความ',
      submitting: 'กำลังส่ง...',
      success: 'ส่งข้อความสำเร็จ! เราจะติดต่อกลับโดยเร็วที่สุด',
      error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
      contactInfo: 'ข้อมูลติดต่อ',
      businessHours: 'เวลาทำการ',
      address: 'ที่อยู่',
      quickContact: 'ติดต่อด่วน',
      lineChat: 'LINE Chat',
      emailUs: 'ส่งอีเมล',
      required: 'จำเป็นต้องกรอก'
    },
    en: {
      title: 'Contact Us',
      subtitle: 'Have questions or need help? We\'re here to assist you!',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      subject: 'Subject',
      message: 'Message',
      submit: 'Send Message',
      submitting: 'Sending...',
      success: 'Message sent successfully! We\'ll get back to you soon.',
      error: 'An error occurred. Please try again.',
      contactInfo: 'Contact Information',
      businessHours: 'Business Hours',
      address: 'Address',
      quickContact: 'Quick Contact',
      lineChat: 'LINE Chat',
      emailUs: 'Email Us',
      required: 'Required'
    }
  };

  const t = texts[language];

  // 연락처 정보 로드
  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const { data, error } = await supabase.rpc('get_contact_info');
        if (error) {
          console.error('Error loading contact info:', error);
          // 기본값 사용
          setContactInfo([
            { id: '1', contact_type: 'email', title: 'Email', value: 'admin@daddybathbomb.com', display_order: 1, is_active: true, icon: 'Mail', color: '#FF2D55' },
            { id: '2', contact_type: 'line', title: 'LINE', value: '@daddybathbomb', display_order: 2, is_active: true, icon: 'MessageSquare', color: '#00FF88' },
            { id: '3', contact_type: 'phone', title: 'Phone', value: '+66 123-456-7890', display_order: 3, is_active: true, icon: 'Phone', color: '#007AFF' },
            { id: '4', contact_type: 'address', title: 'Address', value: 'Bangkok, Thailand', display_order: 4, is_active: true, icon: 'MapPin', color: '#00FF88' },
            { id: '5', contact_type: 'qr_code', title: 'LINE QR Code', value: 'https://example.com/qr-code.png', display_order: 5, is_active: true, icon: 'QrCode', color: '#00FF88' }
          ]);
        } else {
          setContactInfo(data || []);
        }
      } catch (error) {
        console.error('Error loading contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContactInfo();
  }, []);

  // 배너 이미지 로드
  useEffect(() => {
    const loadBannerImage = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_banners')
          .select('image_url, title, subtitle')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(1)
          .single();
        
        if (error) {
          console.error('Error loading banner:', error);
          // 기본 배너 사용
          setBannerImage('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80');
        } else {
          setBannerImage(data?.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80');
        }
      } catch (error) {
        console.error('Error loading banner:', error);
        setBannerImage('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80');
      } finally {
        setBannerLoading(false);
      }
    };

    loadBannerImage();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // 여기서 실제 이메일 전송 로직을 구현할 수 있습니다
      // 예: EmailJS, Nodemailer, 또는 Supabase Edge Functions 사용
      
      // 임시로 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Banner Section */}
      <div className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
        {bannerLoading ? (
          <div className="w-full h-full bg-gradient-to-r from-[#FF2D55] to-[#007AFF] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading banner...</p>
            </div>
          </div>
        ) : (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${bannerImage})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 font-fredoka drop-shadow-lg">
                  {t.title}
                </h1>
                <p className="text-xl md:text-2xl max-w-4xl mx-auto drop-shadow-lg">
                  {t.subtitle}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-[#FF2D55]/20 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#FF2D55] via-[#AF52DE] to-[#007AFF] text-white p-6">
              <CardTitle className="text-3xl font-bold flex items-center gap-3 font-fredoka">
                <MessageSquare className="w-7 h-7" />
                {t.title}
              </CardTitle>
              <p className="text-white/90 text-sm mt-2">Send us a message and we'll get back to you soon!</p>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
                      <User className="w-4 h-4 text-[#FF2D55]" />
                      {t.name} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#FF2D55] focus:border-[#FF2D55] h-12 rounded-xl font-medium transition-all duration-200 hover:border-[#FF2D55]/50"
                      placeholder={language === 'th' ? 'กรอกชื่อ-นามสกุล' : 'Enter your full name'}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
                      <Mail className="w-4 h-4 text-[#007AFF]" />
                      {t.email} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#007AFF] focus:border-[#007AFF] h-12 rounded-xl font-medium transition-all duration-200 hover:border-[#007AFF]/50"
                      placeholder={language === 'th' ? 'กรอกอีเมล' : 'Enter your email'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
                      <Phone className="w-4 h-4 text-[#00FF88]" />
                      {t.phone}
                    </label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#00FF88] focus:border-[#00FF88] h-12 rounded-xl font-medium transition-all duration-200 hover:border-[#00FF88]/50"
                      placeholder={language === 'th' ? 'กรอกเบอร์โทรศัพท์' : 'Enter your phone number'}
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-[#AF52DE]" />
                      {t.subject} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#AF52DE] focus:border-[#AF52DE] h-12 rounded-xl font-medium transition-all duration-200 hover:border-[#AF52DE]/50"
                      placeholder={language === 'th' ? 'หัวข้อข้อความ' : 'Message subject'}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-[#FF2D55]" />
                    {t.message} <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#FF2D55] focus:border-[#FF2D55] resize-none rounded-xl font-medium transition-all duration-200 hover:border-[#FF2D55]/50"
                    placeholder={language === 'th' ? 'กรอกข้อความที่ต้องการติดต่อ' : 'Enter your message'}
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-xl font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {t.success}
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      {t.error}
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#FF2D55] via-[#AF52DE] to-[#007AFF] hover:from-[#FF1744] hover:via-[#9333EA] hover:to-[#0056CC] text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-lg">{t.submitting}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span className="text-lg">{t.submit}</span>
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-[#007AFF]/20 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#007AFF] via-[#5C4BFF] to-[#00C2FF] text-white p-5">
                <CardTitle className="text-2xl font-bold flex items-center gap-3 font-fredoka">
                  <Mail className="w-6 h-6" />
                  {t.contactInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF] mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading contact information...</p>
                  </div>
                ) : (
                  contactInfo
                    .filter(info => ['email', 'line', 'phone'].includes(info.contact_type))
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((info) => {
                      const IconComponent = info.icon === 'Mail' ? Mail : 
                                          info.icon === 'MessageSquare' ? MessageSquare : 
                                          info.icon === 'Phone' ? Phone : Mail;
                      
                      return (
                        <div key={info.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md">
                          <div 
                            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: info.color || '#007AFF' }}
                          >
                            <IconComponent className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-gray-900 font-bold text-lg mb-1">{info.title}</h3>
                            <p className="text-gray-700 font-medium">{info.value}</p>
                          </div>
                        </div>
                      );
                    })
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-[#FFD700]/20 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#FFD700] via-[#FF9F1C] to-[#FF6B35] text-white p-5">
                <CardTitle className="text-2xl font-bold flex items-center gap-3 font-fredoka">
                  <Clock className="w-6 h-6" />
                  {t.businessHours}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-3 text-gray-800">
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-200">
                    <span className="font-bold text-gray-900">Monday - Friday</span>
                    <span className="text-gray-700 font-bold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-200">
                    <span className="font-bold text-gray-900">Saturday</span>
                    <span className="text-gray-700 font-bold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all duration-200">
                    <span className="font-bold text-gray-900">Sunday</span>
                    <span className="text-red-600 font-bold">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-[#00FF88]/20 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#00FF88] via-[#00C2FF] to-[#5C4BFF] text-white p-5">
                <CardTitle className="text-2xl font-bold flex items-center gap-3 font-fredoka">
                  <MapPin className="w-6 h-6" />
                  {t.address}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="text-gray-700">
                  <p className="text-xl font-bold mb-2 text-gray-900">Bangkok, Thailand</p>
                  <p className="text-gray-600 font-medium">We deliver nationwide!</p>
                </div>
              </CardContent>
            </Card>

            {/* LINE QR Code Section */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-green-500/20 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white p-5">
                <CardTitle className="text-2xl font-bold flex items-center gap-3 font-fredoka">
                  <MessageSquare className="w-6 h-6" />
                  LINE QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="text-center">
                  <div className="inline-block p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-green-300 transition-all duration-200">
                    <div className="w-48 h-48 bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center shadow-inner hover:shadow-lg transition-all duration-200">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center mb-4 shadow-inner">
                          <div className="text-gray-500 text-xs text-center font-medium">
                            QR Code<br />Placeholder
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 font-bold">@daddybathbomb</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-4 font-medium">
                    Scan to add us on LINE
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}