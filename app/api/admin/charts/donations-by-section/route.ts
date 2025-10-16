import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({ where: { clerkId } })
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    // Obtener donaciones agrupadas por sección
    const donationsBySection = await prisma.donation.groupBy({
      by: ['sectionId'],
      _count: {
        id: true
      },
      _sum: {
        amount: true
      }
    })

    // Obtener nombres de las secciones
    const sectionIds = donationsBySection.map(item => item.sectionId)
    const sections = await prisma.donationSection.findMany({
      where: {
        id: {
          in: sectionIds
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    // Crear mapa de secciones para lookup rápido
    const sectionMap = new Map(sections.map(section => [section.id, section.name]))

    const result = donationsBySection
      .map(item => ({
        name: sectionMap.get(item.sectionId) || 'Sección Desconocida',
        value: item._count.id,
        amount: item._sum.amount || 0
      }))
      .sort((a, b) => b.value - a.value)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching donations by section:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
