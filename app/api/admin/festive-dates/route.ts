import { NextRequest, NextResponse } from 'next/server'
import { FestiveDateService } from '@/lib/services/festive-date-service'
import { DonationDbService } from '@/lib/services/donation-db-service'

export async function GET() {
  try {
    const festiveDates = await FestiveDateService.getAllFestiveDates()
    
    // Convertir a formato compatible con el frontend
    const formattedDates = festiveDates.reduce((acc, date) => {
      acc[date.id] = {
        id: date.id,
        name: date.name,
        description: date.description,
        startDate: date.startDate.toISOString().split('T')[0],
        endDate: date.endDate.toISOString().split('T')[0],
        isEnabled: date.isEnabled,
        icon: date.icon,
        gradient: date.gradient,
        bgGradient: date.bgGradient,
        items: date.items,
        sectionId: date.sectionId
      }
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json(formattedDates)
  } catch (error) {
    console.error('Error fetching festive dates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError)
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      )
    }
    const { name, description, startDate, endDate, icon, gradient, bgGradient, items } = body

    if (!name || !description || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, startDate, endDate' },
        { status: 400 }
      )
    }

    // Verificar que no exista ya una fecha festiva con el mismo nombre
    const existingFestiveDate = await FestiveDateService.getFestiveDateByName(name)
    if (existingFestiveDate) {
      return NextResponse.json(
        { error: 'A festive date with this name already exists' },
        { status: 409 }
      )
    }

    // Crear la sección de donación correspondiente
    let sectionId = null
    
    try {
      const section = await DonationDbService.createDonationSection({
        name,
        description: `Donaciones para ${name}`
      })
      sectionId = section.id
      console.log(`Sección de donación creada para fecha festiva:`, section)
    } catch (sectionError) {
      console.error('Error creating donation section:', sectionError)
      // Continuar sin la sección si hay error
    }

    // Crear la fecha festiva en la base de datos
    const festiveDate = await FestiveDateService.createFestiveDate({
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isEnabled: false, // Por defecto deshabilitado
      icon: icon || 'heart',
      gradient: gradient || 'from-purple-500 to-pink-600',
      bgGradient: bgGradient || 'from-purple-50 to-pink-50',
      items: items || ['Elementos varios'],
      sectionId
    })

    console.log(`New festive date created:`, festiveDate)

    // Retornar en formato compatible con el frontend
    const response = {
      id: festiveDate.id,
      name: festiveDate.name,
      description: festiveDate.description,
      startDate: festiveDate.startDate.toISOString().split('T')[0],
      endDate: festiveDate.endDate.toISOString().split('T')[0],
      isEnabled: festiveDate.isEnabled,
      icon: festiveDate.icon,
      gradient: festiveDate.gradient,
      bgGradient: festiveDate.bgGradient,
      items: festiveDate.items,
      sectionId: festiveDate.sectionId
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating festive date:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isEnabled, startDate, endDate, sectionId } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // Actualizar la fecha festiva en la base de datos
    const updateData: any = {}
    if (isEnabled !== undefined) updateData.isEnabled = isEnabled
    if (startDate) updateData.startDate = new Date(startDate)
    if (endDate) updateData.endDate = new Date(endDate)
    if (sectionId) updateData.sectionId = sectionId

    const updatedFestiveDate = await FestiveDateService.updateFestiveDate(id, updateData)

    console.log(`Festive date ${id} updated:`, updatedFestiveDate)

    // Retornar en formato compatible con el frontend
    const response = {
      id: updatedFestiveDate.id,
      name: updatedFestiveDate.name,
      description: updatedFestiveDate.description,
      startDate: updatedFestiveDate.startDate.toISOString().split('T')[0],
      endDate: updatedFestiveDate.endDate.toISOString().split('T')[0],
      isEnabled: updatedFestiveDate.isEnabled,
      icon: updatedFestiveDate.icon,
      gradient: updatedFestiveDate.gradient,
      bgGradient: updatedFestiveDate.bgGradient,
      items: updatedFestiveDate.items,
      sectionId: updatedFestiveDate.sectionId
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating festive date:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // Obtener la fecha festiva antes de eliminarla para obtener el sectionId
    const festiveDate = await FestiveDateService.getFestiveDateById(id)
    
    // Eliminar la fecha festiva de la base de datos
    await FestiveDateService.deleteFestiveDate(id)

    // Si tiene sectionId, eliminar también la sección de donación
    if (festiveDate?.sectionId) {
      try {
        await DonationDbService.deleteDonationSection(festiveDate.sectionId)
        console.log(`Donation section ${festiveDate.sectionId} deleted`)
      } catch (sectionError) {
        console.error('Error deleting donation section:', sectionError)
        // No fallar la operación si no se puede eliminar la sección
      }
    }

    console.log(`Festive date ${id} deleted`)

    return NextResponse.json({ message: 'Festive date deleted successfully' })
  } catch (error) {
    console.error('Error deleting festive date:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}