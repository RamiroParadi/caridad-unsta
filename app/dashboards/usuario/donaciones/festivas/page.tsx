"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Gift, GraduationCap, TreePine, Heart, Calendar, Users, Clock, Cake, Star, Flower, Book } from 'lucide-react'

interface FestiveDate {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  bgGradient: string
  date: string
  items: string[]
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

const festiveDates: FestiveDate[] = [
  {
    id: 'dia-del-nino',
    name: 'Día del Niño',
    description: 'Contribuye con juguetes, libros y regalos para hacer felices a los más pequeños',
    icon: Gift,
    gradient: 'from-pink-500 to-rose-600',
    bgGradient: 'from-pink-50 to-rose-50',
    date: 'Agosto 2024',
    items: ['Juguetes nuevos y usados', 'Libros infantiles', 'Juegos educativos', 'Materiales de arte']
  },
  {
    id: 'comienzo-clases',
    name: 'Comienzo de Clases',
    description: 'Ayuda a los estudiantes con útiles escolares y materiales para el nuevo ciclo lectivo',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50',
    date: 'Marzo 2025',
    items: ['Mochilas y cartucheras', 'Cuadernos y lapiceras', 'Calculadoras', 'Diccionarios']
  },
  {
    id: 'navidad',
    name: 'Navidad',
    description: 'Lleva alegría navideña con regalos, decoraciones y elementos festivos',
    icon: TreePine,
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50',
    date: 'Diciembre 2024',
    items: ['Regalos navideños', 'Decoraciones', 'Juguetes', 'Libros de cuentos']
  }
]

export default function FestivasDonationPage() {
  const router = useRouter()
  const [festiveDatesStatus, setFestiveDatesStatus] = useState<FestiveDateStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFestiveDatesStatus()
  }, [])

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
    } finally {
      setLoading(false)
    }
  }

  const handleDateClick = (dateId: string) => {
    // Verificar si es una fecha festiva personalizada (no está en las fechas estáticas)
    const isCustomDate = !festiveDates.find(date => date.id === dateId)
    
    if (isCustomDate) {
      router.push(`/dashboards/usuario/donaciones/festivas/custom/${dateId}`)
    } else {
      router.push(`/dashboards/usuario/donaciones/festivas/${dateId}`)
    }
  }

  const getEnabledFestiveDates = () => {
    return festiveDatesStatus.filter(status => status.isEnabled).map(status => {
      const staticDate = festiveDates.find(date => date.id === status.id)
      if (staticDate) {
        return staticDate
      }
      
      // Si no existe en las fechas estáticas, crear una dinámica
      const IconComponent = getIconComponent(status.icon || 'heart')
      return {
        id: status.id,
        name: status.name,
        description: status.description,
        icon: IconComponent,
        gradient: status.gradient || 'from-purple-500 to-pink-600',
        bgGradient: status.bgGradient || 'from-purple-50 to-pink-50',
        date: `${new Date(status.startDate).toLocaleDateString('es-ES')} - ${new Date(status.endDate).toLocaleDateString('es-ES')}`,
        items: status.items || ['Elementos varios']
      }
    })
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6 shadow-lg">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent mb-4">
            Donaciones Festivas
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Elige una fecha especial y contribuye con elementos festivos para hacer felices a quienes más lo necesitan
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando fechas festivas disponibles...</p>
          </div>
        ) : getEnabledFestiveDates().length === 0 ? (
          <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden mb-8">
            <CardContent className="p-12 text-center">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hay fechas festivas disponibles
              </h3>
              <p className="text-gray-500 mb-4">
                Las donaciones festivas están temporalmente deshabilitadas. 
                Vuelve pronto para ver las próximas fechas especiales.
              </p>
              <div className="text-sm text-gray-400">
                <p>Próximas fechas:</p>
                <ul className="mt-2 space-y-1">
                  {festiveDatesStatus.map((status) => (
                    <li key={status.id}>
                      {status.name}: {new Date(status.startDate).toLocaleDateString('es-ES')} - {new Date(status.endDate).toLocaleDateString('es-ES')}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {getEnabledFestiveDates().map((date) => {
              const IconComponent = date.icon
              const status = festiveDatesStatus.find(s => s.id === date.id)
              return (
                <Card 
                  key={date.id} 
                  className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group"
                  onClick={() => handleDateClick(date.id)}
                >
                  <CardHeader className={`bg-gradient-to-r ${date.gradient} text-white p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm opacity-90">
                          <Calendar className="h-4 w-4" />
                          {status ? `${new Date(status.startDate).toLocaleDateString('es-ES')} - ${new Date(status.endDate).toLocaleDateString('es-ES')}` : date.date}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold mb-2">
                      {date.name}
                    </CardTitle>
                    <CardDescription className="text-white/90 text-sm">
                      {date.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className={`p-6 bg-gradient-to-br ${date.bgGradient}`}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <Users className="h-4 w-4" />
                        Elementos que puedes donar:
                      </div>
                      <ul className="space-y-2">
                        {date.items.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className={`w-full mt-6 bg-gradient-to-r ${date.gradient} hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105`}
                      >
                        Donar para {date.name}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="p-2 bg-white/20 rounded-lg">
                <Heart className="h-6 w-6" />
              </div>
              ¿Cómo funciona?
            </CardTitle>
            <CardDescription className="text-purple-100 text-base mt-2">
              Proceso simple para hacer tu donación festiva
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 bg-gradient-to-br from-white to-purple-50">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                  <span className="text-purple-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-gray-800">Elige la fecha</h3>
                <p className="text-sm text-gray-600">Selecciona la celebración para la cual quieres donar</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full">
                  <span className="text-pink-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-gray-800">Completa el formulario</h3>
                <p className="text-sm text-gray-600">Describe qué donas y proporciona tus datos de contacto</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full">
                  <span className="text-rose-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-gray-800">Coordinamos el retiro</h3>
                <p className="text-sm text-gray-600">Nos contactamos contigo para coordinar la recolección</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}