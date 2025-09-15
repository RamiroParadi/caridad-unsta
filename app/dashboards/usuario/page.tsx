import Link from "next/link"
import { ChevronRight, BookOpen, DollarSign, Moon, PartyPopper, Heart } from "lucide-react"

export default function StudentDashboard() {
  const donationSections = [
    {
      title: "MATERIALES DE ESTUDIO",
      url: "/dashboards/usuario/donaciones/materiales",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
      textColor: "text-white",
      icon: BookOpen,
      description: "Libros, útiles escolares y materiales educativos"
    },
    {
      title: "DONACIÓN MONETARIA",
      url: "/dashboards/usuario/donaciones/monetarias",
      bgColor: "bg-gradient-to-br from-green-500 to-green-700",
      textColor: "text-white",
      icon: DollarSign,
      description: "Contribución económica para causas solidarias"
    },
    {
      title: "NOCHES DE CARIDAD",
      url: "/dashboards/usuario/eventos",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-700",
      textColor: "text-white",
      icon: Moon,
      description: "Eventos nocturnos de voluntariado y solidaridad"
    },
    {
      title: "DONACIONES FESTIVAS",
      url: "/dashboards/usuario/donaciones/festivas",
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-700",
      textColor: "text-white",
      icon: PartyPopper,
      description: "Celebraciones y eventos especiales de caridad"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header mejorado */}
      <div className="text-center text-white">
        <div className="flex items-center justify-center mb-4">
          <Heart className="h-8 w-8 text-red-400 mr-3" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Bienvenido a CARIDAD UNSTA
          </h1>
          <Heart className="h-8 w-8 text-red-400 ml-3" />
        </div>
        <p className="text-blue-200 text-lg">Selecciona una opción para realizar tu donación</p>
      </div>

      {/* Grid de donaciones mejorado */}
      <div className="grid md:grid-cols-2 gap-6">
        {donationSections.map((section, index) => {
          const IconComponent = section.icon
          return (
            <Link key={section.title} href={section.url}>
              <div className={`relative ${section.bgColor} ${section.textColor} rounded-xl p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden`}>
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                {/* Icono y contenido */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="h-12 w-12 opacity-90" />
                    <ChevronRight className="h-6 w-6 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  
                  <h2 className="text-xl font-bold mb-2">{section.title}</h2>
                  <p className="text-sm opacity-90 leading-relaxed">{section.description}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Información adicional mejorada */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white shadow-xl">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">¿Cómo funciona?</h3>
          <p className="text-blue-200">Proceso simple y seguro para realizar tu donación</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center group">
            <div className="bg-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-2xl">1</span>
            </div>
            <h4 className="font-semibold mb-2 text-lg">Selecciona</h4>
            <p className="text-sm text-blue-200">Elige el tipo de donación que deseas realizar</p>
          </div>
          <div className="text-center group">
            <div className="bg-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-2xl">2</span>
            </div>
            <h4 className="font-semibold mb-2 text-lg">Completa</h4>
            <p className="text-sm text-blue-200">Llena los datos de tu donación de forma segura</p>
          </div>
          <div className="text-center group">
            <div className="bg-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <span className="text-2xl">3</span>
            </div>
            <h4 className="font-semibold mb-2 text-lg">Confirma</h4>
            <p className="text-sm text-blue-200">Tu donación será procesada y confirmada</p>
          </div>
        </div>
      </div>
    </div>
  )
}
