"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { 
  Shirt, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Home,
  Calendar,
  User,
  DollarSign,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

interface Donation {
  id: string
  amount: number
  description?: string
  isAnonymous: boolean
  status: 'PENDIENTE' | 'CONFIRMADA' | 'RECHAZADA'
  createdAt: string
  updatedAt: string
  donorName: string
  donorEmail?: string
  section: {
    id: string
    name: string
    description?: string
  }
  user: {
    id: string
    name: string
    email: string
  }
}

interface DonationSection {
  id: string
  name: string
  description?: string
}

export default function VestimentaDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([])
  const [sections, setSections] = useState<DonationSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  // Estados para el modal de confirmación
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [donationToDelete, setDonationToDelete] = useState<Donation | null>(null)
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDIENTE' | 'CONFIRMADA' | 'RECHAZADA'>('ALL')
  const [sectionFilter, setSectionFilter] = useState<string>('ALL')
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const donationsPerPage = 10

  const { toast } = useToast()

  useEffect(() => {
    fetchDonations()
    fetchSections()
  }, [])

  // Efecto para filtrar donaciones
  useEffect(() => {
    let filtered = [...donations]

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(donation => 
        donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.donorEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por estado
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(donation => donation.status === statusFilter)
    }

    // Filtro por sección
    if (sectionFilter !== 'ALL') {
      filtered = filtered.filter(donation => donation.section.id === sectionFilter)
    }

    setFilteredDonations(filtered)
    setCurrentPage(1)
  }, [donations, searchTerm, statusFilter, sectionFilter])

  const fetchDonations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/donations')
      
      if (response.ok) {
        const data = await response.json()
        setDonations(data)
      } else {
        toast({
          title: "❌ Error al cargar donaciones",
          description: "No se pudieron cargar las donaciones de vestimenta",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching donations:', error)
      toast({
        title: "❌ Error de conexión",
        description: "No se pudieron cargar las donaciones. Verifica tu conexión.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/donations/sections')
      
      if (response.ok) {
        const data = await response.json()
        setSections(data)
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const handleDeleteDonation = (donation: Donation) => {
    setDonationToDelete(donation)
    setShowDeleteDialog(true)
  }

  const confirmDeleteDonation = async () => {
    if (!donationToDelete) return

    try {
      setDeleting(donationToDelete.id)
      const response = await fetch(`/api/donations/${donationToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setDonations(prev => prev.filter(d => d.id !== donationToDelete.id))
        toast({
          title: "✅ Donación eliminada",
          description: "La donación ha sido eliminada exitosamente",
          variant: "success",
        })
      } else {
        toast({
          title: "❌ Error al eliminar",
          description: "No se pudo eliminar la donación",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting donation:', error)
      toast({
        title: "❌ Error de conexión",
        description: "No se pudo eliminar la donación. Verifica tu conexión.",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
      setShowDeleteDialog(false)
      setDonationToDelete(null)
    }
  }

  const updateDonationStatus = async (donationId: string, newStatus: 'PENDIENTE' | 'CONFIRMADA' | 'RECHAZADA') => {
    try {
      const response = await fetch(`/api/donations/${donationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setDonations(prev => prev.map(d => 
          d.id === donationId ? { ...d, status: newStatus } : d
        ))
        toast({
          title: "✅ Estado actualizado",
          description: `El estado de la donación se actualizó a ${newStatus.toLowerCase()}`,
          variant: "success",
        })
      } else {
        toast({
          title: "❌ Error al actualizar",
          description: "No se pudo actualizar el estado de la donación",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating donation status:', error)
      toast({
        title: "❌ Error de conexión",
        description: "No se pudo actualizar el estado. Verifica tu conexión.",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMADA':
        return 'default'
      case 'PENDIENTE':
        return 'secondary'
      case 'RECHAZADA':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMADA':
        return 'Confirmada'
      case 'PENDIENTE':
        return 'Pendiente'
      case 'RECHAZADA':
        return 'Rechazada'
      default:
        return status
    }
  }

  // Funciones de paginación
  const totalPages = Math.ceil(filteredDonations.length / donationsPerPage)
  const startIndex = (currentPage - 1) * donationsPerPage
  const endIndex = startIndex + donationsPerPage
  const currentDonations = filteredDonations.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // Función de exportación
  const exportDonations = () => {
    const csvContent = [
      ['Donante', 'Email', 'Monto', 'Descripción', 'Estado', 'Fecha', 'Sección'],
      ...filteredDonations.map(donation => [
        donation.donorName,
        donation.donorEmail || '',
        donation.amount.toString(),
        donation.description || '',
        getStatusText(donation.status),
        formatDate(donation.createdAt),
        donation.section.name
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `donaciones_vestimenta_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Donaciones de Vestimenta</h2>
          <p className="text-muted-foreground">
            Cargando donaciones...
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Donaciones de Vestimenta</h2>
          <p className="text-muted-foreground">
            Gestiona las donaciones de ropa y vestimenta
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboards/usuario">
              <Home className="h-4 w-4 mr-2" />
              Página Principal
            </Link>
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Donación
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donaciones</CardTitle>
            <Shirt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
            <p className="text-xs text-muted-foreground">
              Donaciones registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {donations.filter(d => d.status === 'PENDIENTE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Por confirmar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {donations.filter(d => d.status === 'CONFIRMADA').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Procesadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {donations.filter(d => d.status === 'RECHAZADA').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Donaciones rechazadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controles de búsqueda y filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Donaciones Registradas</CardTitle>
              <CardDescription>
                {filteredDonations.length} de {donations.length} donaciones mostradas
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={exportDonations} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por donante, email o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los estados</SelectItem>
                <SelectItem value="PENDIENTE">Pendientes</SelectItem>
                <SelectItem value="CONFIRMADA">Confirmadas</SelectItem>
                <SelectItem value="RECHAZADA">Rechazadas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por sección" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas las secciones</SelectItem>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lista de donaciones */}
          <div className="space-y-4">
            {currentDonations.length > 0 ? (
              currentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{donation.donorName}</h3>
                      <Badge variant={getStatusColor(donation.status)}>
                        {getStatusText(donation.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {donation.amount > 0 && <p><strong>Monto:</strong> {formatCurrency(donation.amount)}</p>}
                      <p><strong>Email:</strong> {donation.donorEmail || 'No especificado'}</p>
                      <p><strong>Sección:</strong> {donation.section.name}</p>
                      <p><strong>Fecha:</strong> {formatDate(donation.createdAt)}</p>
                      {donation.description && (
                        <p><strong>Descripción:</strong> {donation.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select
                      value={donation.status}
                      onValueChange={(value: any) => updateDonationStatus(donation.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                        <SelectItem value="CONFIRMADA">Confirmada</SelectItem>
                        <SelectItem value="RECHAZADA">Rechazada</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDonation(donation)}
                      disabled={deleting === donation.id}
                    >
                      {deleting === donation.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Shirt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay donaciones</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'ALL' || sectionFilter !== 'ALL'
                    ? 'No se encontraron donaciones con los filtros aplicados.'
                    : 'Aún no hay donaciones de vestimenta registradas.'}
                </p>
              </div>
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredDonations.length)} de {filteredDonations.length} donaciones
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNumber)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNumber}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de confirmación para eliminar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar la donación de{' '}
              <strong>{donationToDelete?.donorName}</strong>
              {donationToDelete && donationToDelete.amount > 0 && (
                <> por <strong>{formatCurrency(donationToDelete.amount)}</strong></>
              )}?
              <br />
              <br />
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDonation}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}