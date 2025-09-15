"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift, Plus, Filter, Heart, GraduationCap, TreePine, Eye, Phone, MapPin, Settings, X, Save, Cake, Star, Flower, Book } from "lucide-react"

interface Donation {
  id: string
  amount: number
  description: string
  status: string
  createdAt: string
  donorName: string
  donorEmail: string
  isAnonymous: boolean
  section: {
    id: string
    name: string
  }
}

interface FestiveDateStatus {
  id: string
  name: string
  isEnabled: boolean
  startDate: string
  endDate: string
  description: string
  icon?: string
  gradient?: string
  bgGradient?: string
  items?: string[]
}

export default function FestivasDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [sections, setSections] = useState<{id: string, name: string, description: string}[]>([])
  const [festiveDatesStatus, setFestiveDatesStatus] = useState<FestiveDateStatus[]>([])
  const [editingDate, setEditingDate] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<FestiveDateStatus>>({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    icon: 'heart',
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50',
    items: ['Elementos varios']
  })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchSections()
    fetchFestiveDatesStatus()
  }, [])

  useEffect(() => {
    if (sections.length > 0) {
      fetchDonations()
    }
  }, [sections, selectedSection])

  const fetchSections = useCallback(async () => {
    try {
      const response = await fetch('/api/donations/sections')
      if (response.ok) {
        const data = await response.json()
        console.log('Secciones cargadas:', data)
        
        // Filtrar solo las secciones festivas específicas
        const festiveSections = data.filter((section: {id: string, name: string, description: string}) => {
          const name = section.name.toLowerCase()
          const sectionId = section.id
          
          // Verificar si es una fecha festiva personalizada por ID o nombre
          const isCustomFestiveDate = festiveDatesStatus.some((festiveDate: FestiveDateStatus) => 
            festiveDate.id === sectionId || festiveDate.name.toLowerCase() === name
          )
          
          return (
            name === 'día del niño' ||
            name === 'comienzo de clases' ||
            name === 'navidad' ||
            name.includes('festivas') ||
            isCustomFestiveDate
          )
        })
        
        setSections(festiveSections)
        
        // Si hay secciones festivas, seleccionar la primera por defecto
        if (festiveSections.length > 0) {
          setSelectedSection(festiveSections[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }, [festiveDatesStatus])

  const fetchFestiveDatesStatus = async () => {
    try {
      const response = await fetch('/api/admin/festive-dates')
      if (response.ok) {
        const data = await response.json()
        console.log('Estado de fechas festivas cargado:', data)
        setFestiveDatesStatus(Object.values(data))
      }
    } catch (error) {
      console.error('Error fetching festive dates status:', error)
    }
  }

  const updateFestiveDateStatus = async (id: string, updates: Partial<FestiveDateStatus>) => {
    try {
      const response = await fetch('/api/admin/festive-dates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      })

      if (response.ok) {
        const updatedDate = await response.json()
        setFestiveDatesStatus(prev => 
          prev.map(date => date.id === id ? updatedDate : date)
        )
        console.log(`Fecha festiva ${id} actualizada:`, updatedDate)
      }
    } catch (error) {
      console.error('Error updating festive date status:', error)
    }
  }

  const toggleFestiveDate = async (id: string, isEnabled: boolean) => {
    await updateFestiveDateStatus(id, { isEnabled })
  }

  const startEditing = (date: FestiveDateStatus) => {
    setEditingDate(date.id)
    setEditForm({
      startDate: date.startDate,
      endDate: date.endDate
    })
  }

  const saveEdit = async () => {
    if (editingDate && editForm.startDate && editForm.endDate) {
      await updateFestiveDateStatus(editingDate, {
        startDate: editForm.startDate,
        endDate: editForm.endDate
      })
      setEditingDate(null)
      setEditForm({})
    }
  }

  const cancelEdit = () => {
    setEditingDate(null)
    setEditForm({})
  }

  const createFestiveDate = async () => {
    if (!createForm.name || !createForm.description || !createForm.startDate || !createForm.endDate) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/admin/festive-dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      })

      if (response.ok) {
        const newDate = await response.json()
        setFestiveDatesStatus(prev => [...prev, newDate])
        setShowCreateForm(false)
        setCreateForm({
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          icon: 'heart',
          gradient: 'from-purple-500 to-pink-600',
          bgGradient: 'from-purple-50 to-pink-50',
          items: ['Elementos varios']
        })
        console.log('Nueva fecha festiva creada:', newDate)
      } else {
        const error = await response.json()
        alert(error.error || 'Error al crear la fecha festiva')
      }
    } catch (error) {
      console.error('Error creating festive date:', error)
      alert('Error al crear la fecha festiva')
    } finally {
      setIsCreating(false)
    }
  }

  const deleteFestiveDate = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta fecha festiva?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/festive-dates?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFestiveDatesStatus(prev => prev.filter(date => date.id !== id))
        console.log(`Fecha festiva ${id} eliminada`)
      } else {
        const error = await response.json()
        alert(error.error || 'Error al eliminar la fecha festiva')
      }
    } catch (error) {
      console.error('Error deleting festive date:', error)
      alert('Error al eliminar la fecha festiva')
    }
  }

  const fetchDonations = useCallback(async () => {
    setLoading(true)
    try {
      let url = '/api/donations'
      if (selectedSection) {
        url += `?sectionId=${selectedSection}`
      }
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        console.log('Donaciones cargadas:', data)
        console.log('Festive dates status:', festiveDatesStatus)
        console.log('Selected section:', selectedSection)
        
        // Filtrar solo las donaciones que realmente son festivas
        const festiveDonations = data.filter((donation: Donation) => {
          const sectionName = donation.section?.name?.toLowerCase() || ''
          const sectionId = donation.section?.id || ''
          
          // Verificar si es una fecha festiva personalizada por ID
          const isCustomFestiveDate = festiveDatesStatus.some((festiveDate: FestiveDateStatus) => 
            festiveDate.id === sectionId || festiveDate.name.toLowerCase() === sectionName
          )
          
          const isFestive = (
            sectionName === 'día del niño' ||
            sectionName === 'comienzo de clases' ||
            sectionName === 'navidad' ||
            sectionName.includes('festivas') ||
            isCustomFestiveDate
          )
          
          console.log(`Donation ${donation.id}: sectionName="${sectionName}", sectionId="${sectionId}", isCustomFestiveDate=${isCustomFestiveDate}, isFestive=${isFestive}`)
          
          return isFestive
        })
        
        console.log('Donaciones festivas filtradas:', festiveDonations)
        setDonations(festiveDonations)
      }
    } catch (error) {
      console.error('Error fetching donations:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedSection, festiveDatesStatus])

  const getSectionIcon = (sectionName: string) => {
    const name = sectionName.toLowerCase()
    if (name.includes('día del niño')) return Gift
    if (name.includes('comienzo de clases')) return GraduationCap
    if (name.includes('navidad')) return TreePine
    
    // Para fechas festivas personalizadas, buscar en festiveDatesStatus
    const festiveDate = festiveDatesStatus.find((date: FestiveDateStatus) => 
      date.name.toLowerCase() === name || date.id === sectionName
    )
    if (festiveDate && festiveDate.icon) {
      switch (festiveDate.icon) {
        case 'gift': return Gift
        case 'graduation-cap': return GraduationCap
        case 'tree-pine': return TreePine
        case 'cake': return Cake
        case 'star': return Star
        case 'flower': return Flower
        case 'book': return Book
        default: return Heart
      }
    }
    
    return Heart
  }

  const getSectionColor = (sectionName: string) => {
    const name = sectionName.toLowerCase()
    if (name.includes('día del niño')) return 'text-pink-500'
    if (name.includes('comienzo de clases')) return 'text-blue-500'
    if (name.includes('navidad')) return 'text-green-500'
    
    // Para fechas festivas personalizadas, usar colores por defecto
    return 'text-purple-500'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
        return <Badge variant="secondary">Pendiente</Badge>
      case 'CONFIRMADA':
        return <Badge variant="default">Confirmada</Badge>
      case 'RECHAZADA':
        return <Badge variant="destructive">Rechazada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const extractContactInfo = (description: string) => {
    const phoneMatch = description.match(/Teléfono:\s*([^\n]+)/)
    const addressMatch = description.match(/Dirección:\s*([^\n]+)/)
    
    return {
      phone: phoneMatch ? phoneMatch[1].trim() : 'No especificado',
      address: addressMatch ? addressMatch[1].trim() : 'No especificado'
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Donaciones Festivas</h2>
          <p className="text-muted-foreground">
            Gestiona donaciones para fechas especiales: Día del Niño, Comienzo de Clases y Navidad
          </p>
        </div>
      </div>

      {/* Configuración de Fechas Festivas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuración de Fechas Festivas
              </CardTitle>
              <CardDescription>
                Habilita o deshabilita las tarjetas de donación para cada fecha festiva
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nueva Fecha Festiva
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Crear Nueva Fecha Festiva</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Nombre *</Label>
                  <Input
                    id="create-name"
                    placeholder="Ej: Día de la Madre"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-description">Descripción *</Label>
                  <Input
                    id="create-description"
                    placeholder="Ej: Donaciones especiales para el Día de la Madre"
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-start">Fecha de inicio *</Label>
                  <Input
                    id="create-start"
                    type="date"
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-end">Fecha de fin *</Label>
                  <Input
                    id="create-end"
                    type="date"
                    value={createForm.endDate}
                    onChange={(e) => setCreateForm({ ...createForm, endDate: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-icon">Icono</Label>
                  <select
                    id="create-icon"
                    value={createForm.icon}
                    onChange={(e) => setCreateForm({ ...createForm, icon: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="heart">Corazón</option>
                    <option value="gift">Regalo</option>
                    <option value="graduation-cap">Graduación</option>
                    <option value="tree-pine">Árbol</option>
                    <option value="cake">Torta</option>
                    <option value="star">Estrella</option>
                    <option value="flower">Flor</option>
                    <option value="book">Libro</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-gradient">Colores</Label>
                  <select
                    id="create-gradient"
                    value={createForm.gradient}
                    onChange={(e) => setCreateForm({ ...createForm, gradient: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="from-purple-500 to-pink-600">Morado a Rosa</option>
                    <option value="from-blue-500 to-indigo-600">Azul a Índigo</option>
                    <option value="from-green-500 to-emerald-600">Verde a Esmeralda</option>
                    <option value="from-red-500 to-rose-600">Rojo a Rosa</option>
                    <option value="from-yellow-500 to-orange-600">Amarillo a Naranja</option>
                    <option value="from-teal-500 to-cyan-600">Verde Azulado a Cian</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="create-items">Elementos que se pueden donar (separados por comas)</Label>
                <Input
                  id="create-items"
                  placeholder="Ej: Flores, chocolates, libros, ropa"
                  value={createForm.items.join(', ')}
                  onChange={(e) => setCreateForm({ 
                    ...createForm, 
                    items: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                  })}
                />
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={createFestiveDate}
                  disabled={isCreating}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isCreating ? 'Creando...' : 'Crear Fecha Festiva'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {festiveDatesStatus.map((date) => {
              const IconComponent = getSectionIcon(date.name)
              const iconColor = getSectionColor(date.name)
              
              return (
                <div key={date.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <IconComponent className={`h-8 w-8 ${iconColor}`} />
                    <div>
                      <h3 className="font-semibold">{date.name}</h3>
                      <p className="text-sm text-muted-foreground">{date.description}</p>
                      {editingDate === date.id ? (
                        <div className="flex gap-2 mt-2">
                          <div className="flex flex-col gap-1">
                            <Label htmlFor={`start-${date.id}`} className="text-xs">Fecha inicio</Label>
                            <Input
                              id={`start-${date.id}`}
                              type="date"
                              value={editForm.startDate || ''}
                              onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                              className="w-32"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Label htmlFor={`end-${date.id}`} className="text-xs">Fecha fin</Label>
                            <Input
                              id={`end-${date.id}`}
                              type="date"
                              value={editForm.endDate || ''}
                              onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                              className="w-32"
                            />
                          </div>
                          <div className="flex gap-1 mt-6">
                            <Button size="sm" onClick={saveEdit}>Guardar</Button>
                            <Button size="sm" variant="outline" onClick={cancelEdit}>Cancelar</Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {new Date(date.startDate).toLocaleDateString('es-ES')} - {new Date(date.endDate).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={date.isEnabled}
                        onCheckedChange={(checked) => toggleFestiveDate(date.id, checked)}
                      />
                      <span className="text-sm font-medium">
                        {date.isEnabled ? 'Habilitada' : 'Deshabilitada'}
                      </span>
                    </div>
                    {editingDate !== date.id && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => startEditing(date)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteFestiveDate(date.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filtros por sección */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrar por Fecha Festiva
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <select 
                value={selectedSection} 
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Todas las fechas festivas</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donaciones</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
            <p className="text-xs text-muted-foreground">
              Donaciones festivas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Día del Niño</CardTitle>
            <Gift className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {donations.filter(d => d.section?.name.toLowerCase().includes('día del niño')).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Juguetes y regalos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comienzo de Clases</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {donations.filter(d => d.section?.name.toLowerCase().includes('comienzo de clases')).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Útiles escolares
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Navidad</CardTitle>
            <TreePine className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {donations.filter(d => d.section?.name.toLowerCase().includes('navidad')).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Regalos navideños
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de donaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Donaciones Festivas</CardTitle>
          <CardDescription>
            {selectedSection 
              ? `Donaciones para: ${sections.find(s => s.id === selectedSection)?.name || 'Sección seleccionada'}`
              : 'Todas las donaciones festivas'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando donaciones...</p>
                </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay donaciones festivas registradas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => {
                const IconComponent = getSectionIcon(donation.section?.name || '')
                const iconColor = getSectionColor(donation.section?.name || '')
                const contactInfo = extractContactInfo(donation.description)
                
                return (
                  <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                      <IconComponent className={`h-8 w-8 ${iconColor}`} />
                      <div className="flex-1">
                        <p className="font-medium">
                          {donation.section?.name || 'Donación Festiva'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                          {donation.isAnonymous ? 'Donación Anónima' : donation.donorName} • {formatDate(donation.createdAt)}
                  </p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {contactInfo.phone}
                </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {contactInfo.address.length > 30 ? `${contactInfo.address.substring(0, 30)}...` : contactInfo.address}
              </div>
            </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {donation.description.split('\n')[0]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                      {getStatusBadge(donation.status)}
                <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                  Ver Detalles
                </Button>
              </div>
            </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
