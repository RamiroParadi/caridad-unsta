"use client"

import { useUserRole } from "@/lib/hooks/use-user-role"
import { UserNotFound } from "@/components/user-not-found"
import { Loader2 } from "lucide-react"

interface UserExistenceGuardProps {
  children: React.ReactNode
}

export function UserExistenceGuard({ children }: UserExistenceGuardProps) {
  const { user, isLoading, userExists, isAuthenticated } = useUserRole()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verificando usuario...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // El ProtectedRoute se encargará de la redirección
  }

  if (!userExists) {
    return <UserNotFound userEmail={user?.email} />
  }

  return <>{children}</>
}
