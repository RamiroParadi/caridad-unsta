"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

interface UserInfo {
  id: string
  name: string
  email: string
  studentCode: string | null
  role: string
}

export function useUserProfile() {
  const { user: clerkUser, isLoaded } = useUser()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isLoaded && clerkUser) {
        try {
          const clerkId = clerkUser.id
          console.log('🔄 Fetching user profile, trigger:', refreshTrigger)
          const response = await fetch(`/api/users/role/${clerkId}`)
          
          if (response.ok) {
            const data = await response.json()
            console.log('📥 Datos cargados del servidor:', data)
            
            // Construir el nombre completo de Clerk
            let clerkFullName = clerkUser.fullName
            if (!clerkFullName && (clerkUser.firstName || clerkUser.lastName)) {
              clerkFullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim()
            }
            
            // Usar el nombre completo de Clerk si está disponible, sino usar el de la BD
            const displayName = clerkFullName || data.name || 'Usuario'
            console.log('👤 Clerk fullName:', clerkUser.fullName)
            console.log('👤 Clerk firstName:', clerkUser.firstName)
            console.log('👤 Clerk lastName:', clerkUser.lastName)
            console.log('👤 Nombre construido:', clerkFullName)
            console.log('👤 Nombre de BD:', data.name)
            console.log('👤 Nombre final:', displayName)
            
            setUserInfo({
              id: data.id,
              name: displayName,
              email: data.email,
              studentCode: data.studentCode,
              role: data.role
            })
          } else {
            // Si no existe en la DB, usar datos de Clerk
            let clerkFullName = clerkUser.fullName
            if (!clerkFullName && (clerkUser.firstName || clerkUser.lastName)) {
              clerkFullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim()
            }
            
            setUserInfo({
              id: clerkId,
              name: clerkFullName || 'Usuario',
              email: clerkUser.emailAddresses[0]?.emailAddress || '',
              studentCode: null,
              role: 'ALUMNO'
            })
          }
        } catch (error) {
          console.error('Error obteniendo perfil de usuario:', error)
          // Fallback a datos de Clerk
          let clerkFullName = clerkUser.fullName
          if (!clerkFullName && (clerkUser.firstName || clerkUser.lastName)) {
            clerkFullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim()
          }
          
          setUserInfo({
            id: clerkUser.id,
            name: clerkFullName || 'Usuario',
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            studentCode: null,
            role: 'ALUMNO'
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchUserProfile()
  }, [clerkUser, isLoaded, refreshTrigger])

  const updateStudentCode = async (studentCode: string) => {
    console.log('🔄 Actualizando código de estudiante:', studentCode)
    try {
      const response = await fetch('/api/users/update-student-code', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentCode }),
      })

      console.log('📡 Respuesta de la API:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Datos recibidos:', data)
        
        // Actualizar el estado local inmediatamente
        setUserInfo(prev => {
          const newState = prev ? { ...prev, studentCode: data.user.studentCode } : null
          console.log('🔄 Estado anterior:', prev?.studentCode)
          console.log('🔄 Estado nuevo:', newState?.studentCode)
          return newState
        })
        
        // Forzar refresco de datos desde el servidor
        console.log('🔄 Forzando refresco de datos...')
        setRefreshTrigger(prev => prev + 1)
        
        console.log('🔄 Estado actualizado:', data.user.studentCode)
        return { success: true }
      } else {
        const error = await response.json()
        console.error('❌ Error de la API:', error)
        return { success: false, error: error.error }
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error)
      return { success: false, error: 'Error de conexión' }
    }
  }

  const refreshUserData = () => {
    console.log('🔄 Refrescando datos del usuario manualmente...')
    setRefreshTrigger(prev => prev + 1)
  }

  return {
    userInfo,
    isLoading,
    isLoaded,
    updateStudentCode,
    refreshUserData
  }
}
