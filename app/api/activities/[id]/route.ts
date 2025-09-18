import { NextRequest, NextResponse } from 'next/server'
import { ActivityService } from '@/lib/services/activity-service'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, date, location, maxParticipants } = body

    if (!title || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: title, date' },
        { status: 400 }
      )
    }

    const updatedActivity = await ActivityService.updateActivity(id, {
      title,
      description,
      date: new Date(date),
      location,
      maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
    })

    if (!updatedActivity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedActivity)
  } catch (error) {
    console.error('Error updating activity:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la actividad' },
      { status: 500 }
    )
  }
}
