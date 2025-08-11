import { useState, useEffect } from 'react'

interface Serializer<T> {
  read: (value: string) => T
  write: (value: T) => string
}

interface UseLocalStorageOptions<T> {
  defaultValue: T
  serializer?: Serializer<T>
}

const defaultSerializer = {
  read: JSON.parse,
  write: JSON.stringify,
}

export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T>
) {
  const { defaultValue, serializer = defaultSerializer } = options

  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        return serializer.read(item)
      }
      return defaultValue
    } catch {
      return defaultValue
    }
  })

  const setStoredValue = (newValue: T | ((prevValue: T) => T)) => {
    try {
      const valueToStore =
        newValue instanceof Function ? newValue(value) : newValue
      setValue(valueToStore)
      localStorage.setItem(key, serializer.write(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [value, setStoredValue] as const
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = () => setValue(!value)
  const setTrue = () => setValue(true)
  const setFalse = () => setValue(false)

  return [value, { toggle, setTrue, setFalse }] as const
}
