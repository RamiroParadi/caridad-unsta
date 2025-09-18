import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NotificationService } from '@/lib/services/notification-service'
import { NotificationType } from '@/app/generated/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/admin/notifications - Iniciando...')
    
    const { userId: clerkId } = await auth()
    console.log('Clerk ID obtenido:', clerkId)
    
    if (!clerkId) {
      console.log('❌ No hay clerkId, devolviendo 401')
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({ where: { clerkId } })
    console.log('Usuario encontrado:', adminUser)
    
    if (!adminUser || adminUser.role !== 'ADMIN') {
      console.log('❌ Usuario no es admin, devolviendo 403')
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const body = await request.json()
    console.log('Body recibido:', body)
    const { title, message } = body as { title?: string; message?: string }

    if (!title || !message) {
      console.log('❌ Faltan título o mensaje')
      return NextResponse.json({ error: 'Título y mensaje son requeridos' }, { status: 400 })
    }

    console.log('📝 Creando notificación global...')
    
    try {
      const created = await NotificationService.createNotification({
        title: title.trim(),
        message: message.trim(),
        type: NotificationType.GENERAL,
        isGlobal: true // Crear como notificación global
      })
      console.log('✅ Notificación global creada:', created)
      return NextResponse.json({ success: true, count: 1, isGlobal: true })
    } catch (serviceError) {
      console.error('❌ Error creando notificación global:', serviceError)
      console.error('❌ Stack trace:', serviceError instanceof Error ? serviceError.stack : 'No stack trace available')
      throw serviceError
    }
  } catch (error) {
    console.error('❌ Error creando notificaciones:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available')
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

export async function PUT(request: NextRequest) {
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
    const { id, title, message } = body as { 
      id?: string; 
      title?: string; 
      message?: string; 
    }

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 })
    }

    if (!title || !message) {
      return NextResponse.json({ error: 'Título y mensaje son requeridos' }, { status: 400 })
    }

    // Actualizar la notificación
    const updatedNotification = await NotificationService.updateNotification(id, {
      title: title.trim(),
      message: message.trim(),
      type: NotificationType.GENERAL
    })

    return NextResponse.json({ 
      success: true, 
      notification: updatedNotification 
    })
  } catch (error) {
    console.error('❌ Error actualizando notificación:', error)
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


