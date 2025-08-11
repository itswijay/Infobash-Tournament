import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  showRetry?: boolean
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  showRetry = true,
  className,
}: ErrorStateProps) {
  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      {showRetry && onRetry && (
        <CardContent className="text-center">
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      )}
    </Card>
  )
}

interface PageErrorProps {
  error?: Error
  onRetry?: () => void
}

export function PageError({ error, onRetry }: PageErrorProps) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <ErrorState
        title="Page Error"
        message={
          error?.message || 'Failed to load this page. Please try again.'
        }
        onRetry={onRetry}
        className="max-w-md"
      />
    </div>
  )
}
