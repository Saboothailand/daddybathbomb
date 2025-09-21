import React, { useState } from 'react';
import { Package, Plus, Edit3, Trash2, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  createdAt: string;
}

const mockProducts: Product[] = [
  {
    id: 'PROD-001',
    name: 'Rainbow Bath Bomb',
    description: 'สีสันสดใสพร้อมกลิ่นหอมสดชื่น',
    price: 295,
    originalPrice: 350,
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300',
    category: 'Bath Bombs',
    isActive: true,
    isFeatured: true,
    stock: 50,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'PROD-002',
    name: 'Lavender Relaxing Bomb',
    description: 'บาธบอมกลิ่นลาเวนเดอร์ผ่อนคลาย',
    price: 295,
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300',
    category: 'Bath Bombs',
    isActive: true,
    isFeatured: false,
    stock: 30,
    createdAt: '2024-01-14T15:45:00Z'
  },
  {
    id: 'PROD-003',
    name: 'Rose Garden Bomb',
    description: 'บาธบอมกลิ่นกุหลาบสวยหวาน',
    price: 295,
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300',
    category: 'Bath Bombs',
    isActive: false,
    isFeatured: false,
    stock: 0,
    createdAt: '2024-01-13T09:15:00Z'
  }
];

export default function ProductDetailManager() {
  const [products] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Product Management</h2>
          <p className="text-gray-400">จัดการสินค้าและรายละเอียด</p>
        </div>
        <Button className="bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold">
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มสินค้าใหม่
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#11162A] border-gray-600">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  สินค้าทั้งหมด
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-white mt-2">
                  {products.length}
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
                  สินค้าพร้อมขาย
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-white mt-2">
                  {products.filter(p => p.isActive).length}
                </CardDescription>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-[#11162A] border-gray-600">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  สินค้าแนะนำ
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-white mt-2">
                  {products.filter(p => p.isFeatured).length}
                </CardDescription>
              </div>
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-[#11162A] border-gray-600">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  สต็อกรวม
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-white mt-2">
                  {products.reduce((sum, product) => sum + product.stock, 0)}
                </CardDescription>
              </div>
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#11162A] border-gray-600">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label className="text-gray-300">ค้นหาสินค้า</Label>
              <Input
                type="text"
                placeholder="ค้นหาตามชื่อหรือคำอธิบาย..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#151B2E] border-gray-600 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">หมวดหมู่</Label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-[#151B2E] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
              >
                <option value="all">ทั้งหมด</option>
                <option value="Bath Bombs">Bath Bombs</option>
                <option value="Accessories">เครื่องประกอบ</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full">
            <Card className="bg-[#11162A] border-gray-600">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">ไม่พบสินค้า</h3>
                <p className="text-gray-400">ไม่มีสินค้าที่ตรงกับเงื่อนไขการค้นหา</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="bg-[#11162A] border-gray-600 overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge className={product.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                    {product.isActive ? 'พร้อมขาย' : 'ไม่พร้อมขาย'}
                  </Badge>
                  {product.isFeatured && (
                    <Badge className="bg-yellow-500 text-black">
                      แนะนำ
                    </Badge>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className={`${product.stock > 0 ? 'bg-blue-500' : 'bg-red-500'} text-white`}>
                    สต็อก: {product.stock}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-white text-lg">{product.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#FF2D55]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>หมวดหมู่: {product.category}</span>
                  <span>{formatDate(product.createdAt)}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-[#007AFF] hover:bg-[#0051D5]">
                    <Edit3 className="w-3 h-3 mr-1" />
                    แก้ไข
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                    {product.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
