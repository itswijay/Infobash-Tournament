import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

const TournamentResultsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center"
        >
          <div className="max-w-2xl mx-auto">
            {/* Icon */}
            <div className="text-6xl mb-6">🏆</div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tournament Results
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-lg mb-8">
              Complete tournament results and statistics will be displayed here.
            </p>

            {/* Placeholder Content */}
            <div className="bg-slate-800/50 border border-slate-600/30 rounded-xl p-8 mb-8">
              <div className="text-slate-400 text-sm">
                This page is under development. Tournament results will be
                available here soon.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <Link to={ROUTES.HOME}>Return to Home</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TournamentResultsPage
