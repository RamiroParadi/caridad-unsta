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
import { ArrowLeft, Calendar, MapPin, Users, CheckCircle } from "lucide-react"
import Link from "next/link"

const eventSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  date: z.string().min(1, "La fecha es requerida"),
  location: z.string().optional(),
  maxParticipants: z.number().min(1, "Debe permitir al menos 1 participante").optional()
})

type EventFormData = z.infer<typeof eventSchema>

interface EventFormProps {
  onSuccess?: () => void
}

export function EventForm({ onSuccess }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      maxParticipants: undefined
    }
  })

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simular creación de evento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log("Evento creado:", data)
      
      setIsSuccess(true)
      form.reset()
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error al crear evento:", error)
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
              <h3 className="text-xl font-bold text-green-800">¡Evento Creado!</h3>
              <p className="text-green-600 mt-2">
                El evento <strong>"{form.getValues("title")}"</strong> ha sido creado exitosamente.
              </p>
              <p className="text-sm text-green-500 mt-2">
                Los usuarios podrán verlo y unirse desde el dashboard.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                Crear Otro Evento
              </Button>
              <Link href="/dashboards/admin">
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
          <Calendar className="h-5 w-5" />
          Crear Nueva Actividad
        </CardTitle>
        <CardDescription>
          Crea una nueva actividad de caridad para que los usuarios puedan participar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la Actividad</Label>
            <Input
              id="title"
              placeholder="Ej: Recolección de Alimentos"
              {...form.register("title")}
              className={form.formState.errors.title ? "border-red-500" : ""}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe la actividad, qué se hará, qué se necesita..."
              {...form.register("description")}
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha y Hora</Label>
              <Input
                id="date"
                type="datetime-local"
                {...form.register("date")}
                className={form.formState.errors.date ? "border-red-500" : ""}
              />
              {form.formState.errors.date && (
                <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Máximo de Participantes (Opcional)</Label>
              <Input
                id="maxParticipants"
                type="number"
                placeholder="Sin límite"
                {...form.register("maxParticipants", { valueAsNumber: true })}
                className={form.formState.errors.maxParticipants ? "border-red-500" : ""}
              />
              {form.formState.errors.maxParticipants && (
                <p className="text-sm text-red-500">{form.formState.errors.maxParticipants.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación (Opcional)</Label>
            <Input
              id="location"
              placeholder="Ej: Plaza Central, Hospital San Juan..."
              {...form.register("location")}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creando Actividad..." : "Crear Actividad"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
