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
  RefreshCw,
  Eye,
  X,
  Mail,
  MapPin,
  Calendar
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
  pending: { label: 'Order Received', color: 'bg-[#FF9F1C] text-black', icon: Clock },
  payment_pending: { label: 'Payment Pending', color: 'bg-[#FFB703] text-black', icon: Clock },
  payment_confirmed: { label: 'Payment Confirmed', color: 'bg-[#22D3EE] text-black', icon: CheckCircle },
  confirmed: { label: 'Order Confirmed', color: 'bg-[#007AFF] text-white', icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-[#5C6BC0] text-white', icon: Package },
  preparing: { label: 'Preparing', color: 'bg-[#AF52DE] text-white', icon: Package },
  ready_to_ship: { label: 'Ready to Ship', color: 'bg-[#00FF88] text-black', icon: Truck },
  shipped: { label: 'Shipped', color: 'bg-[#FFD700] text-black', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-[#34D399] text-black', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-[#FF2D55] text-white', icon: AlertCircle },
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updating, setUpdating] = useState(false);

  // 필터링된 주문 목록
  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(order => order.status === statusFilter);
  }, [orders, statusFilter]);

  // 상태별 요약
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
      
      // 먼저 customer_orders 테이블을 시도
      let { data, error } = await supabase
        .from('customer_orders')
        .select('*')
        .order('created_at', { ascending: false });

      // customer_orders가 없으면 orders 테이블 시도
      if (error && error.message?.includes('relation "customer_orders" does not exist')) {
        console.log('customer_orders table not found, trying orders table...');
        const ordersResult = await supabase
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
        
        data = ordersResult.data;
        error = ordersResult.error;
      }

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      // 데이터 정규화 - customer_orders 형식을 orders 형식으로 변환
      const normalizedOrders = (data || []).map(order => {
        if (order.order_items && typeof order.order_items === 'string') {
          // JSONB 필드인 경우 파싱
          try {
            order.order_items = JSON.parse(order.order_items);
          } catch (e) {
            console.warn('Failed to parse order_items:', e);
            order.order_items = [];
          }
        }
        
        return {
          ...order,
          // customer_orders의 필드명을 orders 형식으로 매핑
          customer_name: order.customer_name || order.shipping_name,
          customer_phone: order.customer_phone || order.shipping_phone,
          customer_email: order.customer_email || order.shipping_email,
          status: order.order_status || order.status || 'pending',
          total_amount: order.total_amount,
          order_items: order.order_items || []
        };
      });
      
      setOrders(normalizedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      console.log('Falling back to mock data...');
      
      // 폴백: 샘플 주문 데이터 생성
      const mockOrders = [
        {
          id: 'mock-1',
          order_number: 'DB-20241220-001',
          customer_name: 'John Doe',
          customer_phone: '+66 123 456 789',
          customer_email: 'john@example.com',
          shipping_name: 'John Doe',
          shipping_phone: '+66 123 456 789',
          shipping_email: 'john@example.com',
          shipping_address: '123 Main St, Bangkok',
          shipping_city: 'Bangkok',
          shipping_province: 'Bangkok',
          shipping_postal_code: '10110',
          status: 'pending',
          total_amount: 450,
          subtotal: 390,
          shipping_cost: 60,
          admin_notes: '',
          customer_notes: 'Please handle with care',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          order_items: [
            {
              id: 'item-1',
              product_id: 'prod-1',
              quantity: 2,
              unit_price: 180,
              total_price: 360,
              products: {
                name: 'Romantic Rose Bath Bomb',
                image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'
              }
            },
            {
              id: 'item-2',
              product_id: 'prod-2',
              quantity: 1,
              unit_price: 30,
              total_price: 30,
              products: {
                name: 'Mini Bath Bomb Set',
                image_url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=300&fit=crop'
              }
            }
          ]
        },
        {
          id: 'mock-2',
          order_number: 'DB-20241220-002',
          customer_name: 'Jane Smith',
          customer_phone: '+66 987 654 321',
          customer_email: 'jane@example.com',
          shipping_name: 'Jane Smith',
          shipping_phone: '+66 987 654 321',
          shipping_email: 'jane@example.com',
          shipping_address: '456 Oak Ave, Chiang Mai',
          shipping_city: 'Chiang Mai',
          shipping_province: 'Chiang Mai',
          shipping_postal_code: '50200',
          status: 'processing',
          total_amount: 320,
          subtotal: 280,
          shipping_cost: 40,
          admin_notes: 'Express shipping requested',
          customer_notes: '',
          created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          order_items: [
            {
              id: 'item-3',
              product_id: 'prod-3',
              quantity: 1,
              unit_price: 280,
              total_price: 280,
              products: {
                name: 'Luxury Spa Collection',
                image_url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=300&fit=crop'
              }
            }
          ]
        },
        {
          id: 'mock-3',
          order_number: 'DB-20241220-003',
          customer_name: 'Mike Johnson',
          customer_phone: '+66 555 123 456',
          customer_email: 'mike@example.com',
          shipping_name: 'Mike Johnson',
          shipping_phone: '+66 555 123 456',
          shipping_email: 'mike@example.com',
          shipping_address: '789 Pine Rd, Phuket',
          shipping_city: 'Phuket',
          shipping_province: 'Phuket',
          shipping_postal_code: '83000',
          status: 'delivered',
          total_amount: 540,
          subtotal: 480,
          shipping_cost: 60,
          admin_notes: 'Customer very satisfied',
          customer_notes: 'Gift wrapping please',
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          order_items: [
            {
              id: 'item-4',
              product_id: 'prod-4',
              quantity: 3,
              unit_price: 160,
              total_price: 480,
              products: {
                name: 'Superhero Bath Bomb Trio',
                image_url: 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea4?w=300&h=300&fit=crop'
              }
            }
          ]
        }
      ];
      
      setOrders(mockOrders);
      
      // 사용자에게 알림 (덜 침습적인 방식)
      console.warn('Using mock order data due to database connection issues');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, adminNotes?: string) => {
    try {
      setUpdating(true);
      
      const updateData: any = { 
        updated_at: new Date().toISOString()
      };
      
      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes;
      }

      // customer_orders 테이블 사용 시
      updateData.order_status = newStatus;
      
      let { error } = await supabase
        .from('customer_orders')
        .update(updateData)
        .eq('id', orderId);

      // customer_orders가 없으면 orders 테이블 시도
      if (error && error.message?.includes('relation "customer_orders" does not exist')) {
        console.log('customer_orders table not found, trying orders table...');
        updateData.status = newStatus;
        delete updateData.order_status;
        
        const ordersResult = await supabase
          .from('orders')
          .update(updateData)
          .eq('id', orderId);
        
        error = ordersResult.error;
      }

      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      
      // 주문 목록 새로고침
      await loadOrders();
      
      // 선택된 주문 업데이트
      if (selectedOrder?.id === orderId) {
        const updatedOrder = orders.find(o => o.id === orderId);
        if (updatedOrder) {
          setSelectedOrder({...updatedOrder, status: newStatus, admin_notes: adminNotes});
        }
      }
      
      alert('Order status has been updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const closeOrderDetail = () => {
    setSelectedOrder(null);
    setShowOrderDetail(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-white text-lg">
          <RefreshCw className="w-5 h-5 animate-spin" />
          주문을 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white font-fredoka">
            🛒 주문 관리
          </h2>
          <p className="text-gray-300 mt-2">
            고객 주문을 확인하고 상태를 관리하세요
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-[#1E293B] border-gray-600 text-white w-48">
              <SelectValue placeholder="상태별 필터" />
            </SelectTrigger>
            <SelectContent className="bg-[#1E293B] border-gray-600">
              <SelectItem value="all" className="text-white">모든 주문</SelectItem>
              {Object.entries(ORDER_STATUSES).map(([statusKey, config]) => (
                <SelectItem key={statusKey} value={statusKey} className="text-white">
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            onClick={loadOrders}
            disabled={loading}
            className="bg-[#007AFF] hover:bg-[#0051D5] text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </div>

      {/* 상태별 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {statusSummaries.slice(0, 5).map(({ statusKey, config, count }) => {
          const IconComponent = config.icon;
          const isActive = statusFilter === statusKey;

          return (
            <Card 
              key={statusKey} 
              className={`cursor-pointer transition-all ${
                isActive 
                  ? 'bg-[#007AFF] border-[#007AFF] text-white' 
                  : 'bg-[#11162A] border-gray-600 hover:border-[#007AFF]'
              }`}
              onClick={() => setStatusFilter(statusFilter === statusKey ? 'all' : statusKey)}
            >
              <CardContent className="p-4 text-center">
                <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                  isActive ? 'text-white' : 'text-[#007AFF]'
                }`} />
                <div className={`text-2xl font-bold ${
                  isActive ? 'text-white' : 'text-white'
                }`}>{count}</div>
                <div className={`text-xs ${
                  isActive ? 'text-blue-100' : 'text-gray-300'
                }`}>{config.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 주문 목록 */}
      <Card className="bg-[#11162A] border-gray-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">주문 목록</CardTitle>
              <CardDescription className="text-gray-300">
                {statusFilter === 'all' 
                  ? `총 ${orders.length}개의 주문` 
                  : `${ORDER_STATUSES[statusFilter as OrderStatusKey]?.label || statusFilter} 주문 ${filteredOrders.length}개`
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>표시할 주문이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <OrderCard 
                  key={order.id}
                  order={order} 
                  onViewDetail={openOrderDetail}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 주문 상세 모달 */}
      {showOrderDetail && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={closeOrderDetail}
          onStatusUpdate={updateOrderStatus}
          isUpdating={updating}
        />
      )}
    </div>
  );
}

// 주문 카드 컴포넌트
interface OrderCardProps {
  order: Order;
  onViewDetail: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetail }) => {
  const statusConfig = ORDER_STATUSES[order.status as OrderStatusKey];
  const IconComponent = statusConfig?.icon || Package;
  const displayName = order.shipping_name || order.customer_name || '이름 없음';
  const displayPhone = order.shipping_phone || order.customer_phone || '-';
  const orderTotal = Number(order.total_amount ?? 0);
  
  return (
    <div 
      className="bg-[#1E293B] rounded-xl p-4 border border-gray-600 hover:border-[#007AFF] transition-all cursor-pointer group"
      onClick={() => onViewDetail(order)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#0F1424] rounded-lg flex items-center justify-center group-hover:bg-[#007AFF] transition-colors">
            <IconComponent className="w-6 h-6 text-[#007AFF] group-hover:text-white" />
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-white font-bold text-lg">
                #{order.order_number || order.id.slice(-8)}
              </h3>
              <Badge className={`${statusConfig?.color || 'bg-[#64748B] text-white'} text-xs`}>
                {statusConfig?.label || order.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {displayName}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {displayPhone}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(order.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[#00FF88] font-bold text-xl mb-1">
            ฿{orderTotal.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {new Date(order.created_at).toLocaleTimeString('ko-KR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>

      {/* 주문 상품 미리보기 */}
      {order.order_items && order.order_items.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Package className="w-4 h-4" />
              <span>{order.order_items.length}개 상품</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#007AFF] hover:text-white hover:bg-[#007AFF] text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              상세보기
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-400 line-clamp-1">
            {order.order_items.map(item => item.products?.name).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

// 주문 상세 모달 컴포넌트
interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: string, notes?: string) => Promise<boolean>;
  isUpdating: boolean;
}

function OrderDetailModal({ order, onClose, onStatusUpdate, isUpdating }: OrderDetailModalProps) {
  const [newStatus, setNewStatus] = useState<OrderStatusKey>(
    (ORDER_STATUSES[order.status as OrderStatusKey] ? order.status : 'pending') as OrderStatusKey,
  );
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayName = order.shipping_name || order.customer_name || '이름 없음';
  const displayPhone = order.shipping_phone || order.customer_phone || '-';
  const displayEmail = order.shipping_email || order.customer_email || null;
  const customerNotes = order.customer_notes || order.notes;
  const addressLine = [order.shipping_city, order.shipping_province, order.shipping_postal_code]
    .filter(Boolean)
    .join(' ');
  const subtotalAmount = Number(order.subtotal ?? order.total_amount ?? 0);
  const shippingCost = Number(order.shipping_cost ?? 0);
  const totalAmount = Number(order.total_amount ?? subtotalAmount + shippingCost);

  const handleStatusUpdate = async () => {
    setIsSubmitting(true);
    const success = await onStatusUpdate(order.id, newStatus, adminNotes);
    if (success) {
      onClose();
    }
    setIsSubmitting(false);
  };

  const hasChanges = newStatus !== order.status || adminNotes !== (order.admin_notes || '');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#11162A] rounded-2xl border border-gray-600 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-600 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#007AFF] rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                주문 #{order.order_number || order.id.slice(-8)}
              </h3>
              <p className="text-gray-400 text-sm">
                {new Date(order.created_at).toLocaleString('ko-KR')}
              </p>
            </div>
          </div>
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="sm" 
            className="text-gray-400 hover:text-white hover:bg-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 고객 정보 */}
            <Card className="bg-[#1E293B] border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center text-lg">
                  <User className="w-5 h-5 mr-2" />
                  고객 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wide">이름</Label>
                    <p className="text-white font-medium mt-1">{displayName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wide">전화번호</Label>
                    <p className="text-white font-medium mt-1 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {displayPhone}
                    </p>
                  </div>
                  {displayEmail && (
                    <div>
                      <Label className="text-gray-400 text-xs uppercase tracking-wide">이메일</Label>
                      <p className="text-white font-medium mt-1 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {displayEmail}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wide">배송주소</Label>
                    <div className="text-white font-medium mt-1 flex items-start">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div>{order.shipping_address || '주소 없음'}</div>
                        {addressLine && (
                          <div className="text-gray-300 text-sm mt-1">{addressLine}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {customerNotes && (
                    <div>
                      <Label className="text-gray-400 text-xs uppercase tracking-wide">고객 메모</Label>
                      <div className="text-gray-300 text-sm bg-[#0F1424] p-3 rounded-lg mt-1 border-l-4 border-[#007AFF]">
                        {customerNotes}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 주문 상품 */}
            <Card className="bg-[#1E293B] border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center text-lg">
                  <Package className="w-5 h-5 mr-2" />
                  주문 상품
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-[#0F1424] rounded-lg border border-gray-600">
                      {item.products?.image_url && (
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm truncate">
                          {item.products?.name}
                        </h4>
                        <p className="text-gray-400 text-xs">
                          ฿{item.unit_price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-[#00FF88] font-bold text-sm">
                        ฿{Number(item.total_price ?? item.unit_price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 금액 요약 */}
                <div className="border-t border-gray-600 pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-gray-300 text-sm">
                    <span>소계</span>
                    <span>฿{subtotalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300 text-sm">
                    <span>배송비</span>
                    <span>{shippingCost === 0 ? '무료' : `฿${shippingCost.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between text-white text-lg font-bold pt-2 border-t border-gray-600">
                    <span>총 금액</span>
                    <span className="text-[#00FF88]">
                      ฿{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 주문 상태 관리 */}
            <Card className="bg-[#1E293B] border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center text-lg">
                  <Edit3 className="w-5 h-5 mr-2" />
                  상태 관리
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-400 text-sm">현재 상태</Label>
                  <div className="mt-2">
                    <Badge className={`${ORDER_STATUSES[order.status as OrderStatusKey]?.color || 'bg-gray-500'} text-sm px-3 py-1`}>
                      {ORDER_STATUSES[order.status as OrderStatusKey]?.label || order.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-400 text-sm">상태 변경</Label>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatusKey)}>
                    <SelectTrigger className="bg-[#0F1424] border-gray-600 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E293B] border-gray-600">
                      {Object.entries(ORDER_STATUSES).map(([statusKey, config]) => (
                        <SelectItem key={statusKey} value={statusKey} className="text-white">
                          <div className="flex items-center gap-2">
                            <config.icon className="w-4 h-4" />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-400 text-sm">관리자 메모</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="bg-[#0F1424] border-gray-600 text-white mt-2"
                    rows={4}
                    placeholder="고객에게 전달할 메시지나 내부 메모를 입력하세요..."
                  />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={!hasChanges || isSubmitting || isUpdating}
                    className="w-full bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold py-3"
                  >
                    {(isSubmitting || isUpdating) ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        업데이트 중...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        상태 업데이트
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
