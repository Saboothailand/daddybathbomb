import React, { useState, useEffect } from 'react';
import { Eye, MessageCircle, Calendar, User, ThumbsUp, FileText, Search, Plus, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { PageKey, LanguageKey } from '../App';

type BoardItem = {
  id: string;
  title: string;
  content: string;
  author_name: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_notice: boolean;
  board_category: string;
  created_at: string;
};

type NoticePageProps = {
  navigateTo: (page: PageKey) => void;
  language: LanguageKey;
};

export default function NoticePage({ navigateTo, language }: NoticePageProps) {
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<BoardItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoardItems();
  }, []);

  const loadBoardItems = async () => {
    try {
      const { data, error } = await supabase
        .from('board')
        .select('*')
        .eq('is_active', true)
        .order('is_notice', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading board items:', error);
        // 폴백 데이터 사용
        setBoardItems(getFallbackData());
      } else {
        setBoardItems(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setBoardItems(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = (): BoardItem[] => [
    {
      id: '1',
      title: 'Daddy Bath Bomb 갤러리 & 게시판 오픈!',
      content: '<h2>안녕하세요! Daddy Bath Bomb입니다.</h2><p>저희 갤러리와 게시판이 오픈했습니다!</p><ul><li>자연 재료 100% 바스밤 갤러리</li><li>자유로운 게시판 소통</li><li>실시간 좋아요 & 댓글 시스템</li></ul><p>많은 이용 부탁드립니다!</p>',
      author_name: '관리자',
      view_count: 245,
      like_count: 45,
      comment_count: 12,
      is_notice: true,
      board_category: 'general',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: '바스밤 사용법 문의',
      content: '바스밤을 어떻게 사용해야 하는지 궁금합니다. 온도나 시간에 특별한 주의사항이 있나요?',
      author_name: '김궁금',
      view_count: 78,
      like_count: 8,
      comment_count: 5,
      is_notice: false,
      board_category: 'qna',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      title: '정말 좋아요!',
      content: '친구가 추천해줘서 샀는데 정말 좋네요. 향도 좋고 피부에도 부드러워요. 재구매 의사 100%입니다!',
      author_name: '박만족',
      view_count: 123,
      like_count: 22,
      comment_count: 8,
      is_notice: false,
      board_category: 'review',
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  const handleLike = async (itemId: string) => {
    try {
      const userIp = 'anonymous';
      
      const { error } = await supabase
        .from('likes')
        .insert({
          board_id: itemId,
          user_ip: userIp
        });

      if (!error) {
        setBoardItems(prev => prev.map(item => 
          item.id === itemId 
            ? { ...item, like_count: item.like_count + 1 }
            : item
        ));
      }
    } catch (error) {
      console.error('Error liking item:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredItems = boardItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.board_category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#1A1F3A] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedItem(null)}
            className="flex items-center text-[#B8C4DB] hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            목록으로 돌아가기
          </button>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 comic-border border-4 border-white/20">
            {selectedItem.is_notice && (
              <div className="bg-[#FF2D55] text-white text-sm px-3 py-1 rounded-full inline-block mb-4">
                공지사항
              </div>
            )}
            
            <h1 className="text-3xl font-bold text-white mb-6">
              {selectedItem.title}
            </h1>
            
            <div className="flex items-center justify-between text-[#B8C4DB] mb-8 pb-4 border-b border-white/20">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {selectedItem.author_name}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(selectedItem.created_at)}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {selectedItem.view_count}
                </div>
                <button 
                  onClick={() => handleLike(selectedItem.id)}
                  className="flex items-center hover:text-[#FFD700] transition-colors"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {selectedItem.like_count}
                </button>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {selectedItem.comment_count}
                </div>
              </div>
            </div>

            <div 
              className="prose prose-invert max-w-none text-[#B8C4DB] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedItem.content }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#1A1F3A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF2D55] mx-auto mb-4"></div>
          <p className="text-[#B8C4DB]">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] to-[#1A1F3A] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="font-fredoka text-5xl font-bold text-white mb-6 comic-shadow">
            {language === "th" ? "กระทู้" : "Board"}
          </h1>
          <p className="text-[#B8C4DB] text-xl">
            {language === "th" 
              ? "แชร์ประสบการณ์และเรื่องราวของคุณ!" 
              : "Share your experiences and stories!"}
          </p>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 comic-border border-4 border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B8C4DB] w-5 h-5" />
              <input
                type="text"
                placeholder={language === "th" ? "ค้นหาตามชื่อหรือผู้เขียน..." : "Search by title or author..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#151B2E] border border-[#334155] rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-[#151B2E] border border-[#334155] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FF2D55]"
            >
              <option value="all">{language === "th" ? "ทั้งหมด" : "All"}</option>
              <option value="general">{language === "th" ? "ทั่วไป" : "General"}</option>
              <option value="qna">Q&A</option>
              <option value="review">{language === "th" ? "รีวิว" : "Review"}</option>
            </select>
            <button className="bg-[#FF2D55] hover:bg-[#FF1744] text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              {language === "th" ? "เขียนโพสต์" : "Write Post"}
            </button>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl comic-border border-4 border-white/20 overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-[#B8C4DB] mx-auto mb-4" />
              <p className="text-[#B8C4DB]">등록된 게시글이 없습니다.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/20">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-6 hover:bg-white/5 transition-colors cursor-pointer group"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        {item.is_notice && (
                          <span className="bg-[#FF2D55] text-white text-xs px-2 py-1 rounded-full mr-3">
                            공지
                          </span>
                        )}
                        <span className="bg-[#007AFF] text-white text-xs px-2 py-1 rounded-full mr-3">
                          {item.board_category}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#FFD700] transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-[#B8C4DB]">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {item.author_name}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(item.created_at)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {item.view_count}
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(item.id);
                            }}
                            className="flex items-center hover:text-[#FFD700] transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {item.like_count}
                          </button>
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {item.comment_count}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}