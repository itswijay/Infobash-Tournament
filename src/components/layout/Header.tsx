import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Trophy, Users, Calendar, UserPlus, Menu, Home } from 'lucide-react'
import { APP_NAME, ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import { UserProfile } from '@/components/auth/UserProfile'
import logoImg from '@/assets/logo.png'

const navigation = [
  {
    name: 'Home',
    href: ROUTES.HOME,
    icon: Home,
  },
  {
    name: 'Tournaments',
    href: ROUTES.TOURNAMENTS,
    icon: Trophy,
    badge: 'Inactive',
  },
  {
    name: 'Teams',
    href: ROUTES.TEAMS,
    icon: Users,
  },
  {
    name: 'Matches',
    href: ROUTES.MATCHES,
    icon: Calendar,
  },
  {
    name: 'Register Team',
    href: ROUTES.REGISTER_TEAM,
    icon: UserPlus,
    highlight: true,
  },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { user, loading } = useAuth()

  const isActive = (href: string) => {
    if (href === ROUTES.HOME) {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--brand-border)] bg-[color:rgb(14_22_40/0.78)] backdrop-blur-md supports-[backdrop-filter]:bg-[color:rgb(14_22_40/0.6)] nav-enter">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
        >
          <img
            src={logoImg}
            alt="InfoBash Logo"
            className="h-14 w-auto object-contain"
          />
          <span className="font-bold text-xl text-gradient-gold">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <NavigationMenu className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
          <NavigationMenuList>
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        // Base
                        'group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-all duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                        // Non-active interactive colors
                        !active &&
                          'hover:bg-[color:rgb(255_255_255/0.04)] focus:bg-[color:rgb(255_255_255/0.05)] hover:text-[var(--color-accent-1)] focus:text-[var(--color-accent-1)]',
                        // Active state (lock text to white even on hover/focus)
                        active &&
                          'bg-[color:rgb(255_255_255/0.06)] text-white shadow-md hover:text-white focus:text-white hover:bg-[color:rgb(255_255_255/0.06)] focus:bg-[color:rgb(255_255_255/0.08)]',
                        // Highlight variant
                        item.highlight &&
                          (active
                            ? 'text-white bg-[color:rgb(221_131_10/0.18)] hover:bg-[color:rgb(221_131_10/0.2)] focus:bg-[color:rgb(221_131_10/0.22)]'
                            : 'text-white bg-[color:rgb(221_131_10/0.12)] hover:bg-[color:rgb(221_131_10/0.18)] hover:text-[var(--color-accent-1)]')
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-2 text-[10px] tracking-wide bg-[color:rgb(221_131_10/0.18)] text-[var(--color-accent-1)] border-[color:rgb(221_131_10/0.35)] pointer-events-none"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-dark-light animate-pulse" />
          ) : user ? (
            <div className="flex items-center space-x-2">
              <UserProfile />
            </div>
          ) : (
            <GoogleLoginButton
              variant="modern"
              size="sm"
              className="hidden sm:flex"
            >
              Continue with Google
            </GoogleLoginButton>
          )}
        </div>
        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden ml-4">
            <Button
              variant="ghost"
              size="lg"
              className="p-4 min-w-[48px] min-h-[48px]"
            >
              <Menu className="h-8 w-8" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Access navigation links and user account options
            </SheetDescription>
            <div className="grid gap-6">
              <Link
                to={ROUTES.HOME}
                className="flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <img
                  src={logoImg}
                  alt="InfoBash Logo"
                  className="h-14 w-auto object-contain"
                />
                <span className="font-bold text-xl text-gradient-gold">
                  {APP_NAME}
                </span>
              </Link>

              <div className="grid gap-2">
                {navigation.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'flex items-center rounded-md px-3 py-2 text-sm font-medium text-white transition-colors',
                        !active &&
                          'hover:bg-[color:rgb(255_255_255/0.05)] hover:text-[var(--color-secondary)]',
                        active &&
                          'bg-[color:rgb(255_255_255/0.08)] text-white hover:text-white',
                        item.highlight &&
                          (active
                            ? 'text-white bg-[color:rgb(221_131_10/0.2)] hover:bg-[color:rgb(221_131_10/0.24)]'
                            : 'text-white bg-[color:rgb(221_131_10/0.16)] hover:bg-[color:rgb(221_131_10/0.22)] hover:text-[var(--color-accent-1)]')
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-auto text-xs bg-[color:rgb(221_131_10/0.2)] text-[var(--color-accent-1)] border-[color:rgb(221_131_10/0.35)] pointer-events-none"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </div>

              <div className="border-t border-[var(--brand-border)] pt-4">
                {loading ? (
                  <div className="h-10 w-full rounded-md bg-dark-light animate-pulse" />
                ) : user ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">
                        Signed in as:
                      </span>
                      <UserProfile />
                    </div>
                  </div>
                ) : (
                  <GoogleLoginButton
                    variant="ghost"
                    size="sm"
                    className="w-full"
                  >
                    Sign In
                  </GoogleLoginButton>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
