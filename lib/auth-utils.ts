import { UserService } from './services/user-service'
import { UserRole } from '../app/generated/prisma'

export async function getOrCreateUser(clerkId: string, email: string, name: string) {
  try {
    // Intentar obtener el usuario existente
    let user = await UserService.getUserByClerkId(clerkId)
    
    if (!user) {
      // Si no existe, crear uno nuevo
      user = await UserService.createUser({
        clerkId,
        email,
        name,
        role: UserRole.ALUMNO // Por defecto todos son alumnos
      })
    }
    
    return user
  } catch (error) {
    console.error('Error al obtener/crear usuario:', error)
    throw error
  }
}

export async function getUserRole(clerkId: string): Promise<UserRole> {
  try {
    const user = await UserService.getUserByClerkId(clerkId)
    return user?.role || UserRole.ALUMNO
  } catch (error) {
    console.error('Error al obtener rol del usuario:', error)
    return UserRole.ALUMNO
  }
}

export async function isUserAdmin(clerkId: string): Promise<boolean> {
  try {
    return await UserService.isAdmin(clerkId)
  } catch (error) {
    console.error('Error al verificar si es admin:', error)
    return false
  }
}
