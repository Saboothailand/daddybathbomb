import React, { useState, useEffect } from 'react';

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 샘플 제품 데이터 (원래 컨셉 유지)
  const sampleProducts = [
    {
      id: 1,
      name: 'Lavender Dream Bath Bomb',
      description: 'บาธบอมกลิ่นลาเวนเดอร์ผ่อนคลาย ช่วยให้นอนหลับง่าย',
      price: 150,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      category: 'relaxing',
      stock: 50,
      scent: 'Lavender',
      weight: '100g'
    },
    {
      id: 2,
      name: 'Rose Romance Bath Bomb',
      description: 'บาธบอมกลิ่นกุหลาบโรแมนติก สำหรับคืนพิเศษ',
      price: 180,
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
      category: 'romantic',
      stock: 30,
      scent: 'Rose',
      weight: '100g'
    },
    {
      id: 3,
      name: 'Eucalyptus Fresh Bath Bomb',
      description: 'บาธบอมกลิ่นยูคาลิปตัสสดชื่น ช่วยผ่อนคลายกล้ามเนื้อ',
      price: 160,
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
      category: 'fresh',
      stock: 40,
      scent: 'Eucalyptus',
      weight: '100g'
    },
    {
      id: 4,
      name: 'Vanilla Sweet Bath Bomb',
      description: 'บาธบอมกลิ่นวานิลลาหวานหอม ให้ความรู้สึกอบอุ่น',
      price: 170,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&sig=1',
      category: 'sweet',
      stock: 35,
      scent: 'Vanilla',
      weight: '100g'
    }
  ];

  useEffect(() => {
    setProducts(sampleProducts);
  }, []);

  const categories = [
    { id: 'all', name: 'All Products', nameKr: 'ทั้งหมด' },
    { id: 'relaxing', name: 'Relaxing', nameKr: 'ผ่อนคลาย' },
    { id: 'romantic', name: 'Romantic', nameKr: 'โรแมนติก' },
    { id: 'fresh', name: 'Fresh', nameKr: 'สดชื่น' },
    { id: 'sweet', name: 'Sweet', nameKr: 'หวานหอม' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product) => {
    // LINE으로 주문하기
    const message = `สวัสดีค่ะ! ต้องการสั่งซื้อ ${product.name} ราคา ฿${product.price} ค่ะ`;
    const lineUrl = `https://line.me/ti/p/@daddybathbomb`;
    window.open(lineUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] font-nunito pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Our Products
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            สินค้าบาธบอมคุณภาพสูงจากวัตถุดิบธรรมชาติ
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 backdrop-blur-md'
              }`}
            >
              {category.nameKr}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/10"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Stock Badge */}
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-4 left-4 bg-orange-500/90 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                    เหลือ {product.stock}
                  </div>
                )}
                
                {product.stock === 0 && (
                  <div className="absolute top-4 left-4 bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                    หมด
                  </div>
                )}

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white/20 text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-colors backdrop-blur-md"
                  >
                    ดูรายละเอียด
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-pink-400">
                    ฿{product.price.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {product.weight}
                  </div>
                </div>

                {/* Product Features */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                    กลิ่น: {product.scent}
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    ธรรมชาติ 100%
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="w-full bg-white/10 text-white py-3 rounded-2xl hover:bg-white/20 transition-colors font-medium backdrop-blur-sm border border-white/20"
                  >
                    ดูรายละเอียด
                  </button>
                  
                  {product.stock > 0 ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all font-medium shadow-lg"
                    >
                      สั่งซื้อผ่าน LINE
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-600 text-gray-400 py-3 rounded-2xl cursor-not-allowed font-medium"
                    >
                      สินค้าหมด
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛁</div>
            <h3 className="text-2xl font-bold text-white mb-4">ไม่พบสินค้าในหมวดหมู่นี้</h3>
            <p className="text-gray-400">กรุณาเลือกหมวดหมู่อื่น</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F1A] border border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0B0F1A]/90 backdrop-blur-md border-b border-white/20 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{selectedProduct.name}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-white text-3xl"
                >
                  ×
                </button>
              </div>
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
                    <div className="text-3xl font-bold text-pink-400 mb-4">
                      ฿{selectedProduct.price.toLocaleString()}
                    </div>
                    <div className="space-y-3 text-gray-300">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">น้ำหนัก:</span>
                        <span>{selectedProduct.weight}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">กลิ่น:</span>
                        <span>{selectedProduct.scent}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">คงเหลือ:</span>
                        <span>{selectedProduct.stock} ชิ้น</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">รายละเอียดสินค้า</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  <div className="space-y-3">
                    {selectedProduct.stock > 0 ? (
                      <>
                        <button
                          onClick={() => handleAddToCart(selectedProduct)}
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 px-6 rounded-2xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg"
                        >
                          สั่งซื้อผ่าน LINE
                        </button>
                        <button
                          onClick={() => window.open('https://line.me/ti/p/@daddybathbomb', '_blank')}
                          className="w-full bg-green-500 text-white py-4 px-6 rounded-2xl font-medium hover:bg-green-600 transition-colors"
                        >
                          💬 ปรึกษาก่อนซื้อ
                        </button>
                      </>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-600 text-gray-400 py-4 px-6 rounded-2xl font-medium cursor-not-allowed"
                      >
                        สินค้าหมด
                      </button>
                    )}
                  </div>

                  {/* Trust Badges */}
                  <div className="border-t border-white/20 pt-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="text-green-400">✓</span>
                        ส่งฟรีทั่วไทย
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="text-green-400">✓</span>
                        ธรรมชาติ 100%
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="text-green-400">✓</span>
                        ปลอดภัย
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="text-green-400">✓</span>
                        จัดส่งเร็ว
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
