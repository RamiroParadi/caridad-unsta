"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Shirt } from "lucide-react"
import Link from "next/link"

const clothingDonationSchema = z.object({
  clothing: z.string().min(10, "Describe la ropa que vas a donar (mínimo 10 caracteres)"),
  condition: z.string().min(5, "Especifica el estado de la ropa"),
  description: z.string().optional(),
  isAnonymous: z.boolean()
})

type ClothingDonationFormData = z.infer<typeof clothingDonationSchema>

interface ClothingDonationFormProps {
  onSuccess?: () => void
}

export function ClothingDonationForm({ onSuccess }: ClothingDonationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ClothingDonationFormData>({
    resolver: zodResolver(clothingDonationSchema),
    defaultValues: {
      clothing: "",
      condition: "",
      description: "",
      isAnonymous: false
    }
  })

  const onSubmit = async (data: ClothingDonationFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simular envío de donación
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log("Donación de vestimenta enviada:", data)
      
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
                Tu donación de vestimenta ha sido enviada correctamente.
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
          <strong>Donación de Vestimenta</strong> - Ayuda a vestir a familias necesitadas con ropa en buen estado, zapatos y accesorios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clothing">Ropa que vas a donar</Label>
            <Textarea
              id="clothing"
              placeholder="Ej: 3 camisetas talla M, 2 pantalones jeans talla 32, 1 abrigo de invierno, 2 pares de zapatillas talla 40..."
              {...form.register("clothing")}
              rows={4}
              className={form.formState.errors.clothing ? "border-red-500" : ""}
            />
            {form.formState.errors.clothing && (
              <p className="text-sm text-red-500">{form.formState.errors.clothing.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Sé específico sobre qué prendas vas a donar, tallas y cantidades
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Estado de la ropa</Label>
            <Textarea
              id="condition"
              placeholder="Ej: Ropa en excelente estado, lavada y planchada, sin manchas ni roturas..."
              {...form.register("condition")}
              rows={3}
              className={form.formState.errors.condition ? "border-red-500" : ""}
            />
            {form.formState.errors.condition && (
              <p className="text-sm text-red-500">{form.formState.errors.condition.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Describe el estado general de las prendas (limpia, sin manchas, etc.)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Información adicional (Opcional)</Label>
            <Textarea
              id="description"
              placeholder="Horarios de entrega, instrucciones especiales, si necesita ser recogida..."
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
            {isSubmitting ? "Enviando Donación..." : "Enviar Donación de Vestimenta"}
          </Button>
        </form>

        {/* Información sobre requisitos */}
        <div className="mt-6 pt-6 border-t">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Shirt className="h-4 w-4" />
              Requisitos para donaciones de vestimenta
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• La ropa debe estar limpia y en buen estado</li>
              <li>• Sin manchas, roturas o desgaste excesivo</li>
              <li>• Los artículos íntimos deben ser nuevos</li>
              <li>• Aceptamos ropa para todas las edades</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
