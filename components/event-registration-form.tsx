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
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CheckCircle, User, Phone, Mail, Calendar } from "lucide-react"

const eventRegistrationSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  emergencyContact: z.string().min(2, "Contacto de emergencia requerido"),
  emergencyPhone: z.string().min(10, "Teléfono de emergencia requerido"),
  experience: z.string().optional(),
  motivation: z.string().min(10, "Cuéntanos por qué quieres participar (mínimo 10 caracteres)"),
  specialNeeds: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, "Debes aceptar los términos y condiciones"),
  agreePhoto: z.boolean().default(false)
})

type EventRegistrationFormData = z.infer<typeof eventRegistrationSchema>

interface EventRegistrationFormProps {
  eventId: string
  eventTitle: string
  onBack: () => void
  onSuccess?: () => void
}

export function EventRegistrationForm({ eventId, eventTitle, onBack, onSuccess }: EventRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<EventRegistrationFormData>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      emergencyContact: "",
      emergencyPhone: "",
      experience: "",
      motivation: "",
      specialNeeds: "",
      agreeTerms: false,
      agreePhoto: false
    }
  })

  const onSubmit = async (data: EventRegistrationFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simular envío de inscripción
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log("Inscripción a evento enviada:", {
        eventId,
        eventTitle,
        ...data
      })
      
      setIsSuccess(true)
      form.reset()
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error al inscribirse al evento:", error)
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
              <h3 className="text-xl font-bold text-green-800">¡Inscripción Exitosa!</h3>
              <p className="text-green-600 mt-2">
                Te has inscrito correctamente al evento <strong>{eventTitle}</strong>.
              </p>
              <p className="text-sm text-green-500 mt-2">
                Recibirás un email de confirmación con todos los detalles del evento.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                Inscribirse a Otro Evento
              </Button>
              <Button 
                onClick={onBack}
                className="bg-green-600 hover:bg-green-700"
              >
                Volver a Eventos
              </Button>
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
            Volver a Eventos
          </Button>
        </CardTitle>
        <CardDescription>
          <strong>Inscripción a: {eventTitle}</strong> - Completa el formulario para participar en este evento de caridad.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <Input
                  id="fullName"
                  placeholder="Tu nombre completo"
                  {...form.register("fullName")}
                  className={form.formState.errors.fullName ? "border-red-500" : ""}
                />
                {form.formState.errors.fullName && (
                  <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  {...form.register("email")}
                  className={form.formState.errors.email ? "border-red-500" : ""}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  placeholder="+54 9 11 1234-5678"
                  {...form.register("phone")}
                  className={form.formState.errors.phone ? "border-red-500" : ""}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contacto de Emergencia *</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Nombre del contacto"
                  {...form.register("emergencyContact")}
                  className={form.formState.errors.emergencyContact ? "border-red-500" : ""}
                />
                {form.formState.errors.emergencyContact && (
                  <p className="text-sm text-red-500">{form.formState.errors.emergencyContact.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="emergencyPhone">Teléfono de Emergencia *</Label>
                <Input
                  id="emergencyPhone"
                  placeholder="+54 9 11 1234-5678"
                  {...form.register("emergencyPhone")}
                  className={form.formState.errors.emergencyPhone ? "border-red-500" : ""}
                />
                {form.formState.errors.emergencyPhone && (
                  <p className="text-sm text-red-500">{form.formState.errors.emergencyPhone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Experiencia y Motivación */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Experiencia y Motivación
            </h4>

            <div className="space-y-2">
              <Label htmlFor="experience">Experiencia Previa (Opcional)</Label>
              <Textarea
                id="experience"
                placeholder="¿Has participado en eventos similares antes? Cuéntanos tu experiencia..."
                {...form.register("experience")}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation">¿Por qué quieres participar? *</Label>
              <Textarea
                id="motivation"
                placeholder="Cuéntanos qué te motiva a participar en este evento de caridad..."
                {...form.register("motivation")}
                rows={4}
                className={form.formState.errors.motivation ? "border-red-500" : ""}
              />
              {form.formState.errors.motivation && (
                <p className="text-sm text-red-500">{form.formState.errors.motivation.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialNeeds">Necesidades Especiales (Opcional)</Label>
              <Textarea
                id="specialNeeds"
                placeholder="Si tienes alguna necesidad especial o restricción, por favor compártela con nosotros..."
                {...form.register("specialNeeds")}
                rows={2}
              />
            </div>
          </div>

          {/* Términos y Condiciones */}
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeTerms"
                {...form.register("agreeTerms")}
                className={form.formState.errors.agreeTerms ? "border-red-500" : ""}
              />
              <div className="space-y-1">
                <Label htmlFor="agreeTerms" className="text-sm">
                  Acepto los términos y condiciones del evento *
                </Label>
                {form.formState.errors.agreeTerms && (
                  <p className="text-sm text-red-500">{form.formState.errors.agreeTerms.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreePhoto"
                {...form.register("agreePhoto")}
              />
              <Label htmlFor="agreePhoto" className="text-sm">
                Autorizo el uso de mi imagen en fotografías del evento (opcional)
              </Label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando Inscripción..." : "Confirmar Inscripción"}
          </Button>
        </form>

        {/* Información adicional */}
        <div className="mt-6 pt-6 border-t">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Información Importante</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Recibirás un email de confirmación con todos los detalles</li>
              <li>• Te contactaremos si necesitamos información adicional</li>
              <li>• Puedes cancelar tu participación hasta 24 horas antes del evento</li>
              <li>• Trae ropa cómoda y una actitud positiva</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
