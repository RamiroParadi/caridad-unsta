import { EventForm } from "@/components/event-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, MapPin, Users } from "lucide-react"
import { useState } from "react"

export default function ActividadesPage() {
  const [showForm, setShowForm] = useState(false)

  // Datos de ejemplo - en el futuro vendrán de la base de datos
  const activities = [
    {
      id: "1",
      title: "Recolección de Alimentos",
      description: "Recolección de alimentos no perecederos para familias necesitadas",
      date: "2024-01-25T10:00:00",
      location: "Plaza Central",
      maxParticipants: 20,
      participants: 15
    },
    {
      id: "2", 
      title: "Voluntariado Hospital",
      description: "Acompañamiento y apoyo a pacientes del hospital local",
      date: "2024-01-30T14:00:00",
      location: "Hospital San Juan",
      maxParticipants: 10,
      participants: 8
    }
  ]

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
          <EventForm onSuccess={() => setShowForm(false)} />
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

      <div className="grid gap-4">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{activity.title}</span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {activity.participants}/{activity.maxParticipants}
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
                  <span>{activity.maxParticipants} participantes máx.</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  Ver Participantes
                </Button>
                <Button variant="destructive" size="sm">
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
