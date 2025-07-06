import { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: '비밀번호 재설정 - Synaptic',
  description: '비밀번호를 재설정하세요',
}

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md px-4">
      <ForgotPasswordForm />
    </div>
  )
}