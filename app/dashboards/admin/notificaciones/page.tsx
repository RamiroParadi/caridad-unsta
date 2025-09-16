"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react"
import { Plus, Trash2, Edit, Eye } from "lucide-react"

export default function NotificacionesPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [editingNotification, setEditingNotification] = useState<any>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [notificationToDelete, setNotificationToDelete] = useState<any>(null)

  const loadHistory = async () => {
    try {
      setLoadingHistory(true)
      const res = await fetch('/api/admin/notifications', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error cargando historial')
      const items: any[] = data.notifications || []
      // Agrupar por (title, message, type) y minuto para evitar mostrar una fila por usuario
      const groups = new Map<string, { title: string; message: string; type?: string; users: number; createdAt: string; ids: string[] }>()
      for (const n of items) {
        const minute = new Date(n.createdAt).toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM
        const key = `${n.title}|${n.message}|${n.type}|${minute}`
        const existing = groups.get(key)
        if (existing) {
          existing.users += 1
          existing.ids.push(n.id)
          // mantener la fecha más reciente
          if (new Date(n.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
            existing.createdAt = n.createdAt
          }
        } else {
          groups.set(key, {
            title: n.title,
            message: n.message,
            type: n.type,
            users: 1,
            createdAt: n.createdAt,
            ids: [n.id],
          })
        }
      }
      const grouped = Array.from(groups.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setHistory(grouped)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingHistory(false)
    }
  }

  // cargar al montar
  useEffect(() => {
    loadHistory()
  }, [])

  const handleCreate = async () => {
    setFeedback(null)
    if (!title.trim() || !message.trim()) {
      setFeedback("Título y mensaje son requeridos")
      return
    }
    try {
      setLoading(true)
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Error creando notificaciones')
      }
      setFeedback(`✅ Notificaciones creadas: ${data.count}`)
      setTitle("")
      setMessage("")
      // refrescar historial automáticamente
      loadHistory()
    } catch (e: any) {
      setFeedback(`❌ ${e.message || 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (notification: any) => {
    setEditingNotification(notification)
    setTitle(notification.title)
    setMessage(notification.message)
  }

  const handleCancelEdit = () => {
    setEditingNotification(null)
    setTitle("")
    setMessage("")
  }

  const handleUpdate = async () => {
    if (!editingNotification) return
    
    setFeedback(null)
    if (!title.trim() || !message.trim()) {
      setFeedback("Título y mensaje son requeridos")
      return
    }
    
    try {
      setLoading(true)
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: editingNotification.ids[0], 
          title, 
          message
        })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Error actualizando notificación')
      }
      setFeedback(`✅ Notificación actualizada`)
      handleCancelEdit()
      loadHistory()
    } catch (e: any) {
      setFeedback(`❌ ${e.message || 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (notification: any) => {
    setNotificationToDelete(notification)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!notificationToDelete) return
    
    try {
      if (!Array.isArray(notificationToDelete.ids) || notificationToDelete.ids.length === 0) return
      
      // Eliminar todas las notificaciones del grupo
      await Promise.all(
        notificationToDelete.ids.map((id: string) => 
          fetch(`/api/admin/notifications?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
        )
      )
      
      setFeedback(`✅ Notificación eliminada`)
      loadHistory()
    } catch (e) {
      console.error(e)
      setFeedback(`❌ Error eliminando notificación`)
    } finally {
      setShowDeleteDialog(false)
      setNotificationToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notificaciones</h2>
          <p className="text-muted-foreground">
            Gestiona las notificaciones para los usuarios
          </p>
        </div>
        <Button onClick={handleCreate} disabled={loading}>
          <Plus className="mr-2 h-4 w-4" />
          {loading ? 'Creando...' : 'Crear notificación global'}
        </Button>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Notificaciones</CardTitle>
            <CardDescription>
              Aquí podrás crear, editar y gestionar todas las notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 max-w-2xl">
              {feedback && (
                <div className="text-sm">
                  <span className="text-muted-foreground">{feedback}</span>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" placeholder="Ej: Noche de Caridad" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Mensaje</Label>
                <Input id="message" placeholder="Ej: Te esperamos este viernes a las 20hs" value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <div className="flex gap-2">
                {editingNotification ? (
                  <>
                    <Button onClick={handleUpdate} disabled={loading}>
                      {loading ? 'Actualizando...' : 'Actualizar'}
                    </Button>
                    <Button variant="secondary" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleCreate} disabled={loading}>
                      {loading ? 'Creando...' : 'Crear notificación global'}
                    </Button>
                    <Button variant="secondary" onClick={loadHistory} disabled={loadingHistory}>
                      {loadingHistory ? 'Actualizando...' : 'Actualizar historial'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de notificaciones</CardTitle>
            <CardDescription>Listado de todas las notificaciones creadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="py-2">Título</th>
                    <th className="py-2">Mensaje</th>
                    <th className="py-2">Tipo</th>
                    <th className="py-2">Fecha</th>
                    <th className="py-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 && (
                    <tr>
                      <td className="py-3" colSpan={5}>No hay notificaciones</td>
                    </tr>
                  )}
                  {history.map((n, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-2 font-medium">{n.title}</td>
                      <td className="py-2 max-w-[420px] truncate" title={n.message}>{n.message}</td>
                      <td className="py-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          🌍 Global
                        </span>
                      </td>
                      <td className="py-2">{new Date(n.createdAt).toLocaleString()}</td>
                      <td className="py-2 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(n)}
                            title="Editar notificación"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(n)}
                            title="Eliminar notificación"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar notificación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la notificación "{notificationToDelete?.title}" 
              para todos los usuarios ({notificationToDelete?.users} usuarios afectados).
              <br />
              <strong>Esta acción no se puede deshacer.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
