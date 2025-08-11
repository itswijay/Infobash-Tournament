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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Trophy,
  Users,
  Calendar,
  UserPlus,
  Menu,
  Home,
  BarChart3,
} from 'lucide-react'
import { APP_NAME, ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

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
    badge: 'Active',
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

  const isActive = (href: string) => {
    if (href === ROUTES.HOME) {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-slate-900/60 nav-enter">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 shadow-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex mx-6">
          <NavigationMenuList>
            {navigation.map((item) => (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      'group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-slate-800/50 hover:text-emerald-400 focus:bg-slate-800/50 focus:text-emerald-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                      isActive(item.href) &&
                        'bg-slate-800/70 text-emerald-400 shadow-md',
                      item.highlight &&
                        'text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20'
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-2 text-xs bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="ml-auto flex items-center space-x-4">
          {/* User menu placeholder */}
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>

          <Button
            size="sm"
            className="hidden sm:flex bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 shadow-lg transition-all duration-300 hover:scale-105"
          >
            Login
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden ml-4">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="grid gap-6 p-6">
              <Link
                to={ROUTES.HOME}
                className="flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-600">
                  <Trophy className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">{APP_NAME}</span>
              </Link>

              <div className="grid gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
                      isActive(item.href) && 'bg-accent text-accent-foreground',
                      item.highlight && 'text-green-600'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>

              <div className="border-t pt-4">
                <Button className="w-full" size="sm">
                  Login
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
