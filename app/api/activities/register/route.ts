import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ActivityService } from '@/lib/services/activity-service'

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const { activityId } = body

    if (!activityId) {
      return NextResponse.json(
        { error: 'activityId es requerido' },
        { status: 400 }
      )
    }

    // Verificar si la actividad existe y está activa
    const activity = await ActivityService.getActivityById(activityId)
    if (!activity) {
      return NextResponse.json(
        { error: 'Actividad no encontrada' },
        { status: 404 }
      )
    }

    if (!activity.isActive) {
      return NextResponse.json(
        { error: 'La actividad no está activa' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya está inscrito
    const isAlreadyRegistered = await ActivityService.isUserInActivity(user.id, activityId)
    if (isAlreadyRegistered) {
      return NextResponse.json(
        { error: 'Ya estás inscrito en esta actividad' },
        { status: 400 }
      )
    }

    // Verificar límite de participantes
    if (activity.maxParticipants && activity.participants.length >= activity.maxParticipants) {
      return NextResponse.json(
        { error: 'La actividad ha alcanzado el límite de participantes' },
        { status: 400 }
      )
    }

    // Inscribir al usuario
    await ActivityService.joinActivity(user.id, activityId)

    return NextResponse.json({ 
      success: true, 
      message: 'Te has inscrito exitosamente en la actividad' 
    })
  } catch (error) {
    console.error('Error joining activity:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const activityId = searchParams.get('activityId')

    if (!activityId) {
      return NextResponse.json(
        { error: 'activityId es requerido' },
        { status: 400 }
      )
    }

    // Verificar si el usuario está inscrito
    const isRegistered = await ActivityService.isUserInActivity(user.id, activityId)
    if (!isRegistered) {
      return NextResponse.json(
        { error: 'No estás inscrito en esta actividad' },
        { status: 400 }
      )
    }

    // Desinscribir al usuario
    await ActivityService.leaveActivity(user.id, activityId)

    return NextResponse.json({ 
      success: true, 
      message: 'Te has desinscrito exitosamente de la actividad' 
    })
  } catch (error) {
    console.error('Error leaving activity:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
