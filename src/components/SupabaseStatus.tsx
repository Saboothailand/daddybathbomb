import React, { useState, useEffect } from 'react';
import { testSupabaseConnection, hasSupabaseCredentials } from '../lib/supabase';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SupabaseStatusProps {
  className?: string;
}

export default function SupabaseStatus({ className = '' }: SupabaseStatusProps) {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | 'not_configured'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const checkConnection = async () => {
      if (!hasSupabaseCredentials) {
        setConnectionStatus('not_configured');
        return;
      }

      setConnectionStatus('checking');
      const result = await testSupabaseConnection();
      
      if (result.success) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
        setErrorMessage(result.error || 'Unknown error');
      }
    };

    checkConnection();
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'not_configured':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'checking':
        return '연결 확인 중...';
      case 'connected':
        return 'Supabase 연결됨';
      case 'error':
        return `연결 실패: ${errorMessage}`;
      case 'not_configured':
        return 'Supabase 설정 필요';
      default:
        return '알 수 없는 상태';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'not_configured':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
}

