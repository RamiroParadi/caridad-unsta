import { NextRequest, NextResponse } from 'next/server'
import { DonationDbService } from '@/lib/services/donation-db-service'
import { DonationStatus } from '@/app/generated/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const sectionId = searchParams.get('sectionId') || undefined
    const status = searchParams.get('status') as DonationStatus || undefined
    const userId = searchParams.get('userId') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    const donations = await DonationDbService.getDonations({
      sectionId,
      status,
      userId,
      limit,
      offset
    })

    return NextResponse.json(donations)
  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 Datos recibidos para crear donación:', body)
    const { amount, description, isAnonymous, status, userId, sectionId, donorName, donorEmail } = body

    // Validar campos requeridos
    if (amount === undefined || amount === null || !userId || !sectionId || !donorName) {
      console.error('❌ Campos faltantes:', { amount, userId, sectionId, donorName })
      return NextResponse.json(
        { error: 'Missing required fields: amount, userId, sectionId, donorName' },
        { status: 400 }
      )
    }

    // Validar que el monto sea mayor o igual a 0 (0 para donaciones no monetarias)
    if (amount < 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than or equal to 0' },
        { status: 400 }
      )
    }

    // Buscar el usuario por clerkId para obtener el ID interno de la base de datos
    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      console.error('❌ Usuario no encontrado con clerkId:', userId)
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Usuario encontrado:', { id: user.id, clerkId: user.clerkId, name: user.name })

    const donation = await DonationDbService.createDonation({
      amount,
      description,
      isAnonymous: isAnonymous || false,
      status: status || DonationStatus.PENDIENTE,
      userId: user.id, // Usar el ID interno de la base de datos
      sectionId,
      donorName,
      donorEmail
    })

    return NextResponse.json(donation, { status: 201 })
  } catch (error) {
    console.error('Error creating donation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
