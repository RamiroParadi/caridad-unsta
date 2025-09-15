import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Plus, Calendar, Users, MapPin, Clock } from "lucide-react"

export default function EventosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Eventos de Caridad</h2>
          <p className="text-muted-foreground">
            Gestiona actividades, eventos y actividades de voluntariado
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Evento
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Activos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 nuevos esta semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">
              +18 nuevos inscritos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Completados</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximos eventos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximos Eventos
          </CardTitle>
          <CardDescription>
            Eventos programados para las próximas semanas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Recolección de Alimentos</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    25 de Febrero, 2024
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    10:00 - 16:00
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Plaza San Martín
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Activo</Badge>
                <div className="text-right">
                  <p className="text-sm font-medium">15/20 participantes</p>
                  <p className="text-xs text-muted-foreground">75% completo</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Voluntariado Hospital</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    28 de Febrero, 2024
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    08:00 - 14:00
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Hospital San Roque
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Activo</Badge>
                <div className="text-right">
                  <p className="text-sm font-medium">8/15 participantes</p>
                  <p className="text-xs text-muted-foreground">53% completo</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Apoyo Escolar</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    2 de Marzo, 2024
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    16:00 - 18:00
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Centro Comunitario Norte
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Próximo</Badge>
                <div className="text-right">
                  <p className="text-sm font-medium">0/30 participantes</p>
                  <p className="text-xs text-muted-foreground">Abierto para inscripción</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipos de eventos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Eventos</CardTitle>
            <CardDescription>
              Distribución de eventos por categoría
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Recolección</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">8 eventos</p>
                  <p className="text-xs text-muted-foreground">40%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Voluntariado</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">6 eventos</p>
                  <p className="text-xs text-muted-foreground">30%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Educativo</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">4 eventos</p>
                  <p className="text-xs text-muted-foreground">20%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Otros</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">2 eventos</p>
                  <p className="text-xs text-muted-foreground">10%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eventos Recientes</CardTitle>
            <CardDescription>
              Últimos eventos completados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Campaña de Ropa de Invierno</p>
                  <p className="text-sm text-muted-foreground">15 de Febrero, 2024</p>
                  <p className="text-sm text-muted-foreground">25 participantes</p>
                </div>
                <Badge variant="secondary">Completado</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Voluntariado en Hogar de Ancianos</p>
                  <p className="text-sm text-muted-foreground">10 de Febrero, 2024</p>
                  <p className="text-sm text-muted-foreground">12 participantes</p>
                </div>
                <Badge variant="secondary">Completado</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Recolección de Juguetes</p>
                  <p className="text-sm text-muted-foreground">5 de Febrero, 2024</p>
                  <p className="text-sm text-muted-foreground">18 participantes</p>
                </div>
                <Badge variant="secondary">Completado</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
