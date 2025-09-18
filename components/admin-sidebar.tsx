"use client"

import * as React from "react"
import { Home, Bell, Heart, Activity, Users, ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface MenuItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  subItems?: {
    title: string
    url: string
  }[]
}

const items: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboards/admin",
    icon: Home,
  },
  {
    title: "Usuarios",
    url: "/dashboards/admin/usuarios",
    icon: Users,
  },
  {
    title: "Donaciones",
    url: "/dashboards/admin/donaciones",
    icon: Heart,
    subItems: [
      {
        title: "Vestimenta",
        url: "/dashboards/admin/donaciones/vestimenta",
      },
      {
        title: "Materiales de Estudio",
        url: "/dashboards/admin/donaciones/materiales",
      },
      {
        title: "Festivas",
        url: "/dashboards/admin/donaciones/festivas",
      },
    ],
  },
  {
    title: "Notificaciones",
    url: "/dashboards/admin/notificaciones",
    icon: Bell,
  },
  {
    title: "Actividades",
    url: "/dashboards/admin/actividades",
    icon: Activity,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (url: string) => {
    if (url === "/dashboards/admin/donaciones") {
      return pathname.startsWith(url)
    }
    return pathname === url
  }

  const isSubItemActive = (url: string) => {
    return pathname === url
  }

  return (
    <Sidebar className="border-r bg-gray-50/50">
      <SidebarHeader className="border-b bg-white">
        <div className="flex items-center gap-2 px-4 py-3">
          <Heart className="h-6 w-6 text-red-500" />
          <span className="font-semibold text-lg text-gray-900">Caridad UNSTA</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Panel de Administración
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <>
                      <SidebarMenuButton 
                        onClick={() => toggleExpanded(item.title)}
                        isActive={isActive(item.url)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {expandedItems.includes(item.title) ? (
                          <ChevronDown className="h-4 w-4 ml-auto" />
                        ) : (
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        )}
                      </SidebarMenuButton>
                      {expandedItems.includes(item.title) && (
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild 
                                isActive={isSubItemActive(subItem.url)}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.url)}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
