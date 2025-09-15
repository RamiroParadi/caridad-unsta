import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...')

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

    for (const section of sections) {
      await prisma.donationSection.create({
        data: section
      })
    }
    console.log('✅ Secciones de donación creadas')

    // Crear actividades de ejemplo
    const activities = [
      {
        title: 'Recolección de Alimentos',
        description: 'Recolección de alimentos no perecederos para familias necesitadas',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: 'Plaza Central',
        maxParticipants: 20
      },
      {
        title: 'Tutorías Gratuitas',
        description: 'Sesiones de tutoría para estudiantes de secundaria',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        location: 'Biblioteca Universitaria',
        maxParticipants: 15
      },
      {
        title: 'Limpieza de Espacios Verdes',
        description: 'Mantenimiento y limpieza de parques y espacios públicos',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        location: 'Parque Municipal',
        maxParticipants: 25
      },
      {
        title: 'Compañía a Adultos Mayores',
        description: 'Visitas y compañía a adultos mayores en hogares de ancianos',
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        location: 'Hogar de Ancianos San José',
        maxParticipants: 10
      }
    ]

    for (const activity of activities) {
      await prisma.activity.create({
        data: activity
      })
    }
    console.log('✅ Actividades creadas')

    console.log('🎉 Base de datos restaurada exitosamente!')
    console.log('📧 Email: admin@unsta.edu.ar')
    console.log('🔑 Código: ADMIN001')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
