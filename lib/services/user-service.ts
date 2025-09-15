import { prisma } from '@/lib/prisma'
import { UserRole } from '../../app/generated/prisma'

export interface CreateUserData {
  clerkId: string
  email: string
  name: string
  role?: UserRole
}

export interface UpdateUserData {
  name?: string
  role?: UserRole
}

export class UserService {
  // Crear un nuevo usuario
  static async createUser(data: CreateUserData) {
    return await prisma.user.create({
      data: {
        clerkId: data.clerkId,
        email: data.email,
        name: data.name,
        role: data.role || UserRole.ALUMNO
      }
    })
  }

  // Obtener usuario por Clerk ID
  static async getUserByClerkId(clerkId: string) {
    return await prisma.user.findUnique({
      where: { clerkId }
    })
  }

  // Obtener usuario por email
  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    })
  }

  // Actualizar usuario
  static async updateUser(id: string, data: UpdateUserData) {
    return await prisma.user.update({
      where: { id },
      data
    })
  }

  // Obtener todos los usuarios
  static async getAllUsers() {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  // Eliminar usuario
  static async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id }
    })
  }

  // Verificar si el usuario es administrador
  static async isAdmin(clerkId: string): Promise<boolean> {
    const user = await this.getUserByClerkId(clerkId)
    return user?.role === UserRole.ADMIN
  }
}
