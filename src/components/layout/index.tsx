import type { ReactNode } from 'react'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
  className?: string
}

export function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className="dark">
      <Header />
      <main className={`${className}`}>{children}</main>
    </div>
  )
}

export { Header } from './Header'
export { Footer } from './Footer'
