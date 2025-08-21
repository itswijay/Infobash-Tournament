import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '@/assets/logo.png'

interface AppLoaderProps {
  onLoadingComplete: () => void
}

export function AppLoader({ onLoadingComplete }: AppLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [showProgress, setShowProgress] = useState(false)

  useEffect(() => {
    // Show progress bar immediately with logo
    setShowProgress(true)

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // Wait a bit more before completing
          setTimeout(() => onLoadingComplete(), 1500)
          return 100
        }
        return prev + 1.2
      })
    }, 100) // 100ms per 1.2% = 8.3 seconds total for progress

    return () => {
      clearInterval(progressInterval)
    }
  }, [onLoadingComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.5 }}
      className="fixed inset-0 bg-[var(--brand-bg)] flex items-center justify-center z-50"
    >
      <div className="text-center">
        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 10.5,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.5,
          }}
          className="mb-16"
        >
          <div className="w-24 h-24 md:w-36 md:h-36 mx-auto mb-8">
            {/* InfoBash logo */}
            <img
              src={logo}
              alt="InfoBash V4.0 Logo"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Progress Bar */}
        <AnimatePresence>
          {showProgress && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="w-72 md:w-96 mx-auto"
            >
              <div className="bg-[var(--brand-bg)]/20 rounded-full h-3 mb-4 overflow-hidden border border-[var(--brand-bg)]/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-accent-1)] to-[var(--color-secondary)] rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                >
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              </div>
              <motion.div
                className="text-sm text-[var(--text-secondary)] font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Loading... {Math.round(progress)}%
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
