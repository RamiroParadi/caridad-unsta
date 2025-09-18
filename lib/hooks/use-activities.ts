import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'

export interface Activity {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  maxParticipants: number | null
  participantCount: number
  isActive: boolean
  isUserRegistered?: boolean
  participants: Array<{
    id: string
    user: {
      id: string
      name: string
      email: string
    }
  }>
}

export function useActivities() {
  const { user } = useUser()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = useCallback(async (startDate?: Date, endDate?: Date) => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      let url = '/api/activities?activeOnly=true'
      
      if (startDate && endDate) {
        url += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      }

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Error al cargar actividades')
      }

      const data = await response.json()
      
      // Transformar los datos para incluir el conteo de participantes
      const transformedActivities = data.map((activity: {
        id: string
        title: string
        description?: string
        date: string
        location?: string
        maxParticipants?: number
        isActive: boolean
        participants: Array<{ id: string; user: { id: string; name: string; email: string } }>
        createdAt: string
        updatedAt: string
      }) => ({
        ...activity,
        participantCount: activity.participants?.length || 0
      }))

      setActivities(transformedActivities)
    } catch (error) {
      console.error('Error fetching activities:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [user])

  const fetchActivitiesForWeek = useCallback(async (weekStart: Date) => {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6) // Lunes a sábado (6 días)
    
    await fetchActivities(weekStart, weekEnd)
  }, [fetchActivities])

  const refreshActivities = useCallback(() => {
    fetchActivities()
  }, [fetchActivities])

  useEffect(() => {
    if (user) {
      fetchActivities()
    }
  }, [user, fetchActivities])

  return {
    activities,
    loading,
    error,
    fetchActivities,
    fetchActivitiesForWeek,
    refreshActivities
  }
}
