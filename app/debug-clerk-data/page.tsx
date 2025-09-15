"use client"

import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, AlertCircle, CheckCircle, Loader2, Copy } from "lucide-react"
import { useState } from 'react'

export default function DebugClerkDataPage() {
  const { user: clerkUser, isLoaded } = useUser()
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Cargando datos de Clerk...</p>
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
            <CardDescription>Debes estar autenticado para ver esta información</CardDescription>
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

  const clerkData = {
    id: clerkUser.id,
    fullName: clerkUser.fullName,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    emailAddresses: clerkUser.emailAddresses,
    primaryEmailAddressId: clerkUser.primaryEmailAddressId,
    primaryEmailAddress: clerkUser.primaryEmailAddress,
    username: clerkUser.username,
    imageUrl: clerkUser.imageUrl,
    createdAt: clerkUser.createdAt,
    updatedAt: clerkUser.updatedAt,
    lastSignInAt: clerkUser.lastSignInAt,
    hasImage: clerkUser.hasImage,
    publicMetadata: clerkUser.publicMetadata,
    unsafeMetadata: clerkUser.unsafeMetadata,
    privateMetadata: clerkUser.privateMetadata
  }

  const primaryEmail = clerkUser.emailAddresses.find(email => email.id === clerkUser.primaryEmailAddressId)
  const extractedData = {
    clerkId: clerkUser.id,
    email: primaryEmail?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || '',
    name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Usuario',
    role: 'ALUMNO'
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Debug de Datos de Clerk</h2>
        <p className="text-muted-foreground">
          Información detallada del usuario autenticado en Clerk
        </p>
      </div>

      {/* Datos Extraídos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Datos Extraídos para Crear Usuario
          </CardTitle>
          <CardDescription>
            Los datos que se enviarían a la API de creación de usuario
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(extractedData).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <span className="font-medium">{key}:</span>
                <span className="ml-2 text-sm text-muted-foreground break-all">
                  {value || <span className="text-red-500 italic">(vacío)</span>}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(String(value), key)}
              >
                <Copy className="h-4 w-4" />
                {copiedField === key ? 'Copiado!' : 'Copiar'}
              </Button>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">JSON para API:</h4>
            <pre className="text-xs bg-white p-2 rounded border overflow-auto">
              {JSON.stringify(extractedData, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Datos Completos de Clerk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Datos Completos de Clerk
          </CardTitle>
          <CardDescription>
            Todos los datos disponibles del objeto user de Clerk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(clerkData).map(([key, value]) => (
              <div key={key} className="p-3 border rounded-lg">
                <div className="font-medium text-sm mb-1">{key}:</div>
                <div className="text-xs text-muted-foreground break-all">
                  {typeof value === 'object' ? (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                  ) : (
                    String(value || <span className="text-red-500 italic">(vacío)</span>)
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Acciones de Prueba */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones de Prueba</CardTitle>
          <CardDescription>
            Prueba la creación de usuario con los datos actuales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={async () => {
              try {
                const response = await fetch('/api/users/create', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(extractedData)
                })
                
                if (response.ok) {
                  const result = await response.json()
                  alert('Usuario creado exitosamente: ' + JSON.stringify(result, null, 2))
                } else {
                  const error = await response.text()
                  alert('Error: ' + error)
                }
              } catch (error) {
                alert('Error: ' + error)
              }
            }}
          >
            Probar Creación de Usuario
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
