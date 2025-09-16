import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'

export interface Notification {
  id: string
  title: string
  message: string
  type: string
  isActive: boolean
  isGlobal: boolean
  createdAt: string
  notificationReads: Array<{
    id: string
    readAt: string
  }>
}

export function useNotifications() {
  const { user } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }, [user])

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch('/api/notifications/unread-count')
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }, [user])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      })

      if (response.ok) {
        // Actualizar el contador local
        setUnreadCount(prev => Math.max(0, prev - 1))
        // Actualizar la notificación local
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId
              ? { ...notification, notificationReads: [{ id: 'temp', readAt: new Date().toISOString() }] }
              : notification
          )
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAll: true }),
      })

      if (response.ok) {
        setUnreadCount(0)
        // Actualizar todas las notificaciones como leídas
        setNotifications(prev => 
          prev.map(notification => ({
            ...notification,
            notificationReads: [{ id: 'temp', readAt: new Date().toISOString() }]
          }))
        )
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [])

  const isRead = useCallback((notification: Notification) => {
    return notification.notificationReads.length > 0
  }, [])

  useEffect(() => {
    if (user) {
      fetchNotifications()
      fetchUnreadCount()
      setLoading(false)
    }
  }, [user, fetchNotifications, fetchUnreadCount])

  // Actualizar contador cada 30 segundos
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      fetchUnreadCount()
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [user, fetchUnreadCount])

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    isRead,
    refreshNotifications: fetchNotifications,
    refreshUnreadCount: fetchUnreadCount
  }
}
