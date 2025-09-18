"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Gift, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

const festiveDonationSchema = z.object({
  occasion: z.string().min(1, "Selecciona una ocasión festiva"),
  items: z.string().min(10, "Describe los regalos que vas a donar (mínimo 10 caracteres)"),
  description: z.string().optional(),
  isAnonymous: z.boolean()
})

type FestiveDonationFormData = z.infer<typeof festiveDonationSchema>

interface FestiveDonationFormProps {
  selectedOccasion: string
  onBack: () => void
  onSuccess?: () => void
}

export function FestiveDonationForm({ selectedOccasion, onBack, onSuccess }: FestiveDonationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<FestiveDonationFormData>({
    resolver: zodResolver(festiveDonationSchema),
    defaultValues: {
      occasion: selectedOccasion,
      items: "",
      description: "",
      isAnonymous: false
    }
  })

  const onSubmit = async (data: FestiveDonationFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simular envío de donación
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log("Donación festiva enviada:", data)
      
      setIsSuccess(true)
      form.reset()
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error al enviar donación:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-green-800">¡Donación Enviada!</h3>
              <p className="text-green-600 mt-2">
                Tu donación para <strong>{selectedOccasion}</strong> ha sido enviada correctamente.
              </p>
              <p className="text-sm text-green-500 mt-2">
                Recibirás una confirmación por email una vez que sea procesada.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                Hacer Otra Donación
              </Button>
              <Link href="/dashboards/usuario">
                <Button className="bg-green-600 hover:bg-green-700">
                  Volver al Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          <Button variant="ghost" onClick={onBack} className="p-0 h-auto text-blue-600 hover:text-blue-800">
            Volver a Fechas Festivas
          </Button>
        </CardTitle>
        <CardDescription>
          <strong>Donación para {selectedOccasion}</strong> - Haz que esta fecha especial sea más alegre para quienes más lo necesitan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="items">Regalos que vas a donar</Label>
            <Textarea
              id="items"
              placeholder={`Ej: 5 juguetes educativos, 3 libros de cuentos, 2 peluches, 1 juego de mesa...`}
              {...form.register("items")}
              rows={4}
              className={form.formState.errors.items ? "border-red-500" : ""}
            />
            {form.formState.errors.items && (
              <p className="text-sm text-red-500">{form.formState.errors.items.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Sé específico sobre qué regalos vas a donar y en qué cantidad
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Información adicional (Opcional)</Label>
            <Textarea
              id="description"
              placeholder="Edades recomendadas, instrucciones especiales, horarios de entrega..."
              {...form.register("description")}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAnonymous"
              {...form.register("isAnonymous")}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isAnonymous" className="text-sm">
              Hacer donación anónima
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando Donación..." : `Enviar Donación para ${selectedOccasion}`}
          </Button>
        </form>

        {/* Información sobre la ocasión */}
        <div className="mt-6 pt-6 border-t">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Donación para {selectedOccasion}
            </h4>
            <p className="text-sm text-blue-700">
              Las donaciones festivas son especialmente importantes durante estas fechas especiales. 
              Tu contribución ayudará a que más familias puedan celebrar estas ocasiones.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para mostrar las tarjetas de fechas festivas
export function FestiveOccasionsCards({ onSelectOccasion }: { onSelectOccasion: (occasion: string) => void }) {
  const occasions = [
    {
      id: "navidad",
      name: "Navidad",
      description: "Regalos navideños para niños y familias",
      icon: "🎄",
      color: "bg-red-50 border-red-200 hover:bg-red-100",
      textColor: "text-red-800"
    },
    {
      id: "reyes-magos",
      name: "Reyes Magos",
      description: "Regalos especiales para el Día de Reyes",
      icon: "👑",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      textColor: "text-purple-800"
    },
    {
      id: "dia-del-nino",
      name: "Día del Niño",
      description: "Juguetes y regalos para celebrar a los niños",
      icon: "🎈",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      textColor: "text-blue-800"
    },
    {
      id: "pascuas",
      name: "Pascuas",
      description: "Huevos de Pascua y dulces para la celebración",
      icon: "🐰",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      textColor: "text-green-800"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Fechas Festivas</h2>
        <p className="text-blue-200">Selecciona la ocasión para la que quieres hacer tu donación</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {occasions.map((occasion) => (
          <Card 
            key={occasion.id} 
            className={`cursor-pointer transition-all duration-200 ${occasion.color}`}
            onClick={() => onSelectOccasion(occasion.name)}
          >
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">{occasion.icon}</div>
              <h3 className={`font-bold text-lg mb-2 ${occasion.textColor}`}>
                {occasion.name}
              </h3>
              <p className={`text-sm ${occasion.textColor} opacity-80`}>
                {occasion.description}
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${occasion.textColor} border-current hover:bg-current hover:text-white`}
                >
                  <ArrowRight className="mr-1 h-3 w-3" />
                  Seleccionar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Link href="/dashboards/usuario">
          <Button variant="outline" className="border-blue-300 text-blue-200 hover:bg-blue-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
