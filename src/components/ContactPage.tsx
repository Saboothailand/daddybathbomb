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
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#2a3441] py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-fredoka">
            {t.title}
          </h1>
          <p className="text-xl text-[#B8C4DB] max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-[#11162A] border border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-[#FF2D55]" />
                {t.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      {t.name} <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-[#FF2D55] focus:border-[#FF2D55]"
                      placeholder={language === 'th' ? 'กรอกชื่อ-นามสกุล' : 'Enter your full name'}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      {t.email} <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-[#FF2D55] focus:border-[#FF2D55]"
                      placeholder={language === 'th' ? 'กรอกอีเมล' : 'Enter your email'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      {t.phone}
                    </label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-[#FF2D55] focus:border-[#FF2D55]"
                      placeholder={language === 'th' ? 'กรอกเบอร์โทรศัพท์' : 'Enter your phone number'}
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      {t.subject} <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-[#FF2D55] focus:border-[#FF2D55]"
                      placeholder={language === 'th' ? 'หัวข้อข้อความ' : 'Message subject'}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    {t.message} <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-[#FF2D55] focus:border-[#FF2D55] resize-none"
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
            <Card className="bg-[#11162A] border border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <Mail className="w-6 h-6 text-[#007AFF]" />
                  {t.contactInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <div className="w-12 h-12 bg-[#FF2D55] rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Email</h3>
                    <p className="text-gray-300">admin@daddybathbomb.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">LINE</h3>
                    <p className="text-gray-300">@daddybathbomb</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <div className="w-12 h-12 bg-[#007AFF] rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{t.phone}</h3>
                    <p className="text-gray-300">+66 123-456-7890</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#11162A] border border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <Clock className="w-6 h-6 text-[#FFD700]" />
                  {t.businessHours}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-300">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#11162A] border border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-[#00FF88]" />
                  {t.address}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Bangkok, Thailand<br />
                  We deliver nationwide!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}