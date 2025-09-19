import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  User, 
  Phone, 
  Mail, 
  MessageSquare,
  Truck,
  Star,
  Heart,
  Zap,
  ArrowLeft,
  CheckCircle,
  Package
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { getCart, getCartTotal, clearCart } from '../utils/cart';
import { supabase } from '../lib/supabase';
import type { PageKey } from '../App';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
}

interface CheckoutFormProps {
  navigateTo?: (page: PageKey) => void;
}

export default function CheckoutForm({ navigateTo }: CheckoutFormProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingProvince: '',
    shippingPostal: '',
    notes: ''
  });

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = () => {
    const items = getCart();
    const totalAmount = getCartTotal();
    setCartItems(items);
    setTotal(totalAmount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateOrderNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.getTime().toString().slice(-4);
    return `DBB-${dateStr}-${timeStr}`;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다!');
      return;
    }

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      alert('필수 정보를 모두 입력해주세요!');
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrderNumber = generateOrderNumber();
      
      // 주문 데이터 생성
      const orderData = {
        order_number: newOrderNumber,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        shipping_address: formData.shippingAddress,
        shipping_city: formData.shippingCity,
        shipping_province: formData.shippingProvince,
        shipping_postal_code: formData.shippingPostal,
        customer_notes: formData.notes,
        subtotal: total,
        shipping_cost: 0,
        discount_amount: 0,
        total_amount: total,
        status: 'pending'
      };

      const insertBuilder: any = supabase.from('orders').insert(orderData);
      let createdOrderId: string | null = null;
      let createdOrderNumber = newOrderNumber;

      if (typeof insertBuilder.select === 'function') {
        const { data: orderRow, error: orderError } = await insertBuilder.select().single();
        if (orderError) throw orderError;
        createdOrderId = orderRow?.id ?? null;
        createdOrderNumber = orderRow?.order_number ?? createdOrderNumber;
      } else {
        const { data: insertedRows, error: insertError } = await insertBuilder;
        if (insertError) throw insertError;
        const orderRow = Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;
        createdOrderId = orderRow?.id ?? null;
      }

      if (!createdOrderId) {
        throw new Error('주문 ID를 가져오지 못했습니다.');
      }

      const orderItems = cartItems.map((item) => ({
        order_id: createdOrderId,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      if (orderItems.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // 성공 처리
      setOrderNumber(createdOrderNumber);
      setOrderComplete(true);
      clearCart();

    } catch (error) {
      console.error('Order submission error:', error);
      alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 주문 완료 화면
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#FF2D55]/20 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-[#11162A]/80 backdrop-blur-xl border-[#334155] shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-[#00FF88] rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-10 h-10 text-black" />
              </div>
              
              <h1 className="font-fredoka text-4xl font-bold text-white mb-4">
                주문 완료! 🎉
              </h1>
              
              <p className="text-[#B8C4DB] text-lg mb-6">
                주문이 성공적으로 접수되었습니다.
              </p>
              
              <div className="bg-[#1E293B] rounded-2xl p-6 mb-8 border border-[#334155]">
                <p className="text-[#94A3C4] text-sm mb-2">주문번호</p>
                <p className="font-mono text-2xl font-bold text-[#00FF88]">{orderNumber}</p>
              </div>
              
              <div className="space-y-3 mb-8">
                <p className="text-[#B8C4DB]">
                  <Phone className="w-4 h-4 inline mr-2" />
                  확인 연락을 드릴 예정입니다.
                </p>
                <p className="text-[#B8C4DB]">
                  <Mail className="w-4 h-4 inline mr-2" />
                  주문 확인 메일을 발송했습니다.
                </p>
                <p className="text-[#B8C4DB]">
                  <Package className="w-4 h-4 inline mr-2" />
                  준비 완료 후 배송해드립니다.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigateTo?.('home')}
                  className="bg-[#007AFF] hover:bg-[#0051D5] text-white px-8 py-3 rounded-2xl font-bold transform hover:scale-105 transition-all"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  홈으로 돌아가기
                </Button>
                <Button
                  onClick={() => navigateTo?.('products')}
                  className="bg-[#FF2D55] hover:bg-[#FF1744] text-white px-8 py-3 rounded-2xl font-bold transform hover:scale-105 transition-all"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  더 많은 제품 보기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#1a1f2e] to-[#2a2f3e]">
      {/* 페이지 헤더 */}
      <header className="bg-gradient-to-r from-[#11162A] to-[#1E293B] border-b border-[#334155] sticky top-0 z-50 shadow-2xl backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigateTo?.('home')}
                className="flex items-center space-x-2 text-white hover:text-[#00FF88] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">돌아가기</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF2D55] to-[#FF6B9D] rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-fredoka text-2xl font-bold text-white">체크아웃</h1>
                <p className="text-[#94A3C4] text-sm">안전한 결제 진행</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="bg-[#00FF88] text-black px-4 py-2 rounded-full font-bold text-sm">
                총 {cartItems.length}개 상품
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">

        {/* 진행 상태 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#00FF88] rounded-full flex items-center justify-center text-black font-bold text-sm">1</div>
              <span className="ml-2 text-white font-medium">장바구니</span>
            </div>
            <div className="w-12 h-0.5 bg-[#00FF88]"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#007AFF] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
              <span className="ml-2 text-[#007AFF] font-medium">주문 정보</span>
            </div>
            <div className="w-12 h-0.5 bg-[#334155]"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#334155] rounded-full flex items-center justify-center text-[#64748B] font-bold text-sm">3</div>
              <span className="ml-2 text-[#64748B] font-medium">완료</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 주문 정보 폼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 고객 정보 카드 */}
            <Card className="bg-[#11162A]/90 backdrop-blur-xl border-[#334155] shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-white text-xl font-bold">
                  <User className="w-5 h-5 mr-3 text-[#007AFF]" />
                  고객 정보
                </CardTitle>
                <CardDescription className="text-[#94A3C4]">
                  주문자 정보를 입력해주세요
                </CardDescription>
              </CardHeader>
            
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName" className="text-[#B8C4DB] font-medium">
                        이름 *
                      </Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="bg-[#1E293B] border-[#334155] text-white placeholder-[#64748B] focus:border-[#007AFF] focus:ring-[#007AFF]"
                        placeholder="홍길동"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="customerPhone" className="text-[#B8C4DB] font-medium">
                        전화번호 *
                      </Label>
                      <Input
                        id="customerPhone"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        className="bg-[#1E293B] border-[#334155] text-white placeholder-[#64748B] focus:border-[#007AFF] focus:ring-[#007AFF]"
                        placeholder="010-1234-5678"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="customerEmail" className="text-[#B8C4DB] font-medium">
                      이메일 *
                    </Label>
                    <Input
                      id="customerEmail"
                      name="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="bg-[#1E293B] border-[#334155] text-white placeholder-[#64748B] focus:border-[#007AFF] focus:ring-[#007AFF]"
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 배송 정보 카드 */}
            <Card className="bg-[#11162A]/90 backdrop-blur-xl border-[#334155] shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-white text-xl font-bold">
                  <Truck className="w-5 h-5 mr-3 text-[#FF2D55]" />
                  배송 정보
                </CardTitle>
                <CardDescription className="text-[#94A3C4]">
                  배송받을 주소를 입력해주세요
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                  
                  <div>
                    <Label htmlFor="shippingAddress" className="text-[#B8C4DB] font-medium">
                      주소
                    </Label>
                    <Input
                      id="shippingAddress"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      className="bg-[#1E293B] border-[#334155] text-white placeholder-[#64748B] focus:border-[#007AFF] focus:ring-[#007AFF]"
                      placeholder="방콕시 수쿰빗로 123"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="shippingCity" className="text-[#B8C4DB] font-medium">
                        도시
                      </Label>
                      <Input
                        id="shippingCity"
                        name="shippingCity"
                        value={formData.shippingCity}
                        onChange={handleInputChange}
                        className="bg-[#1E293B] border-[#334155] text-white placeholder-[#64748B] focus:border-[#007AFF] focus:ring-[#007AFF]"
                        placeholder="방콕"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingProvince" className="text-[#B8C4DB] font-medium">
                        주/도
                      </Label>
                      <Input
                        id="shippingProvince"
                        name="shippingProvince"
                        value={formData.shippingProvince}
                        onChange={handleInputChange}
                        className="bg-[#1E293B] border-[#334155] text-white placeholder-[#64748B] focus:border-[#007AFF] focus:ring-[#007AFF]"
                        placeholder="수쿰빗"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="shippingPostal" className="text-[#B8C4DB] font-medium">
                        우편번호
                      </Label>
                      <Input
                        id="shippingPostal"
                        name="shippingPostal"
                        value={formData.shippingPostal}
                        onChange={handleInputChange}
                        className="bg-[#1E293B] border-[#334155] text-white placeholder-[#64748B] focus:border-[#007AFF] focus:ring-[#007AFF]"
                        placeholder="10110"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 특별 요청사항 카드 */}
            <Card className="bg-[#11162A]/90 backdrop-blur-xl border-[#334155] shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-white text-xl font-bold">
                  <MessageSquare className="w-5 h-5 mr-3 text-[#FFD700]" />
                  특별 요청사항
                </CardTitle>
                <CardDescription className="text-[#94A3C4]">
                  배송 시 주의사항이나 요청사항을 적어주세요 (선택)
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="bg-[#1E293B] border-[#334155] text-white placeholder-[#64748B] focus:border-[#007AFF] focus:ring-[#007AFF] min-h-[120px] resize-none"
                  placeholder="예: 문 앞에 놓아주세요, 오후 2시 이후 배송 부탁드립니다..."
                />
              </CardContent>
            </Card>
          </div>

          {/* 주문 요약 사이드바 */}
          <div className="space-y-6">
            <Card className="bg-[#11162A]/90 backdrop-blur-xl border-[#334155] shadow-2xl sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-white text-xl font-bold">
                  <ShoppingCart className="w-5 h-5 mr-3 text-[#00FF88]" />
                  주문 요약
                </CardTitle>
                <CardDescription className="text-[#94A3C4]">
                  {cartItems.length}개 상품 • 총 {total.toLocaleString()}원
                </CardDescription>
              </CardHeader>
            
            <CardContent className="space-y-6">
              {/* 상품 목록 */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 text-[#64748B] mx-auto mb-4" />
                    <p className="text-[#64748B] text-lg">장바구니가 비어있습니다</p>
                    <Button
                      onClick={() => navigateTo?.('products')}
                      className="mt-4 bg-[#007AFF] hover:bg-[#0051D5] text-white"
                    >
                      쇼핑 계속하기
                    </Button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-[#1E293B] rounded-xl border border-[#334155]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{item.name}</h4>
                        {item.color && (
                          <div className="flex items-center mt-1">
                            <div 
                              className="w-4 h-4 rounded-full mr-2"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-[#94A3C4] text-sm">컬러</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="bg-[#334155] text-[#B8C4DB]">
                            수량: {item.quantity}
                          </Badge>
                          <span className="font-bold text-[#00FF88]">
                            ฿{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <>
                  {/* 가격 요약 */}
                  <div className="space-y-3 p-4 bg-[#1E293B] rounded-xl border border-[#334155]">
                    <div className="flex justify-between text-[#B8C4DB]">
                      <span>소계</span>
                      <span>฿{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#B8C4DB]">
                      <span>배송비</span>
                      <span className="text-[#00FF88]">무료</span>
                    </div>
                    <hr className="border-[#334155]" />
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>총 금액</span>
                      <span className="text-[#00FF88]">฿{total.toFixed(2)}</span>
                    </div>
                  </div>

                </>
              )}
            </CardContent>
            </Card>

            {/* 주문 완료 버튼 카드 */}
            <Card className="bg-gradient-to-r from-[#FF2D55]/20 to-[#FF1744]/20 backdrop-blur-xl border-[#FF2D55]/30 shadow-2xl">
              <CardContent className="p-6 space-y-4">
                <Button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full bg-gradient-to-r from-[#FF2D55] to-[#FF1744] hover:from-[#FF1744] hover:to-[#E91E63] text-white font-bold py-4 text-lg rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      주문 처리 중...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Zap className="w-5 h-5 mr-2" />
                      ฿{total.toFixed(2)} 주문 완료하기
                    </div>
                  )}
                </Button>
                
                <Button
                  onClick={() => navigateTo?.('products')}
                  variant="outline"
                  className="w-full border-[#334155] text-[#B8C4DB] hover:bg-[#1E293B] hover:text-white py-3 rounded-2xl transition-all"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  계속 쇼핑하기
                </Button>
                
                <div className="text-center pt-2">
                  <p className="text-[#64748B] text-xs">
                    🔒 SSL 보안 결제 • 안전한 개인정보 보호
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gradient-to-r from-[#11162A] to-[#1E293B] border-t border-[#334155] mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 보안 정보 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-[#00FF88] rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-bold text-white mb-2">안전한 결제</h3>
              <p className="text-[#94A3C4] text-sm">SSL 암호화로 보호되는 안전한 결제 시스템</p>
            </div>
            
            {/* 배송 정보 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-[#007AFF] rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">빠른 배송</h3>
              <p className="text-[#94A3C4] text-sm">주문 후 1-2일 내 신속 배송</p>
            </div>
            
            {/* 고객 지원 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-[#FF2D55] rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">고객 지원</h3>
              <p className="text-[#94A3C4] text-sm">언제든지 문의해 주세요</p>
            </div>
          </div>
          
          <div className="border-t border-[#334155] mt-8 pt-6 text-center">
            <p className="text-[#64748B] text-sm">
              © 2024 Daddy Bath Bomb. 모든 권리 보유. 
              <span className="mx-2">|</span>
              안전하고 즐거운 쇼핑을 위해 최선을 다하겠습니다.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
