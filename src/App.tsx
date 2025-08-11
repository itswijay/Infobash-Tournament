import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { APP_NAME } from '@/lib/constants'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">{APP_NAME}</h1>
          <p className="text-lg text-gray-600">
            Modern cricket tournament management system
          </p>
          <Badge variant="secondary" className="text-sm">
            Phase 1.1 Complete ✅
          </Badge>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                🏗️ <span>Infrastructure</span>
              </CardTitle>
              <CardDescription>Core setup and dependencies</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>✅ React + TypeScript + SWC</li>
                <li>✅ ShadcnUI Components</li>
                <li>✅ Tailwind CSS</li>
                <li>✅ Supabase Configuration</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                📝 <span>Forms & Validation</span>
              </CardTitle>
              <CardDescription>React Hook Form + Zod schemas</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>✅ Team Registration Schema</li>
                <li>✅ Tournament Schema</li>
                <li>✅ Player Validation</li>
                <li>✅ Match Creation Schema</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                🎯 <span>State Management</span>
              </CardTitle>
              <CardDescription>Zustand + TypeScript types</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>✅ Type Definitions</li>
                <li>✅ Utility Functions</li>
                <li>✅ Constants</li>
                <li>✅ Cricket Calculations</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Start Phase 1.2 →
          </Button>
          <Button variant="outline" size="lg">
            View Progress
          </Button>
        </div>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Tech Stack Overview</CardTitle>
            <CardDescription>
              Modern technologies powering this application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold">Frontend</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>React 19</li>
                  <li>TypeScript</li>
                  <li>SWC</li>
                  <li>Vite</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">UI/UX</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>ShadcnUI</li>
                  <li>Tailwind CSS</li>
                  <li>Lucide Icons</li>
                  <li>Responsive</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Backend</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>Supabase</li>
                  <li>PostgreSQL</li>
                  <li>Real-time</li>
                  <li>Authentication</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">State & Forms</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>Zustand</li>
                  <li>React Hook Form</li>
                  <li>Zod Validation</li>
                  <li>Date-fns</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
