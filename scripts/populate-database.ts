import { PrismaClient } from '../app/generated/prisma'

const prisma = new PrismaClient()

// Datos de prueba realistas
const students = [
  { name: 'María González', email: 'maria.gonzalez@unsta.edu.ar', code: 'CIA7 0001' },
  { name: 'Carlos Rodríguez', email: 'carlos.rodriguez@unsta.edu.ar', code: 'CIA7 0002' },
  { name: 'Ana Martínez', email: 'ana.martinez@unsta.edu.ar', code: 'CIA7 0003' },
  { name: 'Luis Fernández', email: 'luis.fernandez@unsta.edu.ar', code: 'CIA7 0004' },
  { name: 'Sofia López', email: 'sofia.lopez@unsta.edu.ar', code: 'CIA7 0005' },
  { name: 'Diego Sánchez', email: 'diego.sanchez@unsta.edu.ar', code: 'CIA7 0006' },
  { name: 'Valentina García', email: 'valentina.garcia@unsta.edu.ar', code: 'CIA7 0007' },
  { name: 'Mateo Pérez', email: 'mateo.perez@unsta.edu.ar', code: 'CIA7 0008' },
  { name: 'Isabella Torres', email: 'isabella.torres@unsta.edu.ar', code: 'CIA7 0009' },
  { name: 'Sebastián Ruiz', email: 'sebastian.ruiz@unsta.edu.ar', code: 'CIA7 0010' },
  { name: 'Camila Herrera', email: 'camila.herrera@unsta.edu.ar', code: 'CIA7 0011' },
  { name: 'Nicolás Jiménez', email: 'nicolas.jimenez@unsta.edu.ar', code: 'CIA7 0012' },
  { name: 'Lucía Vargas', email: 'lucia.vargas@unsta.edu.ar', code: 'CIA7 0013' },
  { name: 'Alejandro Castro', email: 'alejandro.castro@unsta.edu.ar', code: 'CIA7 0014' },
  { name: 'Paula Morales', email: 'paula.morales@unsta.edu.ar', code: 'CIA7 0015' },
  { name: 'Gabriel Romero', email: 'gabriel.romero@unsta.edu.ar', code: 'CIA7 0016' },
  { name: 'Martina Flores', email: 'martina.flores@unsta.edu.ar', code: 'CIA7 0017' },
  { name: 'Facundo Aguilar', email: 'facundo.aguilar@unsta.edu.ar', code: 'CIA7 0018' },
  { name: 'Constanza Vega', email: 'constanza.vega@unsta.edu.ar', code: 'CIA7 0019' },
  { name: 'Maximiliano Rojas', email: 'maximiliano.rojas@unsta.edu.ar', code: 'CIA7 0020' }
]

const activities = [
  {
    title: 'Campaña de Donación de Libros',
    description: 'Recolección de libros usados para biblioteca comunitaria. Trae tus libros en buen estado y ayuda a fomentar la lectura.',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde ahora
    location: 'Biblioteca Central UNSTA',
    maxParticipants: 30
  },
  {
    title: 'Jornada de Limpieza del Campus',
    description: 'Actividad de voluntariado para mantener limpio nuestro campus universitario. Todos los estudiantes son bienvenidos.',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días desde ahora
    location: 'Campus UNSTA - Área Verde',
    maxParticipants: 50
  },
  {
    title: 'Recolección de Ropa de Invierno',
    description: 'Campaña solidaria para recoger abrigos y ropa de invierno para familias necesitadas del barrio.',
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 días desde ahora
    location: 'Hall Principal UNSTA',
    maxParticipants: 25
  },
  {
    title: 'Taller de Reciclaje Creativo',
    description: 'Aprende a reciclar materiales y crear objetos útiles. Actividad educativa y ecológica.',
    date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 días desde ahora
    location: 'Aula 101 - Edificio A',
    maxParticipants: 20
  },
  {
    title: 'Campaña de Donación de Útiles Escolares',
    description: 'Recolección de mochilas, cuadernos, lápices y otros útiles para niños de escuelas rurales.',
    date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 días desde ahora
    location: 'Secretaría de Extensión',
    maxParticipants: 40
  },
  {
    title: 'Voluntariado en Hogar de Ancianos',
    description: 'Visita solidaria al hogar de ancianos San José. Comparte tiempo y alegría con los abuelos.',
    date: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // 42 días desde ahora
    location: 'Hogar de Ancianos San José',
    maxParticipants: 15
  },
  {
    title: 'Feria de Trueque Solidario',
    description: 'Intercambia objetos que ya no uses por otros que necesites. Una forma sostenible de dar nueva vida a las cosas.',
    date: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000), // 49 días desde ahora
    location: 'Patio Central UNSTA',
    maxParticipants: 60
  },
  {
    title: 'Campaña de Donación de Alimentos No Perecederos',
    description: 'Recolección de alimentos para el banco de alimentos local. Cualquier donación es bienvenida.',
    date: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000), // 56 días desde ahora
    location: 'Entrada Principal UNSTA',
    maxParticipants: 35
  }
]

