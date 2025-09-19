import { NextRequest, NextResponse } from 'next/server'
import { ActivityService } from '@/lib/services/activity-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const activity = await ActivityService.getActivityById(id)
    
    if (!activity) {
      return NextResponse.json(
        { error: 'Actividad no encontrada' },
        { status: 404 }
      )
    }

    // Retornar solo los participantes con la información del usuario
    const participants = activity.participants.map(participant => ({
      user: {
        id: participant.user.id,
        name: participant.user.name,
        email: participant.user.email
      }
    }))

    return NextResponse.json(participants)
  } catch (error) {
    console.error('Error fetching activity participants:', error)
    return NextResponse.json(
      { error: 'Error al obtener participantes de la actividad' },
      { status: 500 }
    )
  }
}
