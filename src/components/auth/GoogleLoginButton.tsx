import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

interface GoogleLoginButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'modern' | 'hero'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  children?: React.ReactNode
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  variant = 'modern',
  size = 'default',
  className = '',
  children,
}) => {
  const { signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('Failed to sign in with Google:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Define custom styles for modern variant
  const getButtonStyles = () => {
    if (variant === 'modern') {
      return `
        bg-[color:rgb(255_255_255/0.08)] backdrop-blur-md border border-[color:rgb(255_255_255/0.15)]
        hover:bg-[color:rgb(255_255_255/0.12)] hover:border-[color:rgb(255_255_255/0.25)]
        text-white font-medium transition-all duration-200 shadow-md
        hover:shadow-lg hover:shadow-[color:rgb(255_255_255/0.05)]
        focus:ring-2 focus:ring-[var(--color-accent-1)]/50 focus:ring-offset-2 focus:ring-offset-background
      `
        .replace(/\s+/g, ' ')
        .trim()
    } else if (variant === 'hero') {
      return `
        bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent-1)]
        hover:from-[var(--color-secondary)]/95 hover:to-[var(--color-accent-1)]/95
        text-[var(--brand-bg)] font-semibold border-0 shadow-lg
        transition-all duration-200 hover:shadow-xl
        focus:ring-2 focus:ring-[var(--color-accent-1)]/50 focus:ring-offset-2 focus:ring-offset-background
      `
        .replace(/\s+/g, ' ')
        .trim()
    }
    return ''
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      variant={variant === 'modern' || variant === 'hero' ? 'ghost' : variant}
      size={size}
      className={`flex items-center gap-2 ${
        variant === 'modern' || variant === 'hero' ? getButtonStyles() : ''
      } ${className}`}
    >
      <svg
        className="h-4 w-4 flex-shrink-0 opacity-90"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      <span
        className={`whitespace-nowrap font-medium ${
          variant === 'modern' ? 'text-white' : ''
        }`}
      >
        {isLoading ? 'Signing in...' : children || 'Continue with Google'}
      </span>
    </Button>
  )
}
