import { NextRequest, NextResponse } from 'next/server'
import { UserDbService } from '@/lib/services/user-db-service'

export async function GET(request: NextRequest) {
  try {
    const users = await UserDbService.getAllUsers()

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching all users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
