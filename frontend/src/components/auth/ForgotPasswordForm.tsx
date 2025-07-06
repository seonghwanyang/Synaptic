'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/ui/icons'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

const forgotPasswordSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { resetPassword } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const { error } = await resetPassword(data.email)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Icons.mail className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
            이메일을 확인해주세요
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            비밀번호 재설정 링크를 이메일로 전송했습니다.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block text-sm text-teal-600 hover:text-teal-500"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          비밀번호를 잊으셨나요?
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          가입하신 이메일로 재설정 링크를 보내드립니다.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-coral-500 hover:bg-coral-600 text-white"
          disabled={isLoading}
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          재설정 링크 보내기
        </Button>

        <div className="text-center text-sm">
          <Link
            href="/login"
            className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      </form>
    </div>
  )
}