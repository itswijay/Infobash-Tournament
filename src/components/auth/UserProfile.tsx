import React from 'react'
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

export const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth()

  if (!user) return null

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

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
        <button className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:ring-offset-2 focus:ring-offset-background">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.user_metadata?.avatar_url}
              alt={user.user_metadata?.full_name || user.email || 'User'}
            />
            <AvatarFallback className="bg-brand-gold text-dark font-semibold text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-dark/95 backdrop-blur-sm border-dark-light text-white"
      >
        <DropdownMenuLabel className="text-brand-gold">
          {user.user_metadata?.full_name || user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-dark-light" />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-dark-light focus:bg-dark-light"
          disabled
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-dark-light" />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-dark-light focus:bg-dark-light text-red-400 focus:text-red-400"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
