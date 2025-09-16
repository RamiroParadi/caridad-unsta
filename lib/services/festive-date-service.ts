import { prisma } from '../prisma'

export interface CreateFestiveDateData {
  name: string
  description: string
  startDate: Date
  endDate: Date
  isEnabled?: boolean
  icon?: string
  gradient?: string
  bgGradient?: string
  items?: string[]
  sectionId?: string
}

export interface UpdateFestiveDateData {
  name?: string
  description?: string
  startDate?: Date
  endDate?: Date
  isEnabled?: boolean
  icon?: string
  gradient?: string
  bgGradient?: string
  items?: string[]
  sectionId?: string
}

export class FestiveDateService {
  // Crear nueva fecha festiva
  static async createFestiveDate(data: CreateFestiveDateData) {
    return await prisma.festiveDate.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        isEnabled: data.isEnabled || false,
        icon: data.icon || 'heart',
        gradient: data.gradient || 'from-purple-500 to-pink-600',
        bgGradient: data.bgGradient || 'from-purple-50 to-pink-50',
        items: data.items || ['Elementos varios'],
        sectionId: data.sectionId
      }
    })
  }

  // Obtener todas las fechas festivas
  static async getAllFestiveDates() {
    return await prisma.festiveDate.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  // Obtener fechas festivas habilitadas
  static async getEnabledFestiveDates() {
    return await prisma.festiveDate.findMany({
      where: { isEnabled: true },
      orderBy: { startDate: 'asc' }
    })
  }

  // Obtener fecha festiva por ID
  static async getFestiveDateById(id: string) {
    return await prisma.festiveDate.findUnique({
      where: { id }
    })
  }

  // Actualizar fecha festiva
  static async updateFestiveDate(id: string, data: UpdateFestiveDateData) {
    return await prisma.festiveDate.update({
      where: { id },
      data
    })
  }

  // Eliminar fecha festiva
  static async deleteFestiveDate(id: string) {
    return await prisma.festiveDate.delete({
      where: { id }
    })
  }

  // Buscar fecha festiva por nombre
  static async getFestiveDateByName(name: string) {
    return await prisma.festiveDate.findFirst({
      where: { 
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    })
  }

  // Migrar datos existentes desde memoria
  static async migrateExistingData(existingData: Record<string, any>) {
    const results = []
    
    for (const [id, festiveDate] of Object.entries(existingData)) {
      try {
        // Verificar si ya existe
        const existing = await prisma.festiveDate.findFirst({
          where: { name: festiveDate.name }
        })

        if (!existing) {
          const created = await prisma.festiveDate.create({
            data: {
              name: festiveDate.name,
              description: festiveDate.description,
              startDate: new Date(festiveDate.startDate),
              endDate: new Date(festiveDate.endDate),
              isEnabled: festiveDate.isEnabled,
              icon: festiveDate.icon,
              gradient: festiveDate.gradient,
              bgGradient: festiveDate.bgGradient,
              items: festiveDate.items,
              sectionId: festiveDate.sectionId
            }
          })
          results.push({ id, migrated: true, festiveDate: created })
        } else {
          results.push({ id, migrated: false, reason: 'Already exists' })
        }
      } catch (error) {
        results.push({ id, migrated: false, error: error.message })
      }
    }
    
    return results
  }
}
