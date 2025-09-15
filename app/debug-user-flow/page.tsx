"use client"

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/hooks/use-user-role'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Shield, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function DebugUserFlowPage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const { user, isAdmin, isStudent, isAuthenticated, isLoading } = useUserRole()

  if (!clerkLoaded) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Cargando Clerk...</p>
        </div>
      </div>
    )
  }

  if (!clerkUser) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              No autenticado
            </CardTitle>
            <CardDescription>Debes estar autenticado para ver esta página</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/sign-in">Ir al Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Debug del Flujo de Usuario</h2>
        <p className="text-muted-foreground">
          Información de debug para verificar el flujo de autenticación y roles
        </p>
      </div>

      {/* Estado de Clerk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Estado de Clerk
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div>
              <span className="font-medium">Cargado:</span> 
              <Badge variant={clerkLoaded ? "default" : "secondary"} className="ml-2">
                {clerkLoaded ? "Sí" : "No"}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Autenticado:</span> 
              <Badge variant={isAuthenticated ? "default" : "destructive"} className="ml-2">
                {isAuthenticated ? "Sí" : "No"}
              </Badge>
            </div>
            <div>
              <span className="font-medium">ID Clerk:</span> 
              <code className="bg-gray-100 px-2 py-1 rounded text-sm ml-2">
                {clerkUser.id}
              </code>
            </div>
            <div>
              <span className="font-medium">Email:</span> {clerkUser.emailAddresses[0]?.emailAddress}
            </div>
            <div>
              <span className="font-medium">Nombre:</span> {clerkUser.fullName || 'No especificado'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado del Hook useUserRole */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Estado del Hook useUserRole
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div>
              <span className="font-medium">Cargando:</span> 
              <Badge variant={isLoading ? "secondary" : "default"} className="ml-2">
                {isLoading ? "Sí" : "No"}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Rol:</span> 
              <Badge variant={isAdmin ? "default" : isStudent ? "secondary" : "destructive"} className="ml-2">
                {user?.role || 'No definido'}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Es Admin:</span> 
              <Badge variant={isAdmin ? "default" : "secondary"} className="ml-2">
                {isAdmin ? "Sí" : "No"}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Es Estudiante:</span> 
              <Badge variant={isStudent ? "default" : "secondary"} className="ml-2">
                {isStudent ? "Sí" : "No"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones de Prueba */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones de Prueba</CardTitle>
          <CardDescription>
            Prueba diferentes rutas del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button asChild>
              <a href="/dashboards/usuario">Dashboard Usuario</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/dashboards/admin">Dashboard Admin</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/test-user-creation">Test Creación Usuario</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estado Final */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isAuthenticated && !isLoading ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            Estado Final
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {isAuthenticated && !isLoading ? (
              <div className="text-green-600">
                ✅ Usuario autenticado correctamente y listo para usar el sistema
              </div>
            ) : (
              <div className="text-yellow-600">
                ⏳ Cargando información del usuario...
              </div>
            )}
            
            {user?.role && (
              <div className="text-sm text-gray-600">
                El usuario debería ser redirigido a: 
                <code className="bg-gray-100 px-2 py-1 rounded ml-2">
                  {isAdmin ? '/dashboards/admin' : '/dashboards/usuario'}
                </code>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
