import { prisma } from '../prisma'
import { DonationStatus } from '@/app/generated/prisma'

export interface CreateDonationData {
  amount: number
  description?: string
  isAnonymous?: boolean
  status?: DonationStatus
  userId: string
  sectionId: string
  donorName: string
  donorEmail?: string
}

export interface UpdateDonationData {
  amount?: number
  description?: string
  isAnonymous?: boolean
  status?: DonationStatus
  donorName?: string
  donorEmail?: string
}

export class DonationDbService {
  /**
   * Crear una nueva donación
   */
  static async createDonation(data: CreateDonationData) {
    try {
      const donation = await prisma.donation.create({
        data: {
          amount: data.amount,
          description: data.description,
          isAnonymous: data.isAnonymous || false,
          status: data.status || DonationStatus.PENDIENTE,
          userId: data.userId,
          sectionId: data.sectionId,
          donorName: data.donorName,
          donorEmail: data.donorEmail,
        },
        include: {
          section: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      })
      return donation
    } catch (error) {
      console.error('Error creating donation:', error)
      throw error
    }
  }

  /**
   * Obtener todas las donaciones con filtros opcionales
   */
  static async getDonations(filters?: {
    sectionId?: string
    status?: DonationStatus
    userId?: string
    limit?: number
    offset?: number
  }) {
    try {
      const where: any = {}
      
      if (filters?.sectionId) {
        where.sectionId = filters.sectionId
      }
      
      if (filters?.status) {
        where.status = filters.status
      }
      
      if (filters?.userId) {
        where.userId = filters.userId
      }

      const donations = await prisma.donation.findMany({
        where,
        include: {
          section: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: filters?.limit,
        skip: filters?.offset
      })

      return donations
    } catch (error) {
      console.error('Error fetching donations:', error)
      throw error
    }
  }

  /**
   * Obtener una donación por ID
   */
  static async getDonationById(id: string) {
    try {
      const donation = await prisma.donation.findUnique({
        where: { id },
        include: {
          section: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      })
      return donation
    } catch (error) {
      console.error('Error fetching donation:', error)
      throw error
    }
  }

  /**
   * Actualizar una donación
   */
  static async updateDonation(id: string, data: UpdateDonationData) {
    try {
      const donation = await prisma.donation.update({
        where: { id },
        data,
        include: {
          section: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      })
      return donation
    } catch (error) {
      console.error('Error updating donation:', error)
      throw error
    }
  }

  /**
   * Eliminar una donación
   */
  static async deleteDonation(id: string) {
    try {
      const donation = await prisma.donation.delete({
        where: { id }
      })
      return donation
    } catch (error) {
      console.error('Error deleting donation:', error)
      throw error
    }
  }

  /**
   * Crear una nueva sección de donación
   */
  static async createDonationSection(data: { name: string; description?: string }) {
    try {
      const section = await prisma.donationSection.create({
        data: {
          name: data.name,
          description: data.description || '',
          isActive: true
        }
      })
      return section
    } catch (error) {
      console.error('Error creating donation section:', error)
      throw error
    }
  }

  /**
   * Obtener secciones de donación
   */
  static async getDonationSections() {
    try {
      const sections = await prisma.donationSection.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      })
      return sections
    } catch (error) {
      console.error('Error fetching donation sections:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de donaciones por sección
   */
  static async getDonationStats(sectionId?: string) {
    try {
      const where: any = {}
      if (sectionId) {
        where.sectionId = sectionId
      }

      const stats = await prisma.donation.groupBy({
        by: ['status'],
        where,
        _count: {
          id: true
        },
        _sum: {
          amount: true
        }
      })

      const totalDonations = await prisma.donation.count({ where })
      const totalAmount = await prisma.donation.aggregate({
        where,
        _sum: {
          amount: true
        }
      })

      return {
        totalDonations,
        totalAmount: totalAmount._sum.amount || 0,
        byStatus: stats
      }
    } catch (error) {
      console.error('Error fetching donation stats:', error)
      throw error
    }
  }
}
