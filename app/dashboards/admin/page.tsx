"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Bell, Heart, Users, RefreshCw, UserCheck, UserX, Home } from "lucide-react"
import { useAdminStats } from "@/lib/hooks/use-admin-stats"
import { useEffect, useState } from "react"
import Link from "next/link"

interface RecentActivity {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  maxParticipants: number | null
  isActive: boolean
  participantCount: number
  createdAt: string
}

interface RecentDonation {
  id: string
  amount: number
  description: string | null
  isAnonymous: boolean
  status: string
  donorName: string
  donorEmail: string | null
  sectionName: string
  createdAt: string
}

export default function AdminDashboard() {
  const { stats, isLoading, error, refetch } = useAdminStats()
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([])
  const [loadingActivities, setLoadingActivities] = useState(true)
  const [loadingDonations, setLoadingDonations] = useState(true)

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const response = await fetch('/api/admin/recent-activities?limit=5')
        if (response.ok) {
          const data = await response.json()
          setRecentActivities(data)
        }
      } catch (error) {
        console.error('Error fetching recent activities:', error)
      } finally {
        setLoadingActivities(false)
      }
    }

    const fetchRecentDonations = async () => {
      try {
        const response = await fetch('/api/admin/recent-donations?limit=5')
        if (response.ok) {
          const data = await response.json()
          setRecentDonations(data)
        }
      } catch (error) {
        console.error('Error fetching recent donations:', error)
      } finally {
        setLoadingDonations(false)
      }
    }

    fetchRecentActivities()
    fetchRecentDonations()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Cargando estadísticas del panel de administración...
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-red-600">
            Error al cargar estadísticas: {error}
          </p>
        </div>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Bienvenido al panel de administración de Caridad UNSTA
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboards/usuario">
              <Home className="mr-2 h-4 w-4" />
              Página Principal
            </Link>
          </Button>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Actividades Activas
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeActivities || 0}</div>
            <p className="text-xs text-muted-foreground">
              Actividades disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Totales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalAdmins || 0} admins, {stats?.totalStudents || 0} alumnos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donaciones
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDonations || 0}</div>
            <p className="text-xs text-muted-foreground">
              Todas las donaciones recibidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendientes
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingDonations || 0}</div>
            <p className="text-xs text-muted-foreground">
              Donaciones por confirmar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actividades recientes */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividades Recientes</CardTitle>
            <CardDescription>
              Últimas actividades creadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingActivities ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(activity.createdAt)} • {activity.participantCount} participantes
                    </p>
                  </div>
                  <Badge variant={activity.isActive ? "default" : "secondary"}>
                    {activity.isActive ? "Activa" : "Finalizada"}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No hay actividades recientes
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donaciones Recientes</CardTitle>
            <CardDescription>
              Últimas donaciones recibidas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingDonations ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentDonations.length > 0 ? (
              recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {donation.amount > 0 ? `${formatCurrency(donation.amount)} - ` : ''}{donation.sectionName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {donation.donorName} • {formatDate(donation.createdAt)}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      donation.status === 'CONFIRMADA' ? 'default' : 
                      donation.status === 'PENDIENTE' ? 'secondary' : 'destructive'
                    }
                  >
                    {donation.status === 'CONFIRMADA' ? 'Confirmada' : 
                     donation.status === 'PENDIENTE' ? 'Pendiente' : 'Rechazada'}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No hay donaciones recientes
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas adicionales */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Donaciones Confirmadas
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.confirmedDonations || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total procesadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Notificaciones Activas
            </CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.totalNotifications || 0}</div>
            <p className="text-xs text-muted-foreground">
              Mensajes del sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Administradores
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.totalAdmins || 0}</div>
            <p className="text-xs text-muted-foreground">
              Con acceso completo
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
