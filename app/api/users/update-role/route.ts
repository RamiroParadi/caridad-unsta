import { NextRequest, NextResponse } from 'next/server'
import { UserDbService } from '@/lib/services/user-db-service'
import { UserRole } from '@/app/generated/prisma'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { clerkId, role } = body

    if (!clerkId || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: clerkId, role' },
        { status: 400 }
      )
    }

    // Validar que el rol sea válido
    if (role !== 'ADMIN' && role !== 'ALUMNO') {
      return NextResponse.json(
        { error: 'Invalid role. Must be ADMIN or ALUMNO' },
        { status: 400 }
      )
    }

    const validRole = role === 'ADMIN' ? UserRole.ADMIN : UserRole.ALUMNO

    const user = await UserDbService.updateUserRole(clerkId, validRole)

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
