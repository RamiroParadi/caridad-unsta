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

export default function FestivasDonationPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sections, setSections] = useState<DonationSection[]>([])
  const [festivasSection, setFestivasSection] = useState<DonationSection | null>(null)

  const [formData, setFormData] = useState({
    donationDescription: '',
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
          setSections(data)
          
          // Encontrar la sección de donaciones festivas
          const festivas = data.find((section: DonationSection) => 
            section.name.toLowerCase().includes('festivas') || 
            section.name.toLowerCase().includes('festivo')
          )
          console.log('Sección de festivas encontrada:', festivas)
          setFestivasSection(festivas)
          
          if (!festivas) {
            console.error('No se encontró la sección de festivas en:', data.map(s => s.name))
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
    
    if (!festivasSection) {
      toast({
        title: "Error",
        description: "No se encontró la sección de donaciones festivas",
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

    if (!formData.donationDescription.trim()) {
      toast({
        title: "Error",
        description: "Describe qué elementos festivos donas",
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
          description: `${formData.donationDescription}\n\nDatos de retiro:\nTeléfono: ${formData.phone}\nDirección: ${formData.address}`,
          sectionId: festivasSection.id,
          userId: user.id,
          isAnonymous: formData.isAnonymous,
          donorName: user.fullName || 'Usuario',
          donorEmail: user.primaryEmailAddress?.emailAddress || ''
        }),
      })

      if (response.ok) {
        toast({
          title: "¡Donación enviada!",
          description: "Tu donación festiva ha sido registrada correctamente",
          variant: "default"
        })
        
        // Limpiar el formulario
        setFormData({
          donationDescription: '',
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
            Donaciones Festivas
          </h1>
          <p className="text-gray-600">
            Contribuye con juguetes, regalos y elementos especiales para fechas festivas
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Realizar Donación</CardTitle>
            <CardDescription>
              Completa el formulario para registrar tu donación festiva
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="donationDescription">¿Qué donas?</Label>
                <Textarea
                  id="donationDescription"
                  placeholder="Describe qué elementos festivos donas (juguetes, regalos, decoraciones, etc.)"
                  value={formData.donationDescription}
                  onChange={(e) => setFormData({ ...formData, donationDescription: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono de contacto</Label>
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
                <Label htmlFor="address">Dirección para retiro</Label>
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
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isSubmitting || !festivasSection}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Donación'}
              </Button>
            </form>

            {!festivasSection && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  Cargando sección de donaciones festivas...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-purple-50 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            ¿Qué elementos festivos puedes donar?
          </h3>
          <ul className="text-purple-800 space-y-1">
            <li>• Juguetes nuevos y usados en buen estado</li>
            <li>• Regalos para niños y adolescentes</li>
            <li>• Decoraciones navideñas y festivas</li>
            <li>• Libros infantiles y cuentos</li>
            <li>• Materiales para manualidades</li>
            <li>• Juegos de mesa y rompecabezas</li>
            <li>• Artículos para cumpleaños y celebraciones</li>
            <li>• Disfraces y accesorios festivos</li>
          </ul>
        </div>
      </div>
    </div>
  )
}