"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Users, Shield, User, Search, Filter, Download, MoreHorizontal, Calendar, Clock, Home } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  clerkId: string
  email: string
  name: string
  role: 'ADMIN' | 'ALUMNO'
  createdAt: string
  updatedAt: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  
  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'ALUMNO'>('ALL')
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'createdAt' | 'role'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10
  
  // Estados para el modal de confirmación
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null)
  const [newRole, setNewRole] = useState<'ADMIN' | 'ALUMNO' | null>(null)
  
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  // Efecto para filtrar y ordenar usuarios
  useEffect(() => {
    let filtered = [...users]

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por rol
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]

      if (sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredUsers(filtered)
    setCurrentPage(1) // Reset a la primera página cuando cambian los filtros
  }, [users, searchTerm, roleFilter, sortBy, sortOrder])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/users/all')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserRole = async (clerkId: string, newRole: 'ADMIN' | 'ALUMNO') => {
    try {
      setUpdating(clerkId)
      const response = await fetch('/api/users/update-role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId, role: newRole })
      })

      if (response.ok) {
        // Actualizar la lista local
        setUsers(prev => prev.map(user => 
          user.clerkId === clerkId ? { ...user, role: newRole } : user
        ))
        
        // Mostrar toast de éxito
        const user = users.find(u => u.clerkId === clerkId)
        if (user) {
          toast({
            title: "✅ Rol actualizado exitosamente",
            description: `${user.name} ahora es ${newRole === 'ADMIN' ? 'Administrador' : 'Estudiante'}`,
            variant: "success",
          })
        }
      } else {
        const errorData = await response.json()
        console.error('Error updating user role:', errorData.error)
        toast({
          title: "❌ Error al actualizar rol",
          description: errorData.error || 'Error desconocido',
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      toast({
        title: "❌ Error de conexión",
        description: "No se pudo actualizar el rol. Verifica tu conexión.",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
      setShowConfirmDialog(false)
      setUserToUpdate(null)
      setNewRole(null)
    }
  }

  const toggleUserRole = (user: User) => {
    const newRole = user.role === 'ADMIN' ? 'ALUMNO' : 'ADMIN'
    setUserToUpdate(user)
    setNewRole(newRole)
    setShowConfirmDialog(true)
  }

  const confirmRoleChange = () => {
    if (userToUpdate && newRole) {
      updateUserRole(userToUpdate.clerkId, newRole)
    }
  }

  const cancelRoleChange = () => {
    setShowConfirmDialog(false)
    setUserToUpdate(null)
    setNewRole(null)
  }

  // Funciones de paginación
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // Función de exportación
  const exportUsers = () => {
    const csvContent = [
      ['Nombre', 'Email', 'Rol', 'Fecha de Registro', 'Última Actualización'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.role === 'ADMIN' ? 'Administrador' : 'Estudiante',
        new Date(user.createdAt).toLocaleDateString(),
        new Date(user.updatedAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Función para cambiar ordenamiento
  const handleSort = (field: 'name' | 'email' | 'createdAt' | 'role') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const adminCount = users.filter(user => user.role === 'ADMIN').length
  const studentCount = users.filter(user => user.role === 'ALUMNO').length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h2>
          <p className="text-muted-foreground">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h2>
        <p className="text-muted-foreground">
          Administra los roles y permisos de los usuarios del sistema
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de búsqueda y filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Usuarios Registrados</CardTitle>
              <CardDescription>
                {filteredUsers.length} de {users.length} usuarios mostrados
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboards/usuario">
                  <Home className="h-4 w-4 mr-2" />
                  Página Principal
                </Link>
              </Button>
              <Button onClick={exportUsers} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={(value: 'ALL' | 'ADMIN' | 'ALUMNO') => setRoleFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los roles</SelectItem>
                <SelectItem value="ADMIN">Administradores</SelectItem>
                <SelectItem value="ALUMNO">Estudiantes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-') as [typeof sortBy, typeof sortOrder]
              setSortBy(field)
              setSortOrder(order)
            }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Nombre (A-Z)</SelectItem>
                <SelectItem value="name-desc">Nombre (Z-A)</SelectItem>
                <SelectItem value="email-asc">Email (A-Z)</SelectItem>
                <SelectItem value="email-desc">Email (Z-A)</SelectItem>
                <SelectItem value="createdAt-desc">Más recientes</SelectItem>
                <SelectItem value="createdAt-asc">Más antiguos</SelectItem>
                <SelectItem value="role-asc">Rol (A-Z)</SelectItem>
                <SelectItem value="role-desc">Rol (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {currentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Registrado: {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Actualizado: {new Date(user.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.role === 'ADMIN' ? 'Administrador' : 'Estudiante'}
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {user.role === 'ADMIN' ? 'Administrador' : 'Estudiante'}
                    </span>
                    <Switch
                      checked={user.role === 'ADMIN'}
                      onCheckedChange={() => toggleUserRole(user)}
                      disabled={updating === user.clerkId}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    {updating === user.clerkId && (
                      <div className="text-xs text-blue-600">Actualizando...</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length} usuarios
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                
                {/* Números de página */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNumber)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}

          {/* Mensaje cuando no hay resultados */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron usuarios con los filtros aplicados</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSearchTerm('')
                  setRoleFilter('ALL')
                }}
                className="mt-2"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de confirmación para cambio de rol */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cambio de rol</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres cambiar el rol de{' '}
              <strong>{userToUpdate?.name}</strong> a{' '}
              <strong>{newRole === 'ADMIN' ? 'Administrador' : 'Estudiante'}</strong>?
              <br />
              <br />
              Esta acción otorgará o revocará los permisos de administración del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRoleChange}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>
              Confirmar cambio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
