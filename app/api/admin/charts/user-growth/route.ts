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

    // Obtener crecimiento de usuarios y actividades de los últimos 6 meses
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const [users, activities] = await Promise.all([
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: sixMonthsAgo
          }
        },
        select: {
          createdAt: true
        }
      }),
      prisma.activity.findMany({
        where: {
          createdAt: {
            gte: sixMonthsAgo
          }
        },
        select: {
          createdAt: true
        }
      })
    ])

    // Agrupar por mes
    const monthlyData = new Map<string, { users: number; activities: number; cumulativeUsers: number }>()
    
    // Generar todos los meses
    for (let i = 0; i < 6; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      const month = date.toISOString().slice(0, 7)
      const monthName = date.toLocaleDateString('es-AR', { 
        month: 'short', 
        year: 'numeric' 
      })
      monthlyData.set(month, { users: 0, activities: 0, cumulativeUsers: 0 })
    }

    // Contar usuarios por mes
    users.forEach(user => {
      const month = user.createdAt.toISOString().slice(0, 7)
      if (monthlyData.has(month)) {
        const data = monthlyData.get(month)!
        data.users += 1
        monthlyData.set(month, data)
      }
    })

    // Contar actividades por mes
    activities.forEach(activity => {
      const month = activity.createdAt.toISOString().slice(0, 7)
      if (monthlyData.has(month)) {
        const data = monthlyData.get(month)!
        data.activities += 1
        monthlyData.set(month, data)
      }
    })

    // Calcular usuarios acumulados
    const totalUsers = await prisma.user.count()
    let cumulativeUsers = totalUsers

    const result = Array.from(monthlyData.entries())
      .map(([month, data]) => {
        cumulativeUsers -= data.users // Restamos porque vamos hacia atrás
        return {
          month: new Date(month + '-01').toLocaleDateString('es-AR', { 
            month: 'short', 
            year: 'numeric' 
          }),
          users: cumulativeUsers,
          activities: data.activities
        }
      })
      .sort((a, b) => a.month.localeCompare(b.month))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching user growth:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
