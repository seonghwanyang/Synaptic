import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from './DashboardClient'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            안녕하세요, {profile?.full_name || user.email}님!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Synaptic 대시보드에 오신 것을 환영합니다.
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-coral-50 dark:bg-coral-900/20 rounded-lg p-4">
              <h3 className="text-lg font-medium text-coral-900 dark:text-coral-100">
                총 노트
              </h3>
              <p className="mt-2 text-3xl font-bold text-coral-600 dark:text-coral-400">
                {profile?.total_notes || 0}
              </p>
            </div>
            
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
              <h3 className="text-lg font-medium text-teal-900 dark:text-teal-100">
                연결된 노트
              </h3>
              <p className="mt-2 text-3xl font-bold text-teal-600 dark:text-teal-400">
                {profile?.total_connections || 0}
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100">
                최근 활동
              </h3>
              <p className="mt-2 text-sm text-purple-600 dark:text-purple-400">
                {profile?.last_active_at 
                  ? new Date(profile.last_active_at).toLocaleDateString('ko-KR')
                  : '활동 없음'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <DashboardClient />
    </div>
  )
}