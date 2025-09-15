import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Configura los ajustes de la plataforma
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Configuración General</CardTitle>
            <CardDescription>
              Ajustes generales de la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Próximamente: Configuración de secciones de donación, ajustes de notificaciones y más
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
