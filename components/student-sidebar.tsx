"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  {
    title: "Inicio",
    url: "/dashboards/usuario",
  },
  {
    title: "Donaciones de Vestimenta",
    url: "/dashboards/usuario/donaciones/vestimenta",
  },
  {
    title: "Materiales de Estudio",
    url: "/dashboards/usuario/donaciones/materiales",
  },
  {
    title: "Donaciones Festivas",
    url: "/dashboards/usuario/donaciones/festivas",
  },
  {
    title: "Donación Monetaria",
    url: "/dashboards/usuario/donaciones/monetarias",
  },
  {
    title: "Notificaciones",
    url: "/dashboards/usuario/notificaciones",
  },
  {
    title: "Eventos de Caridad",
    url: "/dashboards/usuario/eventos",
  },
]

export function StudentSidebar() {
  const pathname = usePathname()
  

  return (
    <div className="w-64 bg-blue-600 text-white h-full flex flex-col font-sans">
      {/* Contenido del sidebar */}
      <div className="flex-1 flex flex-col">
        {items.map((item, index) => (
          <div key={item.title} className="flex-1 flex flex-col">
            <Link href={item.url} className="flex-1 flex items-center">
              <div 
                className={`w-full px-4 py-6 text-center text-white hover:bg-blue-500 transition-all duration-200 flex items-center justify-center ${
                  pathname === item.url ? 'bg-blue-600 shadow-inner' : 'bg-blue-600'
                }`}
              >
                <div className="text-sm font-bold leading-tight tracking-wide">
                  {item.title === "Donaciones de Vestimenta" ? (
                    <>
                      Donaciones de<br />
                      Vestimenta
                    </>
                  ) : item.title === "Materiales de Estudio" ? (
                    <>
                      Materiales de<br />
                      Estudio
                    </>
                  ) : item.title === "Donaciones Festivas" ? (
                    <>
                      Donaciones<br />
                      Festivas
                    </>
                  ) : item.title === "Donación Monetaria" ? (
                    <>
                      Donación<br />
                      Monetaria
                    </>
                  ) : item.title === "Eventos de Caridad" ? (
                    <>
                      Eventos de<br />
                      Caridad
                    </>
                  ) : (
                    item.title
                  )}
                </div>
              </div>
            </Link>
            {index < items.length - 1 && (
              <div className="h-px bg-blue-400"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
