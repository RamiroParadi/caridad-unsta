"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Mail, Phone, Calendar, ArrowLeft } from "lucide-react"

// Mock data de participantes
const mockParticipants = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+54 9 11 1234-5678",
    registrationDate: "2024-01-15",
    status: "CONFIRMADO" as const,
    experience: "Participé en 3 eventos similares",
    motivation: "Quiero ayudar a mi comunidad"
  },
  {
    id: "2", 
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    phone: "+54 9 11 2345-6789",
    registrationDate: "2024-01-16",
    status: "CONFIRMADO" as const,
    experience: "Primera vez participando",
    motivation: "Me interesa contribuir con causas sociales"
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana.martinez@email.com", 
    phone: "+54 9 11 3456-7890",
    registrationDate: "2024-01-17",
    status: "PENDIENTE" as const,
    experience: "Voluntaria en ONG local",
    motivation: "Creo en el poder de la solidaridad"
  },
  {
    id: "4",
    name: "Luis Fernández",
    email: "luis.fernandez@email.com",
    phone: "+54 9 11 4567-8901", 
    registrationDate: "2024-01-18",
    status: "CONFIRMADO" as const,
    experience: "Estudiante de trabajo social",
    motivation: "Quiero aplicar mis conocimientos"
  },
  {
    id: "5",
    name: "Sofia López",
    email: "sofia.lopez@email.com",
    phone: "+54 9 11 5678-9012",
    registrationDate: "2024-01-19", 
    status: "CANCELADO" as const,
    experience: "Experiencia en eventos comunitarios",
    motivation: "Me comprometí con otra actividad"
  }
]

interface ParticipantCardProps {
  participant: typeof mockParticipants[0]
}

function ParticipantCard({ participant }: ParticipantCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMADO': return 'bg-green-100 text-green-800'
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800'
      case 'CANCELADO': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className={`transition-all duration-200 ${participant.status === 'CANCELADO' ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-gray-900">{participant.name}</h4>
            <p className="text-sm text-gray-500">Inscrito el {formatDate(participant.registrationDate)}</p>
          </div>
          <Badge className={getStatusColor(participant.status)}>
            {participant.status}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{participant.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{participant.phone}</span>
          </div>
        </div>

        {participant.experience && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-gray-700">
              <strong>Experiencia:</strong> {participant.experience}
            </p>
          </div>
        )}

        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-gray-700">
            <strong>Motivación:</strong> {participant.motivation}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface ParticipantListProps {
  eventId: string
  eventTitle: string
  onBack: () => void
}

export function ParticipantList({ eventId, eventTitle, onBack }: ParticipantListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("TODOS")

  const filteredParticipants = mockParticipants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "TODOS" || participant.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const confirmedCount = mockParticipants.filter(p => p.status === 'CONFIRMADO').length
  const pendingCount = mockParticipants.filter(p => p.status === 'PENDIENTE').length
  const cancelledCount = mockParticipants.filter(p => p.status === 'CANCELADO').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="p-0 h-auto text-blue-600 hover:text-blue-800 mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Eventos
          </Button>
          <h2 className="text-2xl font-bold text-white">Participantes del Evento</h2>
          <p className="text-blue-200">{eventTitle}</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-800">{confirmedCount}</div>
            <div className="text-sm text-green-600">Confirmados</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-800">{pendingCount}</div>
            <div className="text-sm text-yellow-600">Pendientes</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-800">{cancelledCount}</div>
            <div className="text-sm text-red-600">Cancelados</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "TODOS" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("TODOS")}
              >
                Todos ({mockParticipants.length})
              </Button>
              <Button
                variant={statusFilter === "CONFIRMADO" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("CONFIRMADO")}
                className="bg-green-600 hover:bg-green-700"
              >
                Confirmados ({confirmedCount})
              </Button>
              <Button
                variant={statusFilter === "PENDIENTE" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("PENDIENTE")}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Pendientes ({pendingCount})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Participantes */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-white" />
          <h3 className="text-lg font-semibold text-white">
            Lista de Participantes ({filteredParticipants.length})
          </h3>
        </div>

        {filteredParticipants.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredParticipants.map((participant) => (
              <ParticipantCard key={participant.id} participant={participant} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No se encontraron participantes</p>
              <p className="text-gray-400 text-sm">Intenta ajustar los filtros de búsqueda</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
