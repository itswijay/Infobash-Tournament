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
} from 'lucide-react'
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa'
import { ROUTES } from '@/lib/constants'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ImageSlideshow } from '@/components/home/ImageSlideshow'
import { slideshowImages, slideshowConfig } from '@/data/slideshow'
import { motion } from 'framer-motion'

const stats = [
  {
    label: 'Active Tournaments',
    value: '0',
    icon: Trophy,
    color: 'text-[var(--color-secondary)]',
  },
  {
    label: 'Registered Teams',
    value: '0',
    icon: Users,
    color: 'text-[var(--color-secondary)]',
  },
  {
    label: 'Matches Played',
    value: '0',
    icon: Calendar,
    color: 'text-[var(--color-secondary)]',
  },
  {
    label: 'Live Matches',
    value: '0',
    icon: Play,
    color: 'text-[var(--color-secondary)]',
  },
]

const upcomingMatches = [
  {
    id: '1',
    team1: 'Avengers',
    team2: 'Thunderbolts',
    time: '9:00 AM',
    venue: 'Hunduwa Ground',
  },
  {
    id: '2',
    team1: 'Justice League',
    team2: 'Suicide Squad',
    time: '11:00 AM',
    venue: 'Hunduwa Ground',
  },
  {
    id: '3',
    team1: 'S.H.I.E.L.D.',
    team2: 'Hydra',
    time: '01:00 PM',
    venue: 'Hunduwa Ground',
  },
]

