"use client"

import { useEffect, useState } from "react"
import { Bell, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface NotificationItem {
  id: string
  title: string
  message: string
  createdAt: string
  type?: string
}

interface NotificationsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function NotificationsModal({ open, onOpenChange }: NotificationsModalProps) {
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let isMounted = true
    setLoading(true)
    setError(null)
    fetch('/api/users/notifications')
      .then(async (res) => {
        if (!res.ok) throw new Error('Error al cargar notificaciones')
        return res.json()
      })
      .then((data) => {
        if (!isMounted) return
        setNotifications(data.notifications || [])
      })
      .catch((e) => {
        if (!isMounted) return
        setError(e.message || 'Error desconocido')
      })
      .finally(() => {
        if (!isMounted) return
        setLoading(false)
      })
    return () => { isMounted = false }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-yellow-600" />
            <span>Notificaciones</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 max-h-[60vh] overflow-auto">
          {loading && (
            <div className="text-sm text-gray-500">Cargando...</div>
          )}
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          {!loading && !error && notifications.length === 0 && (
            <div className="text-sm text-gray-500">No hay notificaciones.</div>
          )}
          {notifications.map((n) => (
            <div key={n.id} className="rounded-md border border-yellow-200 bg-yellow-50 p-3">
              <div className="text-sm font-medium text-yellow-900">{n.title}</div>
              <div className="text-xs text-yellow-800 mt-1">{n.message}</div>
              <div className="flex items-center gap-1 text-[10px] text-yellow-700 mt-2">
                <Clock className="h-3 w-3" />
                <span>{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}


