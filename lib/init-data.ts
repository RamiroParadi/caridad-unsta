import { DonationSectionService } from './services/donation-section-service'

export async function initializeDefaultData() {
  try {
    // Verificar si ya existen secciones
    const existingSections = await DonationSectionService.getAllSections()
    
    if (existingSections.length === 0) {
      console.log('Inicializando secciones de donación por defecto...')
      
      // Crear secciones de donación por defecto
      const defaultSections = [
        {
          name: 'Materiales de Estudio',
          description: 'Libros, útiles escolares, calculadoras y otros materiales educativos'
        },
        {
          name: 'Donación de Vestimenta',
          description: 'Ropa, zapatos y accesorios en buen estado'
        },
        {
          name: 'Donaciones Monetarias',
          description: 'Contribuciones económicas para apoyar las actividades de caridad'
        },
        {
          name: 'Donaciones Festivas',
          description: 'Regalos, juguetes y artículos especiales para fechas festivas'
        }
      ]

      for (const section of defaultSections) {
        await DonationSectionService.createSection(section)
        console.log(`Sección creada: ${section.name}`)
      }

      console.log('✅ Secciones de donación inicializadas correctamente')
    } else {
      console.log('ℹ️ Las secciones de donación ya existen')
    }
  } catch (error) {
    console.error('❌ Error al inicializar datos por defecto:', error)
  }
}
