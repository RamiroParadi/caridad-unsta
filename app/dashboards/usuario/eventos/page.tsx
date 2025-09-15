"use client"

import { useState } from "react"
import { EventCards } from "@/components/event-cards"
import { QuickRegistrationForm } from "@/components/quick-registration-form"
import { ParticipantList } from "@/components/participant-list"
import { SuccessNotification } from "@/components/success-notification"
import { Calendar, Users, Clock, Award } from "lucide-react"

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
    <div className="space-y-8">
      {/* Header mejorado */}
      <div className="text-center text-white">
        <div className="flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 text-purple-400 mr-3" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Eventos de Caridad
          </h2>
          <Calendar className="h-8 w-8 text-purple-400 ml-3" />
        </div>
        <p className="text-blue-200 text-lg">Participa en actividades solidarias organizadas por la universidad</p>
      </div>

      <EventCards onEventRegister={handleEventRegister} onQuickRegister={handleQuickRegister} />

      {/* Información adicional mejorada */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-900 rounded-xl p-8 text-white shadow-xl max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">¿Cómo funciona el sistema de eventos?</h3>
          <p className="text-purple-200">Proceso simple y beneficioso para todos</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-purple-700 rounded-full p-2 mt-1">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-lg">Inscripción Simplificada:</h4>
                <ul className="text-sm text-purple-200 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    Usamos tu información de perfil automáticamente
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    Solo necesitas completar datos adicionales
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    Proceso rápido y sencillo
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    Confirmación inmediata por email
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-purple-700 rounded-full p-2 mt-1">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-lg">Beneficios:</h4>
                <ul className="text-sm text-purple-200 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    Experiencia de voluntariado valiosa
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    Conocimiento de causas sociales
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    Networking con otros voluntarios
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    Certificado de participación
                  </li>
                </ul>
              </div>
            </div>
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