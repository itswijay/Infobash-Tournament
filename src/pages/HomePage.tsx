import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  Users,
  Calendar,
  ArrowRight,
  Play,
  Clock,
  ChevronDown,
  Github,
  Twitter,
  Instagram,
  Mail,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'

const stats = [
  {
    label: 'Active Tournaments',
    value: '3',
    icon: Trophy,
    color: 'text-[var(--color-secondary)]',
  },
  {
    label: 'Registered Teams',
    value: '24',
    icon: Users,
    color: 'text-[var(--color-accent-1)]',
  },
  {
    label: 'Matches Played',
    value: '48',
    icon: Calendar,
    color: 'text-[var(--text-secondary)]',
  },
  {
    label: 'Live Matches',
    value: '2',
    icon: Play,
    color: 'text-[var(--color-secondary)]',
  },
]

const upcomingMatches = [
  {
    id: '1',
    team1: 'Lightning Bolts',
    team2: 'Thunder Hawks',
    time: '2:00 PM',
    venue: 'Cricket Ground A',
  },
  {
    id: '2',
    team1: 'Fire Eagles',
    team2: 'Storm Tigers',
    time: '4:30 PM',
    venue: 'Cricket Ground B',
  },
]

const features = [
  {
    title: 'Team Registration',
    description: 'Register your cricket team with player details and team logo',
    icon: Users,
    href: ROUTES.REGISTER_TEAM,
    action: 'Register Now',
  },
  {
    title: 'Live Matches',
    description: 'Follow live cricket matches with real-time score updates',
    icon: Play,
    href: ROUTES.MATCHES,
    action: 'View Matches',
  },
  {
    title: 'Tournament Tracking',
    description: 'Track tournament progress, standings, and schedules',
    icon: Trophy,
    href: ROUTES.TOURNAMENTS,
    action: 'View Tournaments',
  },
]

