"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Heart, 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Calendar,
  User,
  DollarSign,
  Package,
  Edit
} from "lucide-react"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Donation {
  id: string
  amount: number
  description: string | null
  isAnonymous: boolean
  status: 'PENDIENTE' | 'CONFIRMADA' | 'RECHAZADA'
  donorName: string | null
  donorEmail: string | null
  createdAt: string
  updatedAt: string
  section: {
    id: string
    name: string
    description: string | null
  }
  user: {
    id: string
    name: string
    email: string
  }
}

interface DonationStats {
  total: number
  pending: number
  confirmed: number
  rejected: number
  totalAmount: number
}

export default function DonacionesPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([])
  const [stats, setStats] = useState<DonationStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0,
    totalAmount: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDIENTE' | 'CONFIRMADA' | 'RECHAZADA'>('ALL')
  const [sectionFilter, setSectionFilter] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<'createdAt' | 'amount' | 'status' | 'donorName'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const donationsPerPage = 10
  
  // Estados para el modal de confirmación
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [donationToUpdate, setDonationToUpdate] = useState<Donation | null>(null)
  const [newStatus, setNewStatus] = useState<'CONFIRMADA' | 'RECHAZADA' | null>(null)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  
  const { toast } = useToast()

  useEffect(() => {
    fetchDonations()
  }, [])

  // Efecto para filtrar y ordenar donaciones
  useEffect(() => {
    let filtered = [...donations]

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(donation => 
        donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.donorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.section.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]

      if (sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sortBy === 'donorName') {
        aValue = a.donorName || ''
        bValue = b.donorName || ''
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredDonations(filtered)
    setCurrentPage(1) // Reset a la primera página cuando cambian los filtros
  }, [donations, searchTerm, statusFilter, sectionFilter, sortBy, sortOrder])

  const fetchDonations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/donations')
      if (response.ok) {
        const data = await response.json()
        setDonations(data)
        
        // Calcular estadísticas
        const stats = {
          total: data.length,
          pending: data.filter((d: Donation) => d.status === 'PENDIENTE').length,
          confirmed: data.filter((d: Donation) => d.status === 'CONFIRMADA').length,
          rejected: data.filter((d: Donation) => d.status === 'RECHAZADA').length,
          totalAmount: data.reduce((sum: number, d: Donation) => sum + d.amount, 0)
        }
        setStats(stats)
      }
    } catch (error) {
      console.error('Error fetching donations:', error)
      toast({
        title: "❌ Error al cargar donaciones",
        description: "No se pudieron cargar las donaciones",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateDonationStatus = async (donationId: string, newStatus: 'CONFIRMADA' | 'RECHAZADA') => {
    try {
      setUpdating(donationId)
      const response = await fetch(`/api/donations/${donationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Actualizar la lista local
        setDonations(prev => prev.map(donation => 
          donation.id === donationId ? { ...donation, status: newStatus } : donation
        ))
        
        // Mostrar toast de éxito
        const donation = donations.find(d => d.id === donationId)
        if (donation) {
          toast({
            title: "✅ Estado actualizado exitosamente",
            description: `La donación de ${donation.donorName} ha sido ${newStatus === 'CONFIRMADA' ? 'confirmada' : 'rechazada'}`,
            variant: "success",
          })
        }
      } else {
        const errorData = await response.json()
        console.error('Error updating donation status:', errorData.error)
        toast({
          title: "❌ Error al actualizar estado",
          description: errorData.error || 'Error desconocido',
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
    } finally {
      setUpdating(null)
      setShowConfirmDialog(false)
      setDonationToUpdate(null)
      setNewStatus(null)
    }
  }

  const toggleDonationStatus = (donation: Donation) => {
    const newStatus = donation.status === 'PENDIENTE' ? 'CONFIRMADA' : 
                     donation.status === 'CONFIRMADA' ? 'RECHAZADA' : 'CONFIRMADA'
    setDonationToUpdate(donation)
    setNewStatus(newStatus)
    setShowConfirmDialog(true)
  }

  const confirmStatusChange = () => {
    if (donationToUpdate && newStatus) {
      updateDonationStatus(donationToUpdate.id, newStatus)
    }
  }

  const cancelStatusChange = () => {
    setShowConfirmDialog(false)
    setDonationToUpdate(null)
    setNewStatus(null)
  }

  const showDonationDetails = (donation: Donation) => {
    setSelectedDonation(donation)
    setShowDetailsDialog(true)
  }

  const handleEditDonation = (donation: Donation) => {
    setEditingDonation(donation)
    setShowEditDialog(true)
  }

  const handleEditCancel = () => {
    setEditingDonation(null)
    setShowEditDialog(false)
  }

  const handleEditSave = async (updatedData: Partial<Donation>) => {
    if (!editingDonation) return

    try {
      const response = await fetch(`/api/donations/${editingDonation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        setDonations(prev => prev.map(d => 
          d.id === editingDonation.id ? { ...d, ...updatedData } : d
        ))
        toast({
          title: "✅ Donación actualizada",
          description: "Los datos de la donación se han actualizado correctamente",
          variant: "default",
        })
        handleEditCancel()
      } else {
        toast({
          title: "❌ Error al actualizar",
          description: "No se pudo actualizar la donación",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating donation:', error)
      toast({
        title: "❌ Error de conexión",
        description: "No se pudo actualizar la donación. Verifica tu conexión.",
        variant: "destructive",
      })
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
      ['Donante', 'Email', 'Monto', 'Descripción', 'Sección', 'Estado', 'Fecha'],
      ...filteredDonations.map(donation => [
        donation.isAnonymous ? 'Anónimo' : donation.donorName || 'N/A',
        donation.isAnonymous ? 'N/A' : donation.donorEmail || 'N/A',
        donation.amount.toString(),
        donation.description || 'N/A',
        donation.section.name,
        donation.status,
        new Date(donation.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `donaciones_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Obtener secciones únicas para el filtro
  const sections = Array.from(new Set(donations.map(d => d.section.id)))
    .map(id => donations.find(d => d.section.id === id)?.section)
    .filter(Boolean)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMADA':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'RECHAZADA':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'PENDIENTE':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'CONFIRMADA':
        return 'default'
      case 'RECHAZADA':
        return 'destructive'
      case 'PENDIENTE':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Donaciones</h2>
          <p className="text-muted-foreground">Cargando donaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Donaciones</h2>
        <p className="text-muted-foreground">
          Revisa, aprueba y gestiona todas las donaciones del sistema
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donaciones</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de búsqueda y filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Donaciones Recibidas</CardTitle>
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
                placeholder="Buscar por donante, email, descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: 'ALL' | 'PENDIENTE' | 'CONFIRMADA' | 'RECHAZADA') => setStatusFilter(value)}>
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
                  <SelectItem key={section?.id} value={section?.id || ''}>
                    {section?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-') as [typeof sortBy, typeof sortOrder]
              setSortBy(field)
              setSortOrder(order)
            }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Más recientes</SelectItem>
                <SelectItem value="createdAt-asc">Más antiguos</SelectItem>
                <SelectItem value="amount-desc">Mayor monto</SelectItem>
                <SelectItem value="amount-asc">Menor monto</SelectItem>
                <SelectItem value="donorName-asc">Donante (A-Z)</SelectItem>
                <SelectItem value="donorName-desc">Donante (Z-A)</SelectItem>
                <SelectItem value="status-asc">Estado (A-Z)</SelectItem>
                <SelectItem value="status-desc">Estado (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {currentDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {donation.isAnonymous ? 'Donante Anónimo' : donation.donorName || 'Sin nombre'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {donation.isAnonymous ? 'Email oculto' : donation.donorEmail || 'Sin email'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        <span>{donation.section.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(donation.createdAt), 'dd/MM/yyyy', { locale: es })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>${donation.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant={getStatusBadgeVariant(donation.status)}>
                    {getStatusIcon(donation.status)}
                    <span className="ml-1">{donation.status}</span>
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showDonationDetails(donation)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditDonation(donation)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    
                    {donation.status === 'PENDIENTE' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => toggleDonationStatus(donation)}
                        disabled={updating === donation.id}
                      >
                        {updating === donation.id ? (
                          <>
                            <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprobar
                          </>
                        )}
                      </Button>
                    )}
                    
                    {donation.status === 'CONFIRMADA' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => toggleDonationStatus(donation)}
                        disabled={updating === donation.id}
                      >
                        {updating === donation.id ? (
                          <>
                            <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Rechazar
                          </>
                        )}
                      </Button>
                    )}
                    
                    {donation.status === 'RECHAZADA' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => toggleDonationStatus(donation)}
                        disabled={updating === donation.id}
                      >
                        {updating === donation.id ? (
                          <>
                            <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprobar
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
                
                {/* Números de página */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }
                    
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
                </div>
                
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

          {/* Mensaje cuando no hay resultados */}
          {filteredDonations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron donaciones con los filtros aplicados</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('ALL')
                  setSectionFilter('ALL')
                }}
                className="mt-2"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de confirmación para cambio de estado */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cambio de estado</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres {newStatus === 'CONFIRMADA' ? 'confirmar' : 'rechazar'} la donación de{' '}
              <strong>{donationToUpdate?.donorName || 'Donante Anónimo'}</strong>?
              <br />
              <br />
              <strong>Monto:</strong> ${donationToUpdate?.amount.toLocaleString()}
              <br />
              <strong>Sección:</strong> {donationToUpdate?.section.name}
              {donationToUpdate?.description && (
                <>
                  <br />
                  <strong>Descripción:</strong> {donationToUpdate.description}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelStatusChange}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStatusChange}
              className={newStatus === 'RECHAZADA' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {newStatus === 'CONFIRMADA' ? 'Confirmar' : 'Rechazar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de detalles de donación */}
      <AlertDialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Detalles de la Donación</AlertDialogTitle>
          </AlertDialogHeader>
          {selectedDonation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Donante</h4>
                  <p className="text-lg">{selectedDonation.isAnonymous ? 'Donante Anónimo' : selectedDonation.donorName || 'Sin nombre'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Email</h4>
                  <p className="text-lg">{selectedDonation.isAnonymous ? 'Oculto' : selectedDonation.donorEmail || 'Sin email'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Monto</h4>
                  <p className="text-lg font-bold text-green-600">${selectedDonation.amount.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Estado</h4>
                  <Badge variant={getStatusBadgeVariant(selectedDonation.status)}>
                    {getStatusIcon(selectedDonation.status)}
                    <span className="ml-1">{selectedDonation.status}</span>
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Sección</h4>
                  <p className="text-lg">{selectedDonation.section.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Fecha</h4>
                  <p className="text-lg">{format(new Date(selectedDonation.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}</p>
                </div>
              </div>
              
              {selectedDonation.description && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Descripción</h4>
                  <p className="text-lg bg-gray-50 p-3 rounded-lg">{selectedDonation.description}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-sm text-gray-600">Información de la Sección</h4>
                <p className="text-lg">{selectedDonation.section.description || 'Sin descripción'}</p>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDetailsDialog(false)}>
              Cerrar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de edición de donación */}
      <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Donación</AlertDialogTitle>
          </AlertDialogHeader>
          {editingDonation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="donorName">Nombre del Donante</Label>
                  <Input
                    id="donorName"
                    defaultValue={editingDonation.donorName || ''}
                    onChange={(e) => {
                      setEditingDonation(prev => prev ? { ...prev, donorName: e.target.value } : null)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="donorEmail">Email del Donante</Label>
                  <Input
                    id="donorEmail"
                    defaultValue={editingDonation.donorEmail || ''}
                    onChange={(e) => {
                      setEditingDonation(prev => prev ? { ...prev, donorEmail: e.target.value } : null)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Monto</Label>
                  <Input
                    id="amount"
                    type="number"
                    defaultValue={editingDonation.amount}
                    onChange={(e) => {
                      setEditingDonation(prev => prev ? { ...prev, amount: parseFloat(e.target.value) || 0 } : null)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    defaultValue={editingDonation.status}
                    onValueChange={(value: 'PENDIENTE' | 'CONFIRMADA' | 'RECHAZADA') => {
                      setEditingDonation(prev => prev ? { ...prev, status: value } : null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                      <SelectItem value="CONFIRMADA">Confirmada</SelectItem>
                      <SelectItem value="RECHAZADA">Rechazada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  defaultValue={editingDonation.description || ''}
                  onChange={(e) => {
                    setEditingDonation(prev => prev ? { ...prev, description: e.target.value } : null)
                  }}
                />
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleEditCancel}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (editingDonation) {
                  handleEditSave({
                    donorName: editingDonation.donorName,
                    donorEmail: editingDonation.donorEmail,
                    amount: editingDonation.amount,
                    status: editingDonation.status,
                    description: editingDonation.description
                  })
                }
              }}
            >
              Guardar Cambios
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
