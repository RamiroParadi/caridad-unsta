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

    // Obtener donaciones de los últimos 12 meses
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const donations = await prisma.donation.findMany({
      where: {
        createdAt: {
          gte: twelveMonthsAgo
        }
      },
      select: {
        createdAt: true
      }
    })

    // Agrupar por mes
    const monthlyData = new Map<string, { count: number }>()
    
    donations.forEach(donation => {
      const month = donation.createdAt.toISOString().slice(0, 7) // YYYY-MM
      
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { count: 0 })
      }
      
      const data = monthlyData.get(month)!
      data.count += 1
      monthlyData.set(month, data)
    })

    // Convertir a array y ordenar
    const result = Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('es-AR', { 
          month: 'short', 
          year: 'numeric' 
        }),
        count: data.count
      }))
      .sort((a, b) => a.month.localeCompare(b.month))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching donations by month:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
