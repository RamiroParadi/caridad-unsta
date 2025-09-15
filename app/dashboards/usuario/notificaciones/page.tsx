import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bell, CheckCircle, Clock, Calendar, Heart } from "lucide-react"
import Link from "next/link"

export default function NotificacionesPage() {
  return (
    <div className="space-y-8">
      {/* Header mejorado */}
      <div className="text-center text-white">
        <div className="flex items-center justify-center mb-4">
          <Bell className="h-8 w-8 text-yellow-400 mr-3" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
            Notificaciones
          </h2>
          <Bell className="h-8 w-8 text-yellow-400 ml-3" />
        </div>
        <p className="text-blue-200 text-lg">Mantente informado sobre las últimas actividades y eventos</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-gradient-to-r from-yellow-800 to-yellow-900 border-yellow-700 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="bg-yellow-600 rounded-full p-2">
                <Bell className="h-5 w-5 text-white" />
              </div>
              Notificaciones Recientes
            </CardTitle>
            <CardDescription className="text-yellow-200">
              Aquí encontrarás todas las notificaciones importantes de tu actividad solidaria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Notificación 1 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-600/30 hover:bg-white/15 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 rounded-full p-2 mt-1">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">Nueva Actividad: Recolección de Alimentos</h4>
                    <p className="text-sm text-yellow-200 mb-3">Se ha creado una nueva actividad de recolección de alimentos para el próximo sábado. ¡Únete y ayuda a la comunidad!</p>
                    <div className="flex items-center gap-2 text-xs text-yellow-300">
                      <Clock className="h-3 w-3" />
                      Hace 2 horas
                    </div>
                  </div>
                </div>
              </div>

              {/* Notificación 2 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-600/30 hover:bg-white/15 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 rounded-full p-2 mt-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">Donación Confirmada</h4>
                    <p className="text-sm text-yellow-200 mb-3">Tu donación de materiales de estudio ha sido confirmada y será distribuida pronto. ¡Gracias por tu generosidad!</p>
                    <div className="flex items-center gap-2 text-xs text-yellow-300">
                      <Clock className="h-3 w-3" />
                      Hace 1 día
                    </div>
                  </div>
                </div>
              </div>

              {/* Notificación 3 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-600/30 hover:bg-white/15 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500 rounded-full p-2 mt-1">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">Evento Especial: Noche de Caridad</h4>
                    <p className="text-sm text-yellow-200 mb-3">No te pierdas nuestro evento especial de caridad el próximo viernes. Será una noche llena de solidaridad y comunidad.</p>
                    <div className="flex items-center gap-2 text-xs text-yellow-300">
                      <Clock className="h-3 w-3" />
                      Hace 3 días
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