const donationItems = [
  // Materiales de Estudio
  'Libro de Matemáticas Básicas', 'Cuaderno universitario', 'Calculadora científica', 'Diccionario de español',
  'Libro de historia argentina', 'Geometría escolar', 'Cuadernos rayados', 'Lápices de colores',
  'Regla y escuadra', 'Libro de literatura', 'Manual de química', 'Cuaderno de notas',
  
  // Vestimenta
  'Chaqueta de invierno', 'Pantalones jeans', 'Campera deportiva', 'Remera básica',
  'Bufanda de lana', 'Guantes de abrigo', 'Zapatillas deportivas', 'Sweater de algodón',
  'Pantalón de jogging', 'Gorro de lana', 'Medias de abrigo', 'Cinturón de cuero',
  
  // Materiales Varios
  'Mochila escolar', 'Botella de agua', 'Lonchera', 'Estuche para lápices',
  'Carpeta con hojas', 'Marcadores', 'Tijeras escolares', 'Pegamento en barra',
  'Goma de borrar', 'Sacapuntas', 'Lápiz negro', 'Bolígrafo azul',
  
  // Donaciones Festivas
  'Juguete educativo', 'Libro de cuentos', 'Puzzle infantil', 'Peluche',
  'Juego de mesa', 'Rompecabezas', 'Libro para colorear', 'Crayones'
]

const donationSections = [
  { name: 'Materiales de Estudio', description: 'Libros, útiles escolares y materiales educativos' },
  { name: 'Vestimenta', description: 'Ropa y calzado en buen estado' },
  { name: 'Materiales Varios', description: 'Objetos diversos útiles para la comunidad' },
  { name: 'Donaciones Festivas', description: 'Celebraciones y eventos especiales de caridad' }
]

