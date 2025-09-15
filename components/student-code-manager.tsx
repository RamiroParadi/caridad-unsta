"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Save, Edit3, Check, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function StudentCodeManager() {
  const { user } = useUser()
  const [studentCode, setStudentCode] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Cargar el código de estudiante actual
  useEffect(() => {
    const loadStudentCode = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/users/role/${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setStudentCode(data.studentCode || "")
        }
      } catch (error) {
        console.error('Error cargando código de estudiante:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStudentCode()
  }, [user])

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/users/update-student-code', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentCode: studentCode.trim() }),
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Código de estudiante actualizado correctamente"
        })
        setIsEditing(false)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Error al actualizar el código",
          variant: "destructive"
        })
      }
    } catch (error) {
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
    // Recargar el valor original
    const loadOriginalValue = async () => {
      if (!user) return
      try {
        const response = await fetch(`/api/users/role/${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setStudentCode(data.studentCode || "")
        }
      } catch (error) {
        console.error('Error cargando valor original:', error)
      }
    }
    loadOriginalValue()
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Código de Estudiante
          </CardTitle>
          <CardDescription>
            Cargando información...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Código de Estudiante
        </CardTitle>
        <CardDescription>
          Tu código de identificación en la universidad
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="studentCode">Código de Estudiante</Label>
          <div className="flex gap-2">
            <Input
              id="studentCode"
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
        </div>

        {studentCode && !isEditing && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Código actual:</strong> {studentCode}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>• Este código se mostrará en tu perfil y en el sistema</p>
          <p>• Puedes editarlo en cualquier momento</p>
          <p>• Si no tienes código, puedes dejarlo vacío</p>
        </div>
      </CardContent>
    </Card>
  )
}
