"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, UserPlus } from "lucide-react"
import Link from "next/link"

interface UserNotFoundProps {
  userEmail?: string
}

export function UserNotFound({ userEmail }: UserNotFoundProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            Usuario No Encontrado
          </CardTitle>
          <CardDescription className="text-gray-600">
            Tu cuenta no está registrada en el sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {userEmail && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Email:</span> {userEmail}
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Para acceder al sistema, necesitas que un administrador te registre primero.
            </p>
            
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                <strong>¿Qué hacer ahora?</strong>
              </p>
              <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Contacta a un administrador</li>
                <li>Proporciona tu información para el registro</li>
                <li>Espera a que se complete tu registro</li>
              </ul>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button 
              asChild 
              className="flex-1"
              variant="outline"
            >
              <Link href="/sign-in">
                Volver al Login
              </Link>
            </Button>
            
            <Button 
              asChild 
              className="flex-1"
            >
              <Link href="/contact">
                <UserPlus className="h-4 w-4 mr-2" />
                Contactar Admin
              </Link>
            </Button>
          </div>
          
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              ¿Eres un administrador? 
              <Link href="/admin/register" className="text-blue-600 hover:text-blue-700 ml-1">
                Registra usuarios aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
