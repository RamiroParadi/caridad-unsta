import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function StudentDashboard() {
  const donationSections = [
    {
      title: "MATERIALES DE ESTUDIO",
      url: "/dashboards/usuario/donaciones/materiales",
      bgColor: "bg-blue-600",
      textColor: "text-white",
      icon: "📚"
    },
    {
      title: "DONACION MONETARIA",
      url: "/dashboards/usuario/donaciones/monetarias",
      bgColor: "bg-white",
      textColor: "text-black",
      icon: "💰"
    },
    {
      title: "NOCHES DE CARIDAD",
      url: "/dashboards/usuario/eventos",
      bgColor: "bg-blue-600",
      textColor: "text-white",
      icon: "🌙"
    },
    {
      title: "DONACION FESTIVAS",
      url: "/dashboards/usuario/donaciones/festivas",
      bgColor: "bg-white",
      textColor: "text-black",
      icon: "🎉"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center text-white">
        <h1 className="text-3xl font-bold mb-2">Bienvenido a CARIDAD UNSTA</h1>
        <p className="text-blue-200">Selecciona una opción para realizar tu donación</p>
      </div>

      <div className="space-y-4">
        {donationSections.map((section, index) => (
          <Link key={section.title} href={section.url}>
            <div className={`relative ${section.bgColor} ${section.textColor} rounded-lg p-8 hover:opacity-90 transition-opacity cursor-pointer group`}>
              {/* Flechas laterales */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="h-8 w-8" />
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-8 w-8" />
              </div>
              
              {/* Contenido del banner */}
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl">{section.icon}</span>
                <h2 className="text-2xl font-bold text-center">{section.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Información adicional */}
      <div className="bg-blue-800 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">¿Cómo funciona?</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">1️⃣</div>
            <h4 className="font-semibold mb-2">Selecciona</h4>
            <p className="text-sm text-blue-200">Elige el tipo de donación que deseas realizar</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">2️⃣</div>
            <h4 className="font-semibold mb-2">Completa</h4>
            <p className="text-sm text-blue-200">Llena los datos de tu donación</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">3️⃣</div>
            <h4 className="font-semibold mb-2">Confirma</h4>
            <p className="text-sm text-blue-200">Tu donación será procesada y confirmada</p>
          </div>
        </div>
      </div>
    </div>
  )
}
