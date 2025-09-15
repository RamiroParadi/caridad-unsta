"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, ArrowRight, CheckCircle, UserPlus } from "lucide-react"
import { QuickRegistrationForm } from "./quick-registration-form"

// Mock data - en el futuro esto vendrá de la base de datos
const mockEvents = [
  {
    id: "1",
    title: "Recolección de Alimentos",
    description: "Ayudamos a recolectar alimentos no perecederos para familias necesitadas del barrio.",
    date: "2024-02-15",
    time: "09:00",
    location: "Plaza San Martín",
    maxParticipants: 20,
    currentParticipants: 8,
    category: "Alimentación",
    status: "ACTIVO" as const,
    requirements: "Traer bolsas reutilizables y buena disposición",
    organizer: "Centro Comunitario San José"
  },
  {
    id: "2", 
    title: "Tutorías Gratuitas",
    description: "Brindamos apoyo escolar a niños de primaria en matemáticas y lengua.",
    date: "2024-02-20",
    time: "15:00",
    location: "Biblioteca Municipal",
    maxParticipants: 15,
    currentParticipants: 12,
    category: "Educación",
    status: "ACTIVO" as const,
    requirements: "Conocimientos básicos en las materias",
    organizer: "Universidad UNSTA"
  },
  {
    id: "3",
    title: "Limpieza de Espacios Verdes",
    description: "Cuidamos el medio ambiente limpiando y manteniendo espacios verdes de la ciudad.",
    date: "2024-02-25",
    time: "08:00",
    location: "Parque Central",
    maxParticipants: 30,
    currentParticipants: 18,
    category: "Medio Ambiente",
    status: "ACTIVO" as const,
    requirements: "Ropa cómoda y guantes de trabajo",
    organizer: "Grupo Ecológico Local"
  },
  {
    id: "4",
    title: "Compañía a Adultos Mayores",
    description: "Acompañamos y compartimos tiempo con adultos mayores en el hogar de ancianos.",
    date: "2024-03-01",
    time: "14:00",
    location: "Hogar San Rafael",
    maxParticipants: 12,
    currentParticipants: 5,
    category: "Social",
    status: "ACTIVO" as const,
    requirements: "Paciencia y empatía",
    organizer: "Hogar San Rafael"
  }
]

interface EventCardProps {
  event: typeof mockEvents[0]
  onRegister: (eventId: string) => void
  isRegistered?: boolean
}

interface EventCardProps {
  event: typeof mockEvents[0]
  onRegister: (eventId: string) => void
  onQuickRegister: (eventId: string) => void
  isRegistered?: boolean
  isQuickRegistering?: boolean
}

function EventCard({ event, onRegister, onQuickRegister, isRegistered, isQuickRegistering }: EventCardProps) {
  console.log(`Evento ${event.id}: isRegistered=${isRegistered}, isQuickRegistering=${isQuickRegistering}`)
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVO': return 'bg-green-100 text-green-800'
      case 'COMPLETO': return 'bg-blue-100 text-blue-800'
      case 'CANCELADO': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Alimentación': return 'bg-orange-100 text-orange-800'
      case 'Educación': return 'bg-blue-100 text-blue-800'
      case 'Medio Ambiente': return 'bg-green-100 text-green-800'
      case 'Social': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isFull = event.currentParticipants >= event.maxParticipants
  const canRegister = event.status === 'ACTIVO' && !isFull && !isRegistered

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${isRegistered ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 mb-2">
              {event.title}
            </CardTitle>
            <CardDescription className="text-gray-600 mb-3">
              {event.description}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getStatusColor(event.status)}>
              {event.status}
            </Badge>
            <Badge className={getCategoryColor(event.category)}>
              {event.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Información del evento */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 col-span-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Participantes */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>
              {event.currentParticipants}/{event.maxParticipants} participantes
            </span>
          </div>
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(event.currentParticipants / event.maxParticipants) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Organizador */}
        <div className="text-sm text-gray-500">
          <strong>Organizador:</strong> {event.organizer}
        </div>

        {/* Requisitos */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700">
            <strong>Requisitos:</strong> {event.requirements}
          </p>
        </div>

        {/* Botón de inscripción */}
        <div>
          {isRegistered ? (
            <Button disabled className="w-full bg-green-600 text-white">
              <CheckCircle className="mr-2 h-4 w-4" />
              Ya estás inscrito
            </Button>
          ) : canRegister ? (
            <Button 
              onClick={() => onQuickRegister(event.id)}
              disabled={isQuickRegistering === event.id}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-3"
            >
              {isQuickRegistering === event.id ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Inscribiéndote...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Inscribirse al Evento
                </>
              )}
            </Button>
          ) : isFull ? (
            <Button disabled className="w-full bg-gray-400 text-white">
              <Users className="mr-2 h-4 w-4" />
              Cupo completo
            </Button>
          ) : (
            <Button disabled className="w-full bg-gray-400 text-white">
              <Clock className="mr-2 h-4 w-4" />
              Evento no disponible
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface EventCardsProps {
  onEventRegister: (eventId: string) => void
  onQuickRegister: (eventId: string) => void
}

export function EventCards({ onEventRegister, onQuickRegister }: EventCardsProps) {
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([])
  const [isQuickRegistering, setIsQuickRegistering] = useState<string | null>(null)

  console.log('Estado actual de eventos registrados:', registeredEvents)

  const handleRegister = (eventId: string) => {
    console.log('Inscribiendo con formulario completo:', eventId)
    setRegisteredEvents(prev => [...prev, eventId])
    onEventRegister(eventId)
  }

  const handleQuickRegister = async (eventId: string) => {
    console.log('Iniciando inscripción rápida para:', eventId)
    setIsQuickRegistering(eventId)
    
    try {
      // Simular inscripción rápida
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Actualizar estado local inmediatamente
      setRegisteredEvents(prev => {
        const newEvents = [...prev, eventId]
        console.log('Eventos registrados actualizados:', newEvents)
        return newEvents
      })
      
      // Notificar al componente padre para mostrar notificación
      onQuickRegister(eventId)
    } catch (error) {
      console.error("Error en inscripción rápida:", error)
    } finally {
      setIsQuickRegistering(null)
    }
  }

  const activeEvents = mockEvents.filter(event => event.status === 'ACTIVO')
  const completedEvents = mockEvents.filter(event => event.status === 'COMPLETO')

  return (
    <div className="space-y-6">
      {/* Eventos Activos */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Eventos Disponibles</h3>
        {activeEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {activeEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={handleRegister}
                onQuickRegister={handleQuickRegister}
                isRegistered={registeredEvents.includes(event.id)}
                isQuickRegistering={isQuickRegistering === event.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No hay eventos disponibles en este momento</p>
            <p className="text-gray-500 text-sm">Vuelve más tarde para ver nuevas actividades</p>
          </div>
        )}
      </div>

      {/* Eventos Completados */}
      {completedEvents.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Eventos Completados</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {completedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={() => {}}
                onQuickRegister={() => {}}
                isRegistered={false}
                isQuickRegistering={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
