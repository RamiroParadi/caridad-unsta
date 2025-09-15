import { NextResponse } from 'next/server'
import { getAdminStats } from '@/lib/services/admin-stats-service'

export async function GET() {
  try {
    const stats = await getAdminStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error in admin stats API:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
