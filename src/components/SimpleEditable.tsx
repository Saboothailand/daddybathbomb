import React, { useState, useEffect } from 'react';
import { Edit3, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface SimpleEditableProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  type?: 'text' | 'textarea';
  className?: string;
  placeholder?: string;
  children?: React.ReactNode;
}

export default function SimpleEditable({
  value,
  onSave,
  type = 'text',
  className = '',
  placeholder = '내용을 입력하세요...',
  children
}: SimpleEditableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [saving, setSaving] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    // 관리자 모드 확인
    const checkAdminMode = () => {
      const adminMode = localStorage.getItem('adminMode') === 'true' || 
                       window.location.hash === '#admin';
      setIsAdminMode(adminMode);
    };

    checkAdminMode();
    
    const handleAdminModeChange = () => {
      checkAdminMode();
    };

    window.addEventListener('adminModeChanged', handleAdminModeChange);
    window.addEventListener('hashchange', handleAdminModeChange);
    
    return () => {
      window.removeEventListener('adminModeChanged', handleAdminModeChange);
      window.removeEventListener('hashchange', handleAdminModeChange);
    };
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (!isAdminMode) {
    return children || <span className={className}>{value}</span>;
  }

  return (
    <div className="relative group">
      {!isEditing ? (
        <div className="relative">
          {children || <span className={className}>{value}</span>}
          
          {/* 편집 버튼 */}
          <button
            onClick={() => setIsEditing(true)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-[#007AFF] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-[#0051D5] shadow-lg z-10"
            title="편집하기"
          >
            <Edit3 className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="relative bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-20">
          {type === 'textarea' ? (
            <div className="space-y-2">
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full"
                autoFocus
              />
            </div>
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className="w-full"
              autoFocus
            />
          )}
          
          <div className="flex gap-2 mt-2">
            <Button
              onClick={handleSave}
              size="sm"
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-3 h-3 mr-1" />
              {saving ? '저장 중...' : '저장'}
            </Button>
            <Button
              onClick={handleCancel}
              size="sm"
              variant="outline"
              disabled={saving}
            >
              <X className="w-3 h-3 mr-1" />
              취소
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
