import React, { useState, useEffect } from 'react';
import { Download, Share2, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface SocialMediaPreviewProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  siteUrl?: string;
}

export default function SocialMediaPreview({
  title = "Daddy Bath Bomb - Premium Bath Products",
  description = "Natural bath bombs, bubble baths & bath gels for relaxing family time",
  imageUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=630&fit=crop",
  siteUrl = "https://www.daddybathbomb.com"
}: SocialMediaPreviewProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  const shareData = {
    title,
    description,
    url: siteUrl
  };

  const handleShare = async (platform: string) => {
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(siteUrl)}`, '_blank');
        break;
      case 'instagram':
        // Instagram은 직접 링크 공유를 지원하지 않으므로 URL만 복사
        copyToClipboard(siteUrl, 'instagram');
        break;
      case 'kakao':
        // KakaoTalk 공유 (Kakao SDK가 있다면 사용)
        if (window.Kakao) {
          window.Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
              title,
              description,
              imageUrl,
              link: {
                mobileWebUrl: siteUrl,
                webUrl: siteUrl,
              },
            },
          });
        } else {
          copyToClipboard(siteUrl, 'kakao');
        }
        break;
      default:
        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (error) {
            console.error('공유 실패:', error);
          }
        } else {
          copyToClipboard(siteUrl, 'native');
        }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">소셜 미디어 공유 미리보기</h2>
        <p className="text-gray-600">메신저와 소셜 미디어에서 링크 공유 시 표시되는 모습입니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facebook/일반 메신저 미리보기 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Facebook className="w-5 h-5 text-blue-600" />
              Facebook / 메신저 미리보기
            </CardTitle>
            <CardDescription>Facebook, 카카오톡, 텔레그램 등에서 표시되는 형태</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              {/* 이미지 */}
              <div className="aspect-[1.91/1] bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 relative overflow-hidden">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* 오버레이 텍스트 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-white/90 text-sm line-clamp-2">
                    {description}
                  </p>
                </div>
              </div>
              
              {/* 하단 정보 */}
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FF2D55] to-[#007AFF] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">DB</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Daddy Bath Bomb</p>
                    <p className="text-sm text-gray-500">{siteUrl.replace('https://', '')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={() => handleShare('facebook')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook 공유
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(siteUrl, 'url')}
                className="flex-1"
              >
                {copied === 'url' ? '복사됨!' : 'URL 복사'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Twitter 미리보기 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Twitter className="w-5 h-5 text-blue-400" />
              Twitter 미리보기
            </CardTitle>
            <CardDescription>Twitter에서 링크 공유 시 표시되는 형태</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              {/* 이미지 */}
              <div className="aspect-[1.91/1] bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 relative overflow-hidden">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              
              {/* 하단 정보 */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{siteUrl.replace('https://', '')}</span>
                  <Badge variant="outline" className="text-xs">
                    daddybathbomb.com
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={() => handleShare('twitter')}
                className="flex-1 bg-blue-400 hover:bg-blue-500 text-white"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter 공유
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(siteUrl, 'twitter')}
                className="flex-1"
              >
                {copied === 'twitter' ? '복사됨!' : 'URL 복사'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 모바일 메신저 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            모바일 메신저 미리보기
          </CardTitle>
          <CardDescription>카카오톡, 텔레그램, WhatsApp 등 모바일 메신저에서 표시되는 형태</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm mx-auto">
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
              {/* 이미지 */}
              <div className="aspect-[1.91/1] bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 relative overflow-hidden">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              
              {/* 하단 정보 */}
              <div className="p-3">
                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                  {title}
                </h3>
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                  {description}
                </p>
                <p className="text-xs text-gray-500">{siteUrl.replace('https://', '')}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4 justify-center">
            <Button
              size="sm"
              onClick={() => handleShare('kakao')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              카카오톡 공유
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(siteUrl, 'mobile')}
            >
              {copied === 'mobile' ? '복사됨!' : 'URL 복사'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 메타데이터 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-600" />
            메타데이터 정보
          </CardTitle>
          <CardDescription>현재 설정된 소셜 미디어 메타데이터</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목 (og:title)</label>
              <div className="flex gap-2">
                <Input
                  value={title}
                  readOnly
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(title, 'title')}
                >
                  {copied === 'title' ? '복사됨!' : '복사'}
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명 (og:description)</label>
              <div className="flex gap-2">
                <Input
                  value={description}
                  readOnly
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(description, 'description')}
                >
                  {copied === 'description' ? '복사됨!' : '복사'}
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL (og:image)</label>
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(imageUrl, 'image')}
                >
                  {copied === 'image' ? '복사됨!' : '복사'}
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사이트 URL (og:url)</label>
              <div className="flex gap-2">
                <Input
                  value={siteUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(siteUrl, 'url')}
                >
                  {copied === 'url' ? '복사됨!' : '복사'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
