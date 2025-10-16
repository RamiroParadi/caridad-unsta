"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { TrendingUp, Users, Heart, Calendar, Bell } from "lucide-react"

interface ChartData {
  donationsByMonth: Array<{
    month: string
    count: number
  }>
  activitiesByStatus: Array<{
    name: string
    value: number
    color: string
  }>
  userGrowth: Array<{
    month: string
    users: number
    activities: number
  }>
  donationsBySection: Array<{
    name: string
    value: number
    color: string
  }>
}

const COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6'
}

export function ChartsContainer() {
  const [chartData, setChartData] = useState<ChartData>({
    donationsByMonth: [],
    activitiesByStatus: [],
    userGrowth: [],
    donationsBySection: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChartData()
  }, [])

  const fetchChartData = async () => {
    try {
      setLoading(true)
      
      // Fetch donations by month
      const donationsResponse = await fetch('/api/admin/charts/donations-by-month')
      const donationsData = donationsResponse.ok ? await donationsResponse.json() : []
      
      // Fetch activities by status
      const activitiesResponse = await fetch('/api/admin/charts/activities-by-status')
      const activitiesData = activitiesResponse.ok ? await activitiesResponse.json() : []
      
      // Fetch user growth
      const growthResponse = await fetch('/api/admin/charts/user-growth')
      const growthData = growthResponse.ok ? await growthResponse.json() : []
      
      // Fetch donations by section
      const sectionsResponse = await fetch('/api/admin/charts/donations-by-section')
      const sectionsData = sectionsResponse.ok ? await sectionsResponse.json() : []

      setChartData({
        donationsByMonth: donationsData,
        activitiesByStatus: activitiesData,
        userGrowth: growthData,
        donationsBySection: sectionsData
      })
    } catch (error) {
      console.error('Error fetching chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Donaciones</p>
                <p className="text-2xl font-bold">
                  {chartData.donationsByMonth.reduce((sum, item) => sum + item.count, 0)}
                </p>
              </div>
              <Heart className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Actividades Activas</p>
                <p className="text-2xl font-bold">
                  {chartData.activitiesByStatus.find(item => item.name === 'Activas')?.value || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Usuarios Registrados</p>
                <p className="text-2xl font-bold">
                  {chartData.userGrowth.length > 0 ? chartData.userGrowth[chartData.userGrowth.length - 1].users : 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Notificaciones</p>
                <p className="text-2xl font-bold">
                  {chartData.activitiesByStatus.reduce((sum, item) => sum + item.value, 0)}
                </p>
              </div>
              <Bell className="h-8 w-8 text-pink-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donaciones por Mes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Donaciones por Mes
            </CardTitle>
            <CardDescription>
              Evolución de las donaciones en los últimos meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.donationsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => value.toString()} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke={COLORS.primary} 
                  fill={COLORS.primary}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Actividades por Estado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Estado de Actividades
            </CardTitle>
            <CardDescription>
              Distribución de actividades por estado actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.activitiesByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.activitiesByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Crecimiento de Usuarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Crecimiento de la Comunidad
            </CardTitle>
            <CardDescription>
              Evolución de usuarios registrados y actividades creadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke={COLORS.success} 
                  strokeWidth={2}
                  name="Usuarios"
                />
                <Line 
                  type="monotone" 
                  dataKey="activities" 
                  stroke={COLORS.info} 
                  strokeWidth={2}
                  name="Actividades"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donaciones por Sección */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Donaciones por Categoría
            </CardTitle>
            <CardDescription>
              Distribución de donaciones por tipo de sección
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.donationsBySection} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill={COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
