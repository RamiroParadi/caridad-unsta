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

export default function MonetariasDonationPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sections, setSections] = useState<DonationSection[]>([])
  const [monetariasSection, setMonetariasSection] = useState<DonationSection | null>(null)

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    isAnonymous: false
  })

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch('/api/donations/sections')
        if (response.ok) {
          const data = await response.json()
          setSections(data)
          
          // Encontrar la sección de donaciones monetarias
          const monetarias = data.find((section: DonationSection) => 
            section.name.toLowerCase().includes('monetarias') || 
            section.name.toLowerCase().includes('monetaria')
          )
          setMonetariasSection(monetarias)
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
    
    if (!monetariasSection) {
      toast({
        title: "Error",
        description: "No se encontró la sección de donaciones monetarias",
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

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Ingresa un monto válido",
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
          amount,
          description: formData.description || 'Donación monetaria',
          sectionId: monetariasSection.id,
          userId: user.id,
          isAnonymous: formData.isAnonymous,
          donorName: user.fullName || 'Usuario',
          donorEmail: user.primaryEmailAddress?.emailAddress || ''
        }),
      })

      if (response.ok) {
        toast({
          title: "¡Donación enviada!",
          description: "Tu donación monetaria ha sido registrada correctamente",
          variant: "default"
        })
        
        // Limpiar el formulario
        setFormData({
          amount: '',
          description: '',
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
            Donación Monetaria
          </h1>
          <p className="text-gray-600">
            Contribuye económicamente para apoyar las actividades de caridad y programas sociales
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Realizar Donación</CardTitle>
            <CardDescription>
              Completa el formulario para registrar tu donación monetaria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Monto de la donación (ARS)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="Ej: 10000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Especifica para qué se utilizará tu donación (actividades, programas, emergencias, etc.)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
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
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={isSubmitting || !monetariasSection}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Donación'}
              </Button>
            </form>

            {!monetariasSection && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  Cargando sección de donaciones monetarias...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-orange-50 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">
            ¿En qué se utilizan las donaciones monetarias?
          </h3>
          <ul className="text-orange-800 space-y-1">
            <li>• Compra de materiales para actividades de caridad</li>
            <li>• Apoyo a familias en situación de emergencia</li>
            <li>• Organización de eventos y campañas solidarias</li>
            <li>• Mantenimiento de programas educativos</li>
            <li>• Ayuda alimentaria y de primera necesidad</li>
            <li>• Gastos operativos de la organización</li>
            <li>• Proyectos de desarrollo comunitario</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Información importante:</h4>
          <p className="text-sm text-blue-800">
            Las donaciones monetarias son utilizadas de manera transparente y responsable. 
            Recibirás un comprobante de tu donación y podrás seguir el impacto de tu contribución 
            a través de nuestros reportes regulares.
          </p>
        </div>
      </div>
    </div>
  )
}