import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Inicializando base de datos...')

    // Crear usuario administrador
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@unsta.edu.ar' },
      update: {},
      create: {
        clerkId: 'admin-clerk-id-temp', // Temporal, se actualizará cuando se registre en Clerk
        email: 'admin@unsta.edu.ar',
        name: 'Administrador UNSTA',
        studentCode: 'ADMIN001',
        role: 'ADMIN'
      }
    })

    console.log('✅ Usuario administrador creado:', adminUser)

    // Crear secciones de donación por defecto
    const donationSections = [
      {
        name: 'Materiales de Estudio',
        description: 'Libros, útiles escolares y materiales educativos'
      },
      {
        name: 'Donación Monetaria',
        description: 'Contribución económica para causas solidarias'
      },
      {
        name: 'Donaciones Festivas',
        description: 'Celebraciones y eventos especiales de caridad'
      },
      {
        name: 'Donaciones de Vestimenta',
        description: 'Ropa y calzado para personas necesitadas'
      }
    ]

    for (const section of donationSections) {
      await prisma.donationSection.upsert({
        where: { name: section.name },
        update: {},
        create: section
      })
    }

    console.log('✅ Secciones de donación creadas')

    // Crear algunas actividades de ejemplo
    const activities = [
      {
        title: 'Recolección de Alimentos',
        description: 'Recolección de alimentos no perecederos para familias necesitadas',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En una semana
        location: 'Plaza Central',
        maxParticipants: 20
      },
      {
        title: 'Tutorías Gratuitas',
        description: 'Sesiones de tutoría para estudiantes de secundaria',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // En dos semanas
        location: 'Biblioteca Universitaria',
        maxParticipants: 15
      },
      {
        title: 'Limpieza de Espacios Verdes',
        description: 'Mantenimiento y limpieza de parques y espacios públicos',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // En tres semanas
        location: 'Parque Municipal',
        maxParticipants: 25
      },
      {
        title: 'Compañía a Adultos Mayores',
        description: 'Visitas y compañía a adultos mayores en hogares de ancianos',
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // En un mes
        location: 'Hogar de Ancianos San José',
        maxParticipants: 10
      }
    ]

    for (const activity of activities) {
      await prisma.activity.upsert({
        where: { title: activity.title },
        update: {},
        create: activity
      })
    }

    console.log('✅ Actividades de ejemplo creadas')

    return NextResponse.json({ 
      success: true, 
      message: 'Base de datos inicializada correctamente',
      adminUser: {
        email: adminUser.email,
        name: adminUser.name,
        studentCode: adminUser.studentCode,
        role: adminUser.role
      }
    })

  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error inicializando la base de datos',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
