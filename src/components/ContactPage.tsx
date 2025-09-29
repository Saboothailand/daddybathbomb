import React, { useState } from 'react';
import { Mail, Send, User, MessageSquare, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-fredoka">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-white border border-gray-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-[#FF2D55] to-[#007AFF] text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <MessageSquare className="w-6 h-6" />
                {t.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.name} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#FF2D55] focus:border-[#FF2D55] h-12"
                      placeholder={language === 'th' ? 'กรอกชื่อ-นามสกุล' : 'Enter your full name'}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.email} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#FF2D55] focus:border-[#FF2D55] h-12"
                      placeholder={language === 'th' ? 'กรอกอีเมล' : 'Enter your email'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.phone}
                    </label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#FF2D55] focus:border-[#FF2D55] h-12"
                      placeholder={language === 'th' ? 'กรอกเบอร์โทรศัพท์' : 'Enter your phone number'}
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.subject} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#FF2D55] focus:border-[#FF2D55] h-12"
                      placeholder={language === 'th' ? 'หัวข้อข้อความ' : 'Message subject'}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.message} <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#FF2D55] focus:border-[#FF2D55] resize-none"
                    placeholder={language === 'th' ? 'กรอกข้อความที่ต้องการติดต่อ' : 'Enter your message'}
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    {t.success}
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    {t.error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#FF2D55] to-[#007AFF] hover:from-[#FF1744] hover:to-[#0051D5] text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t.submitting}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      {t.submit}
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-white border border-gray-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#007AFF] to-[#00C2FF] text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Mail className="w-6 h-6" />
                  {t.contactInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-[#FF2D55] rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold text-lg">Email</h3>
                    <p className="text-gray-600">admin@daddybathbomb.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold text-lg">LINE</h3>
                    <p className="text-gray-600">@daddybathbomb</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-[#007AFF] rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold text-lg">{t.phone}</h3>
                    <p className="text-gray-600">+66 123-456-7890</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#FFD700] to-[#FF9F1C] text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Clock className="w-6 h-6" />
                  {t.businessHours}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-semibold">Monday - Friday</span>
                    <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-semibold">Saturday</span>
                    <span className="text-gray-600">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold">Sunday</span>
                    <span className="text-red-500">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#00FF88] to-[#00C2FF] text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <MapPin className="w-6 h-6" />
                  {t.address}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-gray-700">
                  <p className="text-lg font-semibold mb-2">Bangkok, Thailand</p>
                  <p className="text-gray-600">We deliver nationwide!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}