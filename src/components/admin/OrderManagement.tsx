import React, { useEffect, useMemo, useState } from 'react';
import {
  Package,
  User,
  Phone,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Edit3,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { supabase } from '../../lib/supabase';
import { Label } from '../ui/label';

type OrderStatusKey =
  | 'pending'
  | 'payment_pending'
  | 'payment_confirmed'
  | 'confirmed'
  | 'processing'
  | 'preparing'
  | 'ready_to_ship'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

interface Order {
  id: string;
  order_number?: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  shipping_name?: string | null;
  shipping_phone?: string | null;
  shipping_email?: string | null;
  shipping_address?: string | null;
  shipping_city?: string | null;
  shipping_province?: string | null;
  shipping_postal_code?: string | null;
  customer_notes?: string | null;
  notes?: string | null;
  admin_notes?: string | null;
  subtotal?: number | null;
  shipping_cost?: number | null;
  total_amount: number | null;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  products?: {
    name: string;
    image_url: string;
  };
}

const ORDER_STATUSES: Record<OrderStatusKey, { label: string; color: string; icon: typeof Package }> = {
  pending: { label: '주문 접수', color: 'bg-[#FF9F1C] text-black', icon: Clock },
  payment_pending: { label: '입금 확인 대기', color: 'bg-[#FFB703] text-black', icon: Clock },
  payment_confirmed: { label: '결제 확인', color: 'bg-[#22D3EE] text-black', icon: CheckCircle },
  confirmed: { label: '주문 확인', color: 'bg-[#007AFF] text-gray-900', icon: CheckCircle },
  processing: { label: '주문 처리중', color: 'bg-[#5C6BC0] text-gray-900', icon: Package },
  preparing: { label: '상품 준비', color: 'bg-[#AF52DE] text-gray-900', icon: Package },
  ready_to_ship: { label: '배송 준비 완료', color: 'bg-[#00FF88] text-black', icon: Truck },
  shipped: { label: '배송 중', color: 'bg-[#FFD700] text-black', icon: Truck },
  delivered: { label: '배송 완료', color: 'bg-[#34D399] text-black', icon: CheckCircle },
  cancelled: { label: '주문 취소', color: 'bg-[#FF2D55] text-gray-900', icon: AlertCircle },
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  const statusSummaries = useMemo(
    () =>
      Object.entries(ORDER_STATUSES).map(([statusKey, config]) => ({
        statusKey: statusKey as OrderStatusKey,
        config,
        count: orders.filter((order) => order.status === statusKey).length,
      })),
    [orders],
  );

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            unit_price,
            total_price,
            products (
              name,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data as Order[] | null) ?? []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, adminNotes?: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      
      await loadOrders();
      alert('주문 상태가 업데이트되었습니다.');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('주문 상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white font-fredoka comic-shadow">
            🛒 주문 관리
          </h2>
          <p className="text-gray-300 text-lg mt-2">
            고객 주문을 확인하고 상태를 관리하세요
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={loadOrders}
            className="bg-[#007AFF] hover:bg-[#0051D5] text-white"
          >
            새로고침
          </Button>
        </div>
      </div>

      {/* 주문 상태 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {statusSummaries.map(({ statusKey, config, count }) => {
          const IconComponent = config.icon;

          return (
            <Card key={statusKey} className="bg-[#11162A] border-gray-600">
              <CardContent className="p-4 text-center">
                <IconComponent className="w-6 h-6 mx-auto mb-2 text-[#007AFF]" />
                <div className="text-2xl font-bold text-white">{count}</div>
                <div className="text-xs text-gray-300">{config.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 주문 목록 */}
      <Card className="bg-[#11162A] border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">최근 주문</CardTitle>
          <CardDescription className="text-gray-300">
            총 {orders.length}개의 주문
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = ORDER_STATUSES[order.status as OrderStatusKey];
              const IconComponent = statusConfig?.icon || Package;
              const displayName = order.shipping_name || order.customer_name || '미기재';
              const displayPhone = order.shipping_phone || order.customer_phone || '-';
              const orderTotal = Number(order.total_amount ?? 0);
              
              return (
                <div 
                  key={order.id}
                  className="bg-[#1E293B] rounded-xl p-4 border border-gray-200 hover:border-[#007AFF] transition-all cursor-pointer"
                  onClick={() => openOrderDetail(order)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#0F1424] rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-[#007AFF]" />
                      </div>
                      
                      <div>
                        <h3 className="text-white font-bold">{order.order_number ?? order.id}</h3>
                        <p className="text-gray-300 text-sm flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {displayName}
                          <Phone className="w-3 h-3 ml-3 mr-1" />
                          {displayPhone}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge className={`${statusConfig?.color || 'bg-[#64748B] text-white'} mb-2`}>
                        {statusConfig?.label || order.status}
                      </Badge>
                      <div className="text-[#00FF88] font-bold text-lg">
                        ฿{orderTotal.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {new Date(order.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* 주문 상품 미리보기 */}
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#64748B]" />
                        <span className="text-gray-300 text-sm">
                          {order.order_items.length}개 상품: {order.order_items.map(item => item.products?.name).join(', ')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 주문 상세 모달 */}
      {showOrderDetail && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowOrderDetail(false)}
          onStatusUpdate={(orderId, status, notes) => {
            updateOrderStatus(orderId, status, notes);
            setShowOrderDetail(false);
          }}
        />
      )}
    </div>
  );
}

// 주문 상세 모달 컴포넌트
interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: string, notes?: string) => void;
}

function OrderDetailModal({ order, onClose, onStatusUpdate }: OrderDetailModalProps) {
  const [newStatus, setNewStatus] = useState<OrderStatusKey>(
    (ORDER_STATUSES[order.status as OrderStatusKey] ? order.status : 'pending') as OrderStatusKey,
  );
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || '');
  const displayName = order.shipping_name || order.customer_name || '미기재';
  const displayPhone = order.shipping_phone || order.customer_phone || '-';
  const displayEmail = order.shipping_email || order.customer_email || null;
  const customerNotes = order.customer_notes || order.notes;
  const addressLine = [order.shipping_city, order.shipping_province, order.shipping_postal_code]
    .filter(Boolean)
    .join(' ');
  const subtotalAmount = Number(order.subtotal ?? order.total_amount ?? 0);
  const shippingCost = Number(order.shipping_cost ?? 0);
  const totalAmount = Number(order.total_amount ?? subtotalAmount + shippingCost);

  const handleStatusUpdate = () => {
    onStatusUpdate(order.id, newStatus, adminNotes);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#11162A] rounded-2xl border border-gray-600 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-600 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">
            주문 상세: {order.order_number ?? order.id}
          </h3>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-white">
            ✕
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 고객 정보 */}
            <Card className="bg-[#1a1f2e] border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  고객 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-gray-400 text-xs">이름</Label>
                  <p className="text-white font-medium">{displayName}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-xs">연락처</Label>
                  <p className="text-white font-medium">{displayPhone}</p>
                </div>
                {displayEmail && (
                  <div>
                    <Label className="text-gray-400 text-xs">이메일</Label>
                    <p className="text-white font-medium">{displayEmail}</p>
                  </div>
                )}
                <div>
                  <Label className="text-gray-400 text-xs">배송 주소</Label>
                  <p className="text-white font-medium">
                    {order.shipping_address || '미기재'}
                    {addressLine ? (
                      <>
                        <br />
                        {addressLine}
                      </>
                    ) : null}
                  </p>
                </div>
                {customerNotes && (
                  <div>
                    <Label className="text-[#64748B] text-xs">고객 메모</Label>
                    <p className="text-[#B8C4DB] text-sm bg-[#0F1424] p-3 rounded-lg">
                      {customerNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 주문 상품 */}
            <Card className="bg-[#1E293B] border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  주문 상품
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-[#0F1424] rounded-lg">
                      {item.products?.image_url && (
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="text-gray-900 font-medium">{item.products?.name}</h4>
                        <p className="text-[#B8C4DB] text-sm">
                          ฿{item.unit_price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-[#00FF88] font-bold">
                        ฿{Number(item.total_price ?? item.unit_price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  
                  {/* 금액 요약 */}
                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    <div className="flex justify-between text-[#B8C4DB]">
                      <span>상품 금액</span>
                      <span>฿{subtotalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#B8C4DB]">
                      <span>배송비</span>
                      <span>{shippingCost === 0 ? '무료' : `฿${shippingCost.toLocaleString()}`}</span>
                    </div>
                    <div className="flex justify-between text-gray-900 text-lg font-bold pt-2 border-t border-gray-200">
                      <span>총 금액</span>
                      <span className="text-[#00FF88]">
                        ฿{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 주문 상태 관리 */}
          <Card className="bg-[#1E293B] border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Edit3 className="w-5 h-5 mr-2" />
                주문 상태 관리
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-900 text-sm">주문 상태 변경</Label>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatusKey)}>
                    <SelectTrigger className="bg-[#0F1424] border-gray-200 text-gray-900 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E293B] border-gray-200">
                      {Object.entries(ORDER_STATUSES).map(([statusKey, config]) => (
                        <SelectItem key={statusKey} value={statusKey} className="text-gray-900">
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    onClick={handleStatusUpdate}
                    className="bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold w-full"
                  >
                    상태 업데이트
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-gray-900 text-sm">관리자 메모</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="bg-[#0F1424] border-gray-200 text-gray-900 mt-1"
                  rows={3}
                  placeholder="고객에게 전달할 메시지나 내부 메모를 입력하세요..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
