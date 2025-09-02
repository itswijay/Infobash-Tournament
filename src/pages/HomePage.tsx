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
import { useNearestTournament } from '@/hooks/useNearestTournament'
import { ImageSlideshow } from '@/components/home/ImageSlideshow'
import { slideshowImages, slideshowConfig } from '@/data/slideshow'
import { motion } from 'framer-motion'
import { getUpcomingMatches } from '@/lib/api/matches'
import type { Match } from '@/lib/api/matches'
import type { Tournament } from '@/lib/api/tournaments'
import { getTournamentStats, type TournamentStats } from '@/lib/api/tournaments'

// Dynamic stats will be created in the component using tournamentStats state

// Type for upcoming matches with additional display properties
interface UpcomingMatch extends Match {
  team1_name: string
  team2_name: string
  tournament_name: string
  venue: string
}

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
  const {
    tournament: activeTournament,
    startTime: tournamentStartTime,
    error: tournamentError,
    loading: tournamentLoading,
  } = useNearestTournament()
  const [activeSection, setActiveSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [upcomingMatches, setUpcomingMatches] = useState<UpcomingMatch[]>([])
  const [matchesLoading, setMatchesLoading] = useState(true)
  const [tournamentStats, setTournamentStats] = useState<TournamentStats>({
    activeTournaments: 0,
    registeredTeams: 0,
    matchesPlayed: 0,
    liveMatches: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  // Section configuration
  const sections = [
    'countdown',
    'slideshow',
    'stats',
    'features',
    'highlights',
    'footer',
  ]

  // Tournament timing constants (dynamic from database)
  const TOURNAMENT_START_TIME = tournamentStartTime
    ? tournamentStartTime.getTime()
    : null

  // Function to fetch upcoming matches
  const fetchUpcomingMatches = async () => {
    try {
      setMatchesLoading(true)
      const matches = await getUpcomingMatches(3)
      setUpcomingMatches(matches)
    } catch (error) {
      console.error('Error fetching upcoming matches:', error)
      setUpcomingMatches([])
    } finally {
      setMatchesLoading(false)
    }
  }

  // Function to fetch tournament statistics
  const fetchTournamentStats = async () => {
    try {
      setStatsLoading(true)
      const stats = await getTournamentStats()
      setTournamentStats(stats)
    } catch (error) {
      console.error('Error fetching tournament statistics:', error)
      // Keep default values on error
    } finally {
      setStatsLoading(false)
    }
  }

  // Function to format match date and time
  const formatMatchDateTime = (scheduledAt: string | null) => {
    if (!scheduledAt) return 'TBD'

    const matchDate = new Date(scheduledAt)
    const now = new Date()
    const isToday = matchDate.toDateString() === now.toDateString()
    const isTomorrow =
      new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString() ===
      matchDate.toDateString()

    const timeString = matchDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    if (isToday) {
      return `Today, ${timeString}`
    } else if (isTomorrow) {
      return `Tomorrow, ${timeString}`
    } else {
      return matchDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    }
  }

  // Countdown timer effect - only for tournaments that are not ongoing
  useEffect(() => {
    if (!TOURNAMENT_START_TIME || !activeTournament) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      return
    }

    // Don't show countdown for ongoing tournaments
    if (activeTournament.status === 'ongoing') {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      return
    }

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
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [TOURNAMENT_START_TIME, activeTournament])

  // Fetch upcoming matches and statistics on component mount
  useEffect(() => {
    fetchUpcomingMatches()
    fetchTournamentStats()
  }, [])

  // Determine if countdown should be shown
  const shouldShowCountdown: boolean = Boolean(
    activeTournament &&
      activeTournament.status !== 'ongoing' &&
      activeTournament.status !== 'completed' &&
      TOURNAMENT_START_TIME !== null
  )

  // Determine if action buttons should be shown
  const shouldShowActionButtons =
    activeTournament &&
    activeTournament.status === 'registration_open' &&
    shouldShowCountdown

  // Create dynamic stats array
  const stats = [
    {
      label: 'Active Tournaments',
      value: statsLoading
        ? '...'
        : tournamentStats.activeTournaments.toString(),
      icon: Trophy,
      color: 'text-[var(--color-secondary)]',
    },
    {
      label: 'Registered Teams',
      value: statsLoading ? '...' : tournamentStats.registeredTeams.toString(),
      icon: Users,
      color: 'text-[var(--color-secondary)]',
    },
    {
      label: 'Matches Played',
      value: statsLoading ? '...' : tournamentStats.matchesPlayed.toString(),
      icon: Calendar,
      color: 'text-[var(--color-secondary)]',
    },
    {
      label: 'Live Matches',
      value: statsLoading ? '...' : tournamentStats.liveMatches.toString(),
      icon: Play,
      color: 'text-[var(--color-secondary)]',
    },
  ]

  // Get status-specific message and styling
  const getStatusInfo = (tournament: Tournament | null) => {
    if (!tournament)
      return {
        mainMessage: '',
        statusMessage: '',
        color: '',
        showCountdown: false,
      }

    switch (tournament.status) {
      case 'upcoming':
        return {
          mainMessage:
            "FOC's grand cricket clash is almost here – get ready for the ultimate showdown!",
          statusMessage:
            'Info Bash v4.0 is coming soon! Stay tuned for the biggest cricket event of the season.',
          color: 'blue',
          showCountdown: true,
        }
      case 'registration_open':
        return {
          mainMessage:
            'Registration is now open! Register your team and join the competition!',
          statusMessage:
            "Don't miss out! Register your team now and secure your spot in the tournament.",
          color: 'green',
          showCountdown: true,
        }
      case 'registration_closed':
        return {
          mainMessage: 'Registration is closed. Tournament will begin soon!',
          statusMessage:
            'All teams are registered! The tournament is about to begin - get ready!',
          color: 'orange',
          showCountdown: true,
        }
      case 'ongoing':
        return {
          mainMessage: 'Tournament is happening now! Follow the live action!',
          statusMessage:
            'The tournament is live! Follow all the matches and cheer for your favorite teams!',
          color: 'red',
          showCountdown: false,
        }
      case 'completed':
        return {
          mainMessage: 'Tournament completed! Check out the results!',
          statusMessage:
            'The tournament has ended! Check out the final results and see who emerged victorious!',
          color: 'purple',
          showCountdown: false,
        }
      default:
        return {
          mainMessage: '',
          statusMessage: '',
          color: '',
          showCountdown: false,
        }
    }
  }

  const statusInfo = getStatusInfo(activeTournament)

  // Get section-specific information for upcoming matches section
  const getMatchesSectionInfo = (tournament: Tournament | null) => {
    const defaultConfig = {
      title: 'Upcoming Matches',
      description: "Don't miss these exciting upcoming cricket matches",
      actionButtonText: 'View All Matches',
      actionButtonLink: ROUTES.MATCHES,
      badgeText: '',
      badgeColor: '',
      showRefresh: true,
      icon: Clock,
    }

    if (!tournament) return defaultConfig

    const configs = {
      upcoming: {
        ...defaultConfig,
        badgeText: 'UPCOMING',
        badgeColor: 'from-blue-500 to-indigo-600',
      },
      registration_open: {
        ...defaultConfig,
        description: 'Matches will be scheduled once registration closes',
        actionButtonText: 'View Tournament Details',
        actionButtonLink: ROUTES.TOURNAMENTS,
        badgeText: 'REGISTRATION OPEN',
        badgeColor: 'from-green-500 to-emerald-600',
      },
      registration_closed: {
        ...defaultConfig,
        description:
          'Tournament is about to begin - matches will be scheduled soon!',
        actionButtonText: 'View Tournament Details',
        actionButtonLink: ROUTES.TOURNAMENTS,
        badgeText: 'STARTING SOON',
        badgeColor: 'from-orange-500 to-amber-600',
      },
      ongoing: {
        title: 'Live Matches',
        description: 'Follow the live action and real-time scores',
        actionButtonText: 'View Live Matches',
        actionButtonLink: ROUTES.MATCHES,
        badgeText: 'LIVE NOW',
        badgeColor: 'from-red-500 to-pink-600',
        showRefresh: true,
        icon: Play,
      },
      completed: {
        title: 'Tournament Results',
        description: 'Check out the final results and standings',
        actionButtonText: 'View Results',
        actionButtonLink: ROUTES.TOURNAMENT_RESULTS,
        badgeText: 'COMPLETED',
        badgeColor: 'from-purple-500 to-violet-600',
        showRefresh: false,
        icon: Trophy,
      },
    }

    return configs[tournament.status] || defaultConfig
  }

  const matchesSectionInfo = getMatchesSectionInfo(activeTournament)

  // Get empty state content based on tournament status
  const getEmptyStateContent = (tournament: Tournament | null) => {
    if (!tournament) {
      return {
        title: 'No Active Tournament',
        description:
          'There are no active tournaments at the moment. Check back later!',
        buttonText: 'View All Tournaments',
        buttonLink: ROUTES.TOURNAMENTS,
      }
    }

    const emptyStates = {
      upcoming: {
        title: 'No Matches Scheduled Yet',
        description:
          'Matches will be scheduled once the tournament begins. Stay tuned for updates!',
        buttonText: 'View Tournament Details',
        buttonLink: ROUTES.TOURNAMENTS,
      },
      registration_open: {
        title: 'Registration in Progress',
        description:
          'Matches will be scheduled once registration closes and teams are finalized.',
        buttonText: 'View Tournament Details',
        buttonLink: ROUTES.TOURNAMENTS,
      },
      registration_closed: {
        title: 'Tournament Starting Soon',
        description:
          'All teams are registered! Matches will be scheduled and announced shortly.',
        buttonText: 'View Tournament Details',
        buttonLink: ROUTES.TOURNAMENTS,
      },
      ongoing: {
        title: 'Tournament is Live!',
        description: 'Check the matches page to see live scores and results!',
        buttonText: 'View All Matches',
        buttonLink: ROUTES.MATCHES,
      },
      completed: {
        title: 'Tournament Completed',
        description:
          'All matches have been played. Check the results page for final standings!',
        buttonText: 'View Results',
        buttonLink: ROUTES.TOURNAMENT_RESULTS,
      },
    }

    return emptyStates[tournament.status] || emptyStates.upcoming
  }

  const emptyStateContent = getEmptyStateContent(activeTournament)

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
      <section className="scroll-snap-section justify-center relative overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-slow-zoom parallax-bg"
          style={{
            backgroundImage: `url('/cricket-match-with-player.webp')`,
          }}
        />
        {/* Dark Professional Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        {/* Subtle Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(221,131,10,0.15),transparent_70%)]" />

        <div className="container py-4 md:py-12 flex items-center min-h-full relative z-10">
          <div className="w-full">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">
                Info Bash v4.0
              </h1>
              <div className="mx-auto mb-6 h-1 w-32 bg-gradient-gold opacity-90 rounded-full shadow-lg" />
              <p className="text-md md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto drop-shadow-md font-medium">
                {statusInfo.mainMessage}
              </p>

              {/* Error Message */}
              {tournamentError && (
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
                  <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border-2 border-red-400/30 rounded-2xl p-6 md:px-8 md:pb-6 shadow-2xl">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm md:text-base font-semibold mb-4">
                        <Calendar className="w-4 h-4" />
                        Error Loading Tournament
                      </div>
                      <h2 className="text-2xl md:text-4xl font-bold text-red-400 mb-3 md:mb-4">
                        Something went wrong!
                      </h2>
                      <p className="text-lg md:text-xl text-red-300 mb-4">
                        {tournamentError}
                      </p>
                      <p className="text-base text-red-200">
                        Please check back later or contact support if the
                        problem persists.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Status-Based Tournament Display */}
              {tournamentLoading ? (
                // Loading State
                <div className="mb-4 md:mb-6 max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto">
                  <div className="bg-gradient-to-r from-slate-500/20 to-gray-500/20 backdrop-blur-sm border-2 border-slate-400/30 rounded-2xl p-6 md:px-8 md:pb-6 shadow-2xl">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-500 text-white px-4 py-2 rounded-full text-sm md:text-base font-semibold mb-4">
                        <Calendar className="w-4 h-4 animate-spin" />
                        Loading Tournament Info...
                      </div>
                      <p className="text-lg text-slate-300">
                        Fetching the latest tournament information...
                      </p>
                    </div>
                  </div>
                </div>
              ) : shouldShowCountdown ? (
                <>
                  {/* Countdown Timer for Upcoming, Registration Open, and Registration Closed */}
                  <div className="grid grid-cols-4 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-4 md:mb-8 max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto">
                    <div className="bg-[color:rgb(255_255_255/0.06)] backdrop-blur-sm border border-[color:rgb(255_255_255/0.12)] rounded-lg p-4 md:p-6 lg:p-8 shadow-lg flex flex-col items-center justify-center text-center min-h-[100px] md:min-h-[130px] lg:min-h-[160px] hover:scale-105 transition-transform duration-300">
                      <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secondary)] mb-1 md:mb-2 lg:mb-3 transition-all duration-500">
                        {String(timeLeft.days).padStart(2, '0')}
                      </div>
                      <div className="text-xs md:text-sm lg:text-base text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                        Days
                      </div>
                    </div>
                    <div className="bg-[color:rgb(255_255_255/0.06)] backdrop-blur-sm border border-[color:rgb(255_255_255/0.12)] rounded-lg p-4 md:p-6 lg:p-8 shadow-lg flex flex-col items-center justify-center text-center min-h-[100px] md:min-h-[130px] lg:min-h-[160px] hover:scale-105 transition-transform duration-300">
                      <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secondary)] mb-1 md:mb-2 lg:mb-3 transition-all duration-500">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </div>
                      <div className="text-xs md:text-sm lg:text-base text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                        Hours
                      </div>
                    </div>
                    <div className="bg-[color:rgb(255_255_255/0.06)] backdrop-blur-sm border border-[color:rgb(255_255_255/0.12)] rounded-lg p-4 md:p-6 lg:p-8 shadow-lg flex flex-col items-center justify-center text-center min-h-[100px] md:min-h-[130px] lg:min-h-[160px] hover:scale-105 transition-transform duration-300">
                      <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secondary)] mb-1 md:mb-2 lg:mb-3 transition-all duration-500">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </div>
                      <div className="text-xs md:text-sm lg:text-base text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                        Minutes
                      </div>
                    </div>
                    <div className="bg-[color:rgb(255_255_255/0.06)] backdrop-blur-sm border border-[color:rgb(255_255_255/0.12)] rounded-lg p-4 md:p-6 lg:p-8 shadow-lg flex flex-col items-center justify-center text-center min-h-[100px] md:min-h-[130px] lg:min-h-[160px] hover:scale-105 transition-transform duration-300">
                      <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secondary)] mb-1 md:mb-2 lg:mb-3 transition-all duration-500">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </div>
                      <div className="text-xs md:text-sm lg:text-base text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                        Seconds
                      </div>
                    </div>
                  </div>

                  {/* Status Message Display */}
                  {activeTournament && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: 'easeOut',
                        type: 'spring',
                        stiffness: 100,
                        damping: 15,
                      }}
                      className="mb-4 md:mb-8 max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto text-center"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm md:text-base font-semibold mb-4 text-white shadow-lg">
                        {activeTournament.status === 'upcoming' && (
                          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 rounded-full border border-blue-400/30">
                            🏏 UPCOMING
                          </span>
                        )}
                        {activeTournament.status === 'registration_open' && (
                          <span className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-full border border-green-400/30">
                            REGISTRATION OPEN
                          </span>
                        )}
                        {activeTournament.status === 'registration_closed' && (
                          <span className="bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2 rounded-full border border-orange-400/30">
                            REGISTRATION CLOSED
                          </span>
                        )}
                        {activeTournament.status === 'ongoing' && (
                          <span className="bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 rounded-full border border-red-400/30 animate-pulse">
                            LIVE NOW
                          </span>
                        )}
                        {activeTournament.status === 'completed' && (
                          <span className="bg-gradient-to-r from-purple-500 to-violet-600 px-4 py-2 rounded-full border border-purple-400/30">
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-lg md:text-xl max-w-2xl mx-auto font-medium ${
                          activeTournament.status === 'upcoming'
                            ? 'text-white'
                            : activeTournament.status === 'registration_open'
                            ? 'text-white'
                            : activeTournament.status === 'registration_closed'
                            ? 'text-white'
                            : activeTournament.status === 'ongoing'
                            ? 'text-white'
                            : activeTournament.status === 'completed'
                            ? 'text-white'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        {statusInfo.statusMessage}
                      </p>
                    </motion.div>
                  )}
                </>
              ) : !activeTournament ? (
                // No Active Tournament Message
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
                  <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border-2 border-blue-400/30 rounded-2xl p-6 md:px-8 md:pb-6 shadow-2xl">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm md:text-base font-semibold mb-4">
                        <Calendar className="w-4 h-4" />
                        No Active Tournaments
                      </div>
                      <h2 className="text-2xl md:text-4xl font-bold text-blue-400 mb-3 md:mb-4">
                        Stay Tuned! 🏏
                      </h2>
                      <p className="text-lg md:text-xl text-blue-300 mb-4">
                        There are no active tournaments at the moment.
                      </p>
                      <p className="text-base text-blue-200">
                        Check back later for new tournament announcements!
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : activeTournament?.status === 'ongoing' ? (
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
              ) : activeTournament?.status === 'completed' ? (
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
              {shouldShowActionButtons && (
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
                        <Link to={ROUTES.INSTRUCTIONS}>How It Works</Link>
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
              <h2 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                Tournament Statistics
              </h2>
              <div className="mx-auto mb-4 h-1 w-24 bg-gradient-gold rounded-full" />
              <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                Real-time statistics from the active cricket tournaments
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 px-2 md:px-0">
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
              <div className="flex items-center justify-center gap-4 mb-2 md:mb-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-primary)]">
                  {matchesSectionInfo.title}
                </h2>
                {matchesSectionInfo.showRefresh && (
                  <Button
                    onClick={fetchUpcomingMatches}
                    disabled={matchesLoading}
                    variant="outline"
                    size="sm"
                    className="border-[var(--color-accent-1)] text-[var(--color-accent-1)] hover:bg-[var(--color-accent-1)] hover:text-[var(--brand-bg)] transition-all duration-200"
                  >
                    <matchesSectionInfo.icon className="w-4 h-4 mr-2" />
                    {matchesLoading ? 'Refreshing...' : 'Refresh'}
                  </Button>
                )}
              </div>

              <div className="mx-auto mb-4 md:mb-6 h-1 w-16 md:w-24 bg-gradient-gold rounded-full" />

              {/* Dynamic Badge */}
              {matchesSectionInfo.badgeText && (
                <div className="flex items-center justify-center mb-3 md:mb-4">
                  <span
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${
                      matchesSectionInfo.badgeColor
                    } text-white px-4 py-2 rounded-full text-sm md:text-base font-semibold shadow-lg ${
                      activeTournament?.status === 'ongoing'
                        ? 'animate-pulse'
                        : ''
                    }`}
                  >
                    {activeTournament?.status === 'ongoing' && (
                      <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                    )}
                    {matchesSectionInfo.badgeText}
                  </span>
                </div>
              )}

              <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mx-auto px-4">
                {matchesSectionInfo.description}
              </p>
            </div>

            {matchesLoading ? (
              // Loading state
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto px-4 md:px-0">
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="bg-card-bg border-card-border animate-pulse"
                  >
                    <CardHeader className="pb-1 md:pb-4 p-1 md:p-6">
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-1 md:p-6 pt-0">
                      <div className="text-center mb-1 md:mb-4">
                        <div className="h-4 bg-gray-300 rounded w-24 mx-auto mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-8 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-28 mx-auto mb-4"></div>
                      </div>
                      <div className="h-3 bg-gray-300 rounded w-32 mx-auto"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : upcomingMatches.length > 0 ? (
              // Show upcoming matches
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto px-4 md:px-0">
                {upcomingMatches.map((match) => {
                  return (
                    <Card
                      key={match.id}
                      className="bg-card-bg border-card-border hover:border-[var(--color-accent-1)]/50 transition-all duration-200 hover:scale-105"
                    >
                      <CardHeader className="pb-1 md:pb-4 p-1 md:p-6">
                        <div className="flex items-center justify-between">
                          <div className="text-[var(--color-secondary)] text-xs md:text-sm px-1 md:px-3 py-0.5 md:py-2">
                            <Clock className="w-2 h-2 md:w-4 md:h-4 mr-1 inline" />
                            {formatMatchDateTime(match.scheduled_at)}
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs md:text-sm px-1 md:px-3 py-0.5 md:py-2 ${
                              activeTournament?.status === 'ongoing'
                                ? 'border-red-500 text-red-500 animate-pulse'
                                : 'border-[var(--color-accent-1)] text-[var(--color-accent-1)]'
                            }`}
                          >
                            {activeTournament?.status === 'ongoing'
                              ? 'Live Now'
                              : 'Live Soon'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-1 md:p-6 pt-0">
                        <div className="text-center mb-1 md:mb-4">
                          <div className="text-xs md:text-xl font-semibold text-[var(--text-primary)] mb-0.5 md:mb-2">
                            {match.team1_name}
                          </div>
                          <div className="text-xs md:text-sm text-[var(--text-secondary)] mb-0.5 md:mb-2">
                            vs
                          </div>
                          <div className="text-xs md:text-xl font-semibold text-[var(--text-primary)] mb-1 md:mb-4">
                            {match.team2_name}
                          </div>
                        </div>
                        <div className="text-xs md:text-sm text-[var(--text-secondary)] text-center">
                          {match.venue}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] text-center mt-2">
                          {match.tournament_name}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              // No matches - show appropriate message based on tournament phase
              <div className="max-w-2xl mx-auto px-4 md:px-0">
                <Card className="bg-card-bg border-card-border text-center">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-lg md:text-xl font-semibold text-[var(--text-primary)] mb-2">
                      {emptyStateContent.title}
                    </h3>
                    <p className="text-sm md:text-base text-[var(--text-secondary)]">
                      {emptyStateContent.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="text-center mt-8 md:mt-8">
              <Button
                asChild
                size="lg"
                className="bg-[var(--color-secondary)] hover:bg-[var(--color-accent-1)] text-[var(--brand-bg)] hover:text-[var(--brand-bg)] font-semibold px-6 md:px-8 py-2 md:py-3 text-sm md:text-base transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <Link to={matchesSectionInfo.actionButtonLink}>
                  {matchesSectionInfo.actionButtonText}
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
