"use client"

import { useUserRole } from "@/lib/hooks/use-user-role"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: ('ADMIN' | 'ALUMNO')[]
  fallbackUrl?: string
}

export function ProtectedRoute({ children, allowedRoles, fallbackUrl = '/dashboards/usuario' }: ProtectedRouteProps) {
  const { user, isAdmin, isStudent, isAuthenticated, isLoading } = useUserRole()
  const router = useRouter()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Usar window.location para una redirección más directa
        window.location.href = '/sign-in'
        return
      }

      const userRole = user?.role
      if (userRole && !allowedRoles.includes(userRole)) {
        // Usar window.location para una redirección más directa
        window.location.href = fallbackUrl
        return
      }

      // Si llegamos aquí, el usuario tiene permisos
      setShouldRender(true)
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, fallbackUrl])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  const userRole = user?.role
  if (userRole && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
        <Card className="max-w-md bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">Acceso Denegado</h2>
            <p className="text-red-600 mb-4">
              No tenés permisos para acceder a esta sección.
            </p>
            <p className="text-sm text-red-500 mb-4">
              Tu rol actual: <strong>{userRole}</strong>
            </p>
            <Button 
              onClick={() => window.location.href = fallbackUrl}
              className="bg-red-600 hover:bg-red-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!shouldRender) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Cargando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
