import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { UserService } from '@/lib/services/user-service'

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    console.log('🔐 User ID:', userId)
    
    if (!userId) {
      console.log('❌ No autorizado')
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { studentCode } = await request.json()
    console.log('📝 Código recibido:', studentCode)

    if (!studentCode || typeof studentCode !== 'string') {
      console.log('❌ Código inválido')
      return NextResponse.json({ error: 'Código de estudiante requerido' }, { status: 400 })
    }

    console.log('🔄 Buscando usuario en BD con clerkId:', userId)
    
    // Primero verificar si el usuario existe
    const existingUser = await UserService.getUserByClerkId(userId)
    console.log('👤 Usuario encontrado:', existingUser)
    
    if (!existingUser) {
      console.log('❌ Usuario no encontrado en BD')
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    console.log('🔄 Actualizando en BD...')
    // Actualizar el código de estudiante
    const updatedUser = await UserService.updateStudentCode(userId, studentCode.trim())
    console.log('✅ Usuario actualizado:', updatedUser)

    // Verificar que realmente se guardó
    const verifyUser = await UserService.getUserByClerkId(userId)
    console.log('🔍 Verificación - Usuario después de actualizar:', verifyUser)

    return NextResponse.json({ 
      success: true, 
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        studentCode: updatedUser.studentCode,
        role: updatedUser.role
      }
    })

  } catch (error) {
    console.error('❌ Error actualizando código de estudiante:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
