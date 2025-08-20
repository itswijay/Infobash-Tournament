import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { LogOut, User } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth()
  const [imageError, setImageError] = useState(false)

  if (!user) return null

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  // Get avatar URL with fallbacks and optimize Google URLs
  const rawAvatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    user.user_metadata?.avatar ||
    user.identities?.[0]?.identity_data?.avatar_url ||
    user.identities?.[0]?.identity_data?.picture

  // Optimize Google avatar URL for better loading
  const avatarUrl = rawAvatarUrl
    ? rawAvatarUrl.replace('=s96-c', '=s128-c')
    : null

  const userInitials =
    user.user_metadata?.full_name
      ?.split(' ')
      ?.map((name: string) => name[0])
      ?.join('')
      ?.toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    '?'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-1)]/50 focus:ring-offset-2 focus:ring-offset-transparent hover:ring-2 hover:ring-[var(--color-accent-1)]/30 transition-all duration-200 hover:scale-105">
          <Avatar className="h-9 w-9 ring-2 ring-[color:rgb(255_255_255/0.1)] hover:ring-[var(--color-accent-1)]/40 transition-all duration-200">
            <AvatarImage
              src={!imageError ? avatarUrl : undefined}
              alt={user.user_metadata?.full_name || user.email || 'User'}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent-1)] text-[var(--brand-bg)] font-semibold text-sm border border-[color:rgb(255_255_255/0.1)]">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-[color:rgb(255_255_255/0.08)] backdrop-blur-md border border-[color:rgb(255_255_255/0.12)] text-white shadow-2xl rounded-lg"
      >
        <DropdownMenuLabel className="text-[var(--color-secondary)] font-medium px-3 py-2">
          {user.user_metadata?.full_name || user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[color:rgb(255_255_255/0.1)] mx-2" />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-[color:rgb(255_255_255/0.25)] focus:bg-[color:rgb(255_255_255/0.25)] hover:text-white focus:text-white rounded-md mx-2 my-1 transition-all duration-200"
          asChild
        >
          <Link to={ROUTES.PROFILE}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[color:rgb(255_255_255/0.1)] mx-2" />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-red-500/20 focus:bg-red-500/20 text-red-400 hover:text-red-200 focus:text-red-200 rounded-md mx-2 my-1 transition-all duration-200"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
