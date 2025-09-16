import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NotificationService } from '@/lib/services/notification-service'
import { NotificationType } from '@/app/generated/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({ where: { clerkId } })
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const body = await request.json()
    const { title, message, type } = body as { title?: string; message?: string; type?: NotificationType }

    if (!title || !message) {
      return NextResponse.json({ error: 'Título y mensaje son requeridos' }, { status: 400 })
    }

    const created = await NotificationService.createNotificationForAllUsers(title.trim(), message.trim(), type)
    // Si no hay usuarios en la BD, crear al menos para el admin actual para visibilidad en historial
    if (!created || created.length === 0) {
      const one = await NotificationService.createNotification({
        userId: adminUser.id,
        title: title.trim(),
        message: message.trim(),
        type
      })
      return NextResponse.json({ success: true, count: 1 })
    }

    return NextResponse.json({ success: true, count: created.length })
  } catch (error) {
    console.error('❌ Error creando notificaciones:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

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

    const notifications = await NotificationService.getAllNotifications()
    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('❌ Error listando notificaciones:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({ where: { clerkId } })
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }

    await prisma.notification.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Error eliminando notificación:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}


