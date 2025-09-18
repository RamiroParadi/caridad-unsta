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
import { ArrowLeft, CheckCircle, BookOpen } from "lucide-react"
import Link from "next/link"

const materialDonationSchema = z.object({
  materials: z.string().min(10, "Describe los materiales que vas a donar (mínimo 10 caracteres)"),
  condition: z.string().min(5, "Especifica el estado de los materiales"),
  description: z.string().optional(),
  isAnonymous: z.boolean()
})

type MaterialDonationFormData = z.infer<typeof materialDonationSchema>

interface MaterialDonationFormProps {
  onSuccess?: () => void
}

export function MaterialDonationForm({ onSuccess }: MaterialDonationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<MaterialDonationFormData>({
    resolver: zodResolver(materialDonationSchema),
    defaultValues: {
      materials: "",
      condition: "",
      description: "",
      isAnonymous: false
    }
  })

  const onSubmit = async (data: MaterialDonationFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simular envío de donación
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log("Donación de materiales enviada:", data)
      
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
                Tu donación de materiales de estudio ha sido enviada correctamente.
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
          <Link href="/dashboards/usuario" className="text-blue-600 hover:text-blue-800">
            Volver
          </Link>
        </CardTitle>
        <CardDescription>
          <strong>Donación de Materiales de Estudio</strong> - Contribuye con libros, útiles escolares y material educativo para estudiantes que lo necesitan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="materials">Materiales que vas a donar</Label>
            <Textarea
              id="materials"
              placeholder="Ej: 5 libros de matemáticas de secundaria, 10 cuadernos de 48 hojas, 3 diccionarios, 2 calculadoras científicas, 15 lapiceras azules, 1 mochila escolar..."
              {...form.register("materials")}
              rows={4}
              className={form.formState.errors.materials ? "border-red-500" : ""}
            />
            {form.formState.errors.materials && (
              <p className="text-sm text-red-500">{form.formState.errors.materials.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Sé específico sobre qué materiales donas, cantidades y niveles educativos
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Estado de los materiales</Label>
            <Textarea
              id="condition"
              placeholder="Ej: Libros en excelente estado, sin subrayar, páginas completas. Útiles nuevos o en buen estado..."
              {...form.register("condition")}
              rows={3}
              className={form.formState.errors.condition ? "border-red-500" : ""}
            />
            {form.formState.errors.condition && (
              <p className="text-sm text-red-500">{form.formState.errors.condition.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Describe el estado general de los materiales (nuevos, usados, nivel de conservación)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Información adicional (Opcional)</Label>
            <Textarea
              id="description"
              placeholder="Nivel educativo, materias específicas, horarios de entrega, instrucciones especiales..."
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
            {isSubmitting ? "Enviando Donación..." : "Enviar Donación de Materiales"}
          </Button>
        </form>

        {/* Información sobre requisitos */}
        <div className="mt-6 pt-6 border-t">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Requisitos para donaciones de materiales de estudio
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Los libros deben estar en buen estado, sin páginas faltantes</li>
              <li>• Útiles escolares pueden ser nuevos o usados en buen estado</li>
              <li>• Aceptamos materiales para todos los niveles educativos</li>
              <li>• Los libros de texto deben ser actualizados</li>
              <li>• Calculadoras y equipos electrónicos deben funcionar correctamente</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}