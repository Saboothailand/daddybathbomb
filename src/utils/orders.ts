// 주문 관리 유틸리티
const ORDERS_KEY = 'daddy_bath_bomb_orders';

// 주문 상태
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing', 
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// 주문 상태 라벨
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending Review',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.COMPLETED]: 'Completed',
  [ORDER_STATUS.CANCELLED]: 'Cancelled'
};

// 주문 상태 색상
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.PROCESSING]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800'
};

// 주문 ID 생성
export const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `DB-${timestamp}-${random}`.toUpperCase();
};

// 모든 주문 가져오기 (관리자용)
export const getAllOrders = () => {
  const orders = localStorage.getItem(ORDERS_KEY);
  return orders ? JSON.parse(orders) : [];
};

// 새 주문 생성
export const createOrder = (orderData) => {
  const orders = getAllOrders();
  
  const newOrder = {
    id: generateOrderId(),
    status: ORDER_STATUS.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...orderData
  };
  
  orders.unshift(newOrder); // 최신 주문을 맨 앞에
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  
  return newOrder;
};

// 주문 상태 업데이트
export const updateOrderStatus = (orderId, status, notes = '') => {
  const orders = getAllOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    if (notes) {
      orders[orderIndex].adminNotes = notes;
    }
    
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return orders[orderIndex];
  }
  
  return null;
};

// 주문 상세 정보 업데이트
export const updateOrder = (orderId, updateData) => {
  const orders = getAllOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex !== -1) {
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return orders[orderIndex];
  }
  
  return null;
};

// 주문 삭제
export const deleteOrder = (orderId) => {
  const orders = getAllOrders();
  const filteredOrders = orders.filter(order => order.id !== orderId);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(filteredOrders));
  return true;
};

// 주문 통계
export const getOrderStats = () => {
  const orders = getAllOrders();
  
  return {
    total: orders.length,
    pending: orders.filter(o => o.status === ORDER_STATUS.PENDING).length,
    processing: orders.filter(o => o.status === ORDER_STATUS.PROCESSING).length,
    completed: orders.filter(o => o.status === ORDER_STATUS.COMPLETED).length,
    cancelled: orders.filter(o => o.status === ORDER_STATUS.CANCELLED).length,
    totalRevenue: orders
      .filter(o => o.status === ORDER_STATUS.COMPLETED)
      .reduce((sum, order) => sum + (order.total || 0), 0)
  };
};
