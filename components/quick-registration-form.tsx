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
import { ArrowLeft, CheckCircle, User, Mail, Calendar, Zap } from "lucide-react"
import { useUserInfo } from "@/lib/hooks/use-user-info"

const quickRegistrationSchema = z.object({
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  emergencyContact: z.string().min(2, "Contacto de emergencia requerido"),
  emergencyPhone: z.string().min(10, "Teléfono de emergencia requerido"),
  motivation: z.string().min(10, "Cuéntanos por qué quieres participar (mínimo 10 caracteres)"),
  agreeTerms: z.boolean().refine(val => val === true, "Debes aceptar los términos y condiciones"),
  agreePhoto: z.boolean()
})

type QuickRegistrationFormData = z.infer<typeof quickRegistrationSchema>

interface QuickRegistrationFormProps {
  eventId: string
  eventTitle: string
  onBackAction: () => void
  onSuccessAction?: () => void
}

export function QuickRegistrationForm({ eventId, eventTitle, onBackAction, onSuccessAction }: QuickRegistrationFormProps) { 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { userInfo, isLoaded } = useUserInfo()

  const form = useForm<QuickRegistrationFormData>({
    resolver: zodResolver(quickRegistrationSchema),
    defaultValues: {
      phone: "",
      emergencyContact: "",
      emergencyPhone: "",
      motivation: "",
      agreeTerms: false,
      agreePhoto: false
    }
  })

  const onSubmit = async (data: QuickRegistrationFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simular envío de inscripción
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log("Inscripción rápida enviada:", {
        eventId,
        eventTitle,
        userInfo,
        ...data
      })
      
      setIsSuccess(true)
      form.reset()
      
      if (onSuccessAction) {
        onSuccessAction()
      }
    } catch (error) {
      console.error("Error al inscribirse al evento:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del usuario...</p>
        </CardContent>
      </Card>
    )
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
                onClick={onBackAction}
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
          <Button variant="ghost" onClick={onBackAction} className="p-0 h-auto text-blue-600 hover:text-blue-800">
            Volver a Eventos
          </Button>
        </CardTitle>
        <CardDescription>
          <strong>Inscripción Rápida a: {eventTitle}</strong> - Solo necesitamos algunos datos adicionales para completar tu inscripción.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Información del usuario */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <User className="h-5 w-5" />
            Tu Información
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-blue-700">
              <User className="h-4 w-4" />
              <span><strong>Nombre:</strong> {userInfo?.fullName}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <Mail className="h-4 w-4" />
              <span><strong>Email:</strong> {userInfo?.email}</span>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Esta información se utilizará automáticamente para tu inscripción.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Datos adicionales requeridos */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Datos Adicionales Requeridos
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
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

          {/* Motivación */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Motivación
            </h4>

            <div className="space-y-2">
              <Label htmlFor="motivation">¿Por qué quieres participar? *</Label>
              <Textarea
                id="motivation"
                placeholder="Cuéntanos qué te motiva a participar en este evento de caridad..."
                {...form.register("motivation")}
                rows={3}
                className={form.formState.errors.motivation ? "border-red-500" : ""}
              />
              {form.formState.errors.motivation && (
                <p className="text-sm text-red-500">{form.formState.errors.motivation.message}</p>
              )}
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
            {isSubmitting ? "Inscribiéndote..." : "Confirmar Inscripción"}
          </Button>
        </form>

        {/* Información adicional */}
        <div className="mt-6 pt-6 border-t">
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Inscripción Simplificada</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Usamos tu información de perfil automáticamente</li>
              <li>• Solo necesitas completar datos adicionales</li>
              <li>• Recibirás confirmación por email</li>
              <li>• Proceso más rápido y sencillo</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
