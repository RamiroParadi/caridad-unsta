import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const user = await currentUser()
  
  if (!user) {
    redirect("/sign-in")
  }
  
  return <>{children}</>
}
