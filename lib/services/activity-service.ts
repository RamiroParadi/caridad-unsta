import { prisma } from '@/lib/prisma'

export interface CreateActivityData {
  title: string
  description?: string
  date: Date
  location?: string
  maxParticipants?: number
}

export interface UpdateActivityData {
  title?: string
  description?: string
  date?: Date
  location?: string
  maxParticipants?: number
  isActive?: boolean
}

export class ActivityService {
  // Crear nueva actividad
  static async createActivity(data: CreateActivityData) {
    return await prisma.activity.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location,
        maxParticipants: data.maxParticipants
      }
    })
  }

  // Obtener todas las actividades
  static async getAllActivities() {
    return await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })
  }

  // Obtener actividades activas
  static async getActiveActivities() {
    return await prisma.activity.findMany({
      where: { isActive: true },
      orderBy: { date: 'asc' },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })
  }

  // Obtener actividades por rango de fechas
  static async getActivitiesByDateRange(startDate: Date, endDate: Date, activeOnly: boolean = true) {
    const whereClause: {
      date: {
        gte: Date
        lte: Date
      }
      isActive?: boolean
    } = {
      date: {
        gte: startDate,
        lte: endDate
      }
    }

    if (activeOnly) {
      whereClause.isActive = true
    }

    return await prisma.activity.findMany({
      where: whereClause,
      orderBy: { date: 'asc' },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })
  }

  // Obtener actividad por ID
  static async getActivityById(id: string) {
    return await prisma.activity.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })
  }

  // Actualizar actividad
  static async updateActivity(id: string, data: UpdateActivityData) {
    return await prisma.activity.update({
      where: { id },
      data
    })
  }

  // Eliminar actividad
  static async deleteActivity(id: string) {
    return await prisma.activity.delete({
      where: { id }
    })
  }

  // Unirse a una actividad
  static async joinActivity(userId: string, activityId: string) {
    return await prisma.activityParticipant.create({
      data: {
        userId,
        activityId
      }
    })
  }

  // Salir de una actividad
  static async leaveActivity(userId: string, activityId: string) {
    return await prisma.activityParticipant.delete({
      where: {
        userId_activityId: {
          userId,
          activityId
        }
      }
    })
  }

  // Verificar si el usuario ya está en la actividad
  static async isUserInActivity(userId: string, activityId: string): Promise<boolean> {
    const participant = await prisma.activityParticipant.findUnique({
      where: {
        userId_activityId: {
          userId,
          activityId
        }
      }
    })
    return !!participant
  }
}
