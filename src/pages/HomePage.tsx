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
import { Trophy, Users, Calendar, ArrowRight, Play, Clock } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

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
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Cricket Tournament Management Made Simple
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Register teams, manage matches, and follow live scores in the most
              comprehensive cricket tournament platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="bg-white text-green-600 hover:bg-gray-100"
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
                className="border-white text-white hover:bg-white hover:text-green-600"
              >
                <Link to={ROUTES.TOURNAMENTS}>View Tournaments</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container space-y-12">
        {/* Stats Section */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-gray-100 p-3">
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Live Matches & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Matches */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Upcoming Matches</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to={ROUTES.MATCHES}>
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <Card key={match.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm font-medium">
                          <span>{match.team1}</span>
                          <span className="text-muted-foreground">vs</span>
                          <span>{match.team2}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{match.time}</span>
                          </div>
                          <span>{match.venue}</span>
                        </div>
                      </div>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
            <div className="space-y-4">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-green-100 p-2">
                        <feature.icon className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
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
                      className="p-0 h-auto"
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
          </section>
        </div>

        {/* Tournament Highlights */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Tournament Highlights</h2>
          <Card className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-4 bg-green-600">
                    Featured Tournament
                  </Badge>
                  <h3 className="text-2xl font-bold mb-4">
                    InfoBash Cricket Championship 2025
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Join the biggest cricket tournament of the year with 32
                    teams competing for the championship trophy. Registration
                    ends soon!
                  </p>
                  <div className="flex space-x-4">
                    <Button asChild>
                      <Link to={ROUTES.REGISTER_TEAM}>Register Team</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to={ROUTES.TOURNAMENTS}>Learn More</Link>
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-green-600 text-white mb-4">
                    <Trophy className="h-16 w-16" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">₹50,000</p>
                    <p className="text-sm text-muted-foreground">Prize Pool</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
