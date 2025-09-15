import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotificacionesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboards/usuario">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white">Notificaciones</h2>
          <p className="text-blue-200">Mantente informado sobre las últimas actividades y eventos</p>
        </div>
      </div>

      <div className="grid gap-4">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔔 Notificaciones
            </CardTitle>
            <CardDescription>
              Aquí encontrarás todas las notificaciones importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Nueva Actividad: Recolección de Alimentos</h4>
                <p className="text-sm text-muted-foreground">Se ha creado una nueva actividad de recolección de alimentos para el próximo sábado.</p>
                <p className="text-xs text-muted-foreground mt-1">Hace 2 horas</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Donación Confirmada</h4>
                <p className="text-sm text-muted-foreground">Tu donación de materiales de estudio ha sido confirmada y será distribuida pronto.</p>
                <p className="text-xs text-muted-foreground mt-1">Hace 1 día</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Evento Especial: Noche de Caridad</h4>
                <p className="text-sm text-muted-foreground">No te pierdas nuestro evento especial de caridad el próximo viernes.</p>
                <p className="text-xs text-muted-foreground mt-1">Hace 3 días</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
