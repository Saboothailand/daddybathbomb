import { useState, useEffect } from 'react'
import { Product, supabase } from '../lib/supabase'
import ImageUpload from './ImageUpload'

interface ProductEditorProps {
  product?: Product | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function ProductEditor({ product, isOpen, onClose, onSave }: ProductEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    images: [] as string[],
    stock_quantity: 0,
    category: '',
    ingredients: '',
    weight: '',
    scent: '',
    is_active: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'description' | 'images'>('basic')

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        image_url: product.image_url || '',
        images: product.images || [],
        stock_quantity: product.stock_quantity || 0,
        category: product.category || '',
        ingredients: product.ingredients || '',
        weight: product.weight || '',
        scent: product.scent || '',
        is_active: product.is_active ?? true
      })
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        images: [],
        stock_quantity: 0,
        category: '',
        ingredients: '',
        weight: '',
        scent: '',
        is_active: true
      })
    }
  }, [product])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
               type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }))
  }

  const handleMainImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }))
  }

  const handleGalleryImageUpload = (url: string) => {
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }))
    }
  }

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const productData = {
        ...formData,
        images: formData.images.length > 0 ? formData.images : null
      }

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData])
      }

      if (error) throw error

      onSave()
      onClose()
    } catch (err: any) {
      setError(err.message || '제품 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {product ? '제품 수정' : '새 제품 추가'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-8 border-b border-gray-200">
              {[
                { id: 'basic', label: '기본 정보', icon: '📝' },
                { id: 'description', label: '상세 설명', icon: '📄' },
                { id: 'images', label: '이미지 관리', icon: '📸' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제품명 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="제품명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">카테고리 선택</option>
                    <option value="릴렉싱">릴렉싱</option>
                    <option value="로맨틱">로맨틱</option>
                    <option value="상쾌함">상쾌함</option>
                    <option value="달콤함">달콤함</option>
                    <option value="허브">허브</option>
                    <option value="플로럴">플로럴</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    가격 (THB) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    재고 수량 *
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    무게
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="예: 100g"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    향
                  </label>
                  <input
                    type="text"
                    name="scent"
                    value={formData.scent}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="예: 라벤더"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  성분 정보
                </label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="제품에 사용된 성분들을 입력하세요"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  제품 활성화 (체크 해제 시 고객에게 표시되지 않습니다)
                </label>
              </div>
            </div>
          )}

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상세 설명 (HTML 지원)
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* HTML Editor Toolbar */}
                  <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.querySelector('[name="description"]') as HTMLTextAreaElement
                        const start = textarea.selectionStart
                        const end = textarea.selectionEnd
                        const selectedText = textarea.value.substring(start, end)
                        const newText = `<strong>${selectedText}</strong>`
                        handleDescriptionChange(
                          textarea.value.substring(0, start) + newText + textarea.value.substring(end)
                        )
                      }}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-100"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.querySelector('[name="description"]') as HTMLTextAreaElement
                        const start = textarea.selectionStart
                        const end = textarea.selectionEnd
                        const selectedText = textarea.value.substring(start, end)
                        const newText = `<em>${selectedText}</em>`
                        handleDescriptionChange(
                          textarea.value.substring(0, start) + newText + textarea.value.substring(end)
                        )
                      }}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-100 italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDescriptionChange(formData.description + '\n<h3>제목</h3>\n')
                      }}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-100"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDescriptionChange(formData.description + '\n<ul>\n  <li>항목 1</li>\n  <li>항목 2</li>\n</ul>\n')
                      }}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-100"
                    >
                      목록
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDescriptionChange(formData.description + '\n<br>\n')
                      }}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-100"
                    >
                      줄바꿈
                    </button>
                  </div>
                  
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    rows={15}
                    className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono text-sm"
                    placeholder="HTML을 사용하여 상세한 제품 설명을 작성하세요.

예시:
<h3>제품 특징</h3>
<ul>
  <li>천연 재료 100% 사용</li>
  <li>피부에 순한 성분</li>
  <li>오래 지속되는 향기</li>
</ul>

<h3>사용법</h3>
<p>따뜻한 물에 배스밤을 넣고 <strong>5-10분</strong> 기다려주세요.</p>"
                  />
                </div>
              </div>

              {/* Preview */}
              {formData.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    미리보기
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[200px]">
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: formData.description }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메인 이미지
                </label>
                <ImageUpload
                  onImageUploaded={handleMainImageUpload}
                  currentImage={formData.image_url}
                  folder="products"
                  placeholder="메인 제품 이미지를 업로드하세요"
                  className="max-w-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  추가 이미지 갤러리
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <ImageUpload
                  onImageUploaded={handleGalleryImageUpload}
                  folder="products/gallery"
                  placeholder="추가 이미지를 업로드하세요"
                  className="max-w-md"
                />
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '저장 중...' : product ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
