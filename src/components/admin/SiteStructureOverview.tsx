import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowRight, ExternalLink } from 'lucide-react';

const siteStructure = [
  {
    id: 'header',
    name: '헤더',
    description: '사이트 로고, 네비게이션, 언어 설정',
    adminPath: 'Brand Management',
    icon: '🏠',
    color: 'bg-blue-500',
    order: 1
  },
    {
      id: 'middle-1',
      name: '미들 1 - 히어로 섹션',
      description: '메인 히어로 배너 캐러셀',
      adminPath: 'Banner Studio > Hero Banners',
      icon: '🎯',
      color: 'bg-green-500',
      order: 2
    },
    {
      id: 'fun-features',
      name: '재미있는 기능',
      description: '6개 기능 카드 (자연성분, 색상, 피부보호 등)',
      adminPath: 'Content Management',
      icon: '⭐',
      color: 'bg-yellow-500',
      order: 3
    },
    {
      id: 'middle-banner',
      name: '미들 배너 - 프로모션',
      description: '중간 프로모션 배너 (텍스트 없음)',
      adminPath: 'Banner Studio > Promotional Banners > Middle',
      icon: '📍',
      color: 'bg-orange-500',
      order: 4
    },
    {
      id: 'middle-2',
      name: '미들 2 - 제품 갤러리',
      description: '제품 갤러리 (4개씩 2줄)',
      adminPath: 'Gallery Management',
      icon: '🖼️',
      color: 'bg-purple-500',
      order: 5
    },
    {
      id: 'how-to-use',
      name: '사용법 가이드',
      description: '5단계 사용법 가이드',
      adminPath: 'Content Management',
      icon: '📋',
      color: 'bg-indigo-500',
      order: 6
    },
    {
      id: 'footer',
      name: '푸터',
      description: '사이트 정보, 소셜 미디어 링크',
      adminPath: 'Brand Management',
      icon: '📄',
      color: 'bg-gray-500',
      order: 7
    }
];

export default function SiteStructureOverview() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white font-fredoka drop-shadow-md mb-4">
          🏗️ 사이트 구조 개요
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          현재 사이트는 5개 섹션으로 구성되어 있습니다. 각 섹션을 클릭하여 관리 페이지로 이동할 수 있습니다.
        </p>
      </div>

      <div className="grid gap-4">
        {siteStructure.map((section, index) => (
          <Card key={section.id} className="bg-[#11162A] border border-gray-700 hover:border-gray-600 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${section.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {section.icon}
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                      {section.name}
                      <Badge variant="outline" className="text-xs bg-gray-800 text-gray-300 border-gray-600">
                        #{section.order}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-1">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">{section.adminPath}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  관리자 페이지에서 수정 가능
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#007AFF] text-white text-xs">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    관리하기
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30">
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          💡 관리 팁
        </h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span><strong>헤더/푸터:</strong> Brand Management에서 로고, 네비게이션, 소셜 미디어 링크 관리</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">•</span>
            <span><strong>히어로 섹션:</strong> Banner Studio {'>'} Hero Banners에서 메인 배너 캐러셀 관리</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 mt-1">•</span>
            <span><strong>재미있는 기능:</strong> Content Management에서 6개 기능 카드 관리</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-1">•</span>
            <span><strong>미들 배너:</strong> Banner Studio {'>'} Promotional Banners에서 프로모션 배너 관리 (텍스트 없음)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">•</span>
            <span><strong>제품 갤러리:</strong> Gallery Management에서 제품 이미지와 카테고리 관리</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-1">•</span>
            <span><strong>사용법 가이드:</strong> Content Management에서 5단계 사용법 가이드 관리</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
