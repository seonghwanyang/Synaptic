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

const signupSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string()
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '비밀번호는 대소문자와 숫자를 포함해야 합니다'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, '이름은 최소 2자 이상이어야 합니다').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
})

type SignupFormData = z.infer<typeof signupSchema>

export const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const { error } = await signUp(data.email, data.password, {
      full_name: data.fullName,
    })
    
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
            <Icons.check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
            회원가입이 완료되었습니다!
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            이메일을 확인하여 계정을 활성화해주세요.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Synaptic에 오신 것을 환영합니다
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          두 번째 뇌를 만들어 보세요
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName">이름 (선택)</Label>
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.fullName.message}
            </p>
          )}
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">비밀번호 확인</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.confirmPassword.message}
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
          회원가입
        </Button>

        <div className="text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">이미 계정이 있으신가요?</span>{' '}
          <Link
            href="/login"
            className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400"
          >
            로그인
          </Link>
        </div>
      </form>
    </div>
  )
}