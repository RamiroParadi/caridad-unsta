import { NextRequest, NextResponse } from 'next/server'
import { DonationDbService } from '@/lib/services/donation-db-service'
import { DonationStatus } from '@/app/generated/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, donorName, donorEmail, amount, description } = body

    // Si solo se está actualizando el status (comportamiento anterior)
    if (status && !donorName && !donorEmail && !amount && !description) {
      if (!['PENDIENTE', 'CONFIRMADA', 'RECHAZADA'].includes(status)) {
        return NextResponse.json(
          { error: 'Status must be PENDIENTE, CONFIRMADA, or RECHAZADA' },
          { status: 400 }
        )
      }

      const updatedDonation = await DonationDbService.updateDonationStatus(id, status as DonationStatus)

      if (!updatedDonation) {
        return NextResponse.json(
          { error: 'Donation not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(updatedDonation)
    }

    // Actualización completa de la donación
    const updateData: {
      status?: DonationStatus
      donorName?: string
      donorEmail?: string
      amount?: number
      description?: string
    } = {}
    
    if (status && ['PENDIENTE', 'CONFIRMADA', 'RECHAZADA'].includes(status)) {
      updateData.status = status
    }
    
    if (donorName !== undefined) {
      updateData.donorName = donorName
    }
    
    if (donorEmail !== undefined) {
      updateData.donorEmail = donorEmail
    }
    
    if (amount !== undefined) {
      updateData.amount = amount
    }
    
    if (description !== undefined) {
      updateData.description = description
    }

    const updatedDonation = await DonationDbService.updateDonation(id, updateData)

    if (!updatedDonation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedDonation)
  } catch (error) {
    console.error('Error updating donation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}