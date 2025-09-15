import { NextRequest, NextResponse } from 'next/server'
import { UserDbService } from '@/lib/services/user-db-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  try {
    const { clerkId } = await params
    console.log('🔍 API /users/role - ClerkId:', clerkId)

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Clerk ID is required' },
        { status: 400 }
      )
    }

    const user = await UserDbService.getUserByClerkId(clerkId)
    console.log('👤 Usuario encontrado:', user)

    if (!user) {
      console.log('❌ Usuario no encontrado')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const response = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      studentCode: user.studentCode
    }
    
    console.log('📤 Respuesta enviada:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ Error fetching user role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
