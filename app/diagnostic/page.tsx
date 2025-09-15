"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle, Database, User, RefreshCw } from "lucide-react"

export default function DiagnosticPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runDiagnostic = async () => {
    setIsLoading(true)
    setResults(null)

    try {
      // Verificar estado de la base de datos
      const dbResponse = await fetch('/api/restore-db')
      const dbData = await dbResponse.json()

      // Verificar si podemos crear un usuario de prueba
      const testUserResponse = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: 'test-clerk-id',
          email: 'test@unsta.edu.ar',
          name: 'Usuario de Prueba',
          role: 'ALUMNO',
          studentCode: 'TEST001'
        })
      })

      const testUserData = await testUserResponse.ok ? await testUserResponse.json() : null

      setResults({
        database: dbData,
        testUser: testUserData,
        testUserSuccess: testUserResponse.ok
      })
    } catch (error) {
      setResults({
        error: 'Error ejecutando diagnóstico',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <AlertCircle className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            Diagnóstico del Sistema
          </CardTitle>
          <CardDescription className="text-gray-600">
            Verifica el estado de la base de datos y las APIs
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button 
            onClick={runDiagnostic}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Ejecutando diagnóstico...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Ejecutar Diagnóstico
              </>
            )}
          </Button>

          {results && (
            <div className="space-y-4">
              {/* Estado de la Base de Datos */}
              <div className={`rounded-lg p-4 ${
                results.database?.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  {results.database?.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      results.database?.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      Base de Datos
                    </h3>
                    <p className={`text-sm mt-1 ${
                      results.database?.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {results.database?.message || results.database?.error || 'Estado desconocido'}
                    </p>
                    
                    {results.database?.adminUser && (
                      <div className="mt-3 p-3 bg-green-100 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Usuario Administrador:</p>
                        <p className="text-sm text-green-700">📧 {results.database.adminUser.email}</p>
                        <p className="text-sm text-green-700">🔑 {results.database.adminUser.studentCode}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Estado de la API de Usuarios */}
              <div className={`rounded-lg p-4 ${
                results.testUserSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  {results.testUserSuccess ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      results.testUserSuccess ? 'text-green-800' : 'text-red-800'
                    }`}>
                      API de Usuarios
                    </h3>
                    <p className={`text-sm mt-1 ${
                      results.testUserSuccess ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {results.testUserSuccess ? 'API funcionando correctamente' : 'Error en la API de usuarios'}
                    </p>
                    
                    {results.testUser && (
                      <div className="mt-3 p-3 bg-green-100 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Usuario de Prueba Creado:</p>
                        <p className="text-sm text-green-700">📧 {results.testUser.email}</p>
                        <p className="text-sm text-green-700">🔑 {results.testUser.studentCode}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Errores */}
              {results.error && (
                <div className="rounded-lg p-4 bg-red-50 border border-red-200">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-800">Error</h3>
                      <p className="text-sm text-red-700">{results.error}</p>
                      {results.details && (
                        <p className="text-xs text-red-600 mt-2">
                          Detalles: {results.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Próximos pasos */}
              {results.database?.success && results.testUserSuccess && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">✅ Sistema funcionando correctamente</p>
                  <ol className="text-sm text-blue-700 mt-2 list-decimal list-inside space-y-1">
                    <li>Ve a <a href="/sign-in" className="underline">Iniciar Sesión</a></li>
                    <li>Usa el email: admin@unsta.edu.ar</li>
                    <li>Regístrate o inicia sesión con Clerk</li>
                    <li>El sistema creará automáticamente tu usuario</li>
                  </ol>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