export function HomePage() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Section configuration
  const sections = ['countdown', 'stats', 'features', 'highlights', 'footer']

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date('2025-08-29T09:00:00').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        )
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })

        // Update DOM elements directly for smooth animation
        const daysEl = document.getElementById('countdown-days')
        const hoursEl = document.getElementById('countdown-hours')
        const minutesEl = document.getElementById('countdown-minutes')
        const secondsEl = document.getElementById('countdown-seconds')

        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0')
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0')
        if (minutesEl)
          minutesEl.textContent = minutes.toString().padStart(2, '0')
        if (secondsEl)
          secondsEl.textContent = seconds.toString().padStart(2, '0')
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown() // Initial call
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let autoScrollTimeout: NodeJS.Timeout
    let lastScrollPosition = 0

    const isMobile = () => window.innerWidth < 768

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const headerHeight = 64
      const sectionHeight = windowHeight - headerHeight

      const currentSectionIndex = Math.floor(scrollPosition / sectionHeight)

      // Only enable auto-scroll for desktop, mobile gets natural scroll
      if (!isMobile()) {
        if (isScrolling) return // Prevent interference during auto-scroll

        const scrollWithinSection = scrollPosition % sectionHeight
        const scrollPercentage = scrollWithinSection / sectionHeight

        // Detect scroll direction
        const scrollDirection =
          scrollPosition > lastScrollPosition ? 'down' : 'up'
        lastScrollPosition = scrollPosition

        const threshold = 0.15

        clearTimeout(autoScrollTimeout)

        autoScrollTimeout = setTimeout(() => {
          if (isScrolling) return

          let targetSection = currentSectionIndex

          // Handle scrolling based on direction and percentage
          if (scrollDirection === 'down') {
            // Scrolling down - go to next section if scrolled enough
            if (
              scrollPercentage > threshold &&
              currentSectionIndex < sections.length - 1
            ) {
              targetSection = currentSectionIndex + 1
            } else {
              // Snap back to current section
              targetSection = currentSectionIndex
            }
          } else if (scrollDirection === 'up') {
            // Scrolling up - go to previous section if scrolled enough from top
            if (scrollPercentage < threshold && currentSectionIndex > 0) {
              targetSection = currentSectionIndex - 1
            } else {
              // Snap to current section
              targetSection = currentSectionIndex
            }
          }

          // Ensure we don't exceed boundaries
          targetSection = Math.max(
            0,
            Math.min(targetSection, sections.length - 1)
          )

          // Only auto-scroll if we need to move to a different position
          const targetY = targetSection * sectionHeight
          const tolerance = 50

          if (Math.abs(scrollPosition - targetY) > tolerance) {
            setIsScrolling(true)
            window.scrollTo({
              top: targetY,
              behavior: 'smooth',
            })

            // Reset after animation
            setTimeout(() => {
              setIsScrolling(false)
            }, 600)
          }
        }, 150)
      }

      // Update active section for navigation dots (both mobile and desktop)
      const sectionThresholds = [
        0,
        sectionHeight,
        sectionHeight * 2,
        sectionHeight * 3,
        sectionHeight * 4,
      ]

      let newActiveSection = 0
      for (let i = sectionThresholds.length - 1; i >= 0; i--) {
        if (scrollPosition >= sectionThresholds[i] - (isMobile() ? 50 : 100)) {
          newActiveSection = i
          break
        }
      }

      setActiveSection(newActiveSection)
    }

    // Set initial active section
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(autoScrollTimeout)
    }
  }, [isScrolling, sections.length])

  const scrollToSection = (sectionIndex: number) => {
    const headerHeight = 64
    const windowHeight = window.innerHeight
    const sectionHeight = windowHeight - headerHeight
    const targetY = sectionIndex * sectionHeight

    setIsScrolling(true)
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    })

    // Reset scrolling flag after animation completes
    setTimeout(() => {
      setIsScrolling(false)
    }, 200)
  }

  return (
    <>
      {/* Section Navigation Dots */}
      <div className="section-nav">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`section-nav-dot ${
              activeSection === index ? 'active' : ''
            }`}
            onClick={() => scrollToSection(index)}
          />
        ))}
      </div>

      {/* Countdown Section - Full Height */}
      <section className="scroll-snap-section justify-center bg-[radial-gradient(circle_at_70%_40%,rgba(221,131,10,0.12),transparent_70%)] relative">
        <div className="container py-4 md:py-12 flex items-center min-h-full">
          <div className="w-full">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[var(--text-primary)]">
                InfoBash v4.0
              </h1>
              <div className="mx-auto mb-8 h-1 w-32 bg-gradient-gold opacity-80 rounded-full" />
              <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-4 md:mb-8 max-w-2xl mx-auto">
                The biggest cricket tournament is coming soon. Get ready for an
                epic showdown!
              </p>

              {/* Countdown Timer */}
              <div className="grid grid-cols-4 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-4 md:mb-12 max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto">
                <div className="bg-[color:rgb(255_255_255/0.06)] backdrop-blur-sm border border-[color:rgb(255_255_255/0.12)] rounded-lg p-4 md:p-6 lg:p-8 shadow-lg flex flex-col items-center justify-center text-center min-h-[100px] md:min-h-[130px] lg:min-h-[160px] hover:scale-105 transition-transform duration-300">
                  <div
                    className="text-2xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secondary)] mb-1 md:mb-2 lg:mb-3 transition-all duration-500"
                    id="countdown-days"
                  >
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm lg:text-base text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                    Days
                  </div>
                </div>
                <div className="bg-[color:rgb(255_255_255/0.06)] backdrop-blur-sm border border-[color:rgb(255_255_255/0.12)] rounded-lg p-4 md:p-6 lg:p-8 shadow-lg flex flex-col items-center justify-center text-center min-h-[100px] md:min-h-[130px] lg:min-h-[160px] hover:scale-105 transition-transform duration-300">
                  <div
                    className="text-2xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secondary)] mb-1 md:mb-2 lg:mb-3 transition-all duration-500"
                    id="countdown-hours"
                  >
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm lg:text-base text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                    Hours
                  </div>
                </div>
                <div className="bg-[color:rgb(255_255_255/0.06)] backdrop-blur-sm border border-[color:rgb(255_255_255/0.12)] rounded-lg p-4 md:p-6 lg:p-8 shadow-lg flex flex-col items-center justify-center text-center min-h-[100px] md:min-h-[130px] lg:min-h-[160px] hover:scale-105 transition-transform duration-300">
                  <div
                    className="text-2xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secondary)] mb-1 md:mb-2 lg:mb-3 transition-all duration-500"
                    id="countdown-minutes"
                  >
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm lg:text-base text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                    Minutes
                  </div>
                </div>
                <div className="bg-[color:rgb(255_255_255/0.06)] backdrop-blur-sm border border-[color:rgb(255_255_255/0.12)] rounded-lg p-4 md:p-6 lg:p-8 shadow-lg flex flex-col items-center justify-center text-center min-h-[100px] md:min-h-[130px] lg:min-h-[160px] hover:scale-105 transition-transform duration-300">
                  <div
                    className="text-2xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secondary)] mb-1 md:mb-2 lg:mb-3 transition-all duration-500"
                    id="countdown-seconds"
                  >
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm lg:text-base text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                    Seconds
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                {user ? (
                  // Authenticated user buttons
                  <>
                    <Button
                      asChild
                      size="lg"
                      className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 text-[var(--brand-bg)] font-semibold px-8 py-3 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                      <Link to={ROUTES.REGISTER_TEAM}>
                        Register Your Team
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-[var(--color-accent-1)] text-[var(--color-accent-1)] hover:bg-[var(--color-accent-1)] hover:text-[var(--brand-bg)] font-semibold px-8 py-3 transition-all duration-200 hover:scale-105"
                    >
                      <Link to={ROUTES.TOURNAMENTS}>View Tournaments</Link>
                    </Button>
                  </>
                ) : (
                  // Guest user buttons
                  <>
                    <GoogleLoginButton
                      variant="modern"
                      size="lg"
                      className="px-8 py-3 transition-all duration-200 hover:scale-105 shadow-lg hover:border-[var(--color-accent-1)]"
                    >
                      <span className="">
                        Get Started
                      </span>
                    </GoogleLoginButton>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-[var(--color-accent-1)] text-[var(--color-accent-1)] hover:bg-[var(--color-accent-1)] hover:text-[var(--brand-bg)] font-semibold px-8 py-3 transition-all duration-200 hover:scale-105"
                    >
                      <Link to={ROUTES.TOURNAMENTS}>Learn More</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex items-center justify-center text-[var(--text-secondary)] animate-bounce shadow-lg">
              <ChevronDown className="h-5 w-5 md:h-6 md:w-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Statistics Section */}
      <section className="scroll-snap-section justify-center bg-[radial-gradient(circle_at_30%_60%,rgba(244,188,69,0.08),transparent_70%)]">
        <div className="container py-16 md:py-24 flex items-center min-h-full">
          <div className="w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                Tournament Statistics
              </h2>
              <div className="mx-auto mb-4 h-1 w-24 bg-gradient-gold rounded-full" />
              <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                Real-time statistics from our active cricket tournaments
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <Card
                    key={index}
                    className="bg-card-bg border-card-border hover:border-[var(--color-accent-1)]/50 transition-all duration-200 hover:scale-105 text-center"
                  >
                    <CardContent className="p-6">
                      <IconComponent
                        className={`w-8 h-8 mx-auto mb-4 ${stat.color}`}
                      />
                      <div className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="scroll-snap-section justify-center bg-[radial-gradient(circle_at_80%_20%,rgba(221,131,10,0.10),transparent_70%)]">
        <div className="container py-16 md:py-24 flex items-center min-h-full">
          <div className="w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                Platform Features
              </h2>
              <div className="mx-auto mb-4 h-1 w-24 bg-gradient-gold rounded-full" />
              <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                Everything you need to manage and follow cricket tournaments
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <Card
                    key={index}
                    className="bg-card-bg border-card-border hover:border-[var(--color-accent-1)]/50 transition-all duration-200 hover:scale-105 group"
                  >
                    <CardHeader>
                      <IconComponent className="w-12 h-12 text-[var(--color-secondary)] mb-4" />
                      <CardTitle className="text-[var(--text-primary)]">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-[var(--text-secondary)] mb-6">
                        {feature.description}
                      </CardDescription>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-[var(--color-accent-1)] text-[var(--color-accent-1)] hover:bg-[var(--color-accent-1)] hover:text-[var(--brand-bg)] group-hover:scale-105 transition-all duration-200"
                      >
                        <Link to={feature.href}>
                          {feature.action}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Matches Section */}
      <section className="scroll-snap-section justify-center bg-[radial-gradient(circle_at_20%_80%,rgba(244,188,69,0.06),transparent_70%)]">
        <div className="container py-16 md:py-24 flex items-center min-h-full">
          <div className="w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                Upcoming Matches
              </h2>
              <div className="mx-auto mb-4 h-1 w-24 bg-gradient-gold rounded-full" />
              <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                Don't miss these exciting upcoming cricket matches
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {upcomingMatches.map((match) => (
                <Card
                  key={match.id}
                  className="bg-card-bg border-card-border hover:border-[var(--color-accent-1)]/50 transition-all duration-200 hover:scale-105"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {match.time}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-[var(--color-accent-1)] text-[var(--color-accent-1)]"
                      >
                        Live Soon
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                        {match.team1}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)] mb-2">
                        vs
                      </div>
                      <div className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                        {match.team2}
                      </div>
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] text-center">
                      📍 {match.venue}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 text-[var(--brand-bg)] font-semibold px-8 py-3 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <Link to={ROUTES.MATCHES}>
                  View All Matches
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="scroll-snap-section justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(221,131,10,0.08),transparent_70%)]">
        <div className="container py-16 md:py-24 flex items-center min-h-full">
          <div className="w-full">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                Get In Touch
              </h2>
              <div className="mx-auto mb-4 h-1 w-24 bg-gradient-gold rounded-full" />
              <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                Have questions about the tournament? We're here to help!
              </p>
            </div>

            <div className="max-w-2xl mx-auto text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <a
                  href="mailto:info@infobash.com"
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-[var(--color-accent-1)]/10 transition-all duration-200 hover:scale-105 group"
                >
                  <Mail className="w-8 h-8 text-[var(--color-secondary)] mb-2 group-hover:text-[var(--color-accent-1)]" />
                  <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                    Email
                  </span>
                </a>
                <a
                  href="https://github.com"
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-[var(--color-accent-1)]/10 transition-all duration-200 hover:scale-105 group"
                >
                  <Github className="w-8 h-8 text-[var(--color-secondary)] mb-2 group-hover:text-[var(--color-accent-1)]" />
                  <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                    GitHub
                  </span>
                </a>
                <a
                  href="https://twitter.com"
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-[var(--color-accent-1)]/10 transition-all duration-200 hover:scale-105 group"
                >
                  <Twitter className="w-8 h-8 text-[var(--color-secondary)] mb-2 group-hover:text-[var(--color-accent-1)]" />
                  <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                    Facebook
                  </span>
                </a>
                <a
                  href="https://instagram.com"
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-[var(--color-accent-1)]/10 transition-all duration-200 hover:scale-105 group"
                >
                  <Instagram className="w-8 h-8 text-[var(--color-secondary)] mb-2 group-hover:text-[var(--color-accent-1)]" />
                  <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                    Instagram
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
