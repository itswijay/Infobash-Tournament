import { Link } from 'react-router-dom'
import { Trophy, Github, Twitter, Instagram, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APP_NAME, ROUTES } from '@/lib/constants'

const footerLinks = {
  tournament: [
    { name: 'Tournaments', href: ROUTES.TOURNAMENTS },
    { name: 'Teams', href: ROUTES.TEAMS },
    { name: 'Matches', href: ROUTES.MATCHES },
    { name: 'Register Team', href: ROUTES.REGISTER_TEAM },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Tournament Rules', href: '/rules' },
    { name: 'FAQ', href: '/faq' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Code of Conduct', href: '/conduct' },
  ],
}

const socialLinks = [
  { name: 'GitHub', icon: Github, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Email', icon: Mail, href: 'mailto:info@infobash.com' },
]

export function Footer() {
  return (
    <footer className="bg-[color:rgb(14_22_40/0.92)] border-t border-[var(--brand-border)] backdrop-blur-md">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link
              to={ROUTES.HOME}
              className="flex items-center space-x-2 mb-4 transition-all duration-300 hover:scale-105"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-gold shadow-lg">
                <Trophy className="h-5 w-5 text-[color:rgb(14_22_40)]" />
              </div>
              <span className="font-bold text-xl text-gradient-gold">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-md">
              The most comprehensive cricket tournament management platform.
              Register your team, follow live matches, and track tournament
              progress with real-time updates.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-9 w-9 p-0 text-[var(--text-secondary)] hover:text-[var(--color-secondary)] hover:bg-[color:rgb(255_255_255/0.04)] transition-all duration-200"
                >
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <item.icon className="h-4 w-4" />
                    <span className="sr-only">{item.name}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Tournament Links */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">
              Tournament
            </h3>
            <ul className="space-y-3">
              {footerLinks.tournament.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-secondary)] transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-secondary)] transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--color-secondary)] transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--brand-border)] mt-10 pt-8 flex flex-col sm:flex-row justify-center items-center">
          <p className="text-sm text-[var(--text-secondary)]">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
