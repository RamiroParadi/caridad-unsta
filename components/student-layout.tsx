"use client"

import { StudentSidebar } from "@/components/student-sidebar"
import { Separator } from "@/components/ui/separator"
import { UserButton } from "@clerk/nextjs"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

interface StudentLayoutProps {
  children: React.ReactNode
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="h-screen bg-blue-900 flex flex-col">
      {/* Navbar de ancho completo */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-blue-700 bg-blue-800 px-4 w-full">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-blue-800 font-bold text-sm">👤</span>
            </div>
            <div className="text-white">
              <p className="text-sm font-medium">Ramiro Nadir PARADI ABRAHAM</p>
            </div>
          </div>
          <Separator orientation="vertical" className="mr-2 h-4 bg-blue-600" />
          <div className="flex items-center gap-1 text-white">
            <span className="text-sm">CIA7 0050 - TEC. UNIV EN DES. Y CALIDAD DE SOFTWARE</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-900 px-3 py-1 rounded text-white text-sm font-bold">
              CARIDAD UNSTA
            </div>
            <Link 
              href="/dashboards/admin"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Admin
            </Link>
          </div>
          <UserButton />
        </div>
      </header>
      
      {/* Contenido principal con sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar />
        <div className="flex-1 flex flex-col gap-4 p-4 bg-blue-900 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
