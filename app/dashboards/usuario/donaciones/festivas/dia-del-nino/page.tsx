"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Gift, Heart, ArrowLeft, CheckCircle } from 'lucide-react'

export default function DiaDelNinoDonationPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    donationDescription: '',
    ageRange: '',
    phone: '',
    address: '',
    isAnonymous: false
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para hacer una donación",
        variant: "destructive"
      })
      return
    }

    if (!formData.donationDescription.trim()) {
      toast({
        title: "Error",
        description: "Describe qué juguetes o elementos donas",
        variant: "destructive"
      })
      return
    }

    if (!formData.phone.trim() || !formData.address.trim()) {
      toast({
        title: "Error",
        description: "Ingresa tu teléfono y dirección para el retiro",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Primero intentar crear la sección si no existe
      let sectionId = 'dia-del-nino'
      try {
        const sectionResponse = await fetch('/api/donations/sections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Día del Niño',
            description: 'Donaciones de juguetes y elementos para el Día del Niño'
          }),
        })
        
        if (sectionResponse.ok) {
          const section = await sectionResponse.json()
          sectionId = section.id
        }
      } catch (error) {
        console.log('Usando ID por defecto para la sección')
      }

      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 0,
          description: `🎁 DONACIÓN DÍA DEL NIÑO 🎁\n\nElementos donados:\n${formData.donationDescription}\n\nRango de edad: ${formData.ageRange || 'No especificado'}\n\nDatos de retiro:\nTeléfono: ${formData.phone}\nDirección: ${formData.address}`,
          sectionId: sectionId,
          userId: user.id,
          isAnonymous: formData.isAnonymous,
          donorName: user.fullName || 'Usuario',
          donorEmail: user.primaryEmailAddress?.emailAddress || ''
        }),
      })

      if (response.ok) {
        toast({
          title: "¡Donación enviada!",
          description: "Tu donación para el Día del Niño ha sido registrada correctamente",
          variant: "default"
        })
        
        // Limpiar el formulario
        setFormData({
          donationDescription: '',
          ageRange: '',
          phone: '',
          address: '',
          isAnonymous: false
        })
        
        // Redirigir después de un momento
        setTimeout(() => {
          router.push('/dashboards/usuario/donaciones/festivas')
        }, 2000)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "No se pudo registrar la donación",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error submitting donation:', error)
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar la donación",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-rose-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-rose-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full mb-4 shadow-lg">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-700 bg-clip-text text-transparent mb-2">
            Donación para el Día del Niño
          </h1>
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            Contribuye con juguetes, libros y regalos para hacer felices a los más pequeños
          </p>
        </div>

        <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white p-6">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Heart className="h-5 w-5" />
              </div>
              Realizar Donación
            </CardTitle>
            <CardDescription className="text-pink-100 text-base mt-1">
              Completa el formulario para registrar tu donación
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-white to-pink-50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="donationDescription" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  ¿Qué juguetes o elementos donas? *
                </Label>
                <div className="relative">
                  <Textarea
                    id="donationDescription"
                    placeholder="Ej: 3 muñecas nuevas, 2 juegos de mesa, 5 libros infantiles, materiales de arte..."
                    value={formData.donationDescription}
                    onChange={(e) => setFormData({ ...formData, donationDescription: e.target.value })}
                    rows={3}
                    required
                    className="border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  Sé específico sobre qué elementos donas y sus cantidades
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ageRange" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                  Rango de edad recomendado (Opcional)
                </Label>
                <div className="relative">
                  <Input
                    id="ageRange"
                    placeholder="Ej: 3-6 años, 7-12 años, adolescentes..."
                    value={formData.ageRange}
                    onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                    className="border-2 border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                    Teléfono de contacto *
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Ej: 011-1234-5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="border-2 border-gray-200 focus:border-pink-600 focus:ring-2 focus:ring-pink-200 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                    Dirección para retiro *
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="address"
                      placeholder="Ingresa tu dirección completa donde se retirará la donación"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={2}
                      required
                      className="border-2 border-gray-200 focus:border-rose-600 focus:ring-2 focus:ring-rose-200 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-pink-50 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="w-4 h-4 rounded border-2 border-gray-300 text-pink-600 focus:ring-pink-500 focus:ring-2"
                />
                <Label htmlFor="anonymous" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Hacer donación anónima
                </Label>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-700 hover:via-rose-700 hover:to-red-700 text-white font-bold py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Enviando donación...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Enviar Donación para el Día del Niño
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden mt-6">
          <CardHeader className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="p-2 bg-white/20 rounded-lg">
                <CheckCircle className="h-6 w-6" />
              </div>
              Elementos ideales para el Día del Niño
            </CardTitle>
            <CardDescription className="text-pink-100 text-base mt-2">
              Sugerencias de elementos que puedes donar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 bg-gradient-to-br from-white to-pink-50">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Juguetes
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Muñecas y figuras de acción
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Juegos de mesa y rompecabezas
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Pelotas y juguetes deportivos
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Juguetes educativos
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                  Materiales educativos
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Libros infantiles y cuentos
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Materiales de arte y manualidades
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Cuadernos y lapiceras de colores
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Juegos de construcción
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboards/usuario/donaciones/festivas')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Donaciones Festivas
          </Button>
        </div>
      </div>
    </div>
  )
}
