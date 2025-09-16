"use client"

import { useEffect, useState } from "react"
import { Bell, Clock, CheckCircle, Calendar, Heart } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface NotificationItem {
  id: string
  title: string
  message: string
  createdAt: string
  type?: string
}

interface NotificationsPopoverProps {
  children: React.ReactNode
}

export default function NotificationsPopover({ children }: NotificationsPopoverProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let isMounted = true
    setLoading(true)
    setError(null)
    fetch('/api/users/notifications', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Error al cargar notificaciones')
        return res.json()
      })
      .then((data) => {
        if (!isMounted) return
        const fetched: NotificationItem[] = (data.notifications || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setNotifications(fetched)
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0 overflow-hidden">
        <div className="border-b px-3 py-2 flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-white">
          <Bell className="h-4 w-4 text-yellow-700" />
          <span className="text-sm font-semibold text-yellow-900">Notificaciones</span>
        </div>
        <div className="max-h-[60vh] overflow-auto p-2">
          {loading && <div className="text-sm text-gray-500 px-1">Cargando...</div>}
          {error && <div className="text-sm text-red-600 px-1">{error}</div>}
          {!loading && !error && notifications.length === 0 && (
            <div className="text-sm text-gray-500 px-1 py-2">No hay notificaciones.</div>
          )}
          <div className="flex flex-col divide-y divide-yellow-100">
            {notifications.map((n) => {
              const icon = n.type === 'CONFIRMACION'
                ? <CheckCircle className="h-4 w-4 text-green-600" />
                : n.type === 'EVENTO'
                ? <Calendar className="h-4 w-4 text-purple-600" />
                : <Heart className="h-4 w-4 text-rose-600" />
              const badgeClass = n.type === 'CONFIRMACION'
                ? 'bg-green-100 text-green-800'
                : n.type === 'EVENTO'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-rose-100 text-rose-800'
              return (
                <div key={n.id} className="flex items-start gap-3 p-3 hover:bg-yellow-50/60 transition">
                  <div className="mt-0.5 shrink-0 rounded-full bg-white border w-8 h-8 flex items-center justify-center shadow-sm">
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-900 truncate">{n.title}</div>
                      {n.type && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${badgeClass}`}>{n.type}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-700 mt-0.5 break-words">{n.message}</div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}


