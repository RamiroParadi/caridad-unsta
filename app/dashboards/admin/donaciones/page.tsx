import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DonacionesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Donaciones</h2>
        <p className="text-muted-foreground">
          Revisa y gestiona las donaciones recibidas
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Donaciones por Sección</CardTitle>
            <CardDescription>
              Visualiza las donaciones organizadas por categorías
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Comida</h3>
                <p className="text-sm text-muted-foreground">Donaciones para alimentos</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$1,250</p>
                <Badge variant="secondary">15 donaciones</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Ropa</h3>
                <p className="text-sm text-muted-foreground">Donaciones de vestimenta</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$800</p>
                <Badge variant="secondary">8 donaciones</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Medicamentos</h3>
                <p className="text-sm text-muted-foreground">Donaciones médicas</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$400</p>
                <Badge variant="secondary">5 donaciones</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
