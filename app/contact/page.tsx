import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Contacto - Administración
          </h1>
          <p className="text-gray-600">
            Si necesitas registrarte en el sistema, contacta a los administradores
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Información de contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Información de Contacto
              </CardTitle>
              <CardDescription>
                Datos para contactar a los administradores del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Email Administrativo</p>
                  <p className="text-gray-600">admin@unsta.edu.ar</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Teléfono</p>
                  <p className="text-gray-600">+54 381 424-8022</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Dirección</p>
                  <p className="text-gray-600">
                    Universidad del Norte Santo Tomás de Aquino<br />
                    Tucumán, Argentina
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Horarios de Atención</p>
                  <p className="text-gray-600">
                    Lunes a Viernes: 8:00 - 18:00<br />
                    Sábados: 8:00 - 12:00
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del proceso */}
          <Card>
            <CardHeader>
              <CardTitle>Proceso de Registro</CardTitle>
              <CardDescription>
                Pasos para registrarte en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Contacta al Administrador</p>
                    <p className="text-sm text-gray-600">
                      Envía un email o llama para solicitar tu registro
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Proporciona tu Información</p>
                    <p className="text-sm text-gray-600">
                      Nombre, email, y datos académicos necesarios
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Espera la Confirmación</p>
                    <p className="text-sm text-gray-600">
                      El administrador procesará tu solicitud
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Accede al Sistema</p>
                    <p className="text-sm text-gray-600">
                      Una vez registrado, podrás iniciar sesión normalmente
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button asChild className="w-full">
                  <a href="mailto:admin@unsta.edu.ar?subject=Solicitud de Registro - Sistema Caridad UNSTA">
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Email de Solicitud
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <a href="/sign-in">
              Volver al Inicio de Sesión
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
