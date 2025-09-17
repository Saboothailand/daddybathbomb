// 장바구니 유틸리티 - IP 기반 로컬 스토리지
const CART_KEY = 'daddy_bath_bomb_cart';

// 사용자 IP를 가져오는 함수 (실제로는 서버에서 처리해야 함)
export const getUserId = () => {
  // 임시로 브라우저 fingerprint 사용
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('user_id', userId);
  }
  return userId;
};

// 장바구니 데이터 가져오기
export const getCart = () => {
  const userId = getUserId();
  const cartData = localStorage.getItem(`${CART_KEY}_${userId}`);
  return cartData ? JSON.parse(cartData) : [];
};

// 장바구니에 아이템 추가
export const addToCart = (product, quantity = 1) => {
  const userId = getUserId();
  const cart = getCart();
  
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      addedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem(`${CART_KEY}_${userId}`, JSON.stringify(cart));
  return cart;
};

// 장바구니 아이템 수량 업데이트
export const updateCartItemQuantity = (productId, quantity) => {
  const userId = getUserId();
  const cart = getCart();
  
  const item = cart.find(item => item.id === productId);
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
    localStorage.setItem(`${CART_KEY}_${userId}`, JSON.stringify(cart));
  }
  
  return cart;
};

// 장바구니에서 아이템 제거
export const removeFromCart = (productId) => {
  const userId = getUserId();
  const cart = getCart().filter(item => item.id !== productId);
  localStorage.setItem(`${CART_KEY}_${userId}`, JSON.stringify(cart));
  return cart;
};

// 장바구니 비우기
export const clearCart = () => {
  const userId = getUserId();
  localStorage.removeItem(`${CART_KEY}_${userId}`);
  return [];
};

// 장바구니 총 개수
export const getCartItemCount = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// 장바구니 총 가격
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};
