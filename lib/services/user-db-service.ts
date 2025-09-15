import { prisma } from '../prisma'
import { UserRole } from '@/app/generated/prisma'

export interface CreateUserData {
  clerkId: string
  email: string
  name: string
  role?: UserRole
}

export interface UpdateUserRoleData {
  role: UserRole
}

export interface UpdateUserData {
  email?: string
  name?: string
}

export class UserDbService {
  /**
   * Crear un nuevo usuario en la base de datos
   */
  static async createUser(data: CreateUserData) {
    try {
      const user = await prisma.user.create({
        data: {
          clerkId: data.clerkId,
          email: data.email,
          name: data.name,
          role: data.role || UserRole.ALUMNO
        }
      })
      return user
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  /**
   * Obtener usuario por Clerk ID
   */
  static async getUserByClerkId(clerkId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId }
      })
      return user
    } catch (error) {
      console.error('Error fetching user by clerkId:', error)
      throw error
    }
  }

  /**
   * Actualizar usuario por Clerk ID
   */
  static async updateUser(clerkId: string, data: UpdateUserData) {
    try {
      const user = await prisma.user.update({
        where: { clerkId },
        data
      })
      return user
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  /**
   * Obtener usuario por email
   */
  static async getUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      })
      return user
    } catch (error) {
      console.error('Error fetching user by email:', error)
      throw error
    }
  }

  /**
   * Actualizar rol de usuario
   */
  static async updateUserRole(clerkId: string, role: UserRole) {
    try {
      const user = await prisma.user.update({
        where: { clerkId },
        data: { role }
      })
      return user
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  }

  /**
   * Obtener todos los usuarios
   */
  static async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return users
    } catch (error) {
      console.error('Error fetching all users:', error)
      throw error
    }
  }

  /**
   * Obtener usuarios por rol
   */
  static async getUsersByRole(role: UserRole) {
    try {
      const users = await prisma.user.findMany({
        where: { role },
        orderBy: { createdAt: 'desc' }
      })
      return users
    } catch (error) {
      console.error('Error fetching users by role:', error)
      throw error
    }
  }

  /**
   * Verificar si un usuario es administrador
   */
  static async isUserAdmin(clerkId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId },
        select: { role: true }
      })
      return user?.role === UserRole.ADMIN
    } catch (error) {
      console.error('Error checking if user is admin:', error)
      return false
    }
  }

  /**
   * Crear o actualizar usuario (para sincronización con Clerk)
   */
  static async createOrUpdateUser(data: CreateUserData) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { clerkId: data.clerkId }
      })

      if (existingUser) {
        // Actualizar usuario existente
        return await prisma.user.update({
          where: { clerkId: data.clerkId },
          data: {
            email: data.email,
            name: data.name
          }
        })
      } else {
        // Crear nuevo usuario
        return await prisma.user.create({
          data: {
            clerkId: data.clerkId,
            email: data.email,
            name: data.name,
            role: data.role || UserRole.ALUMNO
          }
        })
      }
    } catch (error) {
      console.error('Error creating or updating user:', error)
      throw error
    }
  }

  /**
   * Eliminar usuario
   */
  static async deleteUser(clerkId: string) {
    try {
      await prisma.user.delete({
        where: { clerkId }
      })
      return true
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }
}
