import { NextRequest, NextResponse } from 'next/server'
import { UserDbService } from '@/lib/services/user-db-service'
import { UserRole } from '@/app/generated/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clerkId, email, name, role } = body

    console.log('📝 API Create User - Datos recibidos:', { clerkId, email, name, role })

    if (!clerkId || !email || !name) {
      console.error('❌ Missing required fields:', { clerkId: !!clerkId, email: !!email, name: !!name })
      return NextResponse.json(
        { error: 'Missing required fields: clerkId, email, name' },
        { status: 400 }
      )
    }

    // Validar que el rol sea válido
    const validRole = role === 'ADMIN' ? UserRole.ADMIN : UserRole.ALUMNO

    // Verificar si el usuario ya existe por ClerkId
    console.log('🔍 Verificando si usuario existe por ClerkId:', clerkId)
    const existingUser = await UserDbService.getUserByClerkId(clerkId)
    
    let user
    if (existingUser) {
      console.log('✅ Usuario ya existe por ClerkId, actualizando:', existingUser.email)
      // Actualizar usuario existente
      user = await UserDbService.updateUser(clerkId, { email, name })
    } else {
      // Verificar si existe un usuario con el mismo email pero diferente ClerkId
      console.log('🔍 Verificando si existe usuario con mismo email:', email)
      const existingEmailUser = await UserDbService.getUserByEmail(email)
      
      if (existingEmailUser) {
        console.log('⚠️ Usuario con mismo email ya existe, actualizando ClerkId:', existingEmailUser.clerkId)
        // Actualizar el ClerkId del usuario existente
        user = await UserDbService.updateUser(existingEmailUser.clerkId, { 
          clerkId: clerkId,
          email: email,
          name: name 
        })
      } else {
        console.log('🆕 Usuario no existe, creando nuevo usuario...')
        // Crear nuevo usuario
        user = await UserDbService.createUser({
          clerkId,
          email,
          name,
          role: validRole
        })
        console.log('✅ Usuario creado exitosamente:', user.id)
      }
    }

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
