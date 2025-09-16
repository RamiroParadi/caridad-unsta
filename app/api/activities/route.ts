import { NextRequest, NextResponse } from 'next/server'
import { ActivityService } from '@/lib/services/activity-service'

export async function GET() {
  try {
    const activities = await ActivityService.getAllActivities()
    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, location, maxParticipants } = body

    if (!title || !date) {
      return NextResponse.json(
        { error: 'Title and date are required' },
        { status: 400 }
      )
    }

    const activity = await ActivityService.createActivity({
      title,
      description,
      date: new Date(date),
      location,
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
