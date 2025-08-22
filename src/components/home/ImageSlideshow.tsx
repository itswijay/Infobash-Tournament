import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  id: string
  imageUrl: string
  alt: string
}

interface ImageSlideshowProps {
  slides: Slide[]
  autoPlay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
  pauseOnHover?: boolean
}

export function ImageSlideshow({
  slides,
  autoPlay = true,
  interval = 4000,
  showDots = true,
  showArrows = true,
  pauseOnHover = true,
}: ImageSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  useEffect(() => {
    if (!autoPlay || isPaused) return

    const timer = setInterval(nextSlide, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, isPaused, nextSlide])

  if (!slides.length) return null

  return (
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--brand-bg)] to-[var(--brand-bg)]/80">
      {/* Slides Container */}
      <div
        className="relative w-full h-full"
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{
              type: 'tween',
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slides[currentSlide].imageUrl}
              alt={slides[currentSlide].alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Gradient Overlay for Better Visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {showArrows && slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="hidden md:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-white/30 transition-all duration-200 group"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-200" />
            </button>

            <button
              onClick={nextSlide}
              className="hidden md:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center text-white hover:bg-white/30 transition-all duration-200 group"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </>
        )}

        {/* Navigation Dots */}
        {showDots && slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Slide Counter */}
        <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs md:text-sm px-3 py-1 rounded-full">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </div>
  )
}
