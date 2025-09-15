"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

interface UserInfo {
  fullName: string
  email: string
  firstName: string
  lastName: string
  imageUrl: string
}

export function useUserInfo() {
  const { user, isLoaded } = useUser()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    if (isLoaded && user) {
      setUserInfo({
        fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        imageUrl: user.imageUrl
      })
    }
  }, [user, isLoaded])

  return {
    userInfo,
    isLoaded,
    isSignedIn: !!user
  }
}
