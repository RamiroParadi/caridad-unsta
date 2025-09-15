import { NextResponse } from 'next/server'
import { getRecentDonations } from '@/lib/services/admin-stats-service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')
    
    const donations = await getRecentDonations(limit)
    return NextResponse.json(donations)
  } catch (error) {
    console.error('Error in recent donations API:', error)
    return NextResponse.json(
      { error: 'Error al obtener donaciones recientes' },
      { status: 500 }
    )
  }
}
