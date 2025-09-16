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
  sectionId?: string
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
    items: ['']
  })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchSections()
    fetchFestiveDatesStatus()
  }, [])

  // Limpiar fechas inválidas automáticamente
  useEffect(() => {
    if (createForm.startDate && isNaN(new Date(createForm.startDate + 'T00:00:00').getTime())) {
      setCreateForm(prev => ({ ...prev, startDate: '' }))
    }
    if (createForm.endDate && isNaN(new Date(createForm.endDate + 'T00:00:00').getTime())) {
      setCreateForm(prev => ({ ...prev, endDate: '' }))
    }
  }, [createForm.startDate, createForm.endDate])

  const fetchSections = useCallback(async () => {
    try {
      const response = await fetch('/api/donations/sections')
      if (response.ok) {
        const data = await response.json()
        console.log('Secciones cargadas:', data)
        
        // Filtrar solo las secciones que tienen fechas festivas asociadas
        const festiveSections = data.filter((section: {id: string, name: string, description: string}) => {
          const sectionId = section.id
          
          // Verificar si esta sección tiene una fecha festiva asociada
          const hasFestiveDate = festiveDatesStatus.some((festiveDate: FestiveDateStatus) => {
            return (festiveDate as any).sectionId === sectionId
          })
          
          console.log(`Section "${section.name}" (${sectionId}): hasFestiveDate=${hasFestiveDate}`)
          
          return hasFestiveDate
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
        const festiveDatesArray = Object.values(data)
        console.log('Festive dates array:', festiveDatesArray)
        console.log('First festive date sectionId:', (festiveDatesArray[0] as any)?.sectionId)
        setFestiveDatesStatus(festiveDatesArray as FestiveDateStatus[])
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
    // Validación mejorada
    const errors = []
    
    if (!createForm.name || createForm.name.trim() === '') {
      errors.push('El nombre es requerido')
    }
    
    if (!createForm.description || createForm.description.trim() === '') {
      errors.push('La descripción es requerida')
    }
    
    if (!createForm.startDate) {
      errors.push('La fecha de inicio es requerida')
    }
    
    if (!createForm.endDate) {
      errors.push('La fecha de fin es requerida')
    }
    
    // Validar que las fechas sean válidas
    if (createForm.startDate) {
      const startDate = new Date(createForm.startDate + 'T00:00:00')
      if (isNaN(startDate.getTime())) {
        errors.push(`La fecha de inicio "${createForm.startDate}" no es válida. Verifica que la fecha exista.`)
      }
    }
    
    if (createForm.endDate) {
      const endDate = new Date(createForm.endDate + 'T00:00:00')
      if (isNaN(endDate.getTime())) {
        errors.push(`La fecha de fin "${createForm.endDate}" no es válida. Verifica que la fecha exista.`)
      }
    }
    
    // Validar que la fecha de fin sea posterior a la de inicio
    if (createForm.startDate && createForm.endDate) {
      const startDate = new Date(createForm.startDate + 'T00:00:00')
      const endDate = new Date(createForm.endDate + 'T00:00:00')
      
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        if (endDate <= startDate) {
          errors.push('La fecha de fin debe ser posterior a la fecha de inicio')
        }
      }
    }
    
    if (errors.length > 0) {
      alert(`Por favor corrige los siguientes errores:\n\n${errors.join('\n')}`)
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/admin/festive-dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: createForm.name.trim(),
          description: createForm.description.trim(),
          startDate: createForm.startDate,
          endDate: createForm.endDate,
          icon: createForm.icon,
          gradient: createForm.gradient,
          bgGradient: createForm.bgGradient,
          items: createForm.items[0] && createForm.items[0].trim()
            ? createForm.items[0].split(',').map(item => item.trim()).filter(item => item)
            : ['Elementos varios']
        }),
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
          items: ['']
        })
        console.log('Nueva fecha festiva creada:', newDate)
        
        // Recargar secciones y donaciones para incluir la nueva fecha festiva
        setTimeout(() => {
          fetchSections()
          fetchDonations()
        }, 500)
      } else {
        const error = await response.json()
        alert(`Error al crear la fecha festiva: ${error.error || 'Error desconocido'}`)
      }
    } catch (error) {
      console.error('Error creating festive date:', error)
      alert('Error de conexión. Por favor, inténtalo de nuevo.')
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
        // Encontrar la fecha festiva para obtener su sectionId
        const festiveDate = festiveDatesStatus.find(fd => fd.id === id)
        
        // Eliminar la fecha festiva del estado
        setFestiveDatesStatus(prev => prev.filter(date => date.id !== id))
        
        // Si tiene sectionId, eliminar también la sección de donación
        if (festiveDate?.sectionId) {
          try {
            await fetch(`/api/donations/sections?id=${festiveDate.sectionId}`, {
              method: 'DELETE',
            })
            console.log(`Sección de donación ${festiveDate.sectionId} eliminada`)
          } catch (sectionError) {
            console.error('Error eliminando sección de donación:', sectionError)
          }
        }
        
        console.log(`Fecha festiva ${id} eliminada`)
        
        // Recargar secciones y donaciones para actualizar el filtro y las estadísticas
        setTimeout(() => {
          fetchSections()
          fetchDonations()
        }, 500)
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
      // Obtener todas las donaciones
      const response = await fetch('/api/donations')
      if (response.ok) {
        const data = await response.json()
        console.log('Donaciones cargadas:', data)
        console.log('Festive dates status:', festiveDatesStatus)
        console.log('Selected section:', selectedSection)
        
        // Filtrar solo las donaciones que tienen fechas festivas asociadas
        let festiveDonations = data.filter((donation: Donation) => {
          const sectionId = donation.section?.id || ''
          
          // Verificar si esta donación pertenece a una sección con fecha festiva asociada
          const hasFestiveDate = festiveDatesStatus.some((festiveDate: FestiveDateStatus) => {
            return (festiveDate as any).sectionId === sectionId
          })
          
          console.log(`Donation ${donation.id}: sectionId="${sectionId}", hasFestiveDate=${hasFestiveDate}`)
          
          return hasFestiveDate
        })
        
        // Si hay una sección específica seleccionada, filtrar por esa sección
        if (selectedSection) {
          festiveDonations = festiveDonations.filter((donation: Donation) => {
            return donation.section?.id === selectedSection
          })
        }
        
        console.log('Donaciones festivas filtradas:', festiveDonations)
        setDonations(festiveDonations)
      }
    } catch (error) {
      console.error('Error fetching donations:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedSection, festiveDatesStatus])

  // Cargar donaciones cuando las fechas festivas estén disponibles
  useEffect(() => {
    if (festiveDatesStatus.length > 0) {
      fetchDonations()
    }
  }, [fetchDonations, festiveDatesStatus])

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
              onClick={() => {
                if (!showCreateForm) {
                  // Limpiar el formulario al abrir y verificar fechas inválidas
                  const cleanForm = {
                    name: '',
                    description: '',
                    startDate: '',
                    endDate: '',
                    icon: 'heart',
                    gradient: 'from-purple-500 to-pink-600',
                    bgGradient: 'from-purple-50 to-pink-50',
                    items: ['']
                  }
                  
                  // Verificar si hay fechas inválidas en el estado actual y limpiarlas
                  if (createForm.startDate && isNaN(new Date(createForm.startDate + 'T00:00:00').getTime())) {
                    cleanForm.startDate = ''
                  }
                  if (createForm.endDate && isNaN(new Date(createForm.endDate + 'T00:00:00').getTime())) {
                    cleanForm.endDate = ''
                  }
                  
                  setCreateForm(cleanForm)
                }
                setShowCreateForm(!showCreateForm)
              }}
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
                    className={!createForm.name ? "border-red-300" : ""}
                  />
                  {!createForm.name && (
                    <p className="text-xs text-red-500">Este campo es requerido</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-description">Descripción *</Label>
                  <Input
                    id="create-description"
                    placeholder="Ej: Donaciones especiales para el Día de la Madre"
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    className={!createForm.description ? "border-red-300" : ""}
                  />
                  {!createForm.description && (
                    <p className="text-xs text-red-500">Este campo es requerido</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-start">Fecha de inicio *</Label>
                  <Input
                    id="create-start"
                    type="date"
                    value={createForm.startDate}
                    onChange={(e) => {
                      const value = e.target.value
                      // Limpiar fecha inválida automáticamente
                      if (value && isNaN(new Date(value + 'T00:00:00').getTime())) {
                        setCreateForm({ ...createForm, startDate: '' })
                        return
                      }
                      setCreateForm({ ...createForm, startDate: value })
                    }}
                    className={
                      !createForm.startDate || 
                      (createForm.startDate && isNaN(new Date(createForm.startDate + 'T00:00:00').getTime()))
                        ? "border-red-300" 
                        : ""
                    }
                  />
                  {!createForm.startDate && (
                    <p className="text-xs text-red-500">Este campo es requerido</p>
                  )}
                  {createForm.startDate && isNaN(new Date(createForm.startDate + 'T00:00:00').getTime()) && (
                    <div className="text-xs text-red-500">
                      <p>La fecha "{createForm.startDate}" no es válida.</p>
                      <p className="text-blue-600 mt-1">
                        💡 Sugerencia: Febrero tiene máximo 28 días (o 29 en año bisiesto). 
                        Prueba con "28/02/2025" o "01/03/2025".
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-end">Fecha de fin *</Label>
                  <Input
                    id="create-end"
                    type="date"
                    value={createForm.endDate}
                    onChange={(e) => {
                      const value = e.target.value
                      // Limpiar fecha inválida automáticamente
                      if (value && isNaN(new Date(value + 'T00:00:00').getTime())) {
                        setCreateForm({ ...createForm, endDate: '' })
                        return
                      }
                      setCreateForm({ ...createForm, endDate: value })
                    }}
                    className={
                      !createForm.endDate || 
                      (createForm.endDate && isNaN(new Date(createForm.endDate + 'T00:00:00').getTime())) ||
                      (createForm.startDate && createForm.endDate && 
                       !isNaN(new Date(createForm.startDate + 'T00:00:00').getTime()) && 
                       !isNaN(new Date(createForm.endDate + 'T00:00:00').getTime()) && 
                       new Date(createForm.endDate + 'T00:00:00') <= new Date(createForm.startDate + 'T00:00:00'))
                        ? "border-red-300" 
                        : ""
                    }
                  />
                  {!createForm.endDate && (
                    <p className="text-xs text-red-500">Este campo es requerido</p>
                  )}
                  {createForm.endDate && isNaN(new Date(createForm.endDate + 'T00:00:00').getTime()) && (
                    <p className="text-xs text-red-500">La fecha "{createForm.endDate}" no es válida. Verifica que la fecha exista.</p>
                  )}
                  {createForm.startDate && createForm.endDate && 
                   !isNaN(new Date(createForm.startDate + 'T00:00:00').getTime()) && 
                   !isNaN(new Date(createForm.endDate + 'T00:00:00').getTime()) && 
                   new Date(createForm.endDate + 'T00:00:00') <= new Date(createForm.startDate + 'T00:00:00') && (
                    <p className="text-xs text-red-500">La fecha de fin debe ser posterior a la fecha de inicio</p>
                  )}
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
                  value={createForm.items.length === 1 ? createForm.items[0] : createForm.items.join(', ')}
                  onChange={(e) => {
                    const value = e.target.value
                    // Permitir escribir libremente, solo procesar al enviar
                    setCreateForm({ 
                      ...createForm, 
                      items: value ? [value] : [''] // Guardar como texto libre temporalmente
                    })
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separa cada elemento con una coma. Ejemplo: "Flores, chocolates, libros, ropa"
                </p>
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
                {festiveDatesStatus.map((festiveDate) => (
                  <option key={festiveDate.id} value={(festiveDate as any).sectionId}>
                    {festiveDate.name}
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
        {festiveDatesStatus.slice(0, 3).map((festiveDate) => {
          const sectionDonations = donations.filter(d => d.section?.id === (festiveDate as any).sectionId)
          
          // Iconos dinámicos basados en la fecha festiva
          const getIcon = (iconName?: string) => {
            switch (iconName) {
              case 'gift': return <Gift className="h-4 w-4 text-pink-500" />
              case 'graduation-cap': return <GraduationCap className="h-4 w-4 text-blue-500" />
              case 'tree-pine': return <TreePine className="h-4 w-4 text-green-500" />
              case 'flower': return <Heart className="h-4 w-4 text-pink-500" />
              case 'cake': return <Heart className="h-4 w-4 text-yellow-500" />
              case 'star': return <Heart className="h-4 w-4 text-yellow-500" />
              case 'book': return <GraduationCap className="h-4 w-4 text-blue-500" />
              default: return <Heart className="h-4 w-4 text-purple-500" />
            }
          }
          
          return (
            <Card key={festiveDate.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{festiveDate.name}</CardTitle>
                {getIcon(festiveDate.icon)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sectionDonations.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {festiveDate.description || 'Donaciones festivas'}
                </p>
              </CardContent>
            </Card>
          )
        })}
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
