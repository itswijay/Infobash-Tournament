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

const stats = [
  {
    label: 'Active Tournaments',
    value: '3',
    icon: Trophy,
    color: 'text-green-600',
  },
  {
    label: 'Registered Teams',
    value: '24',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    label: 'Matches Played',
    value: '48',
    icon: Calendar,
    color: 'text-purple-600',
  },
  {
    label: 'Live Matches',
    value: '2',
    icon: Play,
    color: 'text-red-600',
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
  const [activeSection, setActiveSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const sections = ['hero', 'stats', 'features', 'highlights', 'footer']

  useEffect(() => {
    let autoScrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      if (isScrolling) return // Prevent interference during auto-scroll

      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const headerHeight = 64
      const sectionHeight = windowHeight - headerHeight

      const currentSectionIndex = Math.floor(scrollPosition / sectionHeight)
      const scrollWithinSection = scrollPosition % sectionHeight
      const scrollPercentage = scrollWithinSection / sectionHeight

      // Auto-scroll threshold
      const autoScrollThreshold = 0.08 // Can change this value: 0.05 = 5%, 0.10 = 10%, 0.20 = 20%, etc.

      clearTimeout(autoScrollTimeout)

      autoScrollTimeout = setTimeout(() => {
        if (isScrolling) return

        let targetSection = currentSectionIndex

        // Determine which direction to snap based on scroll percentage
        if (scrollPercentage > autoScrollThreshold && scrollPercentage < 0.85) {
          // If scrolled more than 8% but less than 85%, snap to next section
          if (scrollPercentage > 0.5) {
            targetSection = Math.min(
              currentSectionIndex + 1,
              sections.length - 1
            )
          } else {
            targetSection = currentSectionIndex
          }
        } else if (scrollPercentage >= 0.85) {
          // If scrolled more than 85%, definitely go to next section
          targetSection = Math.min(currentSectionIndex + 1, sections.length - 1)
        }

        // Only auto-scroll if we need to move to a different position
        const targetY = targetSection * sectionHeight
        if (Math.abs(scrollPosition - targetY) > 50) {
          setIsScrolling(true)
          window.scrollTo({
            top: targetY,
            behavior: 'smooth',
          })

          // Reset scrolling flag after animation completes (faster)
          setTimeout(() => {
            setIsScrolling(false)
          }, 400) // Reduced from 800ms to 400ms
        }
      }, 40) // Wait only 50ms after user stops scrolling (reduced from 150ms)

      // Update active section for navigation dots
      const sectionThresholds = [
        0,
        sectionHeight,
        sectionHeight * 2,
        sectionHeight * 3,
        sectionHeight * 4,
      ]

      let newActiveSection = 0
      for (let i = sectionThresholds.length - 1; i >= 0; i--) {
        if (scrollPosition >= sectionThresholds[i] - 100) {
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

    // Reset scrolling flag after animation completes (faster)
    setTimeout(() => {
      setIsScrolling(false)
    }, 200) // Reduced from 800ms to 400ms
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

      {/* Hero Section - Full Height */}
      <section className="scroll-snap-section bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white relative overflow-hidden justify-center">
        <div className="container py-16 md:py-24 flex items-center min-h-full">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Cricket Tournament Management Made Simple
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-slate-300 max-w-3xl mx-auto">
              Register teams, manage matches, and follow live scores in the most
              comprehensive cricket tournament platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 shadow-lg transition-all duration-300 hover:scale-105 text-lg px-8 py-4"
              >
                <Link to={ROUTES.REGISTER_TEAM}>
                  Register Your Team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-300 text-lg px-8 py-4"
              >
                <Link to={ROUTES.TOURNAMENTS}>View Tournaments</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-emerald-400" />
        </div>
      </section>

      {/* Stats Section - Full Height */}
      <section className="scroll-snap-section bg-slate-900 justify-center">
        <div className="container py-16 flex items-center min-h-full">
          <div className="w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Tournament Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {stats.map((stat, index) => (
                <Card
                  key={stat.label}
                  className="text-center bg-slate-800/50 border-slate-700/50 backdrop-blur-sm card-enter"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="pt-8 pb-8">
                    <div className="flex justify-center mb-6">
                      <div className="rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 p-4 shadow-lg">
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-4xl font-bold text-white">
                        {stat.value}
                      </p>
                      <p className="text-lg text-slate-400">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Full Height */}
      <section className="scroll-snap-section bg-gradient-to-br from-slate-900 to-slate-800 justify-center">
        <div className="container py-16 flex items-center min-h-full">
          <div className="w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Platform Features
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Upcoming Matches */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-white">
                    Upcoming Matches
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                  >
                    <Link to={ROUTES.MATCHES}>
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="space-y-6">
                  {upcomingMatches.map((match, index) => (
                    <Card
                      key={match.id}
                      className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm card-enter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-lg font-medium text-white">
                              <span>{match.team1}</span>
                              <span className="text-slate-400">vs</span>
                              <span>{match.team2}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-slate-400">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{match.time}</span>
                              </div>
                              <span>{match.venue}</span>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-emerald-500/50 text-emerald-400"
                          >
                            Scheduled
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-2xl font-bold mb-8 text-white">
                  Key Features
                </h3>
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <Card
                      key={feature.title}
                      className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 card-enter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 p-3 shadow-lg">
                            <feature.icon className="h-6 w-6 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl text-white">
                              {feature.title}
                            </CardTitle>
                            <CardDescription className="text-slate-400 mt-1">
                              {feature.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="p-0 h-auto text-emerald-400 hover:text-emerald-300"
                        >
                          <Link to={feature.href}>
                            {feature.action}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Highlights Section - Full Height */}
      <section className="scroll-snap-section bg-gradient-to-br from-slate-800/80 to-blue-900/80 justify-center">
        <div className="container py-16 flex items-center min-h-full">
          <div className="w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Tournament Highlights
            </h2>
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm max-w-6xl mx-auto">
              <CardContent className="p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-blue-600 text-white border-0 text-lg px-4 py-2">
                      Featured Tournament
                    </Badge>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                      InfoBash Cricket Championship 2025
                    </h3>
                    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                      Join the biggest cricket tournament of the year with 32
                      teams competing for the championship trophy. Registration
                      ends soon!
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                      <Button
                        asChild
                        size="lg"
                        className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white border-0 text-lg px-8 py-4"
                      >
                        <Link to={ROUTES.REGISTER_TEAM}>Register Team</Link>
                      </Button>
                      <Button
                        variant="outline"
                        asChild
                        size="lg"
                        className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 text-lg px-8 py-4"
                      >
                        <Link to={ROUTES.TOURNAMENTS}>Learn More</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 text-white mb-6 shadow-2xl">
                      <Trophy className="h-20 w-20" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-3xl md:text-4xl font-bold text-white">
                        Rs. 50,000
                      </p>
                      <p className="text-lg text-slate-400">Prize Pool</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Section - Full Height */}
      <section className="scroll-snap-section bg-slate-900/90 justify-center items-center">
        <div className="w-full flex items-center justify-center min-h-full">
          <div className="container py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-center lg:text-left">
              {/* Brand Section */}
              <div className="lg:col-span-2 flex flex-col items-center lg:items-start">
                <Link
                  to={ROUTES.HOME}
                  className="flex items-center space-x-2 mb-4 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 shadow-lg">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    InfoBash Tournament
                  </span>
                </Link>
                <p className="text-slate-300 text-sm mb-6 max-w-md text-center lg:text-left">
                  The most comprehensive cricket tournament management platform.
                  Register your team, follow live matches, and track tournament
                  progress with real-time updates.
                </p>
                <div className="flex space-x-3 justify-center lg:justify-start">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50 transition-all duration-200"
                  >
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50 transition-all duration-200"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50 transition-all duration-200"
                  >
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50 transition-all duration-200"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tournament Links */}
              <div>
                <h3 className="font-semibold text-white mb-4">Tournament</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to={ROUTES.TOURNAMENTS}
                      className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200"
                    >
                      Tournaments
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.TEAMS}
                      className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200"
                    >
                      Teams
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.MATCHES}
                      className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200"
                    >
                      Matches
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.REGISTER_TEAM}
                      className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200"
                    >
                      Register Team
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h3 className="font-semibold text-white mb-4">Support</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/help"
                      className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/rules"
                      className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200"
                    >
                      Tournament Rules
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h3 className="font-semibold text-white mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/privacy"
                      className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/conduct"
                      className="text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-200"
                    >
                      Code of Conduct
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-700/50 mt-12 pt-8 flex flex-col sm:flex-row justify-center items-center text-center sm:text-left">
              <p className="text-sm text-slate-400">
                © 2025 InfoBash Tournament. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
