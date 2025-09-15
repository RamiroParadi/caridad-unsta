"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserProfile } from "@/lib/hooks/use-user-profile"

export default function DebugUserPage() {
  const { user } = useUser()
  const { userInfo, refreshUserData } = useUserProfile()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const verifyUser = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/users/verify')
      const data = await response.json()
      console.log('🔍 Datos del usuario:', data)
      setUserData(data)
    } catch (error) {
      console.error('❌ Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Debug de Usuario
          </h1>
          <p className="text-blue-200 text-center">
            Verificar estado del usuario en la base de datos
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Clerk</CardTitle>
              <CardDescription>
                Datos del usuario desde Clerk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>ID:</strong> {user?.id}</p>
                <p><strong>Nombre:</strong> {user?.fullName}</p>
                <p><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hook useUserProfile</CardTitle>
              <CardDescription>
                Datos del usuario desde el hook (frontend)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>ID:</strong> {userInfo?.id}</p>
                <p><strong>Nombre:</strong> {userInfo?.name}</p>
                <p><strong>Email:</strong> {userInfo?.email}</p>
                <p><strong>Código:</strong> {userInfo?.studentCode || 'Sin código'}</p>
                <p><strong>Rol:</strong> {userInfo?.role}</p>
              </div>
              <div className="mt-4">
                <Button onClick={refreshUserData} variant="outline">
                  🔄 Refrescar Datos del Hook
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verificar en Base de Datos</CardTitle>
              <CardDescription>
                Comprobar si el usuario existe en la BD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={verifyUser} disabled={loading}>
                {loading ? 'Verificando...' : 'Verificar Usuario'}
              </Button>
              
              {userData && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Resultado:</h3>
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(userData, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
