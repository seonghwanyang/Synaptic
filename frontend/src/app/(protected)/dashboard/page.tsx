import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';
import { NoteCentricDashboard } from '@/components/dashboard/NoteCentricDashboard';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <NoteCentricDashboard />
      <DashboardClient />
    </>
  );
}
