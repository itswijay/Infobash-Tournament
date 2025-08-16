import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { ROUTES } from '@/lib/constants'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface ProfileGuardProps {
  children: React.ReactNode
}

export const ProfileGuard: React.FC<ProfileGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const [profileLoading, setProfileLoading] = useState(true)
  const [hasCompleteProfile, setHasCompleteProfile] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user) {
        setProfileLoading(false)
        return
      }

      try {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "not found" error
          console.error('Error checking profile:', error)
          setProfileLoading(false)
          return
        }

        const profileComplete = profile?.is_completed === true
        setHasCompleteProfile(profileComplete)

        // Handle navigation based on profile completion status
        if (
          profileComplete &&
          location.pathname === ROUTES.PROFILE_COMPLETION
        ) {
          // User has completed profile but is on completion page - redirect to home
          navigate(ROUTES.HOME, { replace: true })
        } else if (
          !profileComplete &&
          location.pathname !== ROUTES.PROFILE_COMPLETION
        ) {
          // User doesn't have completed profile and is not on completion page - redirect to completion
          navigate(ROUTES.PROFILE_COMPLETION, { replace: true })
        }
      } catch (error) {
        console.error('Error checking profile completion:', error)
      } finally {
        setProfileLoading(false)
      }
    }

    if (!authLoading && user) {
      checkProfileCompletion()
    } else if (!authLoading && !user) {
      setProfileLoading(false)
    }
  }, [user, authLoading, navigate, location.pathname])

  // Show loading while checking auth or profile
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-bg)]">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-[var(--text-secondary)]">
            {authLoading ? 'Authenticating...' : 'Checking profile...'}
          </p>
        </div>
      </div>
    )
  }

  // If user is not authenticated, let the parent handle it
  if (!user) {
    return <>{children}</>
  }

  // Handle redirect scenarios (the useEffect will handle the actual navigation)
  if (hasCompleteProfile && location.pathname === ROUTES.PROFILE_COMPLETION) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-bg)]">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-[var(--text-secondary)]">
            Profile already complete. Redirecting to home...
          </p>
        </div>
      </div>
    )
  }

  if (!hasCompleteProfile && location.pathname !== ROUTES.PROFILE_COMPLETION) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-bg)]">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-[var(--text-secondary)]">
            Redirecting to profile setup...
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
