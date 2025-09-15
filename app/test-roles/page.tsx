"use client"

import { useUserRole } from "@/lib/hooks/use-user-role"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function TestRolesPage() {
  const { user, isAdmin, isStudent, isAuthenticated, isLoading } = useUserRole()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Cargando información del usuario...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">No estás autenticado</h2>
            <Link href="/sign-in">
              <Button>Ir al Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Información del Usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre:</p>
                <p className="font-medium">{user?.name || 'No disponible'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email:</p>
                <p className="font-medium">{user?.email || 'No disponible'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rol:</p>
                <Badge variant={isAdmin ? "destructive" : "secondary"} className="mt-1">
                  {user?.role || 'No disponible'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado:</p>
                <div className="flex gap-2 mt-1">
                  {isAdmin && <Badge variant="destructive"><Shield className="h-3 w-3 mr-1" />Admin</Badge>}
                  {isStudent && <Badge variant="secondary"><GraduationCap className="h-3 w-3 mr-1" />Alumno</Badge>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Panel de Alumno</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Acceso al dashboard de estudiantes
              </p>
              <Link href="/dashboards/usuario">
                <Button className="w-full" variant={isStudent ? "default" : "outline"}>
                  Ir al Dashboard de Alumno
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Panel de Administrador</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Acceso al dashboard de administración
              </p>
              <Link href="/dashboards/admin">
                <Button 
                  className="w-full" 
                  variant={isAdmin ? "default" : "outline"}
                  disabled={!isAdmin}
                >
                  {isAdmin ? "Ir al Dashboard de Admin" : "Sin permisos"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Pruebas de Acceso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>¿Puede acceder al dashboard de alumno?</strong> 
                <Badge variant={isStudent || isAdmin ? "default" : "destructive"} className="ml-2">
                  {isStudent || isAdmin ? "SÍ" : "NO"}
                </Badge>
              </p>
              <p className="text-sm">
                <strong>¿Puede acceder al dashboard de admin?</strong> 
                <Badge variant={isAdmin ? "default" : "destructive"} className="ml-2">
                  {isAdmin ? "SÍ" : "NO"}
                </Badge>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
