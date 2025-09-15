import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { UserService } from '@/lib/services/user-service'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    console.log('🔐 User ID para verificación:', userId)
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Buscar el usuario en la base de datos
    const user = await UserService.getUserByClerkId(userId)
    console.log('👤 Usuario encontrado:', user)

    if (!user) {
      return NextResponse.json({ 
        error: 'Usuario no encontrado en la base de datos',
        clerkId: userId
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        studentCode: user.studentCode,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })

  } catch (error) {
    console.error('❌ Error verificando usuario:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
