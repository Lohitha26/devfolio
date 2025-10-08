// ============================================
// src/hooks/index.ts - Custom Hooks Library
// ============================================

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

// ============================================
// 1. useLocalStorage - Persistent state
// ============================================
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// ============================================
// 2. useDebounce - Optimize search/input
// ============================================
export function useDebounce<T>(value: T, delay: number = 500): T {
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

// ============================================
// 3. useIntersectionObserver - Lazy loading
// ============================================
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!elementRef.current) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(elementRef.current)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, options])

  return isIntersecting
}

// ============================================
// 4. useKeyPress - Keyboard shortcuts
// ============================================
export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false)

  useEffect(() => {
    const downHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(true)
      }
    }

    const upHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(false)
      }
    }

    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [targetKey])

  return keyPressed
}

// ============================================
// 5. useMediaQuery - Responsive design
// ============================================
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// ============================================
// 6. useFetch - API calls with states
// ============================================
interface FetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useFetch<T>(url: string, options?: RequestInit) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const refetch = useCallback(() => {
    setState({ data: null, loading: true, error: null })
    
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setState({ data, loading: false, error: null })
      })
      .catch((error) => {
        setState({ data: null, loading: false, error })
      })
  }, [url, options])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}

// ============================================
// 7. useClipboard - Copy to clipboard
// ============================================
export function useClipboard(timeout: number = 2000) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), timeout)
    } catch (error) {
      console.error('Failed to copy:', error)
      setIsCopied(false)
    }
  }, [timeout])

  return { isCopied, copyToClipboard }
}

// ============================================
// 8. useTheme - Dark/light mode
// ============================================
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [setTheme])

  return { theme, setTheme, toggleTheme }
}

// ============================================
// 9. usePagination - List pagination
// ============================================
export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }, [items, currentPage, itemsPerPage])

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  }
}

// ============================================
// 10. useForm - Custom form handling
// ============================================
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => void | Promise<void>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [errors])

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, onSubmit])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setErrors,
    reset,
  }
}

// ============================================
// 11. useToggle - Simple toggle state
// ============================================
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return { value, toggle, setTrue, setFalse, setValue }
}

// ============================================
// 12. useWindowSize - Track window dimensions
// ============================================
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

// ============================================
// 13. useOnClickOutside - Detect outside clicks
// ============================================
export function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// ============================================
// 14. useAsync - Async operation state
// ============================================
export function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  const execute = useCallback(async () => {
    setStatus('pending')
    setData(null)
    setError(null)

    try {
      const response = await asyncFunction()
      setData(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error as E)
      setStatus('error')
      throw error
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { execute, status, data, error, isLoading: status === 'pending' }
}

// ============================================
// 15. usePrevious - Track previous value
// ============================================
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

// ============================================
// 16. useInterval - Declarative setInterval
// ============================================
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

// ============================================
// 17. useTimeout - Declarative setTimeout
// ============================================
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const id = setTimeout(() => savedCallback.current(), delay)
    return () => clearTimeout(id)
  }, [delay])
}

// ============================================
// 18. useEventListener - Add event listeners
// ============================================
export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element: HTMLElement | Window = typeof window !== 'undefined' ? window : ({} as Window)
) {
  const savedHandler = useRef(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const isSupported = element && element.addEventListener
    if (!isSupported) return

    const eventListener = (event: Event) => savedHandler.current(event)
    element.addEventListener(eventName, eventListener)

    return () => {
      element.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element])
}

// ============================================
// 19. useArray - Array manipulation helpers
// ============================================
export function useArray<T>(initialValue: T[]) {
  const [array, setArray] = useState(initialValue)

  const push = useCallback((element: T) => {
    setArray((prev) => [...prev, element])
  }, [])

  const filter = useCallback((callback: (element: T) => boolean) => {
    setArray((prev) => prev.filter(callback))
  }, [])

  const update = useCallback((index: number, newElement: T) => {
    setArray((prev) => [
      ...prev.slice(0, index),
      newElement,
      ...prev.slice(index + 1),
    ])
  }, [])

  const remove = useCallback((index: number) => {
    setArray((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])
  }, [])

  const clear = useCallback(() => {
    setArray([])
  }, [])

  return { array, set: setArray, push, filter, update, remove, clear }
}
