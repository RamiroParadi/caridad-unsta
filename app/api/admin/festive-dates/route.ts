import { NextRequest, NextResponse } from 'next/server'

// Simulamos una base de datos simple para el estado de las fechas festivas
// En un proyecto real, esto estaría en la base de datos
let festiveDatesStatus: Record<string, any> = {
  'dia-del-nino': {
    id: 'dia-del-nino',
    name: 'Día del Niño',
    isEnabled: false,
    startDate: '2024-07-01',
    endDate: '2024-08-31',
    description: 'Donaciones de juguetes y regalos para el Día del Niño',
    icon: 'gift',
    gradient: 'from-pink-500 to-rose-600',
    bgGradient: 'from-pink-50 to-rose-50',
    items: ['Juguetes nuevos y usados', 'Libros infantiles', 'Juegos educativos', 'Materiales de arte']
  },
  'comienzo-clases': {
    id: 'comienzo-clases',
    name: 'Comienzo de Clases',
    isEnabled: false,
    startDate: '2025-02-01',
    endDate: '2025-03-31',
    description: 'Donaciones de útiles escolares para el inicio del ciclo lectivo',
    icon: 'graduation-cap',
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50',
    items: ['Mochilas y cartucheras', 'Cuadernos y lapiceras', 'Calculadoras', 'Diccionarios']
  },
  'navidad': {
    id: 'navidad',
    name: 'Navidad',
    isEnabled: false,
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    description: 'Donaciones de regalos navideños',
    icon: 'tree-pine',
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50',
    items: ['Regalos navideños', 'Decoraciones', 'Juguetes', 'Libros de cuentos']
  }
}

export async function GET() {
  try {
    return NextResponse.json(festiveDatesStatus)
  } catch (error) {
    console.error('Error fetching festive dates status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, startDate, endDate, icon, gradient, bgGradient, items } = body

    if (!name || !description || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, startDate, endDate' },
        { status: 400 }
      )
    }

    // Generar ID único basado en el nombre
    const id = name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Verificar que no exista ya
    if (festiveDatesStatus[id]) {
      return NextResponse.json(
        { error: 'A festive date with this name already exists' },
        { status: 409 }
      )
    }

    const newFestiveDate = {
      id,
      name,
      description,
      startDate,
      endDate,
      isEnabled: false, // Por defecto deshabilitado
      icon: icon || 'heart',
      gradient: gradient || 'from-purple-500 to-pink-600',
      bgGradient: bgGradient || 'from-purple-50 to-pink-50',
      items: items || ['Elementos varios']
    }

    festiveDatesStatus[id] = newFestiveDate

    console.log(`New festive date created:`, newFestiveDate)

    return NextResponse.json(newFestiveDate, { status: 201 })
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
    const { id, isEnabled, startDate, endDate } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    if (!festiveDatesStatus[id]) {
      return NextResponse.json(
        { error: 'Festive date not found' },
        { status: 404 }
      )
    }

    // Actualizar el estado
    festiveDatesStatus[id] = {
      ...festiveDatesStatus[id],
      isEnabled: isEnabled !== undefined ? isEnabled : festiveDatesStatus[id].isEnabled,
      startDate: startDate || festiveDatesStatus[id].startDate,
      endDate: endDate || festiveDatesStatus[id].endDate
    }

    console.log(`Festive date ${id} updated:`, festiveDatesStatus[id])

    return NextResponse.json(festiveDatesStatus[id])
  } catch (error) {
    console.error('Error updating festive date status:', error)
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

    if (!festiveDatesStatus[id]) {
      return NextResponse.json(
        { error: 'Festive date not found' },
        { status: 404 }
      )
    }

    delete festiveDatesStatus[id]

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