import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🌱 Iniciando seed de la base de datos...')

    // Verificar si ya existe el usuario administrador
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@unsta.edu.ar' }
    })

    if (existingAdmin) {
      return NextResponse.json({ 
        success: true, 
        message: 'Usuario administrador ya existe',
        user: existingAdmin
      })
    }

    // Crear usuario administrador
    const adminUser = await prisma.user.create({
      data: {
        clerkId: 'admin-clerk-id-temp',
        email: 'admin@unsta.edu.ar',
        name: 'Administrador UNSTA',
        studentCode: 'ADMIN001',
        role: 'ADMIN'
      }
    })
    console.log('✅ Usuario administrador creado:', adminUser.email)

    // Crear secciones de donación
    const sections = [
      {
        id: 'materiales-1',
        name: 'Materiales de Estudio',
        description: 'Libros, útiles escolares y materiales educativos'
      },
      {
        id: 'monetaria-1',
        name: 'Donación Monetaria', 
        description: 'Contribución económica para causas solidarias'
      },
      {
        id: 'festivas-1',
        name: 'Donaciones Festivas',
        description: 'Celebraciones y eventos especiales de caridad'
      },
      {
        id: 'vestimenta-1',
        name: 'Donaciones de Vestimenta',
        description: 'Ropa y calzado para personas necesitadas'
      }
    ]

    for (const section of sections) {
      await prisma.donationSection.upsert({
        where: { id: section.id },
        update: {},
        create: section
      })
    }
    console.log('✅ Secciones de donación creadas')

    // Crear actividades de ejemplo
    const activities = [
      {
        id: 'actividad-1',
        title: 'Recolección de Alimentos',
        description: 'Recolección de alimentos no perecederos para familias necesitadas',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: 'Plaza Central',
        maxParticipants: 20
      },
      {
        id: 'actividad-2',
        title: 'Tutorías Gratuitas',
        description: 'Sesiones de tutoría para estudiantes de secundaria',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        location: 'Biblioteca Universitaria',
        maxParticipants: 15
      },
      {
        id: 'actividad-3',
        title: 'Limpieza de Espacios Verdes',
        description: 'Mantenimiento y limpieza de parques y espacios públicos',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        location: 'Parque Municipal',
        maxParticipants: 25
      },
      {
        id: 'actividad-4',
        title: 'Compañía a Adultos Mayores',
        description: 'Visitas y compañía a adultos mayores en hogares de ancianos',
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        location: 'Hogar de Ancianos San José',
        maxParticipants: 10
      }
    ]

    for (const activity of activities) {
      await prisma.activity.upsert({
        where: { id: activity.id },
        update: {},
        create: activity
      })
    }
    console.log('✅ Actividades creadas')

    return NextResponse.json({ 
      success: true, 
      message: 'Base de datos restaurada exitosamente!',
      adminUser: {
        email: adminUser.email,
        name: adminUser.name,
        studentCode: adminUser.studentCode,
        role: adminUser.role
      }
    })

  } catch (error) {
    console.error('❌ Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error restaurando la base de datos',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
