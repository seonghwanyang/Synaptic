'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

export const OAuthButtons = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { signInWithOAuth } = useAuth()

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(provider)
    await signInWithOAuth(provider)
    setIsLoading(null)
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        onClick={() => handleOAuthSignIn('google')}
        disabled={isLoading !== null}
      >
        {isLoading === 'google' ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
      
      <Button
        variant="outline"
        onClick={() => handleOAuthSignIn('github')}
        disabled={isLoading !== null}
      >
        {isLoading === 'github' ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.github className="mr-2 h-4 w-4" />
        )}
        GitHub
      </Button>
    </div>
  )
}