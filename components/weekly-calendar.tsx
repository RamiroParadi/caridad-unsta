"use client"

import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format, startOfWeek, addDays, isSameDay, isToday, addWeeks, subWeeks } from 'date-fns'
import { es } from 'date-fns/locale'

interface Activity {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  maxParticipants: number | null
  participantCount: number
  isActive: boolean
}

interface WeeklyCalendarProps {
  activities: Activity[]
  onActivityClick?: (activity: Activity) => void
}

export function WeeklyCalendar({ activities, onActivityClick }: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  // Generar los días de la semana (lunes a sábado)
  const weekDays = useMemo(() => {
    const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Lunes
    return Array.from({ length: 6 }, (_, i) => addDays(startOfCurrentWeek, i))
  }, [currentWeek])

  // Obtener actividades para cada día
  const getActivitiesForDay = (date: Date) => {
    return activities.filter(activity => 
      isSameDay(new Date(activity.date), date) && activity.isActive
    )
  }

  // Navegación entre semanas
  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date())
  }

  // Formatear fecha para mostrar
  const formatDayHeader = (date: Date) => {
    const dayName = format(date, 'EEEE', { locale: es })
    const dayNumber = format(date, 'd')
    const month = format(date, 'MMM', { locale: es })
    
    return {
      dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      dayNumber,
      month
    }
  }

  return (
    <div className="w-full">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentWeek, 'MMMM yyyy', { locale: es })}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={goToCurrentWeek}
            className="text-xs"
          >
            Esta semana
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid del calendario */}
      <div className="grid grid-cols-6 gap-4">
        {weekDays.map((date, index) => {
          const dayActivities = getActivitiesForDay(date)
          const { dayName, dayNumber, month } = formatDayHeader(date)
          const isCurrentDay = isToday(date)
          
          return (
            <Card 
              key={index} 
              className={`h-full ${isCurrentDay ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="text-center">
                  <div className={`text-sm font-medium ${isCurrentDay ? 'text-blue-700' : 'text-gray-600'}`}>
                    {dayName}
                  </div>
                  <div className={`text-lg font-bold ${isCurrentDay ? 'text-blue-800' : 'text-gray-900'}`}>
                    {dayNumber}
                  </div>
                  <div className="text-xs text-gray-500">
                    {month}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {dayActivities.length === 0 ? (
                    <div className="text-center text-gray-400 text-xs py-4">
                      Sin actividades
                    </div>
                  ) : (
                    dayActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 cursor-pointer hover:shadow-md transition-all duration-200"
                        onClick={() => onActivityClick?.(activity)}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-blue-600" />
                            <span className="text-xs font-medium text-blue-800 truncate">
                              {activity.title}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(activity.date), 'HH:mm')}</span>
                          </div>
                          
                          {activity.location && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{activity.location}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" />
                            <span>
                              {activity.participantCount}
                              {activity.maxParticipants ? `/${activity.maxParticipants}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
