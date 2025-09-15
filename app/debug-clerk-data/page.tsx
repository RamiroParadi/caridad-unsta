"use client"

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugClerkData() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return <div className="p-4">Cargando...</div>
  }

  if (!user) {
    return <div className="p-4">No hay usuario logueado</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Debug de Datos de Clerk
          </h1>
          <p className="text-blue-200 text-center">
            Verificar qué datos están llegando desde Clerk
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Datos Completos de Clerk</CardTitle>
            <CardDescription>
              Información del usuario desde Clerk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Información Básica:</h3>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Full Name:</strong> {user.fullName || 'No definido'}</p>
                  <p><strong>First Name:</strong> {user.firstName || 'No definido'}</p>
                  <p><strong>Last Name:</strong> {user.lastName || 'No definido'}</p>
                  <p><strong>Username:</strong> {user.username || 'No definido'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Emails:</h3>
                <div className="bg-gray-100 p-3 rounded-lg">
                  {user.emailAddresses.map((email, index) => (
                    <p key={index}>
                      <strong>Email {index + 1}:</strong> {email.emailAddress}
                      {email.verification?.status && (
                        <span className="ml-2 text-sm text-gray-600">
                          ({email.verification.status})
                        </span>
                      )}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Datos JSON Completos:</h3>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}