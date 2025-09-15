import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/services/user-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clerkId, email, name, role, studentCode } = body

    console.log('📝 API Create User - Datos recibidos:', { clerkId, email, name, role, studentCode })

    if (!clerkId || !email || !name) {
      console.error('❌ Missing required fields:', { clerkId: !!clerkId, email: !!email, name: !!name })
      return NextResponse.json(
        { error: 'Missing required fields: clerkId, email, name' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe por ClerkId
    console.log('🔍 Verificando si usuario existe por ClerkId:', clerkId)
    const existingUser = await UserService.getUserByClerkId(clerkId)
    
    let user
    if (existingUser) {
      console.log('✅ Usuario ya existe por ClerkId:', existingUser.email)
      user = existingUser
    } else {
      // Verificar si existe un usuario con el mismo email pero diferente ClerkId
      console.log('🔍 Verificando si existe usuario con mismo email:', email)
      const existingEmailUser = await UserService.getUserByEmail(email)
      
      if (existingEmailUser) {
        console.log('⚠️ Usuario con mismo email ya existe, actualizando ClerkId:', existingEmailUser.clerkId)
        // Actualizar el ClerkId del usuario existente
        user = await UserService.updateUser(existingEmailUser.id, { 
          clerkId: clerkId,
          name: name,
          studentCode: studentCode || existingEmailUser.studentCode
        })
      } else {
        console.log('🆕 Usuario no existe, creando nuevo usuario...')
        // Crear nuevo usuario
        user = await UserService.createUser({
          clerkId,
          email,
          name,
          role: role || 'ALUMNO',
          studentCode: studentCode || null
        })
        console.log('✅ Usuario creado exitosamente:', user.id)
      }
    }

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
