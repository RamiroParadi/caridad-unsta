"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@clerk/nextjs"
import { 
  Heart, 
  Shirt, 
  BookOpen, 
  Gift, 
  Send,
  CheckCircle
} from "lucide-react"

interface DonationSection {
  id: string
  name: string
  description?: string
}

interface DonationFormData {
  amount: number
  description: string
  isAnonymous: boolean
  sectionId: string
}

export default function StudentDonationsPage() {
  const { user: clerkUser } = useUser()
  const [sections, setSections] = useState<DonationSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<DonationFormData>({
    amount: 0,
    description: '',
    isAnonymous: false,
    sectionId: ''
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/donations/sections')
      
      if (response.ok) {
        const data = await response.json()
        setSections(data)
      } else {
        toast({
          title: "❌ Error al cargar secciones",
          description: "No se pudieron cargar las secciones de donación",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
      toast({
        title: "❌ Error de conexión",
        description: "No se pudieron cargar las secciones. Verifica tu conexión.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!clerkUser) {
      toast({
        title: "❌ Error de autenticación",
        description: "Debes estar autenticado para hacer una donación",
        variant: "destructive",
      })
      return
    }

    if (formData.amount <= 0) {
      toast({
        title: "❌ Monto inválido",
        description: "El monto debe ser mayor a 0",
        variant: "destructive",
      })
      return
    }

    if (!formData.sectionId) {
      toast({
        title: "❌ Sección requerida",
        description: "Debes seleccionar una sección para tu donación",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Obtener el usuario de la base de datos para obtener su ID
      const userResponse = await fetch(`/api/users/role/${clerkUser.id}`)
      
      if (!userResponse.ok) {
        throw new Error('Usuario no encontrado en la base de datos')
      }

      const userData = await userResponse.json()

      // Crear la donación
      const donationResponse = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: formData.amount,
          description: formData.description,
          isAnonymous: formData.isAnonymous,
          sectionId: formData.sectionId,
          userId: userData.id,
          donorName: formData.isAnonymous ? 'Donante Anónimo' : clerkUser.fullName || 'Usuario',
          donorEmail: formData.isAnonymous ? null : clerkUser.emailAddresses[0]?.emailAddress
        })
      })

      if (donationResponse.ok) {
        toast({
          title: "✅ Donación enviada exitosamente",
          description: "Tu donación ha sido registrada y será revisada por los administradores",
          variant: "success",
        })
        
        // Limpiar el formulario
        setFormData({
          amount: 0,
          description: '',
          isAnonymous: false,
          sectionId: ''
        })
      } else {
        const error = await donationResponse.json()
        throw new Error(error.error || 'Error al crear la donación')
      }
    } catch (error) {
      console.error('Error creating donation:', error)
      toast({
        title: "❌ Error al enviar donación",
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSectionIcon = (sectionName: string) => {
    switch (sectionName.toLowerCase()) {
      case 'vestimenta':
        return <Shirt className="h-5 w-5" />
      case 'materiales de estudio':
        return <BookOpen className="h-5 w-5" />
      case 'festivas':
        return <Gift className="h-5 w-5" />
      default:
        return <Heart className="h-5 w-5" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hacer una Donación</h2>
          <p className="text-muted-foreground">
            Cargando secciones de donación...
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Hacer una Donación</h2>
        <p className="text-muted-foreground">
          Contribuye con la comunidad universitaria donando a diferentes causas
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Formulario de donación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Nueva Donación
            </CardTitle>
            <CardDescription>
              Completa los datos para enviar tu donación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Monto de la donación</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  required
                />
                {formData.amount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(formData.amount)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Sección de donación</Label>
                <Select
                  value={formData.sectionId}
                  onValueChange={(value) => setFormData({ ...formData, sectionId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una sección" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        <div className="flex items-center gap-2">
                          {getSectionIcon(section.name)}
                          {section.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.sectionId && (
                  <p className="text-sm text-muted-foreground">
                    {sections.find(s => s.id === formData.sectionId)?.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe tu donación, tipo de artículo, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) => setFormData({ ...formData, isAnonymous: checked })}
                />
                <Label htmlFor="anonymous">Donación anónima</Label>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || formData.amount <= 0 || !formData.sectionId}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Donación
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Información sobre las secciones */}
        <Card>
          <CardHeader>
            <CardTitle>Secciones de Donación</CardTitle>
            <CardDescription>
              Conoce las diferentes áreas donde puedes contribuir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  {getSectionIcon(section.name)}
                </div>
                <div>
                  <h4 className="font-medium">{section.name}</h4>
                  {section.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {section.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Proceso de Donación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <h4 className="font-medium mb-1">Envío</h4>
              <p className="text-sm text-muted-foreground">
                Completa el formulario y envía tu donación
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-yellow-600 font-bold text-sm">2</span>
              </div>
              <h4 className="font-medium mb-1">Revisión</h4>
              <p className="text-sm text-muted-foreground">
                Los administradores revisarán tu donación
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold text-sm">3</span>
              </div>
              <h4 className="font-medium mb-1">Confirmación</h4>
              <p className="text-sm text-muted-foreground">
                Recibirás notificación cuando sea confirmada
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
