import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reportes</h2>
        <p className="text-muted-foreground">
          Visualiza estadísticas y reportes de la plataforma
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Reportes Disponibles</CardTitle>
            <CardDescription>
              Aquí encontrarás diferentes tipos de reportes y estadísticas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Próximamente: Gráficos y reportes detallados de actividades, donaciones y participación
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
