import React, { useState } from 'react';
import { Package, ShoppingCart, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'สมชาย ใจดี',
    email: 'somchai@example.com',
    phone: '081-234-5678',
    status: 'pending',
    total: 590,
    items: [
      { name: 'Rainbow Bath Bomb', quantity: 2, price: 295 }
    ],
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'ORD-002',
    customerName: 'สมหญิง สวยงาม',
    email: 'somying@example.com',
    phone: '082-345-6789',
    status: 'processing',
    total: 1180,
    items: [
      { name: 'Lavender Bath Bomb', quantity: 3, price: 295 },
      { name: 'Rose Bath Bomb', quantity: 1, price: 295 }
    ],
    createdAt: '2024-01-14T15:45:00Z'
  },
  {
    id: 'ORD-003',
    customerName: 'John Smith',
    email: 'john@example.com',
    phone: '083-456-7890',
    status: 'shipped',
    total: 885,
    items: [
      { name: 'Vanilla Bath Bomb', quantity: 3, price: 295 }
    ],
    createdAt: '2024-01-13T09:15:00Z'
  }
];

const statusConfig = {
  pending: { label: 'รอดำเนินการ', color: 'bg-yellow-500', icon: Clock },
  processing: { label: 'กำลังเตรียม', color: 'bg-blue-500', icon: Package },
  shipped: { label: 'จัดส่งแล้ว', color: 'bg-purple-500', icon: ShoppingCart },
  delivered: { label: 'ส่งสำเร็จ', color: 'bg-green-500', icon: CheckCircle },
  cancelled: { label: 'ยกเลิก', color: 'bg-red-500', icon: XCircle }
};

export default function OrderManagement() {
  const [orders] = useState<Order[]>(mockOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Order Management</h2>
          <p className="text-gray-400">จัดการคำสั่งซื้อของลูกค้า</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#151B2E] border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
          >
            <option value="all">ทั้งหมด</option>
            <option value="pending">รอดำเนินการ</option>
            <option value="processing">กำลังเตรียม</option>
            <option value="shipped">จัดส่งแล้ว</option>
            <option value="delivered">ส่งสำเร็จ</option>
            <option value="cancelled">ยกเลิก</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#11162A] border-gray-600">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  รอดำเนินการ
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-white mt-2">
                  {orders.filter(o => o.status === 'pending').length}
                </CardDescription>
              </div>
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-[#11162A] border-gray-600">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  กำลังเตรียม
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-white mt-2">
                  {orders.filter(o => o.status === 'processing').length}
                </CardDescription>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-[#11162A] border-gray-600">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  จัดส่งแล้ว
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-white mt-2">
                  {orders.filter(o => o.status === 'shipped').length}
                </CardDescription>
              </div>
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-[#11162A] border-gray-600">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  ยอดรวม
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-white mt-2">
                  {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
                </CardDescription>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="bg-[#11162A] border-gray-600">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">ไม่มีคำสั่งซื้อ</h3>
              <p className="text-gray-400">ยังไม่มีคำสั่งซื้อในสถานะที่เลือก</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
            return (
              <Card key={order.id} className="bg-[#11162A] border-gray-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${statusConfig[order.status].color} flex items-center justify-center`}>
                          <StatusIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white font-semibold">
                            {order.id}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {formatDate(order.createdAt)}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={`${statusConfig[order.status].color} text-white`}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {formatPrice(order.total)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-2">ข้อมูลลูกค้า</h4>
                      <div className="space-y-1 text-sm text-gray-300">
                        <p><strong>ชื่อ:</strong> {order.customerName}</p>
                        <p><strong>อีเมล:</strong> {order.email}</p>
                        <p><strong>เบอร์โทร:</strong> {order.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">รายการสินค้า</h4>
                      <div className="space-y-1 text-sm text-gray-300">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.name} x{item.quantity}</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-600">
                    <Button size="sm" className="bg-[#007AFF] hover:bg-[#0051D5]">
                      ดูรายละเอียด
                    </Button>
                    {order.status === 'pending' && (
                      <Button size="sm" className="bg-[#00FF88] hover:bg-[#00CC6A] text-black">
                        เริ่มเตรียม
                      </Button>
                    )}
                    {order.status === 'processing' && (
                      <Button size="sm" className="bg-[#AF52DE] hover:bg-[#8B2BFF] text-white">
                        จัดส่ง
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
