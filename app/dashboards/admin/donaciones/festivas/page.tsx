import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gift, Plus, Filter, Search, Calendar } from "lucide-react"

export default function FestivasDonationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Donaciones Festivas</h2>
          <p className="text-muted-foreground">
            Gestiona juguetes, regalos y donaciones para fechas especiales
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Donación
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
                  placeholder="Buscar donaciones festivas..."
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
            <select className="px-4 py-2 border rounded-md">
              <option value="">Todas las ocasiones</option>
              <option value="NAVIDAD">Navidad</option>
              <option value="REYES">Día de Reyes</option>
              <option value="CUMPLEANOS">Cumpleaños</option>
              <option value="DIA_NINO">Día del Niño</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donaciones</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +12 esta semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Juguetes</CardTitle>
            <Badge variant="secondary">Juguetes</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              Para niños
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regalos</CardTitle>
            <Badge variant="default">Regalos</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">
              Varios
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Badge variant="outline">Pendiente</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Por revisar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximas fechas especiales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximas Fechas Especiales
          </CardTitle>
          <CardDescription>
            Fechas importantes para planificar donaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Día del Niño</p>
                <p className="text-sm text-muted-foreground">18 de Agosto, 2024</p>
                <p className="text-sm text-muted-foreground">Donaciones: 23 juguetes</p>
              </div>
              <Badge variant="default">Activo</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Día de Reyes</p>
                <p className="text-sm text-muted-foreground">6 de Enero, 2024</p>
                <p className="text-sm text-muted-foreground">Donaciones: 45 regalos</p>
              </div>
              <Badge variant="secondary">Completado</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de donaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Donaciones Festivas</CardTitle>
          <CardDescription>
            Lista de todas las donaciones para fechas especiales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Gift className="h-8 w-8 text-red-500" />
                <div>
                  <p className="font-medium">Juguetes para Navidad</p>
                  <p className="text-sm text-muted-foreground">
                    Familia Martínez • 20 de Febrero, 2024
                  </p>
                  <p className="text-sm text-muted-foreground">
                    15 juguetes • Edades: 3-8 años • Estado: Nuevos
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
                <Gift className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Regalos para Cumpleaños</p>
                  <p className="text-sm text-muted-foreground">
                    Ana González • 18 de Febrero, 2024
                  </p>
                  <p className="text-sm text-muted-foreground">
                    8 regalos • Varios • Estado: Bueno
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
                <Gift className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Juguetes Educativos</p>
                  <p className="text-sm text-muted-foreground">
                    Escuela Primaria Norte • 15 de Febrero, 2024
                  </p>
                  <p className="text-sm text-muted-foreground">
                    25 juguetes • Educativos • Estado: Nuevos
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
                <Gift className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium">Regalos para Día del Niño</p>
                  <p className="text-sm text-muted-foreground">
                    Carlos López • 12 de Febrero, 2024
                  </p>
                  <p className="text-sm text-muted-foreground">
                    12 regalos • Varios • Estado: Bueno
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
