import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Upload,
  Star,
  Tag,
  Palette,
  Weight,
  Droplets,
  Heart
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ImageUpload from '../ImageUpload';
import { AdminService } from '../../lib/adminService';

interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string;
  long_description: string;
  price: number;
  original_price?: number;
  image_url: string;
  category_id?: string;
  sku: string;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  color?: string;
  scent?: string;
  weight?: string;
  ingredients?: string;
  tags?: string[];
  benefits?: string[];
  rating: number;
  review_count: number;
  colors?: string[];
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export default function ProductDetailManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const products = await AdminService.getProducts();
      setProducts(products);
      
      // 카테고리는 제품에서 추출하거나 기본값 사용
      const uniqueCategories = [...new Set(products.map(p => p.category))];
      const categoryData = uniqueCategories.map(cat => ({
        id: cat,
        name: cat,
        slug: cat.toLowerCase().replace(/\s+/g, '-')
      }));
      setCategories(categoryData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async () => {
    try {
      if (selectedProduct?.id) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', selectedProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([formData]);
        if (error) throw error;
      }
      
      await loadData();
      resetForm();
      alert('제품이 저장되었습니다!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('제품 저장 중 오류가 발생했습니다.');
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('정말 이 제품을 삭제하시겠습니까?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      await loadData();
      alert('제품이 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('제품 삭제 중 오류가 발생했습니다.');
    }
  };

  const startEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({ ...product });
    setShowForm(true);
  };

  const startCreate = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      short_description: '',
      long_description: '',
      price: 0,
      original_price: 0,
      image_url: '',
      sku: '',
      stock_quantity: 0,
      is_active: true,
      is_featured: false,
      color: '',
      scent: '',
      weight: '',
      ingredients: '',
      tags: [],
      benefits: [],
      rating: 0,
      review_count: 0,
      colors: []
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setShowForm(false);
    setFormData({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white font-fredoka">
            📦 제품 상세 관리
          </h2>
          <p className="text-gray-300 text-lg mt-2">
            제품의 모든 정보를 관리하고 다국어 지원을 설정하세요
          </p>
        </div>
        
        <Button
          onClick={startCreate}
          className="bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          새 제품 추가
        </Button>
      </div>

      {/* 제품 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="bg-[#11162A] border-gray-600 overflow-hidden hover:border-[#007AFF] transition-all shadow-sm hover:shadow-md">
            <div className="aspect-square relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {product.is_featured && (
                  <Badge className="bg-[#FFD700] text-black">Featured</Badge>
                )}
                <Badge className={product.is_active ? "bg-[#00FF88] text-black" : "bg-[#64748B] text-white"}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="absolute top-2 left-2">
                <Badge className="bg-[#007AFF] text-white text-xs">
                  {product.sku}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-bold text-white text-lg mb-2 line-clamp-1">{product.name}</h3>
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.short_description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[#00FF88] font-bold text-xl">฿{product.price}</span>
                  {product.original_price && (
                    <span className="text-gray-400 line-through text-sm">฿{product.original_price}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#FFD700] fill-current" />
                  <span className="text-white text-sm">{product.rating}</span>
                  <span className="text-gray-400 text-xs">({product.review_count})</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-300">Stock: {product.stock_quantity}</span>
                </div>
                {product.scent && (
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-300">{product.scent}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex items-center gap-2 text-sm">
                    <Weight className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-300">{product.weight}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => startEdit(product)}
                  size="sm"
                  className="flex-1 bg-[#007AFF] hover:bg-[#0051D5]"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => deleteProduct(product.id)}
                  size="sm"
                  variant="destructive"
                  className="bg-[#FF2D55] hover:bg-[#FF1744]"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 제품 상세 편집 모달 */}
      {showForm && (
        <ProductDetailModal
          product={selectedProduct}
          categories={categories}
          formData={formData}
          setFormData={setFormData}
          onSave={saveProduct}
          onClose={resetForm}
        />
      )}
    </div>
  );
}

// 제품 상세 편집 모달
interface ProductDetailModalProps {
  product: Product | null;
  categories: Category[];
  formData: Partial<Product>;
  setFormData: (data: Partial<Product>) => void;
  onSave: () => void;
  onClose: () => void;
}

function ProductDetailModal({ 
  product, 
  categories, 
  formData, 
  setFormData, 
  onSave, 
  onClose 
}: ProductDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'seo' | 'images'>('basic');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">
            {product ? '제품 상세 편집' : '새 제품 추가'}
          </h3>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'basic', label: '기본 정보', icon: Package },
              { id: 'details', label: '상세 정보', icon: Edit3 },
              { id: 'seo', label: 'SEO & 태그', icon: Tag },
              { id: 'images', label: '이미지 갤러리', icon: Upload }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#007AFF] text-[#007AFF]'
                      : 'border-transparent text-[#64748B] hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-4 h-4 inline mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* 기본 정보 탭 */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-900">제품명 (한국어)</Label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                    placeholder="예: 딸기 스플래시 배쓰밤"
                  />
                </div>
                <div>
                  <Label className="text-gray-900">Product Name (English)</Label>
                  <Input
                    value={formData.name_en || ''}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                    placeholder="e.g: Strawberry Splash Bath Bomb"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-900">제품명 (ไทย)</Label>
                <Input
                  value={formData.name_th || ''}
                  onChange={(e) => setFormData({ ...formData, name_th: e.target.value })}
                  className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  placeholder="เช่น: บาธบอมสตรอเบอร์รี่"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-900">카테고리</Label>
                  <Select 
                    value={formData.category_id || ''} 
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E293B] border-gray-200">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-gray-900">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-900">SKU</Label>
                  <Input
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                    placeholder="DBB-FRUIT-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-900">가격 (฿)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-900">원가 (฿)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.original_price || ''}
                    onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || 0 })}
                    className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-900">재고</Label>
                  <Input
                    type="number"
                    value={formData.stock_quantity || ''}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                    className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  />
                </div>
              </div>

              <div className="max-w-md">
                <ImageUpload
                  currentImage={formData.image_url || ''}
                  onImageUpload={(url) => setFormData({ ...formData, image_url: url })}
                  label="메인 제품 이미지"
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_active || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label className="text-gray-900">활성화</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_featured || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label className="text-gray-900">추천 제품</Label>
                </div>
              </div>
            </div>
          )}

          {/* 상세 정보 탭 */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <Label className="text-gray-900">짧은 설명 (한국어)</Label>
                <Input
                  value={formData.short_description || ''}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  placeholder="한 줄로 제품을 소개하세요"
                />
              </div>

              <div>
                <Label className="text-gray-900">Short Description (English)</Label>
                <Input
                  value={formData.short_description_en || ''}
                  onChange={(e) => setFormData({ ...formData, short_description_en: e.target.value })}
                  className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  placeholder="One line product introduction"
                />
              </div>

              <div>
                <Label className="text-gray-900">คำอธิบายสั้น (ไทย)</Label>
                <Input
                  value={formData.short_description_th || ''}
                  onChange={(e) => setFormData({ ...formData, short_description_th: e.target.value })}
                  className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  placeholder="แนะนำผลิตภัณฑ์ในหนึ่งบรรทัด"
                />
              </div>

              <div>
                <Label className="text-gray-900">상세 설명 (한국어)</Label>
                <Textarea
                  value={formData.long_description || ''}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  rows={4}
                  placeholder="제품의 자세한 설명을 입력하세요..."
                />
              </div>

              <div>
                <Label className="text-gray-900">Detailed Description (English)</Label>
                <Textarea
                  value={formData.long_description_en || ''}
                  onChange={(e) => setFormData({ ...formData, long_description_en: e.target.value })}
                  className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  rows={4}
                  placeholder="Enter detailed product description..."
                />
              </div>

              <div>
                <Label className="text-gray-900">รายละเอียดผลิตภัณฑ์ (ไทย)</Label>
                <Textarea
                  value={formData.long_description_th || ''}
                  onChange={(e) => setFormData({ ...formData, long_description_th: e.target.value })}
                  className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  rows={4}
                  placeholder="ใส่รายละเอียดผลิตภัณฑ์..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-900">향 (Scent)</Label>
                  <Input
                    value={formData.scent || ''}
                    onChange={(e) => setFormData({ ...formData, scent: e.target.value })}
                    className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                    placeholder="Strawberry Milkshake"
                  />
                </div>
                <div>
                  <Label className="text-gray-900">무게 (Weight)</Label>
                  <Input
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                    placeholder="120g"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-900">성분 (Ingredients)</Label>
                <Textarea
                  value={formData.ingredients || ''}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  rows={3}
                  placeholder="Natural strawberry extract, coconut oil, shea butter..."
                />
              </div>

              <div>
                <Label className="text-gray-900">효능 (Benefits) - 한 줄씩 입력</Label>
                <Textarea
                  value={formData.benefits?.join('\n') || ''}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value.split('\n').filter(b => b.trim()) })}
                  className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  rows={4}
                  placeholder="피부 진정&#10;촉촉한 보습&#10;상큼한 향기&#10;기분 전환"
                />
              </div>
            </div>
          )}

          {/* SEO & 태그 탭 */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <Label className="text-gray-900">태그 (쉼표로 구분)</Label>
                <Input
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                  className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  placeholder="fruit, strawberry, sweet, kids"
                />
              </div>

              <div>
                <Label className="text-gray-900">색상 코드 (쉼표로 구분)</Label>
                <Input
                  value={formData.colors?.join(', ') || ''}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(',').map(c => c.trim()).filter(c => c) })}
                  className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  placeholder="#ff5b7f, #ff8fb5"
                />
              </div>

              <div>
                <Label className="text-gray-900">메인 색상</Label>
                <div className="flex items-center gap-4 mt-1">
                  <input
                    type="color"
                    value={formData.color || '#ff5b7f'}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-12 rounded border border-gray-200"
                  />
                  <Input
                    value={formData.color || ''}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="bg-[#1E293B] border-gray-200 text-gray-900 flex-1"
                    placeholder="#ff5b7f"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-900">평점</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating || ''}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                    className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-900">리뷰 수</Label>
                  <Input
                    type="number"
                    value={formData.review_count || ''}
                    onChange={(e) => setFormData({ ...formData, review_count: parseInt(e.target.value) || 0 })}
                    className="bg-[#1E293B] border-gray-200 text-gray-900 mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 이미지 갤러리 탭 */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-gray-900 text-lg font-bold mb-2">제품 이미지 갤러리</h3>
                <p className="text-[#B8C4DB] text-sm">제품의 다양한 각도 이미지를 추가하세요</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* 메인 이미지 */}
                <div className="col-span-full">
                  <Label className="text-gray-900">메인 이미지</Label>
                  <div className="max-w-md mt-2">
                    <ImageUpload
                      currentImage={formData.image_url || ''}
                      onImageUpload={(url) => setFormData({ ...formData, image_url: url })}
                      label=""
                    />
                  </div>
                </div>
                
                {/* 추가 이미지들 (향후 확장) */}
                <div className="col-span-full text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Upload className="w-8 h-8 text-[#64748B] mx-auto mb-2" />
                  <p className="text-[#64748B] text-sm">추가 이미지 갤러리</p>
                  <p className="text-[#475569] text-xs">향후 업데이트 예정</p>
                </div>
              </div>
            </div>
          )}

          {/* 저장 버튼 */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={onClose}
              className="flex-1 bg-[#64748B] hover:bg-[#475569] text-gray-900"
            >
              취소
            </Button>
            <Button
              onClick={onSave}
              className="flex-1 bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold"
            >
              <Save className="w-4 h-4 mr-2" />
              {product ? '제품 수정' : '제품 생성'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
