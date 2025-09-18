import { useState, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'

export function useActivityRegistration() {
  const { user } = useUser()
  const [registering, setRegistering] = useState(false)
  const [unregistering, setUnregistering] = useState(false)

  const registerForActivity = useCallback(async (activityId: string) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' }

    setRegistering(true)
    try {
      const response = await fetch('/api/activities/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activityId }),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, message: data.message }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Error registering for activity:', error)
      return { success: false, error: 'Error de conexión' }
    } finally {
      setRegistering(false)
    }
  }, [user])

  const unregisterFromActivity = useCallback(async (activityId: string) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' }

    setUnregistering(true)
    try {
      const response = await fetch(`/api/activities/register?activityId=${activityId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, message: data.message }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Error unregistering from activity:', error)
      return { success: false, error: 'Error de conexión' }
    } finally {
      setUnregistering(false)
    }
  }, [user])

  return {
    registerForActivity,
    unregisterFromActivity,
    registering,
    unregistering
  }
}
