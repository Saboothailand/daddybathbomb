import React, { useState, useEffect } from 'react';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 샘플 제품 데이터 (추후 Supabase에서 가져올 예정)
  const sampleProducts = [
    {
      id: 1,
      name: 'บาธบอมลาเวนเดอร์',
      description: 'บาธบอมกลิ่นลาเวนเดอร์ผ่อนคลาย ช่วยให้นอนหลับง่าย',
      price: 150,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      category: 'ผ่อนคลาย',
      stock: 50,
      scent: 'ลาเวนเดอร์',
      weight: '100g',
      ingredients: 'น้ำมันลาเวนเดอร์, เบกกิ้งโซดา, กรดซิตริก'
    },
    {
      id: 2,
      name: 'บาธบอมโรส',
      description: 'บาธบอมกลิ่นกุหลาบโรแมนติก สำหรับคืนพิเศษ',
      price: 180,
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
      category: 'โรแมนติก',
      stock: 30,
      scent: 'กุหลาบ',
      weight: '100g',
      ingredients: 'น้ำมันกุหลาบ, เบกกิ้งโซดา, กรดซิตริก'
    },
    {
      id: 3,
      name: 'บาธบอมยูคาลิปตัส',
      description: 'บาธบอมกลิ่นยูคาลิปตัสสดชื่น ช่วยผ่อนคลายกล้ามเนื้อ',
      price: 160,
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
      category: 'สดชื่น',
      stock: 40,
      scent: 'ยูคาลิปตัส',
      weight: '100g',
      ingredients: 'น้ำมันยูคาลิปตัส, เบกกิ้งโซดา, กรดซิตริก'
    },
    {
      id: 4,
      name: 'บาธบอมวานิลลา',
      description: 'บาธบอมกลิ่นวานิลลาหวานหอม ให้ความรู้สึกอบอุ่น',
      price: 170,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&sig=1',
      category: 'หวานหอม',
      stock: 35,
      scent: 'วานิลลา',
      weight: '100g',
      ingredients: 'น้ำมันวานิลลา, เบกกิ้งโซดา, กรดซิตริก'
    }
  ];

  useEffect(() => {
    setProducts(sampleProducts);
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product) => {
    // 추후 장바구니 기능 구현
    alert(`เพิ่ม ${product.name} ลงในตะกร้าแล้ว!`);
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">สินค้าของเรา</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              บาธบอมคุณภาพสูงจากวัตถุดิบธรรมชาติ 100%
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Stock Badge */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      เหลือ {product.stock} ชิ้น
                    </div>
                  )}
                  
                  {product.stock === 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      หมด
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-pink-500/80 text-white px-2 py-1 rounded-full text-xs">
                    {product.category}
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                      className="bg-white text-gray-800 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium"
                    >
                      ดูรายละเอียด
                    </button>
                    
                    {product.stock > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors font-medium"
                      >
                        ใส่ตะกร้า
                      </button>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-blue-100 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-pink-300">
                      ฿{product.price.toLocaleString()}
                    </div>
                    
                    <div className="text-blue-200 text-sm">
                      {product.weight}
                    </div>
                  </div>

                  {/* Product Features */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                      <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                      กลิ่น: {product.scent}
                    </div>
                    
                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      ธรรมชาติ 100%
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                      className="w-full bg-white/20 text-white py-3 rounded-2xl hover:bg-white/30 transition-colors font-medium backdrop-blur-sm"
                    >
                      ดูรายละเอียด
                    </button>
                    
                    {product.stock > 0 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all font-medium shadow-lg"
                      >
                        ใส่ตะกร้า
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-400 text-gray-200 py-3 rounded-2xl cursor-not-allowed font-medium"
                      >
                        สินค้าหมด
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🛁</div>
              <h3 className="text-2xl font-bold text-white mb-4">กำลังเตรียมสินค้า</h3>
              <p className="text-blue-100">เร็วๆ นี้จะมีบาธบอมสุดพิเศษมาให้ชม!</p>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full aspect-square object-cover rounded-2xl"
                  />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-pink-600 mb-2">
                      ฿{selectedProduct.price.toLocaleString()}
                    </div>
                    <div className="inline-block bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                      {selectedProduct.category}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium">น้ำหนัก:</span>
                      <span className="text-gray-800">{selectedProduct.weight}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium">กลิ่น:</span>
                      <span className="text-gray-800">{selectedProduct.scent}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium">คงเหลือ:</span>
                      <span className="text-gray-800">{selectedProduct.stock} ชิ้น</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">รายละเอียดสินค้า</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">ส่วนผสม</h3>
                    <p className="text-gray-700">{selectedProduct.ingredients}</p>
                  </div>

                  <div className="space-y-3">
                    {selectedProduct.stock > 0 ? (
                      <>
                        <button
                          onClick={() => handleAddToCart(selectedProduct)}
                          className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-600 transition-colors"
                        >
                          ใส่ตะกร้า
                        </button>
                        <button
                          onClick={() => {
                            handleAddToCart(selectedProduct);
                            window.open('https://line.me/ti/p/@daddybathbomb', '_blank');
                          }}
                          className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors"
                        >
                          💬 สั่งซื้อผ่าน LINE
                        </button>
                      </>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
                      >
                        สินค้าหมด
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
