import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function NotificacionesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notificaciones</h2>
          <p className="text-muted-foreground">
            Gestiona las notificaciones para los usuarios
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Notificación
        </Button>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Notificaciones</CardTitle>
            <CardDescription>
              Aquí podrás crear, editar y gestionar todas las notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Próximamente: Lista de notificaciones con opciones de edición y eliminación
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
