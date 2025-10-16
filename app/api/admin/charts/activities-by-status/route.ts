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

    // Contar actividades activas
    const activeActivities = await prisma.activity.count({
      where: { isActive: true }
    })

    // Contar actividades inactivas
    const inactiveActivities = await prisma.activity.count({
      where: { isActive: false }
    })

    const result = [
      {
        name: 'Activas',
        value: activeActivities,
        color: '#10b981'
      },
      {
        name: 'Inactivas',
        value: inactiveActivities,
        color: '#ef4444'
      }
    ]

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching activities by status:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
