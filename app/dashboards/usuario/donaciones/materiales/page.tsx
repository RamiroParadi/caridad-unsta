"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface DonationSection {
  id: string
  name: string
  description: string
}

export default function MaterialesDonationPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [materialesSection, setMaterialesSection] = useState<DonationSection | null>(null)

  const [formData, setFormData] = useState({
    materials: '',
    condition: '',
    additionalInfo: '',
    phone: '',
    address: '',
    isAnonymous: false
  })

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch('/api/donations/sections')
        if (response.ok) {
          const data = await response.json()
          console.log('Secciones cargadas:', data)
          
          // Encontrar la sección de materiales de estudio
          const materiales = data.find((section: DonationSection) => 
            section.name.toLowerCase().includes('materiales') || 
            section.name.toLowerCase().includes('estudio') ||
            section.name.toLowerCase().includes('libros') ||
            section.name.toLowerCase().includes('útiles')
          )
          console.log('Sección de materiales encontrada:', materiales)
          setMaterialesSection(materiales)
          
          if (!materiales) {
            console.error('No se encontró la sección de materiales en:', data.map((s: DonationSection) => s.name))
          }
        }
      } catch (error) {
        console.error('Error fetching sections:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las secciones de donación",
          variant: "destructive"
        })
      }
    }

    fetchSections()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!materialesSection) {
      toast({
        title: "Error",
        description: "No se encontró la sección de materiales de estudio",
        variant: "destructive"
      })
      return
    }

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
          sectionId: materialesSection.id,
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Donación de Materiales de Estudio
          </h1>
          <p className="text-gray-600">
            Contribuye con útiles escolares, libros y materiales educativos para apoyar la educación
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Realizar Donación</CardTitle>
            <CardDescription>
              Completa el formulario para registrar tu donación de materiales de estudio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="materials">Materiales que vas a donar *</Label>
                <Textarea
                  id="materials"
                  placeholder="Ej: 5 libros de matemáticas de secundaria, 10 cuadernos de 48 hojas, 3 diccionarios, 2 calculadoras científicas..."
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500">
                  Sé específico sobre qué materiales donas, cantidades y niveles educativos
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Estado de los materiales *</Label>
                <Textarea
                  id="condition"
                  placeholder="Ej: Libros en excelente estado, sin subrayar, páginas completas. Útiles nuevos o en buen estado..."
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  rows={3}
                  required
                />
                <p className="text-xs text-gray-500">
                  Describe el estado general de los materiales (nuevos, usados, nivel de conservación)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Información adicional (Opcional)</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Nivel educativo, materias específicas, horarios de entrega, instrucciones especiales..."
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono de contacto *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ej: 011-1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección para retiro *</Label>
                <Textarea
                  id="address"
                  placeholder="Ingresa tu dirección completa donde se retirará la donación"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="anonymous">Hacer donación anónima</Label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting || !materialesSection}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Donación'}
              </Button>
            </form>

            {!materialesSection && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  Cargando sección de materiales de estudio...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            ¿Qué materiales educativos puedes donar?
          </h3>
          <ul className="text-green-800 space-y-1">
            <li>• Libros de texto y literatura</li>
            <li>• Útiles escolares (cuadernos, lápices, bolígrafos)</li>
            <li>• Materiales artísticos (témperas, pinceles, papeles)</li>
            <li>• Calculadoras y reglas</li>
            <li>• Mochilas y cartucheras</li>
            <li>• Computadoras y tablets (usadas en buen estado)</li>
            <li>• Materiales de laboratorio</li>
          </ul>
        </div>
      </div>
    </div>
  )
}