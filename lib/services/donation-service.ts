import { prisma } from '@/lib/prisma'
import { DonationStatus } from '../../app/generated/prisma'

export interface CreateDonationData {
  userId: string
  sectionId: string
  amount: number
  description?: string
  isAnonymous?: boolean
}

export interface UpdateDonationData {
  amount?: number
  description?: string
  isAnonymous?: boolean
  status?: DonationStatus
}

export class DonationService {
  // Crear nueva donación
  static async createDonation(data: CreateDonationData) {
    return await prisma.donation.create({
      data: {
        userId: data.userId,
        sectionId: data.sectionId,
        amount: data.amount,
        description: data.description,
        isAnonymous: data.isAnonymous || false
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        section: true
      }
    })
  }

  // Obtener todas las donaciones
  static async getAllDonations() {
    return await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        section: true
      }
    })
  }

  // Obtener donaciones por usuario
  static async getDonationsByUser(userId: string) {
    return await prisma.donation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        section: true
      }
    })
  }

  // Obtener donaciones por sección
  static async getDonationsBySection(sectionId: string) {
    return await prisma.donation.findMany({
      where: { sectionId },
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

  // Obtener donación por ID
  static async getDonationById(id: string) {
    return await prisma.donation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        section: true
      }
    })
  }

  // Actualizar donación
  static async updateDonation(id: string, data: UpdateDonationData) {
    return await prisma.donation.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        section: true
      }
    })
  }

  // Eliminar donación
  static async deleteDonation(id: string) {
    return await prisma.donation.delete({
      where: { id }
    })
  }

  // Confirmar donación
  static async confirmDonation(id: string) {
    return await prisma.donation.update({
      where: { id },
      data: { status: DonationStatus.CONFIRMADA }
    })
  }

  // Rechazar donación
  static async rejectDonation(id: string) {
    return await prisma.donation.update({
      where: { id },
      data: { status: DonationStatus.RECHAZADA }
    })
  }

  // Obtener estadísticas de donaciones
  static async getDonationStats() {
    const totalDonations = await prisma.donation.count()
    const totalAmount = await prisma.donation.aggregate({
      _sum: { amount: true }
    })
    const confirmedDonations = await prisma.donation.count({
      where: { status: DonationStatus.CONFIRMADA }
    })
    const pendingDonations = await prisma.donation.count({
      where: { status: DonationStatus.PENDIENTE }
    })

    return {
      totalDonations,
      totalAmount: totalAmount._sum.amount || 0,
      confirmedDonations,
      pendingDonations
    }
  }
}
