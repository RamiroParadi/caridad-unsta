import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  try {
    // 1. CREAR USUARIOS
    console.log('👥 Creando usuarios...')
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@unsta.edu.ar' },
      update: {},
      create: {
        clerkId: 'admin-clerk-id-temp',
        email: 'admin@unsta.edu.ar',
        name: 'Administrador UNSTA',
        studentCode: 'ADMIN001',
        role: 'ADMIN'
      }
    })

    const studentUser = await prisma.user.upsert({
      where: { email: 'estudiante@unsta.edu.ar' },
      update: {},
      create: {
        clerkId: 'student-clerk-id-temp',
        email: 'estudiante@unsta.edu.ar',
        name: 'Estudiante Ejemplo',
        studentCode: 'CIA7 0050',
        role: 'ALUMNO'
      }
    })

    console.log('✅ Usuarios creados:', adminUser.email, studentUser.email)

    // 2. CREAR SECCIONES DE DONACIÓN
    console.log('📦 Creando secciones de donación...')
    
    const sections = [
      {
        name: 'Materiales de Estudio',
        description: 'Libros, útiles escolares y materiales educativos'
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

    const createdSections = []
    for (const section of sections) {
      const created = await prisma.donationSection.upsert({
        where: { name: section.name },
        update: {},
        create: section
      })
      createdSections.push(created)
    }

    console.log('✅ Secciones de donación creadas:', createdSections.length)

    // 3. CREAR ACTIVIDADES
    console.log('🎯 Creando actividades...')
    
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

    const createdActivities = []
    for (const activity of activities) {
      const created = await prisma.activity.upsert({
        where: { title: activity.title },
        update: {},
        create: activity
      })
      createdActivities.push(created)
    }

    console.log('✅ Actividades creadas:', createdActivities.length)

    // 4. CREAR PARTICIPANTES EN ACTIVIDADES
    console.log('👥 Creando participantes...')
    
    // El estudiante participa en las primeras 2 actividades
    for (let i = 0; i < 2; i++) {
      await prisma.activityParticipant.upsert({
        where: {
          userId_activityId: {
            userId: studentUser.id,
            activityId: createdActivities[i].id
          }
        },
        update: {},
        create: {
          userId: studentUser.id,
          activityId: createdActivities[i].id
        }
      })
    }

    console.log('✅ Participantes creados')

    // 5. CREAR DONACIONES DE EJEMPLO
    console.log('💰 Creando donaciones de ejemplo...')
    
    const donations = [
      {
        amount: 5000,
        description: 'Donación para materiales de estudio',
        donorName: 'Estudiante Ejemplo',
        donorEmail: 'estudiante@unsta.edu.ar',
        status: 'CONFIRMADA',
        userId: studentUser.id,
        sectionId: createdSections[0].id // Materiales de Estudio
      },
      {
        amount: 0,
        description: 'Donación de ropa para personas necesitadas',
        donorName: 'Administrador UNSTA',
        donorEmail: 'admin@unsta.edu.ar',
        status: 'CONFIRMADA',
        userId: adminUser.id,
        sectionId: createdSections[2].id // Donaciones de Vestimenta
      }
    ]

    for (const donation of donations) {
      await prisma.donation.create({
        data: donation
      })
    }

    console.log('✅ Donaciones creadas:', donations.length)

    // 6. CREAR NOTIFICACIONES
    console.log('🔔 Creando notificaciones...')
    
    const notifications = [
      {
        title: 'Bienvenido al Sistema',
        message: 'Tu cuenta ha sido creada exitosamente. ¡Bienvenido a CARIDAD UNSTA!',
        type: 'GENERAL',
        userId: adminUser.id
      },
      {
        title: 'Nueva Actividad Disponible',
        message: 'Se ha creado una nueva actividad: Recolección de Alimentos. ¡Únete!',
        type: 'ACTIVIDAD',
        userId: studentUser.id
      },
      {
        title: 'Donación Confirmada',
        message: 'Tu donación de materiales de estudio ha sido confirmada.',
        type: 'DONACION',
        userId: studentUser.id
      }
    ]

    for (const notification of notifications) {
      await prisma.notification.create({
        data: notification
      })
    }

    console.log('✅ Notificaciones creadas:', notifications.length)

    console.log('\n🎉 SEED COMPLETADO EXITOSAMENTE!')
    console.log('='.repeat(50))
    console.log('📧 ADMINISTRADOR:')
    console.log('   Email: admin@unsta.edu.ar')
    console.log('   Código: ADMIN001')
    console.log('   Rol: ADMIN')
    console.log('')
    console.log('📧 ESTUDIANTE:')
    console.log('   Email: estudiante@unsta.edu.ar')
    console.log('   Código: CIA7 0050')
    console.log('   Rol: ALUMNO')
    console.log('')
    console.log('🌐 ACCESO:')
    console.log('   Ve a: http://localhost:3001/sign-in')
    console.log('   Usa cualquiera de los emails de arriba')
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e)
    process.exit(1)
  })
