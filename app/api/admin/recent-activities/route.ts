import { NextResponse } from 'next/server'
import { getRecentActivities } from '@/lib/services/admin-stats-service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')
    
    const activities = await getRecentActivities(limit)
    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error in recent activities API:', error)
    return NextResponse.json(
      { error: 'Error al obtener actividades recientes' },
      { status: 500 }
    )
  }
}
