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
import { supabase, hasSupabaseCredentials } from '../../lib/supabase';

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
      if (hasSupabaseCredentials) {
        if (selectedProduct?.id) {
          const { error } = await supabase
            .from('products')
            .update(prepareProductPayload(formData))
            .eq('id', selectedProduct.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('products')
            .insert([prepareProductPayload(formData)]);
          if (error) throw error;
        }
      } else {
        await AdminService.saveProduct(formData, selectedProduct?.id);
      }
      
      await loadData();
      resetForm();
      alert('Product has been saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('An error occurred while saving the product. Please try again.');
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    try {
      if (hasSupabaseCredentials) {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
        if (error) throw error;
      } else {
        await AdminService.deleteProduct(productId);
      }
      
      await loadData();
      if (selectedProduct?.id === productId) {
        resetForm();
      }
      alert('Product has been deleted successfully.');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while deleting the product. Please try again.');
    }
  };

  const startEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      short_description: product.short_description,
      long_description: product.long_description,
      price: product.price,
      original_price: product.original_price,
      image_url: product.image_url,
      category_id: product.category_id,
      sku: product.sku,
      stock_quantity: product.stock_quantity,
      is_active: product.is_active,
      is_featured: product.is_featured,
      color: product.color,
      scent: product.scent,
      weight: product.weight,
      ingredients: product.ingredients,
      tags: product.tags,
      benefits: product.benefits,
      rating: product.rating,
      review_count: product.review_count,
      colors: product.colors
    });
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
      category_id: '',
      sku: '',
      stock_quantity: 0,
      is_active: true,
      is_featured: false,
      color: '#FF2D55',
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
    <div className="flex gap-6 h-screen">
      {/* 좌측: 제품 목록 */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white font-fredoka drop-shadow-lg">
              📦 Product Management
            </h1>
            <p className="text-gray-300 mt-2">
              Manage all product details and configurations
            </p>
          </div>
          <Button
            onClick={startCreate}
            className="bg-[#00FF88] hover:bg-[#00CC6A] text-black font-semibold px-4 py-2 shadow-lg transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* 제품 목록 */}
        <div className="space-y-3">
          {products.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              onEdit={() => startEdit(product)}
              onDelete={() => deleteProduct(product.id)}
            />
          ))}
          
          {products.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No products available</p>
              <p className="text-sm mt-2">Click "Add New Product" to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* 우측: 제품 편집 폼 */}
      <div className="w-96 flex-shrink-0">
        {showForm ? (
          <ProductEditForm 
            formData={formData}
            setFormData={setFormData}
            selectedProduct={selectedProduct}
            onSave={saveProduct}
            onCancel={resetForm}
            categories={categories}
          />
        ) : (
          <Card className="bg-[#11162A] border-gray-600 h-full">
            <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 drop-shadow-sm">📦 Product Editor</h3>
              <p className="text-gray-300 text-base mb-8 leading-relaxed">
                Select a product from the left<br />
                or create a new one to get started
              </p>
              <Button
                onClick={startCreate}
                className="bg-[#00FF88] hover:bg-[#00CC6A] text-black font-semibold px-6 py-3 shadow-lg transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Product
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// 제품 목록 아이템 컴포넌트
interface ProductListItemProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}

function ProductListItem({ product, onEdit, onDelete }: ProductListItemProps) {
  return (
    <div className="bg-[#1E293B] border border-gray-600 rounded-lg p-4 hover:border-[#007AFF] hover:shadow-lg transition-all group cursor-pointer">
      <div className="flex items-center gap-4">
        {/* 제품 이미지 */}
        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-700 border border-gray-500">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* 제품 정보 */}
        <div className="flex-1 min-w-0" onClick={onEdit}>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-[#007AFF] text-white text-xs px-2 py-1">
              {product.sku}
            </Badge>
            {product.is_featured && (
              <Badge className="bg-[#FFD700] text-black text-xs px-2 py-1">
                ⭐ Featured
              </Badge>
            )}
            <Badge className={product.is_active ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
              {product.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          <h4 className="text-white font-semibold text-base truncate mb-1 drop-shadow-sm">{product.name}</h4>
          <p className="text-gray-300 text-sm line-clamp-1 leading-relaxed mb-2">{product.short_description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#00FF88] font-bold text-lg">฿{product.price}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-[#FFD700] fill-current" />
                <span className="text-white text-xs">{product.rating}</span>
              </div>
            </div>
            <div className="text-gray-400 text-xs">
              Stock: {product.stock_quantity}
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={onEdit}
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 border border-transparent hover:border-blue-500 transition-all"
            title="Edit Product"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            onClick={onDelete}
            size="sm"
            variant="ghost"
            className="h-9 w-9 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30 border border-transparent hover:border-red-500 transition-all"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// 제품 편집 폼 컴포넌트
interface ProductEditFormProps {
  formData: Partial<Product>;
  setFormData: (data: Partial<Product>) => void;
  selectedProduct: Product | null;
  onSave: () => void;
  onCancel: () => void;
  categories: Category[];
}

function ProductEditForm({ formData, setFormData, selectedProduct, onSave, onCancel, categories }: ProductEditFormProps) {
  return (
    <Card className="bg-[#11162A] border-gray-600 h-full">
      <CardHeader className="border-b border-gray-600 bg-gray-800/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg font-bold drop-shadow-sm">
            {selectedProduct ? '✏️ Edit Product' : '➕ Add New Product'}
          </CardTitle>
          <Button 
            onClick={onCancel} 
            variant="ghost" 
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-8rem)]">
        {/* 기본 정보 */}
        <div>
          <Label className="text-white text-sm font-semibold mb-3 block">📝 Basic Information</Label>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 text-sm font-medium">Product Name</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#0F1424] border-gray-600 text-white mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Enter product name..."
                required
              />
            </div>
            
            <div>
              <Label className="text-gray-300 text-sm font-medium">SKU</Label>
              <Input
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="bg-[#0F1424] border-gray-600 text-white mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="e.g., BB-001"
                required
              />
            </div>
            
            <div>
              <Label className="text-gray-300 text-sm font-medium">Short Description</Label>
              <Textarea
                value={formData.short_description || ''}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="bg-[#0F1424] border-gray-600 text-white mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                rows={3}
                placeholder="Brief product description..."
              />
            </div>
            
            <div>
              <Label className="text-gray-300 text-sm font-medium">Long Description</Label>
              <Textarea
                value={formData.long_description || ''}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                className="bg-[#0F1424] border-gray-600 text-white mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                rows={4}
                placeholder="Detailed product description..."
              />
            </div>
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div>
          <Label className="text-white text-sm font-semibold mb-3 block">🖼️ Product Image</Label>
          <ImageUpload
            currentImage={formData.image_url || ''}
            onImageUpload={(url) => setFormData({ ...formData, image_url: url })}
            label=""
            storageFolder="products"
          />
        </div>

        {/* 가격 및 재고 정보 */}
        <div>
          <Label className="text-white text-sm font-semibold mb-3 block">💰 Pricing & Stock</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-gray-300 text-sm font-medium">Price (฿)</Label>
              <Input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="bg-[#0F1424] border-gray-600 text-white mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label className="text-gray-300 text-sm font-medium">Stock</Label>
              <Input
                type="number"
                value={formData.stock_quantity || ''}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                className="bg-[#0F1424] border-gray-600 text-white mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* 제품 상세 */}
        <div>
          <Label className="text-white text-sm font-semibold mb-3 block">🏷️ Product Details</Label>
          <div className="space-y-3">
            <div>
              <Label className="text-gray-300 text-sm font-medium">Scent</Label>
              <Input
                value={formData.scent || ''}
                onChange={(e) => setFormData({ ...formData, scent: e.target.value })}
                className="bg-[#0F1424] border-gray-600 text-white mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="e.g., Strawberry Vanilla"
              />
            </div>
            <div>
              <Label className="text-gray-300 text-sm font-medium">Weight</Label>
              <Input
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="bg-[#0F1424] border-gray-600 text-white mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="e.g., 120g"
              />
            </div>
            <div>
              <Label className="text-gray-300 text-sm font-medium">Ingredients</Label>
              <Textarea
                value={formData.ingredients || ''}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="bg-[#0F1424] border-gray-600 text-white mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                rows={3}
                placeholder="Natural ingredients list..."
              />
            </div>
          </div>
        </div>

        {/* 설정 */}
        <div className="space-y-4 bg-gray-800/30 p-4 rounded-lg border border-gray-600">
          <Label className="text-white text-sm font-semibold block">⚙️ Settings</Label>
          
          <div className="flex items-center justify-between">
            <Label className="text-gray-300 text-sm font-medium">Active Product</Label>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${formData.is_active ? 'text-green-400' : 'text-gray-500'}`}>
                {formData.is_active ? 'Active' : 'Inactive'}
              </span>
              <Switch
                checked={formData.is_active || false}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-gray-300 text-sm font-medium">Featured Product</Label>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${formData.is_featured ? 'text-yellow-400' : 'text-gray-500'}`}>
                {formData.is_featured ? 'Featured' : 'Normal'}
              </span>
              <Switch
                checked={formData.is_featured || false}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 pt-6 border-t border-gray-600">
          <Button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-[#64748B] hover:bg-[#475569] text-white font-semibold transition-all hover:scale-[1.02]"
          >
            ❌ Cancel
          </Button>
          <Button
            onClick={onSave}
            className="flex-1 bg-[#00FF88] hover:bg-[#00CC6A] text-black font-bold shadow-lg transition-all hover:scale-[1.02]"
            disabled={!formData.name || !formData.sku}
          >
            <Save className="w-4 h-4 mr-2" />
            💾 Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function prepareProductPayload(formData: Partial<Product>): Omit<Product, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: formData.name ?? 'New Product',
    description: formData.description ?? '',
    short_description: formData.short_description ?? '',
    long_description: formData.long_description ?? '',
    price: Number(formData.price ?? 0),
    original_price:
      formData.original_price !== undefined && formData.original_price !== null
        ? Number(formData.original_price)
        : undefined,
    image_url: formData.image_url ?? '',
    category: formData.category ?? formData.category_id ?? 'Bath Bombs',
    sku: formData.sku ?? `SKU-${Date.now()}`,
    stock_quantity: Number(formData.stock_quantity ?? 0),
    is_active: formData.is_active ?? true,
    is_featured: formData.is_featured ?? false,
    color: formData.color ?? '#FF2D55',
    scent: formData.scent ?? '',
    weight: formData.weight ?? '',
    ingredients: formData.ingredients ?? '',
    rating: Number(formData.rating ?? 0),
    review_count: Number(formData.review_count ?? 0),
    colors: formData.colors ?? [],
    tags: formData.tags ?? [],
    benefits: formData.benefits ?? [],
  };
}