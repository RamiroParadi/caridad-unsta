"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Edit3, Check, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useUserProfile } from "@/lib/hooks/use-user-profile"

export function StudentCodeField() {
  const { userInfo, isLoading, updateStudentCode } = useUserProfile()
  const [studentCode, setStudentCode] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Sincronizar con el estado del hook
  useEffect(() => {
    if (userInfo) {
      setStudentCode(userInfo.studentCode || "")
    }
  }, [userInfo])

  const handleSave = async () => {
    console.log('💾 Guardando código:', studentCode)
    setIsSaving(true)
    try {
      const result = await updateStudentCode(studentCode.trim())
      console.log('📋 Resultado:', result)
      
      if (result.success) {
        toast({
          title: "Éxito",
          description: "Código de estudiante actualizado correctamente"
        })
        setIsEditing(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al actualizar el código",
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
    setStudentCode(userInfo?.studentCode || "")
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Código de Estudiante</Label>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <GraduationCap className="h-4 w-4" />
        Código de Estudiante
      </Label>
      
      <div className="flex gap-2">
        <Input
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value)}
          placeholder="Ej: CIA7 0050"
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

      {studentCode && !isEditing && (
        <p className="text-xs text-gray-500">
          Código actual: <span className="font-medium">{studentCode}</span>
        </p>
      )}

      <p className="text-xs text-gray-500">
        Tu código de identificación en la universidad
      </p>
    </div>
  )
}
