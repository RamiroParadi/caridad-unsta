"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Edit3, Check, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useUserProfile } from "@/lib/hooks/use-user-profile"

export function UserNameField() {
  const { userInfo, isLoading, refreshUserData } = useUserProfile()
  const [userName, setUserName] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Sincronizar con el estado del hook
  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.name || "")
    }
  }, [userInfo])

  const handleSave = async () => {
    if (!userName.trim()) {
      toast({
        title: "Error",
        description: "El nombre no puede estar vacío",
        variant: "destructive"
      })
      return
    }

    console.log('💾 Guardando nombre:', userName)
    setIsSaving(true)
    try {
      const response = await fetch('/api/users/update-name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userName.trim() }),
      })

      console.log('📡 Respuesta de la API:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Datos recibidos:', data)
        
        toast({
          title: "Éxito",
          description: "Nombre actualizado correctamente"
        })
        
        setIsEditing(false)
        // Refrescar los datos
        refreshUserData()
      } else {
        const error = await response.json()
        console.error('❌ Error de la API:', error)
        toast({
          title: "Error",
          description: error.error || "Error al actualizar el nombre",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('❌ Error en handleSave:', error)
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Restaurar el valor original del hook
    setUserName(userInfo?.name || "")
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Nombre Completo</Label>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <User className="h-4 w-4" />
        Nombre Completo
      </Label>
      
      <div className="flex gap-2">
        <Input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Ej: Juan Pérez"
          disabled={!isEditing}
          className="flex-1"
        />
        {isEditing ? (
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="px-3"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="px-3"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="px-3"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {userName && !isEditing && (
        <p className="text-xs text-gray-500">
          Nombre actual: <span className="font-medium">{userName}</span>
        </p>
      )}

      <p className="text-xs text-gray-500">
        Tu nombre completo para identificarte en el sistema
      </p>
    </div>
  )
}
