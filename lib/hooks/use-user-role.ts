"use client"

import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export type UserRole = 'ADMIN' | 'ALUMNO'

interface User {
  email: string
  name: string
  role: UserRole
}

export function useUserRole() {
  const { user: clerkUser, isLoaded } = useUser()
  const [userRole, setUserRole] = useState<UserRole>('ALUMNO')
  const [isLoading, setIsLoading] = useState(true)
  const [userExists, setUserExists] = useState<boolean>(true)


  useEffect(() => {
    const fetchUserRole = async () => {
      if (isLoaded && clerkUser) {
        try {
          const clerkId = clerkUser.id
          const userEmail = clerkUser.emailAddresses[0]?.emailAddress || ''
          
          // Mejorar la extracción del nombre
          let userName = ''
          if (clerkUser.fullName) {
            userName = clerkUser.fullName
          } else if (clerkUser.firstName && clerkUser.lastName) {
            userName = `${clerkUser.firstName} ${clerkUser.lastName}`
          } else if (clerkUser.firstName) {
            userName = clerkUser.firstName
          } else if (clerkUser.lastName) {
            userName = clerkUser.lastName
          } else if (clerkUser.username) {
            userName = clerkUser.username
          } else {
            userName = 'Usuario'
          }
          
          console.log('🔍 Datos del usuario de Clerk:', { clerkId, userEmail, userName })

          // Validar que tenemos los datos mínimos necesarios
          if (!clerkId) {
            console.error('❌ No se encontró ClerkId')
            setUserRole('ALUMNO')
            setIsLoading(false)
            return
          }

          // Intentar obtener el rol desde la base de datos
          const response = await fetch(`/api/users/role/${clerkId}`)
          
          if (response.ok) {
            const data = await response.json()
            setUserRole(data.role)
            setUserExists(true)
          } else if (response.status === 404) {
            // Si no existe en la DB, no crear automáticamente
            console.log('Usuario no encontrado en BD', { clerkId, email: userEmail, name: userName })
            setUserExists(false)
            setUserRole('ALUMNO') // Rol por defecto para mostrar la interfaz
          } else {
            console.error('Error obteniendo rol de usuario:', response.status)
            setUserExists(false)
            setUserRole('ALUMNO') // Fallback
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
          // Fallback a rol ALUMNO si hay error
          setUserRole('ALUMNO')
          setUserExists(false)
        }
        setIsLoading(false)
      } else if (isLoaded && !clerkUser) {
        // No hay usuario autenticado
        setUserRole('ALUMNO')
        setUserExists(false)
        setIsLoading(false)
      }
    }

    fetchUserRole()
  }, [isLoaded, clerkUser])

  const user: User | null = clerkUser ? {
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    name: clerkUser.fullName || '',
    role: userRole
  } : null

  const isAdmin = userRole === 'ADMIN'
  const isStudent = userRole === 'ALUMNO'
  const isAuthenticated = !!clerkUser && isLoaded

  return {
    user,
    isAdmin,
    isStudent,
    isAuthenticated,
    userExists,
    isLoading: !isLoaded || isLoading
  }
}
