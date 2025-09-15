"use client"

import { StudentSidebar } from "@/components/student-sidebar"
import { Separator } from "@/components/ui/separator"
import { CustomUserButton } from "@/components/custom-user-button"
import { ChevronDown, GraduationCap, Shield, Bell, Menu, X, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useUserProfile } from "@/lib/hooks/use-user-profile"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"

interface StudentLayoutProps {
  children: React.ReactNode
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { userInfo, isLoading } = useUserProfile()
  const { user: clerkUser } = useUser()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }
  return (
    <div className="h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex flex-col">
      {/* Navbar mejorado */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-blue-600/50 bg-gradient-to-r from-blue-800 to-blue-900 px-6 w-full shadow-lg backdrop-blur-sm">
        {/* Botón toggle del sidebar */}
        <button
          onClick={toggleSidebar}
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all duration-200 flex items-center justify-center"
        >
          {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </button>
        
        <div className="flex items-center gap-4">
          {/* Avatar y nombre del usuario */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white to-blue-100 flex items-center justify-center shadow-md overflow-hidden">
              {clerkUser?.imageUrl ? (
                <Image
                  src={clerkUser.imageUrl}
                  alt="Foto de perfil"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-blue-800" />
              )}
            </div>
            <div className="text-white">
              <p className="text-sm font-semibold">
                {isLoading ? 'Cargando...' : (userInfo?.name || 'Usuario')}
              </p>
              <p className="text-xs text-blue-200">
                {isLoading ? 'Cargando...' : (userInfo?.studentCode || 'Sin código')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Controles del header */}
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* Campanita de notificaciones */}
            <Link 
              href="/dashboards/usuario/notificaciones"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg group"
            >
              <Bell className="h-4 w-4 group-hover:animate-pulse" />
            </Link>
            
            <Link 
              href="/dashboards/admin"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <CustomUserButton />
          </div>
        </div>
      </header>
      
      {/* Contenido principal con sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar collapsed={sidebarCollapsed} />
        <div className={`flex-1 flex flex-col gap-6 p-6 bg-white overflow-auto transition-all duration-300 ${
          sidebarCollapsed ? 'ml-0' : ''
        }`}>
          {children}
        </div>
      </div>
    </div>
  )
}
