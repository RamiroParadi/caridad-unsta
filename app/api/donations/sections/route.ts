import { NextRequest, NextResponse } from 'next/server'
import { DonationDbService } from '@/lib/services/donation-db-service'

export async function GET() {
  try {
    const sections = await DonationDbService.getDonationSections()
    return NextResponse.json(sections)
  } catch (error) {
    console.error('Error fetching donation sections:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Crear la sección usando el servicio
    const section = await DonationDbService.createDonationSection({
      name,
      description: description || ''
    })

    return NextResponse.json(section, { status: 201 })
  } catch (error) {
    console.error('Error creating donation section:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
