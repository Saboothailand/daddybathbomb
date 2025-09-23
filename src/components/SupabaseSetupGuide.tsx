import React, { useState } from 'react';
import { CheckCircle, Copy, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface SupabaseSetupGuideProps {
  className?: string;
}

export default function SupabaseSetupGuide({ className = '' }: SupabaseSetupGuideProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = async (text: string, step: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(step);
      setTimeout(() => setCopiedStep(null), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Supabase 프로젝트 생성',
      description: 'Supabase 대시보드에서 새 프로젝트를 생성하세요',
      action: 'Supabase 대시보드 열기',
      url: 'https://supabase.com/dashboard',
      code: null
    },
    {
      id: 2,
      title: '환경 변수 설정',
      description: '.env 파일에 Supabase 설정을 추가하세요',
      action: '코드 복사',
      url: null,
      code: `# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 예시:
# VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
    },
    {
      id: 3,
      title: '데이터베이스 마이그레이션',
      description: 'Supabase SQL Editor에서 마이그레이션 스크립트를 실행하세요',
      action: '마이그레이션 스크립트 복사',
      url: null,
      code: `-- 1. 기본 스키마 생성
-- supabase/migrations/001_initial_schema.sql 파일의 내용을 실행

-- 2. 히어로 배너 테이블 생성
-- supabase/migrations/008_hero_banners.sql 파일의 내용을 실행

-- 3. 관리자 함수 생성
-- supabase/sql/admin_media_functions.sql 파일의 내용을 실행`
    },
    {
      id: 4,
      title: 'RLS 정책 확인',
      description: 'Row Level Security 정책이 올바르게 설정되었는지 확인하세요',
      action: '정책 확인',
      url: null,
      code: `-- RLS가 활성화되어 있는지 확인
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('hero_banners', 'banner_images', 'gallery_images');`
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Supabase 설정 가이드</h2>
        <p className="text-gray-300">Supabase 데이터베이스와 연결하기 위한 단계별 가이드입니다.</p>
      </div>

      <div className="grid gap-4">
        {steps.map((step, index) => (
          <Card key={step.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-blue-600 text-white border-blue-500">
                  {step.id}
                </Badge>
                <CardTitle className="text-white">{step.title}</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                {step.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {step.url && (
                  <Button
                    onClick={() => window.open(step.url, '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {step.action}
                  </Button>
                )}
                
                {step.code && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">코드:</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(step.code!, step.id)}
                        className="text-xs"
                      >
                        {copiedStep === step.id ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            복사됨
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-1" />
                            복사
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="bg-gray-900 text-gray-300 p-3 rounded-lg text-xs overflow-x-auto">
                      {step.code}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-yellow-900/20 border-yellow-600">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <CardTitle className="text-yellow-400">중요한 참고사항</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="text-yellow-200 space-y-2 text-sm">
            <li>• 환경 변수 설정 후 개발 서버를 재시작해야 합니다.</li>
            <li>• Supabase 프로젝트의 API 키는 공개되어도 안전합니다 (anon key).</li>
            <li>• RLS 정책이 올바르게 설정되지 않으면 데이터 접근이 제한될 수 있습니다.</li>
            <li>• 마이그레이션 스크립트는 순서대로 실행해야 합니다.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

