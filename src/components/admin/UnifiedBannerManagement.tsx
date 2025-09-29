import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Star, Image as ImageIcon } from 'lucide-react';
import HeroBannerManagement from './HeroBannerManagement';
import BannerManagement from './BannerManagement';

type UnifiedBannerManagementProps = {
  defaultTab?: 'hero' | 'general';
};

export default function UnifiedBannerManagement({ defaultTab = 'hero' }: UnifiedBannerManagementProps) {
  const [activeTab, setActiveTab] = useState<'hero' | 'general'>(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white font-fredoka drop-shadow-md">
          Banner Studio
        </h1>
        <p className="text-gray-300 max-w-2xl">
          Manage the hero carousel and in-page promotional banners together. Switch tabs to update
          the large hero experience or the banners that appear throughout the site.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'hero' | 'general')} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-[#11162A] border border-gray-700 rounded-xl p-1">
          <TabsTrigger
            value="hero"
            className="flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-gray-300 transition data-[state=active]:bg-[#007AFF] data-[state=active]:text-white"
          >
            <Star className="w-4 h-4" />
            Hero Banners
          </TabsTrigger>
          <TabsTrigger
            value="general"
            className="flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-gray-300 transition data-[state=active]:bg-[#FF2D55] data-[state=active]:text-white"
          >
            <ImageIcon className="w-4 h-4" />
            Promotional Banners
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card className="bg-[#11162A] border border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white">Homepage Hero</h2>
                  <p className="text-gray-400 text-sm">
                    Curate up to six hero slides with large imagery, taglines, and call-to-actions.
                  </p>
                </div>
                <Badge className="bg-[#007AFF] text-white">Hero</Badge>
              </div>
              <HeroBannerManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <Card className="bg-[#11162A] border border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white">Site Banners</h2>
                  <p className="text-gray-400 text-sm">
                    Manage hero, middle, bottom, and sidebar promotional banners from one list.
                  </p>
                </div>
                <Badge className="bg-[#FF2D55] text-white">Promo</Badge>
              </div>
              <BannerManagement embedded />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