async function main() {
  console.log('🚀 Iniciando población masiva de la base de datos...')

  try {
    // 1. CREAR USUARIOS ESTUDIANTES
    console.log('👥 Creando usuarios estudiantes...')
    const createdUsers = []
    
    for (const student of students) {
      const user = await prisma.user.upsert({
        where: { email: student.email },
        update: {},
        create: {
          clerkId: `clerk-${student.code.replace(' ', '-').toLowerCase()}`,
          email: student.email,
          name: student.name,
          studentCode: student.code,
          role: 'ALUMNO'
        }
      })
      createdUsers.push(user)
    }
    
    console.log(`✅ ${createdUsers.length} usuarios estudiantes creados`)

    // 2. CREAR SECCIONES DE DONACIÓN
    console.log('📦 Creando secciones de donación...')
    const createdSections = []
    
    for (const section of donationSections) {
      // Verificar si ya existe
      const existingSection = await prisma.donationSection.findFirst({
        where: { name: section.name }
      })
      
      if (!existingSection) {
        const createdSection = await prisma.donationSection.create({
          data: section
        })
        createdSections.push(createdSection)
      } else {
        createdSections.push(existingSection)
      }
    }
    
    console.log(`✅ ${createdSections.length} secciones de donación creadas`)

    // 3. CREAR ACTIVIDADES
    console.log('🎯 Creando actividades...')
    const createdActivities = []
    
    for (const activity of activities) {
      const createdActivity = await prisma.activity.create({
        data: activity
      })
      createdActivities.push(createdActivity)
    }
    
    console.log(`✅ ${createdActivities.length} actividades creadas`)

    // 4. CREAR DONACIONES
    console.log('🎁 Creando donaciones...')
    let donationCount = 0
    
    for (let i = 0; i < 50; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)]
      const randomSection = createdSections[Math.floor(Math.random() * createdSections.length)]
      const randomItem = donationItems[Math.floor(Math.random() * donationItems.length)]
      
      // Crear donación con fecha aleatoria en los últimos 30 días
      const randomDaysAgo = Math.floor(Math.random() * 30)
      const createdAt = new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000)
      
      const donation = await prisma.donation.create({
        data: {
          amount: 0, // No hay donaciones monetarias
          description: randomItem,
          isAnonymous: Math.random() > 0.7, // 30% anónimas
          status: ['CONFIRMADA', 'PENDIENTE', 'RECHAZADA'][Math.floor(Math.random() * 3)],
          donorName: Math.random() > 0.7 ? null : randomUser.name,
          donorEmail: Math.random() > 0.7 ? null : randomUser.email,
          userId: randomUser.id,
          sectionId: randomSection.id,
          createdAt
        }
      })
      donationCount++
    }
    
    console.log(`✅ ${donationCount} donaciones creadas`)

    // 5. INSCRIBIR USUARIOS EN ACTIVIDADES
    console.log('📝 Inscribiendo usuarios en actividades...')
    let inscriptionCount = 0
    
    for (const activity of createdActivities) {
      // Cada actividad tendrá entre 5 y 15 participantes aleatorios
      const participantCount = Math.floor(Math.random() * 11) + 5 // 5-15
      const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random())
      
      for (let i = 0; i < Math.min(participantCount, shuffledUsers.length); i++) {
        const user = shuffledUsers[i]
        
        // Verificar si ya está inscrito
        const existingParticipation = await prisma.activityParticipant.findUnique({
          where: {
            userId_activityId: {
              userId: user.id,
              activityId: activity.id
            }
          }
        })
        
        if (!existingParticipation) {
          await prisma.activityParticipant.create({
            data: {
              userId: user.id,
              activityId: activity.id,
              joinedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000) // Últimos 7 días
            }
          })
          inscriptionCount++
        }
      }
    }
    
    console.log(`✅ ${inscriptionCount} inscripciones creadas`)

    // 6. CREAR NOTIFICACIONES
    console.log('🔔 Creando notificaciones...')
    const notifications = [
      {
        title: '¡Nueva campaña de donación!',
        message: 'Se ha lanzado una nueva campaña de recolección de libros. ¡Participa y ayuda a fomentar la lectura!',
        type: 'GENERAL',
        isGlobal: true
      },
      {
        title: 'Recordatorio: Jornada de limpieza',
        message: 'No olvides que este sábado tenemos la jornada de limpieza del campus. ¡Te esperamos!',
        type: 'ACTIVIDAD',
        isGlobal: true
      },
      {
        title: 'Gracias por tu donación',
        message: 'Tu donación de útiles escolares ha sido recibida y confirmada. ¡Gracias por tu solidaridad!',
        type: 'DONACION',
        isGlobal: false
      },
      {
        title: 'Voluntariado en hogar de ancianos',
        message: 'Se ha programado una visita al hogar de ancianos San José. ¡Inscríbete y comparte alegría!',
        type: 'ACTIVIDAD',
        isGlobal: true
      },
      {
        title: 'Feria de trueque solidario',
        message: 'Próximamente tendremos una feria de trueque. ¡Prepara los objetos que quieras intercambiar!',
        type: 'GENERAL',
        isGlobal: true
      }
    ]
    
    let notificationCount = 0
    for (const notification of notifications) {
      await prisma.notification.create({
        data: {
          title: notification.title,
          message: notification.message,
          type: notification.type,
          isGlobal: notification.isGlobal,
          userId: notification.isGlobal ? null : createdUsers[Math.floor(Math.random() * createdUsers.length)].id,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000) // Últimos 10 días
        }
      })
      notificationCount++
    }
    
    console.log(`✅ ${notificationCount} notificaciones creadas`)

    // 7. ESTADÍSTICAS FINALES
    const totalUsers = await prisma.user.count()
    const totalActivities = await prisma.activity.count()
    const totalDonations = await prisma.donation.count()
    const totalParticipants = await prisma.activityParticipant.count()
    const totalNotifications = await prisma.notification.count()

    console.log('\n🎉 ¡Base de datos poblada exitosamente!')
    console.log('📊 Estadísticas finales:')
    console.log(`   👥 Usuarios: ${totalUsers}`)
    console.log(`   🎯 Actividades: ${totalActivities}`)
    console.log(`   🎁 Donaciones: ${totalDonations}`)
    console.log(`   📝 Inscripciones: ${totalParticipants}`)
    console.log(`   🔔 Notificaciones: ${totalNotifications}`)
    console.log('\n✨ El sistema ahora tiene datos realistas para mostrar en los gráficos!')

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
