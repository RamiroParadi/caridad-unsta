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
import { GraduationCap, Heart, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ComienzoClasesDonationPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    donationDescription: '',
    schoolLevel: '',
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
        description: "Describe qué útiles escolares donas",
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
      let sectionId = 'comienzo-clases'
      try {
        const sectionResponse = await fetch('/api/donations/sections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Comienzo de Clases',
            description: 'Donaciones de útiles escolares para el inicio del ciclo lectivo'
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
          description: `🎓 DONACIÓN COMENZÓ DE CLASES 🎓\n\nÚtiles escolares donados:\n${formData.donationDescription}\n\nNivel escolar: ${formData.schoolLevel || 'No especificado'}\n\nDatos de retiro:\nTeléfono: ${formData.phone}\nDirección: ${formData.address}`,
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
          description: "Tu donación para el comienzo de clases ha sido registrada correctamente",
          variant: "default"
        })
        
        // Limpiar el formulario
        setFormData({
          donationDescription: '',
          schoolLevel: '',
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
            Donación para Comienzo de Clases
          </h1>
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            Ayuda a los estudiantes con útiles escolares y materiales para el nuevo ciclo lectivo
          </p>
        </div>

        <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Heart className="h-5 w-5" />
              </div>
              Realizar Donación
            </CardTitle>
            <CardDescription className="text-blue-100 text-base mt-1">
              Completa el formulario para registrar tu donación
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-white to-blue-50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="donationDescription" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  ¿Qué útiles escolares donas? *
                </Label>
                <div className="relative">
                  <Textarea
                    id="donationDescription"
                    placeholder="Ej: 5 mochilas nuevas, 10 cuadernos de 48 hojas, 3 calculadoras científicas, diccionarios..."
                    value={formData.donationDescription}
                    onChange={(e) => setFormData({ ...formData, donationDescription: e.target.value })}
                    rows={3}
                    required
                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  Sé específico sobre qué útiles donas y sus cantidades
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolLevel" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Nivel escolar (Opcional)
                </Label>
                <div className="relative">
                  <Input
                    id="schoolLevel"
                    placeholder="Ej: Primaria, Secundaria, Universidad..."
                    value={formData.schoolLevel}
                    onChange={(e) => setFormData({ ...formData, schoolLevel: e.target.value })}
                    className="border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
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
                      className="border-2 border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
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
                      className="border-2 border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <Label htmlFor="anonymous" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Hacer donación anónima
                </Label>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Enviando donación...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Enviar Donación para Comienzo de Clases
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden mt-6">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="p-2 bg-white/20 rounded-lg">
                <CheckCircle className="h-6 w-6" />
              </div>
              Útiles escolares más necesarios
            </CardTitle>
            <CardDescription className="text-blue-100 text-base mt-2">
              Sugerencias de elementos que puedes donar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 bg-gradient-to-br from-white to-blue-50">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Materiales básicos
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Mochilas y cartucheras
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Cuadernos de diferentes tamaños
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Lapiceras y lápices
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Reglas y compases
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Materiales especializados
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Calculadoras científicas
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Diccionarios y enciclopedias
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Libros de texto
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Materiales de laboratorio
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
