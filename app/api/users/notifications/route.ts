import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NotificationService } from '@/lib/services/notification-service'

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const notifications = await NotificationService.getActiveNotificationsByUser(user.id)
    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('❌ Error fetching user notifications:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}


