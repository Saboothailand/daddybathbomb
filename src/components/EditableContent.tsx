import React, { useState, useEffect } from 'react';
import { Edit3, Save, X, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import ImageUpload from './ImageUpload';
import { AdminService } from '../lib/adminService';

interface EditableContentProps {
  type: 'text' | 'textarea' | 'image';
  value: string;
  settingKey: string;
  className?: string;
  placeholder?: string;
  isAdmin?: boolean;
  children?: React.ReactNode;
}

export default function EditableContent({ 
  type, 
  value, 
  settingKey, 
  className = '', 
  placeholder = '',
  isAdmin = false,
  children 
}: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const saveContent = async () => {
    try {
      setSaving(true);
      
      const success = await AdminService.updateSiteSetting(
        settingKey,
        editValue,
        type === 'image' ? 'image' : 'text'
      );
      
      if (success) {
        // 콘텐츠 업데이트 이벤트 발생
        window.dispatchEvent(new CustomEvent('contentUpdated', { 
          detail: { key: settingKey, value: editValue } 
        }));
        
        setIsEditing(false);
        alert('내용이 저장되었습니다!');
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (!isAdmin) {
    // 관리자가 아니면 일반 표시
    return children || <span className={className}>{value}</span>;
  }

  return (
    <div className="relative group">
      {/* 편집 모드가 아닐 때 */}
      {!isEditing ? (
        <div className="relative">
          {children || (
            type === 'image' ? (
              <img src={value} alt="" className={className} />
            ) : (
              <span className={className}>{value}</span>
            )
          )}
          
          {/* 편집 버튼 - 호버 시 나타남 */}
          <button
            onClick={() => setIsEditing(true)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-[#007AFF] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-[#0051D5] shadow-lg z-10"
            title="편집하기"
          >
            <Edit3 className="w-3 h-3" />
          </button>
        </div>
      ) : (
        /* 편집 모드 */
        <div className="relative">
          {type === 'text' && (
            <div className="flex items-center gap-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="bg-[#1E293B] border-[#007AFF] text-white"
                placeholder={placeholder}
                autoFocus
              />
              <Button
                onClick={saveContent}
                size="sm"
                className="bg-[#00FF88] hover:bg-[#00CC6A] text-black"
                disabled={saving}
              >
                <Save className="w-3 h-3" />
              </Button>
              <Button
                onClick={cancelEdit}
                size="sm"
                variant="outline"
                className="border-[#64748B] text-[#64748B]"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          {type === 'textarea' && (
            <div className="space-y-2">
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="bg-[#1E293B] border-[#007AFF] text-white"
                placeholder={placeholder}
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={saveContent}
                  size="sm"
                  className="bg-[#00FF88] hover:bg-[#00CC6A] text-black"
                  disabled={saving}
                >
                  <Save className="w-3 h-3 mr-1" />
                  저장
                </Button>
                <Button
                  onClick={cancelEdit}
                  size="sm"
                  variant="outline"
                  className="border-[#64748B] text-[#64748B]"
                >
                  <X className="w-3 h-3 mr-1" />
                  취소
                </Button>
              </div>
            </div>
          )}

          {type === 'image' && (
            <div className="space-y-2">
              <ImageUpload
                currentImage={editValue}
                onImageUpload={setEditValue}
                label=""
                storageFolder="content"
              />
              <div className="flex gap-2">
                <Button
                  onClick={saveContent}
                  size="sm"
                  className="bg-[#00FF88] hover:bg-[#00CC6A] text-black"
                  disabled={saving}
                >
                  <Save className="w-3 h-3 mr-1" />
                  저장
                </Button>
                <Button
                  onClick={cancelEdit}
                  size="sm"
                  variant="outline"
                  className="border-[#64748B] text-[#64748B]"
                >
                  <X className="w-3 h-3 mr-1" />
                  취소
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
