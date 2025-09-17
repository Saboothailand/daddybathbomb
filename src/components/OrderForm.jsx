import React, { useState } from 'react';
import { createOrder } from '../utils/orders';
import { getCart, clearCart, getCartTotal } from '../utils/cart';

export default function OrderForm({ isOpen, onClose, onOrderComplete, language = 'th' }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const cart = getCart();
  const total = getCartTotal();
  
  if (!isOpen) return null;

  const texts = {
    th: {
      title: 'ข้อมูลการสั่งซื้อ',
      subtitle: 'กรุณากรอกข้อมูลเพื่อดำเนินการสั่งซื้อ',
      email: 'อีเมล',
      emailRequired: '* จำเป็นสำหรับการติดต่อ',
      name: 'ชื่อ-นามสกุล',
      phone: 'เบอร์โทรศัพท์',
      address: 'ที่อยู่',
      city: 'จังหวัด',
      postalCode: 'รหัสไปรษณีย์',
      notes: 'หมายเหตุเพิ่มเติม',
      orderSummary: 'สรุปคำสั่งซื้อ',
      total: 'รวมทั้งหมด',
      submitOrder: 'ยืนยันการสั่งซื้อ',
      cancel: 'ยกเลิก',
      contactInfo: 'ทีมงานจะติดต่อกลับทางอีเมลหรือโทรศัพท์เพื่อยืนยันการสั่งซื้อ',
      processing: 'กำลังดำเนินการ...'
    },
    en: {
      title: 'Order Information',
      subtitle: 'Please fill in your details to complete the order',
      email: 'Email Address',
      emailRequired: '* Required for contact',
      name: 'Full Name',
      phone: 'Phone Number',
      address: 'Address',
      city: 'City/Province',
      postalCode: 'Postal Code',
      notes: 'Additional Notes',
      orderSummary: 'Order Summary',
      total: 'Total',
      submitOrder: 'Confirm Order',
      cancel: 'Cancel',
      contactInfo: 'Our team will contact you via email or phone to confirm your order',
      processing: 'Processing...'
    }
  };

  const t = texts[language] || texts.th;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required for order confirmation';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        customer: formData,
        items: cart,
        total: total,
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        paymentMethod: 'pending', // Will be confirmed by admin
        shippingMethod: 'standard'
      };
      
      const order = createOrder(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Show success message
      alert(`Order ${order.id} created successfully! We will contact you soon via email or phone to confirm your order.`);
      
      onOrderComplete && onOrderComplete(order);
      onClose();
      
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{t.title}</h2>
              <p className="text-gray-600 mt-2">{t.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email - Required */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.email} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                  <p className="text-blue-600 text-sm mt-1">{t.emailRequired}</p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.name} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.phone} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="08X-XXX-XXXX"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.address} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Street address, building, apartment"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                {/* City & Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.city}
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Bangkok"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postalCode}
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="10110"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.notes}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Special instructions or requests..."
                  />
                </div>

                {/* Contact Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-500 text-xl">📧</div>
                    <div>
                      <p className="text-blue-800 font-medium text-sm">
                        Order Confirmation Process
                      </p>
                      <p className="text-blue-700 text-sm mt-1">
                        {t.contactInfo}
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-0">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t.orderSummary}</h3>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="font-medium text-gray-800">{item.name}</div>
                          <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-medium text-gray-800">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-300 pt-4 mb-6">
                  <div className="flex justify-between items-center text-xl font-bold text-gray-800">
                    <span>{t.total}</span>
                    <span>฿{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t.processing : t.submitOrder}
                  </button>
                  
                  <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-full bg-gray-200 text-gray-800 py-3 rounded-2xl font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
