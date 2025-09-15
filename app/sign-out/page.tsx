"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SignOutPage() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    
    try {
      // Limpiar cualquier dato local
      localStorage.clear()
      sessionStorage.clear()
      
      // Disparar evento personalizado para notificar el cambio
      window.dispatchEvent(new Event('localStorageChange'))
      
      // Pequeña pausa para mostrar el estado
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Redirigir usando window.location para evitar problemas de estado
      window.location.href = '/welcome'
    } catch (error) {
      console.error('Error durante sign out:', error)
      // Fallback: redirigir de todas formas
      window.location.href = '/welcome'
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center text-white">
        <div className="bg-blue-800/50 rounded-lg p-8 backdrop-blur-sm">
          <LogOut className="h-12 w-12 mx-auto mb-4 text-blue-300" />
          <h1 className="text-2xl font-bold mb-4">¿Estás seguro?</h1>
          <p className="text-blue-200 mb-6">
            ¿Querés cerrar sesión de CARIDAD UNSTA?
          </p>
          <div className="space-y-3">
            <Button 
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isSigningOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cerrando sesión...
                </>
              ) : (
                'Sí, Cerrar Sesión'
              )}
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-blue-300 text-blue-200 hover:bg-blue-700"
              onClick={handleCancel}
              disabled={isSigningOut}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
