'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Lightbulb, 
  CheckCircle, 
  Network,
  TrendingUp,
  Brain,
  Clock,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuickCaptureModal } from '@/providers/QuickCaptureProvider'
import Link from 'next/link'

// Mock data - replace with real API calls
const mockStats = {
  totalNotes: 142,
  weeklyIdeas: 23,
  completedTasks: 17,
  connections: 89,
  trends: {
    notes: '+12%',
    ideas: '+23%',
    tasks: '+8%',
    connections: '+15%'
  }
}

const mockRecentNotes = [
  {
    id: '1',
    content: 'Meeting notes about the new project timeline',
    category: 'work',
    createdAt: new Date('2025-01-07T10:00:00'),
  },
  {
    id: '2',
    content: 'Interesting article about machine learning',
    category: 'learning',
    createdAt: new Date('2025-01-07T14:30:00'),
  },
  {
    id: '3',
    content: 'Personal goal: Start morning meditation',
    category: 'personal',
    createdAt: new Date('2025-01-07T08:00:00'),
  },
]

const mockInsights = [
  {
    id: '1',
    type: 'pattern',
    message: 'You capture most ideas during morning hours (8-10 AM)',
    icon: Brain,
  },
  {
    id: '2',
    type: 'suggestion',
    message: '3 notes about "machine learning" might be related',
    icon: Network,
  },
  {
    id: '3',
    type: 'reminder',
    message: 'You have 2 tasks scheduled for today',
    icon: Clock,
  },
]

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  trend: string
  color: string
}

function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  const bgColors = {
    coral: 'bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-900/20 dark:to-rose-800/10',
    teal: 'bg-gradient-to-br from-cyan-100 to-cyan-50 dark:from-cyan-900/20 dark:to-cyan-800/10',
    green: 'bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/10',
    purple: 'bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/10',
  }

  const textColors = {
    coral: 'text-rose-600 dark:text-rose-400',
    teal: 'text-cyan-600 dark:text-cyan-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`${bgColors[color as keyof typeof bgColors]} p-6 rounded-xl shadow-sm hover:shadow-md transition-all`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
            {value.toLocaleString()}
          </p>
          <p className={`text-sm mt-2 ${textColors[color as keyof typeof textColors]}`}>
            <TrendingUp className="w-4 h-4 inline-block mr-1" />
            {trend} this week
          </p>
        </div>
        <div className={`p-3 rounded-lg ${bgColors[color as keyof typeof bgColors]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

export function DashboardContent() {
  const { open: openQuickCapture } = useQuickCaptureModal()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('좋은 아침이에요')
    else if (hour < 18) setGreeting('좋은 오후에요')
    else setGreeting('좋은 저녁이에요')
  }, [])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {greeting}, 사용자님! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          오늘도 멋진 아이디어를 기록해보세요
        </p>
      </div>

      {/* Quick Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          onClick={openQuickCapture}
          size="lg"
          className="bg-gradient-to-r from-cyan-600 to-rose-600 hover:from-cyan-700 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Quick Capture (⌘+Shift+N)
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="총 노트"
          value={mockStats.totalNotes}
          icon={<FileText className="w-6 h-6 text-rose-600" />}
          trend={mockStats.trends.notes}
          color="coral"
        />
        <StatCard
          title="이번 주 아이디어"
          value={mockStats.weeklyIdeas}
          icon={<Lightbulb className="w-6 h-6 text-cyan-600" />}
          trend={mockStats.trends.ideas}
          color="teal"
        />
        <StatCard
          title="완료된 태스크"
          value={mockStats.completedTasks}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          trend={mockStats.trends.tasks}
          color="green"
        />
        <StatCard
          title="연결된 인사이트"
          value={mockStats.connections}
          icon={<Network className="w-6 h-6 text-purple-600" />}
          trend={mockStats.trends.connections}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Notes */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">최근 노트</h2>
              <Link href="/notes">
                <Button variant="ghost" size="sm">
                  View All →
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {mockRecentNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/notes/${note.id}`}>
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                      <p className="text-gray-900 dark:text-gray-100 line-clamp-1">
                        {note.content}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="capitalize">{note.category}</span>
                        <span>
                          {new Date(note.createdAt).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div>
          <div className="bg-gradient-to-br from-cyan-50 to-rose-50 dark:from-cyan-900/20 dark:to-rose-900/20 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              오늘의 인사이트
            </h2>
            <div className="space-y-3">
              {mockInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <insight.icon className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {insight.message}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}