import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Trophy, UserCheck, Info, ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export function InstructionsPage() {
  return (
    <div className="container py-6">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-2xl font-bold text-[var(--text-primary)]">
            How to Register Your Team for INFOBASH v4.0
          </h1>
          <div className="mt-2 lg:mb-8 h-1 w-32 rounded-full bg-gradient-gold opacity-80 mx-auto" />
        </div>

        <Card className="max-w-lg mx-auto bg-card-bg border-card-border">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-[var(--color-accent-1)]/10 flex items-center justify-center">
              <Info className="h-8 w-8 text-[var(--color-accent-1)]" />
            </div>
            <CardTitle className="text-xl text-[var(--text-primary)]">
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[var(--color-accent-1)] mt-0.5 flex-shrink-0" />
                <p className="text-[var(--text-secondary)]">
                  <strong className="text-[var(--text-primary)]">
                    Registration Deadline:
                  </strong>{' '}
                  Make sure to complete your team registration before the
                  tournament begins on August 29, 2025.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-[var(--color-accent-1)] mt-0.5 flex-shrink-0" />
                <p className="text-[var(--text-secondary)]">
                  <strong className="text-[var(--text-primary)]">
                    Tournament Format:
                  </strong>{' '}
                  Teams that don't meet the exact composition requirements (7
                  boys + 3 girls) will not be eligible to participate.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-[var(--color-accent-1)] mt-0.5 flex-shrink-0" />
                <p className="text-[var(--text-secondary)]">
                  <strong className="text-[var(--text-primary)]">
                    Account Verification:
                  </strong>{' '}
                  All team members must have verified accounts before team
                  registration can be completed.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Registration Steps:
                </h3>
                <div className="text-left space-y-3 text-sm text-[var(--text-secondary)]">
                  <div>
                    <strong className="text-[var(--text-primary)]">
                      Step 1:
                    </strong>{' '}
                    All users must sign in with their Google account
                  </div>
                  <div>
                    <strong className="text-[var(--text-primary)]">
                      Step 2:
                    </strong>{' '}
                    Ensure all 10 team members have individual accounts
                  </div>
                  <div>
                    <strong className="text-[var(--text-primary)]">
                      Step 3:
                    </strong>{' '}
                    Team must have exactly 7 boys and 3 girls
                  </div>
                  <div>
                    <strong className="text-[var(--text-primary)]">
                      Step 4:
                    </strong>{' '}
                    Team captain can then register the complete team
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 text-[var(--brand-bg)] font-semibold px-6 py-3 ml-4 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <Link to={ROUTES.REGISTER_TEAM}>
                    Start Team Registration
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-[var(--color-accent-1)] text-[var(--color-accent-1)] hover:bg-[var(--color-accent-1)] hover:text-[var(--brand-bg)] font-semibold px-6 mr-4 py-3 transition-all duration-200 hover:scale-105"
                >
                  <Link to={ROUTES.TOURNAMENTS}>
                    View Tournaments
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <p className="text-sm text-[var(--text-secondary)]">
                Team registration will be available soon. Check back later for
                full functionality!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
