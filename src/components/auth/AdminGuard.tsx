import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface AdminGuardProps {
  children: React.ReactNode
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    // Show loading spinner while checking authentication and role
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--brand-bg)]">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-[var(--text-secondary)]">
            Checking permissions...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    // Redirect to home if not authenticated
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />
  }

  if (!isAdmin) {
    // Redirect to home if user is not an admin
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />
  }

  // User is authenticated and is an admin, render the protected content
  return <>{children}</>
}
