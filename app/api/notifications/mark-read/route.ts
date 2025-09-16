import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NotificationService } from '@/lib/services/notification-service'

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
    const { notificationId, markAll } = body

    if (markAll) {
      // Marcar todas las notificaciones como leídas
      const markedCount = await NotificationService.markAllAsRead(user.id)
      return NextResponse.json({ 
        success: true, 
        markedCount,
        message: `${markedCount} notificaciones marcadas como leídas`
      })
    } else if (notificationId) {
      // Marcar una notificación específica como leída
      await NotificationService.markAsRead(user.id, notificationId)
      return NextResponse.json({ 
        success: true, 
        message: 'Notificación marcada como leída'
      })
    } else {
      return NextResponse.json(
        { error: 'notificationId o markAll es requerido' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error marcando notificación como leída:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