const features = [
  {
    title: 'Team Registration',
    description: 'Register your team with player details and team logo',
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
  const sections = [
    'countdown',
    'slideshow',
    'stats',
    'features',
    'highlights',
    'footer',
  ]

  // Tournament state management
  const [tournamentPhase, setTournamentPhase] = useState<
    'upcoming' | 'live' | 'results'
  >('upcoming')

  // Tournament timing constants (editable for testing)
  const TOURNAMENT_START_TIME = new Date('2025-08-23T23:23:00').getTime()
  const TOURNAMENT_DURATION_HOURS = 0.01
  const TOURNAMENT_END_TIME =
    TOURNAMENT_START_TIME + TOURNAMENT_DURATION_HOURS * 60 * 60 * 1000

  const MANUAL_TOURNAMENT_END = false

  // Countdown timer effect
  useEffect(() => {
    const targetDate = TOURNAMENT_START_TIME

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

      if (MANUAL_TOURNAMENT_END) {
        setTournamentPhase('results')
      } else if (now < TOURNAMENT_START_TIME) {
        setTournamentPhase('upcoming')
      } else if (now < TOURNAMENT_END_TIME) {
        setTournamentPhase('live')
      } else {
        setTournamentPhase('results')
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [TOURNAMENT_START_TIME, TOURNAMENT_END_TIME, MANUAL_TOURNAMENT_END])

  const shouldShowCountdown = tournamentPhase === 'upcoming'

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
            if (scrollPercentage < threshold && currentSectionIndex > 0) {
              targetSection = currentSectionIndex - 1
            } else {
              // Snap to current section
              targetSection = currentSectionIndex
            }
          }

          targetSection = Math.max(
            0,
            Math.min(targetSection, sections.length - 1)
          )

          const targetY = targetSection * sectionHeight
          const tolerance = 50

          if (Math.abs(scrollPosition - targetY) > tolerance) {
            setIsScrolling(true)
            window.scrollTo({
              top: targetY,
              behavior: 'smooth',
            })

            setTimeout(() => {
              setIsScrolling(false)
            }, 600)
          }
        }, 150)
      }

      const sectionThresholds = [
        0,
        sectionHeight,
        sectionHeight * 2,
        sectionHeight * 3,
        sectionHeight * 4,
        sectionHeight * 5,
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
              <h1 className="text-3xl md:text-5xl font-bold mb-2 text-[var(--text-primary)]">
                InfoBash v4.0
              </h1>
              <div className="mx-auto mb-6 h-1 w-32 bg-gradient-gold opacity-80 rounded-full" />
              <p className="text-md md:text-xl text-[var(--text-secondary)] mb-6 md:mb-8 max-w-2xl mx-auto">
                {tournamentPhase === 'upcoming' ? (
                  <>
                    <span className="hidden md:inline">
                      FOC's grand cricket clash is almost here – get ready for
                      the ultimate showdown!
                    </span>
                    <span className="md:hidden">
                      FOC's grand cricket clash is almost here
                      <br />
                      Get ready for the ultimate showdown!
                    </span>
                  </>
                ) : null}
              </p>

              {/* Countdown Timer or Happening Now */}
              {shouldShowCountdown ? (
                // Countdown Timer
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
              ) : tournamentPhase === 'live' ? (
                // Happening Now Section
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: 'easeOut',
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                  }}
                  className="mb-4 md:mb-6 max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto"
                >
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-2 border-green-400/30 rounded-2xl p-6 md:px-8 md:pb-6 shadow-2xl hover:scale-105 transition-all duration-500">
                    <div className="text-center">
                      {/* Live Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.3,
                          duration: 0.6,
                          ease: 'easeOut',
                        }}
                        className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm md:text-base font-semibold mb-4 animate-pulse"
                      >
                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                        LIVE NOW
                      </motion.div>

                      {/* Main Content */}
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.5,
                          duration: 0.6,
                          ease: 'easeOut',
                        }}
                        className="text-2xl md:text-4xl font-bold text-green-400 mb-3 md:mb-4"
                      >
                        Tournament is Happening Now! 🏏
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.7,
                          duration: 0.6,
                          ease: 'easeOut',
                        }}
                        className="text-sm md:text-lg text-[var(--text-secondary)] mb-4 md:mb-6 max-w-2xl mx-auto"
                      >
                        The excitement is live! Teams are competing on the
                        field. Follow the action and stay tuned for updates.
                      </motion.p>

                      {/* Live Stats */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.9,
                          duration: 0.6,
                          ease: 'easeOut',
                        }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-4"
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 1.1,
                            duration: 0.5,
                            ease: 'easeOut',
                          }}
                          className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 text-center"
                        >
                          <div className="text-lg md:text-2xl font-bold text-green-400">
                            2
                          </div>
                          <div className="text-xs md:text-sm text-[var(--text-secondary)]">
                            Teams Playing
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 1.3,
                            duration: 0.5,
                            ease: 'easeOut',
                          }}
                          className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 text-center"
                        >
                          <div className="text-lg md:text-2xl font-bold text-green-400">
                            1
                          </div>
                          <div className="text-xs md:text-sm text-[var(--text-secondary)]">
                            Matches Live
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 1.5,
                            duration: 0.5,
                            ease: 'easeOut',
                          }}
                          className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 text-center md:col-span-1 col-span-2"
                        >
                          <div className="text-lg md:text-2xl font-bold text-green-400">
                            Live
                          </div>
                          <div className="text-xs md:text-sm text-[var(--text-secondary)]">
                            Score Updates
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ) : tournamentPhase === 'results' ? (
                // Results Section
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeOut',
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                  }}
                  className="mb-4 md:mb-6 max-w-2xl md:max-w-3xl mx-auto"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
                    className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border border-slate-600/40 rounded-2xl p-5 md:p-6 shadow-xl"
                  >
                    <div className="text-center mb-5">
                      {/* Simple Header */}
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.4,
                          duration: 0.5,
                          ease: 'easeOut',
                        }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3"
                      >
                        🏆 RESULTS
                      </motion.div>
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.6,
                          duration: 0.5,
                          ease: 'easeOut',
                        }}
                        className="text-lg md:text-xl font-bold text-white"
                      >
                        Tournament Completed! 🎉
                      </motion.h2>
                    </div>

                    {/* Results Layout */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.8,
                        duration: 0.5,
                        ease: 'easeOut',
                      }}
                      className="grid grid-cols-2 gap-4 mb-5"
                    >
                      {/* Winner Column */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{
                          delay: 1.0,
                          duration: 0.5,
                          ease: 'easeOut',
                        }}
                        className="text-center"
                      >
                        <div className="bg-gradient-to-br from-yellow-400/30 to-amber-500/30 border-2 border-yellow-400/60 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                          <div className="text-yellow-400 text-3xl mb-2 animate-pulse">
                            🏆
                          </div>
                          <div className="text-white font-bold text-sm mb-1">
                            Avengers
                          </div>
                          <div className="text-yellow-400 font-bold text-xl mb-1">
                            156/8
                          </div>
                          <div className="text-yellow-400 text-xs font-semibold bg-yellow-400/20 px-2 py-1 rounded-full">
                            CHAMPIONS
                          </div>
                        </div>
                      </motion.div>

                      {/* Runner-up Column */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{
                          delay: 1.2,
                          duration: 0.5,
                          ease: 'easeOut',
                        }}
                        className="text-center"
                      >
                        <div className="bg-gradient-to-br from-slate-500/20 to-gray-500/20 border border-slate-400/40 rounded-xl p-4">
                          <div className="text-slate-400 text-2xl mb-3">🥈</div>
                          <div className="text-white font-semibold text-sm mb-1">
                            Thunderbolts
                          </div>
                          <div className="text-slate-400 font-bold text-lg mb-1">
                            133/10
                          </div>
                          <div className="text-slate-400 text-xs font-semibold bg-slate-400/20 px-2 py-1 rounded-full">
                            RUNNER-UP
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Congrats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 1.4,
                        duration: 0.5,
                        ease: 'easeOut',
                      }}
                      className="bg-green-500/10 border border-green-400/30 rounded-xl p-3 mb-5"
                    >
                      <div className="text-center">
                        <div className="text-green-400 text-sm font-semibold mb-1">
                          🎊 Congratulations Team Alpha! 🎊
                        </div>
                        <p className="text-slate-300 text-xs">
                          Exceptional performance throughout the tournament!
                        </p>
                      </div>
                    </motion.div>

                    {/* Action Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 1.6,
                        duration: 0.5,
                        ease: 'easeOut',
                      }}
                      className="text-center"
                    >
                      <Button
                        asChild
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                      >
                        <Link
                          to="/tournament-results"
                          className="flex items-center gap-2"
                        >
                          <span className="text-sm">View Full Results</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : null}

              {/* Action Buttons - Only show during upcoming phase */}
              {shouldShowCountdown && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  {user ? (
                    // Authenticated user buttons
                    <>
                      <Button
                        asChild
                        size="lg"
                        className="relative overflow-hidden bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent-1)] hover:from-[var(--color-secondary)]/90 hover:to-[var(--color-accent-1)]/90 text-[var(--brand-bg)] hover:text-black font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 group"
                      >
                        <Link
                          to={ROUTES.REGISTER_TEAM}
                          className="flex items-center space-x-2 relative z-10"
                        >
                          <Users className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                          <span className="tracking-wide">
                            Register Your Team
                          </span>
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="border-2 border-[var(--color-accent-1)] text-[var(--color-accent-1)] hover:bg-[var(--color-accent-1)] hover:text-[var(--brand-bg)] font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm bg-[var(--brand-bg)]/10"
                      >
                        <Link to={ROUTES.TOURNAMENTS}>View Tournaments</Link>
                      </Button>
                    </>
                  ) : (
                    // Guest user buttons
                    <>
                      <Button
                        asChild
                        size="lg"
                        className="relative overflow-hidden bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent-1)] hover:from-[var(--color-secondary)]/90 hover:to-[var(--color-accent-1)]/90 text-[var(--brand-bg)] hover:text-black font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 group"
                      >
                        <Link
                          to={ROUTES.REGISTER_TEAM}
                          className="flex items-center space-x-2 relative z-10"
                        >
                          <Users className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                          <span className="text-sm">Register Your Team</span>
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="border-2 border-[var(--color-accent-1)] text-[var(--color-accent-1)] hover:bg-[var(--color-accent-1)] hover:text-[var(--brand-bg)] font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm bg-[var(--brand-bg)]/10"
                      >
                        <Link to={ROUTES.INSTRUCTIONS}>How It Works</Link>
                      </Button>
                    </>
                  )}
                </div>
              )}
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

      {/* Image Slideshow Section */}
      <section className="scroll-snap-section justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(221,131,10,0.06),transparent_70%)]">
        <div className="container py-12 md:py-3 flex items-center min-h-full">
          <div className="w-full">
            <div className="text-center mb-6 md:mb-4">
              <h2 className="md:hidden text-2xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                Tournament Highlights
              </h2>
              <div className="md:hidden mx-auto mb-4 h-1 w-24 bg-gradient-gold rounded-full" />
              <p className="font-semibold text-[var(--text-secondary)] max-w-2xl mx-auto">
                Experience the excitement and energy of the cricket tournaments
              </p>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-0">
              <ImageSlideshow slides={slideshowImages} {...slideshowConfig} />
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Statistics Section */}
      <section className="scroll-snap-section justify-center bg-[radial-gradient(circle_at_30%_60%,rgba(244,188,69,0.08),transparent_70%)]">
        <div className="container py-2 md:py-24 flex items-center min-h-full">
          <div className="w-full">
            <div className="text-center mb-4 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
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

      {/* Platform Features Section */}
      <section className="scroll-snap-section justify-center bg-[radial-gradient(circle_at_80%_20%,rgba(221,131,10,0.10),transparent_70%)]">
        <div className="container py-2 md:py-12 flex items-center min-h-full">
          <div className="w-full">
            <div className="text-center mb-6 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)] mb-1 md:mb-4">
                Platform Features
              </h2>
              <div className="mx-auto mb-4 md:mb-4 h-1 w-16 md:w-24 bg-gradient-gold rounded-full" />
              <p className="text-xs md:text-base text-[var(--text-secondary)] max-w-2xl mx-auto px-4">
                Everything you need to manage and follow cricket tournaments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 px-2 md:px-0">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <Card
                    key={index}
                    className="bg-card-bg border-card-border hover:border-[var(--color-accent-1)]/50 transition-all duration-200 hover:scale-105 group"
                  >
                    <CardHeader className="p-1 md:p-3">
                      <IconComponent className="w-4 h-4 md:w-8 md:h-8 text-[var(--color-secondary)] mb-1 md:mb-2 mx-auto" />
                      <CardTitle className="text-xs md:text-lg text-[var(--text-primary)] text-center">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-1 md:p-3 pt-0">
                      <CardDescription className="text-xs md:text-sm text-[var(--text-secondary)] mb-1 md:mb-3 text-center leading-tight">
                        {feature.description}
                      </CardDescription>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-[var(--color-accent-1)] text-[var(--color-accent-1)] hover:bg-[var(--color-accent-1)] hover:text-[var(--brand-bg)] group-hover:scale-105 transition-all duration-200 text-xs md:text-sm py-1 md:py-1.5"
                      >
                        <Link to={feature.href}>
                          {feature.action}
                          <ArrowRight className="ml-1 md:ml-2 h-3 w-3 md:h-3 md:w-3" />
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
        <div className="container py-2 md:py-6 flex items-center min-h-full">
          <div className="w-full">
            <div className="text-center mb-4 md:mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-2 md:mb-4">
                Upcoming Matches
              </h2>
              <div className="mx-auto mb-4 md:mb-6 h-1 w-16 md:w-24 bg-gradient-gold rounded-full" />
              <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mx-auto px-4">
                Don't miss these exciting upcoming cricket matches
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto px-4 md:px-0">
              {upcomingMatches.map((match) => (
                <Card
                  key={match.id}
                  className="bg-card-bg border-card-border hover:border-[var(--color-accent-1)]/50 transition-all duration-200 hover:scale-105"
                >
                  <CardHeader className="pb-1 md:pb-4 p-1 md:p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-[var(--color-secondary)] text-xs md:text-sm px-1 md:px-3 py-0.5 md:py-2">
                        <Clock className="w-2 h-2 md:w-4 md:h-4 mr-1 inline" />
                        {match.time}
                      </div>
                      <Badge
                        variant="outline"
                        className="border-[var(--color-accent-1)] text-[var(--color-accent-1)] text-xs md:text-sm px-1 md:px-3 py-0.5 md:py-2"
                      >
                        Live Soon
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-1 md:p-6 pt-0">
                    <div className="text-center mb-1 md:mb-4">
                      <div className="text-xs md:text-xl font-semibold text-[var(--text-primary)] mb-0.5 md:mb-2">
                        {match.team1}
                      </div>
                      <div className="text-xs md:text-sm text-[var(--text-secondary)] mb-0.5 md:mb-2">
                        vs
                      </div>
                      <div className="text-xs md:text-xl font-semibold text-[var(--text-primary)] mb-1 md:mb-4">
                        {match.team2}
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-[var(--text-secondary)] text-center">
                      📍 {match.venue}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8 md:mt-8">
              <Button
                asChild
                size="lg"
                className="bg-[var(--color-secondary)] hover:bg-[var(--color-accent-1)] text-[var(--brand-bg)] hover:text-[var(--brand-bg)] font-semibold px-6 md:px-8 py-2 md:py-3 text-sm md:text-base transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <Link to={ROUTES.MATCHES}>
                  View All Matches
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="scroll-snap-section justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(221,131,10,0.08),transparent_70%)]">
        <div className="container py-12 md:py-24 flex items-center min-h-full">
          <div className="w-full">
            <div className="text-center mb-16">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <span className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent-1)] bg-clip-text text-transparent">
                  Lumetrix Media
                </span>
              </div>
              <h2 className="text-[15px] md:text-lg font-bold text-[var(--text-primary)] mb-2">
                The Official Media Partner
              </h2>
            </div>

            <div className="max-w-2xl mx-auto text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 max-w-2xl mx-auto">
                <a
                  href="https://www.youtube.com/@LumetrixMedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-[var(--color-accent-1)]/10 transition-all duration-200 hover:scale-105 group"
                >
                  <FaYoutube className="w-10 h-10 md:w-12 md:h-12 text-[var(--color-secondary)] mb-2 group-hover:text-[var(--color-accent-1)]" />
                  <span className="text-xs md:text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                    YouTube
                  </span>
                </a>
                <a
                  href="https://www.instagram.com/Lumetrix_Media/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-[var(--color-accent-1)]/10 transition-all duration-200 hover:scale-105 group"
                >
                  <FaInstagram className="w-10 h-10 md:w-12 md:h-12 text-[var(--color-secondary)] mb-2 group-hover:text-[var(--color-accent-1)]" />
                  <span className="text-xs md:text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                    Instagram
                  </span>
                </a>
                <a
                  href="https://www.facebook.com/share/1BE9KQkWtL/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-[var(--color-accent-1)]/10 transition-all duration-200 hover:scale-105 group"
                >
                  <FaFacebook className="w-10 h-10 md:w-12 md:h-12 text-[var(--color-secondary)] mb-2 group-hover:text-[var(--color-accent-1)]" />
                  <span className="text-xs md:text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                    Facebook
                  </span>
                </a>
                <a
                  href="https://www.tiktok.com/@lumetrixmedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-[var(--color-accent-1)]/10 transition-all duration-200 hover:scale-105 group"
                >
                  <FaTiktok className="w-10 h-10 md:w-12 md:h-12 text-[var(--color-secondary)] mb-2 group-hover:text-[var(--color-accent-1)]" />
                  <span className="text-xs md:text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                    TikTok
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
