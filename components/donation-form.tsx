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
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

const donationSchema = z.object({
  amount: z.number().min(1, "El monto debe ser mayor a 0"),
  description: z.string().optional(),
  isAnonymous: z.boolean().default(false)
})

type DonationFormData = z.infer<typeof donationSchema>

interface DonationFormProps {
  sectionName: string
  sectionDescription: string
  sectionId: string
  onSuccess?: () => void
}

export function DonationForm({ sectionName, sectionDescription, sectionId, onSuccess }: DonationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 0,
      description: "",
      isAnonymous: false
    }
  })

  const onSubmit = async (data: DonationFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simular envío de donación
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log("Donación enviada:", {
        sectionId,
        ...data
      })
      
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
                Tu donación de <strong>${form.getValues("amount")}</strong> para <strong>{sectionName}</strong> ha sido enviada correctamente.
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
          <strong>{sectionName}</strong> - {sectionDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto de la Donación</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Ingresa el monto"
              {...form.register("amount", { valueAsNumber: true })}
              className={form.formState.errors.amount ? "border-red-500" : ""}
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (Opcional)</Label>
            <Textarea
              id="description"
              placeholder="Describe tu donación o agrega comentarios..."
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
            {isSubmitting ? "Enviando Donación..." : "Enviar Donación"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
