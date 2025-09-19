"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, Calendar } from "lucide-react"
import { useState, useEffect } from "react"

interface Participant {
  user: {
    id: string
    name: string
    email: string
  }
}

interface ParticipantsModalProps {
  isOpen: boolean
  onClose: () => void
  activityId: string
  activityTitle: string
}

export function ParticipantsModal({ isOpen, onClose, activityId, activityTitle }: ParticipantsModalProps) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && activityId) {
      fetchParticipants()
    }
  }, [isOpen, activityId])

  const fetchParticipants = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/activities/${activityId}/participants`)
      if (response.ok) {
        const data = await response.json()
        setParticipants(data)
      } else {
        console.error('Error fetching participants')
      }
    } catch (error) {
      console.error('Error fetching participants:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participantes de: {activityTitle}
          </DialogTitle>
          <DialogDescription>
            Lista de alumnos inscritos en esta actividad
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando participantes...</p>
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay participantes inscritos</p>
              <p className="text-sm text-muted-foreground mt-2">
                Los alumnos pueden inscribirse desde su dashboard
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="text-sm">
                  {participants.length} participante{participants.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              {participants.map((participant, index) => (
                <div 
                  key={participant.user.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {participant.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {participant.user.name}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Mail className="h-3 w-3" />
                        {participant.user.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
