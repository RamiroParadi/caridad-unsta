import { NextResponse } from 'next/server'
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
