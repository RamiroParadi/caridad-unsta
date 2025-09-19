"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir directamente a sign-in
    router.replace("/sign-in")
  }, [router])

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Redirigiendo al login...</p>
      </div>
    </div>
  )
}
