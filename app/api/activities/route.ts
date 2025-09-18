import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ActivityService } from '@/lib/services/activity-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const activeOnly = searchParams.get('activeOnly') === 'true'

    // Obtener información del usuario autenticado
    const { userId: clerkId } = await auth()
    let currentUserId = null
    
    if (clerkId) {
      const user = await prisma.user.findUnique({ where: { clerkId } })
      currentUserId = user?.id
    }

    let activities

    if (startDate && endDate) {
      // Obtener actividades en un rango de fechas
      activities = await ActivityService.getActivitiesByDateRange(
        new Date(startDate),
        new Date(endDate),
        activeOnly
      )
    } else {
      // Obtener todas las actividades
      activities = await ActivityService.getAllActivities()
    }

    // Agregar información sobre si el usuario está inscrito
    const activitiesWithRegistration = activities.map(activity => ({
      ...activity,
      isUserRegistered: currentUserId ? 
        activity.participants.some(p => p.user.id === currentUserId) : 
        false
    }))

    return NextResponse.json(activitiesWithRegistration)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Error al obtener actividades' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, location, maxParticipants } = body

    if (!title || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: title, date' },
        { status: 400 }
      )
    }

    const newActivity = await ActivityService.createActivity({
      title,
      description,
      date: new Date(date),
      location,
      maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
    })

    return NextResponse.json(newActivity, { status: 201 })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { error: 'Error al crear la actividad' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    await ActivityService.deleteActivity(id)

    return NextResponse.json({ message: 'Activity deleted successfully' })
  } catch (error) {
    console.error('Error deleting activity:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la actividad' },
      { status: 500 }
    )
  }
}