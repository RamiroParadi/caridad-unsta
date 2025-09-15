"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { BookOpen, Heart, CheckCircle, Award } from 'lucide-react'

interface DonationSection {
  id: string
  name: string
  description: string
}

export default function MaterialesDonationPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    materials: '',
    condition: '',
    additionalInfo: '',
    phone: '',
    address: '',
    isAnonymous: false
  })

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
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

    if (!formData.materials.trim() || !formData.condition.trim()) {
      toast({
        title: "Error",
        description: "Completa todos los campos obligatorios",
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
      // Crear la sección si no existe
      let sectionId = 'materiales-estudio'
      
      // Intentar crear la sección primero
      try {
        const sectionResponse = await fetch('/api/donations/sections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Materiales de Estudio',
            description: 'Libros, útiles escolares y materiales educativos'
          }),
        })
        
        if (sectionResponse.ok) {
          const sectionData = await sectionResponse.json()
          sectionId = sectionData.id
        }
      } catch (error) {
        console.log('No se pudo crear la sección, usando ID por defecto')
      }

      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 0, // No es monetario, se usa para identificar tipo
          description: `Materiales: ${formData.materials}

Estado: ${formData.condition}

${formData.additionalInfo ? `Información adicional: ${formData.additionalInfo}` : ''}

Datos de retiro:
Teléfono: ${formData.phone}
Dirección: ${formData.address}`,
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
          description: "Tu donación de materiales de estudio ha sido registrada correctamente",
          variant: "default"
        })
        
        // Limpiar el formulario
        setFormData({
          materials: '',
          condition: '',
          additionalInfo: '',
          phone: '',
          address: '',
          isAnonymous: false
        })
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-2">
            Donación de Materiales de Estudio
          </h1>
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            Contribuye con útiles escolares, libros y materiales educativos
          </p>
        </div>

        <Card className="bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-6">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Heart className="h-5 w-5" />
              </div>
              Realizar Donación
            </CardTitle>
            <CardDescription className="text-green-100 text-base mt-1">
              Completa el formulario para registrar tu donación
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-white to-slate-50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="materials" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Materiales que vas a donar *
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="materials"
                      placeholder="Ej: 5 libros de matemáticas de secundaria, 10 cuadernos de 48 hojas..."
                      value={formData.materials}
                      onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                      rows={3}
                      required
                      className="border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Sé específico sobre qué materiales donas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Estado de los materiales *
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="condition"
                      placeholder="Ej: Libros en excelente estado, sin subrayar..."
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      rows={3}
                      required
                      className="border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    Describe el estado general de los materiales
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  Información adicional (Opcional)
                </Label>
                <div className="relative">
                  <Textarea
                    id="additionalInfo"
                    placeholder="Nivel educativo, materias específicas, horarios de entrega..."
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    rows={2}
                    className="border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
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
                      className="border-2 border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-200 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
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
                      className="border-2 border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="w-4 h-4 rounded border-2 border-gray-300 text-green-600 focus:ring-green-500 focus:ring-2"
                />
                <Label htmlFor="anonymous" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Hacer donación anónima
                </Label>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Enviando donación...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5" />
                      Enviar Donación
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {isLoading && (
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-500 border-t-transparent"></div>
                  <p className="text-sm text-yellow-800 font-medium">
                    Cargando formulario...
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="p-2 bg-white/20 rounded-lg">
                <Award className="h-6 w-6" />
              </div>
              ¿Qué materiales educativos puedes donar?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-emerald-700 hover:text-emerald-800 transition-colors">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Libros de texto y literatura</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-700 hover:text-emerald-800 transition-colors">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Útiles escolares (cuadernos, lápices)</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-700 hover:text-emerald-800 transition-colors">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Materiales artísticos</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-700 hover:text-emerald-800 transition-colors">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Mochilas y cartucheras</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-emerald-700 hover:text-emerald-800 transition-colors">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Calculadoras y reglas</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-700 hover:text-emerald-800 transition-colors">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Diccionarios y enciclopedias</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-700 hover:text-emerald-800 transition-colors">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Computadoras y tablets</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-700 hover:text-emerald-800 transition-colors">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Materiales de laboratorio</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}