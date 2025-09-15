import { NextRequest, NextResponse } from 'next/server'
import { UserDbService } from '@/lib/services/user-db-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  try {
    const { clerkId } = await params

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Clerk ID is required' },
        { status: 400 }
      )
    }

    const user = await UserDbService.getUserByClerkId(clerkId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      role: user.role,
      email: user.email,
      name: user.name
    })
  } catch (error) {
    console.error('Error fetching user role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
