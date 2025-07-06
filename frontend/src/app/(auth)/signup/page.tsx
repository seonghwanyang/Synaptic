import { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'
import { OAuthButtons } from '@/components/auth/OAuthButtons'

export const metadata: Metadata = {
  title: '회원가입 - Synaptic',
  description: 'Synaptic과 함께 아이디어를 정리하세요',
}

export default function SignupPage() {
  return (
    <div className="w-full max-w-md px-4">
      <SignupForm />
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-50 dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
              또는 다음으로 계속하기
            </span>
          </div>
        </div>

        <div className="mt-6">
          <OAuthButtons />
        </div>
      </div>
    </div>
  )
}