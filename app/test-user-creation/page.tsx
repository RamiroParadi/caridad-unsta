"use client"

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestUserCreationPage() {
  const { user: clerkUser, isLoaded } = useUser()
  const [isCreating, setIsCreating] = useState(false)
  const [creationResult, setCreationResult] = useState<{
    success: boolean
    message: string
    user?: {
      id: string
      email: string
      name: string
      role: string
      createdAt: string
    }
  } | null>(null)

  const createUserManually = async () => {
    if (!clerkUser) return
    
    setIsCreating(true)
    setCreationResult(null)
    
    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          name: clerkUser.fullName || 'Usuario',
          role: 'ALUMNO'
        })
      })
      
      if (response.ok) {
        const user = await response.json()
        setCreationResult({
          success: true,
          message: 'Usuario creado exitosamente en la base de datos',
          user
        })
      } else {
        const error = await response.json()
        setCreationResult({
          success: false,
          message: error.message || 'Error al crear usuario'
        })
      }
    } catch (error) {
      setCreationResult({
        success: false,
        message: 'Error de conexión'
      })
    } finally {
      setIsCreating(false)
    }
  }

  const checkUserExists = async () => {
    if (!clerkUser) return
    
    try {
      const response = await fetch(`/api/users/role/${clerkUser.id}`)
      
      if (response.ok) {
        const user = await response.json()
        setCreationResult({
          success: true,
          message: 'Usuario ya existe en la base de datos',
          user
        })
      } else {
        setCreationResult({
          success: false,
          message: 'Usuario no existe en la base de datos'
        })
      }
    } catch (error) {
      setCreationResult({
        success: false,
        message: 'Error al verificar usuario'
      })
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!clerkUser) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Prueba de Creación de Usuarios</CardTitle>
            <CardDescription>Debes estar autenticado para probar esta funcionalidad</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Inicia sesión para probar la creación automática de usuarios.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Prueba de Creación de Usuarios</h2>
        <p className="text-muted-foreground">
          Prueba la funcionalidad de creación automática de usuarios
        </p>
      </div>

      {/* Información del usuario de Clerk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Usuario de Clerk
          </CardTitle>
          <CardDescription>
            Información del usuario actualmente autenticado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div>
              <span className="font-medium">ID:</span> {clerkUser.id}
            </div>
            <div>
              <span className="font-medium">Email:</span> {clerkUser.emailAddresses[0]?.emailAddress}
            </div>
            <div>
              <span className="font-medium">Nombre:</span> {clerkUser.fullName || 'No especificado'}
            </div>
            <div>
              <span className="font-medium">Estado:</span> 
              <Badge variant="default" className="ml-2">
                {clerkUser.emailAddresses[0]?.verification?.status || 'No verificado'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones de prueba */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones de Prueba</CardTitle>
          <CardDescription>
            Prueba las diferentes funcionalidades de creación de usuarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={checkUserExists}
              variant="outline"
              disabled={isCreating}
            >
              Verificar si existe en BD
            </Button>
            
            <Button 
              onClick={createUserManually}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear usuario manualmente'
              )}
            </Button>
          </div>

          {/* Resultado */}
          {creationResult && (
            <div className={`p-4 rounded-lg border ${
              creationResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {creationResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  creationResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {creationResult.message}
                </span>
              </div>
              
              {creationResult.user && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <h4 className="font-medium mb-2">Datos del usuario:</h4>
                  <div className="grid gap-1 text-sm">
                    <div><span className="font-medium">ID:</span> {creationResult.user.id}</div>
                    <div><span className="font-medium">Email:</span> {creationResult.user.email}</div>
                    <div><span className="font-medium">Nombre:</span> {creationResult.user.name}</div>
                    <div><span className="font-medium">Rol:</span> {creationResult.user.role}</div>
                    <div><span className="font-medium">Creado:</span> {new Date(creationResult.user.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información sobre webhooks */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Webhooks</CardTitle>
          <CardDescription>
            Para que la creación sea completamente automática
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p>Para configurar la creación automática de usuarios:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Ve a tu dashboard de Clerk</li>
              <li>Webhooks → Create Endpoint</li>
              <li>URL: <code className="bg-gray-100 px-2 py-1 rounded">https://tu-dominio.com/api/webhooks/clerk</code></li>
              <li>Subscribe to: <code className="bg-gray-100 px-2 py-1 rounded">user.created</code>, <code className="bg-gray-100 px-2 py-1 rounded">user.updated</code></li>
              <li>Copia el &apos;Signing Secret&apos; a <code className="bg-gray-100 px-2 py-1 rounded">CLERK_WEBHOOK_SECRET</code> en tu .env.local</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
