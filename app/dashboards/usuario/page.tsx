"use client"

import Link from "next/link"
import { Heart, Users, Target, Globe, BookOpen, DollarSign, Moon, PartyPopper, ArrowRight, CheckCircle, Star } from "lucide-react"

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

  const objectives = [
    {
      icon: Heart,
      title: "Solidaridad Estudiantil",
      description: "Fomentar la cultura de ayuda mutua entre los estudiantes de la UNSTA"
    },
    {
      icon: Users,
      title: "Comunidad Unida",
      description: "Crear una red de apoyo que trascienda las diferencias académicas"
    },
    {
      icon: Target,
      title: "Impacto Local",
      description: "Generar un impacto positivo directo en nuestra comunidad universitaria"
    },
    {
      icon: Globe,
      title: "Responsabilidad Social",
      description: "Desarrollar el sentido de responsabilidad social en futuros profesionales"
    }
  ]


  return (
    <div className="space-y-12">
      {/* Hero Section - Carta de Presentación */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Heart className="h-12 w-12 text-red-500 mr-4" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
            CARIDAD UNSTA
          </h1>
          <Heart className="h-12 w-12 text-red-500 ml-4" />
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Construyendo una Comunidad Universitaria Más Solidaria
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            En la Universidad del Norte Santo Tomás de Aquino, creemos que la educación va más allá de las aulas. 
            CARIDAD UNSTA es nuestra iniciativa estudiantil que busca fomentar la solidaridad, el apoyo mutuo y 
            la responsabilidad social dentro de nuestra comunidad universitaria.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <p className="text-gray-700 font-medium italic">
              "La verdadera educación no solo forma profesionales, sino ciudadanos comprometidos con el bien común"
            </p>
          </div>
        </div>
      </div>

      {/* Objetivos del Proyecto */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Nuestros Objetivos</h3>
          <p className="text-gray-600 text-lg">Lo que queremos lograr en nuestra facultad</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {objectives.map((objective, index) => {
            const IconComponent = objective.icon
            return (
              <div 
                key={index} 
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden"
              >
                
                {/* Contenido principal */}
                <div className="relative z-10 text-center">
                  {/* Icono con animación */}
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                    <IconComponent className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  {/* Título con efecto de escritura */}
                  <h4 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                    {objective.title}
                  </h4>
                  
                  {/* Descripción con efecto de aparición */}
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {objective.description}
                  </p>
                  
                  
                </div>
                
              </div>
            )
          })}
        </div>
      </div>

      {/* Alcance y Visión */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Alcance Actual */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <div className="flex items-center mb-6">
            <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mr-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-800">Alcance Actual</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
              <p className="text-green-700">Cobertura en todas las carreras de la UNSTA</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
              <p className="text-green-700">Red de voluntarios en campus principal</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
              <p className="text-green-700">Programas de apoyo estudiantil activos</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
              <p className="text-green-700">Colaboración con organizaciones locales</p>
            </div>
          </div>
        </div>

        {/* Visión a Futuro */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
          <div className="flex items-center mb-6">
            <div className="bg-purple-500 rounded-full w-12 h-12 flex items-center justify-center mr-4">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-purple-800">Visión a Futuro</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <ArrowRight className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
              <p className="text-purple-700">Expansión a sedes regionales de la UNSTA</p>
            </div>
            <div className="flex items-start">
              <ArrowRight className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
              <p className="text-purple-700">Programa de becas estudiantiles</p>
            </div>
            <div className="flex items-start">
              <ArrowRight className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
              <p className="text-purple-700">Red nacional de universidades solidarias</p>
            </div>
            <div className="flex items-start">
              <ArrowRight className="h-5 w-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
              <p className="text-purple-700">Impacto en comunidades vulnerables</p>
            </div>
          </div>
        </div>
      </div>


      {/* Acceso a Donaciones */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">¿Quieres Contribuir?</h3>
          <p className="text-gray-600 text-lg">Únete a nuestra misión solidaria</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {donationSections.map((section, index) => {
            const IconComponent = section.icon
            return (
              <Link key={section.title} href={section.url}>
                <div className={`relative ${section.bgColor} ${section.textColor} rounded-xl p-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="h-10 w-10 opacity-90" />
                      <ArrowRight className="h-5 w-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    
                    <h4 className="text-lg font-bold mb-2">{section.title}</h4>
                    <p className="text-sm opacity-90 leading-relaxed">{section.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">¡Sé Parte del Cambio!</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Cada donación, cada voluntario, cada acto de solidaridad suma. 
          Juntos podemos construir una universidad más humana y comprometida con el bien común.
        </p>
        <div className="flex items-center justify-center">
          <Heart className="h-6 w-6 text-red-500 mr-2" />
          <span className="text-lg font-semibold text-gray-700">CARIDAD UNSTA - Unidos por una causa común</span>
          <Heart className="h-6 w-6 text-red-500 ml-2" />
        </div>
      </div>
    </div>
  )
}
