import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
  format,
  formatDistanceToNow,
  isAfter,
  isBefore,
  parseISO,
} from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date utilities
export const formatDate = (date: string | Date, formatStr: string = 'PPP') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export const formatDateTime = (date: string | Date) => {
  return formatDate(date, 'PPP p')
}

export const formatTimeFromNow = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export const isDateInFuture = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isAfter(dateObj, new Date())
}

export const isDateInPast = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isBefore(dateObj, new Date())
}

// String utilities
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const slugify = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const truncate = (str: string, length: number = 100) => {
  if (str.length <= length) return str
  return str.substring(0, length).trim() + '...'
}

// Number utilities
export const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

export const calculatePercentage = (value: number, total: number) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

// Cricket specific utilities
export const formatOvers = (balls: number) => {
  const overs = Math.floor(balls / 6)
  const remainingBalls = balls % 6
  return `${overs}.${remainingBalls}`
}

export const calculateRunRate = (runs: number, balls: number) => {
  if (balls === 0) return 0
  return ((runs * 6) / balls).toFixed(2)
}

export const calculateRequiredRunRate = (
  target: number,
  currentRuns: number,
  ballsRemaining: number
) => {
  if (ballsRemaining === 0) return 0
  const runsNeeded = target - currentRuns
  return ((runsNeeded * 6) / ballsRemaining).toFixed(2)
}

// Validation utilities
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string) => {
  const phoneRegex = /^[+]?([1-9][\d]{0,15})$/
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''))
}

// Tournament utilities
export const formatTournamentStartTime = (startDate: string | Date) => {
  const dateObj =
    typeof startDate === 'string' ? parseISO(startDate) : startDate
  return format(dateObj, "EEEE, MMMM do, yyyy 'at' h:mm a")
}

export const formatTournamentStartTimeShort = (startDate: string | Date) => {
  const dateObj =
    typeof startDate === 'string' ? parseISO(startDate) : startDate
  return format(dateObj, 'MMM do, h:mm a')
}

export const getTimeUntilTournament = (startDate: string | Date) => {
  const dateObj =
    typeof startDate === 'string' ? parseISO(startDate) : startDate
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

// File utilities
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const isImageFile = (file: File) => {
  return file.type.startsWith('image/')
}

export const getImageUrl = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.readAsDataURL(file)
  })
}

// Local storage utilities
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

/**
 * Convert a local date and time to ISO string while preserving the local timezone
 * This prevents the time from being shifted due to UTC conversion
 * @param dateString - Date string in YYYY-MM-DD format
 * @param timeString - Time string in HH:MM format
 * @returns ISO string that preserves local time
 */
export function localDateTimeToISO(
  dateString: string,
  timeString: string
): string {
  const dateTimeString = `${dateString}T${timeString}:00`
  const dateObject = new Date(dateTimeString)

  // Validate that the date is valid
  if (isNaN(dateObject.getTime())) {
    throw new Error('Invalid date or time format')
  }

  // Create ISO string that preserves local timezone
  // We need to offset the timezone difference to keep the local time
  const localOffset = dateObject.getTimezoneOffset() * 60000 // Convert minutes to milliseconds
  const localDateTime = new Date(dateObject.getTime() - localOffset)

  return localDateTime.toISOString()
}

/**
 * Convert a local date to ISO string while preserving the local timezone
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns ISO string that preserves local date
 */
export function localDateToISO(dateString: string): string {
  const date = new Date(dateString)

  // Validate that the date is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format')
  }

  // Create ISO string that preserves local timezone
  const localOffset = date.getTimezoneOffset() * 60000
  const localDateTime = new Date(date.getTime() - localOffset)

  return localDateTime.toISOString()
}

/**
 * Convert a local datetime string to ISO string while preserving the local timezone
 * @param dateTimeString - DateTime string that should be treated as local time
 * @returns ISO string that preserves local time
 */
export function localDateTimeStringToISO(dateTimeString: string): string {
  const date = new Date(dateTimeString)

  // Validate that the date is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid datetime format')
  }

  // Create ISO string that preserves local timezone
  const localOffset = date.getTimezoneOffset() * 60000
  const localDateTime = new Date(date.getTime() - localOffset)

  return localDateTime.toISOString()
}
