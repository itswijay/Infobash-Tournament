import { AppRouter } from '@/components/AppRouter'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster />
    </AuthProvider>
  )
}

export default App
