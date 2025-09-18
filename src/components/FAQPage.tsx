// @ts-nocheck
import React, { useState, useEffect } from 'react';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [openItems, setOpenItems] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 샘플 FAQ 데이터
  const sampleFaqs = [
    {
      id: 1,
      question: 'บาธบอมของคุณทำจากอะไร?',
      answer: 'บาธบอมของเราทำจากวัตถุดิบธรรมชาติ 100% ได้แก่ เบกกิ้งโซดา กรดซิตริก น้ำมันหอมระเหยธรรมชาติ และส่วนผสมบำรุงผิว ปลอดภัยสำหรับทุกคนในครอบครัว',
      category: 'product'
    },
    {
      id: 2,
      question: 'ใช้บาธบอมอย่างไร?',
      answer: 'เติมน้ำอุ่นในอ่างอาบน้ำ หยอดบาธบอม 1 ลูกลงไป รอให้ละลายและฟองฟู่ประมาณ 2-3 นาที จากนั้นแช่ตัวและเพลิดเพลินกับกลิ่นหอมและความนุ่มนวลของผิว',
      category: 'product'
    },
    {
      id: 3,
      question: 'จัดส่งใช้เวลานานแค่ไหน?',
      answer: 'เราจัดส่งภายใน 1-2 วันทำการหลังได้รับการชำระเงิน สำหรับกรุงเทพและปริมณฑล ส่วนต่างจังหวัดใช้เวลา 2-3 วันทำการ',
      category: 'shipping'
    },
    {
      id: 4,
      question: 'สามารถคืนสินค้าได้หรือไม่?',
      answer: 'เราให้การรับประกันความพึงพอใจ หากไม่พอใจสามารถคืนสินค้าได้ภายใน 7 วัน โดยสินค้าต้องอยู่ในสภาพเดิมและไม่ได้ใช้งาน',
      category: 'general'
    },
    {
      id: 5,
      question: 'วิธีการชำระเงิน?',
      answer: 'เรารับชำระเงินผ่าน LINE Chat, QR Pay, และการโอนเงินผ่านธนาคาร สะดวกและปลอดภัย',
      category: 'payment'
    }
  ];

  useEffect(() => {
    setFaqs(sampleFaqs);
  }, []);

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const categories = [
    { id: 'all', name: 'ทั้งหมด', icon: '📋' },
    { id: 'product', name: 'สินค้า', icon: '🛁' },
    { id: 'shipping', name: 'การจัดส่ง', icon: '🚚' },
    { id: 'payment', name: 'การชำระเงิน', icon: '💳' },
    { id: 'general', name: 'ทั่วไป', icon: '❓' }
  ];

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            คำถามที่พบบ่อย
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            คำตอบสำหรับคำถามที่ลูกค้าถามบ่อยที่สุด
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/20"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <h3 className="text-white font-semibold">{faq.question}</h3>
                <div className={`transform transition-transform duration-300 ${
                  openItems.has(faq.id) ? 'rotate-180' : 'rotate-0'
                }`}>
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                openItems.has(faq.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-6">
                  <p className="text-white/90 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">ยังมีคำถาม?</h3>
            <p className="text-white/80 mb-6">
              ติดต่อทีมงานของเราผ่าน LINE Chat เพื่อความช่วยเหลือแบบเรียลไทม์
            </p>
            <button
              onClick={() => window.open('https://line.me/ti/p/@daddybathbomb', '_blank')}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              💬 ติดต่อเรา
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
