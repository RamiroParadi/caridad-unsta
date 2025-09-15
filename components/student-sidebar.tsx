"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Shirt, 
  BookOpen, 
  PartyPopper, 
  DollarSign, 
  Calendar,
  ChevronRight
} from "lucide-react"

const items = [
  {
    title: "Inicio",
    url: "/dashboards/usuario",
    icon: Home,
    shortTitle: "Inicio"
  },
  {
    title: "Donaciones de Vestimenta",
    url: "/dashboards/usuario/donaciones/vestimenta",
    icon: Shirt,
    shortTitle: "Vestimenta"
  },
  {
    title: "Materiales de Estudio",
    url: "/dashboards/usuario/donaciones/materiales",
    icon: BookOpen,
    shortTitle: "Materiales"
  },
  {
    title: "Donaciones Festivas",
    url: "/dashboards/usuario/donaciones/festivas",
    icon: PartyPopper,
    shortTitle: "Festivas"
  },
  {
    title: "Donación Monetaria",
    url: "/dashboards/usuario/donaciones/monetarias",
    icon: DollarSign,
    shortTitle: "Monetaria"
  },
  {
    title: "Eventos de Caridad",
    url: "/dashboards/usuario/eventos",
    icon: Calendar,
    shortTitle: "Eventos"
  },
]

export function StudentSidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname()
  
  return (
    <div className={`bg-gradient-to-b from-blue-600 to-blue-700 text-white h-full flex flex-col font-sans shadow-xl transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header del sidebar */}
      <div className={`border-b border-blue-500 transition-all duration-300 ${
        collapsed ? 'p-4' : 'p-6'
      }`}>
        {collapsed ? (
          <div className="flex justify-center">
            <div className="bg-white/20 rounded-full p-2">
              <span className="text-lg font-bold">👤</span>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-center">Panel de Usuario</h2>
            <p className="text-xs text-blue-200 text-center mt-1">CARIDAD UNSTA</p>
          </>
        )}
      </div>

      {/* Contenido del sidebar */}
      <div className="flex-1 flex flex-col py-4">
        {items.map((item, index) => {
          const IconComponent = item.icon
          const isActive = pathname === item.url
          
          return (
            <div key={item.title} className={`transition-all duration-300 ${
              collapsed ? 'px-2 mb-1' : 'px-4 mb-2'
            }`}>
              <Link href={item.url} className="block">
                <div 
                  className={`w-full rounded-lg transition-all duration-200 flex items-center group ${
                    collapsed ? 'px-2 py-3 justify-center' : 'px-4 py-4 justify-between'
                  } ${
                    isActive 
                      ? 'bg-white/20 shadow-lg backdrop-blur-sm border border-white/30' 
                      : 'hover:bg-white/10 hover:shadow-md'
                  }`}
                >
                  <div className={`flex items-center transition-all duration-200 ${
                    collapsed ? 'gap-0' : 'gap-3'
                  }`}>
                    <IconComponent 
                      className={`transition-colors duration-200 ${
                        collapsed ? 'h-6 w-6' : 'h-5 w-5'
                      } ${
                        isActive ? 'text-white' : 'text-blue-200 group-hover:text-white'
                      }`} 
                    />
                    {!collapsed && (
                      <span className={`text-sm font-medium transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-blue-100 group-hover:text-white'
                      }`}>
                        {item.shortTitle}
                      </span>
                    )}
                  </div>
                  
                  {!collapsed && isActive && (
                    <ChevronRight className="h-4 w-4 text-white" />
                  )}
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      {/* Footer del sidebar */}
      <div className={`border-t border-blue-500 transition-all duration-300 ${
        collapsed ? 'p-2' : 'p-4'
      }`}>
        {collapsed ? (
          <div className="flex justify-center">
            <div className="bg-white/10 rounded-full p-2">
              <span className="text-xs">UNSTA</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-xs text-blue-200 mb-2">Sistema de Donaciones</div>
            <div className="text-xs text-blue-300">Universidad del Norte Santo Tomás de Aquino</div>
          </div>
        )}
      </div>
    </div>
  )
}
