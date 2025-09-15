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
import { ArrowLeft, CheckCircle, BookOpen, Clock, Users, MapPin } from "lucide-react"
import Link from "next/link"

const tutoringSchema = z.object({
  subjects: z.string().min(5, "Especifica las materias que puedes enseñar"),
  experience: z.string().min(10, "Describe tu experiencia académica"),
  availability: z.string().min(5, "Especifica tu disponibilidad horaria"),
  location: z.string().optional(),
  contactMethod: z.string().min(5, "Especifica cómo prefieres que te contacten"),
  additionalInfo: z.string().optional()
})

type TutoringFormData = z.infer<typeof tutoringSchema>

export function TutoringVolunteerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<TutoringFormData>({
    resolver: zodResolver(tutoringSchema),
    defaultValues: {
      subjects: "",
      experience: "",
      availability: "",
      location: "",
      contactMethod: "",
      additionalInfo: ""
    }
  })

  const onSubmit = async (data: TutoringFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simular envío de solicitud
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log("Solicitud de tutoría enviada:", data)
      
      setIsSuccess(true)
      form.reset()
    } catch (error) {
      console.error("Error al enviar solicitud:", error)
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
              <h3 className="text-xl font-bold text-green-800">¡Solicitud Enviada!</h3>
              <p className="text-green-600 mt-2">
                Tu solicitud para ser tutor voluntario ha sido enviada correctamente.
              </p>
              <p className="text-sm text-green-500 mt-2">
                El equipo de administración revisará tu solicitud y te contactará pronto.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                Enviar Otra Solicitud
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
          <Link href="/dashboards/usuario/donaciones/materiales" className="text-blue-600 hover:text-blue-800">
            Volver
          </Link>
        </CardTitle>
        <CardDescription>
          <strong>Tutoría Voluntaria</strong> - Ofrece tu conocimiento para ayudar a otros estudiantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subjects">Materias que puedes enseñar</Label>
            <Textarea
              id="subjects"
              placeholder="Ej: Matemáticas (álgebra, geometría), Física, Química, Inglés, Historia..."
              {...form.register("subjects")}
              rows={3}
              className={form.formState.errors.subjects ? "border-red-500" : ""}
            />
            {form.formState.errors.subjects && (
              <p className="text-sm text-red-500">{form.formState.errors.subjects.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experiencia académica</Label>
            <Textarea
              id="experience"
              placeholder="Ej: Estudiante de Ingeniería en 3er año, promedio 8.5, experiencia ayudando a compañeros..."
              {...form.register("experience")}
              rows={3}
              className={form.formState.errors.experience ? "border-red-500" : ""}
            />
            {form.formState.errors.experience && (
              <p className="text-sm text-red-500">{form.formState.errors.experience.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Disponibilidad horaria</Label>
            <Textarea
              id="availability"
              placeholder="Ej: Lunes a viernes de 18:00 a 20:00, sábados de 10:00 a 12:00..."
              {...form.register("availability")}
              rows={2}
              className={form.formState.errors.availability ? "border-red-500" : ""}
            />
            {form.formState.errors.availability && (
              <p className="text-sm text-red-500">{form.formState.errors.availability.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación preferida (Opcional)</Label>
            <Input
              id="location"
              placeholder="Ej: Biblioteca universitaria, mi casa, online..."
              {...form.register("location")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactMethod">Método de contacto preferido</Label>
            <Textarea
              id="contactMethod"
              placeholder="Ej: WhatsApp: +54 9 11 1234-5678, Email: miemail@unsta.edu.ar..."
              {...form.register("contactMethod")}
              rows={2}
              className={form.formState.errors.contactMethod ? "border-red-500" : ""}
            />
            {form.formState.errors.contactMethod && (
              <p className="text-sm text-red-500">{form.formState.errors.contactMethod.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Información adicional (Opcional)</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Cualquier información adicional que consideres relevante..."
              {...form.register("additionalInfo")}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando Solicitud..." : "Enviar Solicitud de Tutoría"}
          </Button>
        </form>

        {/* Información adicional */}
        <div className="mt-6 pt-6 border-t">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              ¿Cómo funciona el voluntariado de tutorías?
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Los estudiantes necesitados podrán contactarte directamente</li>
              <li>• Puedes elegir qué materias enseñar y cuándo</li>
              <li>• Es completamente voluntario y gratuito</li>
              <li>• Recibirás reconocimiento por tu contribución</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
