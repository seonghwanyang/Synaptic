'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Type, FileText, TrendingUp, Plus, LogOut } from 'lucide-react';
import { useQuickCaptureModal } from '@/providers/QuickCaptureProvider';
import { api, supabase } from '@/lib/api/client';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface RecentNote {
  id: string;
  content: string;
  category?: string;
  createdAt: Date;
}

interface Stats {
  totalNotes: number;
  todayNotes: number;
  weeklyGrowth: string;
}

export function NoteCentricDashboard() {
  const { open: openQuickCapture } = useQuickCaptureModal();
  const router = useRouter();
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('사용자');
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalNotes: 0,
    todayNotes: 0,
    weeklyGrowth: '+0%'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('좋은 아침이에요');
    else if (hour < 18) setGreeting('좋은 오후예요');
    else setGreeting('좋은 저녁이에요');
  }, []);

  // Get user name
  useEffect(() => {
    const getUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try to get name from metadata, email, or profile
        const name = user.user_metadata?.full_name || 
                    user.user_metadata?.name ||
                    user.email?.split('@')[0] || 
                    '사용자';
        setUserName(name);
      }
    };
    getUserInfo();
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoading(false);
        return;
      }

      // Fetch recent notes
      const notesResponse = await api.notes.getAll({ limit: 5 });
      const notes = notesResponse.data.map((note: {
        id: string;
        content: string;
        category?: { slug: string };
        created_at: string;
      }) => ({
        id: note.id,
        content: note.content,
        category: note.category?.slug || 'personal',
        createdAt: new Date(note.created_at),
      }));
      setRecentNotes(notes);

      // Calculate simple stats
      const allNotesResponse = await api.notes.getAll({ limit: 100 });
      const totalNotes = allNotesResponse.data.length;
      
      // Count today's notes
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayNotes = allNotesResponse.data.filter((note: any) => 
        new Date(note.created_at) >= today
      ).length;

      setStats({
        totalNotes,
        todayNotes,
        weeklyGrowth: '+12%' // Mock for now
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [fetchDashboardData]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      toast.success('로그아웃되었습니다');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('로그아웃 중 오류가 발생했습니다');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section - Gradient Background */}
      <div className="bg-gradient-to-br from-coral-500 via-rose-500 to-teal-600 text-white relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
          </button>
        </div>
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2">
              {greeting}, {userName}님! 👋
            </h1>
            <p className="text-lg opacity-90 mb-8">
              오늘의 생각을 빠르게 기록해보세요
            </p>
            
            {/* Main CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openQuickCapture}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-lg font-medium transition-all"
            >
              <div className="p-2 bg-white/20 rounded-lg">
                <Type className="w-6 h-6" />
              </div>
              새 메모 작성
              <kbd className="ml-2 px-2 py-1 bg-white/10 rounded text-sm">
                ⌘+Shift+N
              </kbd>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Notes - Main Focus */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  최근 노트
                </h2>
                <Link
                  href="/notes"
                  className="text-coral-600 hover:text-coral-700 dark:text-coral-400 text-sm font-medium"
                >
                  전체 보기 →
                </Link>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentNotes.length > 0 ? (
                <div className="space-y-4">
                  {recentNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <p className="text-gray-900 dark:text-white line-clamp-2 mb-2">
                        {note.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                          {note.category}
                        </span>
                        <span>
                          {note.createdAt.toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    아직 노트가 없습니다
                  </p>
                  <button
                    onClick={openQuickCapture}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-coral-600 hover:bg-coral-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    첫 노트 작성하기
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Simple Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                통계
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">전체 노트</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalNotes}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">오늘 작성</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.todayNotes}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">주간 성장률</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-5 h-5" />
                    {stats.weeklyGrowth}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                빠른 작업
              </h3>
              <div className="space-y-2">
                <button
                  onClick={openQuickCapture}
                  className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Type className="w-4 h-4 inline mr-2 text-coral-600" />
                  텍스트 메모
                </button>
                <Link
                  href="/notes"
                  className="block w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4 inline mr-2 text-teal-600" />
                  모든 노트 보기
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}