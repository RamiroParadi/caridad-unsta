import { NextRequest, NextResponse } from 'next/server'
import { DonationDbService } from '@/lib/services/donation-db-service'
import { DonationStatus } from '@/app/generated/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const donation = await DonationDbService.getDonationById(id)

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(donation)
  } catch (error) {
    console.error('Error fetching donation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { amount, description, isAnonymous, status, donorName, donorEmail } = body

    // Validar que el monto sea positivo si se proporciona
    if (amount !== undefined && amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Validar que el status sea válido si se proporciona
    if (status && !Object.values(DonationStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const donation = await DonationDbService.updateDonation(id, {
      amount,
      description,
      isAnonymous,
      status,
      donorName,
      donorEmail
    })

    return NextResponse.json(donation)
  } catch (error) {
    console.error('Error updating donation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await DonationDbService.deleteDonation(id)

    return NextResponse.json({ message: 'Donation deleted successfully' })
  } catch (error) {
    console.error('Error deleting donation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
