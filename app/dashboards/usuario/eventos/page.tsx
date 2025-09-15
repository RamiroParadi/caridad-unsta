"use client"

import { useState } from "react"
import { EventCards } from "@/components/event-cards"
import { QuickRegistrationForm } from "@/components/quick-registration-form"
import { ParticipantList } from "@/components/participant-list"
import { SuccessNotification } from "@/components/success-notification"

type ViewMode = 'events' | 'registration' | 'participants'

export default function EventosPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('events')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [selectedEventTitle, setSelectedEventTitle] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleEventRegister = (eventId: string) => {
    // En un caso real, aquí obtendrías el título del evento desde la base de datos
    const eventTitles: { [key: string]: string } = {
      "1": "Recolección de Alimentos",
      "2": "Tutorías Gratuitas", 
      "3": "Limpieza de Espacios Verdes",
      "4": "Compañía a Adultos Mayores"
    }
    
    setSelectedEventId(eventId)
    setSelectedEventTitle(eventTitles[eventId] || "Evento")
    setCurrentView('registration')
  }

  const handleQuickRegister = (eventId: string) => {
    // En un caso real, aquí obtendrías el título del evento desde la base de datos
    const eventTitles: { [key: string]: string } = {
      "1": "Recolección de Alimentos",
      "2": "Tutorías Gratuitas", 
      "3": "Limpieza de Espacios Verdes",
      "4": "Compañía a Adultos Mayores"
    }
    
    const eventTitle = eventTitles[eventId] || "Evento"
    setSuccessMessage(`¡Te has inscrito exitosamente a "${eventTitle}"!`)
  }

  const handleBackToEvents = () => {
    setCurrentView('events')
    setSelectedEventId(null)
    setSelectedEventTitle("")
  }

  const handleRegistrationSuccess = () => {
    setCurrentView('events')
    setSelectedEventId(null)
    setSelectedEventTitle("")
  }

  const handleViewParticipants = (eventId: string) => {
    const eventTitles: { [key: string]: string } = {
      "1": "Recolección de Alimentos",
      "2": "Tutorías Gratuitas",
      "3": "Limpieza de Espacios Verdes", 
      "4": "Compañía a Adultos Mayores"
    }
    
    setSelectedEventId(eventId)
    setSelectedEventTitle(eventTitles[eventId] || "Evento")
    setCurrentView('participants')
  }

  if (currentView === 'registration' && selectedEventId && selectedEventTitle) {
    return (
      <div className="space-y-6">
        <div className="max-w-2xl mx-auto">
          <QuickRegistrationForm
            eventId={selectedEventId}
            eventTitle={selectedEventTitle}
            onBack={handleBackToEvents}
            onSuccess={handleRegistrationSuccess}
          />
        </div>
      </div>
    )
  }

  if (currentView === 'participants' && selectedEventId && selectedEventTitle) {
    return (
      <div className="space-y-6">
        <ParticipantList
          eventId={selectedEventId}
          eventTitle={selectedEventTitle}
          onBack={handleBackToEvents}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Eventos de Caridad</h2>
        <p className="text-blue-200">Participa en actividades solidarias organizadas por la universidad</p>
      </div>

      <EventCards onEventRegister={handleEventRegister} onQuickRegister={handleQuickRegister} />

      {/* Información adicional */}
      <div className="bg-blue-800 rounded-lg p-6 text-white max-w-4xl mx-auto">
        <h3 className="text-xl font-bold mb-4">¿Cómo funciona el sistema de eventos?</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Inscripción Simplificada:</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Usamos tu información de perfil automáticamente</li>
              <li>• Solo necesitas completar datos adicionales</li>
              <li>• Proceso rápido y sencillo</li>
              <li>• Confirmación inmediata por email</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Beneficios:</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Experiencia de voluntariado</li>
              <li>• Conocimiento de causas sociales</li>
              <li>• Networking con otros voluntarios</li>
              <li>• Certificado de participación</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Notificación de éxito */}
      {successMessage && (
        <SuccessNotification
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  )
}