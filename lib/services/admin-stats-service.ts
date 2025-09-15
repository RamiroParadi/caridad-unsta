import { prisma } from '../prisma'

export interface AdminStats {
  totalUsers: number
  totalAdmins: number
  totalStudents: number
  activeActivities: number
  totalDonations: number
  totalDonationAmount: number
  pendingDonations: number
  confirmedDonations: number
  totalNotifications: number
  unreadNotifications: number
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    // Estadísticas de usuarios
    const totalUsers = await prisma.user.count()
    const totalAdmins = await prisma.user.count({ where: { role: 'ADMIN' } })
    const totalStudents = await prisma.user.count({ where: { role: 'ALUMNO' } })

    // Estadísticas de actividades
    const activeActivities = await prisma.activity.count({ where: { isActive: true } })

    // Estadísticas de donaciones
    const totalDonations = await prisma.donation.count()
    const donationsResult = await prisma.donation.aggregate({
      _sum: { amount: true }
    })
    const totalDonationAmount = donationsResult._sum.amount || 0

    const pendingDonations = await prisma.donation.count({ where: { status: 'PENDIENTE' } })
    const confirmedDonations = await prisma.donation.count({ where: { status: 'CONFIRMADA' } })

    // Estadísticas de notificaciones
    const totalNotifications = await prisma.notification.count({ where: { isActive: true } })
    const unreadNotifications = await prisma.notification.count({ 
      where: { 
        isActive: true,
        // Asumimos que las notificaciones sin fecha de lectura son no leídas
        // Podrías agregar un campo 'readAt' si necesitas más precisión
      } 
    })

    return {
      totalUsers,
      totalAdmins,
      totalStudents,
      activeActivities,
      totalDonations,
      totalDonationAmount,
      pendingDonations,
      confirmedDonations,
      totalNotifications,
      unreadNotifications
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    throw new Error('Error al obtener estadísticas del administrador')
  }
}

export async function getRecentActivities(limit: number = 5) {
  try {
    const activities = await prisma.activity.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { participants: true }
        }
      }
    })

    return activities.map(activity => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      date: activity.date,
      location: activity.location,
      maxParticipants: activity.maxParticipants,
      isActive: activity.isActive,
      participantCount: activity._count.participants,
      createdAt: activity.createdAt
    }))
  } catch (error) {
    console.error('Error fetching recent activities:', error)
    throw new Error('Error al obtener actividades recientes')
  }
}

export async function getRecentDonations(limit: number = 5) {
  try {
    const donations = await prisma.donation.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        section: {
          select: {
            name: true
          }
        }
      }
    })

    return donations.map(donation => ({
      id: donation.id,
      amount: donation.amount,
      description: donation.description,
      isAnonymous: donation.isAnonymous,
      status: donation.status,
      donorName: donation.isAnonymous ? 'Anónimo' : (donation.donorName || donation.user.name),
      donorEmail: donation.isAnonymous ? null : (donation.donorEmail || donation.user.email),
      sectionName: donation.section.name,
      createdAt: donation.createdAt
    }))
  } catch (error) {
    console.error('Error fetching recent donations:', error)
    throw new Error('Error al obtener donaciones recientes')
  }
}
