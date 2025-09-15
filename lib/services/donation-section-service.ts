import { prisma } from '@/lib/prisma'

export interface CreateDonationSectionData {
  name: string
  description?: string
}

export interface UpdateDonationSectionData {
  name?: string
  description?: string
  isActive?: boolean
}

export class DonationSectionService {
  // Crear nueva sección de donación
  static async createSection(data: CreateDonationSectionData) {
    return await prisma.donationSection.create({
      data: {
        name: data.name,
        description: data.description
      }
    })
  }

  // Obtener todas las secciones
  static async getAllSections() {
    return await prisma.donationSection.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        donations: {
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

  // Obtener secciones activas
  static async getActiveSections() {
    return await prisma.donationSection.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        donations: {
          where: { status: 'CONFIRMADA' },
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

  // Obtener sección por ID
  static async getSectionById(id: string) {
    return await prisma.donationSection.findUnique({
      where: { id },
      include: {
        donations: {
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

  // Actualizar sección
  static async updateSection(id: string, data: UpdateDonationSectionData) {
    return await prisma.donationSection.update({
      where: { id },
      data
    })
  }

  // Eliminar sección
  static async deleteSection(id: string) {
    return await prisma.donationSection.delete({
      where: { id }
    })
  }

  // Obtener estadísticas por sección
  static async getSectionStats(sectionId: string) {
    const donations = await prisma.donation.findMany({
      where: { sectionId },
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

    const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0)
    const confirmedAmount = donations
      .filter(d => d.status === 'CONFIRMADA')
      .reduce((sum, donation) => sum + donation.amount, 0)

    return {
      totalDonations: donations.length,
      totalAmount,
      confirmedAmount,
      pendingDonations: donations.filter(d => d.status === 'PENDIENTE').length,
      confirmedDonations: donations.filter(d => d.status === 'CONFIRMADA').length
    }
  }

  // Obtener estadísticas generales de todas las secciones
  static async getAllSectionsStats() {
    const sections = await this.getAllSections()
    
    return sections.map(section => ({
      id: section.id,
      name: section.name,
      description: section.description,
      isActive: section.isActive,
      totalDonations: section.donations.length,
      totalAmount: section.donations.reduce((sum, donation) => sum + donation.amount, 0),
      confirmedAmount: section.donations
        .filter(d => d.status === 'CONFIRMADA')
        .reduce((sum, donation) => sum + donation.amount, 0)
    }))
  }
}
