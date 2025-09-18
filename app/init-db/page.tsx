"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, CheckCircle, AlertCircle } from "lucide-react"

export default function InitDbPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data?: unknown
  } | null>(null)

  const initializeDatabase = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/init-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Database className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            Inicializar Base de Datos
          </CardTitle>
          <CardDescription className="text-gray-600">
            Configura la base de datos con datos iniciales
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Este proceso creará:
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Usuario administrador (admin@unsta.edu.ar)</li>
              <li>Secciones de donación</li>
              <li>Actividades de ejemplo</li>
            </ul>
          </div>

          <Button 
            onClick={initializeDatabase}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Inicializando...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Inicializar Base de Datos
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
                    {result.success ? '¡Éxito!' : 'Error'}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message || result.error}
                  </p>
                  
                  {result.adminUser && (
                    <div className="mt-3 p-3 bg-green-100 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Usuario Administrador Creado:</p>
                      <p className="text-sm text-green-700">Email: {result.adminUser.email}</p>
                      <p className="text-sm text-green-700">Código: {result.adminUser.studentCode}</p>
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
        </CardContent>
      </Card>
    </div>
  )
}
