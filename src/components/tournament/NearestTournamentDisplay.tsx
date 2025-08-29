
import { Calendar, Clock, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useNearestTournament } from '@/hooks/useNearestTournament'
import {
  formatTournamentStartTime,
  formatTournamentStartTimeShort,
  getTimeUntilTournament,
} from '@/lib/utils'

export function NearestTournamentDisplay() {
  const { tournament, startTime, loading, error } = useNearestTournament()

  if (loading) {
    return (
      <Card className="border-slate-600 bg-slate-800/50">
        <CardContent className="p-6">
          <div className="flex justify-center items-center min-h-[120px]">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-slate-600 bg-slate-800/50">
        <CardContent className="p-6">
          <div className="text-center text-slate-400">
            <p>Unable to load tournament information</p>
            <p className="text-sm text-slate-500 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!tournament || !startTime) {
    return (
      <Card className="border-slate-600 bg-slate-800/50">
        <CardContent className="p-6">
          <div className="text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-500" />
            <h3 className="text-lg font-semibold mb-2">
              No Upcoming Tournaments
            </h3>
            <p className="text-sm text-slate-500">
              There are no upcoming tournaments scheduled at the moment.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'registration_open':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'registration_closed':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming'
      case 'registration_open':
        return 'Registration Open'
      case 'registration_closed':
        return 'Registration Closed'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
    <Card className="border-slate-600 bg-slate-800/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          Next Tournament
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tournament Name and Status */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              {tournament.name}
            </h3>
            {tournament.description && (
              <p className="text-slate-300 text-sm mb-3">
                {tournament.description}
              </p>
            )}
          </div>
          <Badge
            variant="outline"
            className={`border ${getStatusColor(
              tournament.status
            )} text-xs font-medium px-2 py-1`}
          >
            {getStatusText(tournament.status)}
          </Badge>
        </div>

        {/* Start Time Information */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-green-400" />
            <div>
              <h4 className="text-white font-medium">Tournament Starts</h4>
              <p className="text-slate-300 text-sm">
                {formatTournamentStartTime(startTime)}
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-green-400 font-semibold text-lg">
              {getTimeUntilTournament(startTime)}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {formatTournamentStartTimeShort(startTime)}
            </p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Max Teams: {tournament.max_teams}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>
              Registration Deadline:{' '}
              {new Date(tournament.registration_deadline).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
