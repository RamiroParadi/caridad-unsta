"use client"

import { EventForm } from "@/components/event-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, MapPin, Users } from "lucide-react"
import { useState, useEffect } from "react"

interface Activity {
  id: string
  title: string
  description?: string
  date: string
  location?: string
  maxParticipants?: number
  participants: Array<{
    user: {
      id: string
      name: string
      email: string
    }
  }>
  createdAt: string
  updatedAt: string
}

export default function ActividadesPage() {
  const [showForm, setShowForm] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities')
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      } else {
        console.error('Error fetching activities')
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActivityCreated = () => {
    setShowForm(false)
    fetchActivities() // Recargar las actividades
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Crear Actividad</h2>
            <p className="text-muted-foreground">
              Crea una nueva actividad de caridad
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowForm(false)}
          >
            Cancelar
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <EventForm onSuccess={handleActivityCreated} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Actividades</h2>
          <p className="text-muted-foreground">
            Gestiona las actividades de caridad
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Actividad
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando actividades...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay actividades registradas</p>
          <p className="text-sm text-muted-foreground mt-2">Crea la primera actividad usando el botón "Nueva Actividad"</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {activities.map((activity) => (
            <Card key={activity.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{activity.title}</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {activity.participants.length}{activity.maxParticipants ? `/${activity.maxParticipants}` : ''}
                  </div>
                </CardTitle>
                <CardDescription>{activity.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(activity.date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  {activity.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{activity.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{activity.maxParticipants ? `${activity.maxParticipants} participantes máx.` : 'Sin límite de participantes'}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    Ver Participantes ({activity.participants.length})
                  </Button>
                  <Button variant="destructive" size="sm">
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
