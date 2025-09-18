import { prisma } from '../lib/prisma'

async function main() {
  console.log('🚀 Inicializando base de datos...')

  try {
    // Crear usuario administrador
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@unsta.edu.ar' },
      update: {},
      create: {
        clerkId: 'admin-clerk-id', // Este será reemplazado cuando el usuario se registre en Clerk
        email: 'admin@unsta.edu.ar',
        name: 'Administrador UNSTA',
        studentCode: 'ADMIN001',
        role: 'ADMIN' as const
      }
    })

    console.log('✅ Usuario administrador creado:', adminUser)

    // Crear secciones de donación por defecto
    const donationSections = [
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

    for (const section of donationSections) {
      await prisma.donationSection.upsert({
        where: { id: section.id },
        update: {},
        create: section
      })
    }

    console.log('✅ Secciones de donación creadas')

    // Crear algunas actividades de ejemplo
    const activities = [
      {
        id: 'actividad-1',
        title: 'Recolección de Alimentos',
        description: 'Recolección de alimentos no perecederos para familias necesitadas',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En una semana
        location: 'Plaza Central',
        maxParticipants: 20
      },
      {
        id: 'actividad-2',
        title: 'Tutorías Gratuitas',
        description: 'Sesiones de tutoría para estudiantes de secundaria',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // En dos semanas
        location: 'Biblioteca Universitaria',
        maxParticipants: 15
      },
      {
        id: 'actividad-3',
        title: 'Limpieza de Espacios Verdes',
        description: 'Mantenimiento y limpieza de parques y espacios públicos',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // En tres semanas
        location: 'Parque Municipal',
        maxParticipants: 25
      },
      {
        id: 'actividad-4',
        title: 'Compañía a Adultos Mayores',
        description: 'Visitas y compañía a adultos mayores en hogares de ancianos',
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // En un mes
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

    console.log('✅ Actividades de ejemplo creadas')

    console.log('🎉 Base de datos inicializada correctamente!')
    console.log('📧 Email del administrador: admin@unsta.edu.ar')
    console.log('🔑 Código de estudiante: ADMIN001')

  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
