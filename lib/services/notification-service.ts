import { prisma } from '@/lib/prisma'
import { NotificationType } from '@/app/generated/prisma'

export interface CreateNotificationData {
  userId?: string
  title: string
  message: string
  type?: NotificationType
  isGlobal?: boolean
}

export interface UpdateNotificationData {
  title?: string
  message?: string
  type?: NotificationType
  isActive?: boolean
}

export class NotificationService {
  // Crear nueva notificación
  static async createNotification(data: CreateNotificationData) {
    return await prisma.notification.create({
      data: {
        userId: data.isGlobal ? null : data.userId,
        title: data.title,
        message: data.message,
        type: data.type || NotificationType.GENERAL,
        isGlobal: data.isGlobal || false
      }
    })
  }

  // Crear notificación para todos los usuarios
  static async createNotificationForAllUsers(title: string, message: string, type?: NotificationType) {
    const users = await prisma.user.findMany({
      select: { id: true }
    })

    const notifications = await Promise.all(
      users.map(user =>
        prisma.notification.create({
          data: {
            userId: user.id,
            title,
            message,
            type: type || NotificationType.GENERAL
          }
        })
      )
    )

    return notifications
  }

  // Obtener notificaciones por usuario (incluye globales y personales)
  static async getNotificationsByUser(userId: string) {
    return await prisma.notification.findMany({
      where: {
        OR: [
          { userId: userId }, // Notificaciones personales
          { isGlobal: true }  // Notificaciones globales
        ]
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Obtener notificaciones activas por usuario (incluye globales y personales)
  static async getActiveNotificationsByUser(userId: string) {
    return await prisma.notification.findMany({
      where: {
        OR: [
          { userId: userId, isActive: true }, // Notificaciones personales activas
          { isGlobal: true, isActive: true }  // Notificaciones globales activas
        ]
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Obtener todas las notificaciones
  static async getAllNotifications() {
    return await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  // Obtener notificación por ID
  static async getNotificationById(id: string) {
    return await prisma.notification.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  // Actualizar notificación
  static async updateNotification(id: string, data: UpdateNotificationData) {
    return await prisma.notification.update({
      where: { id },
      data
    })
  }

  // Eliminar notificación
  static async deleteNotification(id: string) {
    return await prisma.notification.delete({
      where: { id }
    })
  }

  // Marcar notificación como inactiva
  static async deactivateNotification(id: string) {
    return await prisma.notification.update({
      where: { id },
      data: { isActive: false }
    })
  }

  // Obtener estadísticas de notificaciones
  static async getNotificationStats() {
    const totalNotifications = await prisma.notification.count()
    const activeNotifications = await prisma.notification.count({
      where: { isActive: true }
    })
    const notificationsByType = await prisma.notification.groupBy({
      by: ['type'],
      _count: { type: true }
    })

    return {
      totalNotifications,
      activeNotifications,
      notificationsByType
    }
  }
}
