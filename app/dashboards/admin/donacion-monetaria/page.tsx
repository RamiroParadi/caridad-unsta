import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Plus, TrendingUp, TrendingDown, Users, Target } from "lucide-react"

export default function DonacionMonetariaPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Donación Monetaria</h2>
          <p className="text-muted-foreground">
            Panel especializado para gestión de donaciones monetarias y campañas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Ver Reportes
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Campaña
          </Button>
        </div>
      </div>

      {/* Resumen financiero */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recaudado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(285000)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +23% vs mes anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donantes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8 nuevos este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta del Mes</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(300000)}</div>
            <p className="text-xs text-muted-foreground">
              95% completado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Donación</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(2244)}</div>
            <p className="text-xs text-muted-foreground">
              -5% vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campañas activas */}
      <Card>
        <CardHeader>
          <CardTitle>Campañas Activas</CardTitle>
          <CardDescription>
            Campañas de recaudación en curso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Apoyo Escolar 2024</h3>
                  <Badge variant="default">Activa</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Recaudación para útiles escolares y materiales educativos
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(78000)} / {formatCurrency(100000)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Ropa de Invierno</h3>
                  <Badge variant="default">Activa</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Campaña para abrigos y ropa de invierno para familias necesitadas
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(65000)} / {formatCurrency(100000)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Medicamentos Especiales</h3>
                  <Badge variant="secondary">Finalizada</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Recaudación para medicamentos de alto costo
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(150000)} / {formatCurrency(150000)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métodos de pago */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pago</CardTitle>
            <CardDescription>
              Distribución de donaciones por método de pago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Transferencia Bancaria</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(180000)}</p>
                  <p className="text-xs text-muted-foreground">63%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Mercado Pago</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(75000)}</p>
                  <p className="text-xs text-muted-foreground">26%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Depósito Bancario</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(30000)}</p>
                  <p className="text-xs text-muted-foreground">11%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Donantes</CardTitle>
            <CardDescription>
              Principales contribuyentes del mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Empresa Constructora Norte</p>
                  <p className="text-sm text-muted-foreground">Empresa</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{formatCurrency(25000)}</p>
                  <p className="text-xs text-muted-foreground">8.8%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">María González</p>
                  <p className="text-sm text-muted-foreground">Individual</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{formatCurrency(15000)}</p>
                  <p className="text-xs text-muted-foreground">5.3%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cooperativa Escolar</p>
                  <p className="text-sm text-muted-foreground">Organización</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{formatCurrency(12000)}</p>
                  <p className="text-xs text-muted-foreground">4.2%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
