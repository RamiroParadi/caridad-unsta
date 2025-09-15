"use client"

import { useState, useEffect } from 'react'
import { AdminStats } from '@/lib/services/admin-stats-service'

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/admin/stats')
        if (!response.ok) {
          throw new Error('Error al cargar estadísticas')
        }
        
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const refetch = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/stats')
      if (!response.ok) {
        throw new Error('Error al cargar estadísticas')
      }
      
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  return { stats, isLoading, error, refetch }
}
