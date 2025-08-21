import { useState } from 'react'
import { AppRouter } from '@/components/AppRouter'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import { AppLoader } from '@/components/shared/AppLoader'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <AppLoader onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <AuthProvider>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--brand-bg)',
            color: 'var(--text-primary)',
            border: '1px solid var(--brand-border)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
    </AuthProvider>
  )
}

export default App
