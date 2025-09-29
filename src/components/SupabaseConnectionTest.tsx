import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { testSupabaseConnection, supabase } from '../lib/supabase';

interface ConnectionStatus {
  connected: boolean;
  error?: string;
  tables?: string[];
  dataCount?: { [key: string]: number };
}

export default function SupabaseConnectionTest() {
  const [status, setStatus] = useState<ConnectionStatus>({ connected: false });
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // 기본 연결 테스트
      const connectionTest = await testSupabaseConnection();
      
      if (!connectionTest.success) {
        setStatus({ connected: false, error: connectionTest.error });
        return;
      }

      // 테이블 존재 확인
      const tables = ['hero_banners', 'banner_images'];
      const tableChecks = await Promise.all(
        tables.map(async (table) => {
          try {
            const { data, error } = await supabase
              .from(table)
              .select('id')
              .limit(1);
            
            if (error) {
              console.error(`테이블 ${table} 확인 실패:`, error);
              return { table, exists: false, error: error.message };
            }
            
            return { table, exists: true, count: data?.length || 0 };
          } catch (err) {
            return { table, exists: false, error: err instanceof Error ? err.message : 'Unknown error' };
          }
        })
      );

      // 데이터 개수 확인
      const dataCount: { [key: string]: number } = {};
      const existingTables: string[] = [];
      
      for (const check of tableChecks) {
        if (check.exists) {
          existingTables.push(check.table);
          dataCount[check.table] = check.count || 0;
        }
      }

      setStatus({
        connected: true,
        tables: existingTables,
        dataCount
      });

    } catch (error) {
      console.error('연결 테스트 중 오류:', error);
      setStatus({ 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="bg-[#11162A] border-gray-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Supabase 연결 상태
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
            ) : status.connected ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={`font-medium ${
              status.connected ? 'text-green-400' : 'text-red-400'
            }`}>
              {loading ? '연결 확인 중...' : 
               status.connected ? '연결됨' : '연결 실패'}
            </span>
          </div>
          <Button
            onClick={testConnection}
            disabled={loading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            다시 테스트
          </Button>
        </div>

        {status.error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
            <strong>오류:</strong> {status.error}
          </div>
        )}

        {status.connected && status.tables && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">테이블 상태:</h4>
            <div className="grid gap-2">
              {status.tables.map((table) => (
                <div key={table} className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded">
                  <span className="text-gray-300 font-mono text-sm">{table}</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400 text-sm">
                      {status.dataCount?.[table] || 0}개 레코드
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {status.connected && (!status.tables || status.tables.length === 0) && (
          <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-300 px-4 py-3 rounded-lg">
            <strong>경고:</strong> 필요한 테이블이 생성되지 않았습니다. 
            <br />
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-yellow-200"
            >
              Supabase 대시보드
            </a>에서 SQL을 실행해주세요.
          </div>
        )}

        <div className="text-xs text-gray-400">
          <p>문제가 지속되면 다음을 확인해주세요:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>환경 변수 설정 (.env 파일)</li>
            <li>Supabase 프로젝트 활성화 상태</li>
            <li>테이블 생성 및 RLS 정책 설정</li>
            <li>API 키 권한</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
