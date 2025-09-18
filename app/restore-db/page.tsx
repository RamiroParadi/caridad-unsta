"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function RestoreDbPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message?: string
    error?: string
    data?: unknown
    details?: string
    adminUser?: { email: string; studentCode: string; name?: string }
  } | null>(null)

  const restoreDatabase = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/restore-db', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: 'Error de conexión',
        error: 'Error de conexión',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <RefreshCw className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            Restaurar Base de Datos
          </CardTitle>
          <CardDescription className="text-gray-600">
            Restaura todos los datos iniciales del sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Este proceso restaurará:
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Usuario administrador (admin@unsta.edu.ar)</li>
              <li>Todas las secciones de donación</li>
              <li>Actividades de ejemplo</li>
              <li>Configuración inicial del sistema</li>
            </ul>
          </div>

          <Button 
            onClick={restoreDatabase}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Restaurando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Restaurar Base de Datos
              </>
            )}
          </Button>

          {result && (
            <div className={`rounded-lg p-4 ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.success ? '¡Restaurado!' : 'Error'}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message || result.error}
                  </p>
                  
                  {result.adminUser && (
                    <div className="mt-3 p-3 bg-green-100 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Usuario Administrador:</p>
                      <p className="text-sm text-green-700">📧 Email: {result.adminUser.email}</p>
                      <p className="text-sm text-green-700">🔑 Código: {result.adminUser.studentCode}</p>
                      <p className="text-sm text-green-700">👤 Nombre: {result.adminUser.name}</p>
                    </div>
                  )}
                  
                  {result.details && (
                    <p className="text-xs text-red-600 mt-2">
                      Detalles: {result.details}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {result?.success && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Próximos pasos:</p>
              <ol className="text-sm text-blue-700 mt-2 list-decimal list-inside space-y-1">
                <li>Ve a <Link href="/sign-in" className="underline">Iniciar Sesión</Link></li>
                <li>Usa el email: admin@unsta.edu.ar</li>
                <li>Regístrate o inicia sesión con Clerk</li>
                <li>¡Ya podrás acceder al sistema!</li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
