"use client"

import { useState } from "react"
import { WeeklyCalendar } from "@/components/weekly-calendar"
import { useActivities } from "@/lib/hooks/use-activities"
import { useActivityRegistration } from "@/lib/hooks/use-activity-registration"
import { Calendar, Activity, Users, Clock, MapPin, UserPlus, UserMinus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useToast } from "@/hooks/use-toast"

export default function EventosPage() {
  const { activities, loading, error, fetchActivitiesForWeek, refreshActivities } = useActivities()
  const { registerForActivity, unregisterFromActivity, registering, unregistering } = useActivityRegistration()
  const { toast } = useToast()
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity)
    setIsDialogOpen(true)
  }

  const handleWeekChange = (weekStart: Date) => {
    fetchActivitiesForWeek(weekStart)
  }

  const handleRegister = async (activityId: string) => {
    const result = await registerForActivity(activityId)
    
    if (result.success) {
      toast({
        title: "¡Inscripción exitosa!",
        description: result.message,
      })
      // Recargar actividades para actualizar contadores
      refreshActivities()
    } else {
      toast({
        title: "Error al inscribirse",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const handleUnregister = async (activityId: string) => {
    const result = await unregisterFromActivity(activityId)
    
    if (result.success) {
      toast({
        title: "Desinscripción exitosa",
        description: result.message,
      })
      // Recargar actividades para actualizar contadores
      refreshActivities()
    } else {
      toast({
        title: "Error al desinscribirse",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="p-8 mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cargando actividades...</h2>
            <p className="text-gray-600">Por favor espera mientras cargamos el calendario</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="p-8 mb-6">
            <div className="bg-red-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar actividades</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="p-8 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="h-10 w-10 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-800">
              Calendario de Actividades
            </h1>
            <Calendar className="h-10 w-10 text-blue-600 ml-4" />
          </div>
          <p className="text-gray-600 text-xl font-medium">
            Visualiza y participa en las actividades solidarias de la semana
          </p>
        </div>
      </div>

      {/* Calendario semanal */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <WeeklyCalendar 
          activities={activities}
          onActivityClick={handleActivityClick}
        />
      </div>

      {/* Información adicional */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white shadow-xl">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-4 text-white">¿Cómo usar el calendario?</h3>
          <p className="text-blue-100 text-lg">Guía rápida para navegar y participar en actividades</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-700 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-3 text-white">Navegación</h4>
            <p className="text-blue-100 leading-relaxed">
              Usa las flechas para navegar entre semanas y el botón "Esta semana" para volver al presente
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-700 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-3 text-white">Actividades</h4>
            <p className="text-blue-100 leading-relaxed">
              Haz clic en cualquier actividad para ver detalles completos y opciones de participación
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-700 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-3 text-white">Participación</h4>
            <p className="text-blue-100 leading-relaxed">
              Ve el número de participantes y únete a las actividades que te interesen
            </p>
          </div>
        </div>
      </div>

      {/* Modal de detalles de actividad */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedActivity?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha y hora</p>
                    <p className="font-medium">
                      {format(new Date(selectedActivity.date), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </p>
                  </div>
                </div>
                
                {selectedActivity.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Ubicación</p>
                      <p className="font-medium">{selectedActivity.location}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Participantes</p>
                    <p className="font-medium">
                      {selectedActivity.participantCount}
                      {selectedActivity.maxParticipants ? `/${selectedActivity.maxParticipants}` : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <Badge variant={selectedActivity.isActive ? "default" : "secondary"}>
                      {selectedActivity.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {selectedActivity.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedActivity.description}
                  </p>
                </div>
              )}

              {/* Participantes */}
              {selectedActivity.participants && selectedActivity.participants.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Participantes</h4>
                  <div className="space-y-2">
                    {selectedActivity.participants.map((participant: any) => (
                      <div key={participant.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {participant.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{participant.user.name}</p>
                          <p className="text-sm text-gray-600">{participant.user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedActivity.isActive ? (
                  selectedActivity.isUserRegistered ? (
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleUnregister(selectedActivity.id)}
                      disabled={unregistering}
                    >
                      {unregistering ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent mr-2"></div>
                          Desinscribiendo...
                        </>
                      ) : (
                        <>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Desinscribirse
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      className="flex-1"
                      onClick={() => handleRegister(selectedActivity.id)}
                      disabled={registering || (selectedActivity.maxParticipants && selectedActivity.participantCount >= selectedActivity.maxParticipants)}
                    >
                      {registering ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Inscribiendo...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Inscribirse
                        </>
                      )}
                    </Button>
                  )
                ) : (
                  <Button 
                    className="flex-1"
                    disabled
                  >
                    Actividad inactiva
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}