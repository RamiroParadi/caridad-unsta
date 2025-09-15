import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Plus, Filter, Search, TrendingUp } from "lucide-react"

export default function MonetariasDonationsPage() {
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
          <h2 className="text-2xl font-bold tracking-tight">Donaciones Monetarias</h2>
          <p className="text-muted-foreground">
            Gestiona las contribuciones económicas para actividades de caridad
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Donación
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Buscar donaciones..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>
            <select className="px-4 py-2 border rounded-md">
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="CONFIRMADA">Confirmada</option>
              <option value="RECHAZADA">Rechazada</option>
            </select>
            <input 
              type="date" 
              className="px-4 py-2 border rounded-md"
              placeholder="Fecha desde"
            />
            <input 
              type="date" 
              className="px-4 py-2 border rounded-md"
              placeholder="Fecha hasta"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recaudado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(125000)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15% este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donaciones</CardTitle>
            <Badge variant="secondary">Total</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              Transacciones
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Badge variant="secondary">Pendiente</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(15000)}</div>
            <p className="text-xs text-muted-foreground">
              8 transacciones
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio</CardTitle>
            <Badge variant="default">Promedio</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(2659)}</div>
            <p className="text-xs text-muted-foreground">
              Por donación
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de donaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Donaciones Monetarias</CardTitle>
          <CardDescription>
            Lista de todas las contribuciones económicas recibidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">{formatCurrency(5000)} - Apoyo Escolar</p>
                  <p className="text-sm text-muted-foreground">
                    María González • 20 de Febrero, 2024
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Transferencia bancaria • Referencia: TRF-001234
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Confirmada</Badge>
                <Button size="sm" variant="outline">
                  Ver Detalles
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <DollarSign className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">{formatCurrency(2500)} - Ropa de Invierno</p>
                  <p className="text-sm text-muted-foreground">
                    Anónimo • 18 de Febrero, 2024
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mercado Pago • ID: MP-567890
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Pendiente</Badge>
                <Button size="sm" variant="outline">
                  Ver Detalles
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <DollarSign className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium">{formatCurrency(10000)} - Actividades Generales</p>
                  <p className="text-sm text-muted-foreground">
                    Empresa Constructora Norte • 15 de Febrero, 2024
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Depósito bancario • Número: DEP-789012
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Confirmada</Badge>
                <Button size="sm" variant="outline">
                  Ver Detalles
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <DollarSign className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="font-medium">{formatCurrency(7500)} - Medicamentos</p>
                  <p className="text-sm text-muted-foreground">
                    Carlos Rodríguez • 12 de Febrero, 2024
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Transferencia bancaria • Referencia: TRF-345678
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Pendiente</Badge>
                <Button size="sm" variant="outline">
                  Ver Detalles
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
