import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react'

export interface Notification {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  time: Date
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (type: Notification['type'], message: string) => void
  removeNotification: (id: number) => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}

let nextNotificationId = 1

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const recentRef = useRef<Map<string, number>>(new Map())

  const addNotification = useCallback((type: Notification['type'], message: string) => {
    const key = `${type}:${message}`
    const now = Date.now()
    const last = recentRef.current.get(key)
    if (last && now - last < 3000) {
      return
    }
    recentRef.current.set(key, now)
    // cleanup old entries periodically
    if (recentRef.current.size > 50) {
      const cutoff = now - 10000
      for (const [k, v] of recentRef.current) {
        if (v < cutoff) recentRef.current.delete(k)
      }
    }
    const notification: Notification = {
      id: nextNotificationId++,
      type,
      message,
      time: new Date()
    }
    setNotifications(prev => [notification, ...prev])
  }, [])

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  )
}